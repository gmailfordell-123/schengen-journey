import type { Metadata } from "next";
import { Plane, Star } from "lucide-react";

export const metadata: Metadata = { title: "Design System" };

/* ── Small presentational helpers (local to this page) ──────────────────── */

function Section({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-strong)]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, className, hex }: { name: string; className: string; hex: string }) {
  return (
    <div className="space-y-1.5">
      <div className={`h-16 rounded-xl border border-white/10 ${className}`} />
      <p className="text-xs font-semibold text-[var(--text-base)]">{name}</p>
      <p className="font-mono text-[10px] text-[var(--text-muted)]">{hex}</p>
    </div>
  );
}

const BRAND = [
  ["brand-300", "bg-brand-300", "#a5b4fc"],
  ["brand-400", "bg-brand-400", "#818cf8"],
  ["brand-500", "bg-brand-500", "#6366f1"],
  ["brand-600", "bg-brand-600", "#4f46e5"],
  ["brand-700", "bg-brand-700", "#4338ca"],
];

const ACCENT = [
  ["accent-300", "bg-accent-300", "#d8b4fe"],
  ["accent-400", "bg-accent-400", "#c084fc"],
  ["accent-500", "bg-accent-500", "#a855f7"],
  ["accent-600", "bg-accent-600", "#9333ea"],
  ["accent-700", "bg-accent-700", "#7e22ce"],
];

const SURFACES = [
  ["surface-0", "bg-surface-0", "#0a0a12"],
  ["surface-1", "bg-surface-1", "#11111d"],
  ["surface-2", "bg-surface-2", "#181826"],
  ["surface-3", "bg-surface-3", "#222236"],
];

export default function StyleGuidePage() {
  return (
    <main className="app-dark min-h-screen w-full">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">

        {/* Header */}
        <header className="space-y-3">
          <p className="font-manrope text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
            Schengen Journey · UI Upgrade
          </p>
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Design System</span>
          </h1>
          <p className="max-w-xl text-[var(--text-base)]">
            Modern SaaS aesthetic — dark canvas, blue→purple gradient accent,
            glassmorphism cards, xl radii and soft shadows. This page is the
            living reference for the new look.
          </p>
        </header>

        {/* Colour — primary */}
        <Section title="Primary — Indigo" subtitle="Bridges blue & purple. Used via the existing brand-* tokens.">
          <div className="grid grid-cols-5 gap-3">
            {BRAND.map(([n, c, h]) => <Swatch key={n} name={n} className={c} hex={h} />)}
          </div>
        </Section>

        {/* Colour — accent */}
        <Section title="Accent — Violet" subtitle="Secondary highlights, the warm end of the gradient.">
          <div className="grid grid-cols-5 gap-3">
            {ACCENT.map(([n, c, h]) => <Swatch key={n} name={n} className={c} hex={h} />)}
          </div>
        </Section>

        {/* Gradient */}
        <Section title="Gradient accent" subtitle="blue · #3b82f6 → indigo · #6366f1 → purple · #a855f7">
          <div className="gradient-bg h-24 rounded-2xl shadow-[0_18px_50px_-12px_rgba(124,58,237,0.5)]" />
        </Section>

        {/* Surfaces */}
        <Section title="Dark surfaces" subtitle="Layered backgrounds: page → raised → card → hover.">
          <div className="grid grid-cols-4 gap-3">
            {SURFACES.map(([n, c, h]) => <Swatch key={n} name={n} className={c} hex={h} />)}
          </div>
        </Section>

        {/* Glass cards */}
        <Section title="Glassmorphism cards" subtitle=".glass-card / .glass-card-strong — frosted, bordered, soft-shadowed.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="glass-card p-6">
              <div className="gradient-bg mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"><Plane size={20} /></div>
              <h3 className="text-lg font-semibold text-[var(--text-strong)]">Glass card</h3>
              <p className="mt-1 text-sm text-[var(--text-base)]">
                Frosted translucent surface over the dark canvas. The default
                card for the new UI.
              </p>
            </div>
            <div className="glass-card-strong gradient-border p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white"><Star size={20} /></div>
              <h3 className="text-lg font-semibold text-[var(--text-strong)]">Strong + gradient edge</h3>
              <p className="mt-1 text-sm text-[var(--text-base)]">
                Heavier blur with a 1px gradient hairline border — for featured
                or highlighted blocks.
              </p>
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons" subtitle="Gradient primary, glass secondary, ghost tertiary.">
          <div className="flex flex-wrap items-center gap-4">
            <button className="btn-gradient px-6 py-3 text-sm font-semibold">Get started</button>
            <button className="glass-card px-6 py-3 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:bg-white/10">
              Secondary
            </button>
            <button className="px-6 py-3 text-sm font-semibold text-[var(--text-base)] transition-colors hover:text-[var(--text-strong)]">
              Ghost →
            </button>
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography" subtitle="Fredoka display · Poppins body · Manrope labels · Fragment Mono figures.">
          <div className="glass-card space-y-3 p-6">
            <p className="font-manrope text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Eyebrow label</p>
            <h3 className="text-3xl font-bold text-[var(--text-strong)]">Display heading <span className="gradient-text">in Fredoka</span></h3>
            <p className="text-[var(--text-base)]">
              Body copy in Poppins — calm, readable, and comfortable at long
              lengths. This is the workhorse text style across the product.
            </p>
            <p className="font-mono text-sm text-[var(--text-muted)]">SJ-4F9A21 · monospace figures</p>
          </div>
        </Section>

        {/* Radius + shadow */}
        <Section title="Radius & shadows" subtitle="xl rounded corners and layered soft shadows.">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              ["rounded-xl", "rounded-xl"],
              ["rounded-2xl", "rounded-2xl"],
              ["shadow-soft", "rounded-2xl shadow-soft"],
              ["shadow-glow", "rounded-2xl glow"],
            ].map(([label, cls]) => (
              <div key={label} className="space-y-2">
                <div className={`flex h-20 items-center justify-center bg-surface-2 text-xs text-[var(--text-muted)] ${cls}`}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </main>
  );
}
