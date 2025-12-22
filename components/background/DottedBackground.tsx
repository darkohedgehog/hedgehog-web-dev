"use client";

import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export function DottedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base fallback (u slučaju da gradient varijable zabaguju) */}
      <div className="absolute inset-0 bg-[#0b1220]" />

      {/* Gradient layer */}
      <div className="absolute inset-0 bg-gradient-custom" />

      {/* Dots layer (iznad gradijenta) */}
      <DottedGlowBackground
        className="absolute inset-0 mask-radial-to-90% mask-radial-at-center"
        opacity={1.0}
        gap={12}
        radius={1.6}
        colorVar="--dot-color"
        glowColorVar="--glow-color"
        backgroundOpacity={0}
        speedMin={0.10}
        speedMax={0.30}
        speedScale={1.1}
      />
    </div>
  );
}