import { site } from "./data";

/**
 * Интеграция с Яндекс Картами / Яндекс Бизнесом.
 *
 * Отзывы нельзя публиковать на Картах от имени гостя (нет API, и это
 * считается накруткой), поэтому делаем максимум легального:
 * - после 5-звёздочного отзыва на /review ведём гостя в форму отзыва
 *   на Картах, скопировав его текст в буфер обмена;
 * - QR на столах со ссылкой на ту же форму;
 * - на сайте показываем официальный виджет Яндекс Бизнеса с реальными
 *   отзывами и рейтингом с Карт.
 *
 * Настраивается в /admin → «Контакты»: ID организации и ссылка на форму.
 * ID — цифры из адреса карточки yandex.ru/maps/org/<slug>/<ID>/.
 */

type YandexSite = { yandexOrgId?: string; yandexReviewUrl?: string };
const ys = site as YandexSite;

/** ID организации в Яндекс Картах (пусто — виджет и кнопки скрыты). */
export const yandexOrgId: string = (ys.yandexOrgId ?? "").trim();

/** Прямая ссылка на форму нового отзыва организации на Картах. */
export const yandexReviewUrl: string =
  (ys.yandexReviewUrl ?? "").trim() ||
  (yandexOrgId ? `https://yandex.ru/maps/org/${yandexOrgId}/reviews/?add-review=true` : "");

/** Страница отзывов организации на Картах. */
export const yandexReviewsPageUrl: string = yandexOrgId
  ? `https://yandex.ru/maps/org/${yandexOrgId}/reviews/`
  : yandexReviewUrl.replace(/\?add-review=true$/, "");

/** Официальные виджеты Яндекс Бизнеса: бейдж с рейтингом и лента отзывов. */
export const yandexBadgeWidgetUrl = yandexOrgId
  ? `https://yandex.ru/maps-reviews-widget/${yandexOrgId}?size=m`
  : "";
export const yandexReviewsWidgetUrl = yandexOrgId
  ? `https://yandex.ru/maps-reviews-widget/${yandexOrgId}?comments`
  : "";
