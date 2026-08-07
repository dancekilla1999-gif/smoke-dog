"use client";

import { JungleAmbience } from "@/components/shared/JungleAmbience";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const stats = [
  { value: "2025", label: "Год открытия" },
  { value: "10", label: "Часов до рассвета" },
  { value: "∞", label: "Живых эмоций" },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-24 lg:py-36">
      <JungleAmbience />
      <div className="container-wide relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div ref={ref} className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <motion.div style={{ y }} className="absolute inset-[-6%]">
                <Image
                  src="/images/interior-hall.jpg"
                  alt="Зал Smoke Dog — хрусталь, зелень и тёплый свет"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[center_40%]"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent" />
            </div>
            <div className="pointer-events-none absolute -bottom-4 -right-4 -z-0 hidden h-full w-full rounded-sm border border-gold/20 lg:block" />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="О пространстве"
              title="Пространство, где вечер меняет свой ритм"
              intro="Smoke Dog — самый большой lounge бар в России. 2 этажа и более 1400 м²: от спокойных релакс-зон с живым вокалом до вечеринок с топовыми DJ. VIP-зоны с караоке, PlayStation 5 и настольными играми."
            />

            <Reveal delay={0.12}>
              <p className="mt-6 text-pretty text-[15px] leading-[1.75] text-ash sm:text-base">
                На первом этаже — спокойная обстановка для встреч и ужина. VIP-зоны
                с караоке и PlayStation 5. На втором этаже — большое пространство
                для ярких вечеринок с концертной площадкой и диджеями.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.07] pt-8 sm:gap-6 sm:mt-12">
                {stats.map((s) => (
                  <div key={s.label} className="text-center sm:text-left">
                    <div className="font-serif text-3xl leading-none text-gold-soft sm:text-4xl lg:text-5xl">
                      {s.value}
                    </div>
                    <div className="mt-2.5 text-[10px] uppercase tracking-wide2 text-ash/90 sm:text-xs">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
