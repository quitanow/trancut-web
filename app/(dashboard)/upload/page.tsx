import UploadZone from "@/components/upload-zone";

export default function UploadPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
        New transcription
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        Upload a video to get English + Traditional Chinese subtitles.
      </p>
      <UploadZone />
    </div>
  );
}
