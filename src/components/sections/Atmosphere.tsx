"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { TextReveal } from "@/components/shared/TextReveal";
import { Reveal } from "@/components/shared/Reveal";

export function Atmosphere() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const overlay = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 0.55, 0.85]);

  return (
    <section
      ref={ref}
      id="atmosphere"
      className="relative flex min-h-[92svh] items-center overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-[-12%] z-0">
        <Image
          src="/images/atmosphere.jpg"
          alt="Интерьер Smoke Dog Lounge"
          fill
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlay }}
        className="absolute inset-0 z-[1] bg-noir"
      />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-noir via-noir/55 to-transparent" />
      <div className="absolute inset-x-0 top-0 z-[2] h-40 bg-fade-bottom" />
      <div className="absolute inset-x-0 bottom-0 z-[2] h-40 bg-fade-top" />

      <div className="container-wide relative z-10 py-20 sm:py-24 lg:py-36">
        <div className="max-w-xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-gold/60" />
            <Eyebrow>Пространство</Eyebrow>
          </div>

          <TextReveal
            as="h2"
            text="Два этажа. Один ритм."
            className="mt-2 text-balance font-serif text-4xl leading-[1.05] text-bone sm:text-5xl lg:text-[3.6rem]"
          />

          <Reveal delay={0.2}>
            <p className="mt-8 text-pretty text-[16px] leading-relaxed text-bone/75 sm:text-lg">
              1400 м² под одним потолком: кальян, кухня, бар, VIP с PS5 и караоке.
              Снизу — мягкий свет и диваны. Сверху — музыка и движение до утра.
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { n: "270", l: "гостей" },
                { n: "2", l: "зала" },
                { n: "05:00", l: "закрытие" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-serif text-2xl text-gold-soft sm:text-3xl">{s.n}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ash">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
