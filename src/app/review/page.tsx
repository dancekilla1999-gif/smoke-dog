import type { Metadata } from "next";
import { ReviewForm } from "@/components/sections/ReviewForm";
import { site } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Оставить отзыв",
  description: `Поделитесь впечатлениями о ${site.name}. Ваш отзыв помогает нам становиться лучше.`,
  alternates: { canonical: "/review" },
};

export default function ReviewPage() {
  return (
    <>
      <PageHero
        eyebrow="Ваше мнение важно"
        title="Оставьте отзыв"
        subtitle="Пара минут — и мы узнаем, что было хорошо, а что можно улучшить."
      />
      <ReviewForm />
    </>
  );
}
