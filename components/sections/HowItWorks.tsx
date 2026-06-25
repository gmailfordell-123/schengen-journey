"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlurFade } from "@/components/ui/BlurFade";
import { steps } from "@/lib/home-content";

export function HowItWorks() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="how-it-works" className="section-pad section-subtle">
      <Container>
        <BlurFade delay={0.05}>
          <SectionHeading
            light
            eyebrow="How It Works"
            title="Eight steps to your Schengen visa"
            subtitle="A clear, structured process from first enquiry to your appointment confirmation and beyond."
          />
        </BlurFade>

        <div className="mx-auto mt-12 max-w-3xl space-y-2.5">
          {steps.map((step, i) => {
            const isOpen = open === i;
            return (
              <div
                key={step.number}
                className="overflow-hidden rounded-xl transition-all duration-200"
                style={{
                  background: isOpen ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isOpen ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.10)"}`,
                  boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.25)" : "none",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                >
                  {/* Step number */}
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold text-white transition-transform"
                    style={{ background: isOpen ? "var(--navy-600)" : "var(--navy-700)" }}
                  >
                    {step.number}
                  </span>

                  {/* Title */}
                  <span
                    className="min-w-0 flex-1 text-[0.9375rem] font-semibold leading-snug sm:text-base"
                    style={{ color: isOpen ? "#fff" : "rgba(240,244,255,0.82)" }}
                  >
                    {step.title}
                  </span>

                  {/* Chevron */}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center"
                    style={{ color: isOpen ? "var(--gold-500)" : "rgba(255,255,255,0.40)" }}
                  >
                    <ChevronDown size={18} strokeWidth={2} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p
                        className="px-4 pb-5 text-sm leading-relaxed sm:px-5 sm:pl-[4.25rem]"
                        style={{ color: "rgba(240,244,255,0.60)" }}
                      >
                        {step.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <BlurFade delay={0.2} className="mt-12 text-center">
          <Link href="/register" className="btn btn-navy inline-flex px-8 py-3.5 text-[0.9375rem] relative overflow-hidden group">
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }}
            />
            <span className="relative z-10">Start Your Application</span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: "rgba(240,244,255,0.50)" }}>
            No commitment required · Takes less than 5 minutes
          </p>
        </BlurFade>
      </Container>
    </section>
  );
}
