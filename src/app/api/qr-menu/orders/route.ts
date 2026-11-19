import { NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { createIikoWriter, IikoError } from "@/lib/iiko/client";
import { orderingReady } from "@/lib/iiko/config";
import { json } from "@/lib/iiko/http";
import { buildTableOrder, commandFailed, commandSucceeded, normalizeGuestItems, type MenuLine } from "@/lib/iiko/order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function catalog(): MenuLine[] {
  const raw = readFileSync(join(process.cwd(), "public/qr-menu/menu-data.js"), "utf8");
  const parsed = JSON.parse(raw.replace(/^window\.MENU_DATA\s*=\s*/, "").replace(/;\s*$/, "")) as { items?: MenuLine[] };
  return Array.isArray(parsed.items) ? parsed.items : [];
}

export async function POST(req: NextRequest) {
  let payload: unknown = {};
  try { payload = await req.json(); } catch { payload = {}; }
  const items = normalizeGuestItems(payload);
  const idempotencyKey = payload && typeof payload === "object" ? String((payload as { idempotencyKey?: unknown }).idempotencyKey || "") : "";
  const ready = orderingReady();
  if (!ready.enabled || !ready.organizationId || !ready.terminalGroupId) {
    return json({ accepted: false, code: "ORDERING_NOT_CONNECTED", message: "Заказ не отправлен. Покажите ваш выбор официанту." }, 503);
  }
  if (!items) return json({ accepted: false, code: "BAD_ITEMS", message: "Проверьте количество позиций." }, 400);
  const draft = buildTableOrder({
    token: req.nextUrl.searchParams.get("table"),
    items,
    catalog: catalog(),
    tables: ready.tables,
    products: ready.products,
    organizationId: ready.organizationId,
    terminalGroupId: ready.terminalGroupId,
    idempotencyKey,
  });
  if (!draft.ok) return json({ accepted: false, code: draft.code, message: draft.message }, draft.code === "UNMAPPED" ? 409 : 400);
  try {
    const write = await createIikoWriter();
    const created = await write("/api/1/order/create", draft.body);
    const correlationId = typeof created.correlationId === "string" ? created.correlationId : "";
    let state = "InProgress";
    for (let attempt = 0; attempt < 4 && correlationId; attempt += 1) {
      const status = await write("/api/1/commands/status", { organizationId: ready.organizationId, correlationId });
      if (commandSucceeded(status)) { state = "Success"; break; }
      if (commandFailed(status)) return json({ accepted: false, code: "IIKO_REJECTED", message: "Касса не приняла заказ. Позовите официанта." }, 502);
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
    if (state !== "Success") return json({ accepted: false, code: "PENDING", message: "Касса ещё не подтвердила заказ. Не отправляйте его повторно, позовите официанта." }, 504);
    return json({ accepted: true, table: draft.table.label, message: "Заказ отправлен на стол " + draft.table.label + "." });
  } catch (error) {
    const code = error instanceof IikoError ? error.code : "upstream_error";
    return json({ accepted: false, code, message: "Заказ не дошёл до кассы. Покажите выбор официанту." }, 502);
  }
}
