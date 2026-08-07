"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarHeart } from "lucide-react";

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
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-5 z-[60] sm:bottom-8 sm:right-8"
        >
          <Link
            href="/contacts#reserve"
            className="btn-smoke-fill group flex h-14 items-center gap-2.5 px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-noir transition-transform active:scale-[0.97]"
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
