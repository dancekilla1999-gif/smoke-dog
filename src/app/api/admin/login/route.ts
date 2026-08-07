import { NextRequest, NextResponse } from "next/server";
import {
  validateCredentials,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_VALUE,
} from "@/lib/admin/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Укажите email и пароль" },
        { status: 400 }
      );
    }

    if (!validateCredentials(email, password)) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
