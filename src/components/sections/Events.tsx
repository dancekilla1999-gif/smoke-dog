"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Music4 } from "lucide-react";
import { events } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { staggerContainer, staggerItem } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Events() {
  return (
    <section id="events" className="relative overflow-hidden py-20 sm:py-24 lg:py-36">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Афиша"
          title="Вечера, которые невозможно повторить"
          intro="Живая музыка, DJ-сеты и иммерсивные перформансы — каждую пятницу и субботу."
          align="center"
          className="mb-16 lg:mb-20"
        />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {events.map((event) => (
            <motion.li
              key={event.title}
              variants={staggerItem}
              className={cn(
                "group relative overflow-hidden rounded-sm border border-white/[0.07] bg-graphite/50",
                event.featured && "lg:border-gold/35"
              )}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={event.poster}
                  alt={`${event.title} — ${event.subtitle}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-[center_20%] transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/35 to-transparent" />

                {event.featured && (
                  <span className="absolute left-5 top-5 border border-gold/50 bg-noir/60 px-3 py-1 text-[10px] uppercase tracking-eyebrow text-gold backdrop-blur-sm">
                    Главное событие
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl text-gold-soft">
                      {event.date}
                    </span>
                    <span className="text-[11px] uppercase tracking-eyebrow text-ash">
                      {event.weekday}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-2xl text-bone">
                    {event.title}
                  </h3>
                  <p className="mt-1.5 text-pretty text-sm text-ash">
                    {event.subtitle}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-white/[0.07] pt-4">
                    <p className="flex items-center gap-2 text-xs tracking-wide2 text-bone/70">
                      <Clock className="h-3.5 w-3.5 text-gold" />
                      Начало в {event.time}
                    </p>
                    {event.lineup.map((line) => (
                      <p
                        key={line}
                        className="flex items-center gap-2 text-xs tracking-wide2 text-ash"
                      >
                        <Music4 className="h-3.5 w-3.5 text-gold/70" />
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-14 flex justify-center">
          <Button asChild variant="gold" size="lg" data-cursor>
            <Link href="/contacts#reserve">Забронировать на вечер</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
