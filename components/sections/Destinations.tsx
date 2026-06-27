"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Region = "uk" | "ireland";

/* Landmark destination photos from /public/images/destinations/ */
const FLAG_SRC: Record<string, string> = {
  France:      "/images/destinations/france.jpeg",
  Netherlands: "/images/destinations/netherlands.jpeg",
  Italy:       "/images/destinations/italy.jpeg",
  Greece:      "/images/destinations/greece.jpeg",
  Hungary:     "/images/destinations/hungary.jpeg",
  Austria:     "/images/destinations/austria.jpeg",
  Switzerland: "/images/destinations/switzerland.jpeg",
  Denmark:     "/images/destinations/denmark.jpeg",
  Finland:     "/images/destinations/finland.jpeg",
  Belgium:     "/images/destinations/belgium.jpeg",
  Croatia:     "/images/destinations/croatia.jpeg",
  Norway:      "/images/destinations/norway.jpeg",
  Sweden:      "/images/destinations/sweden.jpeg",
  Germany:     "/images/destinations/germany.jpeg",
  Portugal:    "/images/destinations/portugal.jpeg",
  Iceland:     "/images/destinations/iceland.jpeg",
  Slovenia:    "/images/destinations/slovenia.jpeg",
};

/* No gradient fallbacks needed — all countries have photos now */
const FALLBACK_GRADIENT: Record<string, string> = {};

