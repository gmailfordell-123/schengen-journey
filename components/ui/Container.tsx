import type { ReactNode } from "react";

/**
 * Centered, max-width page container with horizontal padding.
 * Reused across marketing pages and app shells for consistent gutters.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
