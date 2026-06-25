"use client";

import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function BlurFade({
  children,
  delay = 0,
  duration = 0.5,
  yOffset = 16,
  blur = "8px",
  className = "",
  inViewMargin = "-50px",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blur?: string;
  className?: string;
  inViewMargin?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ y: yOffset }}
      animate={inView ? { y: 0 } : {}}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
