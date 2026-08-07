import { NextResponse } from "next/server";
import {
  formatReservationMessage,
  sendTelegramMessage,
  telegramConfigured,
} from "@/lib/telegram";

/**
 * Форма бронирования → валидация → уведомление в Telegram-группу.
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

export const runtime = "nodejs";

interface ReservationPayload {
  name?: string;
  phone?: string;
  email?: string;
  guests?: string | number;
  date?: string;
  time?: string;
  message?: string;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  let data: ReservationPayload;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос." },
      { status: 400 }
    );
  }

  const name = (data.name ?? "").toString().trim();
  const phone = (data.phone ?? "").toString().trim();
  const email = (data.email ?? "").toString().trim();
  const guests = (data.guests ?? "").toString().trim();
  const date = (data.date ?? "").toString().trim();
  const time = (data.time ?? "").toString().trim();
  const message = (data.message ?? "").toString().trim();

  const errors: string[] = [];
  if (name.length < 2) errors.push("Укажите имя.");
  if (phone.replace(/\D/g, "").length < 10)
    errors.push("Укажите корректный телефон.");
  if (email && !isEmail(email)) errors.push("Укажите корректный email.");
  if (!date) errors.push("Выберите дату.");
  if (!time) errors.push("Выберите время.");

  if (errors.length) {
    return NextResponse.json(
      { ok: false, error: errors.join(" ") },
      { status: 422 }
    );
  }

  const reservation = {
    name,
    phone,
    email,
    guests,
    date,
    time,
    message,
    at: new Date().toISOString(),
  };

  console.info("[Smoke Dog] Новая заявка на бронирование:", reservation);

  // Telegram group notification
  if (telegramConfigured()) {
    const text = formatReservationMessage(reservation);
    const tg = await sendTelegramMessage(text);
    if (!tg.ok) {
      console.error("[Smoke Dog] Telegram error:", tg.error);
      // заявку всё равно считаем принятой — не ломаем UX гостя
    }
  } else {
    console.warn("[Smoke Dog] Telegram не настроен (TELEGRAM_BOT_TOKEN / CHAT_ID)");
  }

  return NextResponse.json({
    ok: true,
    message: "Заявка принята. Мы свяжемся с вами для подтверждения брони.",
  });
}
