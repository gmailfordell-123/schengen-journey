"use client";

import { useEffect } from "react";

export function NavbarScrollEffect() {
  useEffect(() => {
    const header = document.querySelector("[data-navbar]") as HTMLElement | null;
    if (!header) return;

    const update = () => {
      const y = window.scrollY;
      const light = document.documentElement.classList.contains("light");

      if (y > 24) {
        header.style.background     = light ? "rgba(255,255,255,0.98)" : "rgba(4,8,18,0.96)";
        header.style.boxShadow      = light
          ? "0 4px 20px rgba(0,0,0,0.08), 0 1px 0 rgba(0,0,0,0.06)"
          : "0 4px 30px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.05)";
        header.style.borderBottomColor = light ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
      } else {
        header.style.background     = light ? "rgba(255,255,255,0.90)" : "rgba(8,20,40,0.72)";
        header.style.boxShadow      = "";
        header.style.borderBottomColor = light ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)";
      }
    };

    // Re-apply whenever the theme class changes on <html>
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  return null;
}
