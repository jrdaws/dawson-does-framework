import type { BillingProvider } from "../billing";
import type { BillingCustomer, Subscription, UsageEvent, ProviderHealth } from "../types";

// Lemon Squeezy REST API client (lightweight implementation without SDK)

interface LemonSqueezyCustomer {
  id: string;
  attributes: {
    email: string;
    custom_data?: Record<string, any>;
  };
}

interface LemonSqueezyCheckout {
  data: {
    attributes: {
      url: string;
    };
  };
}

interface LemonSqueezySubscription {
  id: string;
  attributes: {
    status: string;
    customer_id: number;
    product_id: number;
    variant_id: number;
  };
}

class LemonSqueezyAPIClient {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.lemonsqueezy.com/v1";

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
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Lemon Squeezy API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return data;
  }

  async listCustomers(query: { email?: string }): Promise<{ data: LemonSqueezyCustomer[] }> {
    const params = new URLSearchParams();
    if (query.email) params.set("filter[email]", query.email);
    return this.request("GET", `/customers?${params.toString()}`);
  }

  async createCustomer(input: {
    store_id: string;
    email: string;
    name?: string;
    custom_data?: Record<string, any>;
  }): Promise<{ data: LemonSqueezyCustomer }> {
    return this.request("POST", "/customers", {
      data: {
        type: "customers",
        attributes: input,
      },
    });
  }

  async createCheckout(input: {
    store_id: string;
    variant_id: string;
    custom_data?: Record<string, any>;
    checkout_data?: {
      email?: string;
      custom?: Record<string, any>;
    };
  }): Promise<LemonSqueezyCheckout> {
    return this.request("POST", "/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          store_id: input.store_id,
          variant_id: input.variant_id,
          custom_data: input.custom_data,
          checkout_data: input.checkout_data,
        },
      },
    });
  }

  async getSubscription(subscriptionId: string): Promise<{ data: LemonSqueezySubscription }> {
    return this.request("GET", `/subscriptions/${subscriptionId}`);
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.request("DELETE", `/subscriptions/${subscriptionId}`);
  }
}

// Singleton Lemon Squeezy client
let _lemonSqueezy: LemonSqueezyAPIClient | null = null;

function getLemonSqueezyClient(): LemonSqueezyAPIClient {
  if (!_lemonSqueezy) {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    if (!apiKey) {
      throw new Error("LEMON_SQUEEZY_API_KEY environment variable is not set");
    }
    _lemonSqueezy = new LemonSqueezyAPIClient(apiKey);
  }
  return _lemonSqueezy;
}

// Error mapping utility
class LemonSqueezyBillingError extends Error {
  readonly code: string;
  readonly originalError?: unknown;

  constructor(message: string, code: string, originalError?: unknown) {
    super(message);
    this.name = "LemonSqueezyBillingError";
    this.code = code;
    this.originalError = originalError;
  }
}

function mapLemonSqueezyError(error: unknown, context: string): LemonSqueezyBillingError {
  const message = error instanceof Error ? error.message : String(error);
  return new LemonSqueezyBillingError(
    `[${context}] ${message}`,
    "lemonsqueezy_api_error",
    error
  );
}

const provider: BillingProvider = {
  name: "billing.lemon-squeezy",

  async ensureCustomer(input: { orgId: string; email?: string }): Promise<BillingCustomer> {
    const client = getLemonSqueezyClient();
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

    if (!storeId) {
      throw new Error("LEMON_SQUEEZY_STORE_ID environment variable is required");
    }

    try {
      // Search for existing customer by email
      if (input.email) {
        const existing = await client.listCustomers({ email: input.email });
        if (existing.data.length > 0) {
          const customer = existing.data[0];
          return {
            id: customer.id,
            email: customer.attributes.email,
          };
        }
      }

      // Create new customer
      if (!input.email) {
        throw new Error("Email is required to create a Lemon Squeezy customer");
      }

      const result = await client.createCustomer({
        store_id: storeId,
        email: input.email,
        custom_data: {
          orgId: input.orgId,
        },
      });

      return {
        id: result.data.id,
        email: result.data.attributes.email,
      };
    } catch (error) {
      throw mapLemonSqueezyError(error, "ensureCustomer");
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
    const client = getLemonSqueezyClient();
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

    if (!storeId) {
      throw new Error("LEMON_SQUEEZY_STORE_ID environment variable is required");
    }

    try {
      const result = await client.createCheckout({
        store_id: storeId,
        variant_id: input.priceId,
        custom_data: {
          ...input.metadata,
          customer_id: input.customerId,
        },
        checkout_data: {
          custom: {
            success_url: input.successUrl,
            cancel_url: input.cancelUrl,
          },
        },
      });

      return {
        url: result.data.attributes.url,
      };
    } catch (error) {
      throw mapLemonSqueezyError(error, "createCheckoutSession");
    }
  },

  async getActiveSubscription(customerId: string): Promise<Subscription | null> {
    // Lemon Squeezy doesn't have a direct "get subscriptions by customer" endpoint
    // Would need to track subscription IDs separately or use webhooks
    return null;
  },

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const client = getLemonSqueezyClient();
    try {
      await client.cancelSubscription(subscriptionId);
    } catch (error) {
      throw mapLemonSqueezyError(error, "cancelSubscription");
    }
  },

  async recordUsage(event: UsageEvent): Promise<void> {
    // Lemon Squeezy doesn't have built-in usage-based billing in the same way
    throw new Error("Usage recording not supported for Lemon Squeezy");
  },

  async verifyWebhook(input: { rawBody: string; headers: Headers }): Promise<boolean> {
    // Lemon Squeezy webhook verification requires signature checking
    const signature = input.headers.get("x-signature");
    if (!signature) {
      return false;
    }

    // In production, verify HMAC signature with LEMON_SQUEEZY_WEBHOOK_SECRET
    // For now, just check signature exists
    return true;
  },

  async parseWebhookEvent(rawBody: string): Promise<{ type: string; data: any; id: string }> {
    try {
      const event = JSON.parse(rawBody);
      return {
        type: event.meta?.event_name || "unknown",
        data: event.data || {},
        id: event.meta?.custom_data?.webhook_id || "unknown",
      };
    } catch (error) {
      throw mapLemonSqueezyError(error, "parseWebhookEvent");
    }
  },

  async health(): Promise<ProviderHealth> {
    try {
      const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
      const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
      const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

      // Don't make actual API call in health check
      return {
        ok: true,
        provider: "billing.lemon-squeezy",
        details: {
          apiKey: Boolean(apiKey),
          storeId: Boolean(storeId),
          webhookSecret: Boolean(webhookSecret),
          configured: Boolean(apiKey && storeId),
        },
      };
    } catch (error) {
      return {
        ok: false,
        provider: "billing.lemon-squeezy",
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },
};

export default provider;
