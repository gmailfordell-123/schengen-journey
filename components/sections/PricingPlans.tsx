"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatPrice, plans, regions, type Region } from "@/lib/pricing";

export function PricingPlans() {
  const [region, setRegion] = useState<Region>("uk");
  const [selected, setSelected] = useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === selected) ?? null;

  return (
    <section className="section-pad section-subtle">
      <Container>
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow eyebrow-navy mb-4" style={{ color: "var(--gold-500)" }}>
            <span className="h-px w-6 inline-block rounded align-middle mr-3" style={{ background: "var(--gold-500)" }} />
            Transparent Pricing
            <span className="h-px w-6 inline-block rounded align-middle ml-3" style={{ background: "var(--gold-500)" }} />
          </p>
          <h1
            className="text-h1"
            style={{ color: "var(--ink)" }}
          >
            Choose your journey plan
          </h1>
          <p className="text-subhead mt-4" style={{ color: "var(--ink-muted)" }}>
            One-time fees. No subscriptions. No hidden charges.
            Prices shown in your region&apos;s currency.
          </p>
        </div>

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
          {plans.map((plan) => {
            const isSelected = selected === plan.id;
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.id}
                layout
                onClick={() => setSelected(plan.id)}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className={`relative flex cursor-pointer flex-col rounded-2xl p-8 transition-shadow duration-300 ${
                  isPopular ? "lg:-mt-4" : ""
                }`}
                style={{
                  background: isPopular ? "var(--navy-900)" : "var(--bg)",
                  border: isSelected
                    ? "2px solid var(--navy-600)"
                    : isPopular
                      ? "2px solid rgba(201,168,76,0.40)"
                      : "1px solid var(--border)",
                  boxShadow: isSelected
                    ? "var(--shadow-lg)"
                    : isPopular
                      ? "var(--shadow-lg)"
                      : "var(--shadow-sm)",
                }}
              >
                {/* Popular badge */}
                {isPopular && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold"
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
                      style={{ background: "var(--navy-600)" }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>

                <h3
                  className="text-xl font-semibold"
                  style={{ color: isPopular ? "#fff" : "var(--ink)" }}
                >
                  {plan.name}
                </h3>
                <p
                  className="mt-1 text-sm"
                  style={{ color: isPopular ? "rgba(240,244,255,0.55)" : "var(--ink-light)" }}
                >
                  {plan.tagline}
                </p>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={region + plan.id}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-5xl font-semibold tracking-tight"
                      style={{ color: isPopular ? "var(--gold-500)" : "var(--ink)" }}
                    >
                      {formatPrice(plan.price[region], region)}
                    </motion.span>
                  </AnimatePresence>
                  <span
                    className="text-sm"
                    style={{ color: isPopular ? "rgba(240,244,255,0.45)" : "var(--ink-light)" }}
                  >
                    one-time
                  </span>
                </div>

                {/* Divider */}
                <div
                  className="my-7 h-px"
                  style={{
                    background: isPopular
                      ? "rgba(255,255,255,0.08)"
                      : "var(--border)",
                  }}
                />

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: isPopular ? "rgba(240,244,255,0.75)" : "var(--ink-muted)" }}
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: isPopular
                            ? "rgba(201,168,76,0.15)"
                            : "var(--navy-50)",
                          color: isPopular ? "var(--gold-400)" : "var(--navy-600)",
                          border: isPopular
                            ? "1px solid rgba(201,168,76,0.25)"
                            : "none",
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
                  className="btn mt-8 w-full py-3 text-sm"
                  style={
                    isSelected || isPopular
                      ? { background: "var(--gold-500)", color: "var(--navy-900)", borderRadius: "9999px" }
                      : {
                          background: "transparent",
                          color: "var(--navy-600)",
                          border: "1.5px solid var(--navy-200)",
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
