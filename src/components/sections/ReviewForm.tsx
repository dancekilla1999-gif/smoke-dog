"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Loader2, Star, CheckCircle2, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Magnetic } from "@/components/shared/MagneticButton";
import { ConsentCheckbox } from "@/components/shared/ConsentCheckbox";
import { cn } from "@/lib/utils";
import { yandexReviewUrl } from "@/lib/data";
import { reachGoal } from "@/components/providers/YandexMetrika";

const fieldClass =
  "mt-2 w-full appearance-none border-0 border-b border-white/15 bg-transparent px-1 py-2 text-[16px] text-bone transition-colors focus:border-gold focus:outline-none [color-scheme:dark]";

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

export function ReviewForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [canPublish, setCanPublish] = useState<boolean | null>(null);
  const [phone, setPhone] = useState("");

  const onPhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneRu(e.target.value));
  };

  const isFive = rating === 5;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Поставьте оценку от 1 до 5 звёзд.");
      return;
    }
    if (isFive && canPublish === null) {
      toast.error("Ответьте, можно ли опубликовать ваш отзыв на сайте.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const payload = {
      rating,
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      text: String(fd.get("text") ?? ""),
      canPublish: isFive ? Boolean(canPublish) : false,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Не удалось отправить отзыв");
        return;
      }
      setSent(true);
      if (isFive) reachGoal("review_five_stars");
    } catch {
      toast.error("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <section className="relative py-24 sm:py-28">
        <div className="container-wide">
          <Reveal className="mx-auto max-w-lg text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-gold" strokeWidth={1.2} />
            <h2 className="mt-6 font-serif text-3xl text-bone">Спасибо за отзыв!</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ash">
              Мы обязательно его прочитаем. Ждём вас снова в Смоук Дог.
            </p>

            {isFive && (
              <Reveal delay={0.15} className="mt-10 border-t border-white/[0.07] pt-8">
                <p className="text-[16px] text-bone">
                  Вы поставили нам высшую оценку — было бы здорово, если вы продублируете
                  этот же отзыв на Яндекс Картах. Это займёт минуту и очень нам поможет.
                </p>
                <Magnetic className="mt-5 inline-flex">
                  <Button
                    asChild
                    size="lg"
                    variant="gold"
                    onClick={() => reachGoal("review_yandex_redirect")}
                  >
                    <a href={yandexReviewUrl} target="_blank" rel="noopener noreferrer">
                      Оставить отзыв на Яндекс Картах
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </Magnetic>
              </Reveal>
            )}
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <Reveal className="mx-auto max-w-xl">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="text-center">
              <p className="eyebrow text-gold">Ваша оценка</p>
              <div
                className="mt-4 flex items-center justify-center gap-2"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = n <= (hoverRating || rating);
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} из 5`}
                      onMouseEnter={() => setHoverRating(n)}
                      onClick={() => {
                        setRating(n);
                        if (n !== 5) setCanPublish(null);
                      }}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-9 w-9 transition-colors",
                          active ? "fill-gold text-gold" : "fill-transparent text-ash"
                        )}
                        strokeWidth={1.3}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {isFive && (
              <Reveal className="rounded-sm border border-gold/30 bg-gold/[0.06] p-5 text-center">
                <p className="text-[16px] text-bone">
                  Спасибо! Можно ли опубликовать ваш отзыв на сайте?
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCanPublish(true)}
                    className={cn(
                      "h-10 min-w-[6.5rem] rounded-full border text-[13px] uppercase tracking-wide2 transition-colors",
                      canPublish === true
                        ? "border-gold bg-gold text-noir"
                        : "border-white/15 text-bone hover:border-gold hover:text-gold"
                    )}
                  >
                    Да, можно
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanPublish(false)}
                    className={cn(
                      "h-10 min-w-[6.5rem] rounded-full border text-[13px] uppercase tracking-wide2 transition-colors",
                      canPublish === false
                        ? "border-bone/60 bg-bone/10 text-bone"
                        : "border-white/15 text-bone hover:border-bone/60"
                    )}
                  >
                    Не публиковать
                  </button>
                </div>
              </Reveal>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="r-name">Имя</Label>
                <Input id="r-name" name="name" placeholder="Как к вам обращаться" className={fieldClass} />
              </div>
              <div>
                <Label htmlFor="r-phone">Телефон</Label>
                <Input
                  id="r-phone"
                  name="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={onPhoneChange}
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="r-text">Отзыв</Label>
                <Textarea
                  id="r-text"
                  name="text"
                  rows={4}
                  placeholder="Что понравилось, а что можно улучшить?"
                  className={`${fieldClass} resize-none`}
                />
              </div>
            </div>

            <ConsentCheckbox name="consent" />

            <Magnetic>
              <Button type="submit" size="lg" variant="gold" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Отправляем…
                  </>
                ) : (
                  "Отправить отзыв"
                )}
              </Button>
            </Magnetic>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
