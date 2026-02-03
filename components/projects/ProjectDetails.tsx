// components/projects/ProjectDetails.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import MarkdownRenderer from "./MarkdownRenderer";

type StrapiFormat = { url: string; width?: number; height?: number };

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

type ProjectLocalization = {
  locale: string; // strapi locale: "hr-HR" | "en"
  slug: string;
};

type Project = {
  title: string;
  slug: string;
  locale?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  image?: StrapiMedia | null;
  technologies: Technology[];
  localizations: ProjectLocalization[];
};

function toStrapiLocale(appLocale: string): string {
  if (appLocale.toLowerCase().startsWith("hr")) return "hr-HR";
  if (appLocale.toLowerCase().startsWith("en")) return "en";
  return "hr-HR";
}

function toAppLocale(strapiLocale: string): "hr" | "en" {
  return strapiLocale.toLowerCase().startsWith("hr") ? "hr" : "en";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function absoluteUrl(pathOrUrl: string, base: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return `${base}${pathOrUrl}`;
}

function parseMedia(raw: unknown): StrapiMedia | null {
  if (!raw) return null;

  // v4 wrapper
  if (isRecord(raw) && "data" in raw) {
    const data = raw.data;
    if (!data || !isRecord(data)) return null;
    const attrs = "attributes" in data && isRecord(data.attributes) ? data.attributes : null;
    return attrs ? parseMedia(attrs) : null;
  }

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
    for (const [key, val] of Object.entries(formatsRaw)) {
      if (!isRecord(val)) continue;
      const fUrl = asString(val.url);
      if (!fUrl) continue;
      out[key] = {
        url: fUrl,
        width: typeof val.width === "number" ? val.width : undefined,
        height: typeof val.height === "number" ? val.height : undefined,
      };
    }
    formats = out;
  }

  return { url, alternativeText, width, height, formats };
}

function bestImageUrl(media: StrapiMedia | null, base: string): string {
  if (!media) return "";
  const formats = media.formats ?? null;
  const candidate =
    formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || media.url;
  return absoluteUrl(candidate, base);
}

function parseTechnologies(raw: unknown): Technology[] {
  if (!raw) return [];

  // v4 wrapper
  if (isRecord(raw) && "data" in raw && Array.isArray(raw.data)) {
    return raw.data
      .map((item): Technology | null => {
        if (!isRecord(item)) return null;
        const attrs = "attributes" in item && isRecord(item.attributes) ? item.attributes : item;

        const name = asString(attrs.name);
        const slug = asString(attrs.slug);
        if (!name || !slug) return null;

        const color = asString(attrs.color);
        const icon = parseMedia(attrs.icon);

        return { name, slug, color, icon };
      })
      .filter((x): x is Technology => x !== null);
  }

  // v5 array
  if (Array.isArray(raw)) {
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

  return [];
}

function parseLocalizations(raw: unknown): ProjectLocalization[] {
  if (!raw) return [];

  // v4 wrapper: { data: [...] }
  if (isRecord(raw) && "data" in raw && Array.isArray(raw.data)) {
    return raw.data
      .map((item): ProjectLocalization | null => {
        if (!isRecord(item)) return null;
        const attrs = "attributes" in item && isRecord(item.attributes) ? item.attributes : item;

        const locale = asString(attrs.locale);
        const slug = asString(attrs.slug);
        if (!locale || !slug) return null;

        return { locale, slug };
      })
      .filter((x): x is ProjectLocalization => x !== null);
  }

  // v5 can be array
  if (Array.isArray(raw)) {
    return raw
      .map((x): ProjectLocalization | null => {
        if (!isRecord(x)) return null;
        const locale = asString(x.locale);
        const slug = asString(x.slug);
        if (!locale || !slug) return null;
        return { locale, slug };
      })
      .filter((x): x is ProjectLocalization => x !== null);
  }

  return [];
}

function parseProject(item: unknown): Project | null {
  if (!isRecord(item)) return null;

  const attrs = "attributes" in item && isRecord(item.attributes) ? item.attributes : item;

  const title = asString(attrs.title);
  const slug = asString(attrs.slug);
  if (!title || !slug) return null;

  const locale = asString(attrs.locale);
  const shortDescription = asString(attrs.shortDescription);
  const description = asString(attrs.description);

  const liveUrl = asString(attrs.liveUrl);
  const githubUrl = asString(attrs.githubUrl);

  const image = parseMedia(attrs.image);
  const technologies = parseTechnologies(attrs.technologies);
  const localizations = parseLocalizations(attrs.localizations);

  return {
    title,
    slug,
    locale,
    shortDescription,
    description,
    liveUrl,
    githubUrl,
    image,
    technologies,
    localizations,
  };
}

async function getProjectBySlug(slug: string, appLocale: string): Promise<Project | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const TOKEN = process.env.REST_API_KEY;

  if (!API_URL) throw new Error("Missing NEXT_PUBLIC_API_URL in .env");
  if (!BASE_URL) throw new Error("Missing NEXT_PUBLIC_BASE_URL in .env");

  const strapiLocale = toStrapiLocale(appLocale);

  const params = new URLSearchParams();
  params.set("locale", strapiLocale);
  params.set("filters[slug][$eq]", slug);

  // fields
  params.set("fields[0]", "title");
  params.set("fields[1]", "slug");
  params.set("fields[2]", "locale");
  params.set("fields[3]", "shortDescription");
  params.set("fields[4]", "description");
  params.set("fields[5]", "liveUrl");
  params.set("fields[6]", "githubUrl");

  // populate
  params.set("populate[image][fields][0]", "url");
  params.set("populate[image][fields][1]", "alternativeText");
  params.set("populate[image][fields][2]", "formats");

  params.set("populate[technologies][fields][0]", "name");
  params.set("populate[technologies][fields][1]", "slug");
  params.set("populate[technologies][fields][2]", "color");

  params.set("populate[technologies][populate][icon][fields][0]", "url");
  params.set("populate[technologies][populate][icon][fields][1]", "alternativeText");
  params.set("populate[technologies][populate][icon][fields][2]", "formats");

  // ✅ key part: localizations so we can build correct EN/HR slug switch
  params.set("populate[localizations][fields][0]", "slug");
  params.set("populate[localizations][fields][1]", "locale");

  const url = `${API_URL}/projects?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch project (${res.status}): ${text}`);
  }

  const json: unknown = await res.json();
  if (!isRecord(json) || !("data" in json) || !Array.isArray(json.data)) return null;

  const first = json.data[0];
  return parseProject(first);
}

