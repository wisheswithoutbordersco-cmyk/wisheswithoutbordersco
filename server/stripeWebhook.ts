/**
 * Stripe Webhook Handler
 * 
 * Listens for checkout.session.completed events from Stripe.
 * On successful payment:
 *   1. Updates order status to "paid" in the database
 *   2. Records the customer email
 * 
 * This is the authoritative payment confirmation — the verifyPayment
 * tRPC endpoint serves as a fallback for immediate UI feedback.
 * 
 * SECURITY: Webhook signature verification is REQUIRED.
 * If STRIPE_WEBHOOK_SECRET is not configured, the endpoint returns 500.
 * No unverified events are accepted.
 */
import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { orders } from "../drizzle/schema";
import { PRODUCTS } from "./routers";
import { generateDownloadToken } from "./downloadTokens";
import { sendOrderConfirmationEmail } from "./emailService";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key);
}

export function registerStripeWebhook(app: Express): void {
  // Stripe requires the raw body for signature verification.
  // We register this route BEFORE the global JSON parser in index.ts.
  app.post(
    "/api/stripe/webhook",
    // Use express.raw to get the raw body as a Buffer
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const stripe = getStripe();
      const sig = req.headers["stripe-signature"] as string | undefined;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      // HARD REJECTION: Webhook secret MUST be configured
      if (!webhookSecret) {
        console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured — rejecting request");
        res.status(500).json({ error: "Webhook endpoint is not configured. STRIPE_WEBHOOK_SECRET is missing." });
        return;
      }

      // HARD REJECTION: Stripe signature header MUST be present
      if (!sig || typeof sig !== "string") {
        console.error("[Stripe Webhook] Missing stripe-signature header — rejecting request");
        res.status(400).json({ error: "Missing stripe-signature header" });
        return;
      }

      // Verify the webhook signature
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(`[Stripe Webhook] Signature verification failed: ${message}`);
        res.status(400).json({ error: `Webhook signature verification failed: ${message}` });
        return;
      }

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log(`[Stripe Webhook] Payment completed for session: ${session.id}`);

          if (session.payment_status === "paid") {
            const db = await getDb();
            if (db) {
              try {
                await db
                  .update(orders)
                  .set({
                    status: "paid",
                    customerEmail: session.customer_details?.email ?? null,
                  })
                  .where(eq(orders.stripeSessionId, session.id));
                console.log(`[Stripe Webhook] Orders updated to "paid" for session: ${session.id}`);
              } catch (err) {
                console.error(`[Stripe Webhook] Failed to update orders:`, err);
              }
            }

            // FIX 2 (CRITICAL): Send order confirmation email with download links
            const customerEmail = session.customer_details?.email;
            if (customerEmail) {
              try {
                const productIds = (session.metadata?.productIds ?? "").split(",").filter(Boolean);
                const downloads = productIds.map((pid) => {
                  const product = PRODUCTS[pid];
                  const hasFile = !!(product?.pdfLink && !product.pdfLink.startsWith("#"));
                  return {
                    productId: pid,
                    productName: product?.name ?? pid,
                    downloadUrl: hasFile ? `/api/download/${generateDownloadToken(pid, session.id)}` : null,
                  };
                });

                // Determine base URL from success_url metadata or environment
                const baseUrl = process.env.BASE_URL || "";

                await sendOrderConfirmationEmail({
                  customerEmail,
                  sessionId: session.id,
                  downloads,
                  baseUrl,
                });
              } catch (emailErr) {
                // Email failure is non-critical — download page still works
                console.error(`[Stripe Webhook] Failed to send confirmation email:`, emailErr);
              }
            } else {
              console.warn(`[Stripe Webhook] No customer email for session ${session.id} — skipping confirmation email`);
            }
          }
          break;
        }

        case "checkout.session.expired": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log(`[Stripe Webhook] Session expired: ${session.id}`);

          const db = await getDb();
          if (db) {
            try {
              await db
                .update(orders)
                .set({ status: "failed" })
                .where(eq(orders.stripeSessionId, session.id));
            } catch (err) {
              console.error(`[Stripe Webhook] Failed to update expired orders:`, err);
            }
          }
          break;
        }

        default:
          // Unhandled event type — log and acknowledge
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }

      // Always respond 200 to acknowledge receipt
      res.status(200).json({ received: true });
    }
  );
}
