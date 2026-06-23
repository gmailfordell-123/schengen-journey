"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * Initializes AOS (Animate On Scroll) once on mount.
 * Sections opt in via `data-aos="..."` attributes.
 */
export function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  return null;
}
