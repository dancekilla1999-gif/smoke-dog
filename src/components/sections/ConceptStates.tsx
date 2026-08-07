"use client";

import { motion } from "framer-motion";
import { conceptStates } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { staggerContainer, staggerItem } from "@/components/shared/Reveal";

/**
 * «Один вечер — несколько состояний».
 */
export function ConceptStates() {
  return (
    <section className="relative border-t border-white/[0.07] bg-graphite/50 py-20 sm:py-24 lg:py-32">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Концепция"
          title="Один вечер — несколько состояний"
          intro="В Smoke Dog вечер не стоит на месте. Он перетекает из одного настроения в другое — и вы выбираете свой ритм."
          align="center"
          className="mb-12 sm:mb-16 lg:mb-20"
        />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-8% 0px" }}
          className="grid gap-px overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.04] md:grid-cols-3"
        >
          {conceptStates.map((state, i) => (
            <motion.li
              key={state.title}
              variants={staggerItem}
              className="group relative bg-noir/95 p-8 transition-colors duration-500 hover:bg-graphite sm:p-9 lg:p-12"
            >
              <span className="font-serif text-4xl text-gold/20 transition-colors duration-500 group-hover:text-gold/40 sm:text-5xl">
                0{i + 1}
              </span>
              <h3 className="mt-5 font-serif text-xl text-bone sm:mt-6 sm:text-2xl lg:text-[1.7rem]">
                {state.title}
              </h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-ash sm:mt-4">
                {state.text}
              </p>
              <span className="mt-7 block h-px w-8 bg-gold/35 transition-all duration-500 group-hover:w-16 sm:mt-8" />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
