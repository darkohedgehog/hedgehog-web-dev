import type { Metadata } from "next";
import ProjectDetails from "@/components/projects/ProjectDetails";
import { absUrl, DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/app/utils/seo";

type ProjectLocalization = {
  locale: string; // "hr-HR" | "en" (iz Strapi)
  slug: string;
};

type ProjectSeo = {
  title: string;
  shortDescription?: string | null;
  localizations: ProjectLocalization[];
};

type StrapiV4LocalizationItem = {
  attributes?: {
    locale?: string;
    slug?: string;
  };
  locale?: string;
  slug?: string;
};

type StrapiV4Response = {
  data?: Array<{
    attributes?: {
      title?: string;
      shortDescription?: string | null;
      localizations?: { data?: StrapiV4LocalizationItem[] };
    };
  }>;
};

function toStrapiLocale(appLocale: Locale): string {
  return appLocale === "hr" ? "hr-HR" : "en";
}

function toAppLocale(strapiLocale: string): Locale {
  return strapiLocale.toLowerCase().startsWith("hr") ? "hr" : "en";
}

function parseProjectSeo(json: unknown): ProjectSeo | null {
  const obj = json as StrapiV4Response;
  const first = obj.data?.[0]?.attributes;
  if (!first?.title) return null;

  const locItems = first.localizations?.data ?? [];

  const localizations: ProjectLocalization[] = locItems
    .map((item): ProjectLocalization | null => {
      const attrs = item.attributes ?? item;
      const locale = attrs.locale;
      const slug = attrs.slug;
      if (!locale || !slug) return null;
      return { locale, slug };
    })
    .filter((x): x is ProjectLocalization => x !== null);

  return {
    title: first.title,
    shortDescription: first.shortDescription ?? null,
    localizations,
  };
}

async function getProjectSeoBySlug(slug: string, locale: Locale): Promise<ProjectSeo | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const TOKEN = process.env.REST_API_KEY;

  if (!API_URL) return null;

  const params = new URLSearchParams();
  params.set("locale", toStrapiLocale(locale));
  params.set("filters[slug][$eq]", slug);

  params.set("fields[0]", "title");
  params.set("fields[1]", "shortDescription");

  params.set("populate[localizations][fields][0]", "slug");
  params.set("populate[localizations][fields][1]", "locale");

  const res = await fetch(`${API_URL}/projects?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;

  const json: unknown = await res.json();
  return parseProjectSeo(json);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;

  const locale: Locale = SUPPORTED_LOCALES.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : DEFAULT_LOCALE;

  const project = await getProjectSeoBySlug(slug, locale);
  if (!project) return {};

  // Uvek ima prevod na oba jezika (kažeš da je guarantee)
  const hrSlug =
    locale === "hr"
      ? slug
      : project.localizations.find((l) => toAppLocale(l.locale) === "hr")?.slug;

  const enSlug =
    locale === "en"
      ? slug
      : project.localizations.find((l) => toAppLocale(l.locale) === "en")?.slug;

  // Safety net: ako nekad fali (ne bi trebalo), vrati minimalno canonical.
  if (!hrSlug || !enSlug) {
    return {
      title: project.title,
      description: project.shortDescription ?? undefined,
      alternates: {
        canonical: absUrl(`/${locale}/projects/${slug}`),
      },
    };
  }

  const canonical = absUrl(`/${locale}/projects/${slug}`);

  return {
    title: project.title,
    description: project.shortDescription ?? undefined,
    alternates: {
      canonical,
      languages: {
        hr: absUrl(`/hr/projects/${hrSlug}`),
        en: absUrl(`/en/projects/${enSlug}`),
        "x-default": absUrl(`/hr/projects/${hrSlug}`),
      },
    },
  };
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  return <ProjectDetails slug={slug} />;
}