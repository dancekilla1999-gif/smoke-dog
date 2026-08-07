"use client";

import { useEffect, useRef } from "react";

/** Mist + spores + cursor emerald glow for atmospheric sections */
export function JungleAmbience({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${e.clientX - r.left}px`);
      el.style.setProperty("--gy", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const spores = Array.from({ length: 12 }, (_, i) => ({
    left: `${8 + (i * 7.5) % 90}%`,
    delay: `${i * 1.1}s`,
    duration: `${14 + (i % 5) * 3}s`,
    size: 2 + (i % 3),
  }));

  return (
    <div ref={ref} className={`jungle-mist cursor-glow-zone ${className}`}>
      <div className="spores absolute inset-0 overflow-hidden">
        {spores.map((s, i) => (
          <span
            key={i}
            style={{
              left: s.left,
              animationDelay: s.delay,
              animationDuration: s.duration,
              width: s.size,
              height: s.size,
            }}
          />
        ))}
      </div>
    </div>
  );
}
