import "server-only";
import { createHash } from "node:crypto";
import { createIikoClient, IikoError } from "./client";
import { inspectConfiguration, resolveTable } from "./config";

const GUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const NIL_GUID = "00000000-0000-0000-0000-000000000000";
const REQUEST_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const SITE_ID = /^(?:dish|bar)-[0-9]{3,5}$/;
type Row = Record<string, unknown>;
const record = (value: unknown): Row | undefined => value && typeof value === "object" && !Array.isArray(value) ? value as Row : undefined;
function records(value: unknown): Row[] {
  return Array.isArray(value) ? value.map(record).filter((item): item is Row => item !== undefined) : [];
}
const guid = (value: unknown) => typeof value === "string" && GUID.test(value) ? value.toLowerCase() : undefined;
const kopecks = (value: unknown) => typeof value === "number" && value > 0 && value <= 100_000 && Math.abs(value * 100 - Math.round(value * 100)) < 0.00001 ? Math.round(value * 100) : null;

export function getOrderContext(token: string | null, env = process.env) {
  const config = inspectConfiguration(env);
  const table = resolveTable(token, config.tables);
  const menuId = env.IIKO_EXTERNAL_MENU_ID?.trim();
  const enabled = env.IIKO_ORDERING_ENABLED === "true";
  const allowlist = parseAllowlist(env.IIKO_ORDER_ITEMS_JSON);
  if (!table || !config.organizationId || !config.terminalGroupId || config.missing.length
    || !menuId || !/^\d{1,18}$/.test(menuId) || !Number.isSafeInteger(Number(menuId))
    || Number(menuId) <= 0 || !allowlist.size) return undefined;
  return { table, terminalGroupId: config.terminalGroupId, organizationId: config.organizationId, menuId, allowlist, enabled };
}

type Context = NonNullable<ReturnType<typeof getOrderContext>>;
type Iiko = Awaited<ReturnType<typeof createIikoClient>>;
export type CatalogItem = { id: string; price: number; productId: string; sizeId?: string; balance?: number };
type CartItem = { id: string; quantity: number; unitPrice: number };

function parseAllowlist(raw: string | undefined) {
  const result = new Map<string, string>();
  if (!raw || raw.length > 32_768) return result;
  try {
    const data = record(JSON.parse(raw));
    if (!data) return result;
    const entries = Object.entries(data);
    if (entries.length > 500) return result;
    const used = new Set<string>();
    for (const [id, sku] of entries) {
      if (!SITE_ID.test(id) || typeof sku !== "string" || !/^[\p{L}\d_. /()-]{1,80}$/u.test(sku)
        || sku.trim() !== sku || used.has(sku)) return new Map<string, string>();
      used.add(sku);
      result.set(id, sku);
    }
    return result;
  } catch {
    return result;
  }
}

export function parseCart(value: unknown): CartItem[] | undefined {
  if (!Array.isArray(value) || value.length < 1 || value.length > 20) return undefined;
  const ids = new Set<string>();
  const items: CartItem[] = [];
  let total = 0;
  for (const item of value) {
    const row = record(item);
    if (!row) return undefined;
    const { id, quantity, unitPrice } = row;
    if (typeof id !== "string" || !SITE_ID.test(id) || ids.has(id) || typeof quantity !== "number"
      || !Number.isInteger(quantity) || quantity < 1 || quantity > 10 || typeof unitPrice !== "number"
      || kopecks(unitPrice) === null) return undefined;
    total += quantity;
    if (total > 30) return undefined;
    ids.add(id);
    items.push({ id, quantity, unitPrice });
  }
  return items;
}

