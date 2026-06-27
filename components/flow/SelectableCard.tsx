"use client";

import type { ReactNode } from "react";
import { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Check } from "lucide-react";

export function SelectableCard({
  selected = false,
  onClick,
  icon,
  title,
  subtitle,
  className = "",
}: {
  selected?: boolean;
  onClick: () => void;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  /* Physics tilt */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 26 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 26 });
  const scaleS  = useSpring(1, { stiffness: 280, damping: 26 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top)  / r.height - 0.5);
    scaleS.set(1.025);
  }, [rawX, rawY, scaleS]);

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    scaleS.set(1);
  }, [rawX, rawY, scaleS]);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.97 }}
      aria-pressed={selected}
      style={{
        rotateX,
        rotateY,
        scale: scaleS,
        transformStyle: "preserve-3d",
        background: selected
          ? "linear-gradient(180deg, rgba(34,111,84,0.14) 0%, rgba(10,40,26,0.12) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.82) 100%)",
        backdropFilter: "blur(14px) saturate(1.4)",
        WebkitBackdropFilter: "blur(14px) saturate(1.4)",
        border: selected
          ? "2px solid rgba(34,111,84,0.55)"
          : "1.5px solid rgba(255,255,255,0.78)",
        boxShadow: selected
          ? "0 0 0 3px rgba(34,111,84,0.14), 0 8px 28px rgba(4,12,26,0.28), inset 0 1px 0 rgba(255,255,255,0.20)"
          : "0 4px 20px rgba(4,12,26,0.22), inset 0 1px 0 rgba(255,255,255,0.95)",
      }}
      className={`group relative flex w-full items-center gap-4 rounded-2xl p-5 text-left ${className}`}
    >
      {/* Animated border overlay on select */}
      <AnimatePresence>
        {selected && (
          <motion.span
            key="border"
            className="pointer-events-none absolute inset-0 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              border: "2px solid var(--navy-600)",
              boxShadow: "inset 0 0 0 1px rgba(34,111,84,0.08)",
            }}
          />
        )}
      </AnimatePresence>

      {icon && (
        <motion.span
          animate={{ scale: selected ? 1.08 : 1, rotate: selected ? 0 : 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200"
          style={{
            background: selected ? "rgba(34,111,84,0.18)" : "rgba(255,255,255,0.60)",
            color: selected ? "#3aab80" : "#475569",
          }}
          aria-hidden
        >
          {icon}
        </motion.span>
      )}

      <span className="min-w-0 flex-1">
        <span
          className="block font-semibold transition-colors duration-200"
          style={{ color: selected ? "rgba(220,234,255,0.97)" : "#111827" }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className="mt-0.5 block text-sm transition-colors duration-200"
            style={{ color: selected ? "rgba(200,218,255,0.65)" : "#64748b" }}
          >{subtitle}</span>
        )}
      </span>

      {/* Check icon with spring scale */}
      <motion.span
        initial={false}
        animate={{
          scale: selected ? 1 : 0,
          opacity: selected ? 1 : 0,
          rotate: selected ? 0 : -45,
        }}
        transition={{ type: "spring", stiffness: 460, damping: 26 }}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
        style={{ background: "var(--navy-600)" }}
      >
        <Check size={14} strokeWidth={3} />
      </motion.span>
    </motion.button>
  );
}
