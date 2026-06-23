"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Building2,
  MapPin,
  CheckCircle2,
} from "lucide-react";
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

type FormData = {
  origin: OriginId | null;
  centre: string | null;
  destination: string; // destination id
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
  "Package",
  "Applicants",
  "Review",
];

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
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="ml-1 text-xs text-slate-400">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
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
      className={`rounded-lg border px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-brand-500 ${
        error
          ? "border-red-400 bg-red-50 focus:ring-red-400"
          : "border-slate-300 bg-white focus:border-brand-500"
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
      className={`rounded-lg border px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-brand-500 ${
        error
          ? "border-red-400 bg-red-50 focus:ring-red-400"
          : "border-slate-300 bg-white focus:border-brand-500"
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
  applicants.forEach((a, idx) => {
    const p = `applicant_${idx}`;
    if (!a.firstName.trim()) e[`${p}_firstName`] = "Required";
    if (!a.lastName.trim()) e[`${p}_lastName`] = "Required";
    if (!a.gender) e[`${p}_gender`] = "Required";
    if (!a.dob) e[`${p}_dob`] = "Required";
    if (!a.nationality.trim()) e[`${p}_nationality`] = "Required";
    if (!a.passportNo.trim()) e[`${p}_passportNo`] = "Required";
    if (!a.passportCountry.trim()) e[`${p}_passportCountry`] = "Required";
    if (!a.passportIssue) e[`${p}_passportIssue`] = "Required";
    if (!a.passportExpiry) e[`${p}_passportExpiry`] = "Required";
  });
  return e;
}

function validateContact(data: FormData): Errors {
  const e: Errors = {};
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    e.email = "Valid email required";
  if (!data.phone.trim()) e.phone = "Required";
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

// ─── Step: Centre ──────────────────────────────────────────────────────────────

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
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Choose your visa centre
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {origin === "ireland"
            ? "Dublin is our supported centre for Ireland-based applicants."
            : `Select which ${originName} centre you'd like to apply through.`}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cities.map((c) => (
          <SelectableCard
            key={c.id}
            icon={<MapPin size={22} />}
            title={c.name}
            selected={selected === c.id}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Step: Destination ─────────────────────────────────────────────────────────

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
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Select your destination
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {dests.length} Schengen destinations available for{" "}
          {getOrigin(origin)?.name} applicants.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dests.map((d) => {
          const isSel = selected === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              aria-pressed={isSel}
              className={`flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                isSel
                  ? "border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-100"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-400"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin
                  size={16}
                  className={isSel ? "text-brand-600" : "text-slate-400"}
                />
                {d.name}
              </span>
              {isSel && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step: Package (pricing) ───────────────────────────────────────────────────

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
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Choose your package</h2>
        <p className="mt-1 text-sm text-slate-500">
          Prices shown in {currencyLabel} for {region === "uk" ? "United Kingdom" : "Ireland"} applicants.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => onSelect(pkg.id)}
            className={`relative flex flex-col rounded-2xl border-2 p-5 text-left transition ${
              selected === pkg.id
                ? "border-brand-600 bg-brand-50 ring-2 ring-brand-200"
                : "border-slate-200 bg-white hover:border-brand-400"
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold uppercase text-white">
                Popular
              </span>
            )}
            <p className="font-bold text-slate-900">{pkg.name}</p>
            <p className="mt-1 text-lg font-semibold text-brand-600">
              {formatPrice(pkg.price[region], region)}
            </p>
            <ul className="mt-3 space-y-1.5">
              {pkg.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-xs text-slate-600"
                >
                  <Check
                    size={13}
                    strokeWidth={3}
                    className="mt-0.5 shrink-0 text-brand-600"
                  />
                  {f}
                </li>
              ))}
            </ul>
            {selected === pkg.id && (
              <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white">
                <Check size={14} strokeWidth={3} />
              </span>
            )}
          </button>
        ))}
      </div>
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
      <div>
        <h2 className="text-xl font-bold text-slate-900">Applicant information</h2>
        <p className="mt-1 text-sm text-slate-500">
          Provide details exactly as they appear on each applicant&apos;s passport.
        </p>
      </div>

      {data.applicants.map((a, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              {idx === 0 ? "Primary applicant" : `Applicant ${idx + 1}`}
            </p>
            {idx > 0 && (
              <button
                type="button"
                onClick={() => onRemoveApplicant(idx)}
                className="inline-flex items-center gap-1 text-xs text-red-500 transition-colors hover:text-red-700"
              >
                <Trash2 size={13} />
                Remove
              </button>
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
              <Input
                placeholder="British"
                value={a.nationality}
                onChange={(e) =>
                  onApplicantChange(idx, "nationality", e.target.value)
                }
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
        </div>
      ))}

      <button
        type="button"
        onClick={onAddApplicant}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-brand-400 px-4 py-2.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
      >
        <Plus size={16} /> Add another applicant
      </button>

      {/* Contact + extras (booking-level) */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="mb-4 text-sm font-semibold text-slate-700">
          Contact details
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email address" error={errors.email}>
            <Input
              type="email"
              placeholder="jane@email.com"
              value={data.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              error={!!errors.email}
            />
          </Field>
          <Field label="Phone number" error={errors.phone}>
            <Input
              type="tel"
              placeholder="+44 7000 000000"
              value={data.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              error={!!errors.phone}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field
            label="Do you need travel medical insurance?"
            error={errors.insurance}
          >
            <div className="flex gap-3">
              {(["yes", "no"] as const).map((opt) => {
                const active = data.insurance === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onFieldChange("insurance", opt)}
                    aria-pressed={active}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                      active
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-brand-400"
                    }`}
                  >
                    {active && <Check size={14} strokeWidth={3} />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Additional information" optional>
            <textarea
              rows={3}
              placeholder="Anything else we should know about your trip or application…"
              value={data.additionalInfo}
              onChange={(e) => onFieldChange("additionalInfo", e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
            />
          </Field>
        </div>
      </div>
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

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900">Review your booking</h2>

      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <ReviewRow label="Applying from" value={originName} />
          <ReviewRow label="Visa centre" value={centreName} />
          <ReviewRow label="Destination" value={destName} />
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
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 size={44} strokeWidth={1.75} />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-slate-900">Booking submitted</h2>
      <p className="mt-2 max-w-md text-slate-600">
        Thank you, <strong>{data.applicants[0]?.firstName}</strong>. Your appointment
        request has been received. We&apos;ll contact you at{" "}
        <strong>{data.email}</strong> within 24 hours to confirm your appointment.
      </p>

      <div className="mt-8 w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Reference</span>
            <span className="font-mono font-semibold text-slate-900">
              {reference}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Package</span>
            <span className="font-medium text-slate-900">{pkg?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Applicants</span>
            <span className="font-medium text-slate-900">
              {data.applicants.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Destination</span>
            <span className="font-medium text-slate-900">{destName}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/dashboard"
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Go to dashboard
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to home
        </Link>
      </div>
    </div>
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

// ─── Main component ───────────────────────────────────────────────────────────

export function BookingForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const [formData, setFormData] = useState<FormData>({
    origin: null,
    centre: null,
    destination: "",
    package: "",
    applicants: [emptyApplicant()],
    email: "",
    phone: "",
    insurance: "",
    additionalInfo: "",
  });

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

  // Selecting location resets downstream choices that depend on it.
  const selectOrigin = (id: OriginId) => {
    setFormData((prev) =>
      prev.origin === id
        ? prev
        : { ...prev, origin: id, centre: null, destination: "" }
    );
    setStep(2);
    scrollTop();
  };

  const selectCentre = (id: string) => {
    updateField("centre", id);
    setStep(3);
    scrollTop();
  };

  const selectDestination = (id: string) => {
    updateField("destination", id);
    setStep(4);
    scrollTop();
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
    if (step === 4 && !formData.package) e.package = "Required";
    if (step === 5) {
      e = { ...validateApplicants(formData.applicants), ...validateContact(formData) };
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => s + 1);
    scrollTop();
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
    if (step === 4) return !!formData.package;
    return true;
  }, [step, formData]);

  if (submitted) {
    return (
      <PremiumPageShell>
        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
              <ConfirmationScreen data={formData} reference={bookingRef} />
            </div>
          </Container>
        </section>
      </PremiumPageShell>
    );
  }

  // Steps 1–3 auto-advance on selection, so they don't need a Continue button.
  const autoAdvance = step <= 3;

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

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-10">
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
                  <StepPackage
                    region={region}
                    selected={formData.package}
                    onSelect={selectPackage}
                  />
                )}
                {step === 5 && (
                  <StepApplicants
                    data={formData}
                    errors={errors}
                    onApplicantChange={updateApplicant}
                    onFieldChange={updateField}
                    onAddApplicant={addApplicant}
                    onRemoveApplicant={removeApplicant}
                  />
                )}
                {step === 6 && <StepReview data={formData} region={region} />}
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
                <button
                  type="button"
                  onClick={next}
                  disabled={!canContinue}
                  className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Continue
                </button>
              )}

              {step === STEPS.length && (
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting…
                    </>
                  ) : (
                    "Submit booking"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
      </section>
    </PremiumPageShell>
  );
}
