"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  shimmerColor?: string;
  background?: string;
  className?: string;
  href?: string;
}

export function ShimmerButton({
  children,
  shimmerColor = "rgba(255,255,255,0.18)",
  background = "var(--gold-500)",
  className = "",
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      {...props}
      className={`group relative overflow-hidden rounded-full font-semibold transition-all duration-300 ${className}`}
      style={{ background }}
    >
      {/* Shimmer sweep */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
        style={{ background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)` }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
