import { cookies } from "next/headers";
import Link from "next/link";
import { ADMIN_SESSION_COOKIE, isValidSession } from "@/lib/admin/auth";
import { createIikoReader, IikoError } from "@/lib/iiko/client";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

type Row = Record<string, unknown>;
const rows = (value: unknown): Row[] => Array.isArray(value)
  ? value.filter((row): row is Row => !!row && typeof row === "object" && !Array.isArray(row))
  : [];
const label = (value: unknown) => typeof value === "string" ? value : "";
const uuid = (value: unknown): value is string => typeof value === "string"
  && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value);

async function readCatalog() {
  const read = await createIikoReader();
  const organizations = await read("/api/1/organizations");
  const candidates = rows(organizations.organizations).filter(org => {
    const name = label(org.name).trim().toLowerCase();
    return uuid(org.id) && (name === "смок дог москва" || name === "smoke dog moscow");
  });
  if (candidates.length !== 1) throw new Error("Ресторан «Смок Дог Москва» не найден однозначно.");
  const org = candidates[0];
  const organizationId = String(org.id);
  const [terminals, menus] = await Promise.allSettled([
    read("/api/1/terminal_groups", { organizationIds: [organizationId] }),
    read("/api/2/menu", { organizationIds: [organizationId] }),
  ]);
  if (terminals.status === "rejected") throw terminals.reason;
  const groups = rows(terminals.value.terminalGroups)
    .filter(entry => entry.organizationId === organizationId)
    .flatMap(entry => rows(entry.items))
    .filter(group => uuid(group.id));
  if (groups.length > 30) throw new Error("iiko вернула слишком много кассовых групп для автоматической сверки.");
  const sectionResult = groups.length
    ? await read("/api/1/reserve/available_restaurant_sections", { terminalGroupIds: groups.map(group => group.id) })
    : {};
  return {
    restaurant: { name: label(org.name), id: organizationId },
    terminalGroups: groups.map(group => ({ name: label(group.name), id: group.id })),
    sections: rows(sectionResult.restaurantSections).map(section => ({
      name: label(section.name),
      terminalGroupId: uuid(section.terminalGroupId) ? section.terminalGroupId : null,
      tables: rows(section.tables).filter(table => uuid(table.id)).map(table => ({
        name: label(table.name), number: typeof table.number === "number" ? table.number : label(table.number), id: table.id,
      })),
    })),
    menus: menus.status === "fulfilled"
      ? rows(menus.value.externalMenus).map(menu => ({
          name: label(menu.name), id: typeof menu.id === "number" && Number.isSafeInteger(menu.id) ? menu.id : label(menu.id),
        }))
      : null,
  };
}

export default async function IikoCatalogPage() {
  const configured = process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET
    && process.env.ADMIN_SESSION_SECRET !== "dev-only-insecure-secret-change-me";
  const authenticated = configured && isValidSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
  let content: React.ReactNode;
  if (!authenticated) {
    content = <Link className="underline" href="/admin">Войдите в админку Smoke Dog</Link>;
  } else {
    try {
      const catalog = await readCatalog();
      content = <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed">{JSON.stringify(catalog, null, 2)}</pre>;
    } catch (error) {
      const message = error instanceof IikoError && error.upstreamStatus
        ? `iiko вернула HTTP ${error.upstreamStatus}.`
        : error instanceof Error && error.message.startsWith("Ресторан")
          ? error.message
          : "Не удалось получить каталог. Проверьте доступ iiko и повторите запрос.";
      content = <p role="status">{message}</p>;
    }
  }
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <section className="mx-auto max-w-4xl rounded-2xl border border-white/15 p-6">
        <h1 className="mb-4 text-2xl">Столы и кассы iiko</h1>
        {content}
      </section>
    </main>
  );
}

