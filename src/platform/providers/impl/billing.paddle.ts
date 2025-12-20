import type { BillingProvider } from "../billing";
import type { BillingCustomer, Subscription, UsageEvent, ProviderHealth } from "../types";

// Paddle REST API client (lightweight implementation without SDK)
// Using Paddle Billing API (not Classic)

interface PaddleCustomer {
  id: string;
  email: string;
  custom_data?: Record<string, any>;
}

interface PaddleCheckoutSession {
  url: string;
}

interface PaddleSubscription {
  id: string;
  status: string;
  customer_id: string;
  items: Array<{
    price_id: string;
    quantity: number;
  }>;
}

class PaddleAPIClient {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.paddle.com";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Paddle API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return data;
  }

  async listCustomers(query: { email?: string }): Promise<{ data: PaddleCustomer[] }> {
    const params = new URLSearchParams();
    if (query.email) params.set("email", query.email);
    return this.request("GET", `/customers?${params.toString()}`);
  }

  async createCustomer(input: { email?: string; custom_data?: Record<string, any> }): Promise<{ data: PaddleCustomer }> {
    return this.request("POST", "/customers", input);
  }

  async createTransaction(input: {
    customer_id?: string;
    items: Array<{ price_id: string; quantity: number }>;
    custom_data?: Record<string, any>;
  }): Promise<{ data: { checkout: { url: string } } }> {
    return this.request("POST", "/transactions", input);
  }

  async getSubscription(subscriptionId: string): Promise<{ data: PaddleSubscription }> {
    return this.request("GET", `/subscriptions/${subscriptionId}`);
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.request("POST", `/subscriptions/${subscriptionId}/cancel`, {
      effective_from: "next_billing_period",
    });
  }
}

// Singleton Paddle client
let _paddle: PaddleAPIClient | null = null;

function getPaddleClient(): PaddleAPIClient {
  if (!_paddle) {
    const apiKey = process.env.PADDLE_API_KEY;
    if (!apiKey) {
      throw new Error("PADDLE_API_KEY environment variable is not set");
    }
    _paddle = new PaddleAPIClient(apiKey);
  }
  return _paddle;
}

// Error mapping utility
class PaddleBillingError extends Error {
  readonly code: string;
  readonly originalError?: unknown;

  constructor(message: string, code: string, originalError?: unknown) {
    super(message);
    this.name = "PaddleBillingError";
    this.code = code;
    this.originalError = originalError;
  }
}

function mapPaddleError(error: unknown, context: string): PaddleBillingError {
  const message = error instanceof Error ? error.message : String(error);
  return new PaddleBillingError(
    `[${context}] ${message}`,
    "paddle_api_error",
    error
  );
}

const provider: BillingProvider = {
  name: "billing.paddle",

  async ensureCustomer(input: { orgId: string; email?: string }): Promise<BillingCustomer> {
    const paddle = getPaddleClient();
    try {
      // Search for existing customer by email
      if (input.email) {
        const existing = await paddle.listCustomers({ email: input.email });
        if (existing.data.length > 0) {
          const customer = existing.data[0];
          return {
            id: customer.id,
            email: customer.email,
          };
        }
      }

      // Create new customer
      const result = await paddle.createCustomer({
        email: input.email,
        custom_data: {
          orgId: input.orgId,
        },
      });

      return {
        id: result.data.id,
        email: result.data.email,
      };
    } catch (error) {
      throw mapPaddleError(error, "ensureCustomer");
    }
  },

  async createCheckoutSession(input: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    quantity?: number;
    metadata?: Record<string, string>;
  }): Promise<{ url: string }> {
    const paddle = getPaddleClient();
    try {
      const result = await paddle.createTransaction({
        customer_id: input.customerId,
        items: [
          {
            price_id: input.priceId,
            quantity: input.quantity || 1,
          },
        ],
        custom_data: {
          ...input.metadata,
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
        },
      });

      return {
        url: result.data.checkout.url,
      };
    } catch (error) {
      throw mapPaddleError(error, "createCheckoutSession");
    }
  },

  async getActiveSubscription(customerId: string): Promise<Subscription | null> {
    // Note: Paddle doesn't have a direct "get subscriptions by customer" endpoint in the basic implementation
    // In production, you'd need to track subscription IDs or use webhooks
    return null;
  },

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const paddle = getPaddleClient();
    try {
      await paddle.cancelSubscription(subscriptionId);
    } catch (error) {
      throw mapPaddleError(error, "cancelSubscription");
    }
  },

  async recordUsage(event: UsageEvent): Promise<void> {
    // Paddle usage-based billing would be handled through event ingestion
    // This is a placeholder - actual implementation depends on Paddle's usage API
    throw new Error("Usage recording not yet implemented for Paddle");
  },

  async verifyWebhook(input: { rawBody: string; headers: Headers }): Promise<boolean> {
    // Paddle webhook verification requires signature checking
    // This is a simplified implementation
    const signature = input.headers.get("paddle-signature");
    if (!signature) {
      return false;
    }

    // In production, verify HMAC signature with PADDLE_WEBHOOK_SECRET
    // For now, just check signature exists
    return true;
  },

  async parseWebhookEvent(rawBody: string): Promise<{ type: string; data: any; id: string }> {
    try {
      const event = JSON.parse(rawBody);
      return {
        type: event.event_type || "unknown",
        data: event.data || {},
        id: event.event_id || "unknown",
      };
    } catch (error) {
      throw mapPaddleError(error, "parseWebhookEvent");
    }
  },

  async health(): Promise<ProviderHealth> {
    try {
      const apiKey = process.env.PADDLE_API_KEY;
      const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

      // Don't make actual API call in health check to avoid costs
      return {
        ok: true,
        provider: "billing.paddle",
        details: {
          apiKey: Boolean(apiKey),
          webhookSecret: Boolean(webhookSecret),
          configured: Boolean(apiKey),
        },
      };
    } catch (error) {
      return {
        ok: false,
        provider: "billing.paddle",
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },
};

export default provider;
