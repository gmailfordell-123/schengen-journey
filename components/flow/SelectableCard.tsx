"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * A selectable option card with Framer Motion hover/tap feedback and a
 * highlighted selected state. Reused across every step of the flow.
 *
 * `icon` is an optional leading visual (e.g. a lucide-react icon). No emoji.
 */
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
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-pressed={selected}
      className={`group relative flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-5 text-left shadow-sm transition-colors ${
        selected
          ? "border-brand-600 ring-2 ring-brand-100"
          : "border-slate-200 hover:border-brand-400"
      } ${className}`}
    >
      {icon && (
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
          aria-hidden
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-slate-900">{title}</span>
        {subtitle && (
          <span className="mt-0.5 block text-sm text-slate-500">{subtitle}</span>
        )}
      </span>

      {/* Selected check */}
      <motion.span
        initial={false}
        animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white"
      >
        <Check size={14} strokeWidth={3} />
      </motion.span>
    </motion.button>
  );
}
