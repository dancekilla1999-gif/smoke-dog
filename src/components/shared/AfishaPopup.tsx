"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { events, type EventItem } from "@/lib/data";
import { reachGoal } from "@/components/providers/YandexMetrika";
import { Button } from "@/components/ui/button";

/**
 * Окно с ближайшими афишами при заходе на сайт.
 *
 * Показывается один раз на каждый набор афиш: ключ в localStorage
 * собирается из самих вечеров, поэтому новая афиша открывает окно снова,
 * а закрытое окно не возвращается при каждом переходе по страницам.
 *
 * Прошедшие вечера отсекаются здесь же. Дата в данных записана без года
 * («02.10»), и сравнивать её можно только в браузере: страницы собираются
 * заранее, и «сегодня» на момент сборки — не то же, что «сегодня» у гостя.
 */

const STORAGE_PREFIX = "afisha-popup-seen:";
const OPEN_DELAY_MS = 900;

/** Страницы, где окно только мешает. */
const SILENT_PATHS = ["/admin", "/review"];

/** Сколько дней вперёд дата без года может означать следующий год. */
const NEXT_YEAR_WINDOW_DAYS = 60;

/**
 * Дата «ДД.ММ» без года → дата вечера, если он ещё впереди, иначе null.
 *
 * Сегодняшний вечер ещё впереди: окно показывает его до конца дня.
 * Прошедшая дата — прошедший вечер. Исключение — начало следующего года:
 * «05.01», увиденное в декабре, — это январь, а не прошлое. Поэтому
 * прошедшую дату переносим на следующий год, только если до неё оттуда
 * недалеко. Раньше перенос был безусловным, и вечер «02.10» после
 * 2 октября считался вечером 2 октября следующего года и не пропадал.
 */
function upcomingDate(date: string, now: Date): Date | null {
  const match = /^(\d{1,2})\.(\d{1,2})$/.exec(date.trim());
  if (!match) return null;
  const [, day, month] = match;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const candidate = new Date(now.getFullYear(), Number(month) - 1, Number(day));
  if (candidate.getTime() >= today.getTime()) return candidate;

  const nextYear = new Date(now.getFullYear() + 1, Number(month) - 1, Number(day));
  const daysAhead = (nextYear.getTime() - today.getTime()) / 86_400_000;
  return daysAhead <= NEXT_YEAR_WINDOW_DAYS ? nextYear : null;
}

/** Ключ афиши: видео, а если его нет — картинка. */
function afishaKey(event: EventItem): string {
  return event.video || event.poster;
}

/**
 * Афиши — вечера с конкретной датой. Карточки вроде «Пт–Сб» или «По
 * запросу» — постоянные, в окно не попадают. Афиша может быть и видео, и
 * картинкой.
 */
function upcomingAfishas(now: Date): EventItem[] {
  return events
    .filter((event) => Boolean(event.video || event.poster))
    .map((event) => ({ event, when: upcomingDate(event.date, now) }))
    .filter((item): item is { event: EventItem; when: Date } => item.when !== null)
    .sort((a, b) => a.when.getTime() - b.when.getTime())
    .map((item) => item.event);
}

export function AfishaPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [afishas, setAfishas] = useState<EventItem[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<Element | null>(null);

  const silent = SILENT_PATHS.some((path) => pathname?.startsWith(path));

  useEffect(() => {
    if (silent) return;
    const upcoming = upcomingAfishas(new Date());
    if (!upcoming.length) return;

    const key = STORAGE_PREFIX + upcoming.map(afishaKey).join("|");
    try {
      if (localStorage.getItem(key)) return;
    } catch {
      // localStorage недоступен (приватный режим) — покажем один раз за визит
    }

    const timer = setTimeout(() => {
      openerRef.current = document.activeElement;
      setAfishas(upcoming);
      setOpen(true);
      try {
        localStorage.setItem(key, "1");
      } catch {
        // ignore
      }
      reachGoal("afisha_popup_shown");
    }, OPEN_DELAY_MS);

    return () => clearTimeout(timer);
  }, [silent]);

  const close = useCallback(() => {
    setOpen(false);
    if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (silent) return null;

  return (
    <AnimatePresence>
      {open && afishas.length > 0 && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-noir/95 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="afisha-popup-title"
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-white/10 bg-graphite/95 px-5 py-7 sm:px-8 sm:py-10"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Закрыть"
              onClick={close}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone transition hover:border-gold hover:text-gold sm:right-5 sm:top-5"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-center text-[11px] uppercase tracking-eyebrow text-gold">
              Афиша
            </p>
            <h2
              id="afisha-popup-title"
              className="mt-3 text-center font-serif text-2xl text-bone sm:text-3xl"
            >
              {afishas.length > 1 ? "Ближайшие вечера" : "Ближайший вечер"}
            </h2>

            {/* На телефоне афиши листаются пальцем, на широком экране
                встают рядом: две вертикальные афиши столбиком не помещаются
                в экран целиком, а обрезать их не хочется. */}
            {afishas.length > 1 && (
              <p className="mt-2 text-center text-[11px] tracking-wide2 text-ash sm:hidden">
                Листайте, чтобы посмотреть оба вечера
              </p>
            )}

            <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:mt-7 sm:justify-center sm:overflow-visible">
              {afishas.map((afisha) => (
                <figure
                  key={afishaKey(afisha)}
                  className="w-[58vw] max-w-[240px] shrink-0 snap-center sm:w-[min(30vw,240px)]"
                >
                  <div className="relative aspect-[9/16] overflow-hidden border border-white/10 bg-noir">
                    {afisha.video ? (
                      <video
                        src={afisha.video}
                        poster={afisha.poster}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                        aria-label={`${afisha.title} — ${afisha.subtitle}`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={afisha.poster}
                        alt={`${afisha.title} — ${afisha.subtitle}`}
                        fill
                        sizes="(max-width: 640px) 58vw, 240px"
                        className="object-cover object-top"
                      />
                    )}
                  </div>
                  <figcaption className="mt-3 text-center">
                    <span className="font-serif text-xl text-gold-soft">
                      {afisha.date}
                    </span>
                    <span className="ml-2 text-[11px] uppercase tracking-eyebrow text-ash">
                      {afisha.weekday}
                    </span>
                    <p className="mt-1 text-sm text-bone">{afisha.title}</p>
                    <p className="mt-0.5 text-xs text-ash">
                      Начало в {afisha.time}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-7 flex flex-col items-center gap-3.5 sm:mt-8 sm:gap-4">
              <Button asChild variant="gold" size="lg">
                <Link
                  href="/contacts#reserve"
                  onClick={() => {
                    reachGoal("afisha_popup_reserve");
                    close();
                  }}
                >
                  Забронировать стол
                </Link>
              </Button>
              <Link
                href="/events"
                onClick={close}
                className="text-[12px] uppercase tracking-wide2 text-ash underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                Вся афиша
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
