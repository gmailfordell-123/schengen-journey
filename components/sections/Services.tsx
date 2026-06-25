"use client";

import { useState } from "react";
import {
  CalendarClock, PenLine, ClipboardList, Mail,
  ShieldCheck, Plane, BedDouble, Search, Headset,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlurFade } from "@/components/ui/BlurFade";
import { services, type ServiceIcon } from "@/lib/home-content";

const SERVICE_ICONS: Record<
  ServiceIcon,
  React.ComponentType<{ size?: number | string; style?: React.CSSProperties }>
> = {
  scheduling:     CalendarClock,
  form:           PenLine,
  checklist:      ClipboardList,
  "cover-letter": Mail,
  insurance:      ShieldCheck,
  flight:         Plane,
  hotel:          BedDouble,
  tracking:       Search,
  support:        Headset,
};

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Appointments: { bg: "rgba(30,58,138,0.08)",  text: "var(--navy-700)" },
  Documentation:{ bg: "rgba(30,58,138,0.08)",  text: "var(--navy-700)" },
  Insurance:    { bg: "rgba(14,100,60,0.08)",  text: "#0a6640"          },
  Reservations: { bg: "rgba(120,60,0,0.07)",   text: "#7c4400"          },
  Tracking:     { bg: "rgba(30,58,138,0.08)",  text: "var(--navy-700)" },
  Support:      { bg: "rgba(120,0,100,0.07)",  text: "#7a0060"          },
};

export function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="services"
      className="section-pad"
      style={{ background: "#f0f2f7" }}
    >
      <Container>
        <BlurFade delay={0.05}>
          <SectionHeading
            eyebrow="Our Services"
            title="Everything you need for a successful Schengen application"
            subtitle="From appointment scheduling and documentation to real-time tracking, we manage every aspect of your Schengen visa journey."
          />
        </BlurFade>

        <div className="mx-auto mt-12 max-w-3xl space-y-2.5">
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[service.icon];
            const tagColor = TAG_COLORS[service.tag] ?? TAG_COLORS["Appointments"];
            const isOpen = open === i;

            return (
              <BlurFade key={service.title} delay={0.04 + i * 0.04} yOffset={16}>
                <div
                  className="overflow-hidden rounded-xl bg-white transition-all duration-200"
                  style={{
                    border: `1px solid ${isOpen ? "rgba(30,58,138,0.28)" : "rgba(0,0,0,0.07)"}`,
                    boxShadow: isOpen
                      ? "0 10px 30px rgba(4,12,26,0.10)"
                      : "0 1px 3px rgba(4,12,26,0.05)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                  >
                    {/* Icon */}
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors"
                      style={{
                        background: isOpen ? "var(--navy-600)" : "var(--navy-50)",
                        border: `1px solid ${isOpen ? "var(--navy-600)" : "var(--navy-100)"}`,
                      }}
                    >
                      <Icon size={20} style={{ color: isOpen ? "#fff" : "var(--navy-600)" }} />
                    </span>

                    {/* Title */}
                    <h3
                      className="min-w-0 flex-1 text-[0.9375rem] font-semibold leading-snug sm:text-base"
                      style={{ color: "var(--ink)", fontFamily: "var(--app-display)" }}
                    >
                      {service.title}
                    </h3>

                    {/* Tag — desktop only */}
                    <span
                      className="hidden shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide sm:inline-block"
                      style={{ background: tagColor.bg, color: tagColor.text }}
                    >
                      {service.tag}
                    </span>

                    {/* Chevron */}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                      className="flex h-6 w-6 shrink-0 items-center justify-center"
                      style={{ color: isOpen ? "var(--navy-600)" : "var(--ink-light)" }}
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
                        <div className="px-4 pb-5 sm:px-5 sm:pl-[4.75rem]">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--navy-600)" }}
                          >
                            {service.subtitle}
                          </p>
                          <p
                            className="mt-2 text-sm leading-relaxed"
                            style={{ color: "var(--ink-muted)" }}
                          >
                            {service.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
