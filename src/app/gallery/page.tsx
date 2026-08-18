import type { Metadata } from "next";
import { Gallery } from "@/components/sections/Gallery";
import { site } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Галерея",
  description: `Галерея ${site.name}: свет, зелень, хрусталь и лица гостей — пространство в кадрах одного вечера.`,
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Галерея"
        title="Фотоархив Smoke Dog"
        subtitle="Свет, зелень, хрусталь и лица гостей — Smoke Dog в кадрах одного вечера."
      />
      <Gallery />
    </>
  );
}
