import { NextRequest } from "next/server";
import { publicConfiguration } from "@/lib/iiko/config";
import { json } from "@/lib/iiko/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return json(publicConfiguration(req.nextUrl.searchParams.get("table")));
}
