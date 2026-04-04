"use client";

import UploadZone from "@/components/upload-zone";
import { useLocale } from "@/components/locale-provider";

export default function UploadPage() {
  const { t } = useLocale();
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
        {t.upload.title}
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        {t.upload.subtitle}
      </p>
      <UploadZone />
    </div>
  );
}
