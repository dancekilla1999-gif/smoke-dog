"use client";

import Image from "next/image";
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

const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

const timeOptions = [
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
  "00:00",
];

const todayISO = () => new Date().toISOString().split("T")[0];

const fieldClass =
  "mt-2 w-full appearance-none border-0 border-b border-white/15 bg-transparent px-1 py-2 text-[15px] text-bone transition-colors focus:border-gold focus:outline-none [color-scheme:dark]";

/** Российский телефон: 8… → +7…, 7… → +7…, маска +7 (xxx) xxx-xx-xx */
function formatPhoneRu(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return raw.startsWith("+") && raw.length === 1 ? "+" : "";

  // 8xxxxxxxxxx → 7xxxxxxxxxx
  if (digits[0] === "8") digits = "7" + digits.slice(1);
  // если начали с 9... (без кода) — считаем РФ
  if (digits[0] === "9") digits = "7" + digits;
  // любая другая первая цифра кроме 7 — если одна 7 уже ок
  if (digits[0] !== "7") {
    // оставляем как набрали, но с + если хотели международный — для РФ форсируем 7
    digits = "7" + digits.replace(/^7/, "");
  }

  digits = digits.slice(0, 11); // 7 + 10 цифр

  let out = "+7";
  const rest = digits.slice(1);
  if (rest.length > 0) out += " (" + rest.slice(0, 3);
  if (rest.length >= 3) out += ")";
  if (rest.length > 3) out += " " + rest.slice(3, 6);
  if (rest.length > 6) out += "-" + rest.slice(6, 8);
  if (rest.length > 8) out += "-" + rest.slice(8, 10);
  return out;
}

export function Reservation() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  function onPhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhoneRu(e.target.value));
  }


  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      guests: String(fd.get("guests") ?? ""),
      date: String(fd.get("date") ?? ""),
      time: String(fd.get("time") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        toast.error("Не удалось отправить заявку", {
          description: data?.error ?? "Попробуйте ещё раз или позвоните нам.",
        });
        return;
      }

      reachGoal("reservation");
      toast.success("Заявка принята", {
        description: `${payload.name}, ждём вас ${payload.date} в ${payload.time}. Менеджер перезвонит для подтверждения.`,
        duration: 7000,
      });
      form.reset();
      setPhone("");
    } catch {
      toast.error("Ошибка сети", {
        description: `Позвоните нам: ${site.phone}`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="reserve"
      className="relative isolate overflow-hidden border-t border-white/[0.07] py-20 sm:py-24 lg:py-36"
    >
      <Image
        src="/images/lounge.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-25"
      />
      <div className="absolute inset-0 -z-10 bg-noir/80" />

      <div className="container-wide">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Бронирование"
              title="Забронируйте свой вечер"
              intro="Оставьте заявку — менеджер свяжется с вами, подтвердит бронь и подберёт зону под ваше настроение."
            />

            <Reveal delay={0.15}>
              <div className="mt-12 space-y-7 border-t border-white/[0.07] pt-8">
                <div>
                  <p className="eyebrow">Телефон</p>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="mt-3 flex items-center gap-3 font-serif text-2xl text-bone transition-colors hover:text-gold sm:text-3xl"
                  >
                    <Phone className="h-5 w-5 text-gold" strokeWidth={1.4} />
                    {site.phone}
                  </a>
                </div>

                <div>
                  <p className="eyebrow">Часы работы</p>
                  <ul className="mt-3 space-y-1.5 text-sm text-ash">
                    {site.hours.map((h) => (
                      <li key={h.day}>
                        <span className="text-bone/75">{h.day}</span> — {h.time}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="eyebrow">Адрес</p>
                  <p className="mt-3 text-sm leading-relaxed text-ash">
                    {site.address.city}, {site.address.street}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="glass rounded-sm p-7 sm:p-10 lg:p-12">
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder="Как к вам обращаться"
                  />
                </div>

                <div className="sm:col-span-1">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={onPhoneChange}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Для подтверждения брони"
                  />
                </div>

                <div>
                  <Label htmlFor="guests">Гостей</Label>
                  <select
                    id="guests"
                    name="guests"
                    defaultValue="2"
                    className={fieldClass}
                  >
                    {guestOptions.map((g) => (
                      <option key={g} value={g} className="bg-graphite text-bone">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="date">Дата *</Label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    min={todayISO()}
                    defaultValue={todayISO()}
                    className={fieldClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="time">Время *</Label>
                  <select
                    id="time"
                    name="time"
                    required
                    defaultValue="20:00"
                    className={fieldClass}
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t} className="bg-graphite text-bone">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="message">Комментарий</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Повод, пожелания по зоне, особенности питания"
                  />
                </div>
              </div>

              <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-xs leading-relaxed text-ash/80">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных
                  данных.
                </p>

                <Magnetic strength={0.3}>
                  <Button
                    type="submit"
                    size="lg"
                    variant="gold"
                    disabled={loading}
                    data-cursor
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Отправляем
                      </>
                    ) : (
                      "Забронировать столик"
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
