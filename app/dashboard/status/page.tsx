"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, CheckCircle2, BadgeCheck, XCircle, ClipboardList } from "lucide-react";
import type { TrackedAppointment } from "@/lib/actions/tracking";
import { getUserAppointmentsWithHistory } from "@/lib/actions/tracking";
import { createBrowserClient } from "@supabase/ssr";
import type { Database, AppointmentStatus } from "@/lib/supabase/types";

type IconType = React.ComponentType<{ size?: number | string; className?: string }>;

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending:   "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending:   "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_ICON: Record<AppointmentStatus, IconType> = {
  pending:   Clock,
  confirmed: CheckCircle2,
  completed: BadgeCheck,
  cancelled: XCircle,
};

function StatusIcon({ status, size = 14 }: { status: AppointmentStatus; size?: number }) {
  const Icon = STATUS_ICON[status];
  return <Icon size={size} />;
}

const PKG_LABEL: Record<string, string> = {
  essential_start:        "Essential Start",
  smart_travel_plan:      "Smart Travel Plan",
  platinum_complete_plan: "Platinum Complete Plan",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function TimelineStep({
  entry,
  isLast,
}: {
  entry: TrackedAppointment["history"][number];
  isLast: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-2 ring-brand-100">
          <StatusIcon status={entry.new_status} />
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-slate-200" />}
      </div>
      <div className="pb-5">
        <p className="font-semibold text-slate-900">
          Status changed to{" "}
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[entry.new_status]}`}
          >
            {STATUS_LABEL[entry.new_status]}
          </span>
        </p>
        {entry.notes && (
          <p className="mt-1 text-sm text-slate-600">{entry.notes}</p>
        )}
        <p className="mt-1 text-xs text-slate-400">
          {formatDate(entry.created_at)}
          {entry.changed_by_name ? ` · by ${entry.changed_by_name}` : ""}
        </p>
      </div>
    </div>
  );
}

export default function StatusPage() {
  const [appointments, setAppointments] = useState<TrackedAppointment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  // ref to track if initial auto-select has fired
  const didAutoSelect = useRef(false);

  async function load() {
    const data = await getUserAppointmentsWithHistory();
    setAppointments(data);
    setLoading(false);
    if (!didAutoSelect.current && data.length > 0) {
      setSelectedId(data[0].id);
      didAutoSelect.current = true;
    }
  }

  useEffect(() => {
    // load() is async — state is set after the await, so there is no
    // synchronous render cascade here (it's an initial data fetch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();

    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const channel = supabase
      .channel("user-appointments-status")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "appointments" }, () => { load(); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "status_history" }, () => { load(); })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, []);

  const selected = appointments.find((a) => a.id === selectedId) ?? null;

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        Loading status…
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <ClipboardList size={28} className="mx-auto text-slate-400" />
        <p className="mt-2 font-semibold text-slate-900">No appointments yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Once you book an appointment, its status will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-white">Application status</h1>

      <div className="flex gap-6">
        {/* Sidebar: appointment list */}
        <div className="w-72 shrink-0 space-y-3">
          {appointments.map((apt) => (
            <button
              key={apt.id}
              type="button"
              onClick={() => setSelectedId(apt.id)}
              className={`w-full rounded-2xl border p-4 text-left transition-all ${
                selectedId === apt.id
                  ? "border-brand-300 bg-brand-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-slate-500">{apt.reference}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[apt.status]}`}
                >
                  {STATUS_LABEL[apt.status]}
                </span>
              </div>
              <p className="mt-1 font-semibold text-slate-900">{apt.destination}</p>
              <p className="text-xs text-slate-400">{PKG_LABEL[apt.package] ?? apt.package}</p>
              <p className="mt-1 text-xs text-slate-400">Booked {formatDate(apt.created_at)}</p>
            </button>
          ))}
        </div>

        {/* Main: details + timeline */}
        {selected && (
          <div className="flex-1 space-y-4">
            {/* Summary card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {PKG_LABEL[selected.package] ?? selected.package}
                  </p>
                  <h2 className="mt-0.5 text-xl font-bold text-slate-900">
                    {selected.destination}
                  </h2>
                  <p className="mt-1 font-mono text-sm text-slate-400">{selected.reference}</p>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold ${STATUS_COLORS[selected.status]}`}
                >
                  <StatusIcon status={selected.status} size={15} />
                  {STATUS_LABEL[selected.status]}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  ["Travel from", formatDate(selected.travel_date_from)],
                  ["Travel to",   formatDate(selected.travel_date_to)],
                  ["Booked",      formatDate(selected.created_at)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-semibold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* History timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="mb-5 font-semibold text-slate-900">Status history</p>
              {selected.history.length === 0 ? (
                <p className="text-sm text-slate-400">No status changes yet.</p>
              ) : (
                <div>
                  {selected.history.map((entry, idx) => (
                    <TimelineStep
                      key={entry.id}
                      entry={entry}
                      isLast={idx === selected.history.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Updates in real-time — no need to refresh.
      </p>
    </div>
  );
}
