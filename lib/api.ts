const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function authFetch(path: string, token: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

// ── Upload ────────────────────────────────────────────────────────────────────

export async function getPresignedUrl(
  token: string,
  filename: string,
  contentType: string
): Promise<{ upload_url: string; r2_key: string }> {
  return authFetch("/upload/presign", token, {
    method: "POST",
    body: JSON.stringify({ filename, content_type: contentType }),
  });
}

export async function uploadToR2(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!res.ok) throw new Error("Upload to storage failed");
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export type JobStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

export interface Job {
  id: string;
  status: JobStatus;
  original_filename: string;
  duration_seconds: number | null;
  source_language: string;
  target_language: string;
  rewrite_style: string;
  rewrite_description: string | null;
  srt_en_url: string | null;
  srt_zh_url: string | null;
  srt_bilingual_url: string | null;
  video_dubbed_url: string | null;
  progress_stage: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export async function createJob(
  token: string,
  r2Key: string,
  originalFilename: string,
  durationSeconds: number,
  rewriteStyle = "none",
  rewriteDescription = "",
  sourceLanguage = "auto",
  targetLanguage = "zh-TW"
): Promise<Job> {
  return authFetch("/jobs", token, {
    method: "POST",
    body: JSON.stringify({
      r2_key: r2Key,
      original_filename: originalFilename,
      duration_seconds: durationSeconds,
      source_language: sourceLanguage,
      target_language: targetLanguage,
      rewrite_style: rewriteStyle,
      rewrite_description: rewriteDescription,
    }),
  });
}

export async function getJob(token: string, jobId: string): Promise<Job> {
  return authFetch(`/jobs/${jobId}`, token);
}

export async function cancelJob(token: string, jobId: string): Promise<Job> {
  return authFetch(`/jobs/${jobId}/cancel`, token, { method: "POST" });
}

export async function listJobs(token: string): Promise<Job[]> {
  return authFetch("/jobs", token);
}

// ── User ──────────────────────────────────────────────────────────────────────

export interface Me {
  tier: string;
  max_duration_seconds: number;
  jobs_this_month: number;
}

export async function getMe(token: string): Promise<Me> {
  return authFetch("/me", token);
}
