// app/utils/seo.ts
import type { Metadata } from "next";
import siteMetadata from "@/app/utils/siteMetaData";

export const SUPPORTED_LOCALES = ["hr", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "hr";

function normalizeSiteUrl(input: string) {
  const raw = String(input || "").trim();
  if (!raw) return "http://localhost:3000";

  const hasProtocol = /^https?:\/\//i.test(raw);
  if (hasProtocol) return raw.replace(/\/$/, "");

  // If no protocol, choose http for localhost/IP, https otherwise
  const isLocalhost = /^localhost(:\d+)?$/i.test(raw);
  const isIp = /^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(raw);

  const protocol = isLocalhost || isIp ? "http" : "https";
  return `${protocol}://${raw}`.replace(/\/$/, "");
}

export function getSiteUrl() {
  return normalizeSiteUrl(process.env.SITE_URL || siteMetadata.siteUrl || "http://localhost:3000");
}

export function absUrl(path: string) {
  const base = getSiteUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function buildAlternates(locale: Locale, path: string) {
  const suffix = path === "/" ? "" : path;
  const canonicalPath = `/${locale}${suffix}`;

  return {
    canonical: absUrl(canonicalPath),
    languages: {
      hr: absUrl(`/hr${suffix}`),
      en: absUrl(`/en${suffix}`),
      "x-default": absUrl(`/hr${suffix}`),
    },
  } satisfies NonNullable<Metadata["alternates"]>;
}