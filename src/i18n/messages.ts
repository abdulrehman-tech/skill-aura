import enAuth from "./locales/en/auth";
import enAccount from "./locales/en/account";
import enMarketplace from "./locales/en/marketplace";
import enShared from "./locales/en/shared";

import arAuth from "./locales/ar/auth";
import arAccount from "./locales/ar/account";
import arMarketplace from "./locales/ar/marketplace";
import arShared from "./locales/ar/shared";

export type Locale = "en" | "ar";

type Dict = Record<string, unknown>;

function deepMerge(...sources: Dict[]): Dict {
  const out: Dict = {};
  for (const src of sources) {
    for (const [k, v] of Object.entries(src)) {
      if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" && !Array.isArray(out[k])) {
        out[k] = deepMerge(out[k] as Dict, v as Dict);
      } else {
        out[k] = v;
      }
    }
  }
  return out;
}

export const messages: Record<Locale, Dict> = {
  en: deepMerge(enAuth, enAccount, enMarketplace, enShared),
  ar: deepMerge(arAuth, arAccount, arMarketplace, arShared),
};

export const localeMeta: Record<Locale, { label: string; native: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", native: "English", dir: "ltr" },
  ar: { label: "Arabic", native: "العربية", dir: "rtl" },
};
