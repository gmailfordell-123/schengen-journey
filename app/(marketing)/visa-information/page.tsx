import type { Metadata } from "next";
import Link from "next/link";
import {
  Info,
  AlertTriangle,
  Star,
  Check,
  X,
  Building2,
  MapPin,
  BookUser,
  CreditCard,
  Plane,
  Briefcase,
  Mail,
  Paperclip,
  CalendarDays,
  FileText,
  CalendarClock,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BlurFade } from "@/components/ui/BlurFade";
import { Meteors } from "@/components/ui/Meteors";
import { AnimatedGradientText } from "@/components/ui/AnimatedGradientText";

type IconType = React.ComponentType<{ size?: number | string; className?: string; style?: React.CSSProperties }>;

export const metadata: Metadata = {
  title: "Schengen Visa Information",
  description:
    "Comprehensive guide to Schengen visa requirements, the 90/180-day rule, documents, fees, and processing times for UK and Ireland applicants.",
};

/* ─── Reusable layout pieces ─────────────────────────────────────────────── */

function SectionAnchor({ id }: { id: string }) {
  return <div id={id} className="scroll-mt-24" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-6 shrink-0 rounded" style={{ background: "var(--gold-500)" }} />
      <span
        className="text-xs font-semibold uppercase tracking-[0.14em]"
        style={{ color: "var(--gold-500)" }}
      >
        {children}
      </span>
      <span className="h-px flex-1 rounded" style={{ background: "var(--border)" }} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl font-semibold tracking-tight sm:text-3xl"
      style={{ color: "var(--ink)" }}
    >
      {children}
    </h2>
  );
}

function InfoCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 sm:p-7 ${className}`}
      style={{ background: "var(--bg)", borderColor: "var(--border)", ...style }}
    >
      {children}
    </div>
  );
}

function CalloutBox({
  type,
  title,
  children,
}: {
  type: "info" | "warning" | "gold";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      bg: "var(--navy-50)",
      border: "var(--navy-200)",
      iconBg: "var(--navy-100)",
      iconColor: "var(--navy-700)",
      titleColor: "var(--navy-800)",
      Icon: Info as IconType,
    },
    warning: {
      bg: "#fff9f0",
      border: "#f5d6a0",
      iconBg: "#fef3e0",
      iconColor: "#b45309",
      titleColor: "#92400e",
      Icon: AlertTriangle as IconType,
    },
    gold: {
      bg: "var(--gold-100)",
      border: "rgba(201,168,76,0.30)",
      iconBg: "rgba(201,168,76,0.15)",
      iconColor: "var(--gold-500)",
      titleColor: "var(--ink)",
      Icon: Star as IconType,
    },
  }[type];

  const { Icon } = styles;

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: styles.bg, border: `1px solid ${styles.border}` }}
    >
      <div className="flex gap-4">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: styles.iconBg, color: styles.iconColor }}
        >
          <Icon size={16} />
        </div>
        <div>
          <p className="font-semibold text-sm mb-2" style={{ color: styles.titleColor }}>
            {title}
          </p>
          <div className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm" style={{ color: "var(--ink-muted)" }}>
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ background: "var(--navy-50)", color: "var(--navy-600)", border: "1px solid var(--navy-100)" }}
      >
        <Check size={11} strokeWidth={3} />
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function CrossItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm" style={{ color: "var(--ink-muted)" }}>
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ background: "#fff0f0", color: "#dc2626", border: "1px solid #fecaca" }}
      >
        <X size={11} strokeWidth={3} />
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function StatChip({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 text-center"
      style={{ background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}
    >
      <p className="text-2xl font-semibold" style={{ color: "var(--navy-700)" }}>
        {value}
      </p>
      <p className="mt-1 text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
        {label}
      </p>
    </div>
  );
}

/* ─── TOC items ───────────────────────────────────────────────────────────── */

const tocItems = [
  { id: "what-is-schengen",   label: "What is a Schengen Visa" },
  { id: "90-180-rule",        label: "90/180 Day Rule" },
  { id: "where-to-apply",     label: "Where to Apply" },
  { id: "when-to-apply",      label: "When to Apply" },
  { id: "documents",          label: "Required Documents" },
  { id: "passport-validity",  label: "Passport Validity" },
  { id: "travel-insurance",   label: "Travel Medical Insurance" },
  { id: "visa-fees",          label: "Visa Fees" },
  { id: "processing-times",   label: "Processing Times" },
  { id: "our-support",        label: "Our Support Process" },
  { id: "disclaimer",         label: "Important Disclaimer" },
];

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function VisaInformationPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 sm:py-20"
        style={{
          background: `linear-gradient(160deg, var(--navy-950) 0%, var(--navy-800) 100%)`,
        }}
      >
        <Meteors number={18} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <Container className="relative">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs" style={{ color: "rgba(240,244,255,0.45)" }}>
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span>/</span>
            <span style={{ color: "var(--gold-500)" }}>Visa Information</span>
          </nav>

          <div className="max-w-3xl">
            <BlurFade delay={0.05}>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 rounded" style={{ background: "var(--gold-500)" }} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                <AnimatedGradientText>Comprehensive Guide</AnimatedGradientText>
              </span>
            </div>

            <h1 className="text-h1 text-white">
              Schengen Visa Information
            </h1>
            <p className="text-subhead mt-4 max-w-xl" style={{ color: "rgba(240,244,255,0.65)" }}>
              Everything UK and Ireland applicants need to know — from eligibility
              and documents to fees, timelines, and how we support your application.
            </p>

            {/* Quick stats */}
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              {[
                { v: "27",    l: "Schengen States" },
                { v: "90",    l: "Max Days Per Stay" },
                { v: "€80",   l: "Standard Visa Fee" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl px-4 py-3 text-center"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                >
                  <p className="text-xl font-semibold" style={{ color: "var(--gold-500)" }}>{s.v}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "rgba(240,244,255,0.55)" }}>{s.l}</p>
                </div>
              ))}
            </div>
            </BlurFade>
          </div>
        </Container>
      </section>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="section-subtle">
        <Container className="py-12">
          <div className="flex gap-10 items-start">

            {/* ── Sticky sidebar TOC (desktop) ───────────────────────────── */}
            <aside className="hidden xl:block w-56 shrink-0 sticky top-28 self-start">
              <p
                className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "var(--ink-light)" }}
              >
                On this page
              </p>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="toc-link block rounded-lg px-3 py-2 text-xs font-medium leading-snug transition-colors"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* ── Article body ───────────────────────────────────────────── */}
            <article className="min-w-0 flex-1 space-y-10">

              {/* ══ 1. What is a Schengen Visa ══════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="what-is-schengen" />
              <InfoCard>
                <SectionLabel>Section 01</SectionLabel>
                <SectionTitle>What is a Schengen Visa?</SectionTitle>

                <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  A Schengen visa is a short-stay visa that allows non-EU, non-EEA nationals to
                  travel freely within the Schengen Area — a zone comprising 27 European countries
                  that have abolished passport controls at their mutual borders. Once issued, a
                  Schengen visa allows the holder to enter any of the member states and move
                  between them without border checks for tourism, business, family visits, cultural
                  events, or short-term study purposes.
                </p>

                <p className="mt-3 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  Applicants based in the <strong style={{ color: "var(--ink)" }}>United Kingdom</strong> or
                  the <strong style={{ color: "var(--ink)" }}>Republic of Ireland</strong> require
                  a Schengen visa if they hold a non-EU nationality. UK and Irish citizens do not
                  require a visa to travel to Schengen countries. Residents of the UK and Ireland
                  who hold a non-EU passport must apply through the consulate of the country they
                  will visit first or spend the most time in.
                </p>

                {/* Key facts grid */}
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatChip value="27" label="Member States" />
                  <StatChip value="90" label="Max Days (per 180)" />
                  <StatChip value="C Type" label="Visa Category" />
                  <StatChip value="€80" label="Standard Fee" />
                </div>

                {/* Schengen countries list */}
                <div className="mt-7">
                  <p className="mb-3 text-sm font-semibold" style={{ color: "var(--ink)" }}>
                    The 27 Schengen Member States
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Austria","Belgium","Croatia","Czech Republic","Denmark","Estonia",
                      "Finland","France","Germany","Greece","Hungary","Iceland","Italy",
                      "Latvia","Liechtenstein","Lithuania","Luxembourg","Malta","Netherlands",
                      "Norway","Poland","Portugal","Slovakia","Slovenia","Spain","Sweden","Switzerland",
                    ].map((c) => (
                      <span
                        key={c}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{ background: "var(--navy-50)", color: "var(--navy-700)", border: "1px solid var(--navy-100)" }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </InfoCard>
              </BlurFade>

              {/* ══ 2. 90/180 Day Rule ══════════════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="90-180-rule" />
              <InfoCard>
                <SectionLabel>Section 02</SectionLabel>
                <SectionTitle>The 90/180 Day Rule</SectionTitle>

                <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  The 90/180-day rule is the fundamental restriction governing short stays in the
                  Schengen Area. It stipulates that you may not spend more than{" "}
                  <strong style={{ color: "var(--ink)" }}>90 days</strong> within any rolling{" "}
                  <strong style={{ color: "var(--ink)" }}>180-day period</strong> in the Schengen
                  zone. This rule applies regardless of how many countries you visit or how many
                  separate trips you make. The 180-day window is not a fixed calendar period — it
                  rolls back continuously from any given date.
                </p>

                {/* Visual rule bar */}
                <div
                  className="mt-7 rounded-2xl p-6"
                  style={{ background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}
                >
                  <p className="text-sm font-semibold mb-4" style={{ color: "var(--navy-800)" }}>
                    Visual: Rolling 180-day window
                  </p>
                  <div className="relative">
                    <div className="flex h-10 w-full overflow-hidden rounded-full" style={{ background: "var(--navy-100)" }}>
                      {/* Days used */}
                      <div
                        className="flex items-center justify-center text-xs font-semibold text-white rounded-full"
                        style={{ width: "50%", background: "var(--navy-600)", zIndex: 1 }}
                      >
                        90 days allowed
                      </div>
                      {/* Remaining */}
                      <div
                        className="flex items-center justify-center text-xs font-medium"
                        style={{ width: "50%", color: "var(--navy-500)" }}
                      >
                        90 days remaining
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-[11px]" style={{ color: "var(--ink-light)" }}>
                      <span>Day 1</span>
                      <span>Day 90</span>
                      <span>Day 180</span>
                    </div>
                  </div>
                </div>

                {/* Worked example */}
                <div className="mt-5">
                  <CalloutBox type="info" title="Worked Example">
                    <p>
                      You travel to France from 1 January for 30 days (returns 31 January).
                      You then travel to Spain from 1 March for 45 days (returns 15 April).
                      On 15 April, looking back over the previous 180 days (17 October – 15 April),
                      you have spent <strong>75 days</strong> in the Schengen Area. You have{" "}
                      <strong>15 days</strong> remaining before reaching the 90-day limit
                      within that rolling window.
                    </p>
                  </CalloutBox>
                </div>

                <div className="mt-5 space-y-3">
                  <CalloutBox type="warning" title="Common Misconceptions">
                    <ul className="space-y-1.5 mt-1">
                      <li>• The 180 days does <strong>not</strong> reset on 1 January each year — it is a rolling window.</li>
                      <li>• Days of entry <strong>and</strong> exit are both counted as days in the Schengen Area.</li>
                      <li>• Each trip does not get its own separate 90-day allowance.</li>
                      <li>• Overstaying the 90-day limit can result in entry bans and visa refusals for future applications.</li>
                    </ul>
                  </CalloutBox>
                </div>
              </InfoCard>
              </BlurFade>

              {/* ══ 3. Where to Apply ════════════════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="where-to-apply" />
              <InfoCard>
                <SectionLabel>Section 03</SectionLabel>
                <SectionTitle>Where to Apply</SectionTitle>

                <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  You must apply at the consulate or visa application centre (VAC) of the
                  Schengen country you are visiting, or — if visiting multiple countries — the
                  country where you will spend the most time. If you are spending equal time in
                  multiple countries, apply at the consulate of your first point of entry.
                </p>

                {/* UK/Ireland cards */}
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  {/* UK */}
                  <div
                    className="rounded-2xl p-6"
                    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}
                      >
                        <Building2 size={20} style={{ color: "var(--navy-700)" }} />
                      </span>
                      <div>
                        <p className="font-semibold" style={{ color: "var(--ink)" }}>United Kingdom</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--ink-light)" }}>4 application cities</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {[
                        { city: "London", note: "Multiple VFS & TLScontact locations" },
                        { city: "Manchester", note: "VFS Global centre" },
                        { city: "Birmingham", note: "VFS Global centre" },
                        { city: "Edinburgh", note: "Selected destinations only" },
                      ].map((l) => (
                        <li key={l.city} className="flex items-start gap-2.5">
                          <span
                            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: "var(--navy-500)" }}
                          />
                          <div>
                            <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>{l.city}</span>
                            <span className="text-xs ml-1.5" style={{ color: "var(--ink-light)" }}>— {l.note}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ireland */}
                  <div
                    className="rounded-2xl p-6"
                    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}
                      >
                        <MapPin size={20} style={{ color: "var(--navy-700)" }} />
                      </span>
                      <div>
                        <p className="font-semibold" style={{ color: "var(--ink)" }}>Republic of Ireland</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--ink-light)" }}>Dublin applications</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {[
                        { city: "Dublin", note: "VFS Global & consulate appointments" },
                        { city: "Online", note: "Some consulates accept online pre-registration" },
                      ].map((l) => (
                        <li key={l.city} className="flex items-start gap-2.5">
                          <span
                            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: "var(--navy-500)" }}
                          />
                          <div>
                            <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>{l.city}</span>
                            <span className="text-xs ml-1.5" style={{ color: "var(--ink-light)" }}>— {l.note}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div
                      className="mt-5 rounded-xl p-4"
                      style={{ background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}
                    >
                      <p className="text-xs leading-relaxed" style={{ color: "var(--navy-700)" }}>
                        Ireland has fewer dedicated visa application centres than the UK. For some
                        destinations, applicants must apply directly at the relevant consulate in
                        Dublin. We guide you to the correct application route for your destination.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <CalloutBox type="info" title="Visa Application Centre Partners">
                    <p>
                      Most Schengen consulates partner with either{" "}
                      <strong>VFS Global</strong> or <strong>TLScontact</strong> to handle
                      appointment bookings and document collection. These centres charge a
                      separate service fee on top of the visa fee. Some countries (Germany, France)
                      also operate direct consulate appointments for certain applicant categories.
                    </p>
                  </CalloutBox>
                </div>
              </InfoCard>
              </BlurFade>

              {/* ══ 4. When to Apply ════════════════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="when-to-apply" />
              <InfoCard>
                <SectionLabel>Section 04</SectionLabel>
                <SectionTitle>When to Apply</SectionTitle>

                <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  Timing your application correctly is critical to a successful outcome. Applying
                  too early or too late can result in delays, missed appointments, or refusal
                  on procedural grounds.
                </p>

                {/* Timeline */}
                <div className="mt-7 space-y-0">
                  {[
                    {
                      time: "6 months before travel",
                      label: "Earliest you can apply",
                      desc: "Schengen visa applications can be submitted a maximum of 6 months before your intended travel date. Applying earlier than this is not permitted.",
                      color: "var(--navy-200)",
                      dot: "var(--navy-200)",
                    },
                    {
                      time: "4–6 weeks before",
                      label: "Recommended window",
                      desc: "The ideal time to submit your application. This gives sufficient processing time while keeping your travel dates recent enough to be verifiable.",
                      color: "var(--navy-600)",
                      dot: "var(--navy-600)",
                      highlight: true,
                    },
                    {
                      time: "3 weeks before",
                      label: "Minimum recommended",
                      desc: "Technically possible, but risky. Processing times vary and some consulates take up to 15 calendar days. Urgent applications may incur additional fees with no guarantee of faster processing.",
                      color: "var(--gold-500)",
                      dot: "var(--gold-500)",
                    },
                    {
                      time: "< 2 weeks before",
                      label: "Do not apply this late",
                      desc: "Very high risk of receiving the decision after your travel date. Some consulates will not accept applications with travel dates less than 15 days away.",
                      color: "#dc2626",
                      dot: "#dc2626",
                    },
                  ].map((step, i, arr) => (
                    <div key={step.time} className="flex gap-5">
                      {/* Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className="h-4 w-4 shrink-0 rounded-full border-4 border-white"
                          style={{ background: step.dot, boxShadow: `0 0 0 1px ${step.dot}` }}
                        />
                        {i < arr.length - 1 && (
                          <div className="flex-1 w-px" style={{ background: "var(--border)", minHeight: "2.5rem" }} />
                        )}
                      </div>
                      {/* Content */}
                      <div className={`pb-6 ${i === arr.length - 1 ? "pb-0" : ""}`}>
                        <span
                          className="inline-block rounded-full px-3 py-1 text-xs font-semibold mb-2"
                          style={{
                            background: step.highlight ? "var(--navy-600)" : "var(--bg-subtle)",
                            color: step.highlight ? "#fff" : step.color,
                            border: step.highlight ? "none" : `1px solid ${step.color}`,
                          }}
                        >
                          {step.time}
                        </span>
                        <p className="text-sm font-semibold mb-1" style={{ color: "var(--ink)" }}>
                          {step.label}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <CalloutBox type="gold" title="Peak Season Warning">
                    <p>
                      Summer (June–August) and major holidays see a significant surge in visa
                      applications. Appointment slots at popular consulates (France, Italy, Spain)
                      fill up 6–8 weeks in advance during peak season. If you are travelling in
                      summer, begin the process as early as possible — ideally 10–12 weeks ahead.
                    </p>
                  </CalloutBox>
                </div>
              </InfoCard>
              </BlurFade>

              {/* ══ 5. Common Documents ════════════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="documents" />
              <InfoCard>
                <SectionLabel>Section 05</SectionLabel>
                <SectionTitle>Required Documents</SectionTitle>

                <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  The following documents are required for virtually all Schengen visa
                  applications from the UK and Ireland. Additional documents may be requested
                  by specific consulates based on your nationality, employment status, or
                  travel history.
                </p>

                {/* Document categories */}
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  {[
                    {
                      category: "Identity & Travel",
                      Icon: BookUser as IconType,
                      items: [
                        "Valid passport (min. 3 months validity past return date)",
                        "All previous passports with prior visas",
                        "UK/Ireland residence permit or BRP",
                        "2 recent passport photographs (35×45mm, white background)",
                        "Completed Schengen visa application form",
                      ],
                    },
                    {
                      category: "Financial Evidence",
                      Icon: CreditCard as IconType,
                      items: [
                        "Bank statements for the past 3–6 months",
                        "Proof of regular income (payslips, contract, or tax returns)",
                        "Sponsorship letter and sponsor's bank statements if applicable",
                        "Evidence of property ownership or assets if self-employed",
                      ],
                    },
                    {
                      category: "Travel & Accommodation",
                      Icon: Plane as IconType,
                      items: [
                        "Return flight reservation (not a purchased ticket)",
                        "Hotel reservations for all nights of travel",
                        "Travel itinerary showing planned destinations and dates",
                        "Schengen travel insurance certificate (min. €30,000 cover)",
                      ],
                    },
                    {
                      category: "Employment / Study",
                      Icon: Briefcase as IconType,
                      items: [
                        "Employer letter confirming position, salary, and approved leave",
                        "Student letter from institution with course dates",
                        "Business registration or accountant letter if self-employed",
                        "Proof of pension or retirement income for retirees",
                      ],
                    },
                    {
                      category: "Cover Letter",
                      Icon: Mail as IconType,
                      items: [
                        "Signed cover letter explaining purpose and itinerary",
                        "Explanation of ties to UK or Ireland (property, family, employment)",
                        "Declaration of intent to return before visa expiry",
                        "Previous travel history summary if relevant",
                      ],
                    },
                    {
                      category: "Additional (if applicable)",
                      Icon: Paperclip as IconType,
                      items: [
                        "Invitation letter from host in Schengen country",
                        "Marriage or birth certificate for family visit applications",
                        "Conference registration or business invitation letter",
                        "Copies of previously granted Schengen or US/UK visas",
                      ],
                    },
                  ].map((cat) => (
                    <div
                      key={cat.category}
                      className="rounded-2xl p-5"
                      style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{ background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}
                        >
                          <cat.Icon size={17} style={{ color: "var(--navy-700)" }} />
                        </span>
                        <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                          {cat.category}
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {cat.items.map((item) => (
                          <CheckItem key={item}>{item}</CheckItem>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <CalloutBox type="warning" title="Documents Must Be Current">
                    <p>
                      Bank statements must be dated within 3 months of application. Employment
                      letters must be on official letterhead, signed, and dated. Consulates
                      may request certified translations of documents not in English, French,
                      or the language of the destination country.
                    </p>
                  </CalloutBox>
                </div>
              </InfoCard>
              </BlurFade>

              {/* ══ 6. Passport Validity ════════════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="passport-validity" />
              <InfoCard>
                <SectionLabel>Section 06</SectionLabel>
                <SectionTitle>Passport Validity Requirements</SectionTitle>

                <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  Your passport must meet specific validity and condition requirements before
                  a Schengen visa can be issued. These requirements are set by the Schengen
                  Borders Code and are consistently enforced across all member states.
                </p>

                {/* Rules grid */}
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      Icon: CalendarDays as IconType,
                      title: "Minimum Validity",
                      desc: "Your passport must be valid for at least 3 months beyond your intended return date from the Schengen Area.",
                    },
                    {
                      Icon: FileText as IconType,
                      title: "Blank Pages",
                      desc: "You must have at least 2 blank visa pages available in your passport for stamps and the visa sticker.",
                    },
                    {
                      Icon: CalendarClock as IconType,
                      title: "Issue Date",
                      desc: "Passports must have been issued within the last 10 years. Expired passports cannot be used even if still showing a future expiry date.",
                    },
                  ].map((r) => (
                    <div
                      key={r.title}
                      className="rounded-2xl p-5"
                      style={{ background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}
                    >
                      <div
                        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ background: "#fff" }}
                      >
                        <r.Icon size={19} style={{ color: "var(--navy-700)" }} />
                      </div>
                      <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--navy-800)" }}>{r.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--ink-muted)" }}>{r.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold mb-3" style={{ color: "var(--ink)" }}>Your passport is acceptable if:</p>
                    <ul className="space-y-2.5">
                      <CheckItem>Valid for at least 3 months past your return date</CheckItem>
                      <CheckItem>Has 2 or more blank visa pages</CheckItem>
                      <CheckItem>Was issued within the last 10 years</CheckItem>
                      <CheckItem>Is undamaged and machine-readable</CheckItem>
                      <CheckItem>Contains your biometric chip (if issued after 2006)</CheckItem>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-3" style={{ color: "var(--ink)" }}>You will need to renew if:</p>
                    <ul className="space-y-2.5">
                      <CrossItem>Passport expires less than 3 months after your return</CrossItem>
                      <CrossItem>Fewer than 2 blank pages remaining</CrossItem>
                      <CrossItem>Passport is damaged, torn, or has water damage</CrossItem>
                      <CrossItem>Passport was issued more than 10 years ago</CrossItem>
                      <CrossItem>MRZ (machine-readable zone) is damaged</CrossItem>
                    </ul>
                  </div>
                </div>
              </InfoCard>
              </BlurFade>

              {/* ══ 7. Travel Medical Insurance ═════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="travel-insurance" />
              <InfoCard>
                <SectionLabel>Section 07</SectionLabel>
                <SectionTitle>Travel Medical Insurance</SectionTitle>

                <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  Schengen travel insurance is a <strong style={{ color: "var(--ink)" }}>mandatory requirement</strong> for
                  all visa applicants. Without a qualifying insurance policy, your application
                  will be refused. The requirements are defined in the Schengen Visa Code and
                  apply uniformly across all member states.
                </p>

                {/* Requirements */}
                <div
                  className="mt-7 rounded-2xl p-6"
                  style={{ background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}
                >
                  <p className="text-sm font-semibold mb-4" style={{ color: "var(--navy-800)" }}>
                    Mandatory Requirements — Your Policy Must:
                  </p>
                  <ul className="space-y-3">
                    <CheckItem>Provide a <strong>minimum coverage of €30,000</strong> for medical expenses and emergency repatriation</CheckItem>
                    <CheckItem>Be valid in <strong>all 27 Schengen member states</strong> (not just your destination country)</CheckItem>
                    <CheckItem>Cover the <strong>full duration</strong> of your intended stay, including entry and exit dates</CheckItem>
                    <CheckItem>Include cover for emergency <strong>hospitalisation and medical evacuation</strong></CheckItem>
                    <CheckItem>Be issued by an insurer <strong>recognised in the UK or Ireland</strong> (not an online policy from outside EU/UK)</CheckItem>
                  </ul>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                  >
                    <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ink)" }}>
                      <Check size={15} strokeWidth={3} style={{ color: "var(--navy-600)" }} /> Acceptable Policies
                    </p>
                    <ul className="space-y-2">
                      <CheckItem>Single-trip Schengen travel insurance</CheckItem>
                      <CheckItem>Multi-trip annual policies (if covering Schengen)</CheckItem>
                      <CheckItem>Policies purchased through UK or Irish insurers</CheckItem>
                      <CheckItem>Policies showing &ldquo;Schengen Zone&rdquo; as covered territory</CheckItem>
                    </ul>
                  </div>
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                  >
                    <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ink)" }}>
                      <X size={15} strokeWidth={3} style={{ color: "#dc2626" }} /> Not Acceptable
                    </p>
                    <ul className="space-y-2">
                      <CrossItem>Policies covering only one Schengen country</CrossItem>
                      <CrossItem>Policies with coverage below €30,000</CrossItem>
                      <CrossItem>Credit card travel insurance (usually insufficient)</CrossItem>
                      <CrossItem>Policies that have already started before application</CrossItem>
                    </ul>
                  </div>
                </div>

                <div className="mt-5">
                  <CalloutBox type="gold" title="We Handle This For You">
                    <p>
                      Our Platinum and Smart Travel packages include procurement of fully
                      compliant Schengen travel insurance from a recognised insurer. We provide
                      the insurance certificate in the correct format for your consulate
                      submission. No need to research or compare policies yourself.
                    </p>
                  </CalloutBox>
                </div>
              </InfoCard>
              </BlurFade>

              {/* ══ 8. Visa Fees ════════════════════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="visa-fees" />
              <InfoCard>
                <SectionLabel>Section 08</SectionLabel>
                <SectionTitle>Visa Fees</SectionTitle>

                <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  Schengen visa fees are set by EU regulation and are the same regardless of
                  the destination country. However, additional service fees are charged by
                  visa application centres (VFS Global or TLScontact) separately. All fees
                  are non-refundable regardless of the outcome.
                </p>

                {/* Fee table */}
                <div className="mt-7 overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "var(--navy-900)" }}>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white">Applicant Category</th>
                        <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-white">Visa Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat: "Adults (12 years and over)", fee: "€80 / £72", highlight: false },
                        { cat: "Children aged 6–11", fee: "€40 / £36", highlight: false },
                        { cat: "Children under 6 years", fee: "Free", highlight: false },
                        { cat: "National of certain countries (reduced fee agreements)", fee: "€35", highlight: false },
                        { cat: "VFS Global service fee (approximate)", fee: "£26–£55", highlight: true },
                        { cat: "TLScontact service fee (approximate)", fee: "£26–£45", highlight: true },
                        { cat: "Optional premium lounge / fast-track", fee: "£50–£80", highlight: true },
                      ].map((row, i) => (
                        <tr
                          key={row.cat}
                          style={{
                            background: row.highlight
                              ? "var(--navy-50)"
                              : i % 2 === 0 ? "var(--bg)" : "var(--bg-subtle)",
                            borderTop: "1px solid var(--border)",
                          }}
                        >
                          <td className="px-5 py-3.5" style={{ color: "var(--ink)" }}>{row.cat}</td>
                          <td
                            className="px-5 py-3.5 text-right font-semibold"
                            style={{ color: row.highlight ? "var(--navy-600)" : "var(--ink)" }}
                          >
                            {row.fee}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 space-y-3">
                  <CalloutBox type="warning" title="All Fees Are Non-Refundable">
                    <p>
                      Visa fees are payable at the time of application and are non-refundable
                      regardless of whether your visa is approved or refused. VAC service fees
                      are also non-refundable. Ensure your application is complete and accurate
                      before submission.
                    </p>
                  </CalloutBox>
                  <CalloutBox type="info" title="Payment Methods">
                    <p>
                      Most visa application centres in the UK and Ireland accept debit and
                      credit cards. Some consulates may require payment in cash or by bank
                      transfer. We confirm the accepted payment method for your specific
                      appointment when preparing your file.
                    </p>
                  </CalloutBox>
                </div>
              </InfoCard>
              </BlurFade>

              {/* ══ 9. Processing Times ═════════════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="processing-times" />
              <InfoCard>
                <SectionLabel>Section 09</SectionLabel>
                <SectionTitle>Processing Times</SectionTitle>

                <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  Processing times vary by destination country, time of year, and individual
                  consulate workload. The Schengen Visa Code sets a maximum processing time
                  of 15 calendar days from the date of application, extendable to 30 or in
                  exceptional cases 60 days. The times below reflect typical real-world
                  processing from UK and Ireland application centres.
                </p>

                {/* Processing times grid */}
                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { country: "France",       typical: "5–10 days",   peak: "10–20 days" },
                    { country: "Germany",      typical: "5–10 days",   peak: "10–15 days" },
                    { country: "Spain",        typical: "7–15 days",   peak: "15–25 days" },
                    { country: "Italy",        typical: "5–15 days",   peak: "15–30 days" },
                    { country: "Netherlands",  typical: "5–10 days",   peak: "10–15 days" },
                    { country: "Greece",       typical: "7–15 days",   peak: "15–25 days" },
                    { country: "Austria",      typical: "5–10 days",   peak: "10–15 days" },
                    { country: "Portugal",     typical: "10–15 days",  peak: "15–20 days" },
                    { country: "Belgium",      typical: "5–10 days",   peak: "10–20 days" },
                    { country: "Switzerland",  typical: "10–15 days",  peak: "15–25 days" },
                    { country: "Sweden",       typical: "7–15 days",   peak: "15–20 days" },
                    { country: "Poland",       typical: "5–10 days",   peak: "10–15 days" },
                  ].map((p) => (
                    <div
                      key={p.country}
                      className="rounded-xl p-4"
                      style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                    >
                      <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ink)" }}>
                        <MapPin size={14} style={{ color: "var(--navy-500)" }} />
                        {p.country}
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span style={{ color: "var(--ink-light)" }}>Standard</span>
                          <span className="font-medium" style={{ color: "var(--navy-600)" }}>{p.typical}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span style={{ color: "var(--ink-light)" }}>Peak season</span>
                          <span className="font-medium" style={{ color: "var(--gold-500)" }}>{p.peak}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <CalloutBox type="warning" title="Do Not Book Non-Refundable Travel Before Visa Approval">
                    <p>
                      We strongly advise against purchasing non-refundable flight tickets or
                      hotel bookings until your visa has been approved. Processing times are
                      estimates — consulates can take longer without notice, particularly during
                      peak travel periods. Use flight and hotel reservations (not purchases)
                      in your application.
                    </p>
                  </CalloutBox>
                </div>
              </InfoCard>
              </BlurFade>

              {/* ══ 10. Our Support Process ═════════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="our-support" />
              <InfoCard style={{ borderColor: "var(--navy-100)", background: "var(--navy-50)" }}>
                <SectionLabel>Section 10</SectionLabel>
                <SectionTitle>How We Support Your Application</SectionTitle>

                <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  Schengen Journey provides end-to-end Schengen visa appointment support and
                  documentation services for applicants from the UK and Ireland. We do not
                  submit applications on your behalf — you attend your appointment in person —
                  but we handle every other aspect of the process.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Appointment Scheduling",
                      desc: "We monitor available appointment slots at VFS Global, TLScontact, and consulates for your destination country and location. We secure the earliest suitable appointment and guide you through the booking confirmation process.",
                    },
                    {
                      step: "02",
                      title: "Personalised Document Checklist",
                      desc: "Based on your nationality, destination, purpose of travel, and employment status, we provide a tailored document checklist. Each item is explained clearly so you know exactly what to obtain and in what format.",
                    },
                    {
                      step: "03",
                      title: "Document Review",
                      desc: "Once you have gathered your documents, our team reviews each one for completeness, accuracy, and compliance with consulate requirements. We flag any issues before your appointment, not on the day.",
                    },
                    {
                      step: "04",
                      title: "Supporting Documents",
                      desc: "Depending on your package, we provide flight reservations, hotel reservations, travel medical insurance, and a professionally written cover letter — all produced to consulate-accepted standards.",
                    },
                    {
                      step: "05",
                      title: "Application Tracking & Support",
                      desc: "After your appointment, you can track your application status in real time through your Schengen Journey dashboard. Our team monitors your case and keeps you updated at every stage from submission to decision.",
                    },
                  ].map((s) => (
                    <div
                      key={s.step}
                      className="flex gap-5 rounded-2xl p-5"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold text-white"
                        style={{ background: "var(--navy-700)" }}
                      >
                        {s.step}
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--ink)" }}>{s.title}</p>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/book" className="btn btn-navy px-7 py-3 text-sm">
                    Book Appointment Support
                  </Link>
                  <Link href="/pricing" className="btn btn-outline-navy px-7 py-3 text-sm">
                    View Packages & Pricing
                  </Link>
                </div>
              </InfoCard>
              </BlurFade>

              {/* ══ 11. Disclaimer ══════════════════════════════════════════ */}
              <BlurFade delay={0.05}>
              <SectionAnchor id="disclaimer" />
              <div
                className="rounded-2xl p-6 sm:p-7"
                style={{
                  background: "#fafafa",
                  border: "1px solid var(--border)",
                  borderLeft: "4px solid var(--navy-200)",
                }}
              >
                <SectionLabel>Section 11</SectionLabel>
                <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>
                  Important Disclaimer
                </h2>
                <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  <p>
                    The information provided on this page is for <strong style={{ color: "var(--ink)" }}>general guidance
                    purposes only</strong> and reflects the standard requirements for Schengen visa
                    applications from the United Kingdom and Republic of Ireland at the time of
                    publication. Requirements, fees, processing times, and procedures are subject
                    to change by the European Commission, individual member state consulates, or
                    visa application centre operators without notice.
                  </p>
                  <p>
                    <strong style={{ color: "var(--ink)" }}>Schengen Journey is a visa support and appointment
                    scheduling service.</strong> We are not a law firm, immigration adviser, or
                    authorised legal representative. We do not submit visa applications on behalf
                    of clients. The decision to grant or refuse a Schengen visa rests entirely
                    with the relevant consulate or embassy, and we make no representations or
                    guarantees regarding visa outcomes.
                  </p>
                  <p>
                    Applicants are solely responsible for ensuring they meet the eligibility
                    requirements for the visa category they are applying for and that all documents
                    submitted are genuine and accurate. Submitting false or misleading information
                    to a consulate is a serious offence and may result in a visa ban and legal
                    consequences.
                  </p>
                  <p>
                    For legal immigration advice specific to your circumstances, please consult a
                    regulated immigration adviser (OISC-registered in the UK, or registered with
                    the Law Society of Ireland).
                  </p>
                </div>
              </div>
              </BlurFade>

            </article>
          </div>
        </Container>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section
        className="py-14 relative overflow-hidden"
        style={{ background: "var(--navy-900)" }}
      >
        <Meteors number={10} />
        <Container>
          <BlurFade delay={0.05}>
          <div className="flex flex-col items-center text-center gap-5 sm:flex-row sm:text-left sm:justify-between">
            <div>
              <p className="font-semibold text-lg text-white">
                Ready to start your Schengen visa journey?
              </p>
              <p className="text-sm mt-1" style={{ color: "rgba(240,244,255,0.55)" }}>
                Book appointment support from the UK or Ireland — all packages include real-time tracking.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
              <Link href="/book" className="btn btn-gold px-7 py-3 text-sm whitespace-nowrap">
                Book Appointment
              </Link>
              <Link href="/pricing" className="btn btn-outline-white px-7 py-3 text-sm whitespace-nowrap">
                View Pricing
              </Link>
            </div>
          </div>
          </BlurFade>
        </Container>
      </section>

      {/* TOC hover style */}
      <style>{`
        .toc-link:hover { color: var(--navy-700); background: var(--navy-50); }
      `}</style>
    </>
  );
}
