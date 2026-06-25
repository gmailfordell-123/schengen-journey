"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAdminClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import type { AppointmentStatus } from "@/lib/supabase/types";

export type MyAppointment = {
  id: string;
  reference: string;
  status: AppointmentStatus;
  package: string;
  destination: string;
  appointment_date: string | null;
  appointment_time: string | null;
  travel_date_from: string | null;
  travel_date_to: string | null;
  created_at: string;
  applicants: {
    first_name: string;
    last_name: string;
    passport_no: string;
    nationality: string;
    is_primary: boolean;
  }[];
};

export type DashboardStats = {
  total: number;
  pending: number;
  confirmed: number;
  upcoming_days: number | null;
};

export async function getMyAppointments(): Promise<MyAppointment[]> {
  const profile = await requireAuth();
  // Service-role read to avoid the recursive user_profiles RLS policy that
  // the appointments/applicants policies reference. Still scoped to the
  // authenticated user's own rows via the user_id filter below.
  const supabase = await createAdminClient();

  const { data, error } = await (supabase as any)
    .from("appointments")
    .select(`
      id, reference, status, package, destination,
      appointment_date, appointment_time,
      travel_date_from, travel_date_to, created_at,
      applicants ( first_name, last_name, passport_no, nationality, is_primary )
    `)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false }) as { data: any[] | null; error: any };

  if (error || !data) return [];

  return data.map((a: any) => ({
    id:               a.id,
    reference:        a.reference,
    status:           a.status as AppointmentStatus,
    package:          a.package,
    destination:      a.destination,
    appointment_date: a.appointment_date,
    appointment_time: a.appointment_time,
    travel_date_from: a.travel_date_from,
    travel_date_to:   a.travel_date_to,
    created_at:       a.created_at,
    applicants: (a.applicants ?? []).map((ap: any) => ({
      first_name:  ap.first_name,
      last_name:   ap.last_name,
      passport_no: ap.passport_no,
      nationality: ap.nationality,
      is_primary:  ap.is_primary,
    })),
  }));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const appointments = await getMyAppointments();

  const pending   = appointments.filter(a => a.status === "pending").length;
  const confirmed = appointments.filter(a => a.status === "confirmed").length;

  // Find the nearest upcoming appointment date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = appointments
    .filter(a => a.appointment_date && new Date(a.appointment_date) >= today)
    .map(a => new Date(a.appointment_date!))
    .sort((a, b) => a.getTime() - b.getTime());

  const upcoming_days = upcoming.length > 0
    ? Math.ceil((upcoming[0].getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return { total: appointments.length, pending, confirmed, upcoming_days };
}
