"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Tab = "contacts" | "texts" | "menu" | "events" | "gallery" | "faq";

type MenuItem = {
  name: string;
  description: string;
  price: string;
  category: string;
  tag?: string;
  image?: string;
};

type Content = {
  site: Record<string, any>;
  conceptStates: { title: string; text: string }[];
  menu: MenuItem[];
  events: any[];
  gallery: { src: string; alt: string; span?: string }[];
  faq: { q: string; a: string }[];
  testimonials: any[];
};

const CATEGORIES = ["Закуски", "Основное", "Из огня", "Десерты", "Коктейли"];
const TAGS = ["", "Сигниче", "Выбор шефа", "Веган", "Хит"];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("menu");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [content, setContent] = useState<Content | null>(null);
  const [sha, setSha] = useState("");

  const load = useCallback(async () => {
    try {
      const check = await fetch("/api/admin/check").then((r) => r.json());
      if (!check.authenticated) {
        router.replace("/admin");
        return;
      }
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка загрузки");
      setContent(data.content);
      setSha(data.sha);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(msg: string) {
    if (!content || !sha) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sha, message: msg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сохранения");
      setMessage("Сохранено! Сайт обновится через 1–2 минуты.");
      // reload sha
      const fresh = await fetch("/api/admin/content").then((r) => r.json());
      if (fresh.sha) setSha(fresh.sha);
      if (fresh.content) setContent(fresh.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/50">
        Загрузка...
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400 p-6 text-center">
        {error || "Не удалось загрузить данные"}
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "menu", label: "Меню" },
    { id: "contacts", label: "Контакты" },
    { id: "texts", label: "Тексты" },
    { id: "events", label: "Афиша" },
    { id: "gallery", label: "Галерея" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 bg-neutral-950/95 z-50 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-lg tracking-[0.2em] font-light">SOUL</span>
          <span className="text-white/40 text-xs hidden sm:inline">Админ</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <a href="/" target="_blank" className="text-white/50 hover:text-white">
            Сайт ↗
          </a>
          <button onClick={handleLogout} className="text-white/50 hover:text-red-400">
            Выйти
          </button>
        </div>
      </header>

      <nav className="border-b border-white/10 px-2 flex gap-0.5 overflow-x-auto sticky top-[53px] bg-neutral-950 z-40">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2.5 text-sm whitespace-nowrap border-b-2 transition ${
              tab === t.id
                ? "border-white text-white"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="p-4 max-w-3xl mx-auto pb-24">
        {message && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {tab === "menu" && (
          <MenuSection
            menu={content.menu}
            onChange={(menu) => setContent({ ...content, menu })}
            onSave={() => save("Update menu via admin")}
            saving={saving}
          />
        )}
        {tab === "contacts" && (
          <ContactsSection
            site={content.site}
            onChange={(site) => setContent({ ...content, site })}
            onSave={() => save("Update contacts via admin")}
            saving={saving}
          />
        )}
        {tab === "texts" && (
          <TextsSection
            site={content.site}
            conceptStates={content.conceptStates}
            onChangeSite={(site) => setContent({ ...content, site })}
            onChangeStates={(conceptStates) => setContent({ ...content, conceptStates })}
            onSave={() => save("Update texts via admin")}
            saving={saving}
          />
        )}
        {tab === "events" && (
          <EventsSection
            events={content.events}
            onChange={(events) => setContent({ ...content, events })}
            onSave={() => save("Update events via admin")}
            saving={saving}
          />
        )}
        {tab === "gallery" && (
          <GallerySection
            gallery={content.gallery}
            onChange={(gallery) => setContent({ ...content, gallery })}
            onSave={() => save("Update gallery via admin")}
            saving={saving}
          />
        )}
        {tab === "faq" && (
          <FaqSection
            faq={content.faq}
            onChange={(faq) => setContent({ ...content, faq })}
            onSave={() => save("Update FAQ via admin")}
            saving={saving}
          />
        )}
      </main>
    </div>
  );
}

/* ========== MENU ========== */
function MenuSection({
  menu,
  onChange,
  onSave,
  saving,
}: {
  menu: MenuItem[];
  onChange: (m: MenuItem[]) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<MenuItem>({
    name: "",
    description: "",
    price: "",
    category: "Закуски",
    tag: "",
  });

  function startAdd() {
    setEditIdx(-1);
    setForm({ name: "", description: "", price: "", category: "Закуски", tag: "" });
  }

  function startEdit(i: number) {
    setEditIdx(i);
    setForm({ ...menu[i] });
  }

  function saveItem() {
    if (!form.name.trim()) return;
    const item = { ...form, tag: form.tag || undefined };
    if (editIdx === -1) {
      onChange([...menu, item]);
    } else if (editIdx !== null) {
      const next = [...menu];
      next[editIdx] = item;
      onChange(next);
    }
    setEditIdx(null);
  }

  function remove(i: number) {
    if (!confirm("Удалить блюдо?")) return;
    onChange(menu.filter((_, idx) => idx !== i));
  }

  const byCat = CATEGORIES.map((cat) => ({
    cat,
    items: menu.map((m, i) => ({ ...m, _i: i })).filter((m) => m.category === cat),
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-light">Меню</h2>
        <button
          onClick={startAdd}
          className="bg-white text-black text-sm px-4 py-2 rounded-lg font-medium"
        >
          + Добавить блюдо
        </button>
      </div>

      {editIdx !== null && (
        <div className="bg-white/5 border border-white/15 rounded-xl p-4 space-y-3">
          <h3 className="text-sm text-white/60">
            {editIdx === -1 ? "Новое блюдо" : "Редактирование"}
          </h3>
          <Input label="Название" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <TextArea label="Описание" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Цена" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="1 290 ₽" />
            <div>
              <label className="block text-white/50 text-xs mb-1">Категория</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-white/50 text-xs mb-1">Тег</label>
            <select
              value={form.tag || ""}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white"
            >
              {TAGS.map((t) => (
                <option key={t || "none"} value={t}>{t || "— нет —"}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={saveItem} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium">
              Готово
            </button>
            <button onClick={() => setEditIdx(null)} className="text-white/50 px-4 py-2 text-sm">
              Отмена
            </button>
          </div>
        </div>
      )}

      {byCat.map(({ cat, items }) =>
        items.length === 0 ? null : (
          <div key={cat}>
            <h3 className="text-sm text-white/40 uppercase tracking-wider mb-2">{cat}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item._i}
                  className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {item.name}
                      {item.tag && (
                        <span className="ml-2 text-xs text-amber-400/80">{item.tag}</span>
                      )}
                    </div>
                    <div className="text-white/40 text-xs truncate">{item.description}</div>
                    <div className="text-white/60 text-sm mt-0.5">{item.price}</div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => startEdit(item._i)} className="text-xs text-white/50 hover:text-white px-2 py-1">
                      Изменить
                    </button>
                    <button onClick={() => remove(item._i)} className="text-xs text-red-400/70 hover:text-red-400 px-2 py-1">
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

/* ========== CONTACTS ========== */
function ContactsSection({
  site,
  onChange,
  onSave,
  saving,
}: {
  site: Record<string, any>;
  onChange: (s: Record<string, any>) => void;
  onSave: () => void;
  saving: boolean;
}) {
  function set(path: string, value: string) {
    const next = { ...site };
    if (path.startsWith("address.")) {
      next.address = { ...next.address, [path.split(".")[1]]: value };
    } else if (path.startsWith("social.")) {
      next.social = { ...next.social, [path.split(".")[1]]: value };
    } else if (path === "hours0") {
      next.hours = [{ ...next.hours[0], time: value }, next.hours[1]];
    } else if (path === "hours1") {
      next.hours = [next.hours[0], { ...next.hours[1], time: value }];
    } else {
      next[path] = value;
      if (path === "phone") {
        next.phoneHref = value.replace(/\s/g, "");
      }
    }
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-light">Контакты</h2>
      <Input label="Телефон" value={site.phone || ""} onChange={(v) => set("phone", v)} />
      <Input label="Email" value={site.email || ""} onChange={(v) => set("email", v)} />
      <Input label="Адрес" value={site.address?.street || ""} onChange={(v) => set("address.street", v)} />
      <Input label="Город" value={site.address?.city || ""} onChange={(v) => set("address.city", v)} />
      <Input label="Instagram" value={site.social?.instagram || ""} onChange={(v) => set("social.instagram", v)} />
      <Input label="Telegram" value={site.social?.telegram || ""} onChange={(v) => set("social.telegram", v)} />
      <Input label="WhatsApp" value={site.social?.whatsapp || ""} onChange={(v) => set("social.whatsapp", v)} />
      <Input label="Часы Пт–Сб" value={site.hours?.[0]?.time || ""} onChange={(v) => set("hours0", v)} />
      <Input label="Часы остальные дни" value={site.hours?.[1]?.time || ""} onChange={(v) => set("hours1", v)} />
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

/* ========== TEXTS ========== */
function TextsSection({
  site,
  conceptStates,
  onChangeSite,
  onChangeStates,
  onSave,
  saving,
}: {
  site: Record<string, any>;
  conceptStates: { title: string; text: string }[];
  onChangeSite: (s: Record<string, any>) => void;
  onChangeStates: (s: { title: string; text: string }[]) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-light">Тексты / О нас</h2>
      <Input label="Слоган" value={site.tagline || ""} onChange={(v) => onChangeSite({ ...site, tagline: v })} />
      <Input label="Концепция" value={site.concept || ""} onChange={(v) => onChangeSite({ ...site, concept: v })} />
      <TextArea
        label="Короткое описание"
        value={site.descriptionShort || ""}
        onChange={(v) => onChangeSite({ ...site, descriptionShort: v })}
      />
      <h3 className="text-sm text-white/40 pt-2">Состояния / настроения</h3>
      {conceptStates.map((s, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
          <Input
            label="Заголовок"
            value={s.title}
            onChange={(v) => {
              const next = [...conceptStates];
              next[i] = { ...next[i], title: v };
              onChangeStates(next);
            }}
          />
          <TextArea
            label="Текст"
            value={s.text}
            onChange={(v) => {
              const next = [...conceptStates];
              next[i] = { ...next[i], text: v };
              onChangeStates(next);
            }}
          />
        </div>
      ))}
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

/* ========== EVENTS ========== */
function EventsSection({
  events,
  onChange,
  onSave,
  saving,
}: {
  events: any[];
  onChange: (e: any[]) => void;
  onSave: () => void;
  saving: boolean;
}) {
  function update(i: number, key: string, value: string) {
    const next = [...events];
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  }

  function add() {
    onChange([
      ...events,
      {
        date: "",
        weekday: "",
        title: "",
        subtitle: "",
        time: "",
        lineup: [],
        poster: "/images/poster-1.jpg",
        featured: false,
      },
    ]);
  }

  function remove(i: number) {
    if (!confirm("Удалить событие?")) return;
    onChange(events.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-light">Афиша</h2>
        <button onClick={add} className="bg-white text-black text-sm px-4 py-2 rounded-lg font-medium">
          + Событие
        </button>
      </div>
      {events.map((ev, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-white/40 text-xs">Событие {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400/70 text-xs">Удалить</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Дата" value={ev.date || ""} onChange={(v) => update(i, "date", v)} placeholder="25.07" />
            <Input label="День" value={ev.weekday || ""} onChange={(v) => update(i, "weekday", v)} placeholder="Пятница" />
          </div>
          <Input label="Название" value={ev.title || ""} onChange={(v) => update(i, "title", v)} />
          <Input label="Подзаголовок" value={ev.subtitle || ""} onChange={(v) => update(i, "subtitle", v)} />
          <Input label="Время" value={ev.time || ""} onChange={(v) => update(i, "time", v)} placeholder="21:00" />
          <Input label="Постер (путь)" value={ev.poster || ""} onChange={(v) => update(i, "poster", v)} />
          <Input
            label="Lineup (через | )"
            value={(ev.lineup || []).join(" | ")}
            onChange={(v) => {
              const next = [...events];
              next[i] = { ...next[i], lineup: v.split("|").map((s: string) => s.trim()).filter(Boolean) };
              onChange(next);
            }}
          />
        </div>
      ))}
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

/* ========== GALLERY ========== */
function GallerySection({
  gallery,
  onChange,
  onSave,
  saving,
}: {
  gallery: { src: string; alt: string; span?: string }[];
  onChange: (g: { src: string; alt: string; span?: string }[]) => void;
  onSave: () => void;
  saving: boolean;
}) {
  function update(i: number, key: string, value: string) {
    const next = [...gallery];
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  }

  function add() {
    onChange([...gallery, { src: "/images/", alt: "", span: "square" }]);
  }

  function remove(i: number) {
    if (!confirm("Удалить фото?")) return;
    onChange(gallery.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-light">Галерея</h2>
        <button onClick={add} className="bg-white text-black text-sm px-4 py-2 rounded-lg font-medium">
          + Фото
        </button>
      </div>
      <p className="text-white/40 text-xs">
        Сначала загрузите файл в папку public/images/ через GitHub, затем укажите путь вида /images/имя.jpg
      </p>
      {gallery.map((g, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 space-y-2">
              <Input label="Путь к файлу" value={g.src} onChange={(v) => update(i, "src", v)} />
              <Input label="Описание (alt)" value={g.alt} onChange={(v) => update(i, "alt", v)} />
            </div>
            <button onClick={() => remove(i)} className="text-red-400/70 text-xs mt-6">Удалить</button>
          </div>
        </div>
      ))}
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

/* ========== FAQ ========== */
function FaqSection({
  faq,
  onChange,
  onSave,
  saving,
}: {
  faq: { q: string; a: string }[];
  onChange: (f: { q: string; a: string }[]) => void;
  onSave: () => void;
  saving: boolean;
}) {
  function update(i: number, key: "q" | "a", value: string) {
    const next = [...faq];
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  }

  function add() {
    onChange([...faq, { q: "", a: "" }]);
  }

  function remove(i: number) {
    if (!confirm("Удалить вопрос?")) return;
    onChange(faq.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-light">FAQ</h2>
        <button onClick={add} className="bg-white text-black text-sm px-4 py-2 rounded-lg font-medium">
          + Вопрос
        </button>
      </div>
      {faq.map((item, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-white/40 text-xs">Вопрос {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400/70 text-xs">Удалить</button>
          </div>
          <Input label="Вопрос" value={item.q} onChange={(v) => update(i, "q", v)} />
          <TextArea label="Ответ" value={item.a} onChange={(v) => update(i, "a", v)} />
        </div>
      ))}
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

/* ========== UI helpers ========== */
function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-white/50 text-xs mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/40"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-white/50 text-xs mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/40"
      />
    </div>
  );
}

function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-white/90 transition disabled:opacity-50 mt-4"
    >
      {saving ? "Сохранение..." : "Сохранить изменения"}
    </button>
  );
}
