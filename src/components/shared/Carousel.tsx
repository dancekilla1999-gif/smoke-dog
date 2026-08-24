"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
  src: string;
  alt: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  className?: string;
  intervalMs?: number;
}

/**
 * Лёгкая автопрокручиваемая карусель фото (без внешних библиотек —
 * тот же стек, что и остальной сайт: framer-motion + next/image).
 * Стрелки + точки для ручного листания, пауза при наведении,
 * поддержка prefers-reduced-motion (автопрокрутка отключается).
 */
export function Carousel({ slides, className, intervalMs = 5000 }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = setInterval(() => go(index + 1), intervalMs);
    return () => clearInterval(id);
  }, [index, paused, slides.length, intervalMs, go]);

  if (slides.length === 0) return null;

  return (
    <div
      className={cn("group/carousel relative aspect-[4/5] overflow-hidden rounded-sm", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={index === 0}
            className="object-cover object-[center_40%]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent" />

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Предыдущее фото"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-noir/50 text-bone opacity-0 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:text-gold group-hover/carousel:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Следующее фото"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-noir/50 text-bone opacity-0 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:text-gold group-hover/carousel:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                aria-label={`Показать фото ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === index ? "w-6 bg-gold" : "w-1.5 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
