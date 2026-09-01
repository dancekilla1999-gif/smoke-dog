import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSession } from "@/lib/admin/auth";
import { getContentFile, saveContentFile } from "@/lib/admin/github";
import {
  readInbox,
  reviewsStoreConfigured,
  setReviewStatus,
  type ReviewStatus,
} from "@/lib/admin/reviews";

/**
 * Модерация отзывов гостей из /admin.
 * GET  — очередь отзывов (все статусы; фильтрует клиент)
 * POST — { action: "publish", id, quote, author, role } → отзыв уходит в
 *        content.json → testimonials (main) и помечается published;
 *        { action: "hide" | "restore", id } → смена статуса без публикации.
 */

export const runtime = "nodejs";

function checkAuth(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!reviewsStoreConfigured()) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN не настроен — очередь отзывов недоступна" },
      { status: 500 }
    );
  }
  try {
    const { items } = await readInbox();
    return NextResponse.json({ items });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Read error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

interface ModerateBody {
  action?: "publish" | "hide" | "restore";
  id?: string;
  quote?: string;
  author?: string;
  role?: string;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: ModerateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const { action, id } = body;
  if (!id || !action) {
    return NextResponse.json({ error: "id и action обязательны" }, { status: 400 });
  }

  try {
    if (action === "publish") {
      const { items } = await readInbox();
      const review = items.find((r) => r.id === id);
      if (!review) {
        return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });
      }
      if (!review.canPublish) {
        return NextResponse.json(
          { error: "Гость не давал согласия на публикацию этого отзыва" },
          { status: 403 }
        );
      }
      const quote = (body.quote ?? review.text).toString().trim().slice(0, 600);
      const author = (body.author ?? review.name ?? "").toString().trim().slice(0, 80) || "Гость";
      const role = (body.role ?? "Гость").toString().trim().slice(0, 80) || "Гость";
      if (!quote) {
        return NextResponse.json({ error: "Текст отзыва пустой" }, { status: 422 });
      }

      const { content, sha } = await getContentFile();
      const testimonials = Array.isArray(content.testimonials)
        ? (content.testimonials as unknown[])
        : [];
      await saveContentFile(
        { ...content, testimonials: [{ quote, author, role }, ...testimonials] },
        sha,
        `Опубликовать отзыв гостя (${author}) via admin`
      );
      const updated = await setReviewStatus(id, "published");
      return NextResponse.json({ success: true, review: updated });
    }

    const status: ReviewStatus = action === "hide" ? "hidden" : "new";
    const updated = await setReviewStatus(id, status);
    return NextResponse.json({ success: true, review: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Write error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
