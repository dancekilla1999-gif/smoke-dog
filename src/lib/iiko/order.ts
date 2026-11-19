import { createHash } from "crypto";
import { resolveTable, type ProductBinding, type TableBinding } from "./config";

export type MenuLine = { id: string; name: string; priceValue: number };

type GuestItem = { id?: unknown; amount?: unknown };

export function normalizeGuestItems(value: unknown): { id: string; amount: number }[] | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const items = (value as { items?: unknown }).items;
  if (!Array.isArray(items) || !items.length || items.length > 40) return null;
  const rows = items.map((row: GuestItem) => {
    const amount = row.amount;
    if (typeof row.id !== "string" || !row.id.trim() || row.id.length > 80) return null;
    if (typeof amount !== "number" || !Number.isInteger(amount) || amount < 1 || amount > 20) return null;
    return { id: row.id.trim(), amount };
  });
  if (rows.some((row) => !row)) return null;
  return rows as { id: string; amount: number }[];
}

export function buildTableOrder(args: {
  token: string | null;
  items: { id: string; amount: number }[];
  catalog: MenuLine[];
  tables: TableBinding[];
  products: ProductBinding[];
  organizationId: string;
  terminalGroupId: string;
  idempotencyKey: string;
}) {
  const table = resolveTable(args.token, args.tables);
  if (!table) return { ok: false as const, code: "TABLE_UNKNOWN", message: "Этот QR не привязан к столу. Покажите выбор официанту." };
  if (!/^[A-Za-z0-9_-]{16,80}$/.test(args.idempotencyKey)) return { ok: false as const, code: "BAD_KEY", message: "Заказ не отправлен. Откройте меню ещё раз." };
  const byId = new Map(args.catalog.map((line) => [line.id, line]));
  const byMenu = new Map(args.products.map((line) => [line.menuItemId, line.productId]));
  const missing: string[] = [];
  const items = args.items.map((line) => {
    const dish = byId.get(line.id);
    const productId = dish ? byMenu.get(dish.id) : undefined;
    if (!dish || !productId) missing.push(dish?.name || line.id);
    return { type: "Product", productId, amount: line.amount, name: dish?.name };
  });
  if (missing.length) return { ok: false as const, code: "UNMAPPED", message: "Эти позиции ещё не связаны с кассой: " + missing.slice(0, 4).join(", ") + ". Покажите выбор официанту." };
  return {
    ok: true as const,
    table,
    body: {
      organizationId: args.organizationId,
      terminalGroupId: args.terminalGroupId,
      order: {
        orderServiceType: "Common",
        tableIds: [table.tableId],
        externalNumber: createHash("sha256").update(args.idempotencyKey).digest("hex").slice(0, 12),
        comment: "QR " + table.label,
        items: items.map((line) => ({ type: "Product", productId: line.productId, amount: line.amount })),
      },
    },
  };
}

export function commandSucceeded(status: unknown) {
  if (!status || typeof status !== "object") return false;
  const state = String((status as { state?: unknown }).state || (status as { status?: unknown }).status || "");
  return state === "Success";
}

export function commandFailed(status: unknown) {
  if (!status || typeof status !== "object") return false;
  const state = String((status as { state?: unknown }).state || (status as { status?: unknown }).status || "");
  return state === "Error" || state === "Failed";
}
