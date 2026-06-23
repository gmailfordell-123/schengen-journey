"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function MotionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`card p-7 transition-shadow duration-300 hover:shadow-[var(--shadow-md)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
