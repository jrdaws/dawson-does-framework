import { BillingCustomer, ProviderHealth, Subscription, UsageEvent } from "./types";

export interface BillingProvider {
  readonly name: string;
  ensureCustomer(input: { orgId: string; email?: string }): Promise<BillingCustomer>;
  createCheckoutSession(input: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    quantity?: number;
    metadata?: Record<string, string>;
  }): Promise<{ url: string }>;
  getActiveSubscription(customerId: string): Promise<Subscription | null>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  recordUsage(event: UsageEvent): Promise<void>;
  verifyWebhook(input: { rawBody: string; headers: Headers }): Promise<boolean>;
  parseWebhookEvent(rawBody: string): Promise<{ type: string; data: any; id: string }>;
  health(): Promise<ProviderHealth>;
}
