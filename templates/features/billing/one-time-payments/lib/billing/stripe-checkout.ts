/**
 * Stripe One-Time Checkout
 * 
 * Handle single payment transactions with Stripe.
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export interface CheckoutItem {
  name: string;
  description?: string;
  amount: number; // in cents
  quantity: number;
  image?: string;
}

/**
 * Create one-time checkout session
 */
export async function createCheckoutSession(
  items: CheckoutItem[],
  successUrl: string,
  cancelUrl: string,
  options: {
    customerEmail?: string;
    customerId?: string;
    metadata?: Record<string, string>;
  } = {}
): Promise<Stripe.Checkout.Session> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: item.amount,
      },
      quantity: item.quantity,
    })
  );

  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer: options.customerId,
    customer_email: options.customerId ? undefined : options.customerEmail,
    metadata: options.metadata,
  });
}

/**
 * Retrieve checkout session
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });
}

/**
 * Create payment intent directly (for custom checkout UI)
 */
export async function createPaymentIntent(
  amount: number,
  currency = "usd",
  options: {
    customerId?: string;
    metadata?: Record<string, string>;
  } = {}
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount,
    currency,
    customer: options.customerId,
    metadata: options.metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

/**
 * Confirm payment succeeded
 */
export async function confirmPayment(
  paymentIntentId: string
): Promise<{ success: boolean; error?: string }> {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    return { success: true };
  }

  return {
    success: false,
    error: `Payment status: ${paymentIntent.status}`,
  };
}

/**
 * Issue refund
 */
export async function refundPayment(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount, // If undefined, refunds full amount
  });
}

