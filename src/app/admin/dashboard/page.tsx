"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { menuCategories } from "@/lib/data";
import type { InboxReview } from "@/lib/admin/reviews";

type Tab = "contacts" | "texts" | "menu" | "events" | "gallery" | "faq" | "reviews";

const TABS: Tab[] = ["menu", "contacts", "texts", "events", "gallery", "faq", "reviews"];

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
  testimonials: Testimonial[];
};

type Testimonial = { quote: string; author: string; role: string };

const CATEGORIES: string[] = menuCategories;
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
  const [pendingReviews, setPendingReviews] = useState(0);

  // Ссылка из Telegram ведёт сразу на нужную вкладку: /admin/dashboard?tab=reviews
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("tab") as Tab | null;
    if (wanted && TABS.includes(wanted)) setTab(wanted);
  }, []);

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
      fetch("/api/admin/reviews")
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.items)) {
            setPendingReviews(
              d.items.filter((r: InboxReview) => r.status === "new" && r.canPublish).length
            );
          }
        })
        .catch(() => {});
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
    { id: "reviews", label: pendingReviews > 0 ? `Отзывы · ${pendingReviews}` : "Отзывы" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 bg-neutral-950/95 z-50 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-lg tracking-[0.2em] font-light">SMOKE DOG</span>
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
        {tab === "reviews" && (
          <ReviewsSection
            testimonials={content.testimonials}
            onChangeTestimonials={(testimonials) => setContent({ ...content, testimonials })}
            onSaveTestimonials={() => save("Update testimonials via admin")}
            saving={saving}
            onPendingChange={setPendingReviews}
            onPublished={load}
          />
        )}
      </main>
    </div>
  );
}

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
    category: "Кальян",
    tag: "",
  });

  function startAdd() {
    setEditIdx(-1);
    setForm({ name: "", description: "", price: "", category: "Кальян", tag: "" });
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
        <button onClick={startAdd} className="bg-white text-black text-sm px-4 py-2 rounded-lg font-medium">
          + Добавить блюдо
        </button>
      </div>

      {editIdx !== null && (
        <div className="bg-white/5 border border-white/15 rounded-xl p-4 space-y-3">
          <h3 className="text-sm text-white/60">{editIdx === -1 ? "Новое блюдо" : "Редактирование"}</h3>
          <Input label="Название" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <TextArea label="Описание" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Цена" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="1 290 ₽" />
            <div>
              <label className="block text-white/50 text-xs mb-1">Категория</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white">
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-white/50 text-xs mb-1">Тег</label>
            <select value={form.tag || ""} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white">
              {TAGS.map((t) => (<option key={t || "none"} value={t}>{t || "— нет —"}</option>))}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={saveItem} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium">Готово</button>
            <button onClick={() => setEditIdx(null)} className="text-white/50 px-4 py-2 text-sm">Отмена</button>
          </div>
        </div>
      )}

      {byCat.map(({ cat, items }) =>
        items.length === 0 ? null : (
          <div key={cat}>
            <h3 className="text-sm text-white/40 uppercase tracking-wider mb-2">{cat}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item._i} className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {item.name}
                      {item.tag && <span className="ml-2 text-xs text-amber-400/80">{item.tag}</span>}
                    </div>
                    <div className="text-white/40 text-xs truncate">{item.description}</div>
                    <div className="text-white/60 text-sm mt-0.5">{item.price}</div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => startEdit(item._i)} className="text-xs text-white/50 hover:text-white px-2 py-1">Изменить</button>
                    <button onClick={() => remove(item._i)} className="text-xs text-red-400/70 hover:text-red-400 px-2 py-1">Удалить</button>
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

function ContactsSection({ site, onChange, onSave, saving }: { site: Record<string, any>; onChange: (s: Record<string, any>) => void; onSave: () => void; saving: boolean }) {
  function set(path: string, value: string) {
    const next = { ...site };
    if (path.startsWith("address.")) next.address = { ...next.address, [path.split(".")[1]]: value };
    else if (path.startsWith("social.")) next.social = { ...next.social, [path.split(".")[1]]: value };
    else if (path === "hours0") next.hours = [{ ...next.hours[0], time: value }];
    else {
      next[path] = value;
      if (path === "phone") next.phoneHref = value.replace(/\s/g, "");
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
      <Input label="Часы" value={site.hours?.[0]?.time || ""} onChange={(v) => set("hours0", v)} />
      <h3 className="text-sm text-white/40 pt-2">Яндекс Карты</h3>
      <Input label="ID организации (цифры из адреса карточки yandex.ru/maps/org/…/ID/)" value={site.yandexOrgId || ""} onChange={(v) => set("yandexOrgId", v)} placeholder="76863719030" />
      <Input label="Ссылка на форму отзыва на Картах" value={site.yandexReviewUrl || ""} onChange={(v) => set("yandexReviewUrl", v)} placeholder="https://yandex.ru/maps/org/…/reviews/?add-review=true" />
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

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
  onChangeStates: (c: { title: string; text: string }[]) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-light">Тексты / О нас</h2>
      <Input label="Слоган" value={site.tagline || ""} onChange={(v: string) => onChangeSite({ ...site, tagline: v })} />
      <Input label="Концепция" value={site.concept || ""} onChange={(v: string) => onChangeSite({ ...site, concept: v })} />
      <TextArea label="Короткое описание" value={site.descriptionShort || ""} onChange={(v: string) => onChangeSite({ ...site, descriptionShort: v })} />
      <h3 className="text-sm text-white/40 pt-2">Состояния / настроения</h3>
      {conceptStates.map((s: any, i: number) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
          <Input label="Заголовок" value={s.title} onChange={(v: string) => { const next = [...conceptStates]; next[i] = { ...next[i], title: v }; onChangeStates(next); }} />
          <TextArea label="Текст" value={s.text} onChange={(v: string) => { const next = [...conceptStates]; next[i] = { ...next[i], text: v }; onChangeStates(next); }} />
        </div>
      ))}
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

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
    const next = [...events]; next[i] = { ...next[i], [key]: value }; onChange(next);
  }
  function add() {
    onChange([...events, { date: "", weekday: "", title: "", subtitle: "", time: "", lineup: [], poster: "/images/gallery/lounge-bright.jpg", featured: false }]);
  }
  function remove(i: number) {
    if (!confirm("Удалить событие?")) return;
    onChange(events.filter((_: any, idx: number) => idx !== i));
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-light">Афиша</h2>
        <button onClick={add} className="bg-white text-black text-sm px-4 py-2 rounded-lg font-medium">+ Событие</button>
      </div>
      {events.map((ev: any, i: number) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-white/40 text-xs">Событие {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400/70 text-xs">Удалить</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Дата" value={ev.date || ""} onChange={(v: string) => update(i, "date", v)} placeholder="25.07" />
            <Input label="День" value={ev.weekday || ""} onChange={(v: string) => update(i, "weekday", v)} placeholder="Пятница" />
          </div>
          <Input label="Название" value={ev.title || ""} onChange={(v: string) => update(i, "title", v)} />
          <Input label="Подзаголовок" value={ev.subtitle || ""} onChange={(v: string) => update(i, "subtitle", v)} />
          <Input label="Время" value={ev.time || ""} onChange={(v: string) => update(i, "time", v)} placeholder="21:00" />
          <Input label="Постер (путь)" value={ev.poster || ""} onChange={(v: string) => update(i, "poster", v)} />
        </div>
      ))}
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

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
    const next = [...gallery]; next[i] = { ...next[i], [key]: value }; onChange(next);
  }
  function add() { onChange([...gallery, { src: "/images/gallery/", alt: "" }]); }
  function remove(i: number) {
    if (!confirm("Удалить фото?")) return;
    onChange(gallery.filter((_: any, idx: number) => idx !== i));
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-light">Галерея</h2>
        <button onClick={add} className="bg-white text-black text-sm px-4 py-2 rounded-lg font-medium">+ Фото</button>
      </div>
      <p className="text-white/40 text-xs">Загрузите файл в public/images/gallery/ через GitHub, затем укажите путь /images/gallery/имя.jpg</p>
      {gallery.map((g: any, i: number) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 space-y-2">
              <Input label="Путь к файлу" value={g.src} onChange={(v: string) => update(i, "src", v)} />
              <Input label="Описание (alt)" value={g.alt} onChange={(v: string) => update(i, "alt", v)} />
            </div>
            <button onClick={() => remove(i)} className="text-red-400/70 text-xs mt-6">Удалить</button>
          </div>
        </div>
      ))}
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

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
    const next = [...faq]; next[i] = { ...next[i], [key]: value }; onChange(next);
  }
  function add() { onChange([...faq, { q: "", a: "" }]); }
  function remove(i: number) {
    if (!confirm("Удалить вопрос?")) return;
    onChange(faq.filter((_: any, idx: number) => idx !== i));
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-light">FAQ</h2>
        <button onClick={add} className="bg-white text-black text-sm px-4 py-2 rounded-lg font-medium">+ Вопрос</button>
      </div>
      {faq.map((item: any, i: number) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-white/40 text-xs">Вопрос {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400/70 text-xs">Удалить</button>
          </div>
          <Input label="Вопрос" value={item.q} onChange={(v: string) => update(i, "q", v)} />
          <TextArea label="Ответ" value={item.a} onChange={(v: string) => update(i, "a", v)} />
        </div>
      ))}
      <SaveButton onClick={onSave} saving={saving} />
    </div>
  );
}

