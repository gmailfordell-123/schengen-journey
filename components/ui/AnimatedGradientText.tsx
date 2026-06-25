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
          "linear-gradient(90deg, #c9a84c 0%, #e8c96b 25%, #4070cc 50%, #c9a84c 75%, #e8c96b 100%)",
        backgroundSize: "200% auto",
      }}
    >
      {children}
    </span>
  );
}
