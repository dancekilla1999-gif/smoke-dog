"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { site } from "@/lib/data";
import { Magnetic } from "@/components/shared/MagneticButton";

const heroButtons = [
  {
    label: "Забронировать",
    href: "/contacts#reserve",
    primary: true,
  },
  {
    label: "Карта лояльности",
    href: "/loyalty",
    primary: false,
  },
  {
    label: "Банкеты",
    href: "/banquets",
    primary: false,
  },
] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      v.play().catch(() => {});
    };
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener("loadeddata", tryPlay, { once: true });
  }, []);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex h-[100svh] min-h-[580px] items-center justify-center overflow-hidden"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Интерьер ресторана Smoke Dog — самый большой lounge бар в России"
            fill
            priority
            sizes="100vw"
            className={`object-cover object-[center_20%] transition-opacity duration-1000 ${
              videoReady ? "opacity-0" : "opacity-100"
            }`}
          />
          <video
            ref={videoRef}
            className={`absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-110 object-cover object-center transition-opacity duration-1000 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            src="/videos/hero-ambient.mp4"
            poster="/images/hero-poster.jpg"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            onCanPlay={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-noir/75 via-noir/45 to-noir" />
        <div className="absolute inset-0 bg-noir/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(6,5,5,0.8)_100%)]" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="container-wide relative z-10 flex flex-col items-center px-5 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-5 text-gold-soft sm:mb-7"
        >
          {site.address.city} · Restaurant &amp; Lounge
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-balance font-serif text-[2.5rem] font-light leading-[1.05] text-bone sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {site.concept}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-md text-pretty text-[15px] tracking-wide text-bone/75 sm:mt-7 sm:text-lg"
        >
          {site.tagline}
        </motion.p>

        {/* SD-style stacked CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex w-full max-w-[320px] flex-col gap-3 sm:mt-11 sm:max-w-[340px]"
        >
          {heroButtons.map((btn) => (
            <Magnetic key={btn.href}>
              <Link
                href={btn.href}
                className={
                  btn.primary
                    ? "flex h-12 w-full items-center justify-center rounded-full border border-gold/80 bg-gold/95 text-[12px] font-medium uppercase tracking-[0.18em] text-noir shadow-[0_12px_32px_-12px_rgba(176,139,90,0.7)] transition-all duration-300 hover:bg-gold-soft hover:shadow-[0_16px_40px_-10px_rgba(176,139,90,0.9)] active:scale-[0.98] sm:h-[3.15rem] sm:text-[13px]"
                    : "flex h-12 w-full items-center justify-center rounded-full border border-white/25 bg-noir/40 text-[12px] font-medium uppercase tracking-[0.18em] text-bone backdrop-blur-sm transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold active:scale-[0.98] sm:h-[3.15rem] sm:text-[13px]"
                }
              >
                {btn.label}
              </Link>
            </Magnetic>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 sm:bottom-10"
      >
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[9px] uppercase tracking-eyebrow text-bone/45">
            Листайте вниз
          </span>
          <div className="flex h-10 w-5 justify-center rounded-full border border-white/20 p-1">
            <span className="h-1.5 w-1 animate-scroll-dot rounded-full bg-gold" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
