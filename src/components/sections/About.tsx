"use client";

import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Carousel, type CarouselSlide } from "@/components/shared/Carousel";

const stats = [
  { value: "10–05", label: "ежедневно" },
  { value: "ВИП", label: "караоке · PS5" },
  { value: "Диджей", label: "пт · сб" },
];

// Плейсхолдер-набор для карусели — замените на новые фото, когда пришлёте:
// просто поменяйте src на файлы в public/images/gallery/ (см. README там же).
const aboutSlides = [
  { src: "/images/gallery/lounge-bright.jpg", alt: "Статуя бульдога в основном зале Смок Дог" },
  { src: "/images/gallery/mirror-arches.jpg", alt: "Овальные подсвеченные зеркала и зелень" },
  { src: "/images/gallery/bulldog-statue-main.jpg", alt: "Овальные зеркала и книжные полки в зале" },
  { src: "/images/gallery/bar-candles.jpg", alt: "Барная стойка при свечах" },
  { src: "/images/gallery/bulldog-statue-hookah.jpg", alt: "Зал Смок Дог со свечами и подсвеченными арками" },
];

// Галерея блюд для карусели на /about ("Еда") — реальные фото с фотосъёмки кухни.
export const aboutFoodSlides: CarouselSlide[] = [
  { src: "/images/menu/banner-pizza.jpg", alt: "Пицца четыре сыра с бураттой — кухня Смок Дог" },
  { src: "/images/menu/pasta-mushroom.jpg", alt: "Паппарделле с грибным соусом — кухня Смок Дог" },
  { src: "/images/menu/salad-greek.jpg", alt: "Греческий салат с фетой и овощами" },
  { src: "/images/menu/dessert-fondant.jpg", alt: "Шоколадный фондан с мороженым и ягодами" },
  { src: "/images/menu/food-charcuterie.jpg", alt: "Мясная нарезка с соусом на подаче Смок Дог" },
  { src: "/images/menu/food-mushroom-cream.jpg", alt: "Грибной салат со сливочной заправкой" },
  { src: "/images/menu/food-cheesecake.jpg", alt: "Чизкейк с ягодами — десерт Смок Дог" },
  { src: "/images/menu/food-sushi-set.jpg", alt: "Сет роллов с соевым соусом" },
  { src: "/images/menu/food-antipasti.jpg", alt: "Антипасти с хлебными палочками и оливками" },
  { src: "/images/menu/food-fruit-plate.jpg", alt: "Фруктовая тарелка со свежими ягодами" },
  { src: "/images/menu/food-steak.jpg", alt: "Стейк на гриле с кукурузой и соусом" },
  { src: "/images/menu/tartare-salmon-avocado.jpg", alt: "Тартар из лосося на авокадо — подача Смок Дог" },
];

interface AboutProps {
  /** На /about эту же мысль уже раскрывает подзаголовок PageHero сверху страницы —
   * прячем здесь intro, чтобы текст не дублировался. На главной остаётся как есть. */
  hideIntro?: boolean;
  /** Переопределяет фото карусели — используется на /about для блока «Еда». */
  slides?: CarouselSlide[];
}

export function About({ hideIntro = false, slides = aboutSlides }: AboutProps) {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-28 lg:py-36">
      <div className="container-wide relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <Carousel slides={slides} />
            <div className="pointer-events-none absolute -bottom-3 -right-3 -z-0 hidden h-full w-full border border-[#C4A574]/20 lg:block" />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="О пространстве"
              title="Характер без шума"
              intro={
                hideIntro
                  ? undefined
                  : "Ресторан · бар · кальяны · музыка — пространство для тихого ужина, долгих разговоров и вечеров, которые не хочется заканчивать."
              }
            />

            <Reveal delay={0.2}>
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/[0.07] pt-9">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-serif text-2xl text-gold-soft sm:text-3xl lg:text-4xl">
                      {s.value}
                    </div>
                    <div className="mt-2 text-[12px] uppercase tracking-[0.2em] text-ash">
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
