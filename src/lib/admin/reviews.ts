import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

/**
 * Очередь отзывов гостей (модерация перед публикацией на сайте).
 *
 * Хранится в том же GitHub-репозитории, что и content.json, но в отдельной
 * ветке `reviews-inbox` (файл reviews/inbox.enc). Ветка исключена из деплоя
 * в vercel.json — новый отзыв не запускает пересборку сайта. Публикация
 * отзыва через /admin переносит его в content.json → testimonials на main.
 *
 * Репозиторий публичный, а в отзывах — имена и телефоны гостей, поэтому файл
 * хранится зашифрованным (AES-256-GCM, ключ из ADMIN_SESSION_SECRET).
 * Смена ADMIN_SESSION_SECRET сделает старую очередь нечитаемой.
 *
 * Env: GITHUB_REPO, GITHUB_TOKEN, ADMIN_SESSION_SECRET (те же, что для админки).
 */

const REPO = process.env.GITHUB_REPO || "dancekilla1999-gif/smoke-dog";
const TOKEN = process.env.GITHUB_TOKEN || "";
const BRANCH = "reviews-inbox";
const FILE_PATH = "reviews/inbox.enc";
const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-only-insecure-secret-change-me";

function key(): Buffer {
  return createHash("sha256").update(`reviews-inbox:${SECRET}`).digest();
}

function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf-8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ["v1", iv.toString("base64"), tag.toString("base64"), data.toString("base64")].join(":");
}

function decrypt(payload: string): string {
  const [version, ivB64, tagB64, dataB64] = payload.trim().split(":");
  if (version !== "v1" || !ivB64 || !tagB64 || !dataB64) {
    throw new Error("Очередь отзывов повреждена или зашифрована другим ключом");
  }
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]).toString("utf-8");
}

export type ReviewStatus = "new" | "published" | "hidden";

export interface InboxReview {
  id: string;
  rating: number;
  name: string;
  phone: string;
  text: string;
  /** Гость (5 звёзд) разрешил публикацию на сайте */
  canPublish: boolean;
  at: string;
  status: ReviewStatus;
  /** Когда отзыв был опубликован/скрыт через админку */
  moderatedAt?: string;
}

export function reviewsStoreConfigured(): boolean {
  return Boolean(TOKEN);
}

async function gh(path: string, init?: RequestInit) {
  return fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

/** Ветка очереди создаётся один раз от текущего main. */
async function ensureBranch(): Promise<void> {
  const existing = await gh(`/git/ref/heads/${BRANCH}`);
  if (existing.ok) return;
  if (existing.status !== 404) {
    throw new Error(`GitHub ref read failed: ${existing.status}`);
  }
  const main = await gh(`/git/ref/heads/main`);
  if (!main.ok) throw new Error(`GitHub main ref read failed: ${main.status}`);
  const { object } = (await main.json()) as { object: { sha: string } };
  const created = await gh(`/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${BRANCH}`, sha: object.sha }),
  });
  // 422 — ветку успели создать параллельно, это не ошибка
  if (!created.ok && created.status !== 422) {
    throw new Error(`GitHub branch create failed: ${created.status}`);
  }
}

export async function readInbox(): Promise<{ items: InboxReview[]; sha?: string }> {
  const res = await gh(`/contents/${FILE_PATH}?ref=${BRANCH}`);
  if (res.status === 404) return { items: [] };
  if (!res.ok) throw new Error(`GitHub inbox read failed: ${res.status}`);
  const data = (await res.json()) as { content: string; sha: string };
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  const parsed = JSON.parse(decrypt(decoded)) as unknown;
  return { items: Array.isArray(parsed) ? (parsed as InboxReview[]) : [], sha: data.sha };
}

async function writeInbox(items: InboxReview[], sha: string | undefined, message: string) {
  const encoded = Buffer.from(encrypt(JSON.stringify(items)), "utf-8").toString("base64");
  const res = await gh(`/contents/${FILE_PATH}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: encoded, branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
  return res;
}

/**
 * Читает очередь, применяет изменение и записывает обратно.
 * При гонке (два отзыва одновременно → sha устарел, 409/422) — перечитывает и повторяет.
 */
async function mutateInbox(
  mutate: (items: InboxReview[]) => InboxReview[],
  message: string
): Promise<InboxReview[]> {
  await ensureBranch();
  let lastError = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    const { items, sha } = await readInbox();
    const next = mutate(items);
    const res = await writeInbox(next, sha, message);
    if (res.ok) return next;
    lastError = `${res.status} ${await res.text()}`;
    if (res.status !== 409 && res.status !== 422) break;
  }
  throw new Error(`GitHub inbox write failed: ${lastError}`);
}

export async function addReview(
  review: Omit<InboxReview, "id" | "status">
): Promise<InboxReview> {
  const item: InboxReview = {
    ...review,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    status: "new",
  };
  await mutateInbox(
    (items) => [item, ...items],
    `Отзыв гостя (${review.rating}/5)${review.canPublish ? " — можно публиковать" : ""}`
  );
  return item;
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<InboxReview> {
  let updated: InboxReview | undefined;
  await mutateInbox((items) => {
    const next = items.map((r) => {
      if (r.id !== id) return r;
      updated = { ...r, status, moderatedAt: new Date().toISOString() };
      return updated;
    });
    if (!updated) throw new Error("Отзыв не найден");
    return next;
  }, `Отзыв ${id}: ${status}`);
  return updated as InboxReview;
}
