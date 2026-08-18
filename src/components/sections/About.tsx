"use client";

import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Carousel } from "@/components/shared/Carousel";

const stats = [
  { value: "10–05", label: "ежедневно" },
  { value: "VIP", label: "караоке · PS5" },
  { value: "DJ", label: "пт · сб" },
];

// Плейсхолдер-набор для карусели — замените на новые фото, когда пришлёте:
// просто поменяйте src на файлы в public/images/gallery/ (см. README там же).
const aboutSlides = [
  { src: "/images/gallery/lounge-bright.jpg", alt: "Статуя бульдога в основном зале Smoke Dog" },
  { src: "/images/gallery/mirror-arches.jpg", alt: "Овальные подсвеченные зеркала и зелень" },
  { src: "/images/gallery/bulldog-statue-main.jpg", alt: "Овальные зеркала и книжные полки в зале" },
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-28 lg:py-36">
      <div className="container-wide relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <Carousel slides={aboutSlides} />
            <div className="pointer-events-none absolute -bottom-3 -right-3 -z-0 hidden h-full w-full border border-[#C4A574]/20 lg:block" />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="О пространстве"
              title="Характер без шума"
              intro="Ресторан · бар · кальяны · музыка"
            />

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-pretty text-[15px] leading-[1.75] text-[#9A9188] sm:text-base">
                Пространство для тихого ужина, долгих разговоров и вечеров,
                которые не хочется заканчивать.
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
