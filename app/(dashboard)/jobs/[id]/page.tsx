"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { getJob, cancelJob, listJobs, type Job } from "@/lib/api";
import { Download, CheckCircle, XCircle, Loader2, ArrowLeft, Ban } from "lucide-react";

const POLL_INTERVAL_MS = 3000;

const STYLE_LABELS: Record<string, string> = {
  none:         "直接翻譯",
  documentary:  "紀錄片旁白",
  vivid:        "生動口語",
  concise:      "精簡版",
  social:       "社群短影音",
};

export default function JobResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [previousJob, setPreviousJob] = useState<Job | null>(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

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

    async function fetchPreviousJob() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      try {
        const jobs = await listJobs(session.access_token);
        const currentIndex = jobs.findIndex((j) => j.id === id);
        if (currentIndex !== -1 && currentIndex + 1 < jobs.length) {
          setPreviousJob(jobs[currentIndex + 1]);
        }
      } catch {
        // non-critical, ignore
      }
    }

    fetchJob();
    fetchPreviousJob();
    return () => clearTimeout(timer);
  }, [id]);

  async function handleCancel() {
    setCancelling(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const updated = await cancelJob(session.access_token, id);
      setJob(updated);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCancelling(false);
    }
  }

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

      {previousJob && (
        <div className="mb-4 px-1">
          <p className="text-xs text-zinc-400">
            Previous job:{" "}
            <Link
              href={`/jobs/${previousJob.id}`}
              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              {previousJob.original_filename}
            </Link>
            {" — "}
            <span className={
              previousJob.status === "completed" ? "text-green-500" :
              previousJob.status === "failed" ? "text-red-500" :
              previousJob.status === "cancelled" ? "text-zinc-400" :
              "text-blue-400"
            }>
              {previousJob.status}
            </span>
          </p>
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
              <p className="text-xs text-zinc-400 mt-1">
                風格：{STYLE_LABELS[job.rewrite_style] ?? job.rewrite_style}
              </p>
            </div>
            <StatusBadge status={job.status} />
          </div>

          {(job.status === "pending" || job.status === "processing") && (
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-5 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin shrink-0 text-blue-500" />
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {job.status === "pending" ? "Waiting in queue…" : stageLabel(job.progress_stage)}
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                >
                  <Ban size={13} />
                  {cancelling ? "Cancelling…" : "Cancel"}
                </button>
              </div>

              {job.status === "processing" && (
                <ProgressSteps stage={job.progress_stage} />
              )}

              <p className="text-xs text-zinc-400">
                {job.status === "pending"
                  ? "Your job will start shortly."
                  : estimatedTime(job.duration_seconds, job.progress_stage)}
              </p>
            </div>
          )}

          {job.status === "cancelled" && (
            <div className="flex items-start gap-3 text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-5 py-4">
              <Ban size={16} className="mt-0.5 shrink-0" />
              <p className="font-medium">Job cancelled.</p>
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

const STAGES = [
  { key: "downloading",  label: "Downloading video" },
  { key: "transcribing", label: "Transcribing audio" },
  { key: "translating",  label: "Translating to Chinese" },
  { key: "rewriting",    label: "Applying style" },
  { key: "building",     label: "Building subtitles" },
  { key: "dubbing",      label: "Generating dubbed audio" },
  { key: "uploading",    label: "Uploading files" },
];

function stageLabel(stage: string | null | undefined): string {
  return STAGES.find((s) => s.key === stage)?.label ?? "Processing…";
}

function estimatedTime(durationSeconds: number | null, stage: string | null | undefined): string {
  if (!durationSeconds) return "This page updates automatically.";
  const totalMin = durationSeconds / 60;
  // rough estimate: ~25s per minute of video for small model on 8 vCPU
  const estimatedSec = Math.round(totalMin * 25);
  const estimatedMin = Math.ceil(estimatedSec / 60);
  if (stage === "transcribing") {
    return `Transcription takes the longest — roughly ${estimatedMin} min total for a ${Math.round(totalMin)}-min video.`;
  }
  if (stage === "translating" || stage === "rewriting" || stage === "building" || stage === "uploading") {
    return "Almost done — translation and upload are fast.";
  }
  return `Estimated ~${estimatedMin} min total. This page updates automatically.`;
}

function ProgressSteps({ stage }: { stage: string | null | undefined }) {
  const currentIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="space-y-1.5">
      {STAGES.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={s.key} className="flex items-center gap-2.5">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              done ? "bg-green-500" : active ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"
            }`} />
            <span className={`text-xs ${
              done ? "text-zinc-400 line-through" :
              active ? "text-zinc-700 dark:text-zinc-200 font-medium" :
              "text-zinc-400"
            }`}>
              {s.label}
              {active && <span className="ml-1 text-blue-500">←</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: Job["status"] }) {
  const styles: Record<Job["status"], string> = {
    pending: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
    processing: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    completed: "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400",
    failed: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
    cancelled: "bg-zinc-100 dark:bg-zinc-800 text-zinc-400",
  };
  const icons: Record<Job["status"], React.ReactNode> = {
    pending: <Loader2 size={12} />,
    processing: <Loader2 size={12} className="animate-spin" />,
    completed: <CheckCircle size={12} />,
    failed: <XCircle size={12} />,
    cancelled: <Ban size={12} />,
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
