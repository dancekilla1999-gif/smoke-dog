import "server-only";

const BASE_URL = "https://api-ru.iiko.services";
const READ_PATHS = ["/api/1/organizations", "/api/1/terminal_groups", "/api/1/reserve/available_restaurant_sections", "/api/1/stop_lists", "/api/2/menu", "/api/menu/v3/by_id"] as const;
const WRITE_PATHS = ["/api/1/order/create", "/api/1/commands/status"] as const;
type ReadPath = typeof READ_PATHS[number];
type WritePath = typeof WRITE_PATHS[number];

export class IikoError extends Error {
  constructor(public readonly code: "not_configured" | "upstream_error" | "invalid_response" | "timeout", public readonly upstreamStatus?: number) {
    super(code);
  }
}

async function request(path: string, body: unknown, token?: string): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(BASE_URL + path, {
      method: "POST", redirect: "error", cache: "no-store", signal: controller.signal,
      headers: { "Content-Type": "application/json", "Timeout": "10", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    // Never expose provider bodies: they may echo credentials or contain internal details.
    if (!response.ok) throw new IikoError("upstream_error", response.status);
    const value: unknown = await response.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new IikoError("invalid_response");
    return value as Record<string, unknown>;
  } catch (error) {
    if (error instanceof IikoError) throw error;
    throw new IikoError(controller.signal.aborted ? "timeout" : "upstream_error");
  } finally { clearTimeout(timeout); }
}

/** Token remains within one server request; neither returned to the browser nor logged. */
export async function createIikoReader() {
  const appId = process.env.IIKO_APP_ID?.trim();
  const clientSecret = process.env.IIKO_CLIENT_SECRET?.trim();
  const apiKey = process.env.IIKO_API_KEY?.trim();
  if (!appId || !clientSecret || !apiKey) throw new IikoError("not_configured");
  const auth = await request("/api/v2/access_token", { appId, clientSecret, apiKey });
  if (typeof auth.token !== "string" || !auth.token) throw new IikoError("invalid_response");
  const token = auth.token;
  return async (path: ReadPath, body: unknown = {}) => {
    // Runtime guard as well as type guard; orders use createIikoWriter.
    if (!READ_PATHS.includes(path)) throw new IikoError("invalid_response");
    return request(path, body, token);
  };
}

/** Explicit write session. Only table-order create and its status check. */
export async function createIikoWriter() {
  const appId = process.env.IIKO_APP_ID?.trim();
  const clientSecret = process.env.IIKO_CLIENT_SECRET?.trim();
  const apiKey = process.env.IIKO_API_KEY?.trim();
  if (!appId || !clientSecret || !apiKey) throw new IikoError("not_configured");
  const auth = await request("/api/v2/access_token", { appId, clientSecret, apiKey });
  if (typeof auth.token !== "string" || !auth.token) throw new IikoError("invalid_response");
  const token = auth.token;
  return async (path: WritePath, body: unknown) => {
    if (!WRITE_PATHS.includes(path)) throw new IikoError("invalid_response");
    return request(path, body, token);
  };
}
