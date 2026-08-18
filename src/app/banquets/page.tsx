import type { Metadata } from "next";
import { BanquetForm } from "@/components/sections/BanquetForm";
import { site } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Банкеты и мероприятия",
  description: `Банкеты, корпоративы и частные вечеринки в ресторане, баре и кальянном пространстве ${site.name}. Приватные зоны, индивидуальное меню, полное сопровождение — а для больших событий второй этаж SOUL.`,
  alternates: { canonical: "/banquets" },
};

export default function BanquetsPage() {
  return (
    <>
      <PageHero
        eyebrow="Банкеты"
        title="Ваш праздник в Smoke Dog"
        subtitle="Дни рождения, корпоративы, свадьбы, частные вечеринки — мы берём на себя пространство, меню и атмосферу. Приватные зоны, персональное меню и полное сопровождение."
      />
      <BanquetForm />
    </>
  );
}
