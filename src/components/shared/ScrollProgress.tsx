"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Тонкая золотая полоса прогресса чтения вверху страницы.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[65] h-[2px] origin-left bg-gold-line"
    />
  );
}
