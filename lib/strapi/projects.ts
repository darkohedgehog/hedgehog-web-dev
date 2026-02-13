export type StrapiFormat = {
  url: string;
  width?: number;
  height?: number;
};

export type StrapiMedia = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, StrapiFormat> | null;
};

export type Technology = {
  name: string;
  slug: string;
  color?: string | null;
  icon?: StrapiMedia | null;
};

export type Project = {
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

export const PROJECTS_REVALIDATE_SECONDS = 300;

export function toStrapiLocale(appLocale: string): string {
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

export function absoluteUrl(pathOrUrl: string, base: string): string {
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

export function bestImageUrl(media: StrapiMedia | null, base: string): string {
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

function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "https://api.hedgehogwebdev.com/api";
}

export function getMediaBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  try {
    return new URL(getApiUrl()).origin;
  } catch {
    return "https://api.hedgehogwebdev.com";
  }
}

async function fetchFeaturedProjectsForLocale(strapiLocale: string): Promise<Project[]> {
  const apiUrl = getApiUrl();

  const params = new URLSearchParams();
  params.set("filters[featured][$eq]", "true");
  params.set("pagination[pageSize]", "4");
  params.set("sort[0]", "createdAt:desc");
  params.set("locale", strapiLocale);

  params.set("fields[0]", "title");
  params.set("fields[1]", "slug");
  params.set("fields[2]", "shortDescription");
  params.set("fields[3]", "liveUrl");
  params.set("fields[4]", "githubUrl");

  params.set("populate[image][fields][0]", "url");
  params.set("populate[image][fields][1]", "alternativeText");
  params.set("populate[image][fields][2]", "formats");

  params.set("populate[technologies][fields][0]", "name");
  params.set("populate[technologies][fields][1]", "slug");
  params.set("populate[technologies][fields][2]", "color");

  params.set("populate[technologies][populate][icon][fields][0]", "url");
  params.set("populate[technologies][populate][icon][fields][1]", "alternativeText");
  params.set("populate[technologies][populate][icon][fields][2]", "formats");

  const url = `${apiUrl}/projects?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: PROJECTS_REVALIDATE_SECONDS },
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

export async function fetchFeaturedProjects(appLocale: string): Promise<Project[]> {
  return fetchFeaturedProjectsForLocale(toStrapiLocale(appLocale));
}

export async function fetchFeaturedProjectsWithFallback(
  appLocale: string
): Promise<{ projects: Project[]; usedFallback: boolean }> {
  const primary = toStrapiLocale(appLocale);

  const first = await fetchFeaturedProjectsForLocale(primary);
  if (first.length > 0) return { projects: first, usedFallback: false };

  if (primary !== "hr-HR") {
    const fallback = await fetchFeaturedProjectsForLocale("hr-HR");
    return { projects: fallback, usedFallback: fallback.length > 0 };
  }

  return { projects: [], usedFallback: false };
}
