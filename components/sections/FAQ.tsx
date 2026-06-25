"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/home-content";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad section-subtle">
      <Container>
        <SectionHeading
          light
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know"
          subtitle="Detailed answers about Schengen visa appointments, documents, insurance, and our services for UK and Ireland applicants."
          data-aos="fade-up"
        />

        <div className="mx-auto mt-12 max-w-3xl space-y-2.5" data-gsap-stagger="0.06">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
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
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span
                    className="text-sm font-medium leading-snug"
                    style={{ color: isOpen ? "#fff" : "rgba(240,244,255,0.82)" }}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-sm"
                    style={{
                      color: isOpen ? "var(--gold-500)" : "rgba(255,255,255,0.40)",
                    }}
                  >
                    <ChevronDown size={18} strokeWidth={2} />
                  </motion.div>
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
                      <motion.p
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -4, opacity: 0 }}
                        transition={{ duration: 0.24, delay: 0.05 }}
                        className="px-6 pb-5 text-sm leading-relaxed"
                        style={{ color: "rgba(240,244,255,0.60)" }}
                      >
                        {faq.answer}
                      </motion.p>
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
