"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import type { AppointmentStatus } from "@/lib/supabase/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrackedAppointment = {
  id: string;
  reference: string;
  status: AppointmentStatus;
  package: string;
  destination: string;
  travel_date_from: string | null;
  travel_date_to: string | null;
  created_at: string;
  history: StatusHistoryEntry[];
};

export type StatusHistoryEntry = {
  id: string;
  old_status: AppointmentStatus | null;
  new_status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  changed_by_name: string | null;
};

// ─── Get appointments with full status history ─────────────────────────────────

export async function getUserAppointmentsWithHistory(): Promise<TrackedAppointment[]> {
  const profile = await requireAuth();
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("appointments")
    .select(`
      id, reference, status, package, destination,
      travel_date_from, travel_date_to, created_at,
      status_history (
        id, old_status, new_status, notes, created_at,
        user_profiles ( first_name, last_name )
      )
    `)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false }) as { data: any[] | null; error: any };

  if (error || !data) {
    console.error("getUserAppointmentsWithHistory error:", error);
    return [];
  }

  return data.map((a: any) => ({
    id:               a.id,
    reference:        a.reference,
    status:           a.status,
    package:          a.package,
    destination:      a.destination,
    travel_date_from: a.travel_date_from,
    travel_date_to:   a.travel_date_to,
    created_at:       a.created_at,
    history: (a.status_history ?? [])
      .sort((x: any, y: any) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime())
      .map((h: any) => ({
        id:              h.id,
        old_status:      h.old_status,
        new_status:      h.new_status,
        notes:           h.notes,
        created_at:      h.created_at,
        changed_by_name: h.user_profiles
          ? `${h.user_profiles.first_name} ${h.user_profiles.last_name}`.trim()
          : null,
      })),
  }));
}

// ─── Get single appointment for tracking page ──────────────────────────────────

export async function getAppointmentTracking(appointmentId: string): Promise<TrackedAppointment | null> {
  const all = await getUserAppointmentsWithHistory();
  return all.find((a) => a.id === appointmentId) ?? null;
}
