"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Premium full-page background shell for app-like pages (booking, dashboard,
 * auth, contact). Provides:
 *   - a deep-navy gradient background
 *   - a subtle grid overlay + radial glow layers (behind content, z-0)
 *   - minimum full-screen height
 *   - a smooth Framer Motion page-entry animation (respects reduced motion)
 *
 * White is intentionally reserved for the cards/forms placed *inside* this
 * shell — never for the page background itself.
 */
export function PremiumPageShell({
  children,
  className = "",
  contentClassName = "",
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`premium-bg relative min-h-screen overflow-hidden ${className}`}>
      {/* Grid overlay — decorative, never intercepts pointer events */}
      <div aria-hidden className="premium-grid" />

      {/* Soft radial glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-0"
        style={{
          top: "-160px",
          right: "-120px",
          width: "560px",
          height: "560px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(41,82,179,0.22) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute z-0"
        style={{
          bottom: "-180px",
          left: "-140px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Content layer */}
      <motion.div
        className={`relative z-10 ${contentClassName}`}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
