"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Если уже авторизован — редирект в панель
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) router.replace("/admin/dashboard");
      })
      .catch(() => {});
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Неверный логин или пароль");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Ошибка соединения");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-[0.3em] text-white mb-2">
            Smoke Dog
          </h1>
          <p className="text-white/50 text-sm tracking-widest uppercase">
            Админ-панель
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition"
                placeholder="admin@sdlounge.com"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-white/90 transition disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
