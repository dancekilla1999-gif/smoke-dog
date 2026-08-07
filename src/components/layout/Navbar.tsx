"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { nav, site } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/shared/MagneticButton";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Шапка: всегда прозрачная. При скролле — только лёгкий blur, без тёмной плашки. */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-all duration-500",
          // всегда прозрачная — текст страницы читается под шапкой
          "bg-transparent border-none shadow-none",
          scrolled && !open ? "backdrop-blur-[2px]" : ""
        )}
      >
        <div className="container-wide relative flex h-16 items-center justify-between sm:h-20 lg:h-24">
          {/* Логотип — всегда чёткий, поверх всего */}
          <Link
            href="/"
            aria-label={`${site.name} — на главную`}
            className="absolute left-1/2 top-1/2 z-[70] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/logo.png"
              placeholder="empty"
              alt={site.name}
              width={220}
              height={64}
              priority
              className="h-9 w-auto bg-transparent sm:h-11 lg:h-12"
              style={{ background: "transparent" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center gap-7 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative text-[12px] uppercase tracking-wide2 transition-colors duration-300",
                    active ? "text-gold" : "text-bone/80 hover:text-bone drop-shadow-sm"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <a
              href={`tel:${site.phoneHref}`}
              className="flex items-center gap-2 text-[12px] tracking-wide2 text-bone/80 transition-colors duration-300 hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
              {site.phone}
            </a>
            <Magnetic strength={0.35}>
              <Button asChild size="sm" data-cursor>
                <Link href="/contacts#reserve">Забронировать</Link>
              </Button>
            </Magnetic>
          </div>

          {/* Mobile burger / close */}
          <button
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-[70] flex h-11 w-11 items-center justify-center text-bone transition-colors hover:text-gold lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </header>

      {/* Мобильное меню — сплошная плашка, контент под ней в blur */}
      <AnimatePresence>
        {open && (
          <>
            {/* Blur layer поверх страницы */}
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[55] bg-noir/40 backdrop-blur-xl lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            {/* Сама плашка меню — непрозрачная */}
            <motion.div
              key="menu-panel"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[56] flex flex-col bg-noir lg:hidden"
            >
              {/* отступ под лого + кнопку закрытия */}
              <div className="h-16 sm:h-20 shrink-0" />

              <nav className="container-wide flex flex-1 flex-col justify-center gap-1 pb-10">
                {nav.map((item, i) => {
                  const active = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.05 * i + 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block py-3.5 font-serif text-[1.75rem] transition-colors",
                          active ? "text-gold" : "text-bone hover:text-gold"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-10 flex flex-col gap-5 border-t border-white/[0.08] pt-8"
                >
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="flex items-center gap-2.5 text-sm tracking-wide2 text-bone/80"
                  >
                    <Phone className="h-4 w-4 text-gold" strokeWidth={1.5} />
                    {site.phone}
                  </a>
                  <Button asChild size="lg" className="w-full">
                    <Link
                      href="/contacts#reserve"
                      onClick={() => setOpen(false)}
                    >
                      Забронировать столик
                    </Link>
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
