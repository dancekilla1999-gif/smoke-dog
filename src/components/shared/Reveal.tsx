"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  blur?: boolean;
  once?: boolean;
  amount?: number;
}

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Универсальное появление секции/блока: fade + slide (+ опциональный blur).
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  blur = false,
  once = true,
  amount = 0.25,
}: RevealProps) {
  const { x, y } = offset[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x,
      y,
      filter: blur ? "blur(8px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

/** Каскадное появление списков: контейнер */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

/** Каскадное появление списков: элемент */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
