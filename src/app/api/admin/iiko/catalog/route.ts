import { NextRequest } from "next/server";
import { createIikoReader } from "@/lib/iiko/client";
import { inspectConfiguration } from "@/lib/iiko/config";
import { failure, json, requireAdmin } from "@/lib/iiko/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (Number(req.headers.get("content-length") || 0) > 4096) return json({ error: "Request too large" }, 413);
  let resource: unknown;
  try { ({ resource } = await req.json()); } catch { return json({ error: "Invalid JSON" }, 400); }
  if (!["terminals", "tables", "menus", "menu", "stopLists"].includes(String(resource))) return json({ error: "Unknown resource" }, 400);
  const config = inspectConfiguration();
  if (!config.credentialsConfigured || config.missing.includes("IIKO_ORGANIZATION_ID")) return json({ error: "IIKO configuration incomplete" }, 503);
  if (["tables", "stopLists"].includes(String(resource)) && config.missing.includes("IIKO_TERMINAL_GROUP_ID")) return json({ error: "Terminal group is not configured" }, 503);
  const externalMenuId = process.env.IIKO_EXTERNAL_MENU_ID?.trim();
  if (resource === "menu" && (!externalMenuId || !/^\d{1,18}$/.test(externalMenuId) || !Number.isSafeInteger(Number(externalMenuId)) || Number(externalMenuId) <= 0)) return json({ error: "External menu is not configured" }, 503);
  try {
    const read = await createIikoReader();
    let result;
    switch (resource) {
      case "terminals": result = await read("/api/1/terminal_groups", { organizationIds: [config.organizationId] }); break;
      case "tables": result = await read("/api/1/reserve/available_restaurant_sections", { terminalGroupIds: [config.terminalGroupId] }); break;
      case "menus": result = await read("/api/2/menu", { organizationIds: [config.organizationId] }); break;
      case "menu": result = await read("/api/menu/v3/by_id", { externalMenuId: Number(externalMenuId), organizationId: config.organizationId }); break;
      case "stopLists": result = await read("/api/1/stop_lists", { organizationIds: [config.organizationId], terminalGroupsIds: [config.terminalGroupId], returnSize: true }); break;
    }
    return json({ resource, data: result, orderingReady: false });
  } catch (error) { return failure(error); }
}
