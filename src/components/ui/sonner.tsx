"use client";

import { Toaster as Sonner } from "sonner";

/**
 * Тост-уведомления в фирменной тёмно-золотой стилистике.
 */
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        style: {
          background: "rgba(14,12,10,0.96)",
          border: "1px solid rgba(176,139,90,0.35)",
          color: "#f2f2f2",
          borderRadius: "0px",
          fontFamily: "var(--font-montserrat)",
          fontSize: "14px",
        },
      }}
    />
  );
}
