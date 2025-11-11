import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { LANG_NAMES, Lang, translations } from "./translations";

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  LANG_NAMES: typeof LANG_NAMES;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "lang";

function resolveInitialLang(): Lang {
  const stored = (typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY)) as Lang | null;
  if (stored && ["en", "it", "de", "fr"].includes(stored)) return stored;
  const nav = typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";
  if (["en", "it", "de", "fr"].includes(nav)) return nav as Lang;
  return "en";
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(resolveInitialLang());
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>) => {
      const dict = translations[lang] || translations.en;
      let s = dict[key] || translations.en[key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          s = s.replaceAll(`{${k}}`, String(v));
        });
      }
      return s;
    };
  }, [lang]);

  const value: I18nContextValue = useMemo(() => ({ lang, setLang, t, LANG_NAMES }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
