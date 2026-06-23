/**
 * Thin wrapper around the Resend API.
 * Server-only — never import from client components.
 */
import { Resend } from "resend";
import {
  bookingConfirmationHtml,
  bookingConfirmationText,
  statusUpdateHtml,
  statusUpdateText,
} from "./templates";

const API_KEY = process.env.RESEND_API_KEY;
const resend  = new Resend(API_KEY);
const FROM    = process.env.EMAIL_FROM ?? "Schengen Journey <noreply@schengenjourney.com>";

// Email is "configured" only when a real key is present (not missing / placeholder).
const EMAIL_ENABLED =
  !!API_KEY && API_KEY.startsWith("re_") && !API_KEY.includes("your_resend_api_key");

if (!EMAIL_ENABLED) {
  console.warn(
    "[email] RESEND_API_KEY not configured — emails will be skipped. " +
      "Add a real key to .env.local to enable delivery."
  );
}

// ─── Booking confirmation ──────────────────────────────────────────────────────

export async function sendBookingConfirmation(data: {
  to: string;
  firstName: string;
  reference: string;
  packageName: string;
  destination: string;
  travelDateFrom: string;
  travelDateTo: string;
  applicantCount: number;
  email: string;
}) {
  if (!EMAIL_ENABLED) return;
  try {
    await resend.emails.send({
      from:    FROM,
      to:      data.to,
      subject: `Booking confirmed — ${data.reference} | Schengen Journey`,
      html:    bookingConfirmationHtml(data),
      text:    bookingConfirmationText(data),
    });
  } catch (err) {
    // Email failure must never break the booking flow
    console.error("[email] bookingConfirmation failed:", err);
  }
}

// ─── Status update ─────────────────────────────────────────────────────────────

export async function sendStatusUpdate(data: {
  to: string;
  firstName: string;
  reference: string;
  packageName: string;
  destination: string;
  newStatus: string;
  adminNotes?: string;
}) {
  if (!EMAIL_ENABLED) return;
  try {
    await resend.emails.send({
      from:    FROM,
      to:      data.to,
      subject: `Application update — ${data.reference} | Schengen Journey`,
      html:    statusUpdateHtml(data),
      text:    statusUpdateText(data),
    });
  } catch (err) {
    console.error("[email] statusUpdate failed:", err);
  }
}
