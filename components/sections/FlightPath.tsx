"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Scroll-driven "flight journey" band.
 *
 * A plane travels along a dotted curved route as the section scrolls through
 * the viewport, driven by GSAP ScrollTrigger + MotionPathPlugin. The plane
 * auto-rotates to the curve tangent and carries a soft trailing glow.
 * Framer Motion is intentionally NOT used here — this is a scroll-scrubbed
 * GSAP timeline; Framer is reserved for small UI interactions elsewhere.
 */

// The flight route — a gentle arc across the band (viewBox 0 0 1200 320).
const ROUTE = "M 96 232 C 360 70, 840 70, 1104 214";

// lucide-react "plane" icon path (24×24), drawn as a filled silhouette.
const PLANE_PATH =
  "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z";

export function FlightPath() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const motionPath = {
      path: "#flight-route",
      align: "#flight-route",
      alignOrigin: [0.5, 0.5] as [number, number],
      autoRotate: true,
    };

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        // Place the plane statically at ~45% along the route.
        gsap.set("#flight-plane", {
          motionPath: { ...motionPath, start: 0.45, end: 0.45 },
        });
        return;
      }

      gsap.to("#flight-plane", {
        ease: "none",
        immediateRender: true,
        motionPath,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="flight-journey"
      className="section-pad relative overflow-hidden"
      style={{
        backgroundColor: "var(--navy-950)",
        backgroundImage:
          "radial-gradient(900px 460px at 50% -20%, rgba(34,111,84,0.20), transparent 60%), linear-gradient(180deg, var(--navy-900) 0%, var(--navy-950) 100%)",
      }}
    >
      <Container className="relative">
        <SectionHeading
          light
          eyebrow="Your Schengen Journey"
          title="From the UK & Ireland to all of Europe"
          subtitle="Once your appointment and documents are sorted, the only thing left is the journey itself — across all 27 Schengen states."
        />

        {/* Flight path canvas */}
        <div className="relative mx-auto mt-14 max-w-5xl">
          <svg
            viewBox="0 0 1200 320"
            className="w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="fp-route" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--navy-500)" />
                <stop offset="50%" stopColor="var(--navy-400)" />
                <stop offset="100%" stopColor="var(--navy-500)" />
              </linearGradient>

              <linearGradient id="fp-trail" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#3aab80" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#226F54" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#226F54" stopOpacity="0" />
              </linearGradient>

              <radialGradient id="fp-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3aab80" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#226F54" stopOpacity="0" />
              </radialGradient>

              <filter id="fp-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id="fp-blur-soft" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>

            {/* Soft underlay glow of the route for depth */}
            <path
              d={ROUTE}
              stroke="url(#fp-route)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.18"
              filter="url(#fp-blur)"
            />

            {/* Dotted flight route */}
            <path
              id="flight-route"
              d={ROUTE}
              stroke="url(#fp-route)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="0.5 14"
              opacity="0.9"
            />

            {/* Origin marker (UK / Ireland) */}
            <g>
              <circle cx="96" cy="232" r="11" fill="var(--navy-800)" stroke="#226F54" strokeWidth="2" />
              <circle cx="96" cy="232" r="3.5" fill="#226F54" />
              <text x="96" y="272" textAnchor="middle" fill="rgba(240,244,255,0.7)" fontSize="15" fontWeight="600" fontFamily="var(--app-sans)">
                UK &amp; Ireland
              </text>
            </g>

            {/* Destination marker (Schengen) */}
            <g>
              <circle cx="1104" cy="214" r="11" fill="var(--navy-800)" stroke="#226F54" strokeWidth="2" />
              <circle cx="1104" cy="214" r="3.5" fill="#226F54" />
              <text x="1104" y="254" textAnchor="middle" fill="rgba(240,244,255,0.7)" fontSize="15" fontWeight="600" fontFamily="var(--app-sans)">
                Schengen Area
              </text>
            </g>

            {/* Plane group — MotionPath target. Children are positioned around
                the group origin (0,0), which rides the route. +x is "forward". */}
            <g id="flight-plane">
              {/* Trailing glow (sits behind the nose, fades to the tail) */}
              <ellipse cx="-26" cy="0" rx="34" ry="6" fill="url(#fp-trail)" filter="url(#fp-blur-soft)" />
              {/* Soft halo directly under the plane */}
              <circle cx="0" cy="0" r="20" fill="url(#fp-glow)" />
              {/* Plane silhouette — rotate(45) turns the up-right lucide icon to
                  point along +x; translate centres the 24×24 icon on the origin. */}
              <g transform="rotate(45) scale(1.55)">
                <g transform="translate(-12,-12)">
                  <path d={PLANE_PATH} fill="#ffffff" />
                  <path d={PLANE_PATH} fill="none" stroke="#3aab80" strokeWidth="0.6" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </Container>
    </section>
  );
}
