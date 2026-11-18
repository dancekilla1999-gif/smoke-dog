import { json } from "@/lib/iiko/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// No fake acceptance, persistence or iiko write while onboarding is unfinished.
export async function POST() {
  return json({ accepted: false, code: "ORDERING_NOT_CONNECTED", message: "Заказ не отправлен. Покажите ваш выбор официанту." }, 503);
}
