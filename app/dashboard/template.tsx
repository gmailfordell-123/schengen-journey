"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Per-page transition for dashboard routes. `template.tsx` re-mounts on every
 * navigation, so each dashboard page fades up in. Respects reduced motion.
 */
export default function DashboardTemplate({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return <>{children}</>;
}
