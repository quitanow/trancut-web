"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { getPresignedUrl, uploadToR2, createJob, getMe } from "@/lib/api";
import { Upload, Film, AlertCircle } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { uploadZoneTranslations } from "@/lib/i18n";

const ACCEPTED = ["video/mp4", "video/quicktime", "video/x-m4v"];
const FREE_MAX_SECONDS = 120;
const PRO_MAX_SECONDS = 1200;

const SOURCE_LANGUAGES_BASE = [
  { value: "auto", label: "__auto__" },
  { value: "zh",   label: "中文" },
  { value: "en",   label: "English" },
  { value: "ja",   label: "日本語" },
  { value: "ko",   label: "한국어" },
  { value: "es",   label: "Español" },
  { value: "fr",   label: "Français" },
  { value: "de",   label: "Deutsch" },
  { value: "pt",   label: "Português" },
  { value: "ar",   label: "العربية" },
  { value: "ru",   label: "Русский" },
  { value: "hi",   label: "हिन्दी" },
  { value: "it",   label: "Italiano" },
  { value: "nl",   label: "Nederlands" },
  { value: "pl",   label: "Polski" },
  { value: "sv",   label: "Svenska" },
  { value: "tr",   label: "Türkçe" },
  { value: "vi",   label: "Tiếng Việt" },
  { value: "th",   label: "ภาษาไทย" },
  { value: "id",   label: "Bahasa Indonesia" },
  { value: "ms",   label: "Bahasa Melayu" },
  { value: "uk",   label: "Українська" },
  { value: "cs",   label: "Čeština" },
  { value: "ro",   label: "Română" },
  { value: "da",   label: "Dansk" },
  { value: "fi",   label: "Suomi" },
  { value: "hu",   label: "Magyar" },
  { value: "el",   label: "Ελληνικά" },
  { value: "he",   label: "עברית" },
  { value: "fa",   label: "فارسی" },
  { value: "ur",   label: "اردو" },
  { value: "ta",   label: "தமிழ்" },
  { value: "af",   label: "Afrikaans" },
  { value: "bg",   label: "Български" },
  { value: "hr",   label: "Hrvatski" },
  { value: "sk",   label: "Slovenčina" },
  { value: "sl",   label: "Slovenščina" },
  { value: "sr",   label: "Српски" },
  { value: "no",   label: "Norsk" },
  { value: "ca",   label: "Català" },
  { value: "et",   label: "Eesti" },
  { value: "lv",   label: "Latviešu" },
  { value: "lt",   label: "Lietuvių" },
  { value: "mk",   label: "Македонски" },
  { value: "bs",   label: "Bosanski" },
  { value: "be",   label: "Беларуская" },
  { value: "az",   label: "Azərbaycan" },
  { value: "hy",   label: "Հայերեն" },
  { value: "kk",   label: "Қазақша" },
  { value: "is",   label: "Íslenska" },
  { value: "ne",   label: "नेपाली" },
  { value: "mr",   label: "मराठी" },
  { value: "kn",   label: "ಕನ್ನಡ" },
  { value: "sw",   label: "Kiswahili" },
  { value: "tl",   label: "Filipino" },
  { value: "mi",   label: "Māori" },
  { value: "cy",   label: "Cymraeg" },
  { value: "gl",   label: "Galego" },
];

const TARGET_LANGUAGES = [
  { value: "zh-TW", label: "繁體中文" },
  { value: "zh-CN", label: "简体中文" },
  { value: "en",    label: "English" },
  { value: "ja",    label: "日本語" },
  { value: "ko",    label: "한국어" },
  { value: "es",    label: "Español" },
  { value: "fr",    label: "Français" },
  { value: "de",    label: "Deutsch" },
  { value: "pt",    label: "Português" },
  { value: "ar",    label: "العربية" },
  { value: "ru",    label: "Русский" },
  { value: "hi",    label: "हिन्दी" },
  { value: "it",    label: "Italiano" },
  { value: "nl",    label: "Nederlands" },
  { value: "pl",    label: "Polski" },
  { value: "sv",    label: "Svenska" },
  { value: "tr",    label: "Türkçe" },
  { value: "vi",    label: "Tiếng Việt" },
  { value: "th",    label: "ภาษาไทย" },
  { value: "id",    label: "Bahasa Indonesia" },
  { value: "ms",    label: "Bahasa Melayu" },
  { value: "uk",    label: "Українська" },
  { value: "cs",    label: "Čeština" },
  { value: "ro",    label: "Română" },
  { value: "da",    label: "Dansk" },
  { value: "fi",    label: "Suomi" },
  { value: "hu",    label: "Magyar" },
  { value: "el",    label: "Ελληνικά" },
  { value: "he",    label: "עברית" },
  { value: "fa",    label: "فارسی" },
  { value: "ur",    label: "اردو" },
  { value: "ta",    label: "தமிழ்" },
  { value: "af",    label: "Afrikaans" },
  { value: "bg",    label: "Български" },
  { value: "hr",    label: "Hrvatski" },
  { value: "sk",    label: "Slovenčina" },
  { value: "sl",    label: "Slovenščina" },
  { value: "sr",    label: "Српски" },
  { value: "no",    label: "Norsk" },
  { value: "ca",    label: "Català" },
  { value: "et",    label: "Eesti" },
  { value: "lv",    label: "Latviešu" },
  { value: "lt",    label: "Lietuvių" },
  { value: "mk",    label: "Македонски" },
  { value: "bs",    label: "Bosanski" },
  { value: "be",    label: "Беларуская" },
  { value: "az",    label: "Azərbaycan" },
  { value: "hy",    label: "Հայերեն" },
  { value: "kk",    label: "Қазақша" },
  { value: "is",    label: "Íslenska" },
  { value: "ne",    label: "नेपाली" },
  { value: "mr",    label: "मराठी" },
  { value: "kn",    label: "ಕನ್ನಡ" },
  { value: "sw",    label: "Kiswahili" },
  { value: "tl",    label: "Filipino" },
  { value: "mi",    label: "Māori" },
  { value: "cy",    label: "Cymraeg" },
  { value: "gl",    label: "Galego" },
];

