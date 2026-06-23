"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Region = "uk" | "ireland";

const destinations: Record<Region, string[]> = {
  uk: [
    "France", "Germany", "Spain", "Italy", "Netherlands", "Belgium", "Austria",
    "Portugal", "Switzerland", "Greece", "Sweden", "Norway", "Denmark", "Poland",
    "Czech Republic", "Hungary", "Slovakia", "Slovenia", "Croatia", "Finland",
    "Luxembourg", "Malta", "Iceland", "Liechtenstein",
  ],
  ireland: [
    "France", "Germany", "Spain", "Italy", "Netherlands", "Belgium", "Austria",
    "Portugal", "Greece", "Sweden", "Switzerland", "Denmark", "Poland",
    "Czech Republic", "Hungary", "Finland", "Norway", "Malta",
  ],
};

export function Destinations() {
  const [region, setRegion] = useState<Region>("uk");

  return (
    <section id="destinations" className="section-pad section-light">
      <Container>
        <SectionHeading
          eyebrow="Supported Destinations"
          title="All 27 Schengen states covered"
          subtitle="Whether you are travelling for tourism, business, family visits, or study, we support Schengen visa applications to every member state."
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {destinations[region].map((name) => (
              <div
                key={name}
                className="flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium transition-shadow duration-200 hover:shadow-[var(--shadow-sm)]"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--ink)",
                }}
              >
                <MapPin size={15} style={{ color: "var(--navy-500)" }} />
                {name}
              </div>
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
