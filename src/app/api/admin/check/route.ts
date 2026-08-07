import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSession } from "@/lib/admin/auth";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return NextResponse.json({
    authenticated: isValidSession(cookie),
  });
}
