import type { Metadata } from "next";
import { Events } from "@/components/sections/Events";
import { site } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Афиша",
  description: `Афиша ${site.name}: живая музыка, DJ-сеты и иммерсивные шоу каждую пятницу и субботу.`,
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Афиша"
        title="Вечера, которые невозможно повторить"
        subtitle="Живая музыка, DJ-сеты и иммерсивные перформансы — каждую пятницу и субботу."
      />
      <Events />
    </>
  );
}
