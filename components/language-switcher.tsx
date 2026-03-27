"use client";

import { type Locale, localeLabels } from "@/lib/i18n";
import { useLocale } from "@/components/locale-provider";

const locales: Locale[] = ["en", "zh-TW", "zh-CN"];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-6 py-1.5">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="text-xs text-zinc-500 dark:text-zinc-400 bg-transparent border-none outline-none cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
      >
        {locales.map((l) => (
          <option key={l} value={l}>{localeLabels[l]}</option>
        ))}
      </select>
    </div>
  );
}
