"use client";

import React, { useRef, useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence, useInView } from "motion/react";
import Link from "next/link";
import { FiChevronDown, FiHelpCircle, FiMessageSquare } from "react-icons/fi";

export default function FaqSection() {
  const t = useTranslations("FaqSection");
  const itemCount = 8;
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  const [openAll, setOpenAll] = useState(false);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    btnRefs.current = btnRefs.current.slice(0, itemCount);
  }, [itemCount]);

  const toggle = (index: number) => {
    setOpenAll(false);
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleOpenAll = () => {
    setOpenAll(true);
    setOpenSet(new Set(Array.from({ length: itemCount }, (_, i) => i)));
  };
  const handleCloseAll = () => {
    setOpenAll(false);
    setOpenSet(new Set());
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const max = itemCount - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = index === max ? 0 : index + 1;
      btnRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = index === 0 ? max : index - 1;
      btnRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      btnRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      btnRefs.current[max]?.focus();
    }
  };

  const items: Array<{ q: string; a: string }> = [];
  for (let i = 0; i < itemCount; i++) {
    const q = t(`items.${i}.q`);
    const a = t(`items.${i}.a`);
    items.push({ q, a });
  }

  // entrance animation: detect in-view and reveal once
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref);
  const [revealed, setRevealed] = useState(false);
 
  const locale = useLocale();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handler = () => setPrefersReducedMotion(Boolean(mq.matches));
      mq.addEventListener?.("change", handler);
      return () => mq.removeEventListener?.("change", handler);
    }
    return;
  }, []);

  useEffect(() => {
    if (isInView && !revealed) {
      requestAnimationFrame(() => setRevealed(true));
    }
  }, [isInView, prefersReducedMotion, revealed]);

  const allOpen = openSet.size === itemCount;

  const sectionTransition = prefersReducedMotion ? "" : "transition-all duration-500 ease";
  const visible = revealed || isInView;

  return (
    <motion.section aria-labelledby="faq-title" className={`py-16 ${sectionTransition} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`} ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-3xl p-8 md:p-12 backdrop-blur-xl bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 border border-cyan-300/25 overflow-hidden shadow-2xl ring-1 ring-sky-400/8">
          <div className="absolute -inset-1 rounded-3xl blur-lg opacity-40" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.06), rgba(56,189,248,0.06))' }} />
          <div className="relative z-10">
            <h2 id="faq-title" className="text-3xl md:text-4xl font-semibold text-sky-400 text-center">
              {t("title")}
            </h2>
            <p className="mt-2 text-sky-200 mx-auto max-w-2xl text-center">{t("subtitle")}</p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 flex items-center justify-start md:justify-center">
                <span className="inline-flex items-center gap-2 bg-white/4 px-3 py-1 rounded-full text-sky-200 ring-1 ring-sky-400/12">
                  <FiHelpCircle className="w-4 h-4 text-sky-300" aria-hidden />
                  <span className="font-medium">FAQ</span>
                </span>
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => (allOpen ? handleCloseAll() : handleOpenAll())}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-white/3 to-white/6 text-sky-200 ring-1 ring-sky-400/15 hover:ring-sky-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 transition-shadow"
                  aria-pressed={allOpen}
                >
                  {allOpen ? t("collapseAll") : t("expandAll")}
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {items.map((it, idx) => {
                const isOpen = openSet.has(idx) || openAll;
                return (
                  <motion.div
                    key={idx}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.01, boxShadow: "0 0 35px rgba(56,189,248,0.4)" }}
                    className={`faq-card group relative bg-linear-to-br from-white/4 to-white/6 rounded-2xl p-4 md:p-6 ring-1 ring-white/6 backdrop-blur-sm border border-white/6 overflow-visible ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                    style={prefersReducedMotion ? undefined : { transitionDelay: `${idx * 40}ms` }}
                  >
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, rgba(56,189,248,0.06), rgba(56,189,248,0.02))', filter: 'blur(18px)' }} />
                    <h3 className="text-lg relative z-10">
                      <button
                        ref={(el) => { btnRefs.current[idx] = el }}
                        aria-controls={`faq-panel-${idx}`}
                        aria-expanded={isOpen}
                        onClick={() => toggle(idx)}
                        onKeyDown={(e) => onKeyDown(e, idx)}
                        className="w-full text-left flex items-center gap-4 justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg py-2"
                      >
                        <div className="flex items-center gap-3">
                          <FiMessageSquare className="w-5 h-5 text-sky-300" aria-hidden />
                          <span className="text-slate-100">{it.q}</span>
                        </div>
                        <div className="flex items-center">
                          <motion.span aria-hidden className="text-sky-200 transform transition-transform duration-200">
                            <FiChevronDown className="w-5 h-5" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 220ms ease' }} />
                          </motion.span>
                        </div>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${idx}`}
                          role="region"
                          aria-labelledby={`faq-panel-${idx}`}
                          key={`panel-${idx}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                          className="relative z-10 mt-3 text-sky-200 overflow-hidden"
                        >
                          <div className="leading-relaxed text-sky-200/90 py-2">
                            <p>{it.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-6 text-center text-sm text-sky-200/80">
              {t("microcopy")} <Link href={`/${locale}/contact`} className="text-sky-300 underline hover:text-sky-200">{t("contactLink")}</Link>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
