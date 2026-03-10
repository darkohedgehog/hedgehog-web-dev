"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function Approach() {
  const t = useTranslations("Approach");

  return (
    <div className="py-20 flex flex-col lg:flex-row items-center justify-center bg-transparent w-full lg:w-6xl gap-6 mx-auto px-8">
      <Card title={t("title1")} icon={<AceternityIcon order={t("icon1")} />} des={t("des1")}>
        <CanvasRevealEffect animationSpeed={5.1} containerClassName="bg-emerald-900" />
      </Card>

      <Card title={t("title2")} icon={<AceternityIcon order={t("icon2")} />} des={t("des2")}>
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[
            [236, 72, 153],
            [232, 121, 249],
          ]}
          dotSize={2}
        />
        <div className="absolute inset-0 mask-[radial-gradient(400px_at_center,white,transparent)] bg-black/90" />
      </Card>

      <Card title={t("title3")} icon={<AceternityIcon order={t("icon3")} />} des={t("des3")}>
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-sky-600"
          colors={[[125, 211, 252]]}
        />
      </Card>
    </div>
  );
}

type CardProps = {
  title: string;
  des: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, icon, children, des }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      className="border group/canvas-card flex items-center justify-center border-cyan-300/60 max-w-sm w-full mx-auto p-4 relative h-120 rounded-3xl bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 overflow-hidden"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white opacity-30" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white opacity-30" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white opacity-30" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white opacity-30" />

      <AnimatePresence>
        {hovered ? (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative z-20 px-6 md:px-10 w-full">
        <div
          className={cn(
            "text-center absolute top-1/2 left-1/2 min-w-40 mx-auto flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
            hovered ? "opacity-0 -translate-y-[60%]" : "opacity-100"
          )}
        >
          {icon}
        </div>

        <h2
          className={cn(
            "text-white text-center text-3xl relative z-10 mt-4 font-bold transition-all duration-200",
            hovered ? "opacity-100 -translate-y-2" : "opacity-0"
          )}
        >
          {title}
        </h2>

        <p
          className={cn(
            "text-sm relative z-10 mt-4 text-center transition-all duration-200",
            hovered ? "opacity-100 -translate-y-2" : "opacity-0"
          )}
          style={{ color: "#E4ECFF" }}
        >
          {des}
        </p>
      </div>
    </div>
  );
};

type AceternityIconProps = {
  order: React.ReactNode;
};

const AceternityIcon: React.FC<AceternityIconProps> = ({ order }) => {
  return (
    <button
      type="button"
      className="relative inline-flex h-12 w-50 overflow-hidden rounded-full p-px focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {order}
      </span>
    </button>
  );
};

type IconProps = React.SVGProps<SVGSVGElement>;

export const Icon: React.FC<IconProps> = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};