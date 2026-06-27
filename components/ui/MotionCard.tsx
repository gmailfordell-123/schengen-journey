"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Shared entrance + hover animation variants used on every card. */
export const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.5,
      ease: EASE,
    },
  }),
};

export const hoverVariants = {
  rest: {
    y: 0,
    boxShadow: "0 1px 3px rgba(8,20,40,0.06), 0 4px 12px -4px rgba(8,20,40,0.08)",
    borderColor: "rgba(0,0,0,0.08)",
  },
  hover: {
    y: -6,
    boxShadow: "0 8px 32px -6px rgba(8,20,40,0.18), 0 2px 8px rgba(8,20,40,0.08)",
    borderColor: "rgba(34,111,84,0.30)",
  },
};

export function MotionCard({
  children,
  className = "",
  index = 0,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  dark?: boolean;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      whileHover="hover"
      animate="rest"
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`relative overflow-hidden rounded-2xl p-7 ${dark ? "glass-dark" : "card"} ${className}`}
      style={!dark ? {
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 1px 3px rgba(8,20,40,0.06), 0 4px 12px -4px rgba(8,20,40,0.08)",
      } : undefined}
    >
      {/* Subtle border glow on hover — only visible when card is hovered */}
      <motion.div
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow: dark
            ? "inset 0 0 0 1px rgba(34,111,84,0.35)"
            : "inset 0 0 0 1.5px rgba(34,111,84,0.20)",
        }}
      />
      {children}
    </motion.div>
  );
}
