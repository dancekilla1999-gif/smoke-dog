"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

const notes = [
  {
    title: "Авторская карта",
    text: "Сигнатурные коктейли, созданные шеф-барменом специально для Smoke Dog.",
  },
  {
    title: "Вино и крепкое",
    text: "Глубокая винная карта, редкие позиции и сомелье, который подскажет.",
  },
  {
    title: "Безалкогольные",
    text: "Полноценные миксы без алкоголя — с тем же вниманием к балансу.",
  },
];

export function Bar() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <section className="relative border-t border-white/[0.07] bg-graphite/40 py-20 sm:py-24 lg:py-36">
      <div className="container-wide">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <SectionHeading
              eyebrow="Бар"
              title="Коктейли, продуманные до последней капли"
              intro="Мы относимся к бару так же, как к кухне: сезонные ингредиенты, точные пропорции и подача, которая становится частью вечера."
            />

            <Reveal delay={0.15}>
              <ul className="mt-12 space-y-8">
                {notes.map((n) => (
                  <li key={n.title} className="flex gap-5">
                    <span className="mt-3 h-px w-8 shrink-0 bg-gold/60" />
                    <div>
                      <h3 className="font-serif text-xl text-bone">{n.title}</h3>
                      <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-ash">
                        {n.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div ref={ref} className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <motion.div style={{ y }} className="absolute inset-[-7%]">
                <Image
                  src="/images/bar.jpg"
                  alt="Бар Smoke Dog — приготовление авторских коктейлей"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[center_25%]"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
