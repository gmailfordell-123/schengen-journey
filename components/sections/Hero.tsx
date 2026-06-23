"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Zap, FileText, Activity, Star, Check, Circle } from "lucide-react";
import { Container } from "@/components/ui/Container";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
} as const;
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 18 } },
} as const;

const trustBadges = [
  { Icon: MapPin, label: "UK Applicants" },
  { Icon: MapPin, label: "Ireland Applicants" },
  { Icon: Zap, label: "Fast Appointment Support" },
  { Icon: FileText, label: "Document Assistance" },
  { Icon: Activity, label: "Application Tracking" },
];

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, var(--navy-950) 0%, var(--navy-800) 60%, var(--navy-700) 100%)`,
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Subtle background texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(30,58,138,0.4) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(14,31,66,0.6) 0%, transparent 40%)`,
        }}
      />

      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <Container className="relative py-24 sm:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left: copy */}
          <motion.div variants={container} initial="hidden" animate="show">

            {/* Eyebrow */}
            <motion.div variants={item} className="mb-7 flex items-center gap-3">
              <span
                className="h-px w-8 rounded"
                style={{ background: "var(--gold-500)" }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--gold-500)" }}
              >
                UK &amp; Ireland Schengen Visa Service
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="text-h1 text-white"
            >
              Schengen Visa Appointments
              <br />
              <span style={{ color: "var(--gold-500)" }}>
                From the UK &amp; Ireland
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={item}
              className="text-subhead mt-6 max-w-lg"
              style={{ color: "rgba(240,244,255,0.70)" }}
            >
              We handle appointment booking, document preparation, cover letters,
              travel insurance, flight reservations, hotel bookings, and real-time
              application tracking — so your visa journey is smooth and stress-free.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
              <Link href="/book" className="btn btn-gold px-7 py-3.5 text-[0.9375rem]">
                Book Appointment
              </Link>
              <Link href="/pricing" className="btn btn-outline-white px-7 py-3.5 text-[0.9375rem]">
                View Packages
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={item}
              className="mt-10 flex items-center gap-5"
            >
              <div className="flex -space-x-2.5">
                {["FA","PM","OB","AS"].map((i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--navy-700)] text-[10px] font-semibold text-white"
                    style={{ background: "var(--navy-500)" }}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        size={13}
                        style={{ color: "var(--gold-500)", fill: "var(--gold-500)" }}
                      />
                    ))}
                  </span>
                  <span style={{ color: "var(--gold-500)" }}>5,000+</span> clients assisted
                </div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(240,244,255,0.5)" }}>
                  UK &amp; Ireland applicants
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: UI preview card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 60, damping: 16 }}
          >
            <div
              className="rounded-2xl p-7"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide mb-1"
                    style={{ color: "rgba(240,244,255,0.45)" }}>
                    Application Reference
                  </p>
                  <p className="font-mono text-base font-semibold text-white">
                    SJ-4F9A21
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{ background: "rgba(22,193,87,0.15)", color: "#4ade80" }}
                >
                  ● Confirmed
                </span>
              </div>

              {/* Status progress */}
              <div className="space-y-3 mb-6">
                {[
                  { label: "Appointment Scheduled", done: true },
                  { label: "Documents Submitted", done: true },
                  { label: "Under Review", done: true },
                  { label: "Decision Pending", done: false },
                ].map((step) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]"
                      style={{
                        background: step.done ? "var(--gold-500)" : "rgba(255,255,255,0.1)",
                        color: step.done ? "var(--navy-900)" : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {step.done ? (
                        <Check size={11} strokeWidth={3} />
                      ) : (
                        <Circle size={9} strokeWidth={2} />
                      )}
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: step.done ? "rgba(240,244,255,0.9)" : "rgba(240,244,255,0.35)" }}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Destination", value: "France" },
                  { label: "Visa Centre", value: "VFS London" },
                  { label: "Package", value: "Platinum" },
                  { label: "Applicants", value: "2 persons" },
                ].map((d) => (
                  <div
                    key={d.label}
                    className="rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <p className="text-[10px] uppercase tracking-wide mb-1"
                      style={{ color: "rgba(240,244,255,0.4)" }}>
                      {d.label}
                    </p>
                    <p className="text-sm font-medium text-white">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust badges strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-3 lg:justify-start"
        >
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <badge.Icon size={14} style={{ color: "var(--gold-500)" }} />
              <span className="text-xs font-medium" style={{ color: "rgba(240,244,255,0.75)" }}>
                {badge.label}
              </span>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
