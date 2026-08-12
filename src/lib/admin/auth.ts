import { createHmac, timingSafeEqual } from "crypto";

/**
 * Авторизация админки Smoke Dog.
 * Логин/пароль и секрет подписи сессии берутся из env (см. .env.example).
 * Локальные дефолты — только для разработки; на проде переменные ОБЯЗАТЕЛЬНЫ.
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@sdlounge.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "dev-only-insecure-secret-change-me";

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function validateCredentials(email: string, password: string): boolean {
  if (!ADMIN_PASSWORD) {
    // Пароль не настроен в env — вход запрещён (fail closed).
    console.error("[admin] ADMIN_PASSWORD не задан в переменных окружения");
    return false;
  }
  const emailOk = safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL.toLowerCase());
  const passOk = safeEqual(password, ADMIN_PASSWORD);
  return emailOk && passOk;
}

export const ADMIN_SESSION_COOKIE = "sd_admin_session";

function sign(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

/** Подписанный токен вида "<expiresAtMs>.<hmac>" — не переиспользуется между окружениями. */
export function createSessionToken(): string {
  const expires = Date.now() + SESSION_MAX_AGE_MS;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const [payload, sig] = cookieValue.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (!safeEqual(sig, expected)) return false;
  const expires = Number(payload);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  return true;
}

export const ADMIN_SESSION_MAX_AGE_SEC = SESSION_MAX_AGE_MS / 1000;
