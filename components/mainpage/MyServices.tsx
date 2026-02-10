import React from "react";
import { Code2, Wrench, LineChart } from "lucide-react";

type Service = {
  title: string;
  icon: React.ReactNode;
  items: string[];
  accentClass: string; // za suptilni glow tint
};

const services: Service[] = [
  {
    title: "Web sajtovi & Web aplikacije",
    icon: <Code2 className="h-5 w-5" />,
    items: [
      "Landing stranice i prezentacije (SEO + brzina)",
      "Next.js / React aplikacije (App Router, i18n, CMS)",
      "E-commerce (shop, checkout, integracije)",
      "Admin paneli i dashboardi",
      "UI animacije (Framer Motion) + moderni dizajn",
    ],
    accentClass: "shadow-cyan-500/20 ring-cyan-300/15",
  },
  {
    title: "Održavanje & savetovanje",
    icon: <Wrench className="h-5 w-5" />,
    items: [
      "Održavanje i redovni update-i (Next/Node/Strapi/WP)",
      "Performance audit (Lighthouse, Core Web Vitals)",
      "Deploy & DevOps (VPS, Nginx, pm2, SSL)",
      "Bezbednost, backup strategija i monitoring",
      "Tehničke konsultacije + planiranje feature-a",
    ],
    accentClass: "shadow-sky-500/20 ring-sky-300/15",
  },
  {
    title: "Power BI & Data izveštaji",
    icon: <LineChart className="h-5 w-5" />,
    items: [
      "Interaktivni dashboard-i (prodaja, finansije, KPI)",
      "Modelovanje podataka (Power Query + DAX osnove)",
      "Automatski refresh i izvori (Excel/SQL/CSV/API)",
      "Vizuali, drill-down, filteri, role-based prikaz",
      "Izvoz i deljenje izveštaja za tim/klijente",
    ],
    accentClass: "shadow-emerald-500/20 ring-emerald-300/15",
  },
];

function ServiceCard({ title, icon, items, accentClass }: Service) {
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

      <ul className="mt-4 space-y-2 text-sm text-cyan-100/75">
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
  return (
    <section className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Title */}
      <div className="mb-10">
        <p className="text-xs tracking-widest uppercase text-cyan-400/80">
          Šta radim
        </p>

        <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-cyan-50">
          Moje usluge ⚡
        </h2>

        <p className="mt-3 max-w-2xl text-sm sm:text-base text-cyan-100/70">
          Fokus na brzinu, UX i čist kod — da projekat izgleda brutalno i radi bez
          nerviranja.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s.title} {...s} />
        ))}
      </div>
    </section>
  );
}