"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Global GSAP scroll effects:
 * - Top scroll-progress bar (scrubbed)
 * - [data-parallax] — vertical parallax drift
 * - [data-gsap-line] — horizontal line draw
 * - [data-gsap-section] — premium section entrance (opacity + y, once)
 * - [data-gsap-stagger] — children stagger reveal (once)
 */
export function GsapScroll() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* Respect reduced-motion */
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      /* ── Scroll progress bar ── */
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

      if (prefersReduced) return;

      /* ── Parallax drift ── */
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

      /* ── Connector line draw ── */
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

      /* ── Section entrance (opacity + y, once) ── */
      gsap.utils.toArray<HTMLElement>("[data-gsap-section]").forEach((el) => {
        const delay = Number(el.dataset.gsapDelay) || 0;
        gsap.fromTo(
          el,
          { opacity: 0, y: 42, willChange: "transform, opacity" },
          {
            opacity: 1,
            y: 0,
            duration: 0.82,
            delay,
            ease: "power3.out",
            clearProps: "willChange",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      /* ── Children stagger reveal ── */
      gsap.utils.toArray<HTMLElement>("[data-gsap-stagger]").forEach((el) => {
        const staggerTime = Number(el.dataset.gsapStagger) || 0.1;
        const children = Array.from(el.children) as HTMLElement[];
        if (!children.length) return;

        gsap.fromTo(
          children,
          { opacity: 0, y: 28, willChange: "transform, opacity" },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: staggerTime,
            ease: "power3.out",
            clearProps: "willChange",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[90] h-[2px] bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0"
        style={{ background: "linear-gradient(90deg, var(--navy-600), var(--gold-500))" }}
      />
    </div>
  );
}
