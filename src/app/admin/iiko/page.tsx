"use client";

import { useState } from "react";

type CheckResult = { message: string; organizations: string[] };

export default function IikoCheckPage() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  async function checkConnection() {
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch("/api/admin/iiko/diagnostics", {
        method: "POST",
        cache: "no-store",
      });
      const data = await response.json();
      let message: string;
      const organizations: string[] = [];
      if (response.ok && data.connected === true) {
        const entries: unknown = data.organizations?.organizations;
        if (Array.isArray(entries)) {
          for (const entry of entries) {
            if (typeof entry?.name === "string") organizations.push(entry.name);
          }
        }
        message = organizations.length
          ? "iiko ответила. Доступные организации:"
          : "iiko ответила, но список доступных организаций пуст.";
      } else if (response.status === 401) {
        message = "Войдите в админку Smoke Dog и повторите проверку.";
      } else if (response.status === 503) {
        message = "Подключение не настроено полностью. Проверьте переменные iiko в Vercel.";
      } else if (Number.isInteger(data.upstreamStatus)) {
        message = `iiko отклонила запрос (HTTP ${data.upstreamStatus}).`;
      } else {
        message = "Не удалось проверить связь с iiko. Попробуйте ещё раз.";
      }
      setResult({ message, organizations });
    } catch {
      setResult({ message: "Не удалось выполнить проверку. Попробуйте ещё раз.", organizations: [] });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <section className="mx-auto max-w-xl rounded-2xl border border-white/15 p-6 sm:p-8">
        <a className="text-sm text-white/70 underline" href="/admin">Вход в админку</a>
        <h1 className="mt-5 text-2xl">Подключение iiko</h1>
        <p className="mt-3 text-white/75">Проверка загружает список доступных ресторанов. Заказ на кассу не отправляется.</p>
        <button
          type="button"
          className="mt-6 rounded-md bg-white px-4 py-2 text-black disabled:opacity-60"
          disabled={busy}
          onClick={checkConnection}
        >
          {busy ? "Проверяем…" : "Проверить связь с iiko"}
        </button>
        {result && (
          <div className="mt-5 text-sm" role="status">
            <p>{result.message}</p>
            {result.organizations.length > 0 && (
              <ul className="mt-2 list-inside list-disc">
                {result.organizations.map((name, index) => <li key={index}>{name}</li>)}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
