import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 50%, #0e7490 100%)",
          color: "white",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 28,
            padding: "48px",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              opacity: 0.82,
            }}
          >
            Hedgehog Web Dev
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 900,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 800,
                lineHeight: 1.05,
              }}
            >
              Modern websites,
              <br />
              web apps & e-commerce
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 30,
                lineHeight: 1.35,
                opacity: 0.9,
              }}
            >
              Next.js, React, SEO, performance and headless CMS solutions.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              opacity: 0.72,
            }}
          >
            hedgehogwebdev.com
          </div>
        </div>
      </div>
    ),
    size
  );
}