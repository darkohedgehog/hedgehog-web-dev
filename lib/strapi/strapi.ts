export const STRAPI_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:1337";

export function absoluteStrapiUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${STRAPI_URL}${url}`;
}