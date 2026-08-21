"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-consent-ack";

/**
 * Уведомление о cookie при первом посещении (152-ФЗ).
 * Показывается, пока пользователь не нажмёт «Принять» — согласие
 * запоминается в localStorage, чтобы баннер не показывался повторно.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage недоступен (приватный режим и т.п.) — просто не показываем повторно в рамках сессии
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Уведомление об использовании cookie"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-white/10 bg-noir/97 px-5 py-5 backdrop-blur-md sm:px-8"
    >
      <div className="container-wide flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="max-w-2xl text-center text-xs leading-relaxed text-bone/70 sm:text-left">
          Мы используем файлы cookie для корректной работы сайта и аналитики
          посещаемости. Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
          <Link
            href="/privacy"
            className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-gold"
          >
            политикой в отношении файлов cookie
          </Link>
          .
        </p>
        <Button
          type="button"
          variant="gold"
          size="sm"
          onClick={accept}
          className="shrink-0"
        >
          Принять
        </Button>
      </div>
    </div>
  );
}
