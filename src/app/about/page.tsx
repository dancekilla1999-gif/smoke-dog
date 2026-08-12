import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { ConceptStates } from "@/components/sections/ConceptStates";
import { Atmosphere } from "@/components/sections/Atmosphere";
import { WhyUs } from "@/components/sections/WhyUs";
import { site } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "О нас",
  description: `${site.name} — лаундж-бар и кальянная в Москве, самый большой lounge бар в России. Концепция, атмосфера и философия вечера.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О пространстве"
        title="Где вечер меняет свой ритм"
        subtitle="Smoke Dog — это самый большой лаундж-бар и кальянная в России. Сочетание сдержанной роскоши и современных технологий создают атмосферу, в которой время идёт иначе."
      />
      <About />
      <ConceptStates />
      <Atmosphere />
      <WhyUs />
    </>
  );
}
