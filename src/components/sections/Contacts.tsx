"use client";

import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { site } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { ReviewQr } from "@/components/shared/ReviewQr";

const mapQuery = encodeURIComponent(`${site.address.city}, ${site.address.street}`);
const mapEmbed = `https://yandex.ru/map-widget/v1/?text=${mapQuery}&z=16`;
const mapLink = `https://yandex.ru/maps/?text=${mapQuery}`;

const socials = [
  { icon: Instagram, href: site.social.instagram, label: "Instagram" },
  { icon: Send, href: site.social.telegram, label: "Telegram" },
  { icon: MessageCircle, href: site.social.whatsapp, label: "WhatsApp" },
];

export function Contacts() {
  return (
    <section
      id="contacts"
      className="relative border-t border-white/[0.07] bg-graphite/40 py-20 sm:py-24 lg:py-36"
    >
      <div className="container-wide">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Контакты"
              title="Найдите нас в центре Москвы"
              intro="Мы рядом с центром, но за дверью начинается совсем другое пространство."
            />

            <Reveal delay={0.15}>
              <ul className="mt-12 space-y-9 border-t border-white/[0.07] pt-9">
                <li className="flex gap-5">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} />
                  <div>
                    <p className="eyebrow">Адрес</p>
                    <p className="mt-2 text-lg text-bone">{site.address.street}</p>
                    <p className="mt-1 text-sm text-ash">
                      {site.address.city}, {site.address.postal} · м. {site.address.metro}
                    </p>
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-[14px] uppercase tracking-wide2 text-gold transition-opacity hover:opacity-70"
                    >
                      Построить маршрут →
                    </a>
                  </div>
                </li>

                <li className="flex gap-5">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} />
                  <div>
                    <p className="eyebrow">Телефон</p>
                    <a
                      href={`tel:${site.phoneHref}`}
                      className="mt-2 block text-lg text-bone transition-colors hover:text-gold"
                    >
                      {site.phone}
                    </a>
                  </div>
                </li>

                <li className="flex gap-5">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} />
                  <div>
                    <p className="eyebrow">Email</p>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-2 block text-lg text-bone transition-colors hover:text-gold"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>

                <li className="flex gap-5">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} />
                  <div>
                    <p className="eyebrow">Часы работы</p>
                    <ul className="mt-2 space-y-1.5">
                      {site.hours.map((h) => (
                        <li key={h.day} className="text-sm text-ash">
                          <span className="text-bone">{h.day}</span> — {h.time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>

              <div className="mt-10 flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 text-bone transition-all hover:border-gold hover:text-gold"
                  >
                    <s.icon className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </Reveal>

            <div className="mt-10">
              <ReviewQr />
            </div>
          </div>

          <Reveal delay={0.12} className="h-full">
            <div className="relative h-[420px] overflow-hidden rounded-sm border border-white/[0.07] lg:h-full lg:min-h-[540px]">
              <iframe
                src={mapEmbed}
                title={`Карта: ${site.name}, ${site.address.street}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full grayscale-[0.55] contrast-[1.05] invert-[0.92] hue-rotate-180"
                style={{ border: 0 }}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/10" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
