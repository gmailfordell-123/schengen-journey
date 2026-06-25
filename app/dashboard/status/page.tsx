"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, BadgeCheck, XCircle, ClipboardList } from "lucide-react";
import { BlurFade } from "@/components/ui/BlurFade";
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
  index,
}: {
  entry: TrackedAppointment["history"][number];
  isLast: boolean;
  index: number;
}) {
  const dotDelay = 0.08 + index * 0.1;
  const lineDelay = dotDelay + 0.12;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        {/* Spring dot entrance */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 22, delay: dotDelay }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-2 ring-brand-100"
        >
          <StatusIcon status={entry.new_status} />
        </motion.div>
        {/* Vertical line draws top-to-bottom */}
        {!isLast && (
          <motion.div
            className="mt-1 w-px flex-1 origin-top" style={{ background: "rgba(255,255,255,0.12)" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.45, delay: lineDelay, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </div>
      <motion.div
        className="pb-5"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: dotDelay + 0.06, duration: 0.32 }}
      >
        <p className="font-semibold text-white">
          Status changed to{" "}
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[entry.new_status]}`}
          >
            {STATUS_LABEL[entry.new_status]}
          </span>
        </p>
        {entry.notes && (
          <p className="mt-1 text-sm" style={{ color: "rgba(240,244,255,0.65)" }}>{entry.notes}</p>
        )}
        <p className="mt-1 text-xs" style={{ color: "rgba(240,244,255,0.42)" }}>
          {formatDate(entry.created_at)}
          {entry.changed_by_name ? ` · by ${entry.changed_by_name}` : ""}
        </p>
      </motion.div>
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
      <div className="flex h-48 items-center justify-center text-sm" style={{ color: "rgba(240,244,255,0.45)" }}>
        Loading status…
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="glass-dark rounded-2xl p-12 text-center">
        <ClipboardList size={28} className="mx-auto" style={{ color: "rgba(240,244,255,0.42)" }} />
        <p className="mt-2 font-semibold text-white">No appointments yet</p>
        <p className="mt-1 text-sm" style={{ color: "rgba(240,244,255,0.55)" }}>
          Once you book an appointment, its status will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BlurFade delay={0.05}>
        <h1 className="text-lg font-bold text-white">Application status</h1>
      </BlurFade>

      <div className="flex gap-6">
        {/* Sidebar: appointment list */}
        <div className="w-72 shrink-0 space-y-3">
          {appointments.map((apt, i) => (
            <motion.button
              key={apt.id}
              type="button"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 3 }}
              onClick={() => setSelectedId(apt.id)}
              className="w-full rounded-2xl p-4 text-left transition-all duration-200"
              style={selectedId === apt.id ? {
                background: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 100%)",
                backdropFilter: "blur(18px) saturate(1.5)",
                WebkitBackdropFilter: "blur(18px) saturate(1.5)",
                border: "1.5px solid rgba(201,168,76,0.45)",
                boxShadow: "0 8px 28px rgba(4,12,26,0.36), inset 0 1px 0 rgba(255,255,255,0.18)",
              } : {
                background: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(14px) saturate(1.4)",
                WebkitBackdropFilter: "blur(14px) saturate(1.4)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 4px 16px rgba(4,12,26,0.24), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs" style={{ color: "rgba(240,244,255,0.48)" }}>{apt.reference}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[apt.status]}`}>
                  {STATUS_LABEL[apt.status]}
                </span>
              </div>
              <p className="mt-1 font-semibold text-white">{apt.destination}</p>
              <p className="text-xs" style={{ color: "rgba(240,244,255,0.52)" }}>{PKG_LABEL[apt.package] ?? apt.package}</p>
              <p className="mt-1 text-xs" style={{ color: "rgba(240,244,255,0.40)" }}>Booked {formatDate(apt.created_at)}</p>
            </motion.button>
          ))}
        </div>

        {/* Main: details + timeline */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 space-y-4"
            >
              {/* Summary card */}
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="glass-dark rounded-2xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm" style={{ color: "rgba(240,244,255,0.55)" }}>
                      {PKG_LABEL[selected.package] ?? selected.package}
                    </p>
                    <h2 className="mt-0.5 text-xl font-bold text-white">
                      {selected.destination}
                    </h2>
                    <p className="mt-1 font-mono text-sm" style={{ color: "rgba(240,244,255,0.42)" }}>{selected.reference}</p>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold ${STATUS_COLORS[selected.status]}`}>
                    <StatusIcon status={selected.status} size={15} />
                    {STATUS_LABEL[selected.status]}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    ["Travel from", formatDate(selected.travel_date_from)],
                    ["Travel to",   formatDate(selected.travel_date_to)],
                    ["Booked",      formatDate(selected.created_at)],
                  ].map(([label, value], i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                    >
                      <p className="text-xs" style={{ color: "rgba(240,244,255,0.42)" }}>{label}</p>
                      <p className="font-semibold text-white">{value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* History timeline */}
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="glass-dark rounded-2xl p-6"
              >
                <p className="mb-5 font-semibold text-white">Status history</p>
                {selected.history.length === 0 ? (
                  <p className="text-sm" style={{ color: "rgba(240,244,255,0.45)" }}>No status changes yet.</p>
                ) : (
                  <div>
                    {selected.history.map((entry, idx) => (
                      <TimelineStep
                        key={entry.id}
                        entry={entry}
                        isLast={idx === selected.history.length - 1}
                        index={idx}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-xs" style={{ color: "rgba(240,244,255,0.38)" }}
      >
        Updates in real-time — no need to refresh.
      </motion.p>
    </div>
  );
}
