"use client";

import { motion } from "framer-motion";
import {
  Crown,
  Leaf,
  Music4,
  Sparkles,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { advantages } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { staggerContainer, staggerItem } from "@/components/shared/Reveal";

const icons: Record<string, LucideIcon> = {
  Sparkles,
  Music4,
  UtensilsCrossed,
  Wine,
  Leaf,
  Crown,
};

export function WhyUs() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-36">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Почему Smoke Dog"
          title="Что внутри"
          intro="Площадь, звук, кухня и кальян — без лишней поэзии. Только то, за чем приходят."
          align="center"
          className="mb-16 lg:mb-20"
        />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="grid gap-px overflow-hidden rounded-sm border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3"
        >
          {advantages.map((item) => {
            const Icon = icons[item.icon] ?? Sparkles;
            return (
              <motion.li
                key={item.title}
                variants={staggerItem}
                className="group relative bg-noir p-9 transition-colors duration-500 hover:bg-graphite lg:p-11"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/25 text-gold transition-all duration-500 group-hover:border-gold/60 group-hover:bg-gold/5">
                  <Icon className="h-5 w-5" strokeWidth={1.25} />
                </span>

                <h3 className="mt-7 font-serif text-2xl text-bone">{item.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-ash">
                  {item.text}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
