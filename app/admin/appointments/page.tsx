"use client";

import { useState, useEffect, useTransition } from "react";
import { X } from "lucide-react";
import type { AdminAppointment } from "@/lib/actions/admin";
import { getAdminAppointments, updateAppointmentStatus, updateAppointmentNotes } from "@/lib/actions/admin";
import type { AppointmentStatus } from "@/lib/supabase/types";

const ALL_STATUSES: AppointmentStatus[] = [
  "pending", "confirmed", "completed", "cancelled",
];

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

const PKG_LABEL: Record<string, string> = {
  essential_start:        "Essential Start",
  smart_travel_plan:      "Smart Travel Plan",
  platinum_complete_plan: "Platinum Complete Plan",
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [notesDraft, setNotesDraft]     = useState("");
  const [saveMsg, setSaveMsg]           = useState("");
  const [isPending, startTransition]    = useTransition();

  // Load appointments
  useEffect(() => {
    getAdminAppointments().then((data) => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  const selected = appointments.find((a) => a.id === selectedId) ?? null;

  // Keep notes draft in sync when selection changes
  useEffect(() => {
    setNotesDraft(selected?.notes ?? "");
    setSaveMsg("");
  }, [selectedId, selected?.notes]);

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.user.first_name.toLowerCase().includes(q) ||
      a.user.last_name.toLowerCase().includes(q) ||
      a.user.email.toLowerCase().includes(q) ||
      a.reference.toLowerCase().includes(q) ||
      a.destination.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleStatusChange(apt: AdminAppointment, newStatus: AppointmentStatus) {
    // Optimistic update
    setAppointments((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: newStatus } : a))
    );
    startTransition(async () => {
      const res = await updateAppointmentStatus(apt.id, newStatus, notesDraft || undefined);
      if (!res.success) {
        // Revert on failure
        setAppointments((prev) =>
          prev.map((a) => (a.id === apt.id ? { ...a, status: apt.status } : a))
        );
      }
    });
  }

  function handleSaveNotes() {
    if (!selected) return;
    startTransition(async () => {
      const res = await updateAppointmentNotes(selected.id, notesDraft);
      setSaveMsg(res.success ? "Saved" : "Failed to save");
      if (res.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === selected.id ? { ...a, notes: notesDraft } : a))
        );
      }
    });
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        Loading appointments…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-white">All appointments</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name, email, ref…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | "all")}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-500"
        >
          <option value="all">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
        {(search || statusFilter !== "all") && (
          <button
            type="button"
            onClick={() => { setSearch(""); setStatusFilter("all"); }}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-500 hover:text-slate-900"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="min-w-0 flex-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Ref</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Package</th>
                <th className="px-5 py-3">Destination</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    No appointments found.
                  </td>
                </tr>
              )}
              {filtered.map((apt) => (
                <tr
                  key={apt.id}
                  onClick={() => setSelectedId(apt.id === selectedId ? null : apt.id)}
                  className={`cursor-pointer border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50 ${
                    selectedId === apt.id ? "bg-brand-50" : ""
                  }`}
                >
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{apt.reference}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900">
                      {apt.user.first_name} {apt.user.last_name}
                    </p>
                    <p className="text-xs text-slate-400">{apt.user.email}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{PKG_LABEL[apt.package] ?? apt.package}</td>
                  <td className="px-5 py-3 text-slate-700">{apt.destination}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{apt.created_at.slice(0, 10)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[apt.status]}`}>
                      {STATUS_LABEL[apt.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 shrink-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">
                {selected.user.first_name} {selected.user.last_name}
              </p>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              {[
                ["Ref",         selected.reference],
                ["Email",       selected.user.email],
                ["Phone",       selected.user.phone ?? "—"],
                ["Package",     PKG_LABEL[selected.package] ?? selected.package],
                ["Destination", selected.destination],
                ["Travel from", selected.travel_date_from ?? "—"],
                ["Travel to",   selected.travel_date_to ?? "—"],
                ["Booked",      selected.created_at.slice(0, 10)],
              ].map(([label, value]) => (
                <div key={label}>
                  <span className="text-xs text-slate-400">{label}</span>
                  <p className="font-medium text-slate-900 break-all">{value}</p>
                </div>
              ))}
            </div>

            {/* Applicants */}
            {selected.applicants.length > 0 && (
              <div className="border-t border-slate-100 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Applicants
                </p>
                {selected.applicants.map((ap) => (
                  <div key={ap.id} className="mb-1 text-xs text-slate-700">
                    {ap.first_name} {ap.last_name}
                    {ap.is_primary && <span className="ml-1 text-brand-600">(primary)</span>}
                    <span className="ml-1 font-mono text-slate-400">· {ap.passport_no}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Status update */}
            <div className="border-t border-slate-100 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Update status
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ALL_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={isPending || selected.status === s}
                    onClick={() => handleStatusChange(selected, s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                      selected.status === s
                        ? STATUS_COLORS[s]
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="border-t border-slate-100 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Admin notes
              </p>
              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => { setNotesDraft(e.target.value); setSaveMsg(""); }}
                placeholder="Internal notes…"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 resize-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-emerald-600">{saveMsg}</span>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleSaveNotes}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  {isPending ? "Saving…" : "Save notes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Showing {filtered.length} of {appointments.length} appointments
      </p>
    </div>
  );
}
