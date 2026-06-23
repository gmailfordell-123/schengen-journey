import type { Metadata } from "next";
import Link from "next/link";
import { mockAppointments, statusColors } from "@/lib/mockData";

export const metadata: Metadata = { title: "Dashboard" };

const stats = [
  { label: "Total applications", value: "2" },
  { label: "Days to next appointment", value: "19" },
  { label: "Documents pending", value: "3" },
];

export default function DashboardPage() {
  const recent = mockAppointments.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent appointments</h2>
          <Link
            href="/dashboard/appointments"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {recent.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {apt.package}
                </p>
                <p className="text-xs text-slate-500">
                  {apt.date} · {apt.destination}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[apt.status]}`}
              >
                {apt.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-slate-900">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/book"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Book new appointment
          </Link>
          <Link
            href="/dashboard/status"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Track application
          </Link>
          <Link
            href="/dashboard/profile"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit profile
          </Link>
        </div>
      </div>
    </div>
  );
}
