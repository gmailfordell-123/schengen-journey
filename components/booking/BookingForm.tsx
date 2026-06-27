"use client";

import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Building2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Lock,
  Plane,
  Briefcase,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SuccessAnimation, LoadingDots } from "@/components/ui/SuccessAnimation";
import { Container } from "@/components/ui/Container";
import { PremiumPageShell } from "@/components/layout/PremiumPageShell";
import { SelectableCard } from "@/components/flow/SelectableCard";
import { StepIndicator } from "@/components/flow/StepIndicator";
import { submitBooking } from "@/lib/actions/booking";
import {
  origins,
  citiesByOrigin,
  destinationsByOrigin,
  getOrigin,
  getCity,
  getDestination,
  type OriginId,
} from "@/lib/flow-data";
import { plans, formatPrice, type Region } from "@/lib/pricing";

// ─── Types ────────────────────────────────────────────────────────────────────

type Gender = "" | "male" | "female" | "other";

type Applicant = {
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  nationality: string;
  passportNo: string;
  passportCountry: string;
  passportIssue: string;
  passportExpiry: string;
};

type VisaCategory = "" | "tourist" | "business" | "family";

type FormData = {
  origin: OriginId | null;
  centre: string | null;
  destination: string;
  visaCategory: VisaCategory;
  package: string;
  applicants: Applicant[];
  email: string;
  phone: string;
  insurance: "" | "yes" | "no";
  additionalInfo: string;
};

const emptyApplicant = (): Applicant => ({
  firstName: "",
  lastName: "",
  gender: "",
  dob: "",
  nationality: "",
  passportNo: "",
  passportCountry: "",
  passportIssue: "",
  passportExpiry: "",
});

const STEPS = [
  "Location",
  "Centre",
  "Destination",
  "Visa Type",
  "Package",
  "Consent",
  "Applicants",
  "Review",
];

// ─── Visa category metadata ────────────────────────────────────────────────────

const VISA_CATEGORIES: {
  id: VisaCategory;
  label: string;
  sub: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}[] = [
  {
    id: "tourist",
    label: "Tourist",
    sub: "Sightseeing, leisure & short holidays",
    Icon: Plane,
  },
  {
    id: "business",
    label: "Business",
    sub: "Meetings, conferences & training",
    Icon: Briefcase,
  },
  {
    id: "family",
    label: "Visit EU / EEA Family Member",
    sub: "Visiting a family member residing in the Schengen Area",
    Icon: Users,
  },
];

// ─── Nationality dropdown component ────────────────────────────────────────────

const NATIONALITIES = [
  "Afghan",
  "Algerian",
  "Bangladeshi",
  "Brazilian",
  "Chinese",
  "Egyptian",
  "Emirati",
  "Filipino",
  "Ghanaian",
  "Indian",
  "Iranian",
  "Iraqi",
  "Jordanian",
  "Kuwaiti",
  "Lebanese",
  "Mexican",
  "Moroccan",
  "Nepali",
  "Nigerian",
  "Pakistani",
  "Qatari",
  "Saudi Arabian",
  "South African",
  "Sri Lankan",
  "Syrian",
  "Turkish",
  "Ukrainian",
].sort();

