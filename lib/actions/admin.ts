"use server";

/* Supabase's query builder loses its generic types on deep relational
   selects, so these server actions cast through `any` deliberately. */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { sendStatusUpdate } from "@/lib/email/sender";

/*
 * All reads/writes below use the service-role client. Every function is gated
 * by requireAdmin() first, so bypassing RLS here is safe — and it is required
 * because the user_profiles RLS policy self-references (admin check), which
 * Postgres rejects as "infinite recursion" (42P17) for any RLS-bound query
 * that touches user_profiles or tables whose policies reference it.
 */
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
  const supabase = await createAdminClient();

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

  // Emails live in the protected auth schema — fetch via the same
  // service-role client.
  const adminSupabase = supabase;

  const userIds: string[] = [...new Set(data.map((a: any) => a.user_profiles?.id).filter(Boolean))];
  const emailMap: Record<string, string> = {};

  // Emails live in the protected auth schema — fetch via the auth admin API.
  for (const uid of userIds) {
    const { data: u } = await adminSupabase.auth.admin.getUserById(uid);
    if (u?.user?.email) emailMap[uid] = u.user.email;
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
  const supabase     = await createAdminClient();

  // 1. Fetch current appointment for status history + email
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

  const { error: updateError } = await (supabase as any)
    .from("appointments")
    .update(updatePayload)
    .eq("id", appointmentId) as { error: any };

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // 3. Write status history record
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
  const adminSupabase = supabase;
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

// ─── Admin dashboard stats ────────────────────────────────────────────────────

export type AdminStats = {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  revenue: number;
  recent: {
    id: string;
    reference: string;
    customer_name: string;
    customer_email: string;
    package: string;
    destination: string;
    status: AppointmentStatus;
    created_at: string;
  }[];
};

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin();
  const supabase = await createAdminClient();

  const { data } = await (supabase as any)
    .from("appointments")
    .select(`
      id, reference, status, package, destination, price_paid, created_at,
      user_profiles ( id, first_name, last_name )
    `)
    .order("created_at", { ascending: false }) as { data: any[] | null; error: any };

  if (!data) return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, revenue: 0, recent: [] };

  // Fetch emails only for the 5 most recent
  const adminSupabase = supabase;
  const recentSlice = data.slice(0, 5);
  const recentIds: string[] = [...new Set(recentSlice.map((a: any) => a.user_profiles?.id).filter(Boolean))];
  const emailMap: Record<string, string> = {};
  for (const uid of recentIds) {
    const { data: u } = await adminSupabase.auth.admin.getUserById(uid);
    if (u?.user?.email) emailMap[uid] = u.user.email;
  }

  return {
    total:     data.length,
    pending:   data.filter((a: any) => a.status === "pending").length,
    confirmed: data.filter((a: any) => a.status === "confirmed").length,
    completed: data.filter((a: any) => a.status === "completed").length,
    cancelled: data.filter((a: any) => a.status === "cancelled").length,
    revenue:   data.reduce((sum: number, a: any) => sum + (a.price_paid ?? 0), 0),
    recent: recentSlice.map((a: any) => ({
      id:             a.id,
      reference:      a.reference,
      customer_name:  `${a.user_profiles?.first_name ?? ""} ${a.user_profiles?.last_name ?? ""}`.trim(),
      customer_email: emailMap[a.user_profiles?.id] ?? "",
      package:        a.package,
      destination:    a.destination,
      status:         a.status as AppointmentStatus,
      created_at:     a.created_at,
    })),
  };
}

// ─── Admin customers list ──────────────────────────────────────────────────────

export type AdminCustomer = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  nationality: string | null;
  region: string | null;
  created_at: string;
  appointments: {
    id: string;
    reference: string;
    status: AppointmentStatus;
    package: string;
    destination: string;
    created_at: string;
  }[];
};

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  await requireAdmin();
  const supabase = await createAdminClient();

  const { data: profiles } = await (supabase as any)
    .from("user_profiles")
    .select(`
      id, first_name, last_name, phone, nationality, region, created_at,
      appointments ( id, reference, status, package, destination, created_at )
    `)
    .eq("is_admin", false)
    .order("created_at", { ascending: false }) as { data: any[] | null; error: any };

  if (!profiles) return [];

  // Batch-fetch all emails at once
  const adminSupabase = supabase;
  const { data: usersData } = await adminSupabase.auth.admin.listUsers({ perPage: 1000 });
  const emailMap: Record<string, string> = {};
  usersData?.users?.forEach((u: { id: string; email?: string }) => { if (u.email) emailMap[u.id] = u.email; });

  return profiles.map((p: any) => ({
    id:           p.id,
    email:        emailMap[p.id] ?? "",
    first_name:   p.first_name ?? "",
    last_name:    p.last_name ?? "",
    phone:        p.phone ?? null,
    nationality:  p.nationality ?? null,
    region:       p.region ?? null,
    created_at:   p.created_at,
    appointments: (p.appointments ?? []).map((a: any) => ({
      id:          a.id,
      reference:   a.reference,
      status:      a.status as AppointmentStatus,
      package:     a.package,
      destination: a.destination,
      created_at:  a.created_at,
    })),
  }));
}

// ─── Update appointment notes only ────────────────────────────────────────────

export async function updateAppointmentNotes(
  appointmentId: string,
  notes: string
): Promise<AdminResult> {
  await requireAdmin();
  const supabase = await createAdminClient();

  const { error } = await (supabase as any)
    .from("appointments")
    .update({ notes })
    .eq("id", appointmentId) as { error: any };

  if (error) return { success: false, error: error.message };
  return { success: true };
}
