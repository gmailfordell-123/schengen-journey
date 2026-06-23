/**
 * Email HTML templates for transactional messages.
 * Plain inline-styled HTML so they render correctly in all email clients.
 */

const BASE = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f8fafc;
  margin: 0; padding: 0;
`;

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${BASE}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#2563eb;border-radius:12px 12px 0 0;padding:24px 32px;">
            <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">
              SJ &nbsp; Schengen Journey
            </span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;text-align:center;color:#94a3b8;font-size:12px;">
            © ${new Date().getFullYear()} Schengen Journey · This is an automated message, please do not reply.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 0;color:#64748b;font-size:14px;width:160px;">${label}</td>
    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:500;">${value}</td>
  </tr>`;
}

// ─── Booking confirmation ──────────────────────────────────────────────────────

export function bookingConfirmationHtml(data: {
  firstName: string;
  reference: string;
  packageName: string;
  destination: string;
  travelDateFrom: string;
  travelDateTo: string;
  applicantCount: number;
  email: string;
}) {
  return layout(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
      Booking received
    </h1>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;">
      Hi ${data.firstName}, your appointment request has been submitted successfully.
      Our team will review it and confirm your slot within 24 hours.
    </p>

    <!-- Reference badge -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 20px;margin-bottom:28px;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;color:#3b82f6;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Reference number</p>
      <p style="margin:0;font-size:26px;font-weight:700;color:#1d4ed8;letter-spacing:2px;font-family:monospace;">${data.reference}</p>
    </div>

    <!-- Booking details -->
    <p style="margin:0 0 12px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;">Booking details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${row("Package", data.packageName)}
      ${row("Destination", data.destination)}
      ${row("Travel from", data.travelDateFrom || "—")}
      ${row("Travel to", data.travelDateTo || "—")}
      ${row("Applicants", String(data.applicantCount))}
      ${row("Contact email", data.email)}
    </table>

    <div style="margin-top:28px;padding-top:24px;border-top:1px solid #f1f5f9;">
      <p style="margin:0 0 16px;color:#475569;font-size:14px;">
        Keep your reference number safe — you'll need it to track your application.
      </p>
      <a href="https://schengenjourney.com/dashboard"
         style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
        View your dashboard
      </a>
    </div>
  `);
}

export function bookingConfirmationText(data: {
  firstName: string;
  reference: string;
  packageName: string;
  destination: string;
}) {
  return `Hi ${data.firstName},

Your Schengen Journey booking has been received.

Reference: ${data.reference}
Package:   ${data.packageName}
Destination: ${data.destination}

We'll confirm your appointment within 24 hours.

Track your application: https://schengenjourney.com/dashboard

— Schengen Journey Team`;
}

// ─── Status update ─────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  pending:            "Pending",
  confirmed:          "Confirmed",
  completed:          "Completed",
  cancelled:          "Cancelled",
  submitted:          "Submitted",
  documents_required: "Documents Required",
  under_review:       "Under Review",
  approved:           "Approved",
  rejected:           "Rejected",
};

const STATUS_COLOR: Record<string, string> = {
  pending:            "#f59e0b",
  confirmed:          "#3b82f6",
  completed:          "#10b981",
  cancelled:          "#ef4444",
  submitted:          "#3b82f6",
  documents_required: "#f59e0b",
  under_review:       "#8b5cf6",
  approved:           "#10b981",
  rejected:           "#ef4444",
};

export function statusUpdateHtml(data: {
  firstName: string;
  reference: string;
  packageName: string;
  destination: string;
  newStatus: string;
  adminNotes?: string;
}) {
  const label = STATUS_LABEL[data.newStatus] ?? data.newStatus;
  const color = STATUS_COLOR[data.newStatus] ?? "#64748b";

  return layout(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
      Application status updated
    </h1>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;">
      Hi ${data.firstName}, your Schengen Journey application status has been updated.
    </p>

    <!-- Status badge -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:28px;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">New status</p>
      <p style="margin:0;font-size:20px;font-weight:700;color:${color};">${label}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${row("Reference", data.reference)}
      ${row("Package", data.packageName)}
      ${row("Destination", data.destination)}
    </table>

    ${data.adminNotes ? `
    <div style="margin-top:20px;background:#fafafa;border-left:3px solid #e2e8f0;padding:12px 16px;border-radius:0 6px 6px 0;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Note from our team</p>
      <p style="margin:0;font-size:14px;color:#374151;">${data.adminNotes}</p>
    </div>` : ""}

    <div style="margin-top:28px;padding-top:24px;border-top:1px solid #f1f5f9;">
      <a href="https://schengenjourney.com/dashboard/status"
         style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
        Track your application
      </a>
    </div>
  `);
}

export function statusUpdateText(data: {
  firstName: string;
  reference: string;
  newStatus: string;
  adminNotes?: string;
}) {
  const label = STATUS_LABEL[data.newStatus] ?? data.newStatus;
  return `Hi ${data.firstName},

Your Schengen Journey application (${data.reference}) status has been updated to: ${label}

${data.adminNotes ? `Note from our team: ${data.adminNotes}\n` : ""}
Track your application: https://schengenjourney.com/dashboard/status

— Schengen Journey Team`;
}
