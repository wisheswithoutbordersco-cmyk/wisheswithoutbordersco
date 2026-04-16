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
 */
import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { orders } from "../drizzle/schema";

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

      // If no webhook secret is configured, accept the event without verification (dev mode)
      let event: Stripe.Event;

      if (webhookSecret && sig && typeof sig === "string") {
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          console.error(`[Stripe Webhook] Signature verification failed: ${message}`);
          res.status(400).json({ error: `Webhook signature verification failed: ${message}` });
          return;
        }
      } else {
        // Dev mode — parse the body directly
        try {
          event = JSON.parse(req.body.toString()) as Stripe.Event;
          console.warn("[Stripe Webhook] No webhook secret configured — accepting event without signature verification");
        } catch {
          res.status(400).json({ error: "Invalid JSON body" });
          return;
        }
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
