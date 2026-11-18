import { NextRequest } from "next/server";
import { createIikoReader } from "@/lib/iiko/client";
import { inspectConfiguration } from "@/lib/iiko/config";
import { failure, json, requireAdmin } from "@/lib/iiko/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const config = inspectConfiguration();
  if (!config.credentialsConfigured) return json({ connected: false, orderingReady: false, stage: "read_only", missing: config.missing }, 503);
  try {
    const read = await createIikoReader();
    const organizations = await read("/api/1/organizations", {});
    // This is admin-only discovery, not a claim that ordering is ready.
    return json({ connected: true, orderingReady: false, stage: "read_only", missing: config.missing, tableBindings: config.tables.length, organizations });
  } catch (error) { return failure(error); }
}