/**
 * Отзывы гостей с /review (QR на столах): очередь на модерацию + то, что уже на сайте.
 * Публиковать можно только отзывы, где гость (5 звёзд) нажал «Да, можно».
 */
function ReviewsSection({
  testimonials,
  onChangeTestimonials,
  onSaveTestimonials,
  saving,
  onPendingChange,
  onPublished,
}: {
  testimonials: Testimonial[];
  onChangeTestimonials: (t: Testimonial[]) => void;
  onSaveTestimonials: () => void;
  saving: boolean;
  onPendingChange: (n: number) => void;
  onPublished: () => void;
}) {
  const [items, setItems] = useState<InboxReview[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [publishId, setPublishId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Testimonial>({ quote: "", author: "", role: "Гость" });

  const reload = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка загрузки отзывов");
      const list: InboxReview[] = data.items;
      setItems(list);
      onPendingChange(list.filter((r) => r.status === "new" && r.canPublish).length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
      setItems([]);
    }
  }, [onPendingChange]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function moderate(body: Record<string, string>) {
    setBusyId(body.id);
    setError("");
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      setPublishId(null);
      await reload();
      if (body.action === "publish") onPublished();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusyId(null);
    }
  }

  function startPublish(r: InboxReview) {
    setPublishId(r.id);
    setDraft({ quote: r.text, author: r.name || "Гость", role: "Гость" });
  }

  function removeTestimonial(i: number) {
    if (!confirm("Убрать отзыв с сайта?")) return;
    onChangeTestimonials(testimonials.filter((_, idx) => idx !== i));
  }

  const fresh = (items ?? []).filter((r) => r.status === "new");
  const archive = (items ?? []).filter((r) => r.status !== "new");

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-light">Новые отзывы</h2>
          <button onClick={reload} className="text-xs text-white/50 hover:text-white">Обновить</button>
        </div>
        <p className="text-white/40 text-xs mt-1">
          Сюда попадают отзывы с формы по QR-коду. Публиковать на сайте можно только те, где гость
          поставил 5 звёзд и разрешил публикацию.
        </p>

        {error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">{error}</div>
        )}

        {items === null && <div className="mt-4 text-white/40 text-sm">Загрузка...</div>}
        {items !== null && fresh.length === 0 && (
          <div className="mt-4 text-white/40 text-sm">Новых отзывов нет.</div>
        )}

        <div className="mt-4 space-y-3">
          {fresh.map((r) => (
            <ReviewCard key={r.id} review={r} busy={busyId === r.id}>
              {publishId === r.id ? (
                <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                  <p className="text-xs text-white/50">Так отзыв будет выглядеть на сайте — можно поправить перед публикацией:</p>
                  <TextArea label="Цитата" value={draft.quote} onChange={(v) => setDraft({ ...draft, quote: v })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Имя" value={draft.author} onChange={(v) => setDraft({ ...draft, author: v })} />
                    <Input label="Подпись" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} placeholder="Гость" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => moderate({ action: "publish", id: r.id, ...draft })}
                      disabled={busyId === r.id || !draft.quote.trim()}
                      className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      {busyId === r.id ? "Публикуем..." : "Опубликовать на сайте"}
                    </button>
                    <button onClick={() => setPublishId(null)} className="text-white/50 px-4 py-2 text-sm">Отмена</button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.canPublish ? (
                    <button
                      onClick={() => startPublish(r)}
                      disabled={busyId === r.id}
                      className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      Опубликовать
                    </button>
                  ) : (
                    <span className="text-xs text-white/40 self-center">
                      {r.rating === 5 ? "Гость не разрешил публикацию" : "Публикуются только отзывы на 5 звёзд с согласия гостя"}
                    </span>
                  )}
                  <button
                    onClick={() => moderate({ action: "hide", id: r.id })}
                    disabled={busyId === r.id}
                    className="text-white/50 hover:text-white px-4 py-2 text-sm disabled:opacity-50"
                  >
                    Скрыть
                  </button>
                </div>
              )}
            </ReviewCard>
          ))}
        </div>

        {archive.length > 0 && (
          <div className="mt-6">
            <button onClick={() => setShowArchive((s) => !s)} className="text-xs text-white/50 hover:text-white">
              {showArchive ? "Скрыть архив" : `Архив (${archive.length})`}
            </button>
            {showArchive && (
              <div className="mt-3 space-y-3">
                {archive.map((r) => (
                  <ReviewCard key={r.id} review={r} busy={busyId === r.id}>
                    <div className="mt-3 flex items-center gap-3">
                      <span className={`text-xs ${r.status === "published" ? "text-green-400/80" : "text-white/40"}`}>
                        {r.status === "published" ? "Опубликован на сайте" : "Скрыт"}
                      </span>
                      {r.status === "hidden" && (
                        <button
                          onClick={() => moderate({ action: "restore", id: r.id })}
                          disabled={busyId === r.id}
                          className="text-xs text-white/50 hover:text-white disabled:opacity-50"
                        >
                          Вернуть в новые
                        </button>
                      )}
                    </div>
                  </ReviewCard>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-6">
        <h2 className="text-xl font-light">На сайте сейчас</h2>
        <p className="text-white/40 text-xs mt-1">Блок «Отзывы гостей» на главной. Новые публикации встают первыми.</p>
        <div className="mt-4 space-y-2">
          {testimonials.map((t, i) => (
            <div key={`${t.author}-${i}`} className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm">«{t.quote}»</div>
                <div className="text-white/40 text-xs mt-1">{t.author} · {t.role}</div>
              </div>
              <button onClick={() => removeTestimonial(i)} className="text-xs text-red-400/70 hover:text-red-400 shrink-0">Убрать</button>
            </div>
          ))}
        </div>
        <SaveButton onClick={onSaveTestimonials} saving={saving} />
      </div>
    </div>
  );
}

function ReviewCard({ review: r, busy, children }: { review: InboxReview; busy: boolean; children: React.ReactNode }) {
  const date = new Date(r.at);
  const when = Number.isNaN(date.getTime())
    ? r.at
    : date.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return (
    <div className={`bg-white/5 border rounded-xl p-4 ${r.canPublish && r.status === "new" ? "border-amber-400/40" : "border-white/10"} ${busy ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-amber-400 text-sm tracking-wider">{"★".repeat(r.rating)}<span className="text-white/20">{"★".repeat(5 - r.rating)}</span></div>
          <div className="text-sm mt-1">
            {r.name || <span className="text-white/40">Без имени</span>}
            {r.phone && <span className="text-white/40 ml-2 text-xs">{r.phone}</span>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-white/40 text-xs">{when}</div>
          {r.rating === 5 && (
            <div className={`text-xs mt-1 ${r.canPublish ? "text-green-400/80" : "text-white/40"}`}>
              {r.canPublish ? "Разрешил публикацию" : "Без публикации"}
            </div>
          )}
        </div>
      </div>
      {r.text ? (
        <p className="text-sm text-white/80 mt-3 whitespace-pre-wrap">{r.text}</p>
      ) : (
        <p className="text-sm text-white/30 mt-3">Без текста</p>
      )}
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-white/50 text-xs mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/40" />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-white/50 text-xs mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/40" />
    </div>
  );
}

function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button onClick={onClick} disabled={saving} className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-white/90 transition disabled:opacity-50 mt-4">
      {saving ? "Сохранение..." : "Сохранить изменения"}
    </button>
  );
}
