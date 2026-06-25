"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function AnimatedAuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
      {children}
    </div>
  );
}
