import type { Metadata } from "next";
import { AboutMe } from "@/components/about/AboutMe";
import { SUPPORTED_LOCALES, type Locale, DEFAULT_LOCALE, buildAlternates } from "@/app/utils/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (SUPPORTED_LOCALES.includes(raw as Locale) ? (raw as Locale) : DEFAULT_LOCALE);

  return {
    title: locale === "hr" ? "O meni" : "About",
    description:
      locale === "hr"
        ? "Saznaj više o Darku Živiću i Hedgehog Web Dev pristupu: Next.js, React, SEO i performance."
        : "Learn more about Darko Živić and Hedgehog Web Dev approach: Next.js, React, SEO and performance.",
    alternates: buildAlternates(locale, "/about"),
  };
}

export default function AboutPage() {
  return <AboutMe />;
}