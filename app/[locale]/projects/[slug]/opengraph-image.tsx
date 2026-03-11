import { ImageResponse } from "next/og";

import { getProjectBySlug, getProjectImageUrl } from "@/lib/projects";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

function truncate(text: string, max = 140) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export default async function ProjectOpenGraphImage({ params }: Props) {
  const { locale, slug } = await params;

  const project = await getProjectBySlug(slug, locale);
  const projectImageUrl = getProjectImageUrl(project);

  const title = project?.title || "Project";
  const description = truncate(
    project?.shortDescription ||
      (locale === "hr"
        ? "Modern web projekat iz portfolija Hedgehog Web Dev."
        : "Modern web project from the Hedgehog Web Dev portfolio."),
    150
  );

  const techText =
    project?.technologies?.length
      ? project.technologies.slice(0, 4).map((t) => t.name).join(" • ")
      : "Next.js • React • Strapi • SEO";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 45%, #083344 100%)",
          color: "white",
          padding: "42px",
          fontFamily: "sans-serif",
          gap: "32px",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            padding: "42px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              opacity: 0.8,
            }}
          >
            Hedgehog Web Dev
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "620px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.05,
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.32,
                opacity: 0.92,
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 22,
              opacity: 0.72,
            }}
          >
            {techText}
          </div>
        </div>

        <div
          style={{
            width: 400,
            display: "flex",
            borderRadius: "28px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {projectImageUrl ? (
             
            <img
              src={projectImageUrl}
              alt={title}
              width="400"
              height="630"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                opacity: 0.6,
              }}
            >
              hedgehogwebdev.com
            </div>
          )}
        </div>
      </div>
    ),
    size
  );
}