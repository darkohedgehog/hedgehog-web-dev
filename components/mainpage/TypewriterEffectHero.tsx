"use client";

import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SocialBanner } from "../socials/SocialBanner";


export function TypewriterEffectHero() {
  const locale = useLocale();
  const t = useTranslations("TypewriterEffect");

  const image =
    "https://res.cloudinary.com/dhkmlqg4o/image/upload/v1720819788/hedgehog-dev/hedgehogbanner2_fc1jvh.webp";

  const words = [
    { text: t("description1") },
    { text: t("description2") },
    {
      text: t("description3"),
      className: "text-sky-600",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-160 text-center px-4 lg:mt-44 md:mt-32 mt-8">
      {/* Social banner */}
      <SocialBanner />
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

      {/* Full-size image inside gradient border */}
      <motion.div
        className="mt-10 w-full max-w-6xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: 1,
          y: [0, -12, 0],
        }}
        transition={{
          opacity: { duration: 0.6 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Gradient border */}
        <div className="relative rounded-3xl p-0.75 bg-linear-to-r from-sky-500 via-violet-500 to-sky-600 shadow-[0_0_60px_rgba(56,189,248,0.3)]">
          {/* Inner container */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Aspect ratio keeps height correct */}
            <div className="relative w-full aspect-video">
              <Image
                src={image}
                alt="Hedgehog Dev banner"
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>

            {/* Optional subtle overlay for depth */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}