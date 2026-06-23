"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import loaderAnimation from "@/public/lottie/loader.json";

/**
 * Full-screen Lottie loading animation shown on initial page load.
 * Fades out via Framer Motion once the window has loaded (or a short
 * minimum display time elapses, whichever is later).
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
          <Lottie
            animationData={loaderAnimation}
            loop
            autoplay
            style={{ width: 120, height: 120 }}
          />
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
