"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Per-page transition for admin routes (mirrors the dashboard template).
 */
export default function AdminTemplate({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return <>{children}</>;
}
