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

const FROM = process.env.EMAIL_FROM ?? "Schengen Journey <noreply@schengenjourney.com>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || !key.startsWith("re_") || key.includes("your_resend_api_key")) {
    return null;
  }
  return new Resend(key);
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
  const resend = getResend();
  if (!resend) return;
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
  const resend = getResend();
  if (!resend) return;
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
