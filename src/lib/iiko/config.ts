import "server-only";
import { createHash, timingSafeEqual } from "crypto";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type Env = Record<string, string | undefined>;
export type TableBinding = { tokenHash: string; label: string; tableId: string };
export type ProductBinding = { menuItemId: string; productId: string };

export function inspectConfiguration(env: Env = process.env) {
  const missing = ["IIKO_APP_ID", "IIKO_CLIENT_SECRET", "IIKO_API_KEY"].filter(key => !env[key]?.trim());
  const organizationId = env.IIKO_ORGANIZATION_ID?.trim();
  const terminalGroupId = env.IIKO_TERMINAL_GROUP_ID?.trim();
  if (!organizationId || !UUID.test(organizationId)) missing.push("IIKO_ORGANIZATION_ID");
  if (!terminalGroupId || !UUID.test(terminalGroupId)) missing.push("IIKO_TERMINAL_GROUP_ID");
  const tables = parseTableBindings(env.IIKO_TABLE_BINDINGS_JSON);
  if (!tables.length) missing.push("IIKO_TABLE_BINDINGS_JSON");
  return { credentialsConfigured: ["IIKO_APP_ID", "IIKO_CLIENT_SECRET", "IIKO_API_KEY"].every(key => !!env[key]?.trim()), missing, organizationId, terminalGroupId, tables };
}

/** Only SHA-256 digests of random QR tokens are stored, never sequential table passwords. */
export function parseTableBindings(raw: string | undefined): TableBinding[] {
  if (!raw || raw.length > 128_000) return [];
  try {
    const rows: unknown = JSON.parse(raw);
    if (!Array.isArray(rows) || rows.length > 500) return [];
    const seen = new Set<string>();
    return rows.map((row: unknown) => {
      if (!row || typeof row !== "object") throw new Error("Invalid binding");
      const r = row as Record<string, unknown>;
      if (typeof r.tokenHash !== "string" || !/^[a-f0-9]{64}$/.test(r.tokenHash) || seen.has(r.tokenHash)
        || typeof r.label !== "string" || !r.label.trim() || r.label.length > 80
        || typeof r.tableId !== "string" || !UUID.test(r.tableId)) throw new Error("Invalid binding");
      seen.add(r.tokenHash);
      return { tokenHash: r.tokenHash, label: r.label.trim(), tableId: r.tableId };
    });
  } catch { return []; }
}

export function resolveTable(token: string | null, tables: TableBinding[]): TableBinding | undefined {
  if (!token || !/^[A-Za-z0-9_-]{32,128}$/.test(token)) return undefined;
  const digest = createHash("sha256").update(token).digest();
  return tables.find(table => timingSafeEqual(digest, Buffer.from(table.tokenHash, "hex")));
}

export function parseProductBindings(raw: string | undefined): ProductBinding[] {
  if (!raw || raw.length > 500_000) return [];
  try {
    const rows: unknown = JSON.parse(raw);
    if (!Array.isArray(rows) || rows.length > 2000) return [];
    const seen = new Set<string>();
    return rows.map((row: unknown) => {
      if (!row || typeof row !== "object") throw new Error("bad");
      const item = row as Record<string, unknown>;
      if (typeof item.menuItemId !== "string" || !item.menuItemId.trim() || seen.has(item.menuItemId)
        || typeof item.productId !== "string" || !UUID.test(item.productId)) throw new Error("bad");
      seen.add(item.menuItemId);
      return { menuItemId: item.menuItemId.trim(), productId: item.productId };
    });
  } catch { return []; }
}

/** Credentials alone stay closed. Orders open only with org, terminal, tables, dish map and the launch switch. */
export function orderingReady(env: Env = process.env) {
  const config = inspectConfiguration(env);
  const products = parseProductBindings(env.IIKO_PRODUCT_BINDINGS_JSON);
  const switchedOn = env.IIKO_ORDERING_ENABLED?.trim() === "1";
  const missing = [...config.missing];
  if (!products.length) missing.push("IIKO_PRODUCT_BINDINGS_JSON");
  if (!switchedOn) missing.push("IIKO_ORDERING_ENABLED");
  return { ...config, products, enabled: switchedOn && missing.length === 0, missing };
}

export function publicConfiguration(token: string | null, env: Env = process.env) {
  const ready = orderingReady(env);
  const table = resolveTable(token, ready.tables);
  return {
    ready: ready.enabled,
    orderingAvailable: ready.enabled && !!table,
    availability: ready.enabled && table ? "ready" as const : "unavailable" as const,
    table: table ? { label: table.label } : null,
    message: ready.enabled && table
      ? "Заказ уйдёт на ваш стол в кассу."
      : "Заказ через меню пока не подключён. Покажите ваш выбор официанту.",
  };
}
