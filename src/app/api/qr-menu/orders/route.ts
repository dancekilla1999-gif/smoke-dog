import { NextRequest } from "next/server";
import { createIikoClient } from "@/lib/iiko/client";
import { json } from "@/lib/iiko/http";
import { getOrderContext, getOrderId, orderStatus, parseCart, readOrder, submitOrder } from "@/lib/iiko/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8192;

function unavailable() {
  return json({ accepted: false, code: "ORDERING_NOT_CONNECTED", message: "Заказ не отправлен. Покажите ваш выбор официанту." }, 503);
}

function invalid(status = 400) {
  return json({ accepted: false, code: "INVALID_ORDER", message: "Проверьте стол и позиции заказа." }, status);
}

function reply(result: Awaited<ReturnType<typeof submitOrder>>) {
  return json(result, result.status === "accepted" ? 200 : result.status === "failed" ? 409 : 202);
}

export async function POST(req: NextRequest) {
  if (process.env.IIKO_ORDERING_ENABLED !== "true") return unavailable();
  if (req.headers.get("origin") !== req.nextUrl.origin) return invalid(403);
  if (req.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return invalid(415);
  if (Number(req.headers.get("content-length")) > MAX_BODY_BYTES) return invalid(413);

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) return invalid(413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return invalid();
    body = parsed as Record<string, unknown>;
  } catch {
    return invalid();
  }
  const context = getOrderContext(typeof body.table === "string" ? body.table : null);
  const cart = parseCart(body.items);
  const id = context && getOrderId(context, body.requestId);
  if (!context?.enabled || !cart || !id) return invalid();
  try {
    return reply(await submitOrder(await createIikoClient(), context, id, cart));
  } catch {
    return unavailable();
  }
}

export async function GET(req: NextRequest) {
  const context = getOrderContext(req.nextUrl.searchParams.get("table"));
  const id = context && getOrderId(context, req.nextUrl.searchParams.get("requestId"));
  if (!context || !id) return invalid();
  try {
    return reply(orderStatus(await readOrder(await createIikoClient(), context, id), context));
  } catch {
    return reply(orderStatus(undefined, context));
  }
}
