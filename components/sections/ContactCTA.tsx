"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Meteors } from "@/components/ui/Meteors";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { BlurFade } from "@/components/ui/BlurFade";

export function ContactCTA() {
  return (
    <section id="contact" className="section-pad section-light">
      <Container>
        <BlurFade delay={0.05}>
          <motion.div
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl px-8 py-20 text-center sm:px-16 lg:py-24"
            style={{
              background: `linear-gradient(135deg, var(--navy-900) 0%, var(--navy-700) 100%)`,
            }}
          >
            {/* Shooting stars */}
            <Meteors number={14} />

            {/* Animated border */}
            <BorderBeam duration={7} colorFrom="#c9a84c" colorTo="#4070cc" />

            {/* Glow orbs */}
            <div
              className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, var(--gold-500) 0%, transparent 70%)" }}
            />
            <div
              className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full opacity-10"
              style={{ background: "var(--navy-500)", filter: "blur(40px)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-10 left-10 h-32 w-32 rounded-full opacity-10"
              style={{ background: "var(--gold-500)", filter: "blur(30px)" }}
            />

            {/* Eyebrow */}
            <div className="relative mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 rounded" style={{ background: "var(--gold-500)", opacity: 0.7 }} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--gold-500)" }}>
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

            {/* CTAs */}
            <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/book"
                className="btn btn-gold relative overflow-hidden px-8 py-3.5 text-[0.9375rem] group"
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
                  style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.30),transparent)" }}
                />
                <span className="relative z-10">Book Appointment</span>
              </Link>
              <Link
                href="/register"
                className="btn btn-outline-white relative overflow-hidden px-8 py-3.5 text-[0.9375rem] group"
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
                  style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)", animationDelay: "0.6s" }}
                />
                <span className="relative z-10">Create Free Account</span>
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
        </BlurFade>
      </Container>
    </section>
  );
}
