"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

import { HiHome, HiUser } from "react-icons/hi2";
import { MdCall } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";

import LangSwitch from "./LangSwitch";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavBar() {
  const locale = useLocale();
  const t = useTranslations("NavData");

  const localeHref = useCallback(
    (slug?: string) => {
      const s = (slug ?? "").trim();
      if (s === "" || s === "/") return `/${locale}`;
      const normalized = s.startsWith("/") ? s.slice(1) : s;
      return `/${locale}/${normalized}`;
    },
    [locale]
  );

  const navItems = useMemo(
    () => [
      { name: t("home"), link: localeHref(""), icon: <HiHome /> },
      { name: t("about"), link: localeHref("about"), icon: <HiUser /> },
      { name: t("projects"), link: localeHref("projects"), icon: <TfiAnnouncement /> },
    ],
    [t, localeHref]
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <div className="relative w-full z-80 top-1">
      <Navbar>
        {/* Desktop */}
        <NavBody>
          <NavbarLogo href={localeHref("")} />
          <NavItems items={navItems} />

          <div className="flex items-center gap-4">
            <LangSwitch />
            <NavbarButton variant="primary" href={localeHref("contact")}>
              <span className="flex items-center justify-center gap-2 text-cyan-500">
                <MdCall /> {t("contact")}
              </span>
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo href={localeHref("")} />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu}>
            {/* Top: Links */}
            <div className="flex flex-col gap-1">
              {navItems.map((item, idx) => (
                <Link
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={closeMobileMenu}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2",
                    "text-slate-200/90 hover:text-white",
                    "hover:bg-white/5 ring-1 ring-transparent hover:ring-sky-300/20 transition"
                  )}
                >
                  {/* icon */}
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 group-hover:ring-sky-300/25 transition">
                    <span className="text-[18px] text-sky-300/80 group-hover:text-sky-300 transition">
                      {item.icon}
                    </span>
                  </span>

                  <span className="flex-1 text-sm font-medium">{item.name}</span>

                  {/* subtle chevron-ish dot */}
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400/60 group-hover:bg-sky-300/80 transition" />
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="my-2 h-px w-full bg-white/10" />

            {/* Middle: LangSwitch */}
            <div className="flex items-center justify-between rounded-xl px-3 py-2 bg-white/5 ring-1 ring-white/10">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-100">
                 {t("language")}
                </span>
                <span className="text-xs text-slate-300/80">
                  {locale === "en" ? "English" : "Hrvatski"}
                </span>
              </div>
              <LangSwitch />
            </div>

            {/* Bottom: CTA */}
            <div className="mt-3 flex w-full flex-col gap-3">
              <NavbarButton
                href={localeHref("contact")}
                onClick={closeMobileMenu}
                variant="primary"
                className="w-full"
              >
                <span className="flex items-center justify-center gap-2 text-cyan-500">
                  <MdCall /> {t("contact")}
                </span>
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}