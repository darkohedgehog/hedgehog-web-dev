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

export const metadata: Metadata = {
  title: "Hedgehog Web Developer",
  description: "Izrada web aplikacija",
};

const SUPPORTED_LOCALES = ["hr", "en"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

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
          <CookiesToast/>
          <Footer currentYear={currentYear} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
