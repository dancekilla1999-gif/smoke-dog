"use client";

import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface ConsentCheckboxProps {
  name?: string;
  className?: string;
}

/**
 * Обязательный чекбокс согласия на обработку персональных данных (152-ФЗ).
 * Не отмечен по умолчанию — пользователь ставит галочку сам; без неё
 * форма не отправится (required + нативная валидация браузера).
 */
export function ConsentCheckbox({ name = "consent", className }: ConsentCheckboxProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-ash",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        required
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-[2px] border border-white/25 bg-transparent transition-colors checked:border-gold checked:bg-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 focus-visible:ring-offset-1 focus-visible:ring-offset-noir"
      />
      <span>
        Я даю{" "}
        <Link
          href="/consent"
          target="_blank"
          className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-gold"
        >
          согласие на обработку персональных данных
        </Link>{" "}
        на условиях{" "}
        <Link
          href="/privacy"
          target="_blank"
          className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-gold"
        >
          политики обработки персональных данных
        </Link>
      </span>
    </label>
  );
}

/**
 * Необязательный чекбокс согласия на рекламную рассылку (ст. 18 38-ФЗ «О рекламе»).
 * Отдельно от согласия на обработку ПДн, не отмечен по умолчанию, форма
 * отправляется и без него; значение уходит в заявку как marketing: true/false.
 */
export function MarketingConsentCheckbox({
  name = "marketing",
  className,
}: ConsentCheckboxProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-ash",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-[2px] border border-white/25 bg-transparent transition-colors checked:border-gold checked:bg-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 focus-visible:ring-offset-1 focus-visible:ring-offset-noir"
      />
      <span>
        Хочу получать новости и предложения заведения — даю{" "}
        <Link
          href="/marketing-consent"
          target="_blank"
          className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-gold"
        >
          согласие на рекламную рассылку
        </Link>{" "}
        (необязательно)
      </span>
    </label>
  );
}
