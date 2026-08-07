import { NextResponse } from "next/server";
import {
  formatBanquetMessage,
  sendTelegramMessage,
  telegramConfigured,
} from "@/lib/telegram";

/**
 * Форма банкета → отдельное уведомление в Telegram.
 * Помечено как БАНКЕТ, чтобы легко отличать от обычных броней.
 */

export const runtime = "nodejs";

interface BanquetPayload {
  name?: string;
  phone?: string;
  email?: string;
  guests?: string | number;
  date?: string;
  time?: string;
  eventType?: string;
  budget?: string;
  message?: string;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  let data: BanquetPayload;

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
  const eventType = (data.eventType ?? "").toString().trim();
  const budget = (data.budget ?? "").toString().trim();
  const message = (data.message ?? "").toString().trim();

  const errors: string[] = [];
  if (name.length < 2) errors.push("Укажите имя.");
  if (phone.replace(/\D/g, "").length < 10)
    errors.push("Укажите корректный телефон.");
  if (email && !isEmail(email)) errors.push("Укажите корректный email.");
  if (!date) errors.push("Выберите дату.");
  if (!guests) errors.push("Укажите количество гостей.");

  if (errors.length) {
    return NextResponse.json(
      { ok: false, error: errors.join(" ") },
      { status: 422 }
    );
  }

  const banquet = {
    name,
    phone,
    email,
    guests,
    date,
    time,
    eventType,
    budget,
    message,
    at: new Date().toISOString(),
  };

  console.info("[Smoke Dog] Новая заявка на банкет:", banquet);

  if (telegramConfigured()) {
    const text = formatBanquetMessage(banquet);
    const tg = await sendTelegramMessage(text);
    if (!tg.ok) {
      console.error("[Smoke Dog] Telegram banquet error:", tg.error);
    }
  } else {
    console.warn("[Smoke Dog] Telegram не настроен");
  }

  return NextResponse.json({
    ok: true,
    message:
      "Заявка на банкет принята. Менеджер свяжется с вами для уточнения деталей.",
  });
}
