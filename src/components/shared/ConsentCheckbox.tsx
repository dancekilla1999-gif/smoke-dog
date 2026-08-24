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
        Я даю согласие на{" "}
        <Link
          href="/privacy"
          target="_blank"
          className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-gold"
        >
          обработку персональных данных
        </Link>{" "}
        в соответствии с политикой конфиденциальности
      </span>
    </label>
  );
}
