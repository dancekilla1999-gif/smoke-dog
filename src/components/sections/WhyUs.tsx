"use client";

import { advantages } from "@/lib/data";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Sparkles, Music4, UtensilsCrossed, Wine, Crown, Gamepad2, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Sparkles,
  Music4,
  UtensilsCrossed,
  Wine,
  Crown,
  Leaf: Sparkles,
  Gamepad2,
};

export function WhyUs() {
  return (
    <section className="relative py-24 sm:py-28 lg:py-32">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Smoke Dog"
          title="Что внутри"
          intro="Только то, за чем приходят."
          align="center"
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item, i) => {
            const Icon = icons[item.icon] || Sparkles;
            return (
              <Reveal key={item.title} delay={0.06 * i}>
                <div className="group rounded-sm border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-500 hover:border-[#C4A574]/25 hover:bg-white/[0.04]">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#C4A574]/25 text-[#C4A574] transition-colors group-hover:border-[#C4A574]/50">
                    <Icon className="h-5 w-5" strokeWidth={1.4} />
                  </span>
                  <h3 className="mt-6 font-serif text-xl text-[#F3EEE6]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8A8076]">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
