"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Zap, FileText, Activity, Star } from "lucide-react";
import gsap from "gsap";
import { Container } from "@/components/ui/Container";
import { HeroFlightAnimation } from "@/components/sections/HeroFlightAnimation";
import { Meteors } from "@/components/ui/Meteors";
import { AnimatedGradientText } from "@/components/ui/AnimatedGradientText";
import { WordReveal } from "@/components/ui/WordReveal";

const trustBadges = [
  { Icon: MapPin,   label: "UK Applicants" },
  { Icon: MapPin,   label: "Ireland Applicants" },
  { Icon: Zap,      label: "Fast Appointment Support" },
  { Icon: FileText, label: "Document Assistance" },
  { Icon: Activity, label: "Application Tracking" },
];

export function Hero() {
  const blobRef = useRef<HTMLDivElement>(null);

  /* GSAP — slow ambient glow movement */
  useEffect(() => {
    if (!blobRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(blobRef.current, {
      backgroundPosition: "60% 60%, 30% 10%, 70% 85%",
      duration: 12,
      ease: "sine.inOut",
    }).to(blobRef.current, {
      backgroundPosition: "20% 45%, 85% 25%, 55% 75%",
      duration: 10,
      ease: "sine.inOut",
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #060912 0%, #0d1525 55%, #0f1d3a 100%)",
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Meteors number={22} />

      {/* Animated radial glow blobs */}
      <div
        ref={blobRef}
        className="pointer-events-none absolute inset-0 transition-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(30,58,138,0.42) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(14,31,66,0.60) 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, rgba(70, 126, 155, 0.07) 0%, transparent 35%)
          `,
          backgroundSize: "100% 100%",
          willChange: "background-position",
        }}
      />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.032]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Spotlight */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, var(--gold-500) 0%, transparent 70%)",
          animation: "spotlight 2s ease-out forwards",
        }}
      />

      <Container className="relative py-24 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── Left copy ── */}
          <div className="min-w-0">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-7 flex items-center gap-3"
            >
              <span className="h-px w-8 rounded" style={{ background: "var(--gold-500)" }} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                <AnimatedGradientText>UK &amp; Ireland Schengen Visa Service</AnimatedGradientText>
              </span>
            </motion.div>

            {/* Headline — word-by-word reveal */}
            <h1 className="text-h1 text-white leading-[1.12]">
              <WordReveal text="Schengen Visa Appointments" initialDelay={0.08} />
              <br />
              <span style={{ color: "var(--gold-500)" }}>
                <WordReveal text="From the UK & Ireland" initialDelay={0.52} />
              </span>
            </h1>

            {/* Subheading — delayed fade up */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.82, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-lg"
              style={{
                fontFamily: "var(--ff-inter, Inter, -apple-system, sans-serif)",
                fontWeight: 300,
                fontSize: "clamp(1.0625rem, 0.95rem + 0.45vw, 1.25rem)",
                lineHeight: 1.72,
                letterSpacing: "0.005em",
                color: "rgba(220, 234, 255, 0.72)",
              }}
            >
              Dedicated Schengen visa support for UK and Ireland applicants.
              Our team manages your appointment scheduling, full documentation
              and real-time application tracking so every step is handled
              with precision.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 340, damping: 22 }}
              >
                <Link
                  href="/book"
                  className="btn btn-gold relative overflow-hidden px-7 py-3.5 text-[0.9375rem] group inline-flex items-center gap-2"
                >
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.30),transparent)" }}
                  />
                  <span className="relative z-10">Book Appointment</span>
                  <ArrowRight
                    size={15}
                    className="relative z-10 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 340, damping: 22 }}
              >
                <Link
                  href="/pricing"
                  className="btn btn-outline-white px-7 py-3.5 text-[0.9375rem] relative overflow-hidden group inline-flex items-center gap-2"
                >
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)", animationDelay: "0.8s" }}
                  />
                  <span className="relative z-10">View Packages</span>
                  <ArrowRight
                    size={15}
                    className="relative z-10 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.12, duration: 0.45 }}
              className="mt-10 flex items-center gap-1.5"
            >
              <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={13} style={{ color: "var(--gold-500)", fill: "var(--gold-500)" }} />
                  ))}
                </span>
                <span style={{ color: "var(--gold-500)" }}>5,000+</span> clients assisted
              </div>
              <div className="text-xs" style={{ color: "rgba(240,244,255,0.5)" }}>
                • UK &amp; Ireland applicants
              </div>
            </motion.div>
          </div>

          {/* ── Right: flight animation ── */}
          <motion.div
            className="min-w-0"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 55, damping: 14 }}
          >
            <HeroFlightAnimation />
          </motion.div>
        </div>

        {/* Trust badges — spring stagger */}
        <div className="mt-16 flex flex-wrap justify-center gap-3 lg:justify-start">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.82, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 1.1 + i * 0.09,
                type: "spring",
                stiffness: 160,
                damping: 20,
              }}
              whileHover={{ y: -3, scale: 1.04 }}
              className="flex items-center gap-2 rounded-full px-4 py-2 cursor-default"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                transition: "box-shadow 0.2s ease",
              }}
            >
              <badge.Icon size={14} style={{ color: "var(--gold-500)" }} />
              <span className="text-xs font-medium" style={{ color: "rgba(240,244,255,0.75)" }}>
                {badge.label}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
