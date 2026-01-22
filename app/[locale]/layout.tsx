import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import "@/app/globals.css";
import { DottedBackground } from "@/components/background/DottedBackground";
import { NavBar } from "@/components/navigation/NavBar";
import Footer from "@/components/footer/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DottedBackground />
          <NavBar />
          <div className="relative z-10 min-h-screen">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}