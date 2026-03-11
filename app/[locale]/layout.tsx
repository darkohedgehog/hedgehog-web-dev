import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { DottedBackground } from "@/components/background/DottedBackground";
import { NavBar } from "@/components/navigation/NavBar";
import Footer from "@/components/footer/Footer";
import CookiesToast from "@/components/cookies/CookiesToast";

import {
  SUPPORTED_LOCALES,
  type Locale,
  DEFAULT_LOCALE,
  buildAlternates,
} from "@/app/utils/seo";
import { absoluteSiteUrl, siteMetadata } from "@/lib/site-metadata";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

function normalizeLocale(raw: string): Locale {
  return SUPPORTED_LOCALES.includes(raw as Locale)
    ? (raw as Locale)
    : DEFAULT_LOCALE;
}

function getLocaleMeta(locale: Locale) {
  if (locale === "hr") {
    return {
      title: "Hedgehog Web Dev",
      description:
        "Profesionalna izrada web stranica, web aplikacija i web shopova (Next.js, React, SEO, brzina).",
      ogDescription: "Profesionalna izrada web stranica i web aplikacija.",
      ogLocale: "hr_HR",
    };
  }

  return {
    title: "Hedgehog Web Dev",
    description:
      "Professional websites, web apps and e-commerce builds (Next.js, React, SEO, performance).",
    ogDescription: "Professional websites and web apps.",
    ogLocale: "en_US",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const meta = getLocaleMeta(locale);

  const localePath = `/${locale}`;

  return {
    title: {
      default: meta.title,
      template: `%s | ${siteMetadata.shortTitle}`,
    },
    description: meta.description,
    alternates: buildAlternates(locale, "/"),
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      url: absoluteSiteUrl(localePath),
      siteName: siteMetadata.shortTitle,
      locale: meta.ogLocale,
      type: "website",
      images: [
        {
          url: absoluteSiteUrl(siteMetadata.socialBanner),
          width: 1200,
          height: 630,
          alt:
            locale === "hr"
              ? "Hedgehog Web Dev - profesionalna izrada web stranica"
              : "Hedgehog Web Dev - professional websites and web apps",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.ogDescription,
      images: [absoluteSiteUrl(siteMetadata.socialBanner)],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const currentYear = new Date().getFullYear();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DottedBackground />
      <NavBar />
      <div className="relative z-10 min-h-screen">{children}</div>
      <CookiesToast />
      <Footer currentYear={currentYear} />
    </NextIntlClientProvider>
  );
}