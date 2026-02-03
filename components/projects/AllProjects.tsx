import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

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
  title: string;
  slug: string;
  shortDescription?: string | null;
  featured?: boolean | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  image?: StrapiMedia | null;
  technologies: Technology[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function absoluteUrl(pathOrUrl: string, base: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return `${base}${pathOrUrl}`;
}

/**
 * Normalize Strapi media field:
 * - v4: { data: { attributes: {...} } }
 * - v5: sometimes directly object (or similar)
 */
function parseMedia(raw: unknown): StrapiMedia | null {
  if (!raw) return null;

  // v4: { data: { attributes: { url, alternativeText, formats... } } }
  if (isRecord(raw) && "data" in raw) {
    const data = raw.data;
    if (!data || !isRecord(data)) return null;

    const attrs =
      "attributes" in data && isRecord(data.attributes) ? data.attributes : null;

    if (!attrs) return null;
    return parseMedia(attrs);
  }

  // direct object (v5-ish): { url, alternativeText, formats... }
  if (isRecord(raw)) {
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

  return null;
}

function bestImageUrl(media: StrapiMedia | null, base: string): string {
  if (!media) return "";
  const formats = media.formats ?? null;

  const candidate =
    formats?.medium?.url ||
    formats?.small?.url ||
    formats?.thumbnail?.url ||
    media.url;

  return absoluteUrl(candidate, base);
}

/**
 * technologies:
 * - v4: { data: [{ id, attributes: {...}}] }
 * - v5: could be array of objects
 */
function parseTechnologies(raw: unknown): Technology[] {
  if (!raw) return [];

  // v4 relation wrapper
  if (isRecord(raw) && "data" in raw && Array.isArray(raw.data)) {
    return raw.data
      .map((item): Technology | null => {
        if (!isRecord(item)) return null;

        const attrs =
          "attributes" in item && isRecord(item.attributes) ? item.attributes : item;

        return parseTechnologyAttributes(attrs);
      })
      .filter((x): x is Technology => x !== null);
  }

  // v5-ish array
  if (Array.isArray(raw)) {
    return raw
      .map((t): Technology | null => (isRecord(t) ? parseTechnologyAttributes(t) : null))
      .filter((x): x is Technology => x !== null);
  }

  return [];
}

function parseTechnologyAttributes(attrs: Record<string, unknown>): Technology | null {
  const name = asString(attrs.name);
  const slug = asString(attrs.slug);
  if (!name || !slug) return null;

  const color = asString(attrs.color);
  const icon = parseMedia(attrs.icon);

  return { name, slug, color, icon };
}

function parseProjectAttributes(attrs: Record<string, unknown>): Project | null {
  const title = asString(attrs.title);
  const slug = asString(attrs.slug);
  if (!title || !slug) return null;

  const shortDescription = asString(attrs.shortDescription);
  const featured = asBoolean(attrs.featured);
  const liveUrl = asString(attrs.liveUrl);
  const githubUrl = asString(attrs.githubUrl);

  const image = parseMedia(attrs.image);
  const technologies = parseTechnologies(attrs.technologies);

  return {
    title,
    slug,
    shortDescription,
    featured,
    liveUrl,
    githubUrl,
    image,
    technologies,
  };
}

function toStrapiLocale(appLocale: string): string {
  // Next-intl locale -> Strapi locale
  if (appLocale.toLowerCase().startsWith("hr")) return "hr-HR";
  if (appLocale.toLowerCase().startsWith("en")) return "en";
  return "hr-HR"; // fallback
}

async function getProjects(appLocale: string): Promise<Project[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const TOKEN = process.env.REST_API_KEY;

  if (!API_URL) throw new Error("Missing NEXT_PUBLIC_API_URL in .env");
  if (!BASE_URL) throw new Error("Missing NEXT_PUBLIC_BASE_URL in .env");

  const strapiLocale = toStrapiLocale(appLocale);

  const params = new URLSearchParams();
  params.set("sort[0]", "createdAt:desc");

  // ✅ ovo rešava i18n:
  params.set("locale", strapiLocale);

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
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch projects (${res.status}): ${text}`);
  }

  const json: unknown = await res.json();

  if (isRecord(json) && "data" in json && Array.isArray(json.data)) {
    return json.data
      .map((item): Project | null => {
        if (!isRecord(item)) return null;
        const attrs =
          "attributes" in item && isRecord(item.attributes) ? item.attributes : item;
        return parseProjectAttributes(attrs);
      })
      .filter((x): x is Project => x !== null);
  }

  return [];
}

export default async function AllProjects() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:1337";
  const locale = await getLocale();
  const projects = await getProjects(locale);
  const t = await getTranslations("AllProjects");
  return (
    <section className="w-full py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-cyan-300">
              {t("title")}
            </h2>
            <p className="mt-2 text-sm opacity-75 text-cyan-500">
              {t("description")}
            </p>
          </div>
          <p className="text-sm opacity-70 text-cyan-600">
            {t("total", { count: projects.length })}</p>
        </div>

        {projects.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 border-cyan-300/60 border group-hover/pin:border-white/20 transition duration-700 overflow-hidden p-6">
            <p className="text-sm opacity-80 text-cyan-300 flex items-center justify-center">
              {t("notfound")}
              </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => {
              const imgUrl = bestImageUrl(p.image ?? null, BASE_URL);

              return (
                <article
                  key={p.slug}
                  className="group relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 border-cyan-300/60 border group-hover/pin:border-white/20 transition duration-700 hover:bg-white/10"
                >
                  <Link href={`/${locale}/projects/${p.slug}`} className="block">
                    <div className="relative aspect-video w-full overflow-hidden">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={p.image?.alternativeText ?? p.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/20 text-sm opacity-70">
                          {t("noImage")}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold leading-snug text-cyan-500">
                      <Link
                        href={`/${locale}/projects/${p.slug}`}
                        className="hover:underline underline-offset-4"
                      >
                        {p.title}
                      </Link>
                    </h3>

                    {p.shortDescription ? (
                      <p className="mt-2 line-clamp-3 text-sm opacity-80 text-cyan-500">
                        {p.shortDescription}
                      </p>
                    ) : null}

                    {p.technologies.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2 text-sky-400">
                        {p.technologies.slice(0, 10).map((t) => {
                          const iconUrl = t.icon?.url
                            ? absoluteUrl(t.icon.url, BASE_URL)
                            : "";

                          const style: React.CSSProperties | undefined = t.color
                            ? { boxShadow: `0 0 0 1px ${t.color}33` }
                            : undefined;

                          return (
                            <span
                              key={t.slug}
                              className="inline-flex items-center gap-2 rounded-full border border-cyan-700 bg-white/5 px-3 py-1 text-xs"
                              title={t.name}
                              style={style}
                            >
                              {iconUrl ? (
                                <Image
                                  src={iconUrl}
                                  alt={t.name}
                                  width={14}
                                  height={14}
                                  className="rounded-sm"
                                />
                              ) : null}
                              <span>{t.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    ) : null}

                    {/* CTA Row */}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/${locale}/projects/${p.slug}`}
                        className="inline-flex items-center justify-center rounded-xl border border-cyan-600 bg-white/10 px-4 py-2 text-sm font-medium text-sky-400 transition hover:bg-white/15"
                      >
                        {t("details")} →
                      </Link>

                      {p.liveUrl ? (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline underline-offset-4 opacity-90 hover:opacity-100 text-sky-300"
                        >
                          Live ↗
                        </a>
                      ) : null}

                      {p.githubUrl ? (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline underline-offset-4 opacity-90 hover:opacity-100 text-sky-200"
                        >
                          GitHub ↗
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}