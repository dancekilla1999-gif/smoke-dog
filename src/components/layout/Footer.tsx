import Link from "next/link";
import Image from "next/image";
import { Instagram, Send, MessageCircle } from "lucide-react";
import { nav, site } from "@/lib/data";

const socials = [
  { icon: Instagram, href: site.social.instagram, label: "Instagram" },
  { icon: Send, href: site.social.telegram, label: "Telegram" },
  { icon: MessageCircle, href: site.social.whatsapp, label: "WhatsApp" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.07] bg-graphite/70">
      <div className="container-wide py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image
              src="/images/logo.png"
              placeholder="empty"
              alt={site.name}
              width={140}
              height={50}
              className="h-9 w-auto bg-transparent"
              style={{ background: "transparent" }}
            />
            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-ash">
              {site.concept}. {site.tagline}.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-bone/70 transition-all duration-300 hover:border-gold/50 hover:text-gold"
                >
                  <s.icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="eyebrow">Навигация</h3>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ash transition-colors duration-300 hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow">Контакты</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ash">
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="transition-colors duration-300 hover:text-gold"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors duration-300 hover:text-gold"
                >
                  {site.email}
                </a>
              </li>
              <li className="pt-0.5 leading-relaxed">
                {site.address.city}, {site.address.street}
              </li>
              {site.hours.map((h) => (
                <li key={h.day} className="leading-relaxed">
                  <span className="text-bone/60">{h.day}:</span> {h.time}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-7 text-[11px] tracking-wide2 text-ash/60 sm:mt-14 sm:flex-row sm:text-xs">
          <p>
            © {year} {site.name} · {site.nameRu}. Все права защищены.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/contacts" className="transition-colors hover:text-gold">
              Политика конфиденциальности
            </Link>
            <Link href="/contacts#reserve" className="transition-colors hover:text-gold">
              Бронирование
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
