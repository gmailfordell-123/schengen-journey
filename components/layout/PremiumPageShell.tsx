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
            "radial-gradient(circle, rgba(34,111,84,0.22) 0%, transparent 70%)",
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
            "radial-gradient(circle, rgba(34,111,84,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Content layer */}
      <div className={`relative z-10 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