const destinations: Record<Region, { name: string; code: string }[]> = {
  uk: [
    { name: "France",      code: "FR" },
    { name: "Netherlands", code: "NL" },
    { name: "Italy",       code: "IT" },
    { name: "Greece",      code: "GR" },
    { name: "Germany",     code: "DE" },
    { name: "Portugal",    code: "PT" },
    { name: "Hungary",     code: "HU" },
    { name: "Austria",     code: "AT" },
    { name: "Switzerland", code: "CH" },
    { name: "Denmark",     code: "DK" },
    { name: "Belgium",     code: "BE" },
    { name: "Iceland",     code: "IS" },
    { name: "Finland",     code: "FI" },
  ],
  ireland: [
    { name: "Netherlands", code: "NL" },
    { name: "Italy",       code: "IT" },
    { name: "Austria",     code: "AT" },
    { name: "Switzerland", code: "CH" },
    { name: "Belgium",     code: "BE" },
    { name: "Croatia",     code: "HR" },
    { name: "Denmark",     code: "DK" },
    { name: "Hungary",     code: "HU" },
    { name: "Finland",     code: "FI" },
    { name: "Norway",      code: "NO" },
    { name: "Sweden",      code: "SE" },
    { name: "Slovenia",    code: "SI" },
    { name: "Iceland",     code: "IS" },
  ],
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const REGION_BG: Record<Region, string> = {
  uk:      "/images/uk-bg.jpg",
  ireland: "/images/ireland-bg.jpg",
};

const REGION_LABEL: Record<Region, { flag: string; title: string; subtitle: string; cities: string }> = {
  uk: {
    flag:     "🇬🇧",
    title:    "United Kingdom",
    subtitle: "Schengen visa appointment & document support for UK residents.",
    cities:   "London · Manchester · Birmingham · Edinburgh",
  },
  ireland: {
    flag:     "🇮🇪",
    title:    "Ireland",
    subtitle: "Schengen visa appointment & document support for Ireland residents.",
    cities:   "Dublin",
  },
};

export function Destinations() {
  const [region, setRegion] = useState<Region>("uk");

  return (
    <section id="destinations" className="section-pad" style={{ background: "#f0f2f7" }}>
      <Container>
        <SectionHeading
          eyebrow="Supported Destinations"
          title="Premium Schengen destinations"
          subtitle="We specialise in streamlined visa applications to top European destinations. Select your origin country to see the destinations we support."
        />

        {/* ── Photo hero selector ── */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(["uk", "ireland"] as Region[]).map((r) => {
            const active = region === r;
            const info = REGION_LABEL[r];
            return (
              <motion.button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="group relative overflow-hidden rounded-2xl text-left"
                style={{
                  height: 220,
                  border: active
                    ? "2.5px solid var(--gold-500)"
                    : "2px solid rgba(255,255,255,0.15)",
                  boxShadow: active
                    ? "0 8px 32px rgba(4,12,26,0.35), 0 0 0 1px var(--gold-500)"
                    : "0 4px 16px rgba(4,12,26,0.20)",
                }}
              >
                {/* Background photo */}
                <Image
                  src={REGION_BG[r]}
                  alt={info.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  priority
                />

                {/* Dark gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(4,12,26,0.88) 0%, rgba(4,12,26,0.40) 55%, rgba(4,12,26,0.18) 100%)",
                  }}
                />

                {/* Active gold tint */}
                {active && (
                  <motion.div
                    layoutId="region-tint"
                    className="absolute inset-0"
                    style={{ background: "rgba(34,111,84,0.10)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  {/* Top badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                      style={{
                        background: active ? "var(--gold-500)" : "rgba(255,255,255,0.15)",
                        color: active ? "var(--navy-900)" : "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.20)",
                      }}
                    >
                      {r === "uk" ? "United Kingdom" : "Ireland"}
                    </span>

                    {/* Active check */}
                    <motion.div
                      animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 440, damping: 26 }}
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{ background: "var(--gold-500)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--navy-900)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Bottom content */}
                  <div>
                    <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.60)" }}>
                      {info.cities}
                    </p>
                    <p className="mt-1 text-base font-semibold leading-snug text-white">
                      {info.subtitle}
                    </p>
                    <div
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 group-hover:gap-2.5"
                      style={{ color: active ? "var(--gold-400)" : "rgba(255,255,255,0.55)" }}
                    >
                      {active ? "Viewing destinations" : "Click to view"}
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Destination cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
          >
            {destinations[region].map(({ name, code }, idx) => {
              const flagSrc = FLAG_SRC[name];
              const fallback = FALLBACK_GRADIENT[name];

              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.04, duration: 0.28, ease: EASE }}
                  whileHover={{ y: -5, transition: { duration: 0.18, ease: EASE } }}
                  className="group relative flex flex-col overflow-hidden rounded-xl cursor-default"
                  style={{
                    background: "#1a3a5c",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 3px 12px rgba(4,12,26,0.20), 0 1px 3px rgba(4,12,26,0.10)",
                    transition: "box-shadow 0.20s ease, border-color 0.20s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "0 14px 36px rgba(4,12,26,0.30), 0 4px 10px rgba(4,12,26,0.14)";
                    el.style.borderColor = "rgba(255,255,255,0.26)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = "0 3px 12px rgba(4,12,26,0.20), 0 1px 3px rgba(4,12,26,0.10)";
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                  }}
                >
                  {/* ── Flag image area ── */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      height: 120,
                      background: fallback ?? "linear-gradient(160deg, #1a4d6e 0%, #0e3050 100%)",
                    }}
                  >
                    {flagSrc && (
                      <Image
                        src={flagSrc}
                        alt={`${name} flag`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                        priority={idx < 6}
                      />
                    )}

                    {/* Subtle dark vignette — keeps badge readable */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(4,12,26,0.18) 0%, transparent 40%, rgba(4,12,26,0.22) 100%)",
                      }}
                    />

                    {/* Country code badge */}
                    <span
                      className="absolute top-2 left-2 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest"
                      style={{
                        background: "rgba(4,12,26,0.55)",
                        color: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(6px)",
                        border: "1px solid rgba(255,255,255,0.18)",
                      }}
                    >
                      {code}
                    </span>
                  </div>

                  {/* ── Info area ── */}
                  <div className="flex items-center gap-1.5 px-3 py-2.5">
                    <MapPin
                      size={12}
                      className="shrink-0"
                      style={{ color: "rgba(255,255,255,0.50)" }}
                    />
                    <p
                      className="text-[0.8125rem] font-bold leading-snug tracking-tight"
                      style={{
                        color: "rgba(255,255,255,0.94)",
                        fontFamily: "var(--app-display)",
                      }}
                    >
                      {name}
                    </p>
                  </div>

                  {/* Gold bottom bar on hover */}
                  <div
                    className="absolute bottom-0 left-0 h-[2.5px] w-0 group-hover:w-full"
                    style={{
                      background: "var(--gold-500)",
                      transition: "width 0.26s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 text-center text-sm" style={{ color: "var(--ink-light)" }}>
          Don&apos;t see your destination? <span style={{ color: "var(--navy-600)", fontWeight: 600 }}>Contact us</span> and we may still be able to assist.
        </p>
      </Container>
    </section>
  );
}
