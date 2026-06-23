import type { Metadata } from "next";
import Link from "next/link";
import { mockAppointments, statusColors } from "@/lib/mockData";

export const metadata: Metadata = { title: "My Appointments" };

const myAppointments = mockAppointments.slice(0, 3);

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">My appointments</h1>
        <Link
          href="/book"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + New booking
        </Link>
      </div>

      <div className="space-y-4">
        {myAppointments.map((apt) => (
          <div
            key={apt.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-slate-900">{apt.package}</p>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold ${statusColors[apt.status]}`}
                  >
                    {apt.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Ref: <span className="font-mono">{apt.id}</span>
                </p>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p className="font-medium text-slate-900">{apt.date}</p>
                <p>{apt.time}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-400">Destination</p>
                <p className="font-medium text-slate-900">{apt.destination}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Passport no.</p>
                <p className="font-mono font-medium text-slate-900">
                  {apt.passportNo}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Nationality</p>
                <p className="font-medium text-slate-900">{apt.nationality}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
