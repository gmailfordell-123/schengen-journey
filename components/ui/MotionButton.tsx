"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

type Variant = "primary" | "secondary" | "gold";

const variantClass: Record<Variant, string> = {
  primary:   "btn btn-navy",
  secondary: "btn btn-outline-navy",
  gold:      "btn btn-gold",
};

export function MotionButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <MotionLink
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`${variantClass[variant]} ${className}`}
    >
      {children}
    </MotionLink>
  );
}
