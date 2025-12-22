"use client";

import { useEffect, useMemo, useRef } from "react";

type DottedGlowBackgroundProps = {
  className?: string;
  /** distance between dot centers in pixels */
  gap?: number;
  /** base radius of each dot in CSS px */
  radius?: number;

  /** dot color */
  color?: string;
  /** glow color */
  glowColor?: string;

  /** optional CSS variable name for dot color (e.g. --dot-color) */
  colorVar?: string;
  /** optional CSS variable name for glow color (e.g. --glow-color) */
  glowColorVar?: string;

  /** global opacity for the whole layer */
  opacity?: number;
  /** background radial fade opacity (0 = transparent background) */
  backgroundOpacity?: number;

  /** minimum per-dot speed in rad/s */
  speedMin?: number;
  /** maximum per-dot speed in rad/s */
  speedMax?: number;
  /** global speed multiplier for all dots */
  speedScale?: number;
};

const resolveCssVariableFromRoot = (variableName?: string): string | null => {
  if (!variableName) return null;
  const normalized = variableName.startsWith("--") ? variableName : `--${variableName}`;
  const v = getComputedStyle(document.documentElement).getPropertyValue(normalized).trim();
  return v || null;
};

/**
 * Canvas-based dotted background that randomly glows and dims.
 * Single-theme (no dark/light detection).
 */
export const DottedGlowBackground = ({
  className,
  gap = 12,
  radius = 2,

  color = "rgba(255,255,255,0.35)",
  glowColor = "rgba(56, 189, 248, 0.7)",

  colorVar,
  glowColorVar,

  opacity = 0.6,
  backgroundOpacity = 0,

  speedMin = 0.06,
  speedMax = 0.18,
  speedScale = 1,
}: DottedGlowBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ✅ derived values — no state, no effect, no warnings
  const resolvedColor = useMemo(() => {
    if (typeof window === "undefined") return color;
    return resolveCssVariableFromRoot(colorVar) ?? color;
  }, [color, colorVar]);

  const resolvedGlowColor = useMemo(() => {
    if (typeof window === "undefined") return glowColor;
    return resolveCssVariableFromRoot(glowColorVar) ?? glowColor;
  }, [glowColor, glowColorVar]);

  useEffect(() => {
    const el = canvasRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const ctx = el.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stopped = false;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      el.width = Math.max(1, Math.floor(width * dpr));
      el.height = Math.max(1, Math.floor(height * dpr));
      el.style.width = `${Math.floor(width)}px`;
      el.style.height = `${Math.floor(height)}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let dots: { x: number; y: number; phase: number; speed: number }[] = [];

    const regenDots = () => {
      dots = [];
      const { width, height } = container.getBoundingClientRect();
      const cols = Math.ceil(width / gap) + 2;
      const rows = Math.ceil(height / gap) + 2;

      const min = Math.min(speedMin, speedMax);
      const max = Math.max(speedMin, speedMax);
      const span = Math.max(max - min, 0);

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * gap + (j % 2 === 0 ? 0 : gap * 0.5);
          const y = j * gap;
          const phase = Math.random() * Math.PI * 2;
          const speed = min + Math.random() * span;
          dots.push({ x, y, phase, speed });
        }
      }
    };

    regenDots();

    const draw = (now: number) => {
      if (stopped) return;

      const { width, height } = container.getBoundingClientRect();

      // clear
      ctx.clearRect(0, 0, el.width, el.height);

      // optional subtle vignette (usually 0 because you have gradient layer)
      if (backgroundOpacity > 0) {
        const grad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.4,
          Math.min(width, height) * 0.1,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.7
        );
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(
          1,
          `rgba(0,0,0,${Math.min(Math.max(backgroundOpacity, 0), 1)})`
        );
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.save();

      const time = (now / 1000) * Math.max(speedScale, 0);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const mod = (time * d.speed + d.phase) % 2;
        const lin = (Math.sin(time * d.speed + d.phase) + 1) / 2;
        const a = 0.15 + 0.65 * lin;

if (a > 0.5) {
  const glow = (a - 0.5) / 0.5;
  ctx.shadowColor = resolvedGlowColor;
  ctx.shadowBlur = 12 * glow;
}

        // glow when bright
        if (a > 0.55) {
          const glow = (a - 0.55) / 0.45; // 0..1
          ctx.shadowColor = resolvedGlowColor;
          ctx.shadowBlur = 5 * glow;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = a * opacity;
        ctx.fillStyle = resolvedColor;

        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      regenDots();
    };

    window.addEventListener("resize", handleResize);
    raf = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
    };
  }, [
    gap,
    radius,
    opacity,
    backgroundOpacity,
    speedMin,
    speedMax,
    speedScale,
    resolvedColor,
    resolvedGlowColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "absolute", inset: 0 }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
};