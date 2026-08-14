"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { site } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32 lg:items-center lg:pb-0 lg:pt-0"
    >
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-main.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover object-center transition-opacity duration-1000 ${
              videoReady ? "opacity-0" : "opacity-100"
            }`}
          />
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            src="/videos/hero-ambient.mp4"
            poster="/images/hero/hero-main.jpg"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/55 to-[#070708]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070708]/80 via-[#070708]/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(196,165,116,0.08),transparent_55%)]" />
      </motion.div>

      <motion.div style={{ opacity }} className="container-wide relative z-10 w-full">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-[10px] uppercase tracking-[0.42em] text-[#C4A574]/90"
          >
            {site.address.city} · м. {site.address.metro} · {site.address.street}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(2.75rem,8vw,5.5rem)] font-light leading-[0.95] tracking-[-0.03em] text-[#F3EEE6]"
          >
            Smoke Dog
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-[#B8AFA3] sm:text-base"
          >
            Лаундж-бар и кальянная. Кухня, бар, музыка до утра.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Button asChild size="lg" variant="gold">
              <Link href="/contacts#reserve">Забронировать</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/menu">Меню</Link>
            </Button>
            <a
              href={`tel:${site.phoneHref}`}
              className="ml-1 hidden text-[12px] tracking-[0.14em] text-[#C4A574]/80 transition-colors hover:text-[#E8D5B5] sm:inline-flex"
            >
              {site.phone}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-14 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/[0.08] pt-8 text-[10px] uppercase tracking-[0.24em] text-[#8A8076]"
          >
            <span>Ежедневно 10:00–05:00</span>
            <span>VIP · PS5 · Караоке</span>
            <span>DJ · Пт–Сб</span>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">scroll</span>
        <span className="h-8 w-px overflow-hidden bg-white/15">
          <span className="block h-2 w-px animate-scroll-dot bg-[#C4A574]" />
        </span>
      </div>
    </section>
  );
}
