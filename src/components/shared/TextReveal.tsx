"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  once?: boolean;
}

/**
 * Пословное появление заголовка — «дорогой» кинематографичный reveal.
 */
export function TextReveal({
  text,
  className,
  as = "h2",
  delay = 0,
  once = true,
}: TextRevealProps) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: delay },
    },
  };

  const word: Variants = {
    hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: "0em",
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // Каст нужен, т.к. динамический индекс по motion даёт union-тип компонентов.
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span variants={word} className="inline-block will-change-transform">
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