type Props = {
  slug: string;
};

export default async function ProjectDetails({ slug }: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:1337";

  // ✅ like AllProjects
  const locale = await getLocale();
  const t = await getTranslations("ProjectDetails");

  const project = await getProjectBySlug(slug, locale);
  if (!project) notFound();

  const imgUrl = bestImageUrl(project.image ?? null, BASE_URL);

  // ✅ build correct language-switch href (no 404)
  const otherLocale: "hr" | "en" = locale.startsWith("hr") ? "en" : "hr";
  const otherSlug =
    project.localizations.find((l) => toAppLocale(l.locale) === otherLocale)?.slug ?? null;

  // You can feed this to your LangSwitch if you want:
  const otherHref = otherSlug ? `/${otherLocale}/projects/${otherSlug}` : `/${otherLocale}/projects`;

  return (
    <section className="w-full py-14">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href={`/${locale}/projects`}
            className="text-sm text-sky-200 opacity-80 hover:opacity-100 underline underline-offset-4"
          >
            ← {t("back")}
          </Link>

          {/* Optional: simple locale switch link using correct slug */}
          <Link
            href={otherHref}
            className="text-sm text-sky-300 opacity-80 hover:opacity-100 underline underline-offset-4"
          >
            {otherLocale.toUpperCase()}
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl text-sky-400 md:text-4xl font-semibold tracking-tight">
              {project.title}
            </h1>

            {project.shortDescription ? (
              <p className="mt-3 text-base text-cyan-500 md:text-lg opacity-80 max-w-3xl">
                {project.shortDescription}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-cyan-600 bg-white/20 px-4 py-2 text-sm font-medium text-sky-400 transition hover:bg-white/15"
                >
                  {t("live")} ↗
                </a>
              ) : null}

              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-cyan-600 bg-white/20 px-4 py-2 text-sm font-medium text-sky-400 transition hover:bg-white/15"
                >
                  {t("github")} ↗
                </a>
              ) : null}
            </div>

            {project.technologies.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((tech) => {
                  const iconUrl = tech.icon?.url ? absoluteUrl(tech.icon.url, BASE_URL) : "";
                  const style: React.CSSProperties | undefined = tech.color
                    ? { boxShadow: `0 0 0 1px ${tech.color}33` }
                    : undefined;

                  return (
                    <span
                      key={tech.slug}
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-700 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-300"
                      title={tech.name}
                      style={style}
                    >
                      {iconUrl ? (
                        <Image src={iconUrl} alt={tech.name} width={14} height={14} className="rounded-sm" />
                      ) : null}
                      <span>{tech.name}</span>
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>

          {imgUrl ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative aspect-video w-full">
                <Image
                  src={imgUrl}
                  alt={project.image?.alternativeText ?? project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority
                />
              </div>
            </div>
          ) : null}

          {project.description ? (
            <div className="mt-2 rounded-2xl bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 border-cyan-300/60 border transition duration-700 hover:bg-white/10 p-6">
              <MarkdownRenderer content={project.description} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}