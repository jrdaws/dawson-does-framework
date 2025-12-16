import { ProviderHealth, WebhookEvent } from "./types";

export interface WebhookProvider {
  readonly name: string;
  send(input: {
    url: string;
    secret: string;
    event: WebhookEvent;
    headers?: Record<string, string>;
    timeoutMs?: number;
  }): Promise<{ ok: boolean; status: number; attemptId: string }>;
  verifyInbound?(input: { rawBody: string; headers: Headers; secret: string }): Promise<boolean>;
  health(): Promise<ProviderHealth>;
}
