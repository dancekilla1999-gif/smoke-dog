import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSession } from "@/lib/admin/auth";
import { IikoError } from "./client";

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow" } });
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret === "dev-only-insecure-secret-change-me" || !process.env.ADMIN_PASSWORD) return json({ error: "Admin access is not configured" }, 503);
  if (!isValidSession(req.cookies.get(ADMIN_SESSION_COOKIE)?.value)) return json({ error: "Unauthorized" }, 401);
  if (req.headers.get("origin") !== new URL(req.url).origin) return json({ error: "Forbidden" }, 403);
  return null;
}

export function failure(error: unknown) {
  const code = error instanceof IikoError ? error.code : "upstream_error";
  const upstreamStatus = error instanceof IikoError ? error.upstreamStatus : undefined;
  return json({ connected: false, error: code, ...(upstreamStatus ? { upstreamStatus } : {}) }, code === "not_configured" ? 503 : 502);
}
