"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Users, Mail, Phone, Globe, Calendar } from "lucide-react";
import { getAdminCustomers } from "@/lib/actions/admin";
import type { AdminCustomer } from "@/lib/actions/admin";
import type { AppointmentStatus } from "@/lib/supabase/types";

const PKG_LABEL: Record<string, string> = {
  essential_start:        "Essential Start",
  smart_travel_plan:      "Smart Travel Plan",
  platinum_complete_plan: "Platinum Complete Plan",
};

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

function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    getAdminCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        !q ||
        c.first_name.toLowerCase().includes(q) ||
        c.last_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.nationality ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  const selected = selectedId ? customers.find((c) => c.id === selectedId) ?? null : null;

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        Loading customers…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(240,244,255,0.50)" }}>
          {customers.length} registered customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, nationality…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="flex gap-6">
        {/* Customer list */}
        <div className="min-w-0 flex-1 space-y-3">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
              <Users size={32} className="opacity-30" />
              <p className="text-sm">No customers found</p>
            </div>
          )}

          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id === selectedId ? null : c.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all hover:shadow-sm ${
                selectedId === c.id
                  ? "border-blue-400 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {/* Avatar */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: "var(--navy-600, #1e3a8a)" }}
              >
                {initials(c.first_name, c.last_name)}
              </div>

              {/* Name + email */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">
                  {c.first_name} {c.last_name}
                </p>
                <p className="truncate text-sm text-slate-500">{c.email || "—"}</p>
              </div>

              {/* Meta */}
              <div className="shrink-0 text-right">
                <p className="text-xs font-medium text-slate-700">
                  {c.appointments.length} booking{c.appointments.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-slate-400 capitalize">{c.region ?? "—"}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: "var(--navy-600, #1e3a8a)" }}
                >
                  {initials(selected.first_name, selected.last_name)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {selected.first_name} {selected.last_name}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">{selected.nationality ?? selected.region ?? "—"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            {/* Contact info */}
            <div className="space-y-2 rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={13} className="shrink-0 text-slate-400" />
                <span className="break-all text-slate-700">{selected.email || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={13} className="shrink-0 text-slate-400" />
                <span className="text-slate-700">{selected.phone ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe size={13} className="shrink-0 text-slate-400" />
                <span className="text-slate-700 capitalize">{selected.nationality ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={13} className="shrink-0 text-slate-400" />
                <span className="text-slate-700">
                  Joined {selected.created_at.slice(0, 10)}
                </span>
              </div>
            </div>

            {/* Appointments */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Appointments ({selected.appointments.length})
              </p>
              {selected.appointments.length === 0 ? (
                <p className="text-xs text-slate-400">No bookings yet.</p>
              ) : (
                <div className="space-y-2">
                  {selected.appointments.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-xl border border-slate-100 px-3 py-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-slate-400">{a.reference}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[a.status]}`}>
                          {STATUS_LABEL[a.status]}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-slate-800">
                        {PKG_LABEL[a.package] ?? a.package}
                      </p>
                      <p className="text-slate-400">{a.destination} · {a.created_at.slice(0, 10)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs" style={{ color: "rgba(240,244,255,0.35)" }}>
        Showing {filtered.length} of {customers.length} customers
      </p>
    </div>
  );
}
