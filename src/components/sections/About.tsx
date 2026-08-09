"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const stats = [
  { value: "10–05", label: "ежедневно" },
  { value: "VIP", label: "караоке · PS5" },
  { value: "DJ", label: "пт · сб" },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-28 lg:py-36">
      <div className="container-wide relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div ref={ref} className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <motion.div style={{ y }} className="absolute inset-[-8%]">
                <Image
                  src="/images/lounge-mood.jpg"
                  alt="Атмосфера Smoke Dog"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#070708]/70 via-transparent to-transparent" />
            </div>
            <div className="pointer-events-none absolute -bottom-3 -right-3 -z-0 hidden h-full w-full border border-[#C4A574]/20 lg:block" />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="О пространстве"
              title="Характер без шума"
              intro="Lounge & bar с кальяном, кухней и музыкой. Без пафоса — с настроением."
            />

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-pretty text-[15px] leading-[1.75] text-[#9A9188] sm:text-base">
                Свой вечер: тихий ужин, компания в VIP или ночь под DJ.
                Бульдог на логотипе — не шутка. Характер такой же.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/[0.07] pt-9">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-serif text-2xl text-[#C4A574] sm:text-3xl lg:text-4xl">
                      {s.value}
                    </div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#7A736C]">
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
