"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { mockAppointments, statusColors } from "@/lib/mockData";

const customers = Array.from(
  new Map(
    mockAppointments.map((a) => [
      a.email,
      {
        name: a.customerName,
        email: a.email,
        phone: a.phone,
        nationality: a.nationality,
        appointments: mockAppointments.filter((x) => x.email === a.email),
      },
    ])
  ).values()
);

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.nationality.toLowerCase().includes(q)
    );
  }, [search]);

  const selected = selectedEmail
    ? customers.find((c) => c.email === selectedEmail)
    : null;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-white">Customers</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, nationality…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 sm:w-72"
      />

      <div className="flex gap-6">
        {/* Customer list */}
        <div className="min-w-0 flex-1 space-y-3">
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">
              No customers found.
            </p>
          )}
          {filtered.map((c) => (
            <button
              key={c.email}
              type="button"
              onClick={() =>
                setSelectedEmail(c.email === selectedEmail ? null : c.email)
              }
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors hover:border-brand-300 ${
                selectedEmail === c.email
                  ? "border-brand-500 bg-brand-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{c.name}</p>
                <p className="truncate text-sm text-slate-500">{c.email}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-slate-400">
                  {c.appointments.length} appt
                  {c.appointments.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-slate-400">{c.nationality}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div className="w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {selected.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selected.name}</p>
                  <p className="text-xs text-slate-400">{selected.nationality}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                aria-label="Close"
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-xs text-slate-400">Email</span>
                <p className="break-all font-medium text-slate-900">
                  {selected.email}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Phone</span>
                <p className="font-medium text-slate-900">{selected.phone}</p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Appointments
              </p>
              <div className="space-y-2">
                {selected.appointments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{a.package}</p>
                      <p className="text-slate-400">
                        {a.date} · {a.destination}
                      </p>
                    </div>
                    <span
                      className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[a.status]}`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Showing {filtered.length} of {customers.length} customers
      </p>
    </div>
  );
}
