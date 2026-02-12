import type { Metadata } from "next";
import ContactIntro from "@/components/contact/ContactIntro";
import ContactMe from "@/components/contact/ContactMe";
import { SUPPORTED_LOCALES, type Locale, DEFAULT_LOCALE, buildAlternates } from "@/app/utils/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (SUPPORTED_LOCALES.includes(raw as Locale) ? (raw as Locale) : DEFAULT_LOCALE);

  return {
    title: locale === "hr" ? "Kontakt" : "Contact",
    description:
      locale === "hr"
        ? "Kontaktiraj Hedgehog Web Dev za izradu web stranice, web aplikacije ili web shopa."
        : "Contact Hedgehog Web Dev for a website, web app, or e-commerce build.",
    alternates: buildAlternates(locale, "/contact"),
  };
}

export default function ContactPage() {
  return (
    <>
      <ContactIntro />
      <ContactMe />
    </>
  );
}