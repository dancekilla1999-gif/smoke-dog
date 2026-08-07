/**
 * Простая авторизация админки Smoke Dog
 * Логин и пароль заданы здесь (можно вынести в .env)
 */

const ADMIN_EMAIL = "Soul-rest@yandex.ru";
const ADMIN_PASSWORD = "Soul2026!";

export function validateCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}

export const ADMIN_SESSION_COOKIE = "soul_admin_session";
export const ADMIN_SESSION_VALUE = "authenticated_soul_2026";

export function isValidSession(cookieValue: string | undefined): boolean {
  return cookieValue === ADMIN_SESSION_VALUE;
}
