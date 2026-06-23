"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/home-content";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad section-subtle">
      <Container>
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know"
          subtitle="Detailed answers about Schengen visa appointments, documents, insurance, and our services for UK and Ireland applicants."
          data-aos="fade-up"
        />

        <div className="mx-auto mt-12 max-w-3xl space-y-2.5" data-aos="fade-up">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl transition-shadow duration-200"
                style={{
                  background: "var(--bg)",
                  border: `1px solid ${isOpen ? "var(--navy-200)" : "var(--border)"}`,
                  boxShadow: isOpen ? "var(--shadow-sm)" : "none",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span
                    className="text-sm font-medium leading-snug"
                    style={{ color: "var(--ink)" }}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      background: isOpen ? "var(--navy-600)" : "var(--bg-subtle)",
                      color: isOpen ? "#fff" : "var(--ink-light)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    +
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                    >
                      <p
                        className="px-6 pb-5 text-sm leading-relaxed"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
