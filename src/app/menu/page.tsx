import type { Metadata } from "next";
import { Menu } from "@/components/sections/Menu";
import { Bar } from "@/components/sections/Bar";
import { site } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Меню",
  description: `Меню кальянной и лаундж-бара ${site.name}: авторская кухня, коктейльная карта и кальянная карта. Сезонные блюда, сигнатурные коктейли, премиальный табак.`,
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="Кухня и бар"
        title="Вкус, продуманный до последней детали"
        subtitle="Мы относимся к кухне и бару одинаково серьёзно: сезонные ингредиенты, точные пропорции и подача, которая становится частью вечера."
      />
      <Menu />
      <Bar />
    </>
  );
}
