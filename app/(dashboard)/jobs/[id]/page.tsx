"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { getJob, type Job } from "@/lib/api";
import { Download, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";

const POLL_INTERVAL_MS = 3000;

export default function JobResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    async function fetchJob() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        const data = await getJob(session.access_token, id);
        setJob(data);
        if (data.status === "pending" || data.status === "processing") {
          timer = setTimeout(fetchJob, POLL_INTERVAL_MS);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchJob();
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> All jobs
      </Link>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!job && !error && (
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 size={16} className="animate-spin" />
          Loading…
        </div>
      )}

      {job && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-zinc-400 mb-1">
                {new Date(job.created_at).toLocaleString()}
              </p>
              <h2 className="font-semibold text-zinc-900 dark:text-white text-lg">
                {job.original_filename}
              </h2>
              {job.duration_seconds && (
                <p className="text-sm text-zinc-400 mt-0.5">
                  {Math.floor(job.duration_seconds / 60)}m {job.duration_seconds % 60}s
                </p>
              )}
            </div>
            <StatusBadge status={job.status} />
          </div>

          {(job.status === "pending" || job.status === "processing") && (
            <div className="flex items-center gap-3 text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-5 py-4">
              <Loader2 size={16} className="animate-spin shrink-0" />
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-200">
                  {job.status === "pending" ? "Waiting in queue…" : "Transcribing and translating…"}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">This page updates automatically</p>
              </div>
            </div>
          )}

          {job.status === "completed" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">
                Your subtitle files are ready:
              </p>
              {job.video_dubbed_url && (
                <DownloadButton
                  label="Dubbed Video (中文配音)"
                  description="MP4 with Traditional Chinese voiceover"
                  url={job.video_dubbed_url}
                />
              )}
              <DownloadButton
                label="Bilingual SRT (EN + 中文)"
                description="Best for publishing — both languages stacked"
                url={job.srt_bilingual_url}
              />
              <DownloadButton
                label="Chinese SRT only (中文字幕)"
                description="Traditional Chinese translation"
                url={job.srt_zh_url}
              />
              <DownloadButton
                label="English SRT only"
                description="Original transcription"
                url={job.srt_en_url}
              />
            </div>
          )}

          {job.status === "failed" && (
            <div className="flex items-start gap-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl px-5 py-4">
              <XCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Processing failed</p>
                {job.error_message && (
                  <p className="text-xs mt-1 opacity-80">{job.error_message}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Job["status"] }) {
  const styles: Record<Job["status"], string> = {
    pending: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
    processing: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    completed: "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400",
    failed: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
  };
  const icons: Record<Job["status"], React.ReactNode> = {
    pending: <Loader2 size={12} />,
    processing: <Loader2 size={12} className="animate-spin" />,
    completed: <CheckCircle size={12} />,
    failed: <XCircle size={12} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
}

function DownloadButton({
  label,
  description,
  url,
}: {
  label: string;
  description: string;
  url: string | null;
}) {
  if (!url) return null;
  return (
    <a
      href={url}
      download
      className="flex items-center justify-between w-full px-5 py-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
    >
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-white">{label}</p>
        <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
      </div>
      <Download
        size={16}
        className="text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors"
      />
    </a>
  );
}
