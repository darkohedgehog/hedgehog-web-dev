"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PinContainer } from "../ui/Pin";

type StrapiFormat = {
  url: string;
  width?: number;
  height?: number;
};

type StrapiMedia = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, StrapiFormat> | null;
};

type Technology = {
  name: string;
  slug: string;
  color?: string | null;
  icon?: StrapiMedia | null;
};

type Project = {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  image?: StrapiMedia | null;
  technologies: Technology[];
};

type StrapiListResponse<T> = {
  data: T[];
  meta?: unknown;
};

function toStrapiLocale(appLocale: string): string {
  const l = appLocale.toLowerCase();
  if (l.startsWith("hr")) return "hr-HR";
  if (l.startsWith("en")) return "en";
  return "hr-HR";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

function absoluteUrl(pathOrUrl: string, base: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return `${base}${pathOrUrl}`;
}

function parseMedia(raw: unknown): StrapiMedia | null {
  if (!isRecord(raw)) return null;

  const url = asString(raw.url);
  if (!url) return null;

  const alternativeText = asString(raw.alternativeText);
  const width = typeof raw.width === "number" ? raw.width : null;
  const height = typeof raw.height === "number" ? raw.height : null;

  const formatsRaw = raw.formats;
  let formats: Record<string, StrapiFormat> | null = null;

  if (isRecord(formatsRaw)) {
    const out: Record<string, StrapiFormat> = {};
    for (const [k, v] of Object.entries(formatsRaw)) {
      if (!isRecord(v)) continue;
      const fUrl = asString(v.url);
      if (!fUrl) continue;

      out[k] = {
        url: fUrl,
        width: typeof v.width === "number" ? v.width : undefined,
        height: typeof v.height === "number" ? v.height : undefined,
      };
    }
    formats = out;
  }

  return { url, alternativeText, width, height, formats };
}

function bestImageUrl(media: StrapiMedia | null, base: string): string {
  if (!media) return "";
  const f = media.formats ?? null;
  const candidate = f?.medium?.url || f?.small?.url || f?.thumbnail?.url || media.url;
  return absoluteUrl(candidate, base);
}

function parseTechnologies(raw: unknown): Technology[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((t): Technology | null => {
      if (!isRecord(t)) return null;

      const name = asString(t.name);
      const slug = asString(t.slug);
      if (!name || !slug) return null;

      const color = asString(t.color);
      const icon = parseMedia(t.icon);

      return { name, slug, color, icon };
    })
    .filter((x): x is Technology => x !== null);
}

function parseProject(raw: unknown): Project | null {
  if (!isRecord(raw)) return null;

  const id = asNumber(raw.id);
  const title = asString(raw.title);
  const slug = asString(raw.slug);

  if (id === null || !title || !slug) return null;

  const shortDescription = asString(raw.shortDescription);
  const liveUrl = asString(raw.liveUrl);
  const githubUrl = asString(raw.githubUrl);

  const image = parseMedia(raw.image);
  const technologies = parseTechnologies(raw.technologies);

  return {
    id,
    title,
    slug,
    shortDescription,
    liveUrl,
    githubUrl,
    image,
    technologies,
  };
}

async function fetchFeaturedProjectsForLocale(
  strapiLocale: string,
  signal?: AbortSignal
): Promise<Project[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:1337/api
  if (!API_URL) throw new Error("Missing NEXT_PUBLIC_API_URL");

  const params = new URLSearchParams();
  params.set("sort[0]", "createdAt:desc");
  params.set("locale", strapiLocale);

  // ✅ featured only
  params.set("filters[featured][$eq]", "true");

  // optional: limit cards on homepage
  params.set("pagination[pageSize]", "6");

  // fields
  params.set("fields[0]", "title");
  params.set("fields[1]", "slug");
  params.set("fields[2]", "shortDescription");
  params.set("fields[3]", "liveUrl");
  params.set("fields[4]", "githubUrl");

  // populate (Strapi v5 safe)
  params.set("populate[image][fields][0]", "url");
  params.set("populate[image][fields][1]", "alternativeText");
  params.set("populate[image][fields][2]", "formats");

  params.set("populate[technologies][fields][0]", "name");
  params.set("populate[technologies][fields][1]", "slug");
  params.set("populate[technologies][fields][2]", "color");

  params.set("populate[technologies][populate][icon][fields][0]", "url");
  params.set("populate[technologies][populate][icon][fields][1]", "alternativeText");
  params.set("populate[technologies][populate][icon][fields][2]", "formats");

  const url = `${API_URL}/projects?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    signal,
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch projects (${res.status}): ${text}`);
  }

  const json: unknown = await res.json();

  if (!isRecord(json)) return [];
  const dataRaw = (json as StrapiListResponse<unknown>).data;
  if (!Array.isArray(dataRaw)) return [];

  return dataRaw
    .map((item) => parseProject(item))
    .filter((x): x is Project => x !== null);
}

