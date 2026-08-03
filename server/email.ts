/**
 * server/email.ts
 *
 * Resend-backed email service. Keeps the same sendEmail() signature
 * the rest of the app already imports, so callers don't change.
 *
 * Env vars:
 *   RESEND_API_KEY — from resend.com → API Keys
 *   EMAIL_FROM     — verified sender, e.g. "Soléi <bookings@yourdomain.com>"
 *   EMAIL_TO       — owner inbox that receives every enquiry
 *
 * In development (no key) it logs the email instead of sending, so the
 * forms still "work" locally without a Resend account.
 */

import { Resend } from "resend";
import type { HotelRequest } from "@shared/schema";

const FROM = process.env.EMAIL_FROM || "Soléi <onboarding@resend.dev>";
const OWNER = process.env.EMAIL_TO || "";

let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export interface EmailParams {
  to?: string;
  from?: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  const to = params.to || OWNER;
  const from = params.from || FROM;

  const client = getResend();
  if (!client) {
    // Dev mode (no RESEND_API_KEY): log instead of send so the form
    // flow still completes locally. Recipient may be unset here.
    console.log("[email] RESEND_API_KEY not set — would have sent:", {
      to: to || "(EMAIL_TO not set)",
      from,
      subject: params.subject,
      replyTo: params.replyTo,
    });
    return true;
  }

  if (!to) {
    console.warn("sendEmail: no recipient (set EMAIL_TO or pass params.to). Skipping.");
    return false;
  }

  try {
    const { error } = await client.emails.send({
      from,
      to: [to],
      subject: params.subject,
      ...(params.replyTo ? { replyTo: params.replyTo } : {}),
      ...(params.html ? { html: params.html } : {}),
      ...(params.text ? { text: params.text } : {}),
    } as any);

    if (error) {
      console.error("Resend email error:", error);
      return false;
    }
    console.log("Email sent via Resend to:", to);
    return true;
  } catch (err) {
    console.error("Resend email exception:", err);
    return false;
  }
}

/* ──────────────────────────────────────────────────────────────
 * Shared HTML shell — branded, matches the site palette.
 * ────────────────────────────────────────────────────────────── */

/** Escape user-supplied text before interpolating it into email HTML.
 *  Form fields are attacker-controlled; without this a submission can
 *  inject markup (links, fake content) into the owner's inbox. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escape, then preserve line breaks — for multiline fields like
 *  message/notes that render inside HTML table cells. */
