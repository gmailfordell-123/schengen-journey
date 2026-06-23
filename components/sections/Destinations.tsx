"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Region = "uk" | "ireland";

const destinations: Record<Region, string[]> = {
  uk: [
    "France", "Netherlands", "Italy", "Greece", "Hungary", "Austria",
    "Switzerland", "Denmark", "Iceland", "Finland",
  ],
  ireland: [
    "Netherlands", "Austria", "Italy", "Switzerland", "Belgium", "Croatia",
    "Denmark", "Hungary", "Finland", "Slovenia", "Norway", "Sweden", "Iceland",
  ],
};

export function Destinations() {
  const [region, setRegion] = useState<Region>("uk");

  return (
    <section id="destinations" className="section-pad section-light">
      <Container>
        <SectionHeading
          eyebrow="Supported Destinations"
          title="Premium Schengen destinations"
          subtitle="We specialize in streamlined visa applications to top European destinations. Select your origin country to see the destinations we support."
          data-aos="fade-up"
        />

        {/* Toggle */}
        <div className="mt-10 flex justify-center" data-aos="fade-up">
          <div
            className="inline-flex rounded-full p-1"
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border)",
            }}
          >
            {(["uk", "ireland"] as Region[]).map((r) => {
              const active = region === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className="relative rounded-full px-5 py-2 text-sm font-medium transition-colors"
                  style={{ color: active ? "#fff" : "var(--ink-muted)" }}
                >
                  {active && (
                    <motion.span
                      layoutId="dest-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--navy-700)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {r === "uk" ? "United Kingdom" : "Ireland"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Country grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-14 flex flex-wrap justify-center gap-3"
          >
            {destinations[region].map((name, idx) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
                className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--ink)",
                }}
              >
                <MapPin size={16} style={{ color: "var(--navy-600)" }} />
                <span>{name}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p
          className="mt-8 text-center text-sm"
          style={{ color: "var(--ink-light)" }}
        >
          Don&apos;t see your destination? Contact us — we may still be able to assist.
        </p>
      </Container>
    </section>
  );
}
