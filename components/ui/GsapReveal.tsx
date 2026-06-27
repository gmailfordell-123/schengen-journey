"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GSAP ScrollTrigger reveal. Replaces BlurFade for premium section entrances.
 * Triggers when the element enters the viewport (once).
 */
export function GsapReveal({
  children,
  className = "",
  delay = 0,
  y = 36,
  duration = 0.75,
  start = "top 88%",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start,
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay, y, duration, start]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

/**
 * GSAP stagger reveal for a group of children.
 * Each direct child animates in sequence.
 */
export function GsapStagger({
  children,
  className = "",
  stagger = 0.1,
  y = 28,
  start = "top 88%",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const items = Array.from(ref.current.children);
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start,
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [stagger, y, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
