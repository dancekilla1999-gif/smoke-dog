import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSession } from "@/lib/admin/auth";
import { getContentFile, saveContentFile } from "@/lib/admin/github";

function checkAuth(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return isValidSession(cookie);
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { content, sha } = await getContentFile();
    return NextResponse.json({ content, sha });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Read error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { content, sha, message } = body;
    if (!content || !sha) {
      return NextResponse.json({ error: "content and sha required" }, { status: 400 });
    }
    await saveContentFile(content, sha, message || "Update content via admin");
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Write error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
