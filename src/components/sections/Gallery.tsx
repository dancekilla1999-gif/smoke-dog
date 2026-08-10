"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { gallery } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Lightbox } from "@/components/shared/Lightbox";
import { staggerContainer, staggerItem } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

const spanClass: Record<string, string> = {
  tall: "aspect-square",
  wide: "aspect-square",
  square: "aspect-square",
};

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);

  const slides = gallery.map((g) => ({ src: g.src, alt: g.alt }));

  return (
    <section id="gallery" className="relative border-t border-white/[0.07] bg-graphite/40 py-20 sm:py-24 lg:py-36">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Галерея"
          title="Загляните внутрь"
          intro="Интерьер, атмосфера и гости Smoke Dog."
          align="center"
          className="mb-16 lg:mb-20"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-8% 0px" }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4"
        >
          {gallery.map((item, i) => (
            <motion.button
              key={item.src}
              variants={staggerItem}
              onClick={() => setIndex(i)}
              aria-label={`Открыть фото: ${item.alt}`}
              className={cn(
                "group relative overflow-hidden rounded-sm bg-noir",
                spanClass[item.span ?? "square"] ?? "aspect-square"
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-[center_30%] transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-noir/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-gold/50 bg-noir/50 text-gold opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <Expand className="h-4 w-4" />
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <Lightbox
        slides={slides}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </section>
  );
}
