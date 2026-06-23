"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  PenLine,
  ClipboardList,
  Mail,
  ShieldCheck,
  Plane,
  BedDouble,
  Search,
  Headset,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services, type ServiceIcon } from "@/lib/home-content";

const SERVICE_ICONS: Record<
  ServiceIcon,
  React.ComponentType<{ size?: number | string; style?: React.CSSProperties }>
> = {
  scheduling: CalendarClock,
  form: PenLine,
  checklist: ClipboardList,
  "cover-letter": Mail,
  insurance: ShieldCheck,
  flight: Plane,
  hotel: BedDouble,
  tracking: Search,
  support: Headset,
};

export function Services() {
  return (
    <section id="services" className="section-pad section-light">
      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Everything you need for a successful Schengen application"
          subtitle="From appointment scheduling to document preparation, we cover every aspect of your Schengen visa journey from the UK and Ireland."
          data-aos="fade-up"
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[service.icon];
            return (
            <motion.div
              key={service.title}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="card p-7 hover:shadow-[var(--shadow-md)] transition-shadow duration-300"
            >
              {/* Icon */}
              <div
                className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: "var(--navy-50)",
                  border: "1px solid var(--navy-100)",
                }}
              >
                <Icon size={22} style={{ color: "var(--navy-600)" }} />
              </div>

              <h3
                className="text-base font-semibold mb-2.5"
                style={{ color: "var(--ink)" }}
              >
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                {service.description}
              </p>

              {/* Bottom accent */}
              <div
                className="mt-6 h-0.5 w-8 rounded-full"
                style={{ background: "var(--gold-500)", opacity: 0.6 }}
              />
            </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
