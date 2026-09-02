"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import {
  yandexBadgeWidgetUrl,
  yandexReviewsPageUrl,
  yandexReviewsWidgetUrl,
  yandexReviewUrl,
} from "@/lib/yandex";

/**
 * Блок «Отзывы на Яндекс Картах»: официальный бейдж Яндекс Бизнеса с рейтингом,
 * ссылка на все отзывы и лента отзывов с Карт, которая подгружается по кнопке
 * (iframe не грузим, пока гость сам не попросил — экономим трафик и скорость).
 * Ничего не рендерим, если ID организации не задан в /admin → «Контакты».
 */
export function YandexReviews() {
  const [open, setOpen] = useState(false);
  if (!yandexBadgeWidgetUrl) return null;

  return (
    <Reveal delay={0.1}>
      <div className="relative z-10 mx-auto mt-16 max-w-3xl border-t border-white/[0.07] pt-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="eyebrow text-gold">Отзывы на Яндекс Картах</p>
            <p className="mt-2 text-sm leading-relaxed text-ash">
              Рейтинг и отзывы реальных гостей — прямо с карточки заведения.
            </p>
          </div>
          <div className="overflow-hidden rounded-sm bg-white/95 p-1">
            <iframe
              title="Рейтинг организации на Яндекс Картах"
              src={yandexBadgeWidgetUrl}
              width={150}
              height={50}
              loading="lazy"
              className="block border-0"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? "Скрыть отзывы с Карт" : "Показать отзывы с Яндекс Карт"}
          </Button>
          {yandexReviewsPageUrl && (
            <a
              href={yandexReviewsPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] uppercase tracking-wide2 text-ash transition-colors hover:text-gold"
            >
              Все отзывы на Картах
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {yandexReviewUrl && (
            <a
              href={yandexReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] uppercase tracking-wide2 text-gold transition-colors hover:text-gold-soft"
            >
              Оставить отзыв на Картах
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {open && (
          <div className="mt-8 overflow-hidden rounded-sm bg-white p-1">
            <iframe
              title="Отзывы гостей на Яндекс Картах"
              src={yandexReviewsWidgetUrl}
              className="block h-[760px] w-full border-0"
            />
          </div>
        )}
      </div>
    </Reveal>
  );
}
