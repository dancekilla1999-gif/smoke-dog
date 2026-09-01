"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { menu, menuCategories, type MenuCategory } from "@/lib/data";
import { menuCarouselPhotos } from "@/lib/menuPhotos";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Carousel } from "@/components/shared/Carousel";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/shared/MagneticButton";
import { cn } from "@/lib/utils";

type Filter = "Все" | MenuCategory;

const filters: Filter[] = ["Все", ...menuCategories];

export function Menu() {
  const [active, setActive] = useState<Filter>("Все");

  const items = useMemo(
    () => (active === "Все" ? menu : menu.filter((i) => i.category === active)),
    [active]
  );

  return (
    <section id="menu" className="relative overflow-hidden py-20 sm:py-24 lg:py-36">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            eyebrow="Кухня"
            title="Гастрономия как часть впечатления"
            intro="Авторские сочетания, продукты сезона и подача, в которой важна каждая деталь."
          />
          <Reveal direction="left" delay={0.15}>
            <Magnetic strength={0.3}>
              <Button asChild variant="outline" size="lg" data-cursor>
                <Link href="/contacts#reserve">Забронировать стол</Link>
              </Button>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-y border-white/[0.07] py-5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                aria-pressed={active === f}
                className={cn(
                  "relative pb-1 text-[14px] uppercase tracking-wide2 transition-colors duration-300",
                  active === f ? "text-gold" : "text-ash hover:text-bone"
                )}
              >
                {f}
                {active === f && (
                  <motion.span
                    layoutId="menu-filter"
                    className="absolute inset-x-0 -bottom-[1px] h-px bg-gold"
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.ul layout className="mt-6 grid gap-x-16 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.li
                key={item.name}
                layout
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="group border-b border-white/8 py-7"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="font-serif text-xl text-bone transition-colors duration-300 group-hover:text-gold-soft sm:text-2xl">
                    {item.name}
                  </h3>
                  <span
                    aria-hidden
                    className="mb-1 hidden h-px flex-1 bg-white/10 sm:block"
                  />
                  <span className="shrink-0 whitespace-nowrap font-sans text-sm tracking-wide2 text-gold">
                    {item.weight && (
                      <span className="mr-2 text-ash">{item.weight}</span>
                    )}
                    {item.price}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-ash">
                    {item.description}
                  </p>
                )}

                {item.tag && (
                  <span className="mt-4 inline-block border border-gold/35 px-3 py-1 text-[12px] uppercase tracking-eyebrow text-gold">
                    {item.tag}
                  </span>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <Reveal delay={0.15}>
          <div className="mt-20">
            <Carousel
              slides={menuCarouselPhotos}
              fit="contain"
              showCaption
              sizes="(max-width: 1024px) 100vw, 1400px"
              intervalMs={4000}
              className="aspect-auto h-[320px] bg-noir sm:h-[420px] lg:h-[520px]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
