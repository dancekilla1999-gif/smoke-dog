"use client";

import { conceptStates } from "@/lib/data";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function ConceptStates() {
  return (
    <section className="relative py-24 sm:py-28 lg:py-32">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Формат"
          title="Три настроения"
          intro="Выбираете темп — мы подстраиваем вечер."
          align="center"
        />

        <div className="mt-16 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
          {conceptStates.map((state, i) => (
            <Reveal key={state.title} delay={0.08 * i}>
              <div className="group h-full bg-[#0A0A0C] p-8 transition-colors duration-500 hover:bg-[#0E0E11] sm:p-10">
                <span className="font-serif text-4xl text-[#C4A574]/25 transition-colors group-hover:text-[#C4A574]/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-serif text-2xl text-[#F3EEE6]">{state.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8A8076]">{state.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
