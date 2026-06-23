"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { sendStatusUpdate } from "@/lib/email/sender";
import type { AppointmentStatus } from "@/lib/supabase/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdminAppointment = {
  id: string;
  reference: string;
  status: AppointmentStatus;
  package: string;
  destination: string;
  travel_date_from: string | null;
  travel_date_to: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
  price_paid: number | null;
  notes: string | null;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
  };
  applicants: {
    id: string;
    first_name: string;
    last_name: string;
    passport_no: string;
    nationality: string;
    is_primary: boolean;
  }[];
};

export type AdminResult =
  | { success: true }
  | { success: false; error: string };

// ─── Get all appointments (admin view) ────────────────────────────────────────

export async function getAdminAppointments(): Promise<AdminAppointment[]> {
  await requireAdmin();
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("appointments")
    .select(`
      id, reference, status, package, destination,
      travel_date_from, travel_date_to,
      appointment_date, appointment_time,
      price_paid, notes, created_at,
      user_profiles ( id, first_name, last_name, phone ),
      applicants ( id, first_name, last_name, passport_no, nationality, is_primary )
    `)
    .order("created_at", { ascending: false }) as {
      data: any[] | null;
      error: any;
    };

  if (error || !data) {
    console.error("getAdminAppointments error:", error);
    return [];
  }

  // Join auth.users email separately (it's in a protected schema)
  // We fetch emails via the service-role client
  const { createAdminClient } = await import("@/lib/supabase/server");
  const adminSupabase = await createAdminClient();

  const userIds: string[] = [...new Set(data.map((a: any) => a.user_profiles?.id).filter(Boolean))];
  const emailMap: Record<string, string> = {};

  if (userIds.length) {
    const { data: authUsers } = await (adminSupabase as any)
      .from("user_profiles")
      .select("id")
      .in("id", userIds) as { data: any[] | null };

    // Fetch emails via auth admin API
    for (const uid of userIds) {
      const { data: u } = await adminSupabase.auth.admin.getUserById(uid);
      if (u?.user?.email) emailMap[uid] = u.user.email;
    }
  }

  return data.map((a: any) => ({
    id:               a.id,
    reference:        a.reference,
    status:           a.status,
    package:          a.package,
    destination:      a.destination,
    travel_date_from: a.travel_date_from,
    travel_date_to:   a.travel_date_to,
    appointment_date: a.appointment_date,
    appointment_time: a.appointment_time,
    price_paid:       a.price_paid,
    notes:            a.notes,
    created_at:       a.created_at,
    user: {
      id:         a.user_profiles?.id ?? "",
      first_name: a.user_profiles?.first_name ?? "",
      last_name:  a.user_profiles?.last_name ?? "",
      email:      emailMap[a.user_profiles?.id] ?? "",
      phone:      a.user_profiles?.phone ?? null,
    },
    applicants: (a.applicants ?? []).map((ap: any) => ({
      id:          ap.id,
      first_name:  ap.first_name,
      last_name:   ap.last_name,
      passport_no: ap.passport_no,
      nationality: ap.nationality,
      is_primary:  ap.is_primary,
    })),
  }));
}

// ─── Update appointment status ─────────────────────────────────────────────────

export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: AppointmentStatus,
  notes?: string
): Promise<AdminResult> {
  const adminProfile = await requireAdmin();
  const supabase     = await createClient();

  // 1. Fetch current appointment for status history + email
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: current, error: fetchError } = await (supabase as any)
    .from("appointments")
    .select("status, reference, package, destination, user_id, notes")
    .eq("id", appointmentId)
    .single() as { data: any; error: any };

  if (fetchError || !current) {
    return { success: false, error: "Appointment not found." };
  }

  // 2. Update appointment status (and notes if provided)
  const updatePayload: Record<string, unknown> = { status: newStatus };
  if (notes !== undefined) updatePayload.notes = notes;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from("appointments")
    .update(updatePayload)
    .eq("id", appointmentId) as { error: any };

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // 3. Write status history record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("status_history")
    .insert({
      appointment_id: appointmentId,
      old_status:     current.status,
      new_status:     newStatus,
      changed_by:     adminProfile.id,
      notes:          notes ?? null,
    });

  // 4. Send email notification to the customer
  const { createAdminClient } = await import("@/lib/supabase/server");
  const adminSupabase = await createAdminClient();
  const { data: profile } = await adminSupabase
    .from("user_profiles")
    .select("first_name, phone")
    .eq("id", current.user_id)
    .single<{ first_name: string; phone: string | null }>();

  const { data: authUser } = await adminSupabase.auth.admin.getUserById(current.user_id);
  const email = authUser?.user?.email;

  if (email && profile) {
    const PACKAGE_LABELS: Record<string, string> = {
      essential_start:        "Essential Start",
      smart_travel_plan:      "Smart Travel Plan",
      platinum_complete_plan: "Platinum Complete Plan",
    };

    await sendStatusUpdate({
      to:          email,
      firstName:   profile.first_name,
      reference:   current.reference,
      packageName: PACKAGE_LABELS[current.package] ?? current.package,
      destination: current.destination,
      newStatus,
      adminNotes:  notes,
    });
  }

  return { success: true };
}

// ─── Update appointment notes only ────────────────────────────────────────────

export async function updateAppointmentNotes(
  appointmentId: string,
  notes: string
): Promise<AdminResult> {
  await requireAdmin();
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("appointments")
    .update({ notes })
    .eq("id", appointmentId) as { error: any };

  if (error) return { success: false, error: error.message };
  return { success: true };
}