export function parseCatalog(menu: Row, stop: Row, context: Context): CatalogItem[] {
  if (String(menu.id) !== context.menuId || !Array.isArray(menu.products) || !Array.isArray(menu.itemsGroups)
    || !Array.isArray(stop.terminalGroupStopLists)) {
    console.warn("iiko QR catalog schema mismatch", {
      menuIdMatches: String(menu.id) === context.menuId,
      hasProducts: Array.isArray(menu.products),
      hasGroups: Array.isArray(menu.itemsGroups),
      hasStopLists: Array.isArray(stop.terminalGroupStopLists),
    });
    throw new Error("Invalid iiko catalog");
  }
  const organization = records(stop.terminalGroupStopLists).find(row => guid(row.organizationId) === guid(context.organizationId));
  const terminal = records(organization?.items).find(row => guid(row.terminalGroupId) === guid(context.terminalGroupId));
  const stockRows = records(terminal?.items);
  // Some installations omit the empty group wrapper. Populated groups must have a valid item list.
  if (terminal && !Array.isArray(terminal.items)) throw new Error("Invalid iiko stop list");

  const products = new Map<string, Row[]>();
  for (const product of records(menu.products)) {
    if (typeof product.sku !== "string") continue;
    const list = products.get(product.sku) ?? [];
    list.push(product);
    products.set(product.sku, list);
  }
  const byProduct = new Map<string, Row[]>();
  for (const group of records(menu.itemsGroups)) {
    if (group.isHidden === true || group.scheduleId) continue;
    for (const item of records(group.items)) {
      const productId = guid(item.productId);
      if (!productId || item.isHidden === true) continue;
      const list = byProduct.get(productId) ?? [];
      list.push(item);
      byProduct.set(productId, list);
    }
  }

  const catalog: CatalogItem[] = [];
  for (const [id, sku] of context.allowlist) {
    const matching = products.get(sku);
    if (!matching || matching.length !== 1) continue;
    const product = matching[0];
    const productId = guid(product.id);
    if (!productId || productId === NIL_GUID || product.canSetOpenPrice === true || product.isMarked === true
      || product.orderItemType !== "Product"
      || (product.type != null && !["DISH", "GOODS"].includes(String(product.type).toUpperCase()))) continue;
    const items = byProduct.get(productId);
    // No guest option picker for multiple portions or modifier groups.
    if (!items || items.length !== 1 || (items[0].modifierGroups != null && (!Array.isArray(items[0].modifierGroups) || items[0].modifierGroups.length > 0))) continue;
    const sizes = records(items[0].sizePrices).filter(size => size.isHidden !== true);
    if (sizes.length !== 1) continue;
    const size = sizes[0];
    const sizeId = guid(size.sizeId);
    if (size.sizeId && !sizeId) continue;
    const cents = kopecks(size.price);
    if (cents === null) continue;
    const balance = stockRows.reduce<number | undefined>((lowest, row) => {
      const stopSize = guid(row.sizeId);
      if (guid(row.productId) !== productId || (stopSize && stopSize !== NIL_GUID && sizeId !== stopSize)) return lowest;
      const available = typeof row.balance === "number" && Number.isFinite(row.balance) ? row.balance : 0;
      return lowest === undefined ? available : Math.min(lowest, available);
    }, undefined);
    if (balance !== undefined && balance < 1) continue;
    catalog.push({ id, price: cents / 100, productId, sizeId: sizeId === NIL_GUID ? undefined : sizeId, balance });
  }
  return catalog;
}

export async function readOrderCatalog(iiko: Iiko, context: Context) {
  async function readCatalogPart(path: "/api/menu/v3/by_id" | "/api/1/stop_lists", body: unknown) {
    try {
      return await iiko.read(path, body);
    } catch (error) {
      console.warn("iiko QR catalog read failed", path, error instanceof IikoError ? error.code : "unknown", error instanceof IikoError ? error.upstreamStatus : undefined);
      throw error;
    }
  }
  const [menu, stop] = await Promise.all([
    readCatalogPart("/api/menu/v3/by_id", { organizationId: context.organizationId, externalMenuId: Number(context.menuId) }),
    readCatalogPart("/api/1/stop_lists", { organizationIds: [context.organizationId], terminalGroupsIds: [context.terminalGroupId], returnSize: true }),
  ]);
  const items = parseCatalog(menu, stop, context);
  if (!items.length) {
    const allowedSkus = new Set(context.allowlist.values());
    const products = records(menu.products).filter(product => allowedSkus.has(String(product.sku)));
    const groups = records(menu.itemsGroups);
    const list = groups.flatMap(group => records(group.items));
    const sizes = list.flatMap(item => records(item.sizePrices));
    const words = (values: unknown[]) => [...new Set(values.map(value =>
      typeof value === "string" && /^[a-z]+$/i.test(value) ? value : typeof value))];
    console.warn("iiko QR catalog empty", JSON.stringify({
      skuMatches: products.length,
      productTypes: words(products.map(product => product.type)),
      orderTypes: words(products.map(product => product.orderItemType)),
      openPrices: products.filter(product => product.canSetOpenPrice === true).length,
      marked: products.filter(product => product.isMarked === true).length,
      groups: groups.length,
      hiddenGroups: groups.filter(group => group.isHidden === true).length,
      scheduledGroups: groups.filter(group => !!group.scheduleId).length,
      items: list.length,
      hiddenItems: list.filter(item => item.isHidden === true).length,
      modifierItems: list.filter(item => records(item.modifierGroups).length > 0).length,
      sizes: sizes.length,
      priceTypes: words(sizes.map(size => typeof size.price)),
      positivePrices: sizes.filter(size => kopecks(size.price) !== null).length,
    }));
  }
  return items;
}

