"use client";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

const notes = [
  {
    title: "Авторские коктейли",
    text: "Как дневник шеф-бармена: его фавориты, открытия и личные эксперименты.",
  },
  {
    title: "Винный угол",
    text: "Карта, составленная с душой: от приветливых сортов до бутылок с характером, которые стоит открыть именно сегодня.",
  },
  {
    title: "Безалкогольное меню",
    text: "Не компромисс, а полноценная глава вечера для тех, кто хочет ясной головы и ярких эмоций.",
  },
];

export function Bar() {
  return (
    <section className="relative border-t border-white/[0.07] bg-graphite/40 py-20 sm:py-24 lg:py-36">
      <div className="container-wide">
        <div className="max-w-2xl">
          <div>
            <SectionHeading
              eyebrow="Бар"
              title="Ещё один повод задержаться за столиком"
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
        </div>
      </div>
    </section>
  );
}
