import type { Metadata } from "next";
import { About, aboutFoodSlides } from "@/components/sections/About";
import { ConceptStates } from "@/components/sections/ConceptStates";
import { Atmosphere } from "@/components/sections/Atmosphere";
import { site } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "О нас",
  description: `${site.name} — ресторан, бар и кальянное пространство у метро Тульская в Москве. Авторская кухня, премиальные кальяны, музыка и атмосфера, в которой хочется задержаться.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О пространстве"
        title="Место для вечеров со своим характером"
        subtitle="Смок Дог — это ресторан, бар и кальянное пространство в одном ритме. Авторская кухня, премиальные кальяны, музыка и атмосфера, в которой хочется задержаться. Тихий ужин, встреча с друзьями, вечер в ВИП или ночь под диджея — здесь каждый вечер может быть особенным."
      />
      <About slides={aboutFoodSlides} />
      <ConceptStates />
      <Atmosphere />
    </>
  );
}
