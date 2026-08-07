"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Vertical hanging tropical vine — grows with scroll.
 * Leaves hang DOWN along the stem (not sideways off-screen).
 */
export function VineGuide() {
  const [progress, setProgress] = useState(0);
  const [mx, setMx] = useState(0.5);
  const rafRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setProgress(p));
    };
    const onMove = (e: MouseEvent) => {
      setMx(e.clientX / window.innerWidth);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const sway = (mx - 0.5) * 6;
  const pathLen = 3600;
  const dash = pathLen * (0.05 + progress * 0.95);

  // Leaves: y position, slight side lean (-1|1), type, scale
  // Offset kept SMALL so leaves stay inside the vine column
  const leaves: { y: number; lean: number; type: "monstera" | "fern" | "broad" | "palm"; s: number }[] = [
    { y: 140, lean: -1, type: "fern", s: 0.85 },
    { y: 280, lean: 1, type: "monstera", s: 1 },
    { y: 420, lean: -1, type: "broad", s: 0.9 },
    { y: 560, lean: 1, type: "palm", s: 0.8 },
    { y: 700, lean: -1, type: "monstera", s: 0.95 },
    { y: 840, lean: 1, type: "fern", s: 0.88 },
    { y: 980, lean: -1, type: "broad", s: 1 },
    { y: 1120, lean: 1, type: "monstera", s: 0.9 },
    { y: 1260, lean: -1, type: "palm", s: 0.85 },
    { y: 1400, lean: 1, type: "fern", s: 0.92 },
    { y: 1540, lean: -1, type: "monstera", s: 1 },
    { y: 1680, lean: 1, type: "broad", s: 0.88 },
    { y: 1820, lean: -1, type: "fern", s: 0.9 },
    { y: 1960, lean: 1, type: "palm", s: 0.82 },
    { y: 2100, lean: -1, type: "monstera", s: 0.95 },
    { y: 2240, lean: 1, type: "broad", s: 0.9 },
    { y: 2380, lean: -1, type: "fern", s: 0.88 },
    { y: 2520, lean: 1, type: "monstera", s: 1 },
    { y: 2660, lean: -1, type: "palm", s: 0.85 },
    { y: 2800, lean: 1, type: "broad", s: 0.92 },
    { y: 2940, lean: -1, type: "fern", s: 0.9 },
    { y: 3080, lean: 1, type: "monstera", s: 0.95 },
    { y: 3220, lean: -1, type: "broad", s: 0.88 },
    { y: 3360, lean: 1, type: "palm", s: 0.8 },
  ];

  return (
    <div
      className="vine-guide"
      aria-hidden
      style={{ transform: `translateX(${sway}px)` }}
    >
      <svg viewBox="0 0 80 3600" preserveAspectRatio="xMidYMin meet" className="vine-layer">
        <defs>
          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3828" />
            <stop offset="30%" stopColor="#6b5238" />
            <stop offset="60%" stopColor="#3d6b4a" />
            <stop offset="100%" stopColor="#0d4a3c" />
          </linearGradient>
          <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2a9a78" />
            <stop offset="50%" stopColor="#1a7a5c" />
            <stop offset="100%" stopColor="#0a4a38" />
          </linearGradient>
          <linearGradient id="leafLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3db88a" />
            <stop offset="100%" stopColor="#1a6b4a" />
          </linearGradient>
        </defs>

        {/* Main stem — gentle S-curve, stays centered */}
        <path
          d="M40 0
             C 52 120, 28 240, 40 360
             C 55 480, 25 600, 40 720
             C 58 840, 22 960, 40 1080
             C 54 1200, 26 1320, 40 1440
             C 56 1560, 24 1680, 40 1800
             C 55 1920, 25 2040, 40 2160
             C 58 2280, 22 2400, 40 2520
             C 54 2640, 26 2760, 40 2880
             C 52 3000, 28 3120, 40 3240
             C 48 3360, 34 3480, 40 3600"
          fill="none"
          stroke="url(#stemGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${pathLen}`}
          style={{ transition: "stroke-dasharray 0.1s linear" }}
        />

        {/* Thin companion tendril */}
        <path
          d="M40 0
             C 30 140, 48 280, 36 420
             C 24 560, 50 700, 38 840
             C 26 980, 52 1120, 36 1260
             C 22 1400, 50 1540, 38 1680
             C 26 1820, 50 1960, 36 2100
             C 24 2240, 48 2380, 38 2520
             C 28 2660, 48 2800, 36 2940
             C 30 3080, 46 3220, 38 3360
             C 34 3480, 42 3540, 40 3600"
          fill="none"
          stroke="rgba(26,120,95,0.4)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray={`${dash * 0.92} ${pathLen}`}
          style={{ transition: "stroke-dasharray 0.1s linear" }}
        />

        {/* Hanging strands */}
        {[200, 500, 850, 1200, 1600, 2000, 2400, 2800, 3200].map((y, i) => {
          const vis = progress > (i + 0.5) / 12;
          const x = 40 + (i % 2 === 0 ? -6 : 6);
          return (
            <g key={y} opacity={vis ? 0.55 : 0} style={{ transition: "opacity 0.45s ease" }}>
              <path
                d={`M${x} ${y} Q ${x + (i % 2 === 0 ? -4 : 4)} ${y + 35} ${x} ${y + 70}`}
                fill="none"
                stroke="rgba(30,110,85,0.5)"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Leaves — hang along stem, slight lean, stay in column */}
        {leaves.map((leaf, i) => {
          const visible = progress > (i + 0.8) / (leaves.length + 2);
          // max ±12px from center — keeps leaves inside vine column
          const ox = 40 + leaf.lean * 10;
          const rot = leaf.lean * 12;

          return (
            <g
              key={`${leaf.y}-${i}`}
              opacity={visible ? 1 : 0}
              style={{ transition: "opacity 0.5s ease" }}
              transform={`translate(${ox}, ${leaf.y}) rotate(${rot}) scale(${leaf.s})`}
            >
              {leaf.type === "monstera" && (
                <>
                  <ellipse cx="0" cy="8" rx="11" ry="18" fill="url(#leafG)" />
                  <path d="M0 -8 Q 5 8 0 26" stroke="rgba(180,230,190,0.3)" strokeWidth="0.9" fill="none" />
                  <circle cx={leaf.lean * 3} cy="4" r="2" fill="rgba(6,5,5,0.35)" />
                  <circle cx={leaf.lean * -2} cy="12" r="1.5" fill="rgba(6,5,5,0.3)" />
                  {/* hanging tip */}
                  <path
                    d={`M0 26 Q ${leaf.lean * 3} 38 ${leaf.lean * 1} 48`}
                    stroke="rgba(26,120,95,0.45)"
                    strokeWidth="1"
                    fill="none"
                  />
                </>
              )}
              {leaf.type === "fern" && (
                <>
                  <path d="M0 -4 L0 22" stroke="rgba(30,110,85,0.65)" strokeWidth="1.2" fill="none" />
                  {[-2, 4, 10, 16].map((py, j) => (
                    <path
                      key={j}
                      d={`M0 ${py} Q ${leaf.lean * (8 + j)} ${py + 1} ${leaf.lean * (11 + j * 0.5)} ${py + 3}`}
                      stroke="url(#leafLight)"
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinecap="round"
                    />
                  ))}
                </>
              )}
              {leaf.type === "palm" && (
                <>
                  {[-30, -15, 0, 15, 30].map((ang, j) => {
                    const rad = (ang * Math.PI) / 180;
                    const len = 16 + (j % 2) * 3;
                    return (
                      <path
                        key={j}
                        d={`M0 0 Q ${Math.sin(rad) * len * 0.45} ${8 + Math.abs(Math.cos(rad)) * 4} ${Math.sin(rad) * len} ${14 + Math.abs(Math.cos(rad)) * 6}`}
                        stroke="url(#leafLight)"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                        opacity={0.8}
                      />
                    );
                  })}
                </>
              )}
              {leaf.type === "broad" && (
                <>
                  <ellipse cx="0" cy="6" rx="9" ry="16" fill="url(#leafG)" opacity="0.95" />
                  <path d="M0 -8 Q 3 6 0 22" stroke="rgba(200,240,200,0.25)" strokeWidth="0.8" fill="none" />
                  <path
                    d={`M0 22 Q ${leaf.lean * 2} 32 ${leaf.lean * 1} 40`}
                    stroke="rgba(26,120,95,0.4)"
                    strokeWidth="0.9"
                    fill="none"
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
