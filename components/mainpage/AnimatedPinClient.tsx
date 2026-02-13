"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PinContainer } from "../ui/Pin";
import {
  absoluteUrl,
  bestImageUrl,
  getMediaBaseUrl,
  type Project,
} from "@/lib/strapi/projects";

type AnimatedPinClientProps = {
  projects: Project[];
  usedFallback?: boolean;
};

export function AnimatedPinClient({ projects, usedFallback = false }: AnimatedPinClientProps) {
  const t = useTranslations("AnimatedPin");
  const locale = useLocale();
  const baseUrl = getMediaBaseUrl();

  if (projects.length === 0) {
    return (
      <div className="mx-auto max-w-7xl p-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-sky-100">
          {t("notfound")}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8 md:mt-28 lg:mt-28">
      {usedFallback ? (
        <p className="mb-6 text-center text-sm text-sky-100">{t("fallbackNotice")}</p>
      ) : null}

      <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-center">
        {projects.map((p) => {
          const imgUrl = bestImageUrl(p.image ?? null, baseUrl);
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
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      alt={p.image?.alternativeText ?? p.title}
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
                    const iconUrl = tech.icon?.url ? absoluteUrl(tech.icon.url, baseUrl) : "";

                    const style: CSSProperties | undefined = tech.color
                      ? {
                          color: tech.color,
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
