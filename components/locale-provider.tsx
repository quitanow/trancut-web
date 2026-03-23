"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Locale, type Translations, translations } from "@/lib/i18n";

const STORAGE_KEY = "trancut-locale";
const DEFAULT_LOCALE: Locale = "en";

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
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && saved in translations) setLocaleState(saved);
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
