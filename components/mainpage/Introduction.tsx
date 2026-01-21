"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";

import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

type IntroItem = {
  title: React.ReactNode;
  description: React.ReactNode;
  header: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
};

export function Introduction() {
  const t = useTranslations("Introduction");

  const items: IntroItem[] = [
    {
      title: <span>{t("title1")}</span>,
      description: <span className="text-sm">{t("title2")}</span>,
      header: <SkeletonOne />,
      className: "md:col-span-1",
      icon: <IconClipboardCopy className="h-4 w-4 text-cyan-300" />,
    },
    {
      title: <span>{t("title3")}</span>,
      description: <span className="text-sm">{t("title4")}</span>,
      header: <SkeletonTwo />,
      className: "md:col-span-1",
      icon: <IconFileBroken className="h-4 w-4 text-cyan-300" />,
    },
    {
      title: <span>{t("title5")}</span>,
      description: <span className="text-sm">{t("title6")}</span>,
      header: <SkeletonThree />,
      className: "md:col-span-1",
      icon: <IconSignature className="h-4 w-4 text-cyan-300" />,
    },
    {
      title: <span>{t("title7")}</span>,
      description: <span className="text-sm">{t("title8")}</span>,
      header: <SkeletonFour />,
      className: "md:col-span-2",
      icon: <IconTableColumn className="h-4 w-4 text-cyan-300" />,
    },
    {
      title: <span>{t("title9")}</span>,
      description: <span className="text-sm">{t("title10")}</span>,
      header: <SkeletonFive />,
      className: "md:col-span-1",
      icon: <IconBoxAlignRightFilled className="h-4 w-4 text-cyan-300" />,
    },
  ];

  return (
    <BentoGrid className="w-full mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={`intro-item-${i}`}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn(
            "&>p]:text-lg",
            item.className
          )}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const SkeletonOne = () => {
  const variants = {
    initial: { x: 0 },
    animate: {
      x: 10,
      rotate: 5,
      transition: { duration: 0.2 },
    },
  };

  const variantsSecond = {
    initial: { x: 0 },
    animate: {
      x: -10,
      rotate: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-24 bg-dot-white/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-cyan-100/20 p-2 items-center space-x-2 bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-linear-to-r from-pink-500 to-violet-500 shrink-0" />
        <div className="w-full bg-neutral-900 h-4 rounded-full" />
      </motion.div>

      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-cyan-100/20 p-2 items-center space-x-2 w-3/4 ml-auto bg-black"
      >
        <div className="w-full h-4 rounded-full bg-neutral-900" />
        <div className="h-6 w-6 rounded-full bg-linear-to-r from-pink-500 to-violet-500 shrink-0" />
      </motion.div>

      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-cyan-100/20 p-2 items-center space-x-2 bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-linear-to-r from-pink-500 to-violet-500 shrink-0" />
        <div className="w-full  h-4 rounded-full bg-neutral-900" />
      </motion.div>
    </motion.div>
  );
};

/**
 * ✅ PURE "random-ish" width generator:
 * - deterministic (idempotent)
 * - no Math.random
 * - no useEffect / no setState
 * - looks organic enough for skeletons
 */
function pseudoWidthPercent(index: number, min = 40, max = 100): string {
  const range = max - min; // e.g. 60
  const x = Math.sin((index + 1) * 1337.1337) * 10000;
  const frac = x - Math.floor(x); // 0..1
  const value = min + Math.floor(frac * range);
  return `${value}%`;
}

const SkeletonTwo = () => {
  const variants = {
    initial: { width: 0 },
    animate: {
      width: "100%",
      transition: { duration: 0.2 },
    },
    hover: {
      width: ["0%", "100%"],
      transition: { duration: 2 },
    },
  };

  const widths = Array.from({ length: 6 }, (_, i) => pseudoWidthPercent(i, 40, 100));

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-24 bg-dot-white/[0.2] flex-col space-y-2"
    >
      {widths.map((maxWidth, i) => (
        <motion.div
          key={`skeleton-two-${i}`}
          variants={variants}
          style={{ maxWidth }}
          className="flex flex-row rounded-full border border-cyan-100/20 p-2 items-center space-x-2 bg-black w-full h-4"
        />
      ))}
    </motion.div>
  );
};

const SkeletonThree = () => {
  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-24 bg-dot-white/[0.2] rounded-lg flex-col space-y-2"
      style={{
        background:
          "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg" />
    </motion.div>
  );
};

const SkeletonFour = () => {
  const t = useTranslations("Introduction");

  const first = {
    initial: { x: 20, rotate: -5 },
    hover: { x: 0, rotate: 0 },
  };

  const second = {
    initial: { x: -20, rotate: 5 },
    hover: { x: 0, rotate: 0 },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-24 bg-dot-white/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl p-4 bg-black border-white/10 border flex flex-col items-center justify-center"
      >
        <Image
          src="/assets/react-svgrepo.svg"
          alt="React"
          width={100}
          height={100}
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-cyan-500 mt-4">
          {t("title11")}
        </p>
        <p className="border border-indigo-500 bg-indigo-900/20 text-indigo-500 text-xs rounded-full px-2 py-0.5 mt-4">
          {t("title12")}
        </p>
      </motion.div>

      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-black border-white/10 p-4 border flex flex-col items-center justify-center">
        <Image
          src="/assets/tailwindcss-icon-svgrepo.svg"
          alt="Tailwind CSS"
          width={100}
          height={100}
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          {t("title13")}
        </p>
        <p className="border border-green-500 bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
          {t("title14")}
        </p>
      </motion.div>

      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/10 border border-neutral-200 flex flex-col items-center justify-center"
      >
        <Image
          src="/assets/nextjs-svgrepo.svg"
          alt="Next.js"
          width={100}
          height={100}
          className="rounded-full h-10 w-10 bg-slate-400"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          {t("title15")}
        </p>
        <p className="border border-orange-500 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5 mt-4">
          {t("title16")}
        </p>
      </motion.div>
    </motion.div>
  );
};

const SkeletonFive = () => {
  const t = useTranslations("Introduction");

  const variants = {
    initial: { x: 0 },
    animate: {
      x: 10,
      rotate: 5,
      transition: { duration: 0.2 },
    },
  };

  const variantsSecond = {
    initial: { x: 0 },
    animate: {
      x: -10,
      rotate: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-24 bg-dot-white/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-white/20 p-2 items-start space-x-2 bg-black"
      >
        <Image
          src="/assets/trustedclient.svg"
          alt="Trusted client"
          width={100}
          height={100}
          className="rounded-full h-10 w-10"
        />
        <p className="text-xs text-cyan-300">{t("title17")}</p>
      </motion.div>

      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/20 p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-black"
      >
        <p className="text-xs text-cyan-200">{t("title18")}</p>
        <div className="h-6 w-6 rounded-full bg-linear-to-r from-pink-500 to-violet-500 shrink-0" />
      </motion.div>
    </motion.div>
  );
};