"use client";

import { JungleAmbience } from "@/components/shared/JungleAmbience";
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
      ref={ref} id="atmosphere" className="relative flex min-h-[92svh] items-center overflow-hidden"
    >
      <JungleAmbience />
      <motion.div style={{ y }} className="absolute inset-[-12%] z-0">
        <Image
          src="/images/atmosphere.jpg"
          alt="Атмосфера Smoke Dog — атмосфера lounge бара"
          fill
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlay }}
        className="absolute inset-0 z-[1] bg-noir"
      />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-noir via-noir/50 to-transparent" />
      <div className="absolute inset-x-0 top-0 z-[2] h-40 bg-fade-bottom" />
      <div className="absolute inset-x-0 bottom-0 z-[2] h-40 bg-fade-top" />

      <div className="container-wide relative z-10 py-20 sm:py-24 lg:py-36">
        <div className="max-w-2xl">
          <Eyebrow>Атмосфера</Eyebrow>

          <TextReveal
            as="h2"
            text="Атмосфера, созданная для чувств"
            className="mt-6 text-balance font-serif text-4xl leading-[1.05] text-bone sm:text-5xl lg:text-[3.8rem]"
          />

          <Reveal delay={0.2}>
            <p className="mt-8 text-pretty text-lg leading-relaxed text-bone/80">
              Приглушённый свет, премиальный интерьер и атмосфера, которая
              ловит каждый отблеск. Здесь звук, вкус и свет работают вместе —
              чтобы вечер запомнился не деталями, а ощущением.
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-12 flex items-center gap-5">
              <span className="h-px w-16 bg-gold/70" />
              <p className="font-serif text-xl italic text-gold-soft sm:text-2xl">
                Живое пространство · Живые эмоции
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
