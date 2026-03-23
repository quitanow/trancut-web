"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { getPresignedUrl, uploadToR2, createJob } from "@/lib/api";
import { Upload, Film, AlertCircle } from "lucide-react";

const ACCEPTED = ["video/mp4", "video/quicktime", "video/x-m4v"];
const FREE_MAX_SECONDS = 120;

type Stage =
  | { type: "idle" }
  | { type: "checking"; file: File }
  | { type: "uploading"; file: File; progress: number }
  | { type: "queued"; jobId: string }
  | { type: "error"; message: string };

export default function UploadZone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>({ type: "idle" });
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      setStage({ type: "error", message: "Only MP4, MOV, or M4V files are supported." });
      return;
    }

    setStage({ type: "checking", file });

    // Measure duration client-side before uploading (best-effort)
    let duration = 0;
    try {
      duration = await getVideoDuration(file);
    } catch {
      // Can't read metadata (unusual codec etc.) — let backend enforce limits
    }
    if (duration > 0 && duration > FREE_MAX_SECONDS) {
      setStage({
        type: "error",
        message: `Video is ${Math.round(duration)}s — free plan supports up to ${FREE_MAX_SECONDS}s (2 min).`,
      });
      return;
    }

    // Get auth token
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    const token = session.access_token;

    try {
      // 1. Get presigned upload URL
      const { upload_url, r2_key } = await getPresignedUrl(token, file.name, file.type);

      // 2. Upload directly to R2 (with progress)
      setStage({ type: "uploading", file, progress: 0 });
      await uploadToR2WithProgress(upload_url, file, (p) =>
        setStage({ type: "uploading", file, progress: p })
      );

      // 3. Create job
      const job = await createJob(token, r2_key, file.name, Math.round(duration));
      setStage({ type: "queued", jobId: job.id });

      // Redirect to job result page
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      setStage({ type: "error", message: (err as Error).message });
    }
  }, [router]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  if (stage.type === "uploading" || stage.type === "checking" || stage.type === "queued") {
    return (
      <div className="border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl p-12 text-center bg-white dark:bg-zinc-900">
        <Film size={32} className="mx-auto mb-4 text-zinc-400" />
        <p className="font-medium text-zinc-700 dark:text-zinc-200 mb-1">
          {stage.type === "checking" && `Checking ${stage.file.name}…`}
          {stage.type === "uploading" && `Uploading… ${stage.progress}%`}
          {stage.type === "queued" && "Job queued — redirecting…"}
        </p>
        {stage.type === "uploading" && (
          <div className="mt-4 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${stage.progress}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-900"
        }`}
      >
        <Upload size={32} className="mx-auto mb-4 text-zinc-400" />
        <p className="font-medium text-zinc-700 dark:text-zinc-200 mb-1">
          Drop your video here
        </p>
        <p className="text-sm text-zinc-400">or click to browse · MP4, MOV, M4V</p>
        <p className="text-xs text-zinc-400 mt-3">Free plan: up to 2 min</p>
      </div>

      {stage.type === "error" && (
        <div className="mt-4 flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{stage.message}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/x-m4v"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => reject(new Error("Could not read video duration."));
    video.src = url;
  });
}

async function uploadToR2WithProgress(
  url: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(file);
  });
}
