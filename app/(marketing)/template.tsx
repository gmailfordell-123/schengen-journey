"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Framer Motion page transition. `template.tsx` re-mounts on every
 * navigation, so each marketing page fades/slides in.
 */
export default function MarketingTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
