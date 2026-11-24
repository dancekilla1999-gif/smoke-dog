import { NextRequest } from "next/server";
import { publicConfiguration } from "@/lib/iiko/config";
import { json } from "@/lib/iiko/http";
import { createIikoClient, IikoError } from "@/lib/iiko/client";
import { getOrderContext, readOrderCatalog } from "@/lib/iiko/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("table");
  const fallback = publicConfiguration(token);
  const context = getOrderContext(token);
  if (!context || (!context.enabled && process.env.IIKO_ORDER_CATALOG_ENABLED !== "true")) {
    return json(fallback);
  }

  try {
    const catalog = await readOrderCatalog(await createIikoClient(), context);
    if (!catalog.length) return json(fallback);
    const items = catalog.map(({ id, price }) => ({ id, price }));
    return json({
      ...fallback,
      ready: context.enabled,
      orderingAvailable: context.enabled,
      availability: context.enabled ? "available" : "unavailable",
      items,
      message: context.enabled ? "Заказ можно отправить на кассу." : fallback.message,
    });
  } catch (error) {
    console.warn("iiko QR checkout catalog unavailable", error instanceof IikoError ? error.code : "invalid_catalog", error instanceof IikoError ? error.upstreamStatus : undefined);
    return json(fallback);
  }
}
