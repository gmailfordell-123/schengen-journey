"use client";

import type { ReactNode } from "react";

export function AnimatedGradientText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`animate-gradient-text bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #226F54 0%, #3aab80 25%, #FFFCF2 50%, #226F54 75%, #3aab80 100%)",
        backgroundSize: "200% auto",
      }}
    >
      {children}
    </span>
  );
}
