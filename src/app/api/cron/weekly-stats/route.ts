import { NextResponse } from "next/server";
import { sendTelegramMessage, telegramConfigured } from "@/lib/telegram";

/**
 * Еженедельный дайджест в Telegram-группу.
 * Vercel Cron: каждый понедельник 09:00 UTC (12:00 МСК).
 *
 * Защита: Authorization: Bearer CRON_SECRET
 * Env: TELEGRAM_*, VERCEL_API_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID, CRON_SECRET
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authorize(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

async function vercelDeploymentsSummary(): Promise<string> {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!token || !projectId) return "• Vercel API: не настроен";

  try {
    const qs = new URLSearchParams({
      projectId,
      limit: "5",
      ...(teamId ? { teamId } : {}),
    });
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?${qs}`,
      { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 0 } }
    );
    if (!res.ok) return `• Vercel API: HTTP ${res.status}`;
    const data = (await res.json()) as {
      deployments?: Array<{ state?: string; created?: number; url?: string }>;
    };
    const list = data.deployments || [];
    if (!list.length) return "• Деплоев за период не найдено";

    const lines = list.slice(0, 3).map((d) => {
      const when = d.created
        ? new Date(d.created).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })
        : "—";
      return `  – ${d.state || "?"} · ${when}`;
    });
    return `• Последние деплои:\n${lines.join("\n")}`;
  } catch (e) {
    return `• Vercel API: ошибка (${String(e).slice(0, 80)})`;
  }
}

async function probe(url: string): Promise<{ ok: boolean; ms: number; status?: number; err?: string }> {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: { "User-Agent": "Smoke Dog-HealthCheck/1.0" },
      signal: AbortSignal.timeout(12000),
    });
    return { ok: res.ok, ms: Date.now() - t0, status: res.status };
  } catch (e) {
    return { ok: false, ms: Date.now() - t0, err: String(e).slice(0, 80) };
  }
}

async function siteHealth(): Promise<string> {
  const primary = process.env.NEXT_PUBLIC_SITE_URL || "https://sdlounge.com";
  const fallbacks = [
    primary,
    "https://sdlounge.com",
    "https://www.sdlounge.com",
  ].filter((v, i, a) => a.indexOf(v) === i);

  const results: string[] = [];
  let anyOk = false;
  for (const url of fallbacks) {
    const r = await probe(url);
    if (r.ok) {
      anyOk = true;
      results.push(`• Сайт: <b>OK</b> · ${r.ms} ms\n• URL: ${url}`);
      break;
    }
    results.push(`• ${url}: ${r.status ? "HTTP " + r.status : r.err || "fail"} (${r.ms} ms)`);
  }
  if (anyOk) return results[results.length - 1];
  return `• Сайт: проверка не прошла\n` + results.join("\n");
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!telegramConfigured()) {
    return NextResponse.json(
      { ok: false, error: "telegram not configured" },
      { status: 500 }
    );
  }

  const week = new Date().toLocaleDateString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [health, deploys] = await Promise.all([
    siteHealth(),
    vercelDeploymentsSummary(),
  ]);

  const text = [
    `📊 <b>Smoke Dog — недельный отчёт</b>`,
    `📅 ${week}`,
    ``,
    health,
    deploys,
    ``,
    `🍽 <b>Брони</b>`,
    `• Все заявки с сайта приходят в эту группу мгновенно.`,
    `• Проверьте историю чата за 7 дней — там полный список броней.`,
    ``,
    `✅ Что проверить на неделе:`,
    `• Ответить на все заявки из чата`,
    `• Обновить афишу на сайте`,
    `• Фото/меню на картах (Яндекс, 2ГИС)`,
    ``,
    `🌐 https://sdlounge.com`,
  ].join("\n");

  const tg = await sendTelegramMessage(text);
  if (!tg.ok) {
    return NextResponse.json({ ok: false, error: tg.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, sent: true });
}

/** Ручной тест: POST с тем же Bearer */
export async function POST(request: Request) {
  return GET(request);
}
