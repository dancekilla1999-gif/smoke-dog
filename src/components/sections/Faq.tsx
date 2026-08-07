"use client";

import Link from "next/link";
import { faq, site } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-36">
      <div className="container-wide">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="Вопросы"
              title="Всё, что важно знать"
              intro="Не нашли ответ? Напишите или позвоните — менеджер на связи."
            />

            <Reveal delay={0.15}>
              <div className="mt-9 space-y-2">
                <a
                  href={`tel:${site.phoneHref}`}
                  className="block font-serif text-2xl text-gold-soft transition-colors hover:text-gold"
                >
                  {site.phone}
                </a>
                <Link
                  href="/contacts#reserve"
                  className="inline-block text-[13px] uppercase tracking-wide2 text-ash transition-colors hover:text-gold"
                >
                  Или забронируйте онлайн →
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="border-t border-white/[0.07]">
              {faq.map((item, i) => (
                <AccordionItem key={item.q} value={`item-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
