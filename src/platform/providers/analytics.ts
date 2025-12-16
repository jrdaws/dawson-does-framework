import { AnalyticsEvent, ProviderHealth } from "./types";

export interface AnalyticsProvider {
  readonly name: string;
  track(event: AnalyticsEvent): Promise<void>;
  identify(input: { userId: string; traits?: Record<string, unknown> }): Promise<void>;
  flush?(): Promise<void>;
  health(): Promise<ProviderHealth>;
}
