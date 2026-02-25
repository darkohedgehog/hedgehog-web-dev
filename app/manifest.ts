import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hedgehog Web Dev",
    short_name: "Hedgehog Web Dev",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0ea5e9",
    icons: [
      { src: "/icon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon/icon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}