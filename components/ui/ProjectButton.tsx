"use client"

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { TfiAnnouncement } from "react-icons/tfi";

const ProjectButton = () => {
    const locale = useLocale();
  const t = useTranslations("TypewriterEffect");
  return (
    <div>
        <Link
          href={`/${locale}/projects`}
          className="w-40 h-10 flex items-center justify-center rounded-xl
                     bg-sky-200 text-cyan-800 text-sm font-semibold
                     border border-black
                     hover:bg-neutral-100 transition"
        >
          <span className="flex items-center justify-center gap-2">
          <TfiAnnouncement aria-hidden="true" /> {t("button2")}
          </span>
        </Link>
    </div>
  )
}

export default ProjectButton;