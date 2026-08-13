"use client";

import Script from "next/script";

/**
 * Задаётся ТОЛЬКО через env NEXT_PUBLIC_YANDEX_METRIKA_ID (Vercel → Project
 * Settings → Environment Variables), отдельно для sd.msk.ru.
 *
 * Важно: раньше здесь был захардкожен счётчик SOUL (111369375) как fallback —
 * это заставляло sd.msk.ru молча слать всю статистику посещений в чужой
 * счётчик, если переменная окружения не задана. Убрано намеренно: без
 * NEXT_PUBLIC_YANDEX_METRIKA_ID счётчик просто не подключается — лучше
 * отсутствие аналитики, чем данные в чужом счётчике.
 */
function getCounterId(): string {
  return process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.replace(/\D/g, "") || "";
}

/**
 * Яндекс.Метрика для sd.msk.ru
 * Цели: reservation (бронь), banquet (банкет), review_five_stars, review_yandex_redirect
 */
export function YandexMetrika() {
  const counterId = getCounterId();
  if (!counterId) return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">{`
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${counterId}", "ym");
ym(${counterId}, "init", {
  ssr: true,
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
  ecommerce: "dataLayer"
});
      `}</Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

/** Отправка цели в Метрику */
export function reachGoal(goal: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const id = getCounterId();
  // @ts-expect-error ym injects globally
  const ym = window.ym;
  if (!id || typeof ym !== "function") return;
  try {
    if (params) ym(Number(id), "reachGoal", goal, params);
    else ym(Number(id), "reachGoal", goal);
  } catch {
    // ignore
  }
}
