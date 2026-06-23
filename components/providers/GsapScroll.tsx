"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Sets up GSAP ScrollTrigger effects that link scroll position to section
 * transitions:
 *  - a top scroll-progress bar (scrubbed to page scroll)
 *  - parallax drift on elements marked [data-parallax]
 *  - a connector line that draws in across [data-gsap-line] as it scrolls
 *
 * Renders the progress bar itself; other targets are opted in via data attrs.
 */
export function GsapScroll() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Scroll progress bar
      if (barRef.current) {
        gsap.to(barRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });
      }

      // Parallax drift between sections
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const depth = Number(el.dataset.parallax) || 40;
        gsap.fromTo(
          el,
          { y: -depth },
          {
            y: depth,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // Connector line draws in as the "How it works" section scrolls
      gsap.utils.toArray<HTMLElement>("[data-gsap-line]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[90] h-1 bg-transparent">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-brand-700"
      />
    </div>
  );
}
