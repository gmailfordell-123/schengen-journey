"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";

/* ─── Flag SVG components ─────────────────────────────────────────────────── */

function UKFlag() {
  return (
    <svg
      viewBox="0 0 60 40"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-label="United Kingdom flag"
    >
      {/* Blue field */}
      <rect width="60" height="40" fill="#012169" />
      {/* St Andrew's white diagonals */}
      <line x1="0" y1="0" x2="60" y2="40" stroke="white" strokeWidth="10" />
      <line x1="60" y1="0" x2="0" y2="40" stroke="white" strokeWidth="10" />
      {/* St Patrick's red counter-diagonals */}
      <line x1="0" y1="0" x2="60" y2="40" stroke="#C8102E" strokeWidth="5" />
      <line x1="60" y1="0" x2="0" y2="40" stroke="#C8102E" strokeWidth="5" />
      {/* St George's white cross arms */}
      <rect x="24" y="0" width="12" height="40" fill="white" />
      <rect x="0" y="14" width="60" height="12" fill="white" />
      {/* St George's red cross arms */}
      <rect x="26" y="0" width="8" height="40" fill="#C8102E" />
      <rect x="0" y="16" width="60" height="8" fill="#C8102E" />
    </svg>
  );
}

function IrelandFlag() {
  return (
    <svg
      viewBox="0 0 60 40"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-label="Ireland flag"
    >
      <rect x="0"  y="0" width="20" height="40" fill="#169B62" />
      <rect x="20" y="0" width="20" height="40" fill="#F4F5F0" />
      <rect x="40" y="0" width="20" height="40" fill="#FF883E" />
    </svg>
  );
}

/* ─── Card data ───────────────────────────────────────────────────────────── */

const CARDS = [
  {
    id: "uk",
    Flag: UKFlag,
    name: "United Kingdom",
    tagline: "Apply through our supported UK visa centres.",
    centres: ["London", "Birmingham", "Manchester", "Edinburgh"],
    href: "/book",
    cta: "Select United Kingdom",
  },
  {
    id: "ie",
    Flag: IrelandFlag,
    name: "Ireland",
    tagline: "Apply through our supported Ireland visa centre.",
    centres: ["Dublin"],
    href: "/book",
    cta: "Select Ireland",
  },
] as const;

const TRUST_ITEMS = [
  "Specialised for UK and Ireland residents",
  "Clear centre selection guidance",
  "Destination-specific document checklists",
  "Package-based application support",
];

/* ─── Animation variants ──────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 18 },
  },
} as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
} as const;

/* ─── Component ───────────────────────────────────────────────────────────── */

export function CountrySelector() {
  return (
    <section
      id="countries"
      className="relative overflow-hidden"
      style={{ paddingTop: "6rem", paddingBottom: "7rem" }}
    >
      {/* ── Layered background ────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #eef4ff 0%, #f2f6fc 40%, #f7f9fc 75%, #ffffff 100%)",
        }}
      />
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(14,31,66,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Soft radial glow — top right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-140px",
          right: "-100px",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(41,82,179,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <Container className="relative">
        {/* ── Heading block ─────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Eyebrow label */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <span
              className="h-px w-8 rounded shrink-0"
              style={{ background: "var(--gold-500)" }}
            />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--gold-500)" }}
            >
              Where Are You Applying From
            </span>
            <span
              className="h-px w-8 rounded shrink-0"
              style={{ background: "var(--gold-500)" }}
            />
          </motion.div>

          {/* Main heading */}
          <motion.h2
            variants={fadeUp}
            className="text-h2"
            style={{ color: "var(--ink)" }}
          >
            Choose your application location
          </motion.h2>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="text-subhead mt-4"
            style={{ color: "var(--ink-muted)" }}
          >
            Schengen Journey supports visa applicants applying from the United
            Kingdom and Ireland. Select your location to view supported centres,
            destinations, and service packages.
          </motion.p>
        </motion.div>

        {/* ── Country cards ─────────────────────────────────────────────── */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: i * 0.13,
                type: "spring" as const,
                stiffness: 70,
                damping: 16,
              }}
              whileHover={{ y: -7 }}
            >
              <Link
                href={card.href}
                className="cs-card group flex flex-col h-full rounded-2xl"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow:
                    "0 2px 8px rgba(8,20,40,0.06), 0 10px 28px -8px rgba(8,20,40,0.10)",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                {/* Gold accent bar */}
                <div
                  className="h-[3px] w-full shrink-0"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--gold-500), var(--gold-400))",
                  }}
                />

                <div className="flex flex-col flex-1 p-8">

                  {/* Flag in styled container */}
                  <div className="mb-7">
                    <div
                      style={{
                        width: "90px",
                        height: "60px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow:
                          "0 2px 10px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.09)",
                        flexShrink: 0,
                      }}
                    >
                      <card.Flag />
                    </div>
                  </div>

                  {/* Country name */}
                  <h3
                    className="text-h3"
                    style={{ color: "var(--ink)" }}
                  >
                    {card.name}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {card.tagline}
                  </p>

                  {/* Divider */}
                  <div
                    className="my-6 h-px"
                    style={{ background: "rgba(0,0,0,0.07)" }}
                  />

                  {/* Supported centres */}
                  <div className="flex-1">
                    <p
                      className="mb-4 text-[11px] font-semibold uppercase tracking-[0.13em]"
                      style={{ color: "var(--ink-light)" }}
                    >
                      Supported Centres
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {card.centres.map((city) => (
                        <span
                          key={city}
                          className="rounded-full px-3.5 py-1.5 text-xs font-medium"
                          style={{
                            background: "var(--navy-50)",
                            color: "var(--navy-700)",
                            border: "1px solid var(--navy-100)",
                          }}
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="mt-8">
                    <div
                      className="cs-btn flex items-center justify-center gap-2.5 py-3.5 text-sm font-semibold text-white"
                      style={{
                        background: "var(--navy-700)",
                        borderRadius: "10px",
                        transition: "background 0.18s ease",
                      }}
                    >
                      {card.cta}
                      <ArrowRight
                        size={15}
                        strokeWidth={2.5}
                        className="group-hover:translate-x-1 transition-transform duration-200"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Trust strip ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          {/* Rule with label */}
          <div className="flex items-center gap-5 mb-7">
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
            <span
              className="text-[11px] font-medium tracking-wider shrink-0"
              style={{ color: "var(--ink-light)" }}
            >
              WHAT WE PROVIDE
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 rounded-xl px-4 py-3.5"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(0,0,0,0.07)",
                }}
              >
                <CheckCircle2
                  size={14}
                  strokeWidth={2.5}
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--navy-600)" }}
                />
                <span
                  className="text-xs leading-snug font-medium"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>

      <style>{`
        .cs-card:hover {
          box-shadow: 0 10px 36px rgba(8,20,40,0.15), 0 2px 8px rgba(8,20,40,0.06) !important;
        }
        .cs-card:hover .cs-btn {
          background: var(--navy-800) !important;
        }
      `}</style>
    </section>
  );
}