export function getOrderId(context: Context, requestId: unknown) {
  if (typeof requestId !== "string" || !REQUEST_ID.test(requestId)) return undefined;
  const hash = createHash("sha256").update(
    JSON.stringify(["smoke-dog-qr-order-v1", context.organizationId, context.table.tokenHash, requestId.toLowerCase()]),
  ).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-8${hash.slice(13, 16)}-8${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

export async function readOrder(iiko: Iiko, context: Context, id: string) {
  const response = await iiko.read("/api/1/order/by_id", { organizationIds: [context.organizationId], orderIds: [id] });
  if (!Array.isArray(response.orders)) throw new Error("Invalid iiko order lookup");
  return records(response.orders).find(order => guid(order.id) === id && guid(order.organizationId) === guid(context.organizationId));
}

export function orderStatus(info: Row | undefined, context: Context) {
  const order = record(info?.order);
  const terminalGroupId = guid(info?.terminalGroupId ?? order?.terminalGroupId);
  if (info?.creationStatus === "Success" && Array.isArray(order?.tableIds)
    && order.tableIds.some(table => guid(table) === guid(context.table.tableId))
    && (!terminalGroupId || terminalGroupId === guid(context.terminalGroupId))) {
    return { accepted: true, status: "accepted", orderNumber: typeof order.number === "number" ? order.number : undefined };
  }
  if (info?.creationStatus === "Error") return { accepted: false, status: "failed", code: "IIKO_REJECTED", message: "Касса не приняла заказ. Обратитесь к официанту." };
  return { accepted: false, status: "pending", message: "Проверяем заказ на кассе. Не отправляйте его повторно." };
}

export async function submitOrder(iiko: Iiko, context: Context, id: string, cart: CartItem[]) {
  const existing = await readOrder(iiko, context, id);
  if (existing) return orderStatus(existing, context);
  const catalog = new Map((await readOrderCatalog(iiko, context)).map(item => [item.id, item]));
  const items = [];
  for (const choice of cart) {
    const item = catalog.get(choice.id);
    if (!item || kopecks(item.price) !== kopecks(choice.unitPrice) || (item.balance !== undefined && item.balance < choice.quantity)) {
      return { accepted: false, status: "failed", code: "CART_CHANGED", message: "Цена или наличие изменились. Обновите меню и проверьте выбор." };
    }
    items.push({ type: "Product", productId: item.productId, amount: choice.quantity, ...(item.sizeId ? { productSizeId: item.sizeId } : {}) });
  }
  try {
    const response = await iiko.createTableOrder({
      organizationId: context.organizationId,
      terminalGroupId: context.terminalGroupId,
      order: { id, orderServiceType: "Common", tableIds: [context.table.tableId], menuId: context.menuId, items },
      createOrderSettings: { checkStopList: true, servicePrint: true },
    });
    const info = record(response.orderInfo);
    return orderStatus(guid(info?.id) === id ? info : undefined, context);
  } catch {
    // A transport error cannot establish whether the terminal received the order.
    return orderStatus(undefined, context);
  }
}
