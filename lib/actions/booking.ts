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

// ─── Server-side sanitisation helpers ────────────────────────────────────────

function sanitizeStr(value: string, maxLen = 100): string {
  return value.trim().slice(0, maxLen);
}

function isValidDate(d: string): boolean {
  if (!d) return false;
  const parsed = Date.parse(d);
  return !isNaN(parsed);
}

function sanitizeInput(input: BookingInput): BookingInput | null {
  // Applicant count guard
  if (!Array.isArray(input.applicants) || input.applicants.length === 0 || input.applicants.length > 10) {
    return null;
  }

  return {
    package:        sanitizeStr(input.package, 60),
    destination:    sanitizeStr(input.destination, 100),
    email:          sanitizeStr(input.email, 254),
    phone:          sanitizeStr(input.phone, 30),
    travelDateFrom: input.travelDateFrom ? sanitizeStr(input.travelDateFrom, 10) : "",
    travelDateTo:   input.travelDateTo   ? sanitizeStr(input.travelDateTo,   10) : "",
    applicants: input.applicants.map((a) => ({
      firstName:      sanitizeStr(a.firstName,      60),
      lastName:       sanitizeStr(a.lastName,       60),
      dob:            sanitizeStr(a.dob,            10),
      nationality:    sanitizeStr(a.nationality,    60),
      passportNo:     sanitizeStr(a.passportNo,     20),
      passportCountry:sanitizeStr(a.passportCountry,60),
      passportIssue:  sanitizeStr(a.passportIssue,  10),
      passportExpiry: sanitizeStr(a.passportExpiry, 10),
    })),
  };
}

export async function submitBooking(input: BookingInput): Promise<BookingResult> {
  const supabase = await createClient();

  // 1. Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "You must be signed in to book an appointment." };
  }

  // 2. Sanitize & validate input server-side
  const clean = sanitizeInput(input);
  if (!clean) {
    return { success: false, error: "Invalid submission. Please check your details and try again." };
  }

  // Validate required fields
  if (!clean.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
    return { success: false, error: "A valid email address is required." };
  }
  for (const a of clean.applicants) {
    if (!a.firstName || !a.lastName || !a.passportNo) {
      return { success: false, error: "All applicant fields are required." };
    }
    if (a.passportExpiry && !isValidDate(a.passportExpiry)) {
      return { success: false, error: "Invalid passport expiry date." };
    }
  }

  // 3. Validate package
  const packageEnum = PACKAGE_MAP[clean.package];
  if (!packageEnum) {
    return { success: false, error: "Invalid package selected." };
  }

  // 4. Insert appointment — DB trigger auto-generates the reference (SJ-XXXXXX)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: appointment, error: aptError } = await (supabase as any)
    .from("appointments")
    .insert({
      user_id:          user.id,
      package:          packageEnum,
      price_paid:       PRICE_MAP[packageEnum],
      destination:      clean.destination,
      travel_date_from: clean.travelDateFrom || null,
      travel_date_to:   clean.travelDateTo   || null,
      status:           "pending",
      reference:        "",   // overwritten by trg_appointments_reference trigger
    })
    .select("id, reference")
    .single() as { data: { id: string; reference: string } | null; error: { message: string } | null };

  if (aptError || !appointment) {
    console.error("Appointment insert error:", aptError);
    // Don't expose raw DB errors to the client
    return { success: false, error: "Unable to create your appointment. Please try again." };
  }

  // 5. Insert applicants (one row per person, is_primary = true for index 0)
  const applicantRows = clean.applicants.map((a, idx) => ({
    appointment_id:      appointment.id,
    first_name:          a.firstName,
    last_name:           a.lastName,
    dob:                 a.dob,
    nationality:         a.nationality,
    passport_no:         a.passportNo,
    passport_country:    a.passportCountry,
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
    // Non-fatal — appointment was created, applicant details can be fixed by admin
  }

  // 6. Send booking confirmation email (failure must not break the response)
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
      destination:    clean.destination,
      travelDateFrom: clean.travelDateFrom,
      travelDateTo:   clean.travelDateTo,
      applicantCount: clean.applicants.length,
      email:          clean.email,
    });
  }

  return {
    success:       true,
    reference:     appointment.reference,
    appointmentId: appointment.id,
  };
}
