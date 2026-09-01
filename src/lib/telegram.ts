/**
 * Telegram Bot helpers for Smoke Dog restaurant.
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

const TOKEN = () => process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT = () => process.env.TELEGRAM_CHAT_ID || "";

export function telegramConfigured(): boolean {
  return Boolean(TOKEN() && CHAT());
}

export async function sendTelegramMessage(
  text: string,
  opts?: { parseMode?: "HTML" | "Markdown" | "MarkdownV2"; disablePreview?: boolean }
): Promise<{ ok: boolean; error?: string }> {
  const token = TOKEN();
  const chatId = CHAT();
  if (!token || !chatId) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set" };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: opts?.parseMode ?? "HTML",
        disable_web_page_preview: opts?.disablePreview ?? true,
      }),
    });
    const data = (await res.json()) as { ok?: boolean; description?: string };
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.description || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 200) };
  }
}

export function formatReservationMessage(r: {
  name: string;
  phone: string;
  email?: string;
  guests?: string;
  date: string;
  time: string;
  message?: string;
  at?: string;
}): string {
  const lines = [
    `🍽 <b>Новая бронь — Smoke Dog</b>`,
    ``,
    `👤 <b>${escapeHtml(r.name)}</b>`,
    `📞 <code>${escapeHtml(r.phone)}</code>`,
  ];
  if (r.email) lines.push(`✉️ ${escapeHtml(r.email)}`);
  if (r.guests) lines.push(`👥 Гостей: <b>${escapeHtml(String(r.guests))}</b>`);
  lines.push(`📅 ${escapeHtml(r.date)} · 🕐 ${escapeHtml(r.time)}`);
  if (r.message) lines.push(``, `💬 ${escapeHtml(r.message)}`);
  lines.push(``, `🌐 sd.msk.ru`);
  if (r.at) lines.push(`⏱ ${escapeHtml(r.at)}`);
  return lines.join("\n");
}

/** Отдельное уведомление для банкетов — легко отличить в чате */
export function formatBanquetMessage(r: {
  name: string;
  phone: string;
  email?: string;
  guests?: string;
  date: string;
  time?: string;
  eventType?: string;
  budget?: string;
  message?: string;
  at?: string;
}): string {
  const lines = [
    `🎉 <b>ЗАЯВКА НА БАНКЕТ — Smoke Dog</b>`,
    `━━━━━━━━━━━━━━━━`,
    ``,
    `👤 <b>${escapeHtml(r.name)}</b>`,
    `📞 <code>${escapeHtml(r.phone)}</code>`,
  ];
  if (r.email) lines.push(`✉️ ${escapeHtml(r.email)}`);
  if (r.guests) lines.push(`👥 Гостей: <b>${escapeHtml(String(r.guests))}</b>`);
  if (r.eventType) lines.push(`🏷 Формат: <b>${escapeHtml(r.eventType)}</b>`);
  lines.push(`📅 Дата: <b>${escapeHtml(r.date)}</b>`);
  if (r.time) lines.push(`🕐 Время: ${escapeHtml(r.time)}`);
  if (r.budget) lines.push(`💰 Бюджет: ${escapeHtml(r.budget)}`);
  if (r.message) lines.push(``, `💬 ${escapeHtml(r.message)}`);
  lines.push(``, `🌐 sd.msk.ru/banquets`);
  if (r.at) lines.push(`⏱ ${escapeHtml(r.at)}`);
  return lines.join("\n");
}

/** Отзыв гостя, оставленный через /review (QR на столах) */
export function formatReviewMessage(r: {
  rating: number;
  name?: string;
  phone?: string;
  text?: string;
  canPublish: boolean;
  at?: string;
}): string {
  const stars = "⭐".repeat(Math.max(1, Math.min(5, r.rating)));
  const lines = [
    r.rating === 5 ? `🌟 <b>НОВЫЙ ОТЗЫВ — 5 ЗВЁЗД!</b>` : `💬 <b>Новый отзыв — Smoke Dog</b>`,
    `━━━━━━━━━━━━━━━━`,
    ``,
    `${stars} <b>(${r.rating}/5)</b>`,
  ];
  if (r.name) lines.push(`👤 ${escapeHtml(r.name)}`);
  if (r.phone) lines.push(`📞 <code>${escapeHtml(r.phone)}</code>`);
  if (r.text) lines.push(``, `💬 «${escapeHtml(r.text)}»`);
  lines.push(``);
  if (r.rating === 5) {
    lines.push(
      r.canPublish
        ? `✅ Гость согласен опубликовать отзыв на сайте.\n🛠 Подтвердить публикацию: https://sd.msk.ru/admin/dashboard?tab=reviews`
        : `🔒 Гость НЕ разрешил публиковать отзыв на сайте — используйте только для внутренней статистики.`
    );
  }
  lines.push(``, `🌐 sd.msk.ru/review`);
  if (r.at) lines.push(`⏱ ${escapeHtml(r.at)}`);
  return lines.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
