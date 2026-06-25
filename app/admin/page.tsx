import type { Metadata } from "next";
import Link from "next/link";
import { getAdminStats } from "@/lib/actions/admin";
import type { AppointmentStatus } from "@/lib/supabase/types";
import {
  Users, CalendarCheck, CheckCircle2, Clock, XCircle, TrendingUp, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = { title: "Admin — Overview" };

const PKG_LABEL: Record<string, string> = {
  essential_start:        "Essential Start",
  smart_travel_plan:      "Smart Travel Plan",
  platinum_complete_plan: "Platinum Complete",
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending:   "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/25",
  confirmed: "bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/25",
  completed: "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/25",
  cancelled: "bg-red-400/10 text-red-400 ring-1 ring-red-400/25",
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending:   "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const card = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 4px 24px rgba(4,12,26,0.30), inset 0 1px 0 rgba(255,255,255,0.10)",
} as const;

export default async function AdminPage() {
  const stats = await getAdminStats();

  const statCards = [
    { label: "Total Bookings", value: stats.total,                        icon: CalendarCheck, iconColor: "text-blue-400",   iconBg: "rgba(59,130,246,0.12)"  },
    { label: "Pending",        value: stats.pending,                      icon: Clock,         iconColor: "text-amber-400",  iconBg: "rgba(245,158,11,0.12)"  },
    { label: "Confirmed",      value: stats.confirmed,                    icon: CheckCircle2,  iconColor: "text-emerald-400",iconBg: "rgba(16,185,129,0.12)"  },
    { label: "Revenue (£)",    value: `£${stats.revenue.toLocaleString()}`, icon: TrendingUp,  iconColor: "text-purple-400", iconBg: "rgba(168,85,247,0.12)"  },
  ];

  const secondRow = [
    { label: "Completed", value: stats.completed, icon: CheckCircle2, iconColor: "text-emerald-400", iconBg: "rgba(16,185,129,0.10)" },
    { label: "Cancelled",  value: stats.cancelled,  icon: XCircle,      iconColor: "text-red-400",     iconBg: "rgba(239,68,68,0.10)"  },
  ];

  return (
    <div className="space-y-5">

      {/* ── Primary stats — 2 cols mobile → 4 cols desktop ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl p-4" style={card}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium" style={{ color: "rgba(240,244,255,0.48)" }}>
                {s.label}
              </p>
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: s.iconBg }}
              >
                <s.icon size={14} className={s.iconColor} />
              </span>
            </div>
            <p className="text-2xl font-bold leading-none text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Secondary stats — Completed / Cancelled ── */}
      <div className="grid grid-cols-2 gap-3">
        {secondRow.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl px-4 py-3" style={card}>
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: s.iconBg }}
            >
              <s.icon size={15} className={s.iconColor} />
            </span>
            <div>
              <p className="text-xs" style={{ color: "rgba(240,244,255,0.45)" }}>{s.label}</p>
              <p className="text-lg font-bold leading-tight text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent bookings table ── */}
      <div className="rounded-xl overflow-hidden" style={card}>
        <div className="flex items-center justify-between border-b px-4 py-3.5"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <h2 className="text-sm font-semibold text-white">Recent Bookings</h2>
          <Link
            href="/admin/appointments"
            className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--gold-500)" }}
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12"
            style={{ color: "rgba(240,244,255,0.30)" }}>
            <Users size={28} className="opacity-40" />
            <p className="text-sm">No bookings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide"
                  style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(240,244,255,0.38)" }}>
                  <th className="px-4 py-2.5">Ref</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="hidden px-4 py-2.5 sm:table-cell">Package</th>
                  <th className="hidden px-4 py-2.5 md:table-cell">Dest.</th>
                  <th className="hidden px-4 py-2.5 lg:table-cell">Date</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {stats.recent.map((apt) => (
                  <tr
                    key={apt.id}
                    className="transition-colors"
                    style={{ color: "rgba(240,244,255,0.80)" }}
                  >
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "rgba(240,244,255,0.45)" }}>
                      {apt.reference}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white leading-tight">{apt.customer_name || "—"}</p>
                      <p className="text-xs truncate max-w-[140px]" style={{ color: "rgba(240,244,255,0.42)" }}>
                        {apt.customer_email}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 text-xs sm:table-cell">
                      {PKG_LABEL[apt.package] ?? apt.package}
                    </td>
                    <td className="hidden px-4 py-3 text-xs md:table-cell">{apt.destination}</td>
                    <td className="hidden px-4 py-3 text-xs lg:table-cell"
                      style={{ color: "rgba(240,244,255,0.45)" }}>
                      {apt.created_at.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[apt.status]}`}>
                        {STATUS_LABEL[apt.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
