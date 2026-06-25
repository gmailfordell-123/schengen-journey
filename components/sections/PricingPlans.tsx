"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BlurFade } from "@/components/ui/BlurFade";
import { Meteors } from "@/components/ui/Meteors";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { AnimatedGradientText } from "@/components/ui/AnimatedGradientText";
import { formatPrice, plans, regions, type Region } from "@/lib/pricing";

export function PricingPlans() {
  const [region, setRegion] = useState<Region>("uk");
  const [selected, setSelected] = useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === selected) ?? null;

  return (
    <section className="section-pad section-subtle relative overflow-hidden">
      <Meteors number={14} />
      <Container>
        {/* Heading */}
        <BlurFade delay={0.05}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow eyebrow-navy mb-4">
              <span className="h-px w-6 inline-block rounded align-middle mr-3" style={{ background: "var(--gold-500)" }} />
              <AnimatedGradientText>Transparent Pricing</AnimatedGradientText>
              <span className="h-px w-6 inline-block rounded align-middle ml-3" style={{ background: "var(--gold-500)" }} />
            </p>
            <h1 className="text-h1 text-white">
              Choose your journey plan
            </h1>
            <p className="text-subhead mt-4" style={{ color: "rgba(240,244,255,0.65)" }}>
              One-time fees. No subscriptions. No hidden charges.
              Prices shown in your region&apos;s currency.
            </p>
          </div>
        </BlurFade>

        {/* Region toggle */}
        <div className="mt-10 flex justify-center">
          <div
            className="inline-flex rounded-full p-1"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          >
            {regions.map((r) => {
              const active = region === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRegion(r.id)}
                  aria-pressed={active}
                  className="relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
                  style={{ color: active ? "#fff" : "var(--ink-muted)" }}
                >
                  {active && (
                    <motion.span
                      layoutId="region-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--navy-700)" }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {r.label}
                    <span className="opacity-60">({r.code})</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Plan cards */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3 lg:items-start">
          {plans.map((plan, i) => {
            const isSelected = selected === plan.id;
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.id}
                layout
                custom={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelected(plan.id)}
                whileHover={{ y: -7 }}
                className={`relative flex cursor-pointer flex-col rounded-2xl p-8 ${isPopular ? "glass-pricing-popular glass-gold-pulse lg:-mt-4" : ""}`}
                style={!isPopular ? {
                  background: isSelected
                    ? "linear-gradient(160deg, #152544 0%, #0c1a36 100%)"
                    : "linear-gradient(160deg, #0f1d3a 0%, #091525 100%)",
                  border: isSelected
                    ? "2px solid rgba(64,112,204,0.55)"
                    : "1px solid rgba(255,255,255,0.09)",
                  boxShadow: isSelected
                    ? "0 0 0 3px rgba(30,58,138,0.18), 0 20px 52px rgba(4,12,26,0.55), inset 0 1px 0 rgba(255,255,255,0.10)"
                    : "0 8px 32px rgba(4,12,26,0.44), inset 0 1px 0 rgba(255,255,255,0.07)",
                  transition: "box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
                } : undefined}
              >
                {/* Animated border on popular card */}
                {isPopular && <BorderBeam duration={6} colorFrom="#c9a84c" colorTo="#4070cc" />}

                {/* Popular badge */}
                {isPopular && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide"
                    style={{
                      background: "var(--gold-500)",
                      color: "var(--navy-900)",
                    }}
                  >
                    <Star size={12} style={{ fill: "var(--navy-900)" }} /> Recommended
                  </span>
                )}

                {/* Selected check */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      className="absolute right-6 top-6 flex h-7 w-7 items-center justify-center rounded-full text-white"
                      style={{ background: "var(--navy-500)" }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Plan name */}
                <h3
                  className="text-[1.5rem] font-bold leading-tight"
                  style={{
                    color: "rgba(240,244,255,0.96)",
                    fontFamily: "var(--app-display)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "rgba(200,218,255,0.48)" }}
                >
                  {plan.tagline}
                </p>

                {/* Price */}
                <div className="mt-7 flex items-baseline gap-2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={region + plan.id}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-black tracking-tight"
                      style={{
                        fontSize: "clamp(2.8rem, 5vw, 3.5rem)",
                        color: isPopular ? "var(--gold-500)" : "rgba(255,255,255,0.97)",
                        fontFamily: "var(--app-display)",
                        lineHeight: 1,
                      }}
                    >
                      {formatPrice(plan.price[region], region)}
                    </motion.span>
                  </AnimatePresence>
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "rgba(200,218,255,0.35)" }}
                  >
                    one-time
                  </span>
                </div>

                {/* Divider */}
                <div
                  className="my-7 h-px"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />

                {/* Features */}
                <ul className="space-y-3.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-[0.9rem] font-medium"
                      style={{ color: "rgba(210,226,255,0.72)" }}
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: "rgba(201,168,76,0.13)",
                          color: "var(--gold-400)",
                          border: "1px solid rgba(201,168,76,0.22)",
                        }}
                      >
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(plan.id);
                  }}
                  className="btn mt-8 w-full py-3.5 text-sm font-bold tracking-wide"
                  style={
                    isSelected || isPopular
                      ? {
                          background: "var(--gold-500)",
                          color: "var(--navy-900)",
                          borderRadius: "9999px",
                          boxShadow: "0 4px 20px rgba(201,168,76,0.35)",
                        }
                      : {
                          background: "rgba(255,255,255,0.07)",
                          color: "rgba(210,228,255,0.80)",
                          border: "1.5px solid rgba(255,255,255,0.12)",
                          borderRadius: "9999px",
                        }
                  }
                >
                  {isSelected ? "Selected" : "Select Plan"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </Container>

      {/* Sticky summary */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50"
            style={{
              background: "rgba(255,255,255,0.95)",
              borderTop: "1px solid var(--border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Container className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-sm" style={{ color: "var(--ink-light)" }}>Selected plan</p>
                <p className="font-semibold" style={{ color: "var(--ink)" }}>
                  {selectedPlan.name} —{" "}
                  <span style={{ color: "var(--navy-600)" }}>
                    {formatPrice(selectedPlan.price[region], region)}
                  </span>{" "}
                  <span className="text-sm font-normal" style={{ color: "var(--ink-light)" }}>
                    one-time
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--ink-light)" }}
                >
                  Clear
                </button>
                <Link
                  href="/register"
                  className="btn btn-navy rounded-full px-6 py-2.5 text-sm"
                >
                  Continue with {selectedPlan.name}
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
