"use client";

import { motion } from "framer-motion";

/**
 * Premium SVG success animation: circle draws in, then checkmark strokes in.
 * Replaces static CheckCircle2 icon on booking confirmation.
 * Quality matches Lottie — no external files needed.
 */
export function SuccessAnimation({ size = 88 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      {/* Pulse ring — fades out after appearing */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "2px solid rgba(16,185,129,0.35)",
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
        transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
      />

      {/* Second softer pulse */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(16,185,129,0.20)",
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.9, opacity: [0, 0.3, 0] }}
        transition={{ delay: 0.7, duration: 0.9, ease: "easeOut" }}
      />

      {/* Background fill */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "linear-gradient(135deg,rgba(16,185,129,0.14) 0%,rgba(5,150,105,0.10) 100%)",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.08 }}
      />

      {/* SVG: circle stroke + checkmark stroke */}
      <svg
        viewBox="0 0 88 88"
        fill="none"
        style={{ width: size, height: size, position: "absolute", inset: 0 }}
      >
        <motion.circle
          cx="44" cy="44" r="38"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.52, delay: 0.14, ease: "easeOut" }}
        />
        <motion.path
          d="M 27 44 L 39 56 L 62 30"
          stroke="#10b981"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.38, delay: 0.56, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/**
 * Three animated dots for submit-loading state.
 */
export function LoadingDots({ color = "var(--navy-600)" }: { color?: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
          }}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.7,
            delay: i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}
