"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Initialises Lenis smooth scroll and wires it to GSAP's ScrollTrigger so
 * all scroll-driven animations (FlightPath, parallax, progress bar) stay in
 * sync with the smoothed scroll position instead of the raw window position.
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    // Expose globally so mobile menu can pause/resume scrolling
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    // Feed Lenis scroll position into GSAP's ticker so ScrollTrigger stays synced
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      delete (window as unknown as Record<string, unknown>).__lenis;
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return null;
}
