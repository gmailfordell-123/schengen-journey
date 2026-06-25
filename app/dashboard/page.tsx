import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Clock, CheckCircle2, ArrowRight, Plus, Activity, User } from "lucide-react";
import { getMyAppointments, getDashboardStats } from "@/lib/actions/user";

export const metadata: Metadata = { title: "Dashboard" };

const PKG_LABEL: Record<string, string> = {
  essential_start:        "Essential Start",
  smart_travel_plan:      "Smart Travel Plan",
  platinum_complete_plan: "Platinum Complete Plan",
};

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/25",
  confirmed: "bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/25",
  completed: "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/25",
  cancelled: "bg-red-400/10 text-red-400 ring-1 ring-red-400/25",
};

const card = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 4px 24px rgba(4,12,26,0.30), inset 0 1px 0 rgba(255,255,255,0.10)",
} as const;

export default async function DashboardPage() {
  const [stats, appointments] = await Promise.all([
    getDashboardStats(),
    getMyAppointments(),
  ]);

  const recent = appointments.slice(0, 4);

  const statCards = [
    { label: "Total bookings",       value: stats.total,           icon: CalendarCheck, iconColor: "text-blue-400",    iconBg: "rgba(59,130,246,0.12)"  },
    { label: "Pending",              value: stats.pending,         icon: Clock,         iconColor: "text-amber-400",   iconBg: "rgba(245,158,11,0.12)"  },
    { label: "Days to appointment",  value: stats.upcoming_days ?? "—", icon: CheckCircle2, iconColor: "text-emerald-400", iconBg: "rgba(16,185,129,0.12)" },
  ];

  const quickActions = [
    { label: "New booking",      href: "/book",              Icon: Plus,     primary: true  },
    { label: "Track status",     href: "/dashboard/status",  Icon: Activity, primary: false },
    { label: "Edit profile",     href: "/dashboard/profile", Icon: User,     primary: false },
  ];

  return (
    <div className="space-y-5">

      {/* ── Stat cards ── */}
      <div className="grid gap-3 sm:grid-cols-3">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl p-4" style={card}>
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: s.iconBg }}
              >
                <s.icon size={17} className={s.iconColor} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium" style={{ color: "rgba(240,244,255,0.50)" }}>
                  {s.label}
                </p>
                <p className="text-xl font-bold leading-tight text-white">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent bookings ── */}
      <div className="rounded-xl" style={card}>
        <div className="flex items-center justify-between border-b px-4 py-3.5"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <h2 className="text-sm font-semibold text-white">Recent bookings</h2>
          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--gold-500)" }}
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <CalendarCheck size={28} style={{ color: "rgba(240,244,255,0.18)" }} />
            <p className="text-sm" style={{ color: "rgba(240,244,255,0.38)" }}>No bookings yet</p>
            <Link
              href="/book"
              className="rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{ background: "var(--gold-500)", color: "var(--navy-900)" }}
            >
              Book your first appointment
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {recent.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {PKG_LABEL[apt.package] ?? apt.package}
                  </p>
                  <p className="mt-0.5 truncate text-xs" style={{ color: "rgba(240,244,255,0.45)" }}>
                    {apt.reference} · {apt.destination}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[apt.status] ?? ""}`}>
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick actions ── */}
      <div className="rounded-xl p-4" style={card}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "rgba(240,244,255,0.38)" }}>Quick actions</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
              style={
                action.primary
                  ? { background: "var(--gold-500)", color: "var(--navy-900)" }
                  : { background: "rgba(255,255,255,0.07)", color: "rgba(240,244,255,0.80)", border: "1px solid rgba(255,255,255,0.10)" }
              }
            >
              <action.Icon size={13} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
