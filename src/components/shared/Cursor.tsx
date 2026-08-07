"use client";

import { useEffect, useRef } from "react";

/**
 * Кастомный курсор SOUL — золотое кольцо + точка + свечение.
 * Только desktop. System-курсор скрывается только после готовности кастомного.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const glow = glowRef.current;
    const wrap = wrapRef.current;
    if (!ring || !dot || !glow || !wrap) return;

    // Показываем кастомный курсор и только потом прячем системный
    wrap.style.display = "block";
    document.documentElement.classList.add("cursor-none-desktop");

    let mx = -100;
    let my = -100;
    let rx = mx;
    let ry = my;
    let frame = 0;
    let visible = false;

    const show = () => {
      if (visible) return;
      visible = true;
      ring.style.opacity = "1";
      dot.style.opacity = "1";
      glow.style.opacity = "1";
    };

    const hide = () => {
      visible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
      glow.style.opacity = "0";
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      show();
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      glow.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };

    const isInteractive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      return !!el.closest(
        "a, button, [data-cursor], input, textarea, label, select, [role='button']"
      );
    };

    const onOver = (e: MouseEvent) => {
      const active = isInteractive(e.target);
      ring.dataset.active = active ? "true" : "false";
      glow.dataset.active = active ? "true" : "false";
    };

    const onLeave = () => hide();

    const loop = () => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ display: "none" }} aria-hidden>
      {/* Свечение */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-28 w-28 rounded-full opacity-0 transition-opacity duration-200"
        style={{
          background:
            "radial-gradient(circle, rgba(214,183,137,0.22) 0%, rgba(176,139,90,0.06) 45%, transparent 70%)",
          willChange: "transform",
          mixBlendMode: "screen",
        }}
      />

      {/* Кольцо */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border-2 border-[#d6b789]/70 opacity-0 transition-[width,height,border-color,background-color,opacity] duration-200 data-[active=true]:h-14 data-[active=true]:w-14 data-[active=true]:border-[#e8d5b0] data-[active=true]:bg-[rgba(176,139,90,0.15)]"
        style={{ willChange: "transform" }}
      />

      {/* Точка */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-[#e8d5b0] opacity-0"
        style={{
          willChange: "transform",
          boxShadow: "0 0 10px rgba(232,213,176,0.8), 0 0 4px rgba(176,139,90,0.9)",
        }}
      />
    </div>
  );
}
