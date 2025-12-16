export type PlanTier = "free" | "pro" | "team";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  imageUrl?: string;
  emailVerified?: boolean;
};

export type Session = {
  user: AuthUser;
  accessToken?: string;
  expiresAt?: number;
};

export type BillingCustomer = { id: string; email?: string };

export type Subscription = {
  id: string;
  status: "active" | "trialing" | "past_due" | "canceled";
  planId: string;
  seats?: number;
  currentPeriodEnd?: number;
};

export type UsageEvent = {
  customerId: string;
  key: string;
  quantity: number;
  ts?: number;
  metadata?: Record<string, string | number | boolean>;
};

export type WebhookEvent<T = unknown> = {
  id: string;
  type: string;
  createdAt: number;
  data: T;
};

export type AnalyticsEvent = {
  name: string;
  userId?: string;
  orgId?: string;
  properties?: Record<string, unknown>;
  ts?: number;
};

export type LLMMessage = { role: "system" | "user" | "assistant"; content: string };

export type LLMRequest = {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  tools?: unknown[];
  metadata?: Record<string, unknown>;
};

export type LLMResponse = {
  id: string;
  model: string;
  outputText: string;
  usage?: { inputTokens?: number; outputTokens?: number; costUsd?: number };
  raw?: unknown;
};

export type ProviderHealth = {
  ok: boolean;
  provider: string;
  details?: Record<string, unknown>;
};
