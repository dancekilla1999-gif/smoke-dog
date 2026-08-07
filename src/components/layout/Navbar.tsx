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
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-all duration-500",
          scrolled && !open
            ? "border-b border-white/[0.06] bg-[#0B0B0D]/70 backdrop-blur-xl shadow-glass"
            : "bg-transparent border-none shadow-none"
        )}
      >
        <div className="container-wide relative flex h-16 items-center justify-between sm:h-20 lg:h-[5.5rem]">
          {/* Logo — left, large, no padding/boxes */}
          <Link
            href="/"
            aria-label={`${site.name} — на главную`}
            className="relative z-[70] flex shrink-0 items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/logo.png"
              alt={site.name}
              width={200}
              height={48}
              priority
              className="h-9 w-auto object-contain object-left sm:h-10 lg:h-11"
              style={{ padding: 0, margin: 0, background: "transparent" }}
            />
