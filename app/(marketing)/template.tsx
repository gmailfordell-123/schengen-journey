"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Re-mounts on every navigation — drives the page enter animation.
 * Outgoing page blurs + fades; incoming page slides up from slight offset.
 */
export default function MarketingTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
