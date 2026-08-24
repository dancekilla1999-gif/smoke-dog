"use client";

import Image from "next/image";
import { conceptStates } from "@/lib/data";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function ConceptStates() {
  return (
    <section className="relative py-24 sm:py-28 lg:py-32">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Формат"
          title="Три сценария одного вечера"
          intro="Выбирайте настроение — остальное мы берём на себя."
          align="center"
        />

        <div className="mt-16 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
          {conceptStates.map((state, i) => (
            <Reveal key={state.title} delay={0.08 * i}>
              <div className="group h-full bg-[#0A0A0C] transition-colors duration-500 hover:bg-[#0E0E11]">
                {state.image && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={state.image}
                      alt={state.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover object-[center_40%] transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/10 to-transparent" />
                  </div>
                )}
                <div className="p-8 sm:p-10">
                  <span className="font-serif text-4xl text-gold transition-colors group-hover:text-gold-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 font-serif text-2xl text-bone">{state.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ash">{state.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
