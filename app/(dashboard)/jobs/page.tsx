"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { listJobs, type Job } from "@/lib/api";
import { CheckCircle, XCircle, Loader2, Film, Plus, Ban } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const data = await listJobs(session.access_token);
      setJobs(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-400">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">History</h1>
        <Link
          href="/upload"
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus size={14} /> New video
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <Film size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No jobs yet</p>
          <Link href="/upload" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Upload your first video →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center justify-between px-5 py-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                  {job.original_filename}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {new Date(job.created_at).toLocaleString()}
                  {job.duration_seconds && ` · ${Math.floor(job.duration_seconds / 60)}m ${job.duration_seconds % 60}s`}
                </p>
              </div>
              <StatusIcon status={job.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: Job["status"] }) {
  const map: Record<Job["status"], { icon: React.ReactNode; label: string; color: string }> = {
    completed:  { icon: <CheckCircle size={14} />, label: "Done",        color: "text-green-500" },
    failed:     { icon: <XCircle size={14} />,     label: "Failed",      color: "text-red-500" },
    cancelled:  { icon: <Ban size={14} />,          label: "Cancelled",   color: "text-zinc-400" },
    processing: { icon: <Loader2 size={14} className="animate-spin" />, label: "Processing", color: "text-blue-400" },
    pending:    { icon: <Loader2 size={14} className="animate-spin" />, label: "Pending",    color: "text-zinc-400" },
  };
  const { icon, label, color } = map[status] ?? map.pending;
  return (
    <span className={`shrink-0 ml-4 flex items-center gap-1.5 text-xs font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
}
