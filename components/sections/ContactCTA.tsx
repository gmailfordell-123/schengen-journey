"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function ContactCTA() {
  return (
    <section id="contact" className="section-pad section-light">
      <Container>
        <motion.div
          data-aos="fade-up"
          className="relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-16"
          style={{
            background: `linear-gradient(135deg, var(--navy-900) 0%, var(--navy-700) 100%)`,
          }}
        >
          {/* Decorative elements */}
          <div
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, var(--gold-500) 0%, transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full opacity-10"
            style={{ background: "var(--navy-500)", filter: "blur(40px)" }}
          />

          {/* Eyebrow */}
          <div className="relative mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 rounded" style={{ background: "var(--gold-500)", opacity: 0.7 }} />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--gold-500)" }}
            >
              Ready to Get Started?
            </span>
            <span className="h-px w-8 rounded" style={{ background: "var(--gold-500)", opacity: 0.7 }} />
          </div>

          <h2 className="text-h2 relative mx-auto max-w-2xl text-white">
            Start your Schengen visa journey
            <br />
            <span style={{ color: "var(--gold-400)" }}>with expert support today</span>
          </h2>
          <p
            className="text-subhead relative mx-auto mt-5 max-w-xl"
            style={{ color: "rgba(240,244,255,0.65)" }}
          >
            Book your appointment support, select your package, and let our team
            handle the complexity — so you can focus on planning your trip.
          </p>

          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/book" className="btn btn-gold px-8 py-3.5 text-[0.9375rem]">
              Book Appointment
            </Link>
            <Link href="/register" className="btn btn-outline-white px-8 py-3.5 text-[0.9375rem]">
              Create Free Account
            </Link>
          </div>

          {/* Trust note */}
          <p
            className="relative mt-8 text-sm"
            style={{ color: "rgba(240,244,255,0.40)" }}
          >
            No hidden fees · UK &amp; Ireland applicants · All Schengen destinations
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
