export const siteMetadata = {
  title: "Hedgehog Web Dev | Next.js & Headless Web Development",
  shortTitle: "Hedgehog Web Dev",
  author: "Darko Živić",
  headerTitle: "Hedgehog Web Dev",
  description:
    "Profesionalni web development u Next.js, React i Headless CMS okruženju. Izrada modernih web stranica, web aplikacija i e-commerce rješenja optimiziranih za brzinu, SEO i konverzije.",
  language: "hr_HR",
  locale: "hr_HR",
  theme: "system",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.hedgehogwebdev.com",
  siteLogo: "/logo.png",
  socialBanner: "/social-media.png",
  email: "zivic.darko79@gmail.com",
  facebook: "https://www.facebook.com/messages/t/100074828598715/?locale=hr_HR",
  keywords: [
    "Web development Hrvatska",
    "Next.js developer",
    "React developer",
    "Headless CMS",
    "Strapi developer",
    "WooCommerce headless",
    "Izrada web stranica",
    "Izrada web shopa",
    "SEO optimizacija",
    "VPS deploy",
    "Custom web aplikacije",
    "Freelance developer Hrvatska",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
} as const;

export function absoluteSiteUrl(path = "") {
  const base = siteMetadata.siteUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}