"use client";

import { motion } from "framer-motion";
import { Target, ClipboardList, CalendarClock, Wallet, LayoutDashboard, Headset } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reasons } from "@/lib/home-content";

const trustPoints = [
  {
    Icon: Target,
    title: "Specialised for UK & Ireland",
    description:
      "We focus exclusively on Schengen visa applications from the United Kingdom and Ireland. Our knowledge of VFS Global, TLScontact, and consulate requirements in both countries is deep and current.",
  },
  {
    Icon: ClipboardList,
    title: "Professional Document Guidance",
    description:
      "Our team reviews every document in your application pack. We catch issues before your appointment so you arrive with a complete, well-prepared submission.",
  },
  {
    Icon: CalendarClock,
    title: "Appointment-First Approach",
    description:
      "Securing the right appointment at the right time is the foundation of your visa journey. We prioritise getting you booked in quickly and at the most convenient location.",
  },
  {
    Icon: Wallet,
    title: "Transparent, Clear Pricing",
    description:
      "No hidden fees, no subscriptions, no surprises. Our packages are one-time payments with clearly listed features, available in GBP for UK and EUR for Ireland.",
  },
  {
    Icon: LayoutDashboard,
    title: "Real-Time Tracking Dashboard",
    description:
      "Your client portal gives you live visibility of your application status, document checklist, appointment details, and notes from our team at every stage.",
  },
  {
    Icon: Headset,
    title: "Dedicated Client Support",
    description:
      "You are never left in the dark. Our UK and Ireland support team is available to answer your questions and guide you through any complications throughout the process.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="section-pad section-subtle">
      <Container>
        {/* Stats row */}
        <div
          className="mb-16 grid grid-cols-2 gap-4 rounded-2xl p-8 sm:grid-cols-4"
          style={{
            background: "var(--navy-900)",
          }}
          data-aos="fade-up"
        >
          {reasons.map((reason) => (
            <div key={reason.label} className="text-center px-4 py-2">
              <p
                className="text-3xl font-semibold sm:text-4xl"
                style={{ color: "var(--gold-500)" }}
              >
                {reason.stat}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {reason.label}
              </p>
              <p
                className="mt-1 text-xs leading-relaxed"
                style={{ color: "rgba(240,244,255,0.50)" }}
              >
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        <SectionHeading
          eyebrow="Why Choose Us"
          title="Trusted by UK & Ireland applicants"
          subtitle="We have built our reputation on professionalism, accuracy, and genuine support throughout the Schengen visa process."
          data-aos="fade-up"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trustPoints.map((point, i) => (
            <motion.div
              key={point.title}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="card p-7 hover:shadow-[var(--shadow-md)] transition-shadow duration-300"
            >
              <div
                className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  background: "var(--navy-50)",
                  border: "1px solid var(--navy-100)",
                }}
              >
                <point.Icon size={20} style={{ color: "var(--navy-600)" }} />
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "var(--ink)" }}
              >
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
