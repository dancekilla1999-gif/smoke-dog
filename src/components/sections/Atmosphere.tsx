"use client";

import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { TextReveal } from "@/components/shared/TextReveal";

export function Atmosphere() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/gallery/bulldog-statue-hookah.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070708] via-[#070708]/75 to-[#070708]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-transparent to-[#070708]/40" />
      </div>

      <div className="container-wide relative z-10 flex min-h-[70vh] items-center py-24">
        <div className="max-w-xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C4A574]/50" />
            <Eyebrow>Атмосфера</Eyebrow>
          </div>

          <TextReveal
            as="h2"
            text="Дым. Свет. Ритм."
            className="mt-2 text-balance font-serif text-4xl leading-[1.05] text-[#F3EEE6] sm:text-5xl lg:text-[3.5rem]"
          />

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-pretty text-[16px] leading-relaxed text-[#B8AFA3]">
              Приглушённый свет, кальян, барная стойка.
              Музыка, которая не мешает говорить — пока не приходит ночь.
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <p className="mt-10 font-serif text-xl italic text-[#C4A574]/90 sm:text-2xl">
              До 05:00 · каждый день
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
