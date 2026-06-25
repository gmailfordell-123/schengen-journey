import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Plus } from "lucide-react";
import { getMyAppointments } from "@/lib/actions/user";

export const metadata: Metadata = { title: "My Appointments" };

const PKG_LABEL: Record<string, string> = {
  essential_start:        "Essential Start",
  smart_travel_plan:      "Smart Travel Plan",
  platinum_complete_plan: "Platinum Complete Plan",
};

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export default async function AppointmentsPage() {
  const appointments = await getMyAppointments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">My appointments</h1>
        <Link
          href="/book"
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--gold-500)", color: "var(--navy-900)" }}
        >
          <Plus size={15} />
          New booking
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl py-20"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <CalendarCheck size={40} style={{ color: "rgba(240,244,255,0.20)" }} />
          <p className="text-sm" style={{ color: "rgba(240,244,255,0.45)" }}>
            You have no appointments yet
          </p>
          <Link
            href="/book"
            className="mt-1 rounded-xl px-5 py-2.5 text-sm font-semibold"
            style={{ background: "var(--gold-500)", color: "var(--navy-900)" }}
          >
            Book your first appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const primary = apt.applicants.find(a => a.is_primary) ?? apt.applicants[0];
            return (
              <div
                key={apt.id}
                className="rounded-2xl p-5"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "0 4px 20px rgba(4,12,26,0.30)",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-white">{PKG_LABEL[apt.package] ?? apt.package}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[apt.status] ?? ""}`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-mono" style={{ color: "rgba(240,244,255,0.45)" }}>
                      Ref: {apt.reference}
                    </p>
                  </div>
                  <div className="text-right text-sm" style={{ color: "rgba(240,244,255,0.55)" }}>
                    {apt.appointment_date ? (
                      <>
                        <p className="font-medium text-white">{apt.appointment_date}</p>
                        {apt.appointment_time && <p>{apt.appointment_time}</p>}
                      </>
                    ) : (
                      <p className="text-xs italic" style={{ color: "rgba(240,244,255,0.35)" }}>
                        Date TBC
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="mt-4 grid gap-3 pt-4 text-sm sm:grid-cols-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div>
                    <p className="text-xs" style={{ color: "rgba(240,244,255,0.42)" }}>Destination</p>
                    <p className="font-medium text-white">{apt.destination}</p>
                  </div>
                  {primary && (
                    <>
                      <div>
                        <p className="text-xs" style={{ color: "rgba(240,244,255,0.42)" }}>Passport no.</p>
                        <p className="font-mono font-medium text-white">{primary.passport_no}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "rgba(240,244,255,0.42)" }}>Nationality</p>
                        <p className="font-medium text-white">{primary.nationality}</p>
                      </div>
                    </>
                  )}
                </div>

                {apt.applicants.length > 1 && (
                  <p className="mt-3 text-xs" style={{ color: "rgba(240,244,255,0.40)" }}>
                    +{apt.applicants.length - 1} additional applicant{apt.applicants.length > 2 ? "s" : ""}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
