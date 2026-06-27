"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

const ROUTE = "M 60 240 C 220 60, 480 60, 640 220";

const PLANE_PATH =
  "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z";

export function HeroFlightAnimation() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set("#hero-plane", {
        motionPath: {
          path: "#hero-route",
          align: "#hero-route",
          alignOrigin: [0.5, 0.5],
          start: 0.45,
          end: 0.45,
        },
        opacity: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Fade plane in as soon as section enters view
      gsap.set("#hero-plane", { opacity: 1 });

      // Scrub plane along the arc while the page scrolls through the hero section
      gsap.to("#hero-plane", {
        ease: "none",
        immediateRender: true,
        motionPath: {
          path: "#hero-route",
          align: "#hero-route",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: 0,
          end: 1,
        },
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.2,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(12px)",
        minHeight: "340px",
      }}
    >
      {/* Top label */}
      <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: "rgba(240,244,255,0.45)" }}>
            Your Journey
          </p>
          <p className="text-base font-semibold text-white mt-0.5">
            UK &amp; Ireland → Schengen Area
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ background: "rgba(22,193,87,0.15)", color: "#4ade80", border: "1px solid rgba(22,193,87,0.25)" }}
        >
          27 destinations
        </span>
      </div>

      {/* SVG flight path */}
      <svg
        viewBox="0 0 700 300"
        className="w-full"
        style={{ marginTop: "20px" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--navy-500)" />
            <stop offset="50%" stopColor="var(--navy-400)" />
            <stop offset="100%" stopColor="var(--navy-500)" />
          </linearGradient>
          <linearGradient id="hero-trail" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#3aab80" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#226F54" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#226F54" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3aab80" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#226F54" stopOpacity="0" />
          </radialGradient>
          <filter id="hero-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="hero-blur-soft" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Glow underlay */}
        <path
          d={ROUTE}
          stroke="url(#hero-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.18"
          filter="url(#hero-blur)"
        />

        {/* Dotted route */}
        <path
          id="hero-route"
          d={ROUTE}
          stroke="url(#hero-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0.5 12"
          opacity="0.85"
        />

        {/* Origin marker */}
        <g>
          <circle cx="60" cy="240" r="9" fill="var(--navy-800)" stroke="#226F54" strokeWidth="2" />
          <circle cx="60" cy="240" r="3" fill="#226F54" />
          <text x="60" y="268" textAnchor="middle" fill="rgba(240,244,255,0.65)" fontSize="12" fontWeight="600" fontFamily="var(--app-sans)">
            UK &amp; Ireland
          </text>
        </g>

        {/* Destination marker */}
        <g>
          <circle cx="640" cy="220" r="9" fill="var(--navy-800)" stroke="#226F54" strokeWidth="2" />
          <circle cx="640" cy="220" r="3" fill="#226F54" />
          <text x="640" y="248" textAnchor="middle" fill="rgba(240,244,255,0.65)" fontSize="12" fontWeight="600" fontFamily="var(--app-sans)">
            Schengen Area
          </text>
        </g>

        {/* Plane — starts at left of path; opacity set by GSAP after mount */}
        <g id="hero-plane" style={{ opacity: 0 }}>
          <ellipse cx="-22" cy="0" rx="28" ry="5" fill="url(#hero-trail)" filter="url(#hero-blur-soft)" />
          <circle cx="0" cy="0" r="16" fill="url(#hero-glow)" />
          <g transform="rotate(45) scale(1.4)">
            <g transform="translate(-12,-12)">
              <path d={PLANE_PATH} fill="#ffffff" />
              <path d={PLANE_PATH} fill="none" stroke="#3aab80" strokeWidth="0.6" />
            </g>
          </g>
        </g>
      </svg>

      {/* Bottom stats row */}
      <div
        className="absolute bottom-0 left-0 right-0 grid grid-cols-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        {[
          { label: "Destinations", value: "27" },
          { label: "Visa Centres", value: "5" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="px-4 py-4 text-center"
            style={{ borderRight: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
          >
            <p className="text-lg font-semibold" style={{ color: "#3aab80" }}>{stat.value}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(240,244,255,0.45)" }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