type SourceLanguage = string;
type TargetLanguage = string;

type Stage =
  | { type: "idle" }
  | { type: "checking"; file: File }
  | { type: "uploading"; file: File; progress: number }
  | { type: "queued"; jobId: string }
  | { type: "error"; message: string };

const SUBTITLE_MODE_VALUES = ["", "source", "target"] as const;
const TTS_VOICE_VALUES = ["", "shimmer", "onyx", "alloy", "coral", "fable", "nova"] as const;
const REWRITE_STYLE_VALUES = ["none", "documentary", "social", "concise", "vivid"] as const;

type RewriteStyle = typeof REWRITE_STYLE_VALUES[number];

export default function UploadZone() {
  const router = useRouter();
  const { locale } = useLocale();
  const uz = uploadZoneTranslations[locale];
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>({ type: "idle" });
  const [dragging, setDragging] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState<SourceLanguage>("auto");
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>("zh-TW");
  const [rewriteStyle, setRewriteStyle] = useState<RewriteStyle>("none");
  const [rewriteDescription, setRewriteDescription] = useState("");
  const [rewritePercentage, setRewritePercentage] = useState<"20" | "40" | "60">("40");
  const [ttsVoice, setTtsVoice] = useState("");
  const [subtitleMode, setSubtitleMode] = useState("");

  const SOURCE_LANGUAGES = SOURCE_LANGUAGES_BASE.map((l) =>
    l.value === "auto" ? { ...l, label: uz.autoDetect } : l
  );
  const SUBTITLE_MODES = SUBTITLE_MODE_VALUES.map((v, i) => ({ value: v, ...uz.subtitleModes[i] }));
  const TTS_VOICES = TTS_VOICE_VALUES.map((v, i) => ({ value: v, ...uz.voices[i] }));
  const REWRITE_STYLES = REWRITE_STYLE_VALUES.map((v, i) => ({ value: v, ...uz.styles[i] }));
  const REWRITE_STYLES_ROW1 = REWRITE_STYLES.slice(0, 3);
  const REWRITE_STYLES_ROW2 = REWRITE_STYLES.slice(3);

  const processFile = useCallback(async (file: File, style: RewriteStyle = rewriteStyle, voice: string = ttsVoice, subtitle: string = subtitleMode) => {
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
      // Can't read metadata — let backend enforce limits
    }

    // Get auth token
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    const token = session.access_token;

    // Fetch the user's actual plan limit, then enforce client-side
    try {
      const me = await getMe(token);
      const limit = me.max_duration_seconds;
      if (duration > 0 && duration > limit) {
        const limitMin = limit / 60;
        const planLabel = limit > FREE_MAX_SECONDS ? "Pro" : "free";
        setStage({
          type: "error",
          message: `Video is ${Math.round(duration)}s — ${planLabel} plan supports up to ${limit}s (${limitMin} min).`,
        });
        return;
      }
    } catch {
      // /me unavailable — skip client-side check, let backend enforce
    }

    try {
      // 1. Get presigned upload URL
      let upload_url: string, r2_key: string;
      try {
        ({ upload_url, r2_key } = await getPresignedUrl(token, file.name, file.type));
      } catch (err) {
        setStage({ type: "error", message: `Presign failed: ${(err as Error).message}` });
        return;
      }

      // 2. Upload directly to R2 (with progress)
      setStage({ type: "uploading", file, progress: 0 });
      try {
        await uploadToR2WithProgress(upload_url, file, (p) =>
          setStage({ type: "uploading", file, progress: p })
        );
      } catch (err) {
        setStage({ type: "error", message: `R2 upload failed: ${(err as Error).message}` });
        return;
      }

      // 3. Create job
      const needsPct = style === "vivid" || style === "concise";
      const effectiveDesc = needsPct
        ? `pct:${rewritePercentage}` + (rewriteDescription ? `\n${rewriteDescription}` : "")
        : rewriteDescription;
      const job = await createJob(token, r2_key, file.name, Math.round(duration), style, effectiveDesc, sourceLanguage, targetLanguage, voice || null, subtitle || null);
      setStage({ type: "queued", jobId: job.id });

      // Redirect to job result page
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      setStage({ type: "error", message: (err as Error).message });
    }
  }, [router, sourceLanguage, targetLanguage, rewriteStyle, rewriteDescription, rewritePercentage, ttsVoice, subtitleMode]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file, rewriteStyle, ttsVoice, subtitleMode);
  }

  const busy = stage.type === "uploading" || stage.type === "checking" || stage.type === "queued";

  return (
    <div>
      {/* Language selector */}
      <div className={`mb-5 flex items-center gap-3 ${busy ? "pointer-events-none opacity-60" : ""}`}>
        <div className="flex-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide block mb-1.5">
            {uz.sourceLang}
          </label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value as SourceLanguage)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
          >
            {SOURCE_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <div className="text-zinc-400 mt-5">→</div>
        <div className="flex-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide block mb-1.5">
            {uz.targetLang}
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value as TargetLanguage)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
          >
            {TARGET_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Style selector — always visible */}
      <div className="mb-5">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
          {uz.style}
        </p>
        {/* Row 1: 直接翻譯 · 紀錄片旁白 · 社群短影音 */}
        <div className={`grid grid-cols-3 gap-2 ${busy ? "pointer-events-none opacity-60" : ""}`}>
          {REWRITE_STYLES_ROW1.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setRewriteStyle(s.value)}
              className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                rewriteStyle === s.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                  : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              <span className="font-medium block">{s.label}</span>
              <span className="text-xs opacity-60 mt-0.5 block">{s.desc}</span>
            </button>
          ))}
        </div>

        {/* Row 2: 精簡版 · 生動口語 — centered under row 1 */}
        <div className={`grid grid-cols-6 gap-2 mt-2 ${busy ? "pointer-events-none opacity-60" : ""}`}>
          <div className="col-span-1" />
          {REWRITE_STYLES_ROW2.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setRewriteStyle(s.value)}
              className={`col-span-2 text-left px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                rewriteStyle === s.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                  : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              <span className="font-medium block">{s.label}</span>
              <span className="text-xs opacity-60 mt-0.5 block">{s.desc}</span>
            </button>
          ))}
          <div className="col-span-1" />
        </div>

        {/* Percentage selector — centered, shown for 精簡版 / 生動口語 */}
        {(rewriteStyle === "vivid" || rewriteStyle === "concise") && (
          <div className={`mt-2.5 flex items-center justify-center gap-2 ${busy ? "pointer-events-none opacity-60" : ""}`}>
            <span className="text-xs text-zinc-400">
              {rewriteStyle === "vivid" ? uz.expandPct : uz.trimPct}：
            </span>
            {(["20", "40", "60"] as const).map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setRewritePercentage(pct)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  rewritePercentage === pct
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        )}

        <textarea
          value={rewriteDescription}
          onChange={(e) => setRewriteDescription(e.target.value)}
          disabled={busy}
          placeholder={uz.rewritePlaceholder}
          rows={2}
          className="mt-3 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors disabled:opacity-60"
        />
      </div>

      {/* Subtitle mode selector */}
      <div className={`mb-5 ${busy ? "pointer-events-none opacity-60" : ""}`}>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
          {uz.subtitle}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {SUBTITLE_MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setSubtitleMode(m.value)}
              className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                subtitleMode === m.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                  : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              <span className="font-medium block">{m.label}</span>
              <span className="text-xs opacity-60 mt-0.5 block">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice selector */}
      <div className={`mb-5 ${busy ? "pointer-events-none opacity-60" : ""}`}>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
          {uz.voice}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
          {TTS_VOICES.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setTtsVoice(v.value)}
              className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                ttsVoice === v.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                  : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              <span className="font-medium block">{v.label}</span>
              <span className="text-xs opacity-60 mt-0.5 block">{v.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone or progress */}
      {busy ? (
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
      ) : (
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
            {uz.dropTitle}
          </p>
          <p className="text-sm text-zinc-400">{uz.dropSubtitle}</p>
          <p className="text-xs text-zinc-400 mt-3">{uz.dropNote}</p>
        </div>
      )}

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
          if (file) processFile(file, rewriteStyle, ttsVoice, subtitleMode);
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
