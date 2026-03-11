// lib/projects.ts
import { absoluteStrapiUrl, STRAPI_URL } from "@/lib/strapi/strapi";

type StrapiImageFormat = {
  url?: string;
  width?: number;
  height?: number;
};

type StrapiImage = {
  url?: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, StrapiImageFormat> | null;
};

export type ProjectSeoData = {
  title: string;
  slug: string;
  shortDescription?: string | null;
  image?: StrapiImage | null;
  technologies?: Array<{ name: string }> | null;
};

type StrapiCollectionResponse<T> = {
  data?: T[];
};

function buildProjectsUrl(slug: string, locale: string) {
  const url = new URL("/api/projects", STRAPI_URL);

  url.searchParams.set("filters[slug][$eq]", slug);
  url.searchParams.set("locale", locale);
  url.searchParams.set("populate[image][populate]", "*");
  url.searchParams.set("populate[technologies][fields][0]", "name");

  return url.toString();
}

export async function getProjectBySlug(
  slug: string,
  locale: string
): Promise<ProjectSeoData | null> {
  const res = await fetch(buildProjectsUrl(slug, locale), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null;
  }

  const json = (await res.json()) as StrapiCollectionResponse<ProjectSeoData>;
  return json?.data?.[0] ?? null;
}

export function getProjectImageUrl(project: ProjectSeoData | null) {
  const image = project?.image;
  if (!image) return "";

  const best =
    image.formats?.large?.url ||
    image.formats?.medium?.url ||
    image.formats?.small?.url ||
    image.url ||
    "";

  return absoluteStrapiUrl(best);
}