"use server";

import { createClient } from "@/lib/supabase/server";
import type { PackageType } from "@/lib/supabase/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type ApplicantInput = {
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  passportNo: string;
  passportIssue: string;
  passportExpiry: string;
  passportCountry: string;
};

type BookingInput = {
  package: string;
  applicants: ApplicantInput[];
  email: string;
  phone: string;
  destination: string;
  travelDateFrom: string;
  travelDateTo: string;
};

export type BookingResult =
  | { success: true; reference: string; appointmentId: string }
  | { success: false; error: string };

// ─── Package ID mapping (form slug → DB enum) ─────────────────────────────────

const PACKAGE_MAP: Record<string, PackageType> = {
  "essential-start":        "essential_start",
  "smart-travel-plan":      "smart_travel_plan",
  "platinum-complete-plan": "platinum_complete_plan",
};

// ─── Price snapshot ───────────────────────────────────────────────────────────

const PRICE_MAP: Record<PackageType, number> = {
  essential_start:        99,
  smart_travel_plan:      150,
  platinum_complete_plan: 220,
};

// ─── Server Action ────────────────────────────────────────────────────────────

export async function submitBooking(input: BookingInput): Promise<BookingResult> {
  const supabase = await createClient();

  // 1. Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "You must be signed in to book an appointment." };
  }

  // 2. Validate package
  const packageEnum = PACKAGE_MAP[input.package];
  if (!packageEnum) {
    return { success: false, error: "Invalid package selected." };
  }

  // 3. Insert appointment — DB trigger auto-generates the reference (SJ-XXXXXX)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: appointment, error: aptError } = await (supabase as any)
    .from("appointments")
    .insert({
      user_id:          user.id,
      package:          packageEnum,
      price_paid:       PRICE_MAP[packageEnum],
      destination:      input.destination.trim(),
      travel_date_from: input.travelDateFrom || null,
      travel_date_to:   input.travelDateTo   || null,
      status:           "pending",
      reference:        "",   // overwritten by trg_appointments_reference trigger
    })
    .select("id, reference")
    .single() as { data: { id: string; reference: string } | null; error: { message: string } | null };

  if (aptError || !appointment) {
    console.error("Appointment insert error:", aptError);
    return { success: false, error: aptError?.message ?? "Failed to create appointment." };
  }

  // 4. Insert applicants (one row per person, is_primary = true for index 0)
  const applicantRows = input.applicants.map((a, idx) => ({
    appointment_id:      appointment.id,
    first_name:          a.firstName.trim(),
    last_name:           a.lastName.trim(),
    dob:                 a.dob,
    nationality:         a.nationality.trim(),
    passport_no:         a.passportNo.trim(),
    passport_country:    a.passportCountry.trim(),
    passport_issue_date: a.passportIssue,
    passport_expiry:     a.passportExpiry,
    is_primary:          idx === 0,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: applicantError } = await (supabase as any)
    .from("applicants")
    .insert(applicantRows) as { error: { message: string } | null };

  if (applicantError) {
    console.error("Applicant insert error:", applicantError);
  }

  // 5. Send booking confirmation email (failure must not break the response)
  const { sendBookingConfirmation } = await import("@/lib/email/sender");
  const { createAdminClient } = await import("@/lib/supabase/server");
  const adminSupabase = await createAdminClient();
  const { data: authUser } = await adminSupabase.auth.admin.getUserById(user.id);
  const { data: profile } = await adminSupabase
    .from("user_profiles")
    .select("first_name")
    .eq("id", user.id)
    .single<{ first_name: string }>();

  const PACKAGE_LABELS: Record<string, string> = {
    essential_start:        "Essential Start",
    smart_travel_plan:      "Smart Travel Plan",
    platinum_complete_plan: "Platinum Complete Plan",
  };

  if (authUser?.user?.email) {
    await sendBookingConfirmation({
      to:             authUser.user.email,
      firstName:      profile?.first_name ?? "there",
      reference:      appointment.reference,
      packageName:    PACKAGE_LABELS[packageEnum] ?? packageEnum,
      destination:    input.destination,
      travelDateFrom: input.travelDateFrom,
      travelDateTo:   input.travelDateTo,
      applicantCount: input.applicants.length,
      email:          input.email,
    });
  }

  return {
    success:       true,
    reference:     appointment.reference,
    appointmentId: appointment.id,
  };
}
