import { LLMRequest, LLMResponse, ProviderHealth } from "./types";

export interface LLMProvider {
  readonly name: string;
  complete(req: LLMRequest): Promise<LLMResponse>;
  embed?(input: { model: string; texts: string[] }): Promise<{ vectors: number[][] }>;
  health(): Promise<ProviderHealth>;
}
