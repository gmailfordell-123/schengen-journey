"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SelectableCard } from "@/components/flow/SelectableCard";
import { StepIndicator } from "@/components/flow/StepIndicator";
import {
  citiesByOrigin,
  destinationsByCity,
  getCity,
  getOrigin,
  origins,
  type OriginId,
} from "@/lib/flow-data";

const STEPS = ["Departure", "City", "Destinations"];

const variants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -64 : 64, opacity: 0 }),
};

export function PlanFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [origin, setOrigin] = useState<OriginId | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<string[]>([]);

  const cities = origin ? citiesByOrigin[origin] : [];
  const availableDestinations = useMemo(
    () => (city ? destinationsByCity[city] ?? [] : []),
    [city]
  );

  const originData = getOrigin(origin);
  const cityData = getCity(origin, city);

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const selectOrigin = (id: OriginId) => {
    if (id !== origin) {
      setCity(null);
      setDestinations([]);
    }
    setOrigin(id);
    go(1);
  };

  const selectCity = (id: string) => {
    if (id !== city) setDestinations([]);
    setCity(id);
    go(2);
  };

  const toggleDestination = (id: string) => {
    setDestinations((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setOrigin(null);
    setCity(null);
    setDestinations([]);
    go(0);
  };

  const selectedDestinationData = useMemo(
    () => availableDestinations.filter((d) => destinations.includes(d.id)),
    [availableDestinations, destinations]
  );

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <Container className="max-w-3xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Plan your journey
          </h1>
          <p className="mt-3 text-slate-600">
            A few quick questions to map your route into the Schengen area.
          </p>
        </div>

        <div className="mt-10">
          <StepIndicator steps={STEPS} current={step} />
        </div>

        <div className="relative mt-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 0 — Departure country */}
            {step === 0 && (
              <motion.div
                key="origin"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <StepCard
                  title="Where are you flying from?"
                  subtitle="Choose your departure country."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {origins.map((o) => (
                      <SelectableCard
                        key={o.id}
                        icon={<MapPin size={22} />}
                        title={o.name}
                        subtitle={o.description}
                        selected={origin === o.id}
                        onClick={() => selectOrigin(o.id)}
                      />
                    ))}
                  </div>
                </StepCard>
              </motion.div>
            )}

            {/* STEP 1 — Departure city (conditional) */}
            {step === 1 && (
              <motion.div
                key="city"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <StepCard
                  title={`Which ${originData?.name} airport?`}
                  subtitle={
                    origin === "ireland"
                      ? "Dublin is the available departure city."
                      : "Choose your departure city."
                  }
                  onBack={() => go(0)}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {cities.map((c) => (
                      <SelectableCard
                        key={c.id}
                        icon={<MapPin size={22} />}
                        title={c.name}
                        selected={city === c.id}
                        onClick={() => selectCity(c.id)}
                      />
                    ))}
                  </div>
                </StepCard>
              </motion.div>
            )}

            {/* STEP 2 — Destinations (conditional on city) */}
            {step === 2 && (
              <motion.div
                key="destinations"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <StepCard
                  title={`Where to from ${cityData?.name}?`}
                  subtitle={`${availableDestinations.length} Schengen destinations available. Pick one or more.`}
                  onBack={() => go(1)}
                >
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {availableDestinations.map((d) => (
                      <SelectableCard
                        key={d.id}
                        icon={<MapPin size={20} />}
                        title={d.name}
                        selected={destinations.includes(d.id)}
                        onClick={() => toggleDestination(d.id)}
                      />
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                      {destinations.length} selected
                    </p>
                    <motion.button
                      type="button"
                      disabled={destinations.length === 0}
                      onClick={() => go(3)}
                      whileHover={
                        destinations.length ? { scale: 1.04 } : undefined
                      }
                      whileTap={destinations.length ? { scale: 0.97 } : undefined}
                      className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Continue
                    </motion.button>
                  </div>
                </StepCard>
              </motion.div>
            )}

            {/* STEP 3 — Summary */}
            {step === 3 && (
              <motion.div
                key="summary"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <StepCard
                  title="Your journey is mapped"
                  subtitle="Here's a summary of your route."
                  onBack={() => go(2)}
                >
                  <dl className="space-y-4">
                    <SummaryRow
                      label="Flying from"
                      value={`${cityData?.name}, ${originData?.name}`}
                    />
                    <div>
                      <dt className="text-sm font-medium text-slate-500">
                        Destinations
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {selectedDestinationData.map((d) => (
                          <motion.span
                            key={d.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700"
                          >
                            <MapPin size={13} aria-hidden />
                            {d.name}
                          </motion.span>
                        ))}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/register"
                      className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                    >
                      Start my application
                    </Link>
                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Plan another trip
                    </button>
                  </div>
                </StepCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}

function StepCard({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        )}
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
