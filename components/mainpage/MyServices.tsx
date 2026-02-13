"use client";

import React from "react";
import { Code2, Wrench, LineChart, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

type ServiceKey = "web" | "maintenance" | "powerbi";

type ServiceConfig = {
  key: ServiceKey;
  icon: React.ReactNode;
  accentClass: string;
};

const services: ServiceConfig[] = [
  {
    key: "web",
    icon: <Code2 className="h-5 w-5" />,
    accentClass: "shadow-cyan-500/20 ring-cyan-300/15",
  },
  {
    key: "maintenance",
    icon: <Wrench className="h-5 w-5" />,
    accentClass: "shadow-sky-500/20 ring-sky-300/15",
  },
  {
    key: "powerbi",
    icon: <LineChart className="h-5 w-5" />,
    accentClass: "shadow-emerald-500/20 ring-emerald-300/15",
  },
];

function ServiceCard({
  title,
  icon,
  items,
  accentClass,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  accentClass: string;
}) {
  return (
    <div
      className={[
        "group relative rounded-2xl border border-cyan-300/25",
        "bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80",
        "backdrop-blur-xl ring-1",
        accentClass,
        "p-6 transition-all duration-300",
        "hover:-translate-y-1 hover:border-cyan-300/45 hover:shadow-2xl",
        // glow “aura”
        "before:absolute before:inset-0 before:-z-10 before:rounded-2xl",
        "before:bg-radial-[circle_at_30%_20%] before:from-cyan-500/20 before:via-transparent before:to-transparent",
        "before:opacity-70 before:blur-xl before:transition-opacity before:duration-300",
        "group-hover:before:opacity-100",
        // shine layer
        "after:absolute after:inset-0 after:rounded-2xl after:pointer-events-none",
        "after:bg-linear-to-b after:from-white/10 after:via-transparent after:to-transparent",
        "after:opacity-0 after:transition-opacity after:duration-300 group-hover:after:opacity-100",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-white/5 text-cyan-200">
          {icon}
        </span>

        <h3 className="text-lg font-semibold text-cyan-100">{title}</h3>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-cyan-100">
        {items.map((it) => (
          <li key={it} className="flex gap-2 leading-relaxed">
            <span className="mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/70" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MyServices() {
  const t = useTranslations("MyServices");

  return (
    <section className="container relative mx-auto py-16 max-w-6xl">
      {/* Title */}
      <div className="mb-10 flex items-center justify-center flex-col text-center">
        <h2 className="mt-2 text-3xl font-bold text-sky-400">
          {t("heading")}
          <span>
            <Zap className="ml-4 inline-block h-5 w-5 animate-pulse duration-300 text-cyan-400" />
          </span>
        </h2>

        <p className="mt-3 max-w-2xl text-md text-sky-200">
          {t("description")}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {services.map((s) => {
          const title = t(`cards.${s.key}.title`);
          const items = t.raw(`cards.${s.key}.items`) as string[];

          return (
            <ServiceCard
              key={s.key}
              title={title}
              icon={s.icon}
              items={items}
              accentClass={s.accentClass}
            />
          );
        })}
      </div>
    </section>
  );
}
