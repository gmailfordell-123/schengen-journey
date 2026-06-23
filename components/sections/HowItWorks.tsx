"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { steps } from "@/lib/home-content";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad section-subtle">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="Eight steps to your Schengen visa"
          subtitle="A clear, structured process from first enquiry to your appointment confirmation and beyond."
          data-aos="fade-up"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              data-aos="fade-up"
              data-aos-delay={i * 70}
              className="relative"
            >
              <div className="card p-6 h-full hover:shadow-[var(--shadow-md)] transition-shadow duration-300">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold text-white"
                    style={{ background: "var(--navy-700)" }}
                  >
                    {step.number}
                  </div>
                  {/* Connector (desktop only, last item excluded) */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block flex-1 h-px"
                      style={{ background: "var(--navy-100)" }} />
                  )}
                </div>

                <h3
                  className="text-base font-semibold mb-2"
                  style={{ color: "var(--ink)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA under steps */}
        <motion.div
          data-aos="fade-up"
          className="mt-12 text-center"
        >
          <a
            href="/register"
            className="btn btn-navy inline-flex px-8 py-3.5 text-[0.9375rem]"
          >
            Start Your Application
          </a>
          <p className="mt-3 text-sm" style={{ color: "var(--ink-light)" }}>
            No commitment required · Takes less than 5 minutes
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
