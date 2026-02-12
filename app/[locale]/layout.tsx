import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import "@/app/globals.css";
import { DottedBackground } from "@/components/background/DottedBackground";
import { NavBar } from "@/components/navigation/NavBar";
import Footer from "@/components/footer/Footer";
import CookiesToast from "@/components/cookies/CookiesToast";

import { SUPPORTED_LOCALES, type Locale, DEFAULT_LOCALE, buildAlternates } from "@/app/utils/seo";

const geistSans = localFont({
  src: [
    { path: "../../public/fonts/geist/geist-latin.woff2", style: "normal" },
    { path: "../../public/fonts/geist/geist-latin-ext.woff2", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    { path: "../../public/fonts/geist/geist-mono-latin.woff2", style: "normal" },
    { path: "../../public/fonts/geist/geist-mono-latin-ext.woff2", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

// ✅ Layout-level metadata (za /hr i /en root)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (SUPPORTED_LOCALES.includes(raw as Locale) ? (raw as Locale) : DEFAULT_LOCALE);

  return {
    title: {
      default: "Hedgehog Web Dev",
      template: "%s | Hedgehog Web Dev",
    },
    description:
      locale === "hr"
        ? "Profesionalna izrada web stranica, web aplikacija i web shopova (Next.js, React, SEO, brzina)."
        : "Professional websites, web apps and e-commerce builds (Next.js, React, SEO, performance).",
    alternates: buildAlternates(locale, "/"), // canonical: /hr ili /en
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const currentYear = new Date().getFullYear();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DottedBackground />
          <NavBar />
          <div className="relative z-10 min-h-screen">{children}</div>
          <CookiesToast />
          <Footer currentYear={currentYear} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}