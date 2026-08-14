"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { events } from "@/lib/data";
import { Button } from "@/components/ui/button";

/**
 * Промо-попап ближайшего события с видео-афишей — формат «истории».
 * Видео на весь попап (в нём уже есть всё: дата, состав, контакты),
 * кнопка брони — плавающая поверх видео снизу.
 *
 * Если у события задан reserveUrl (событие у партнёра — например SOUL,
 * тот же двор), кнопка ведёт туда, а не на собственную форму брони —
 * и на видео явно виден бренд партнёра, так что подмены нет.
 *
 * Показывается один раз за заход на сайт: используем sessionStorage
 * (не localStorage) — флаг живёт, пока открыта вкладка/сессия браузера,
 * и не мешает при обычной навигации по страницам сайта. Как только
 * пользователь закрывает вкладку/браузер и заходит на сайт заново —
 * это уже новый визит, и попап покажется снова.
 */
const STORAGE_KEY = "smokedog_promo_popup_seen";
const SHOW_DELAY_MS = 1400;

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [filled, setFilled] = useState(false);
  const event = events.find((e) => e.video) ?? null;

  useEffect(() => {
    if (!event) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // sessionStorage недоступен (приватный режим и т.д.) — просто показываем
    }
    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [event]);

  useEffect(() => {
    if (!open) {
      setFilled(false);
      return;
    }
    // запускаем заполнение полоски-индикатора со следующего тика,
    // чтобы сработал CSS-переход из 0% в 100%
    const raf = requestAnimationFrame(() => setFilled(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!event) return null;

  const isPartner = Boolean(event.reserveUrl);
  const ctaHref = event.reserveUrl || "/contacts#reserve";
  const ctaExternal = isPartner;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-noir/90 p-3 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="button"
            aria-label="Закрыть афишу"
            tabIndex={0}
            onClick={close}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") close();
            }}
            className="group relative h-[82vh] max-h-[720px] w-full max-w-[360px] cursor-pointer overflow-hidden rounded-2xl border border-gold/30 shadow-gold"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <video
              src={event.video}
              poster={event.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
              aria-label={`${event.title} — ${event.subtitle}`}
            />

            {/* Плашка исходного видео (водяной знак соцсети) — перекрываем сплошной
                затемнённой полосой сверху, чтобы не светился чужой юзернейм. */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-noir from-0% via-noir via-60% to-transparent" />

            {/* тонкая полоска сверху — как индикатор «истории» */}
            <div className="absolute inset-x-3 top-3 h-[2px] overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full bg-gold transition-[width] ease-linear"
                style={{ width: filled ? "100%" : "0%", transitionDuration: "14300ms" }}
              />
            </div>

            <span className="absolute left-4 top-6 border border-gold/50 bg-noir/60 px-3 py-1 text-[10px] uppercase tracking-eyebrow text-gold backdrop-blur-sm">
              {isPartner ? "Событие у партнёра" : "Афиша недели"}
            </span>

            <button
              aria-label="Закрыть"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute right-4 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-noir/60 text-bone backdrop-blur-sm transition hover:text-gold"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir via-noir/50 to-transparent pb-5 pt-16">
              <div className="px-5" onClick={(e) => e.stopPropagation()}>
                {isPartner && (
                  <p className="mb-3 text-center text-[11px] uppercase tracking-wide2 text-ash">
                    SOUL — тот же двор, Холодильный пер., 3
                  </p>
                )}
                <Button asChild variant="gold" size="lg" className="w-full" onClick={close}>
                  {ctaExternal ? (
                    <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                      Забронировать в SOUL
                    </a>
                  ) : (
                    <Link href={ctaHref}>Забронировать столик</Link>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
