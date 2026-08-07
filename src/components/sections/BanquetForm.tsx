"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Loader2, Phone } from "lucide-react";
import { site } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Magnetic } from "@/components/shared/MagneticButton";
import { reachGoal } from "@/components/providers/YandexMetrika";

const guestOptions = [
  "10–15",
  "15–20",
  "20–30",
  "30–40",
  "40–50",
  "50+",
];

const eventTypes = [
  "День рождения",
  "Корпоратив",
  "Свадьба / помолвка",
  "Выпускной",
  "Частная вечеринка",
  "Другое",
];

const timeOptions = [
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const todayISO = () => new Date().toISOString().split("T")[0];

const fieldClass =
  "mt-2 w-full appearance-none border-0 border-b border-white/15 bg-transparent px-1 py-2 text-[15px] text-bone transition-colors focus:border-gold focus:outline-none [color-scheme:dark]";

function formatPhoneRu(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return raw.startsWith("+") && raw.length === 1 ? "+" : "";
  if (digits[0] === "8") digits = "7" + digits.slice(1);
  if (digits[0] === "9") digits = "7" + digits;
  if (digits[0] !== "7") digits = "7" + digits.replace(/^7/, "");
  digits = digits.slice(0, 11);
  let out = "+7";
  if (digits.length > 1) out += " (" + digits.slice(1, 4);
  if (digits.length >= 4) out += ")";
  if (digits.length > 4) out += " " + digits.slice(4, 7);
  if (digits.length > 7) out += "-" + digits.slice(7, 9);
  if (digits.length > 9) out += "-" + digits.slice(9, 11);
  return out;
}

export function BanquetForm() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const onPhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneRu(e.target.value));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      guests: String(fd.get("guests") ?? ""),
      date: String(fd.get("date") ?? ""),
      time: String(fd.get("time") ?? ""),
      eventType: String(fd.get("eventType") ?? ""),
      budget: String(fd.get("budget") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/banquet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Не удалось отправить заявку");
        return;
      }
      reachGoal("banquet");
      toast.success(data.message || "Заявка на банкет принята");
      (e.target as HTMLFormElement).reset();
      setPhone("");
    } catch {
      toast.error("Ошибка сети. Попробуйте ещё раз или позвоните нам.", {
        description: `Позвоните: +7 917 542-10-00`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="banquet-form" className="relative border-t border-white/[0.07] py-20 sm:py-24 lg:py-32">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Банкеты"
          title="Организуем ваш праздник"
          intro="Дни рождения, корпоративы, свадьбы и частные вечеринки. Приватные зоны, персональное меню и полное сопровождение."
          className="mb-12 lg:mb-16"
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="space-y-6 text-bone/75">
              <p className="text-[15px] leading-relaxed">
                Оставьте заявку — менеджер перезвонит, уточнит формат, количество
                гостей и предложит зону и меню под ваш бюджет.
              </p>
              <div className="space-y-3 border-t border-white/10 pt-6">
                <p className="text-[11px] uppercase tracking-eyebrow text-gold-soft">
                  Или сразу позвоните
                </p>
                <a
                  href="tel:+79175421000"
                  className="inline-flex items-center gap-2 text-lg text-bone transition-colors hover:text-gold"
                >
                  <Phone className="h-4 w-4 text-gold" />
                  +7 917 542-10-00
                </a>
              </div>
              <ul className="space-y-2 border-t border-white/10 pt-6 text-sm text-bone/60">
                <li>· От 10 гостей</li>
                <li>· Приватные зоны и основной зал</li>
                <li>· Индивидуальное меню и бар</li>
                <li>· Декор, музыка, ведущий — по запросу</li>
              </ul>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={0.1}>
            <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <Label htmlFor="b-name">Имя *</Label>
                <Input
                  id="b-name"
                  name="name"
                  required
                  placeholder="Как к вам обращаться"
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="b-phone">Телефон *</Label>
                <Input
                  id="b-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={onPhoneChange}
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="b-email">Email</Label>
                <Input
                  id="b-email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="b-guests">Гостей *</Label>
                <select id="b-guests" name="guests" required className={fieldClass} defaultValue="">
                  <option value="" disabled>
                    Выберите
                  </option>
                  {guestOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="b-date">Дата *</Label>
                <Input
                  id="b-date"
                  name="date"
                  type="date"
                  required
                  min={todayISO()}
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="b-time">Время</Label>
                <select id="b-time" name="time" className={fieldClass} defaultValue="">
                  <option value="">По договорённости</option>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="b-type">Формат события</Label>
                <select id="b-type" name="eventType" className={fieldClass} defaultValue="">
                  <option value="">Не указан</option>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="b-budget">Бюджет (примерно)</Label>
                <Input
                  id="b-budget"
                  name="budget"
                  placeholder="Например: 150–200 тыс ₽"
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="b-message">Пожелания</Label>
                <Textarea
                  id="b-message"
                  name="message"
                  rows={4}
                  placeholder="Декор, меню, особые пожелания…"
                  className={`${fieldClass} resize-none`}
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <Magnetic>
                  <Button type="submit" size="lg" variant="gold" disabled={loading} className="w-full sm:w-auto">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Отправляем…
                      </>
                    ) : (
                      "Отправить заявку на банкет"
                    )}
                  </Button>
                </Magnetic>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
