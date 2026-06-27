"use client";

import { CSSProperties } from "react";

export function BorderBeam({
  size = 200,
  duration = 12,
  delay = 0,
  colorFrom = "#226F54",
  colorTo = "#3aab80",
  className = "",
}: {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
      style={
        {
          "--size": size,
          "--duration": duration,
          "--delay": `-${delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--angle": "0deg",
          "--border-width": "1.5px",
          border: "var(--border-width) solid transparent",
          background: `linear-gradient(#0000, #0000) padding-box, conic-gradient(from var(--angle), transparent 80%, var(--color-from), var(--color-to), transparent) border-box`,
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: `border-beam-rotate calc(var(--duration) * 1s) linear infinite`,
          animationDelay: "var(--delay)",
        } as CSSProperties
      }
    />
  );
}
