import type { Metadata } from "next";
import Link from "next/link";
import { mockAppointments, statusColors } from "@/lib/mockData";

export const metadata: Metadata = { title: "Admin" };

const statusCounts = mockAppointments.reduce(
  (acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);

const stats = [
  { label: "Total appointments", value: mockAppointments.length },
  { label: "Under review", value: statusCounts["Under Review"] ?? 0 },
  { label: "Approved", value: statusCounts["Approved"] ?? 0 },
  { label: "Docs required", value: statusCounts["Documents Required"] ?? 0 },
];

export default function AdminPage() {
  const recent = mockAppointments.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Recent appointments</h2>
          <Link
            href="/admin/appointments"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Package</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((apt) => (
                <tr
                  key={apt.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">
                      {apt.customerName}
                    </p>
                    <p className="text-xs text-slate-400">{apt.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{apt.package}</td>
                  <td className="px-6 py-4 text-slate-700">{apt.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[apt.status]}`}
                    >
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
