import type { Metadata } from "next";
import localFont from "next/font/local";

import "@/app/globals.css";

import { siteMetadata, absoluteSiteUrl } from "@/lib/site-metadata";

const geistSans = localFont({
  src: [
    { path: "../public/fonts/geist/geist-latin.woff2", style: "normal" },
    { path: "../public/fonts/geist/geist-latin-ext.woff2", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    { path: "../public/fonts/geist/geist-mono-latin.woff2", style: "normal" },
    { path: "../public/fonts/geist/geist-mono-latin-ext.woff2", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  applicationName: siteMetadata.shortTitle,
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,
  publisher: siteMetadata.author,
  keywords: [...siteMetadata.keywords],
  robots: siteMetadata.robots,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    siteName: siteMetadata.shortTitle,
    type: "website",
    images: [
      {
        url: absoluteSiteUrl(siteMetadata.socialBanner),
        width: 1200,
        height: 630,
        alt: "Hedgehog Web Dev social banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [absoluteSiteUrl(siteMetadata.socialBanner)],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {children}
      </body>
    </html>
  );
}