"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ─── Inline flag SVGs (no emoji) ────────────────────────────────────────── */

function UKFlag() {
  return (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "100%" }}>
      <rect width="60" height="40" fill="#012169" />
      <line x1="0" y1="0" x2="60" y2="40" stroke="white" strokeWidth="10" />
      <line x1="60" y1="0" x2="0" y2="40" stroke="white" strokeWidth="10" />
      <line x1="0" y1="0" x2="60" y2="40" stroke="#C8102E" strokeWidth="5" />
      <line x1="60" y1="0" x2="0" y2="40" stroke="#C8102E" strokeWidth="5" />
      <rect x="24" y="0" width="12" height="40" fill="white" />
      <rect x="0" y="14" width="60" height="12" fill="white" />
      <rect x="26" y="0" width="8" height="40" fill="#C8102E" />
      <rect x="0" y="16" width="60" height="8" fill="#C8102E" />
    </svg>
  );
}

function IrelandFlag() {
  return (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "100%" }}>
      <rect x="0"  y="0" width="20" height="40" fill="#169B62" />
      <rect x="20" y="0" width="20" height="40" fill="#F4F5F0" />
      <rect x="40" y="0" width="20" height="40" fill="#FF883E" />
    </svg>
  );
}

/* ─── Card definitions ────────────────────────────────────────────────────── */

const CARDS = [
  {
    id: "uk",
    href: "/book?origin=uk",
    label: "UNITED KINGDOM",
    heading: "United Kingdom Applications",
    subheading:
      "Schengen visa appointment and document support for UK residents.",
    cta: "Continue from United Kingdom",
    centres: ["London", "Manchester", "Birmingham", "Edinburgh"],
    Flag: UKFlag,
    // Big Ben / Houses of Parliament at dusk — Unsplash
    image:
      "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1600&q=85&fit=crop",
    ctaColor: "#e07c18",
  },
  {
    id: "ireland",
    href: "/book?origin=ireland",
    label: "IRELAND",
    heading: "Ireland Applications",
    subheading:
      "Schengen visa appointment and document support for Ireland residents.",
    cta: "Continue from Ireland",
    centres: ["Dublin"],
    Flag: IrelandFlag,
    // Cliffs of Moher, Ireland — Unsplash
    image:
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&q=85&fit=crop",
    ctaColor: "#1fa85a",
  },
] as const;

/* ─── Section ─────────────────────────────────────────────────────────────── */

export function CountrySelector() {
  return (
    <section id="countries" className="relative overflow-hidden section-pad section-subtle">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden"
            style={{ minHeight: "580px" }}
          >
            {/* ── Photo background ── */}
            <Image
              src={card.image}
              alt={`${card.label} background`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={i === 0}
            />

            {/* ── Gradient overlay — darkens bottom for text readability ── */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.62) 68%, rgba(0,0,0,0.90) 100%)",
              }}
            />

            {/* ── Hover dim ── */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "rgba(0,0,0,0.12)" }}
            />

            {/* ── Vertical divider on desktop ── */}
            {i === 0 && (
              <div
                className="absolute right-0 top-0 bottom-0 w-px hidden lg:block pointer-events-none"
                style={{ background: "rgba(255,255,255,0.12)" }}
              />
            )}

            {/* ── Content ── */}
            <Link
              href={card.href}
              className="absolute inset-0 z-10 flex flex-col justify-between p-9 lg:p-12"
              aria-label={card.cta}
            >
              {/* Top: flag badge + label */}
              <div>
                <div
                  className="inline-flex items-center gap-2.5 rounded-full px-3.5 py-2"
                  style={{
                    background: "rgba(0,0,0,0.52)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "15px",
                      borderRadius: "3px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <card.Flag />
                  </div>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white"
                  >
                    {card.label}
                  </span>
                </div>
              </div>

              {/* Bottom: heading, sub, centres, CTA */}
              <div>
                <h2 className="text-h2 text-white leading-tight drop-shadow-lg">
                  {card.heading}
                </h2>

                <p
                  className="mt-4 text-subhead max-w-sm drop-shadow"
                  style={{ color: "rgba(255,255,255,0.82)" }}
                >
                  {card.subheading}
                </p>

                {/* Supported centre pills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.centres.map((c) => (
                    <span
                      key={c}
                      className="rounded-full px-3.5 py-1.5 text-xs font-medium"
                      style={{
                        background: "rgba(0,0,0,0.45)",
                        color: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(255,255,255,0.28)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {/* CTA button */}
                <div className="mt-8">
                  <div
                    className="inline-flex items-center gap-3 rounded-xl px-7 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 group-hover:brightness-110"
                    style={{ background: card.ctaColor }}
                  >
                    {card.cta}
                    <ArrowRight
                      size={16}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
