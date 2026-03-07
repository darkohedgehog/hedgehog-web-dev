import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const withNextIntl = createNextIntlPlugin();

const isDev = process.env.NODE_ENV === "development";
const allowLocalImages = process.env.ALLOW_LOCAL_IMAGES === "true";

const STRAPI_HOST = process.env.STRAPI_HOST ?? "api.hedgehogwebdev.com";
const STRAPI_PORT = process.env.STRAPI_PORT ?? "1337";

const remotePatterns: RemotePattern[] = [];

// Ako koristiš lokalni Strapi
if (isDev || allowLocalImages) {
  remotePatterns.push(
    {
      protocol: "http",
      hostname: "localhost",
      port: STRAPI_PORT,
      pathname: "/uploads/**",
    },
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: STRAPI_PORT,
      pathname: "/uploads/**",
    }
  );
}

// Ako STRAPI_HOST nije lokalni, dodaj ga kao produkcioni host
if (!["localhost", "127.0.0.1"].includes(STRAPI_HOST)) {
  remotePatterns.push({
    protocol: "https",
    hostname: STRAPI_HOST,
    pathname: "/uploads/**",
  });
}

// Cloudinary
remotePatterns.push({
  protocol: "https",
  hostname: "res.cloudinary.com",
  pathname: "/dhkmlqg4o/**",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    dangerouslyAllowLocalIP: isDev || allowLocalImages,
  },
};

export default withNextIntl(nextConfig);