async function fetchFeaturedProjectsWithFallback(
  appLocale: string,
  signal?: AbortSignal
): Promise<{ projects: Project[]; usedFallback: boolean }> {
  const primary = toStrapiLocale(appLocale);

  // 1) try requested locale
  const first = await fetchFeaturedProjectsForLocale(primary, signal);
  if (first.length > 0) return { projects: first, usedFallback: false };

  // 2) fallback to hr-HR (only if primary isn't already hr-HR)
  if (primary !== "hr-HR") {
    const fallback = await fetchFeaturedProjectsForLocale("hr-HR", signal);
    return { projects: fallback, usedFallback: fallback.length > 0 };
  }

  return { projects: [], usedFallback: false };
}

export function AnimatedPin() {
  const t = useTranslations("AnimatedPin");
  const locale = useLocale();

  const [projects, setProjects] = useState<Project[]>([]);
  const [usedFallback, setUsedFallback] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const BASE_URL = useMemo(
    () => process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:1337",
    []
  );

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { projects: data, usedFallback: fb } = await fetchFeaturedProjectsWithFallback(
          locale,
          ac.signal
        );

        if (ac.signal.aborted) return;

        setProjects(data);
        setUsedFallback(fb);
      } catch (e: unknown) {
        if (ac.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [locale]);

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 p-8 lg:grid-cols-2 lg:gap-28">
        <div className="h-80 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
        <div className="h-80 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-8">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
          {t("error", { message: error })}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="mx-auto max-w-7xl p-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-sky-200/80">
          {t("notfound")}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8 md:mt-28 lg:mt-28">
      {/* optional: mala oznaka da je fallback */}
      {usedFallback ? (
        <p className="mb-6 text-center text-sm text-sky-200/70">
          {t("fallbackNotice")}
        </p>
      ) : null}

      <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-center">
        {projects.map((p) => {
          const imgUrl = bestImageUrl(p.image ?? null, BASE_URL);

          // pin click: liveUrl ako postoji, inače internal details
          const pinHref = p.liveUrl ?? `/${locale}/projects/${p.slug}`;

          return (
            <PinContainer key={p.id} title={p.title} href={pinHref}>
              <div className="flex flex-col p-4 tracking-tight text-cyan-300 w-[20rem] h-80 lg:w-[24rem] lg:h-88">
                <h3 className="max-w-xs pb-2 m-0 font-bold text-base text-accent dark:text-accentDark">
                  {p.title}
                </h3>

                <div className="text-base m-0 p-0 font-normal">
                  <span className="text-cyan-500">{p.shortDescription ?? ""}</span>
                </div>

                {imgUrl ? (
                  <div className="mt-3">
                    <Image
                      src={imgUrl}
                      width={1200}
                      height={700}
                      alt={p.image?.alternativeText ?? p.title}
                      priority
                      className="w-full h-32 rounded-md object-cover object-center"
                    />
                  </div>
                ) : null}

                <div className="flex items-center justify-center mt-4 gap-6">
                  {p.githubUrl ? (
                    <Link
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      GitHub
                    </Link>
                  ) : null}

                  {p.liveUrl ? (
                    <Link
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {t("live")}
                    </Link>
                  ) : (
                    <Link href={`/${locale}/projects/${p.slug}`} className="text-blue-400 hover:underline">
                      {t("details")}
                    </Link>
                  )}
                </div>
<div className="mt-5 flex flex-wrap gap-2">
  {p.technologies.map((tech) => {
    const iconUrl = tech.icon?.url ? absoluteUrl(tech.icon.url, BASE_URL) : "";

    const style: React.CSSProperties | undefined = tech.color
      ? {
          // Boji tekst i SVG (ako SVG koristi currentColor)
          color: tech.color,

          // Suptilan “tint” + ring/glow
          backgroundColor: `${tech.color}14`,
          boxShadow: `0 0 0 1px ${tech.color}55, 0 12px 32px ${tech.color}12`,
        }
      : undefined;

    return (
      <span
        key={tech.slug}
        title={tech.name}
        style={style}
        className="
          inline-flex items-center gap-2
          rounded-full px-3 py-1 text-xs font-medium
          border border-white/10 bg-white/5
          text-sky-200/90
          transition
          hover:bg-white/10
        "
      >
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={tech.name}
            width={14}
            height={14}
            className="block rounded-sm"
            priority
          />
        ) : null}

        <span className="whitespace-nowrap">{tech.name}</span>
      </span>
    );
  })}
</div>     
              </div>
            </PinContainer>
          );
        })}
      </div>
    </div>
  );
}