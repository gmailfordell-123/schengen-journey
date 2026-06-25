"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.25"] });

  const words = text.split(" ");

  return (
    <div ref={ref} className={`relative flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </div>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const blur = useTransform(progress, range, ["6px", "0px"]);
  const y = useTransform(progress, range, [10, 0]);

  return (
    <motion.span
      style={{ opacity, filter: blur, y }}
      className="inline-block transition-none"
    >
      {children}
    </motion.span>
  );
}
