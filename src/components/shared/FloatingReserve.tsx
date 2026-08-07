"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarHeart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Плавающая кнопка «Забронировать», которая следует за пользователем
 * по всему сайту. Скрывается на странице контактов (там уже форма).
 */
export function FloatingReserve() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const hideOnPage = pathname === "/contacts";

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hideOnPage) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-5 z-[60] sm:bottom-8 sm:right-8"
        >
          <Link
            href="/contacts#reserve"
            className={cn(
              "group flex items-center gap-2.5 rounded-full bg-gold px-5 py-3.5",
              "text-[13px] font-medium uppercase tracking-wide2 text-noir",
              "shadow-[0_8px_32px_rgba(201,169,98,0.35)]",
              "transition-all duration-300 hover:bg-gold/90 hover:shadow-[0_12px_40px_rgba(201,169,98,0.45)]",
              "active:scale-[0.97]"
            )}
            data-cursor
          >
            <CalendarHeart className="h-4 w-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Забронировать</span>
            <span className="sm:hidden">Бронь</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
