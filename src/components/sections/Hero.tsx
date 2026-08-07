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
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

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
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32 lg:items-center lg:pb-0 lg:pt-0"
    >
      {/* Background video */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-poster.jpg"
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
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/50 to-noir/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir/80 via-transparent to-transparent" />
      </motion.div>

      <motion.div style={{ opacity }} className="container-wide relative z-10 w-full">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 lg:items-end">
          {/* Left: main content */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-5 text-[10px] uppercase tracking-[0.35em] text-gold/90 sm:text-[11px]"
            >
              Москва · Холодильный пер.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="font-serif text-[2.75rem] leading-[1.05] text-bone sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
            >
              Smoke Dog
              <span className="mt-1 block text-[0.55em] font-sans font-light uppercase tracking-[0.28em] text-ash">
                Lounge & Bar
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-6 max-w-md text-[15px] leading-relaxed text-ash sm:text-base"
            >
              {site.descriptionShort.slice(0, 120)}…
            </motion.p>

            {/* CTAs — horizontal, sharp, not stacked pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" variant="gold">
                <Link href="/contacts#reserve">Забронировать</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/menu">Меню</Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link href="tel:+79942227777">{site.phone}</Link>
              </Button>
            </motion.div>
          </div>

          {/* Right: stats / zones — industrial cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
              {[
                { k: "2", v: "этажа" },
                { k: "1400", v: "м²" },
                { k: "10–05", v: "каждый день" },
                { k: "VIP", v: "PS5 · караоке" },
              ].map((item) => (
                <div
                  key={item.v}
                  className="flex flex-col justify-between bg-noir/80 px-5 py-6 backdrop-blur-md sm:px-6 sm:py-8"
                >
                  <span className="font-serif text-3xl text-gold-soft sm:text-4xl">
                    {item.k}
                  </span>
                  <span className="mt-2 text-[10px] uppercase tracking-[0.22em] text-ash">
                    {item.v}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
