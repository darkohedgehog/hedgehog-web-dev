"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";
import { useTranslations } from "next-intl";

type TypingOptions = {
  baseCharDelayMs?: number;
  jitterMs?: number;
  paragraphDelayMs?: number;
  startDelayMs?: number; // čekanje pre starta paragrafa
  prefix?: string; // "> "
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function useSequentialTyping(texts: string[], options: TypingOptions = {}) {
  const {
    baseCharDelayMs = 12,
    jitterMs = 18,
    paragraphDelayMs = 450,
    startDelayMs = 0,
    prefix = "> ",
  } = options;

  // 👇 start state je derived iz startDelayMs, bez setState u effect body
  const [started, setStarted] = useState<boolean>(() => startDelayMs === 0);

  const [paraIndex, setParaIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const total = texts.length;
  const isFinished = started && total > 0 && paraIndex >= total;

  // START gate: samo kad startDelayMs > 0 i još nismo startovali
  useEffect(() => {
    if (startDelayMs <= 0) return;
    if (started) return;

    const id = window.setTimeout(() => setStarted(true), startDelayMs);
    return () => window.clearTimeout(id);
  }, [startDelayMs, started]);

  const currentText = started && !isFinished ? (texts[paraIndex] ?? "") : "";

  useEffect(() => {
    if (!started) return;
    if (total === 0) return;
    if (paraIndex >= total) return;

    let timerId: number | undefined;

    const nextDelay = (() => {
      const delta = (Math.random() * 2 - 1) * jitterMs; // [-jitter,+jitter]
      return clamp(Math.round(baseCharDelayMs + delta), 6, 70);
    })();

    if (charIndex < currentText.length) {
      timerId = window.setTimeout(() => {
        setCharIndex((c) => c + 1);
      }, nextDelay);
    } else {
      timerId = window.setTimeout(() => {
        setParaIndex((p) => p + 1);
        setCharIndex(0);
      }, paragraphDelayMs);
    }

    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [
    started,
    total,
    paraIndex,
    charIndex,
    currentText.length,
    currentText,
    baseCharDelayMs,
    jitterMs,
    paragraphDelayMs,
  ]);

  const rendered = useMemo(() => {
    if (!started) return [];
    if (total === 0) return [];

    const safePara = Math.min(paraIndex, total);
    const completed = texts.slice(0, safePara).map((p) => `${prefix}${p}`);

    if (safePara >= total) return completed;

    const typingNow = `${prefix}${(texts[safePara] ?? "").slice(0, charIndex)}`;
    return [...completed, typingNow];
  }, [started, texts, total, paraIndex, charIndex, prefix]);

  const isTyping = started && total > 0 && paraIndex < total;

  return {
    started,
    rendered,
    isTyping,
    isFinished,
  };
}

export function AboutMe() {
  const t = useTranslations("AboutSection");

  const paragraphs = useMemo(
    () => [
      t("paragraph1"),
      t("paragraph2"),
      t("paragraph3"),
      t("paragraph4"),
      t("paragraph5"),
      t("paragraph6"),
      t("paragraph7"),
      t("paragraph8"),
    ],
    [t]
  );

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const START_DELAY_MS = 9800;

  const { rendered, isTyping, isFinished } = useSequentialTyping(paragraphs, {
    startDelayMs: START_DELAY_MS,
    baseCharDelayMs: 12,
    jitterMs: 16,
    paragraphDelayMs: 550,
    prefix: "> ",
  });

  // smooth auto-scroll dok se kuca
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [rendered]);

  return (
    <Terminal>
      <h1 className="sr-only">
        {t("title1")} {t("title2")}
      </h1>
      <TypingAnimation>&gt; npm install hedgehog@latest init</TypingAnimation>

      <AnimatedSpan className="text-green-500">✔ Next.js.</AnimatedSpan>
      <AnimatedSpan className="text-green-500">✔ React.js.</AnimatedSpan>
      <AnimatedSpan className="text-green-500">✔ Tailwind CSS.</AnimatedSpan>
      <AnimatedSpan className="text-green-500">✔ PostgreSQL.</AnimatedSpan>
      <AnimatedSpan className="text-green-500">✔ Strapi.</AnimatedSpan>
      <AnimatedSpan className="text-green-500">✔ WordPress.</AnimatedSpan>
      <AnimatedSpan className="text-green-500">✔ Learning MySQL.</AnimatedSpan>
      <AnimatedSpan className="text-green-500">✔ Installing dependencies.</AnimatedSpan>

      <AnimatedSpan className="text-blue-500">
        <span>ℹ Updated 1 file:</span>
        <span className="pl-2">- HedgehogWebDev/About Me</span>
      </AnimatedSpan>

      <TypingAnimation className="text-muted-foreground">
        Success! Project initialization completed.
      </TypingAnimation>

      <TypingAnimation className="text-muted-foreground">
        You may now add components.
      </TypingAnimation>

      {/* ABOUT PARAGRAPHS */}
      <div
        ref={scrollerRef}
        className="mt-6 flex max-h-[55vh] flex-col gap-y-4 overflow-y-auto pr-1 whitespace-normal! wrap-break-word!"
      >
        {rendered.map((text, idx) => {
          const isLastVisible = idx === rendered.length - 1;

          return (
            <p
              key={idx}
              className="text-sm leading-relaxed tracking-tight text-muted-foreground whitespace-normal! wrap-break-word!"
            >
              {text}
              {isLastVisible && (isTyping || isFinished) && (
                <span
                  className={isFinished ? "terminal-cursor terminal-cursor--breathe" : "terminal-cursor"}
                  aria-hidden="true"
                />
              )}
            </p>
          );
        })}
      </div>
    </Terminal>
  );
}