function escapeMultiline(value: unknown): string {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function emailShell(title: string, bodyRows: string, footerNote: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FDFAF5;font-family:Georgia,'Times New Roman',serif;color:#2b2b2b;">
  <div style="max-width:600px;margin:0 auto;padding:0;">
    <div style="background:#0F2436;padding:32px 32px 28px;">
      <p style="margin:0 0 6px;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#D7C6A1;font-family:Arial,sans-serif;">Soléi</p>
      <h1 style="margin:0;font-size:24px;font-weight:normal;color:#ffffff;line-height:1.25;">${title}</h1>
    </div>
    <div style="background:#ffffff;padding:28px 32px;border:1px solid #ece4d6;border-top:none;">
      <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;color:#2b2b2b;">
        ${bodyRows}
      </table>
    </div>
    <div style="padding:18px 32px 32px;color:#9a9382;font-size:11px;font-family:Arial,sans-serif;line-height:1.6;">
      ${footerNote}
    </div>
  </div>
</body>
</html>`;
}

/** Render one label/value table row. Values are HTML-escaped here by
 *  default; pass rawHtml=true only for values already escaped upstream
 *  (e.g. escapeMultiline output). */
function row(label: string, value: string, rawHtml = false): string {
  if (!value) return "";
  const rendered = rawHtml ? value : escapeHtml(value);
  return `<tr>
    <td style="padding:9px 0;border-bottom:1px solid #f0ece2;width:38%;vertical-align:top;color:#8a8270;font-size:11px;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(label)}</td>
    <td style="padding:9px 0;border-bottom:1px solid #f0ece2;color:#1a3a52;">${rendered}</td>
  </tr>`;
}

/* ──────────────────────────────────────────────────────────────
 * Templates
 * ────────────────────────────────────────────────────────────── */

export function generateHotelRequestEmail(request: HotelRequest): EmailParams {
  const { name, email, phone = "", checkIn, checkOut, guests, message, hotelName, hotelEmail } = request;

  const html = emailShell(
    `New booking request · ${escapeHtml(hotelName)}`,
    [
      row("Property", hotelName),
      row("Property contact", hotelEmail || "—"),
      row("Guest", name),
      row("Email", email),
      row("Phone", phone || "—"),
      row("Check-in", checkIn || "—"),
      row("Check-out", checkOut || "—"),
      row("Guests", String(guests)),
      row("Message", escapeMultiline(message || "—"), true),
    ].join(""),
    `Reply directly to this email to reach ${escapeHtml(name)}. Submitted via the Soléi website.`,
  );

  const text = `New booking request — ${hotelName}
Guest: ${name}
Email: ${email}
Phone: ${phone || "—"}
Check-in: ${checkIn || "—"}
Check-out: ${checkOut || "—"}
Guests: ${guests}
Message: ${message || "—"}`;

  return {
    to: OWNER,
    from: FROM,
    replyTo: email,
    subject: `New booking request — ${hotelName}`,
    text,
    html,
  };
}

/** Generic enquiry email used by the /review summary + /enquire forms. */
export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  reference?: string;
  /** Pre-formatted "label: value" lines summarising the selection. */
  summaryLines?: { label: string; value: string }[];
  /** Which form / flow this came from, for the subject line. */
  source?: string;
}

export function generateEnquiryEmail(p: EnquiryPayload): EmailParams {
  const summaryRows = (p.summaryLines || [])
    .filter((s) => s.value)
    .map((s) => row(s.label, s.value))
    .join("");

  const html = emailShell(
    "New enquiry from the website",
    [
      row("Name", p.name),
      row("Email", p.email),
      row("Phone", p.phone || "—"),
      summaryRows,
      row("Notes", escapeMultiline(p.notes || "—"), true),
      row("Reference", p.reference || "—"),
    ].join(""),
    `Reply directly to this email to reach ${escapeHtml(p.name)}. ${p.source ? `Source: ${escapeHtml(p.source)}. ` : ""}Submitted via the Soléi website.`,
  );

  const text = [
    `New enquiry`,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone || "—"}`,
    ...(p.summaryLines || []).filter((s) => s.value).map((s) => `${s.label}: ${s.value}`),
    `Notes: ${p.notes || "—"}`,
    `Reference: ${p.reference || "—"}`,
  ].join("\n");

  return {
    to: OWNER,
    from: FROM,
    replyTo: p.email,
    subject: `New enquiry${p.reference ? ` · ${p.reference}` : ""} — ${p.name}`,
    text,
    html,
  };
}

/**
 * Confirmation email sent TO the customer, acknowledging that their
 * enquiry was received. Reply-to is the owner so the customer can
 * reply straight back to the team.
 */
export function generateVisitorConfirmationEmail(p: EnquiryPayload): EmailParams {
  const firstName = p.name.split(" ")[0] || "there";
  const summaryRows = (p.summaryLines || [])
    .filter((s) => s.value)
    .map((s) => row(s.label, s.value))
    .join("");

  const intro = `
    <tr><td colspan="2" style="padding:0 0 18px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#2b2b2b;">
      Dear ${escapeHtml(firstName)},<br><br>
      Thank you for reaching out to Soléi. We've received your enquiry and a member of our team will be in touch within <strong>24 hours</strong> with availability and next steps.<br><br>
      Here's a copy of what you sent us:
    </td></tr>`;

  const html = emailShell(
    "We've received your enquiry",
    intro +
      summaryRows +
      row("Reference", p.reference || "—") +
      `<tr><td colspan="2" style="padding:18px 0 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#6b6354;">
        If anything's changed or you'd like to add to your request, simply reply to this email.<br><br>
        With warm regards,<br>
        <strong style="color:#1a3a52;">The Soléi Team</strong>
      </td></tr>`,
    `This is an automated confirmation from Soléi · From Sea to Sands. No payment is taken until availability is confirmed.`,
  );

  const text = [
    `Dear ${firstName},`,
    ``,
    `Thank you for reaching out to Soléi. We've received your enquiry and will be in touch within 24 hours.`,
    ``,
    `Your request:`,
    ...(p.summaryLines || []).filter((s) => s.value).map((s) => `  ${s.label}: ${s.value}`),
    `  Reference: ${p.reference || "—"}`,
    ``,
    `If anything's changed, just reply to this email.`,
    ``,
    `With warm regards,`,
    `The Soléi Team`,
  ].join("\n");

  return {
    to: p.email,
    from: FROM,
    replyTo: OWNER || undefined,
    subject: `We've received your enquiry — Soléi${p.reference ? ` · ${p.reference}` : ""}`,
    text,
    html,
  };
}
