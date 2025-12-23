import { type StreamCallback } from "./utils/llm-client.js";
import type { ProjectInput, ProjectIntent } from "./types.js";
/** Options for intent analysis */
export interface IntentOptions {
    apiKey?: string;
    model?: string;
    stream?: boolean;
    onStream?: StreamCallback;
}
/**
 * Analyze user's project description and extract structured intent
 *
 * @param input - Project input with description and optional metadata
 * @param options - Optional API key and model configuration
 * @returns Structured project intent with template suggestion and integrations
 */
export declare function analyzeIntent(input: ProjectInput, options?: string | IntentOptions): Promise<ProjectIntent>;
//# sourceMappingURL=intent-analyzer.d.ts.map