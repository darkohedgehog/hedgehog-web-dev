import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const withNextIntl = createNextIntlPlugin();

const isDev = process.env.NODE_ENV === "development";
const allowLocalImages = process.env.ALLOW_LOCAL_IMAGES === "true";

const STRAPI_HOST = process.env.STRAPI_HOST ?? "localhost";
const STRAPI_PORT = process.env.STRAPI_PORT ?? "1337";

const remotePatterns: RemotePattern[] = [];

// ✅ Local patterns (dev ili kad eksplicitno dozvoliš)
if (isDev || allowLocalImages) {
  remotePatterns.push({
    protocol: "http",
    hostname: "localhost",
    port: STRAPI_PORT,
    pathname: "/uploads/**",
  });

  remotePatterns.push({
    protocol: "http",
    hostname: "127.0.0.1",
    port: STRAPI_PORT,
    pathname: "/uploads/**",
  });
}

// ✅ Prod Strapi domen (ako nije lokalni)
if (!["localhost", "127.0.0.1"].includes(STRAPI_HOST)) {
  remotePatterns.push({
    protocol: "https",
    hostname: STRAPI_HOST,
    pathname: "/uploads/**",
  });
}

// ✅ Cloudinary
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