function NationalityDropdown({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = NATIONALITIES.filter((n) =>
    n.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-left transition ${
          error
            ? "border-red-400 bg-red-50 text-red-700"
            : "border-slate-300 bg-white text-slate-900"
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {value || "Select nationality…"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 z-10 w-full rounded-lg border border-slate-200 bg-white shadow-lg"
          >
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-t-lg border-b border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              autoFocus
            />
            <div className="max-h-48 overflow-y-auto">
              {filtered.map((n) => (
                <motion.button
                  key={n}
                  type="button"
                  onClick={() => {
                    onChange(n);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition ${
                    value === n
                      ? "bg-brand-50 text-brand-700 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  whileHover={{ paddingLeft: "1rem" }}
                >
                  {n}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Field helpers ─────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1 ${error ? "animate-shake" : ""}`}>
      <label className="text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="ml-1 text-xs text-slate-400">(optional)</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="text-xs text-red-500 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
) {
  const { error, className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`input-premium glass-input w-full rounded-lg px-3 py-2.5 text-sm outline-none ${
        error ? "input-error !border-red-400 !bg-red-50/90" : ""
      } ${className}`}
    />
  );
}

function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }
) {
  const { error, className = "", children, ...rest } = props;
  return (
    <select
      {...rest}
      className={`input-premium glass-input w-full rounded-lg px-3 py-2.5 text-sm outline-none ${
        error ? "input-error !border-red-400 !bg-red-50/90" : ""
      } ${className}`}
    >
      {children}
    </select>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

type Errors = Record<string, string>;

function validateApplicants(applicants: Applicant[]): Errors {
  const e: Errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  applicants.forEach((a, idx) => {
    const p = `applicant_${idx}`;
    if (!a.firstName.trim()) e[`${p}_firstName`] = "Required";
    if (!a.lastName.trim()) e[`${p}_lastName`] = "Required";
    if (!a.gender) e[`${p}_gender`] = "Required";
    if (!a.dob) {
      e[`${p}_dob`] = "Required";
    } else {
      const dob = new Date(a.dob);
      if (dob > today) e[`${p}_dob`] = "Cannot be in the future";
    }
    if (!a.nationality.trim()) e[`${p}_nationality`] = "Required";
    if (!a.passportNo.trim()) e[`${p}_passportNo`] = "Required";
    if (!a.passportCountry.trim()) e[`${p}_passportCountry`] = "Required";
    if (!a.passportIssue) {
      e[`${p}_passportIssue`] = "Required";
    }
    if (!a.passportExpiry) {
      e[`${p}_passportExpiry`] = "Required";
    } else {
      const expiry = new Date(a.passportExpiry);
      if (expiry < today) e[`${p}_passportExpiry`] = "Passport has expired";
    }
  });
  return e;
}

function validateContact(data: FormData): Errors {
  const e: Errors = {};
  if (!data.email.trim()) {
    e.email = "Email required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    e.email = "Enter a valid email address";
  }
  if (!data.phone.trim()) {
    e.phone = "Phone required";
  } else if (!/^[\d\s\-\+\(\)]{7,}$/.test(data.phone)) {
    e.phone = "Enter a valid phone number";
  }
  if (!data.insurance) e.insurance = "Please choose an option";
  return e;
}

// ─── Step: Location ────────────────────────────────────────────────────────────

function StepLocation({
  selected,
  onSelect,
}: {
  selected: OriginId | null;
  onSelect: (id: OriginId) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Where are you applying from?
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Select your applying location to continue.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {origins.map((o) => (
          <SelectableCard
            key={o.id}
            icon={o.id === "uk" ? <Building2 size={22} /> : <MapPin size={22} />}
            title={o.name}
            subtitle={o.description}
            selected={selected === o.id}
            onClick={() => onSelect(o.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── City landmark photos ──────────────────────────────────────────────────────

const CITY_PHOTOS: Record<string, string> = {
  london:     "/images/cities/london.jpeg",
  manchester: "/images/cities/manchester.jpeg",
  birmingham: "/images/cities/birmingham.jpeg",
  edinburgh:  "/images/cities/edinburgh.jpeg",
  dublin:     "/images/cities/dublin.jpeg",
};

// ─── Tilt hook ─────────────────────────────────────────────────────────────────

function useTilt(intensity = 8) {
  const ref = useRef<HTMLButtonElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 180, damping: 26 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 180, damping: 26 });
  const scaleS  = useSpring(1, { stiffness: 240, damping: 26 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top)  / r.height - 0.5);
    scaleS.set(1.03);
  }, [rawX, rawY, scaleS]);

  const onMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0); scaleS.set(1);
  }, [rawX, rawY, scaleS]);

  return { ref, rotateX, rotateY, scale: scaleS, onMouseMove, onMouseLeave };
}

// ─── Step: Centre ──────────────────────────────────────────────────────────────

function CityCard({
  c,
  isSel,
  photo,
  onSelect,
  index,
}: {
  c: { id: string; name: string };
  isSel: boolean;
  photo: string | undefined;
  onSelect: (id: string) => void;
  index: number;
}) {
  const tilt = useTilt(7);

  return (
    <motion.button
      ref={tilt.ref}
      type="button"
      onClick={() => onSelect(c.id)}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      aria-pressed={isSel}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: tilt.scale,
        transformStyle: "preserve-3d",
        height: "188px",
        border: isSel ? "2.5px solid var(--navy-600)" : "1.5px solid rgba(0,0,0,0.10)",
        boxShadow: isSel
          ? "0 12px 36px -8px rgba(34,111,84,0.35), 0 0 0 4px rgba(34,111,84,0.10)"
          : "0 2px 8px rgba(0,0,0,0.10)",
      }}
      className="group relative overflow-hidden rounded-2xl"
    >
      {/* Photo with zoom on hover */}
      {photo && (
        <Image
          src={photo}
          alt={c.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-108"
          style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        />
      )}

      {/* Gradient overlay — darkens on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.12) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.14)" }}
      />

      {/* Border glow on selected */}
      <AnimatePresence>
        {isSel && (
          <motion.div
            key="sel-glow"
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ boxShadow: "inset 0 0 0 2.5px var(--navy-600)" }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-end justify-between p-5">
        <div>
          <p className="text-lg font-bold text-white drop-shadow-lg">{c.name}</p>
          <p className="text-xs mt-0.5 transition-all duration-300 group-hover:text-white/90" style={{ color: "rgba(255,255,255,0.65)" }}>
            Visa Application Centre
          </p>
        </div>
        <motion.div
          initial={false}
          animate={{ scale: isSel ? 1 : 0, opacity: isSel ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg"
          style={{ background: "var(--navy-600)" }}
        >
          <Check size={16} strokeWidth={3} />
        </motion.div>
      </div>
    </motion.button>
  );
}

function StepCentre({
  origin,
  selected,
  onSelect,
}: {
  origin: OriginId;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const cities = citiesByOrigin[origin];
  const originName = getOrigin(origin)?.name ?? "";
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h2 className="text-xl font-bold text-slate-900">Choose your visa centre</h2>
        <p className="mt-1 text-sm text-slate-500">
          {origin === "ireland"
            ? "Dublin is our supported centre for Ireland-based applicants."
            : `Select which ${originName} centre you'd like to apply through.`}
        </p>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2" style={{ perspective: "800px" }}>
        {cities.map((c, i) => (
          <CityCard
            key={c.id}
            c={c}
            isSel={selected === c.id}
            photo={CITY_PHOTOS[c.id]}
            onSelect={onSelect}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Local flag images (same as homepage) ──────────────────────────────────────

const LOCAL_FLAGS: Record<string, string> = {
  fr: "/images/flags/france.jpeg",
  nl: "/images/flags/netherlands.jpeg",
  it: "/images/flags/italy.jpeg",
  gr: "/images/flags/greece.jpeg",
  hu: "/images/flags/hungary.jpeg",
  at: "/images/flags/austria.jpeg",
  ch: "/images/flags/switzerland.jpeg",
  dk: "/images/flags/denmark.jpeg",
  is: "/images/flags/iceland.jpeg",
  fi: "/images/flags/finland.jpeg",
  be: "/images/flags/belgium.jpeg",
  hr: "/images/flags/croatia.jpeg",
  no: "/images/flags/norway.jpeg",
  se: "/images/flags/sweden.jpeg",
  de: "/images/flags/germany.jpeg",
  pt: "/images/flags/portugal.jpeg",
};

function CountryFlag({ code, name }: { code: string; name: string }) {
  const src = LOCAL_FLAGS[code] ?? `https://flagcdn.com/w80/${code}.png`;
  return (
    <div style={{
      width: "36px",
      height: "26px",
      borderRadius: "5px",
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
      position: "relative",
      flexShrink: 0,
    }}>
      <Image
        src={src}
        alt={`${name} flag`}
        fill
        sizes="36px"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

// ─── Step: Destination ─────────────────────────────────────────────────────────

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

const destCardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.035, duration: 0.38, ease: EASE_OUT },
  }),
};

function StepDestination({
  origin,
  selected,
  onSelect,
}: {
  origin: OriginId;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const dests = destinationsByOrigin[origin];
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h2 className="text-xl font-bold text-slate-900">Select your destination</h2>
        <p className="mt-1 text-sm text-slate-500">
          {dests.length} Schengen destinations available for {getOrigin(origin)?.name} applicants.
        </p>
      </motion.div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dests.map((d, i) => {
          const isSel = selected === d.id;
          return (
            <motion.button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              aria-pressed={isSel}
              custom={i}
              variants={destCardVariant}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative overflow-hidden rounded-xl px-4 py-4 text-left"
              style={{
                border: isSel ? "2px solid var(--navy-600)" : "1px solid rgba(0,0,0,0.09)",
                background: isSel ? "var(--navy-50)" : "#ffffff",
                boxShadow: isSel
                  ? "0 6px 22px -4px rgba(34,111,84,0.24), 0 0 0 3px rgba(34,111,84,0.08)"
                  : "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              {/* Animated border on select */}
              <AnimatePresence>
                {isSel && (
                  <motion.span
                    key="border"
                    className="pointer-events-none absolute inset-0 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ boxShadow: "inset 0 0 0 2px var(--navy-600)" }}
                  />
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3 justify-between">
                {/* Flag with reveal animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.035 + 0.15, duration: 0.3, ease: "backOut" }}
                >
                  <CountryFlag code={d.id} name={d.name} />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate transition-colors duration-200"
                    style={{ color: isSel ? "var(--navy-700)" : "#111827" }}
                  >
                    {d.name}
                  </p>
                </div>

                {/* Animated check */}
                <motion.div
                  initial={false}
                  animate={{ scale: isSel ? 1 : 0, opacity: isSel ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 460, damping: 26 }}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: "var(--navy-600)" }}
                >
                  <Check size={11} strokeWidth={3} />
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step: Visa Category ──────────────────────────────────────────────────────

function StepVisaCategory({
  selected,
  onSelect,
}: {
  selected: VisaCategory;
  onSelect: (id: VisaCategory) => void;
}) {
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h2 className="text-xl font-bold text-slate-900">What is the purpose of your visit?</h2>
        <p className="mt-1 text-sm text-slate-500">
          Select the visa category that best matches your trip.
        </p>
      </motion.div>

      <div className="grid gap-4">
        {VISA_CATEGORIES.map((cat, i) => {
          const isSel = selected === cat.id;
          return (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              aria-pressed={isSel}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex items-center gap-5 rounded-2xl p-5 text-left transition-all"
              style={{
                border: isSel ? "2px solid var(--navy-600)" : "1.5px solid rgba(0,0,0,0.09)",
                background: isSel ? "rgba(34,111,84,0.06)" : "#ffffff",
                boxShadow: isSel
                  ? "0 6px 22px -4px rgba(34,111,84,0.22), 0 0 0 3px rgba(34,111,84,0.08)"
                  : "0 1px 4px rgba(0,0,0,0.07)",
              }}
            >
              {/* Icon badge */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: isSel ? "rgba(34,111,84,0.14)" : "rgba(0,0,0,0.05)",
                  border: isSel ? "1px solid rgba(34,111,84,0.25)" : "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <cat.Icon
                  size={22}
                  strokeWidth={1.75}
                  style={{ color: isSel ? "#226F54" : "#64748b" }}
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-[0.95rem]"
                  style={{ color: isSel ? "#1a5c43" : "#111827" }}
                >
                  {cat.label}
                </p>
                <p className="mt-0.5 text-sm" style={{ color: "rgba(0,0,0,0.48)" }}>
                  {cat.sub}
                </p>
              </div>

              {/* Check */}
              <motion.div
                initial={false}
                animate={{ scale: isSel ? 1 : 0, opacity: isSel ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 460, damping: 26 }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: "var(--navy-600)" }}
              >
                <Check size={13} strokeWidth={3} />
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step: Package (pricing) ───────────────────────────────────────────────────

const pkgCardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: EASE_OUT },
  }),
};

function StepPackage({
  region,
  selected,
  onSelect,
}: {
  region: Region;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const currencyLabel = region === "uk" ? "GBP (£)" : "EUR (€)";
  const regionLabel   = region === "uk" ? "United Kingdom" : "Ireland";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.20em]" style={{ color: "var(--gold-500)" }}>
          Step 5 of 8
        </p>
        <h2 className="mt-1 text-xl font-bold text-white">Choose your package</h2>
        <p className="mt-1 text-sm" style={{ color: "rgba(200,218,255,0.55)" }}>
          Prices in {currencyLabel} · {regionLabel} applicants
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((pkg, i) => {
          const isSel    = selected === pkg.id;
          const isPop    = !!pkg.popular;
          const isPlat   = pkg.id === "platinum-complete-plan";

          return (
            <motion.button
              key={pkg.id}
              type="button"
              onClick={() => onSelect(pkg.id)}
              custom={i}
              variants={pkgCardVariant}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className="relative flex flex-col rounded-2xl p-5 text-left"
              style={{
                background: isSel
                  ? "linear-gradient(145deg, #0d2a1e 0%, #061510 100%)"
                  : isPop
                  ? "linear-gradient(145deg, #0a2218 0%, #060f0a 100%)"
                  : "linear-gradient(145deg, #0a0a0a 0%, #050505 100%)",
                border: isSel
                  ? "2px solid var(--gold-400)"
                  : isPop
                  ? "2px solid rgba(34,111,84,0.50)"
                  : "1.5px solid rgba(255,255,255,0.09)",
                boxShadow: isSel
                  ? "0 0 0 4px rgba(34,111,84,0.12), 0 20px 48px rgba(0,0,0,0.65)"
                  : isPop
                  ? "0 12px 40px rgba(0,0,0,0.55)"
                  : "0 8px 28px rgba(0,0,0,0.45)",
              }}
            >
              {/* Popular badge */}
              {isPop && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                  style={{ background: "var(--gold-500)", color: "var(--navy-900)" }}
                >
                  Recommended
                </span>
              )}

              {/* Selected tick */}
              <motion.div
                initial={false}
                animate={{ scale: isSel ? 1 : 0, opacity: isSel ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 460, damping: 26 }}
                className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full"
                style={{ background: "var(--gold-500)" }}
              >
                <Check size={12} strokeWidth={3} style={{ color: "var(--navy-900)" }} />
              </motion.div>

              {/* Plan name */}
              <p
                className="text-[0.95rem] font-bold leading-snug pr-7"
                style={{ color: isSel ? "var(--gold-300)" : "rgba(240,244,255,0.95)" }}
              >
                {pkg.name}
              </p>

              {/* Tagline */}
              <p className="mt-1 text-[11px] leading-snug" style={{ color: "rgba(180,200,240,0.50)" }}>
                {pkg.tagline}
              </p>

              {/* Price */}
              <p
                className="mt-4 text-2xl font-black tracking-tight"
                style={{
                  color: isPop ? "var(--gold-400)" : isSel ? "var(--gold-300)" : "rgba(240,244,255,0.90)",
                  fontFamily: "var(--app-display)",
                }}
              >
                {formatPrice(pkg.price[region], region)}
                <span className="ml-1 text-[11px] font-semibold" style={{ color: "rgba(180,200,240,0.40)" }}>
                  one-time
                </span>
              </p>

              {/* Divider */}
              <div className="my-4 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

              {/* Features */}
              <ul className="flex-1 space-y-2">
                {pkg.features.map((f) => {
                  const isWA = f.toLowerCase().includes("whatsapp");
                  return (
                    <li key={f} className="flex items-start gap-2">
                      <span
                        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: isWA
                            ? "rgba(37,211,102,0.18)"
                            : "rgba(34,111,84,0.18)",
                          border: isWA
                            ? "1px solid rgba(37,211,102,0.35)"
                            : "1px solid rgba(34,111,84,0.30)",
                        }}
                      >
                        <Check
                          size={9}
                          strokeWidth={3}
                          style={{ color: isWA ? "#25d366" : "#3aab80" }}
                        />
                      </span>
                      <span
                        className="text-[11.5px] leading-snug font-medium"
                        style={{
                          color: isWA
                            ? "rgba(37,211,102,0.90)"
                            : "rgba(200,218,255,0.72)",
                          fontWeight: isWA ? 600 : 500,
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Bottom CTA hint */}
              <div
                className="mt-5 rounded-lg py-2 text-center text-[11px] font-semibold tracking-wide"
                style={{
                  background: isSel
                    ? "rgba(34,111,84,0.15)"
                    : "rgba(255,255,255,0.05)",
                  color: isSel ? "#3aab80" : "rgba(180,200,240,0.40)",
                  border: isSel ? "1px solid rgba(34,111,84,0.30)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {isSel ? "Selected — tap Continue" : isPlat ? "Best value" : isPop ? "Most popular" : "Get started"}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step: GDPR Consent ────────────────────────────────────────────────────────

function StepConsent({
  accepted,
  onToggle,
}: {
  accepted: boolean;
  onToggle: () => void;
}) {
  const points = [
    "Full name, date of birth, and passport details for each applicant",
    "Contact information (email address and phone number)",
    "Travel preferences, destination, and package selections",
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
          Important Notice
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Data Protection &amp; Privacy Consent
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Please read the following carefully before proceeding to the application form.
        </p>
      </motion.div>

      {/* Main notice card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.38 }}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
      >
        {/* Header row */}
        <div className="mb-5 flex items-start gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(34,111,84,0.08)" }}
          >
            <ShieldCheck size={22} style={{ color: "var(--navy-700)" }} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              Restricted-Environment Form Processing
            </p>
            <p className="mt-0.5 text-sm text-slate-500">
              Our form-filling system operates within a highly controlled and
              secure data environment in full compliance with UK GDPR and
              European GDPR Regulation (EU) 2016/679.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            The following personal data will be collected and processed solely for the purpose of your Schengen visa appointment:
          </p>
          <ul className="space-y-2.5">
            {points.map((pt) => (
              <li key={pt} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(34,111,84,0.10)" }}
                >
                  <Check size={11} strokeWidth={3} style={{ color: "var(--navy-700)" }} />
                </span>
                {pt}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-2.5">
            <Lock size={14} className="mt-0.5 shrink-0" style={{ color: "var(--navy-600)" }} />
            <p className="text-xs leading-relaxed text-slate-500">
              Your data is encrypted in transit and at rest, stored on EU/UK-based servers, and will never be sold or shared with third parties. You may request deletion of your data at any time by contacting our Data Protection Officer. This service operates under the UK Data Protection Act 2018 and complies with all applicable Schengen Area embassy data-handling requirements.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Consent checkbox */}
      <motion.button
        type="button"
        onClick={onToggle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.3 }}
        className="flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors"
        style={{
          borderColor: accepted ? "var(--navy-600)" : "rgba(0,0,0,0.12)",
          background: accepted ? "var(--navy-50)" : "#ffffff",
        }}
      >
        {/* Custom checkbox */}
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all"
          style={{
            borderColor: accepted ? "var(--navy-600)" : "#94a3b8",
            background: accepted ? "var(--navy-600)" : "transparent",
          }}
        >
          {accepted && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 520, damping: 24 }}
            >
              <Check size={12} strokeWidth={3.5} color="white" />
            </motion.span>
          )}
        </span>
        <p className="text-sm text-slate-700">
          I have read and understood the data protection notice above. I consent to Schengen Journey processing my personal data for the purpose of arranging my Schengen visa appointment, in accordance with UK GDPR and EU GDPR regulations.
        </p>
      </motion.button>
    </div>
  );
}

// ─── Step: Applicants (full applicant info form) ───────────────────────────────

function StepApplicants({
  data,
  errors,
  onApplicantChange,
  onFieldChange,
  onAddApplicant,
  onRemoveApplicant,
}: {
  data: FormData;
  errors: Errors;
  onApplicantChange: (idx: number, field: keyof Applicant, value: string) => void;
  onFieldChange: (field: keyof FormData, value: string) => void;
  onAddApplicant: () => void;
  onRemoveApplicant: (idx: number) => void;
}) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-xl font-bold text-slate-900">Applicant information</h2>
        <p className="mt-1 text-sm text-slate-500">
          Provide details exactly as they appear on each applicant&apos;s passport.
        </p>
      </motion.div>

      <AnimatePresence initial={false}>
        {data.applicants.map((a, idx) => (
          <motion.div
            key={idx}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                {idx === 0 ? "Primary applicant" : `Applicant ${idx + 1}`}
              </p>
              {idx > 0 && (
                <motion.button
                  type="button"
                  onClick={() => onRemoveApplicant(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  className="inline-flex items-center gap-1 text-xs text-red-500 transition-colors hover:text-red-700"
                >
                  <Trash2 size={13} />
                  Remove
                </motion.button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" error={errors[`applicant_${idx}_firstName`]}>
                <Input
                  placeholder="Jane"
                  value={a.firstName}
                  onChange={(e) => onApplicantChange(idx, "firstName", e.target.value)}
                  error={!!errors[`applicant_${idx}_firstName`]}
                />
              </Field>
              <Field label="Last name" error={errors[`applicant_${idx}_lastName`]}>
                <Input
                  placeholder="Smith"
                  value={a.lastName}
                  onChange={(e) => onApplicantChange(idx, "lastName", e.target.value)}
                  error={!!errors[`applicant_${idx}_lastName`]}
                />
              </Field>

              <Field label="Gender" error={errors[`applicant_${idx}_gender`]}>
                <Select
                  value={a.gender}
                  onChange={(e) => onApplicantChange(idx, "gender", e.target.value)}
                  error={!!errors[`applicant_${idx}_gender`]}
                >
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
              <Field label="Date of birth" error={errors[`applicant_${idx}_dob`]}>
                <Input
                  type="date"
                  value={a.dob}
                  onChange={(e) => onApplicantChange(idx, "dob", e.target.value)}
                  error={!!errors[`applicant_${idx}_dob`]}
                />
              </Field>

              <Field label="Nationality" error={errors[`applicant_${idx}_nationality`]}>
                <NationalityDropdown
                  value={a.nationality}
                  onChange={(val) => onApplicantChange(idx, "nationality", val)}
                  error={!!errors[`applicant_${idx}_nationality`]}
                />
              </Field>
              <Field
                label="Passport number"
                error={errors[`applicant_${idx}_passportNo`]}
              >
                <Input
                  placeholder="P1234567"
                  value={a.passportNo}
                  onChange={(e) =>
                    onApplicantChange(idx, "passportNo", e.target.value)
                  }
                  error={!!errors[`applicant_${idx}_passportNo`]}
                />
              </Field>

              <Field
                label="Passport country of issue"
                error={errors[`applicant_${idx}_passportCountry`]}
              >
                <Input
                  placeholder="United Kingdom"
                  value={a.passportCountry}
                  onChange={(e) =>
                    onApplicantChange(idx, "passportCountry", e.target.value)
                  }
                  error={!!errors[`applicant_${idx}_passportCountry`]}
                />
              </Field>
              <Field
                label="Passport issue date"
                error={errors[`applicant_${idx}_passportIssue`]}
              >
                <Input
                  type="date"
                  value={a.passportIssue}
                  onChange={(e) =>
                    onApplicantChange(idx, "passportIssue", e.target.value)
                  }
                  error={!!errors[`applicant_${idx}_passportIssue`]}
                />
              </Field>

              <Field
                label="Passport expiry date"
                error={errors[`applicant_${idx}_passportExpiry`]}
              >
                <Input
                  type="date"
                  value={a.passportExpiry}
                  onChange={(e) =>
                    onApplicantChange(idx, "passportExpiry", e.target.value)
                  }
                  error={!!errors[`applicant_${idx}_passportExpiry`]}
                />
              </Field>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add applicant button — spring lift */}
      <motion.button
        type="button"
        onClick={onAddApplicant}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
        style={{ borderColor: "var(--navy-400)", color: "var(--navy-600)" }}
      >
        <motion.span
          whileHover={{ rotate: 90 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
        >
          <Plus size={16} />
        </motion.span>
        Add another applicant
      </motion.button>

      {/* Contact + extras — stagger reveal */}
      <motion.div
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-4 text-sm font-semibold text-slate-700">
          Contact details
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
            <Field label="Email address" error={errors.email}>
              <Input
                type="email"
                placeholder="jane@email.com"
                value={data.email}
                onChange={(e) => onFieldChange("email", e.target.value)}
                error={!!errors.email}
              />
            </Field>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
            <Field label="Phone number" error={errors.phone}>
              <Input
                type="tel"
                placeholder="+44 7000 000000"
                value={data.phone}
                onChange={(e) => onFieldChange("phone", e.target.value)}
                error={!!errors.phone}
              />
            </Field>
          </motion.div>
        </div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.26, duration: 0.3 }}
        >
          <Field
            label="Do you need travel medical insurance?"
            error={errors.insurance}
          >
            <div className="flex gap-3">
              {(["yes", "no"] as const).map((opt) => {
                const active = data.insurance === opt;
                return (
                  <motion.button
                    key={opt}
                    type="button"
                    onClick={() => onFieldChange("insurance", opt)}
                    aria-pressed={active}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                      active
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-brand-400"
                    }`}
                  >
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 420, damping: 22 }}
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </Field>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.3 }}
        >
          <Field label="Additional information" optional>
            <textarea
              rows={3}
              placeholder="Anything else we should know about your trip or application…"
              value={data.additionalInfo}
              onChange={(e) => onFieldChange("additionalInfo", e.target.value)}
              className="input-premium rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 w-full resize-none outline-none transition"
            />
          </Field>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Step: Review ──────────────────────────────────────────────────────────────

function StepReview({
  data,
  region,
}: {
  data: FormData;
  region: Region;
}) {
  const pkg = plans.find((p) => p.id === data.package);
  const originName = getOrigin(data.origin)?.name ?? "—";
  const centreName = getCity(data.origin, data.centre)?.name ?? "—";
  const destName = getDestination(data.origin, data.destination)?.name ?? "—";
  const visaCatLabel = VISA_CATEGORIES.find((c) => c.id === data.visaCategory)?.label ?? "—";

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900">Review your booking</h2>

      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <ReviewRow label="Applying from" value={originName} />
          <ReviewRow label="Visa centre" value={centreName} />
          <ReviewRow label="Destination" value={destName} />
          <ReviewRow label="Visa type" value={visaCatLabel} />
          <ReviewRow
            label="Package"
            value={
              pkg
                ? `${pkg.name} — ${formatPrice(pkg.price[region], region)}`
                : "—"
            }
          />
        </div>
      </div>

      {data.applicants.map((a, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <p className="mb-3 text-sm font-semibold text-slate-700">
            {idx === 0 ? "Primary applicant" : `Applicant ${idx + 1}`}
          </p>
          <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <ReviewRow label="Name" value={`${a.firstName} ${a.lastName}`} />
            <ReviewRow label="Gender" value={a.gender} />
            <ReviewRow label="Date of birth" value={a.dob} />
            <ReviewRow label="Nationality" value={a.nationality} />
            <ReviewRow label="Passport no." value={a.passportNo} />
            <ReviewRow label="Passport country" value={a.passportCountry} />
            <ReviewRow label="Issue date" value={a.passportIssue} />
            <ReviewRow label="Expiry date" value={a.passportExpiry} />
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-slate-700">
          Contact &amp; preferences
        </p>
        <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <ReviewRow label="Email" value={data.email} />
          <ReviewRow label="Phone" value={data.phone} />
          <ReviewRow
            label="Travel medical insurance"
            value={data.insurance ? data.insurance : "—"}
          />
          <ReviewRow
            label="Additional info"
            value={data.additionalInfo || "—"}
          />
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-slate-500">{label}</span>
      <p className="font-medium capitalize text-slate-900">{value || "—"}</p>
    </div>
  );
}

// ─── Confirmation ──────────────────────────────────────────────────────────────

function ConfirmationScreen({
  data,
  reference,
}: {
  data: FormData;
  reference: string;
}) {
  const pkg = plans.find((p) => p.id === data.package);
  const destName = getDestination(data.origin, data.destination)?.name ?? "—";

  const rows = [
    { label: "Reference",   value: reference,               mono: true },
    { label: "Package",     value: pkg?.name ?? "—" },
    { label: "Applicants",  value: String(data.applicants.length) },
    { label: "Destination", value: destName },
  ];

  return (
    <motion.div
      className="flex flex-col items-center py-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Premium SVG success animation */}
      <SuccessAnimation size={92} />

      <motion.h2
        className="mt-7 text-2xl font-bold text-slate-900"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.62 }}
      >
        Booking submitted
      </motion.h2>

      <motion.p
        className="mt-2 max-w-md text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.74 }}
      >
        Thank you, <strong>{data.applicants[0]?.firstName}</strong>. Your appointment
        request has been received. We&apos;ll contact you at{" "}
        <strong>{data.email}</strong> within 24 hours to confirm your appointment.
      </motion.p>

      {/* Details card with stagger rows */}
      <motion.div
        className="mt-8 w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.85 }}
      >
        <div className="space-y-3 text-sm">
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              className="flex justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.07, duration: 0.3 }}
            >
              <span className="text-slate-500">{row.label}</span>
              <span className={`font-medium text-slate-900 ${row.mono ? "font-mono" : ""}`}>
                {row.value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-8 flex gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.18, duration: 0.35 }}
      >
        <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/dashboard"
            className="relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2"
            style={{ background: "var(--navy-700)" }}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }} />
            <span className="relative z-10">Go to dashboard</span>
            <ArrowRight size={14} className="relative z-10" />
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          Step {step} of {total}
        </span>
        <span>{STEPS[step - 1]}</span>
      </div>
      <StepIndicator steps={STEPS} current={step - 1} />
    </div>
  );
}

// ─── Airplane step transition overlay ─────────────────────────────────────────

const PLANE_ICON =
  "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z";

function AirplaneTransition({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="plane-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ borderRadius: "inherit" }}
        >
          {/* Frosted backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(6px)" }}
          />

          {/* Dotted flight path */}
          <svg
            className="absolute"
            style={{ width: "80%", height: "60px", top: "calc(50% - 30px)", left: "10%" }}
            viewBox="0 0 600 60"
            fill="none"
          >
            <motion.path
              d="M 0 40 C 150 0, 450 0, 600 40"
              stroke="var(--navy-200, #c8d6e8)"
              strokeWidth="2"
              strokeDasharray="8 6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>

          {/* Airplane flying along path */}
          <motion.div
            initial={{ x: "-280px", y: "12px", rotate: -18, opacity: 0, scale: 0.8 }}
            animate={{
              x: ["-280px", "0px", "280px"],
              y: ["12px", "-14px", "12px"],
              rotate: [-18, -5, 12],
              opacity: [0, 1, 0],
              scale: [0.8, 1, 1],
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.45, 1],
            }}
            className="relative z-10"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 2px 8px rgba(8,20,40,0.25))" }}>
              <path d={PLANE_ICON} fill="var(--navy-700, #1a3055)" />
            </svg>
          </motion.div>

          {/* Trail glow */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: "80px",
              height: "6px",
              background: "linear-gradient(90deg, transparent, rgba(34,111,84,0.5), transparent)",
              filter: "blur(4px)",
              top: "calc(50% - 3px)",
            }}
            initial={{ x: "-320px", opacity: 0 }}
            animate={{
              x: ["-320px", "-40px", "240px"],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.45, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BookingForm({ initialOrigin }: { initialOrigin?: OriginId | null }) {
  const router = useRouter();
  const [step, setStep] = useState(initialOrigin ? 2 : 1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [transitioning, setTransitioning] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const animateStep = useCallback((goTo: number, beforeGo?: () => void) => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      beforeGo?.();
      setStep(goTo);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTransitioning(true);
    setTimeout(() => {
      beforeGo?.();
      setStep(goTo);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setTransitioning(false), 300);
    }, 500);
  }, []);

  const [formData, setFormData] = useState<FormData>({
    origin: initialOrigin ?? null,
    centre: null,
    destination: "",
    visaCategory: "",
    package: "",
    applicants: [emptyApplicant()],
    email: "",
    phone: "",
    insurance: "",
    additionalInfo: "",
  });

  // Restore draft saved before login redirect
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("sj-booking-draft");
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        origin?: OriginId;
        centre?: string;
        destination?: string;
        package?: string;
        returnStep?: number;
      };
      sessionStorage.removeItem("sj-booking-draft");
      setFormData((prev) => ({
        ...prev,
        origin: draft.origin ?? prev.origin,
        centre: draft.centre ?? prev.centre,
        destination: draft.destination ?? prev.destination,
        package: draft.package ?? prev.package,
      }));
      setGdprAccepted(true);
      if (draft.returnStep) setStep(draft.returnStep);
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // origin doubles as the pricing region (uk | ireland)
  const region: Region = (formData.origin ?? "uk") as Region;

  const updateApplicant = (
    idx: number,
    field: keyof Applicant,
    value: string
  ) => {
    setFormData((prev) => {
      const applicants = [...prev.applicants];
      applicants[idx] = { ...applicants[idx], [field]: value };
      return { ...prev, applicants };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`applicant_${idx}_${field}`];
      return next;
    });
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  };

  const addApplicant = () =>
    setFormData((prev) => ({
      ...prev,
      applicants: [...prev.applicants, emptyApplicant()],
    }));

  const removeApplicant = (idx: number) =>
    setFormData((prev) => ({
      ...prev,
      applicants: prev.applicants.filter((_, i) => i !== idx),
    }));

  // GDPR consent step — check auth, then either redirect to login or proceed
  const proceedFromConsent = useCallback(async () => {
    if (!gdprAccepted) return;
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Save selections so they can be restored after login
      try {
        sessionStorage.setItem("sj-booking-draft", JSON.stringify({
          origin: formData.origin,
          centre: formData.centre,
          destination: formData.destination,
          package: formData.package,
          returnStep: 7, // Applicants (step 7 in new numbering)
        }));
      } catch {}
      router.push("/login?next=/book");
      return;
    }

    // Already authenticated — go straight to Applicants
    animateStep(7);
  }, [gdprAccepted, formData, animateStep, router]);

  // Selecting location resets downstream choices that depend on it.
  const selectOrigin = (id: OriginId) => {
    animateStep(2, () =>
      setFormData((prev) =>
        prev.origin === id
          ? prev
          : { ...prev, origin: id, centre: null, destination: "" }
      )
    );
  };

  const selectCentre = (id: string) => {
    animateStep(3, () => updateField("centre", id));
  };

  const selectDestination = (id: string) => {
    animateStep(4, () => updateField("destination", id));
  };

  const selectVisaCategory = (id: VisaCategory) => {
    animateStep(5, () => updateField("visaCategory", id));
  };

  const selectPackage = (id: string) => {
    updateField("package", id);
  };

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const validateStep = (): boolean => {
    let e: Errors = {};
    if (step === 1 && !formData.origin) e.origin = "Required";
    if (step === 2 && !formData.centre) e.centre = "Required";
    if (step === 3 && !formData.destination) e.destination = "Required";
    if (step === 4 && !formData.visaCategory) e.visaCategory = "Please select a visa type";
    if (step === 5 && !formData.package) e.package = "Required";
    if (step === 6 && !gdprAccepted) e.gdpr = "You must accept the data protection notice to continue";
    if (step === 7) {
      e = { ...validateApplicants(formData.applicants), ...validateContact(formData) };
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    animateStep(step + 1);
  };

  const back = () => {
    setStep((s) => s - 1);
    scrollTop();
  };

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setSubmitError(null);

    const destName =
      getDestination(formData.origin, formData.destination)?.name ?? "";

    // Backend contract is unchanged — passport country/issue still supplied.
    const result = await submitBooking({
      package: formData.package,
      applicants: formData.applicants.map((a) => ({
        firstName: a.firstName,
        lastName: a.lastName,
        dob: a.dob,
        nationality: a.nationality,
        passportNo: a.passportNo,
        passportIssue: a.passportIssue,
        passportExpiry: a.passportExpiry,
        passportCountry: a.passportCountry,
      })),
      email: formData.email,
      phone: formData.phone,
      destination: destName,
      travelDateFrom: "",
      travelDateTo: "",
    });

    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    setBookingRef(result.reference);
    setSubmitted(true);
  };

  const canContinue = useMemo(() => {
    if (step === 1) return !!formData.origin;
    if (step === 2) return !!formData.centre;
    if (step === 3) return !!formData.destination;
    if (step === 4) return !!formData.visaCategory;
    if (step === 5) return !!formData.package;
    if (step === 6) return gdprAccepted;
    return true;
  }, [step, formData, gdprAccepted]);

  if (submitted) {
    return (
      <PremiumPageShell>
        <section className="py-20">
          <Container>
            <div className="glass-panel mx-auto max-w-2xl rounded-3xl p-8">
              <ConfirmationScreen data={formData} reference={bookingRef} />
            </div>
          </Container>
        </section>
      </PremiumPageShell>
    );
  }

  // Steps 1–4 auto-advance on selection, so they don't need a Continue button.
  const autoAdvance = step <= 4;

  return (
    <PremiumPageShell>
      <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--gold-500)" }}>
              Book appointment
            </p>
            <h1 className="text-h1 mt-2 text-white">
              Start your Schengen journey
            </h1>
            <p className="text-subhead mt-3" style={{ color: "rgba(240,244,255,0.65)" }}>
              Premium Schengen visa appointment support for UK &amp; Ireland applicants.
            </p>
          </div>

          <div className="glass-panel relative rounded-3xl p-6 sm:p-10">
            <AirplaneTransition show={transitioning} />
            <ProgressBar step={step} total={STEPS.length} />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                {step === 1 && (
                  <StepLocation
                    selected={formData.origin}
                    onSelect={selectOrigin}
                  />
                )}
                {step === 2 && formData.origin && (
                  <StepCentre
                    origin={formData.origin}
                    selected={formData.centre}
                    onSelect={selectCentre}
                  />
                )}
                {step === 3 && formData.origin && (
                  <StepDestination
                    origin={formData.origin}
                    selected={formData.destination}
                    onSelect={selectDestination}
                  />
                )}
                {step === 4 && (
                  <StepVisaCategory
                    selected={formData.visaCategory}
                    onSelect={selectVisaCategory}
                  />
                )}
                {step === 5 && (
                  <StepPackage
                    region={region}
                    selected={formData.package}
                    onSelect={selectPackage}
                  />
                )}
                {step === 6 && (
                  <StepConsent
                    accepted={gdprAccepted}
                    onToggle={() => setGdprAccepted((v) => !v)}
                  />
                )}
                {step === 7 && (
                  <StepApplicants
                    data={formData}
                    errors={errors}
                    onApplicantChange={updateApplicant}
                    onFieldChange={updateField}
                    onAddApplicant={addApplicant}
                    onRemoveApplicant={removeApplicant}
                  />
                )}
                {step === 8 && <StepReview data={formData} region={region} />}
              </motion.div>
            </AnimatePresence>

            {submitError && (
              <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {submitError}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={back}
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ArrowLeft size={15} />
                  Back
                </button>
              ) : (
                <div />
              )}

              {!autoAdvance && step < STEPS.length && (
                <motion.button
                  type="button"
                  onClick={step === 6 ? proceedFromConsent : next}
                  disabled={!canContinue}
                  className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  whileHover={canContinue ? { scale: 1.03 } : undefined}
                  whileTap={canContinue ? { scale: 0.97 } : undefined}
                  transition={{ duration: 0.15 }}
                >
                  {step === 6 ? "I Agree — Continue" : "Continue"}
                </motion.button>
              )}

              {step === STEPS.length && (
                <motion.button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="relative overflow-hidden flex items-center gap-2 rounded-xl px-7 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: submitting ? "var(--navy-800)" : "var(--navy-700)" }}
                  whileHover={!submitting ? { scale: 1.03, y: -1 } : undefined}
                  whileTap={!submitting ? { scale: 0.97 } : undefined}
                  transition={{ type: "spring", stiffness: 340, damping: 22 }}
                >
                  {/* Shimmer sweep on idle */}
                  {!submitting && (
                    <span
                      className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] animate-shimmer-sweep"
                      style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)" }}
                    />
                  )}
                  <AnimatePresence mode="wait">
                    {submitting ? (
                      <motion.div
                        key="loading"
                        className="flex items-center gap-2.5 relative z-10"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                      >
                        <LoadingDots color="rgba(255,255,255,0.9)" />
                        <span>Submitting</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="submit"
                        className="relative z-10 flex items-center gap-2"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                      >
                        Submit booking
                        <ArrowRight size={14} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </Container>
      </section>
    </PremiumPageShell>
  );
}
