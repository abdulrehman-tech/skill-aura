import { createContext, createElement, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { localeMeta, messages, type Locale } from "./messages";

const STORAGE_KEY = "skillaura.locale";

interface LocaleCtx {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const Ctx = createContext<LocaleCtx | null>(null);

function getValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => {
    if (acc && typeof acc === "object" && k in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[k];
    }
    return undefined;
  }, obj);
}

function detect(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored === "en" || stored === "ar") return stored;
  const nav = navigator.language?.toLowerCase() || "en";
  return nav.startsWith("ar") ? "ar" : "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detect());
  const dir = localeMeta[locale].dir;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.classList.toggle("font-arabic", locale === "ar");
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, dir]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const raw = getValue(messages[locale], key) ?? getValue(messages.en, key);
      if (typeof raw !== "string") return key;
      if (!params) return raw;
      return raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
    },
    [locale]
  );

  return createElement(Ctx.Provider, { value: { locale, dir, setLocale, t } }, children);
}

export function useTranslation() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTranslation must be used inside LocaleProvider");
  return ctx;
}

export { localeMeta };
export type { Locale };
