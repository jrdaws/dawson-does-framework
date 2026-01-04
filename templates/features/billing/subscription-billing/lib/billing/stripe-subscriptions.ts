/**
 * Stripe Subscriptions
 * 
 * Handle recurring billing with Stripe subscriptions.
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
}

export interface CustomerSubscription {
  id: string;
  status: Stripe.Subscription.Status;
  planId: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

/**
 * Create or get Stripe customer
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  // Check if customer exists
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0];
  }

  // Create new customer
  return stripe.customers.create({
    email,
    name,
    metadata: { userId },
  });
}

/**
 * Create checkout session for subscription
 */
export async function createSubscriptionCheckout(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

/**
 * Get customer's active subscription
 */
export async function getActiveSubscription(
  customerId: string
): Promise<CustomerSubscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });

  if (subscriptions.data.length === 0) {
    return null;
  }

  const sub = subscriptions.data[0];
  return {
    id: sub.id,
    status: sub.status,
    planId: sub.items.data[0].price.id,
    currentPeriodEnd: new Date(sub.current_period_end * 1000),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  };
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Resume cancelled subscription
 */
export async function resumeSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Change subscription plan
 */
export async function changePlan(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: "create_prorations",
  });
}

/**
 * Get billing portal URL
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

/**
 * Handle webhook events
 */
export async function handleWebhookEvent(
  event: Stripe.Event
): Promise<{ handled: boolean; action?: string }> {
  switch (event.type) {
    case "customer.subscription.created":
      // Handle new subscription
      return { handled: true, action: "subscription_created" };

    case "customer.subscription.updated":
      // Handle subscription update
      return { handled: true, action: "subscription_updated" };

    case "customer.subscription.deleted":
      // Handle subscription cancellation
      return { handled: true, action: "subscription_deleted" };

    case "invoice.payment_succeeded":
      // Handle successful payment
      return { handled: true, action: "payment_succeeded" };

    case "invoice.payment_failed":
      // Handle failed payment
      return { handled: true, action: "payment_failed" };

    default:
      return { handled: false };
  }
}

