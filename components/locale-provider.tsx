"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Locale, type Translations, translations } from "@/lib/i18n";

const STORAGE_KEY = "trancut-locale";
const DEFAULT_LOCALE: Locale = "en";

function detectLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved && saved in translations) return saved;
  const lang = navigator.language; // e.g. "zh-TW", "zh-HK", "zh-CN", "fr-FR"
  const base = lang.split("-")[0].toLowerCase();
  // Chinese variants
  if (lang === "zh-TW" || lang === "zh-HK") return "zh-TW";
  if (base === "zh") return "zh-CN";
  // Map base language codes to supported locales
  const map: Record<string, Locale> = {
    ja: "ja", ko: "ko",
    es: "es", fr: "fr", de: "de", pt: "pt",
    ar: "ar", ru: "ru", hi: "hi",
    it: "it", nl: "nl", tr: "tr",
    vi: "vi", th: "th", id: "id", ms: "id",
    pl: "pl",
  };
  return map[base] ?? "en";
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: translations[DEFAULT_LOCALE],
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
