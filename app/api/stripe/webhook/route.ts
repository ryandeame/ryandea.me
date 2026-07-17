import { NextResponse } from "next/server";
import Stripe from "stripe";

import { recordServerTrackingEvent } from "@/lib/server-tracking";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripeSecretKey || !webhookSecret || !signature) {
    return NextResponse.json(
      { ok: false, error: "Stripe webhook is not configured" },
      { status: 500 },
    );
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await recordServerTrackingEvent(request, {
        eventId: `stripe_${event.id}`,
        eventName: "purchase_completed",
        eventSource: "stripe",
        occurredAt: new Date(event.created * 1000).toISOString(),
        visitorId: session.metadata?.tracking_visitor_id ?? null,
        sessionId: session.metadata?.tracking_session_id ?? null,
        properties: {
          amount_total_minor: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
          stripe_checkout_session_id: session.id,
        },
      });
    }

    return NextResponse.json({ ok: true, received: true });
  } catch (error) {
    console.error("[Stripe webhook] Failed to process event:", error);
    return NextResponse.json({ ok: false, error: "Invalid webhook" }, { status: 400 });
  }
}
