import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Карта лояльности",
  description: `Программа лояльности ${site.name}: бонусы, привилегии и особые условия для постоянных гостей.`,
  alternates: { canonical: "/loyalty" },
};

const perks = [
  {
    title: "Накопление бонусов",
    text: "Часть каждого счёта возвращается бонусами — ими можно оплачивать визиты.",
  },
  {
    title: "Приоритетное бронирование",
    text: "Лучшие столы и зоны в пятницу и субботу — в первую очередь для участников программы.",
  },
  {
    title: "Закрытые события",
    text: "Приглашения на камерные вечера, дегустации и шоу до общего анонса.",
  },
  {
    title: "Персональный менеджер",
    text: "Для ВИП-уровня — отдельный контакт и помощь с организацией любых визитов.",
  },
];

export default function LoyaltyPage() {
  return (
    <>
      <PageHero
        eyebrow="Лояльность"
        title="Карта Смок Дог"
        subtitle="Привилегии для тех, кто возвращается. Бонусы, приоритет и особые вечера."
      />

      <section className="relative border-t border-white/[0.07] py-20 sm:py-24 lg:py-32">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[16px] leading-relaxed text-bone sm:text-base">
              Карта лояльности Смок Дог открывается после первого визита. Условия
              и уровень участия менеджер подскажет при бронировании или по
              телефону — всё просто и без лишней бюрократии.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:gap-8">
            {perks.map((p) => (
              <div
                key={p.title}
                className="rounded-sm border border-white/[0.08] bg-graphite/30 p-6 sm:p-8"
              >
                <h3 className="font-serif text-xl font-light text-bone sm:text-2xl">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">
                  {p.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 sm:mt-16 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="gold">
              <Link href="/contacts#reserve">Забронировать и оформить карту</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${site.phoneHref}`}>Позвонить: {site.phone}</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
