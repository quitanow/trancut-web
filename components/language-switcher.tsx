"use client";

import { type Locale, localeLabels } from "@/lib/i18n";
import { useLocale } from "@/components/locale-provider";

const locales: Locale[] = ["en", "zh-TW", "zh-CN"];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center text-xs border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-6 py-1.5 justify-center gap-1">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-zinc-300 dark:text-zinc-600 select-none">｜</span>}
          <button
            onClick={() => setLocale(l)}
            className={`px-1 py-0.5 rounded transition-colors ${
              locale === l
                ? "text-zinc-900 dark:text-white font-medium"
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {localeLabels[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
