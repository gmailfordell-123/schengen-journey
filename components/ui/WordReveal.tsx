"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const wordVariant = {
  hidden: { opacity: 0, y: 22, filter: "blur(5px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.06,
      duration: 0.52,
      ease: EASE,
    },
  }),
};

/**
 * Animates a string word-by-word with stagger + blur-fade.
 * Use initialDelay (seconds) to offset the whole sequence.
 */
export function WordReveal({
  text,
  className = "",
  initialDelay = 0,
}: {
  text: string;
  className?: string;
  initialDelay?: number;
}) {
  const words = text.split(" ");
  const offset = initialDelay / 0.06;

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      aria-label={text}
      className={`inline ${className}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i + offset}
          variants={wordVariant}
          className="inline-block"
          style={{ marginRight: "0.3em" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
