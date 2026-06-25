"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Full-screen loading indicator shown on initial page load.
 * Uses a lightweight pure-CSS brand spinner (no animation library) and fades
 * out via Framer Motion once the window has loaded (or a short minimum display
 * time elapses, whichever is later).
 */
export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const minDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, 1100)
    );
    const windowLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve(), { once: true });
      }
    });

    let active = true;
    Promise.all([minDelay, windowLoaded]).then(() => {
      if (active) setVisible(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-white"
        >
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-[3px] border-brand-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-brand-600 border-r-gold-500" />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm font-medium tracking-wide text-slate-500"
          >
            Preparing your journey…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
