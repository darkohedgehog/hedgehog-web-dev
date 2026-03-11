import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/projects";
import { absoluteSiteUrl } from "@/lib/site-metadata";
import ProjectDetails from "@/components/projects/ProjectDetails";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug, locale);

  if (!project) {
    return {
      title: "Project",
      description:
        locale === "hr" ? "Detalji projekta." : "Project details.",
    };
  }

  const path = `/${locale}/projects/${project.slug}`;

  return {
    title: project.title,
    description:
      project.shortDescription ||
      (locale === "hr" ? "Detalji projekta." : "Project details."),
    openGraph: {
      title: project.title,
      description:
        project.shortDescription ||
        (locale === "hr" ? "Detalji projekta." : "Project details."),
      url: absoluteSiteUrl(path),
      type: "article",
      locale: locale === "hr" ? "hr_HR" : "en_US",
      images: [
        {
          url: absoluteSiteUrl(`${path}/opengraph-image`),
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description:
        project.shortDescription ||
        (locale === "hr" ? "Detalji projekta." : "Project details."),
      images: [absoluteSiteUrl(`${path}/opengraph-image`)],
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