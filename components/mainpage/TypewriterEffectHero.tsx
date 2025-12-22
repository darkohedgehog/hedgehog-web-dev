"use client";

import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export function TypewriterEffectHero() {
  const locale = useLocale();
  const t = useTranslations("TypewriterEffect");

  const words = [
    {
      text: t("description1"),
    },
    {
      text: t("description2"),
    },
    {
      text: t("description3"),
      className: "text-sky-600",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-160 text-center px-4">
      {/* Title */}
      <p className="text-sky-100 text-sm sm:text-base mb-4">
        {t("title")}
      </p>

      {/* Typewriter */}
      <TypewriterEffectSmooth words={words} />

      {/* Buttons */}
      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <Link
           href={`/${locale}/contact`}
          className="w-40 h-10 flex items-center justify-center rounded-xl
                     bg-black text-white text-sm
                     border border-transparent
                     hover:bg-neutral-800 transition"
        >
          {t("button1")}
        </Link>

        <Link
          href={`/${locale}/projects`}
          className="w-40 h-10 flex items-center justify-center rounded-xl
                     bg-white text-black text-sm
                     border border-black
                     hover:bg-neutral-100 transition"
        >
          {t("button2")}
        </Link>
      </div>
    </div>
  );
}