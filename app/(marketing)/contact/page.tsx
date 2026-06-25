"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { PremiumPageShell } from "@/components/layout/PremiumPageShell";
import { BlurFade } from "@/components/ui/BlurFade";
import { AnimatedGradientText } from "@/components/ui/AnimatedGradientText";
import { Meteors } from "@/components/ui/Meteors";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";


const infoCards = [
  { Icon: Mail,   label: "Email",    value: "hello@schengenjourney.com" },
  { Icon: Phone,  label: "Phone",    value: "+44 20 0000 0000" },
  { Icon: MapPin, label: "Based in", value: "United Kingdom & Ireland" },
];

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.2 + i * 0.08, duration: 0.45, ease: EASE_PREMIUM },
  }),
};

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <PremiumPageShell>
      {/* Hero strip */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Meteors number={12} />
        <Container className="py-20">
          <BlurFade delay={0.05} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              <AnimatedGradientText>Get in touch</AnimatedGradientText>
            </p>
            <h1 className="text-h1 text-white">Contact us</h1>
            <p className="text-subhead mt-4 mx-auto max-w-lg" style={{ color: "rgba(240,244,255,0.65)" }}>
              Have a question about your Schengen application? Our UK &amp; Ireland team will get back to you within 24 hours.
            </p>
          </BlurFade>
        </Container>
      </div>

      <Container className="py-16">
        <div className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-[1fr_2fr]">

          {/* Info cards */}
          <div className="space-y-4">
            {infoCards.map((card, i) => (
              <BlurFade key={card.label} delay={0.1 + i * 0.1}>
                <div
                  className="flex items-start gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)" }}
                  >
                    <card.Icon size={18} style={{ color: "var(--gold-500)" }} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "rgba(240,244,255,0.40)" }}>
                      {card.label}
                    </p>
                    <p className="text-sm font-medium text-white">{card.value}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

          {/* Contact form */}
          <BlurFade delay={0.15}>
            <div className="relative rounded-3xl bg-white p-8 shadow-2xl overflow-hidden">
              <BorderBeam duration={10} />

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <CheckCircle2 size={56} style={{ color: "var(--navy-600)" }} />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-slate-900">Message sent!</h2>
                  <p className="text-sm text-slate-500">We&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-2 text-sm font-medium transition-colors hover:opacity-70"
                    style={{ color: "var(--navy-600)" }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.h2
                    variants={fieldVariants} custom={0} initial="hidden" animate="show"
                    className="text-xl font-semibold text-slate-900 mb-6"
                  >
                    Send us a message
                  </motion.h2>

                  {[
                    { id: "name",  label: "Full name", type: "text",  placeholder: "Your full name" },
                    { id: "email", label: "Email",     type: "email", placeholder: "you@example.com" },
                  ].map((field, i) => (
                    <motion.div key={field.id} variants={fieldVariants} custom={i + 1} initial="hidden" animate="show">
                      <label htmlFor={field.id} className="block text-sm font-medium text-slate-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        id={field.id} name={field.id} type={field.type}
                        placeholder={field.placeholder} required
                        className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </motion.div>
                  ))}

                  <motion.div variants={fieldVariants} custom={3} initial="hidden" animate="show">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message" name="message" rows={5} required
                      placeholder="How can we help you?"
                      className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none resize-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </motion.div>

                  <motion.button
                    variants={fieldVariants} custom={4} initial="hidden" animate="show"
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="relative w-full overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold text-white flex items-center justify-center gap-2"
                    style={{ background: "var(--navy-700)" }}
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
                      style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }} />
                    <Send size={15} />
                    <span className="relative z-10">Send message</span>
                  </motion.button>
                </form>
              )}
            </div>
          </BlurFade>
        </div>
      </Container>
    </PremiumPageShell>
  );
}
