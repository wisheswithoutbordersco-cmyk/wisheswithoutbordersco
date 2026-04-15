/**
 * Email Delivery Service — Resend Integration
 *
 * FIX 2 (CRITICAL): Sends order confirmation emails with download links
 * to customers after successful payment. Uses Resend (https://resend.com).
 *
 * If RESEND_API_KEY is not configured, logs a warning but does NOT crash.
 * The download page still works as a fallback.
 *
 * Brand: Wishes Without Borders Co.
 * Contact: info@wisheswithoutbordersco.com
 */
import { Resend } from "resend";

// ── Configuration ──────────────────────────────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "Wishes Without Borders Co. <onboarding@resend.dev>";
const BRAND_NAME = "Wishes Without Borders Co.";
const SUPPORT_EMAIL = "info@wisheswithoutbordersco.com";

// Warn once at startup if key is missing
if (!RESEND_API_KEY) {
  console.warn(
    "[EmailService] WARNING: RESEND_API_KEY is not set. " +
    "Order confirmation emails will NOT be sent. " +
    "Customers will still see download links on the success page."
  );
}

interface DownloadItem {
  productId: string;
  productName: string;
  downloadUrl: string | null;
}

interface SendOrderEmailParams {
  customerEmail: string;
  sessionId: string;
  downloads: DownloadItem[];
  baseUrl?: string;
}

/**
 * Check if the email service is configured and available.
 */
export function isEmailServiceAvailable(): boolean {
  return !!RESEND_API_KEY;
}

/**
 * Send an order confirmation email with download links.
 *
 * Returns true if the email was sent successfully, false otherwise.
 * Never throws — all errors are caught and logged.
 */
export async function sendOrderConfirmationEmail(params: SendOrderEmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("[EmailService] Skipping email — RESEND_API_KEY not configured");
    return false;
  }

  const { customerEmail, sessionId, downloads, baseUrl = "" } = params;

  if (!customerEmail) {
    console.warn("[EmailService] Skipping email — no customer email address");
    return false;
  }

  try {
    const resend = new Resend(RESEND_API_KEY);

    // Build the download links HTML
    const downloadItemsHtml = downloads
      .map((item) => {
        const linkHtml = item.downloadUrl
          ? `<a href="${baseUrl}${item.downloadUrl}" style="display:inline-block;background-color:#2563eb;color:#ffffff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:8px;">Download PDF</a>`
          : `<span style="color:#dc2626;font-style:italic;">Download not yet available — please contact ${SUPPORT_EMAIL}</span>`;

        return `
          <tr>
            <td style="padding:16px 0;border-bottom:1px solid #e5e7eb;">
              <strong style="font-size:16px;color:#1f2937;">${escapeHtml(item.productName)}</strong>
              <br/>
              ${linkHtml}
            </td>
          </tr>`;
      })
      .join("");

    const itemCount = downloads.length;
    const subject = itemCount === 1
      ? `Your download is ready — ${downloads[0].productName}`
      : `Your ${itemCount} downloads are ready — ${BRAND_NAME}`;

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1e3a5f;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">${escapeHtml(BRAND_NAME)}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#1f2937;font-size:22px;">Thank you for your purchase!</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                Your payment has been confirmed. Your download${itemCount > 1 ? "s are" : " is"} ready below.
                These links are valid for <strong>24 hours</strong>. If they expire, visit your
                <a href="${baseUrl}/my-orders" style="color:#2563eb;">order history</a> to get fresh links.
              </p>

              <!-- Download Items -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${downloadItemsHtml}
              </table>

              <!-- Order Reference -->
              <p style="margin:24px 0 0;color:#9ca3af;font-size:13px;">
                Order reference: ${escapeHtml(sessionId.substring(0, 30))}...
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
                Need help? Contact us at
                <a href="mailto:${SUPPORT_EMAIL}" style="color:#2563eb;">${SUPPORT_EMAIL}</a>
              </p>
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                &copy; ${new Date().getFullYear()} ${escapeHtml(BRAND_NAME)}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [customerEmail],
      subject,
      html: htmlBody,
    });

    if (error) {
      console.error(`[EmailService] Resend API error for ${customerEmail}:`, error);
      return false;
    }

    console.log(`[EmailService] Order confirmation sent to ${customerEmail} (Resend ID: ${data?.id})`);
    return true;
  } catch (err) {
    console.error(`[EmailService] Failed to send email to ${customerEmail}:`, err);
    return false;
  }
}

/**
 * Simple HTML escaping to prevent XSS in email content.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
