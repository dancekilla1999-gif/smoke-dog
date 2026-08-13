import { NextResponse } from "next/server";
import {
  formatReviewMessage,
  sendTelegramMessage,
  telegramConfigured,
} from "@/lib/telegram";

/**
 * Форма отзыва (QR на столах) → валидация → уведомление в Telegram-группу.
 * Если 5 звёзд и гость разрешил публикацию — помечаем сообщение отдельно,
 * чтобы владелец мог быстро добавить отзыв на сайт через /admin.
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

export const runtime = "nodejs";

interface ReviewPayload {
  rating?: number | string;
  name?: string;
  phone?: string;
  text?: string;
  canPublish?: boolean;
}

export async function POST(request: Request) {
  let data: ReviewPayload;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос." },
      { status: 400 }
    );
  }

  const rating = Number(data.rating);
  const name = (data.name ?? "").toString().trim().slice(0, 120);
  const phone = (data.phone ?? "").toString().trim().slice(0, 40);
  const text = (data.text ?? "").toString().trim().slice(0, 2000);
  const canPublish = Boolean(data.canPublish);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { ok: false, error: "Укажите оценку от 1 до 5." },
      { status: 422 }
    );
  }

  const review = {
    rating,
    name,
    phone,
    text,
    canPublish,
    at: new Date().toISOString(),
  };

  console.info("[Smoke Dog] Новый отзыв:", review);

  if (telegramConfigured()) {
    const tg = await sendTelegramMessage(formatReviewMessage(review));
    if (!tg.ok) {
      console.error("[Smoke Dog] Telegram error:", tg.error);
      // отзыв всё равно считаем принятым — не ломаем UX гостя
    }
  } else {
    console.warn("[Smoke Dog] Telegram не настроен (TELEGRAM_BOT_TOKEN / CHAT_ID)");
  }

  return NextResponse.json({
    ok: true,
    message: "Спасибо за отзыв! Он очень важен для нас.",
  });
}
