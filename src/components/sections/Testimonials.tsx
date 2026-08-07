"use client";

import { JungleAmbience } from "@/components/shared/JungleAmbience";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, go]);

  const current = testimonials[index];

  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-24 lg:py-36">
      <JungleAmbience />
      <Image
        src="/images/ambient-dark.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-25"
      />
      <div className="absolute inset-0 -z-10 bg-noir/85" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-fade-bottom" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-fade-top" />

      <div
        className="container-wide"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Eyebrow align="center">Отзывы гостей</Eyebrow>

        <div className="relative z-10 mx-auto mt-12 min-h-[300px] max-w-3xl px-2 text-center sm:min-h-[280px]">
          <Quote
            aria-hidden
            className="mx-auto h-9 w-9 text-gold/40"
            strokeWidth={1}
          />

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <p className="text-balance font-serif text-2xl font-light leading-[1.35] text-bone sm:text-3xl lg:text-[2.1rem]">
                «{current.quote}»
              </p>
              <footer className="mt-8">
                <p className="text-sm tracking-wide2 text-gold-soft">
                  {current.author}
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-eyebrow text-ash">
                  {current.role}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="relative z-10 mt-12 flex items-center justify-center gap-6">
          <button
            aria-label="Предыдущий отзыв"
            onClick={() => go(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone/80 transition-all hover:border-gold hover:text-gold"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2.5">
            {testimonials.map((t, i) => (
              <button
                key={t.author}
                aria-label={`Отзыв ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === index ? "w-8 bg-gold" : "w-1.5 bg-white/25 hover:bg-white/50"
                )}
              />
            ))}
          </div>

          <button
            aria-label="Следующий отзыв"
            onClick={() => go(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone/80 transition-all hover:border-gold hover:text-gold"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
