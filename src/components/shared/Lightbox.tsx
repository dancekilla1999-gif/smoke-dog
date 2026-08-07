"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect } from "react";

interface Slide {
  src: string;
  alt: string;
}

interface LightboxProps {
  slides: Slide[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

/**
 * Полноэкранный просмотр фото с навигацией и клавиатурой.
 */
export function Lightbox({ slides, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + slides.length) % slides.length);
  }, [index, slides.length, onNavigate]);

  const next = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % slides.length);
  }, [index, slides.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, prev, next]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-noir/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            aria-label="Закрыть"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone transition hover:border-gold hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            aria-label="Предыдущее"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone transition hover:border-gold hover:text-gold sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            aria-label="Следующее"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone transition hover:border-gold hover:text-gold sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <motion.div
            key={index}
            className="relative mx-4 h-[76vh] w-[92vw] max-w-5xl"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={slides[index].src}
              alt={slides[index].alt}
              fill
              sizes="92vw"
              className="object-contain"
              priority
            />
          </motion.div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-wide2 text-ash">
            {index + 1} / {slides.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
