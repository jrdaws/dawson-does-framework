import type { LLMRequest, LLMResponse } from "../types.js";
import { type PipelineStage } from "./token-tracker.js";
export interface LLMClientOptions {
    apiKey?: string;
    trackUsage?: boolean;
}
/** Callback for streaming text chunks */
export type StreamCallback = (chunk: string, accumulated: string) => void;
/** Extended request with streaming support */
export interface StreamingLLMRequest extends LLMRequest {
    stream?: boolean;
    onStream?: StreamCallback;
}
export declare class LLMClient {
    private apiKey?;
    private trackUsage;
    constructor(apiKeyOrOptions?: string | LLMClientOptions);
    /**
     * Complete a request with optional token tracking and streaming
     *
     * @param req - LLM request parameters (supports streaming via req.stream and req.onStream)
     * @param stage - Pipeline stage for token tracking (optional)
     */
    complete(req: StreamingLLMRequest, stage?: PipelineStage): Promise<LLMResponse>;
    /**
     * Internal streaming implementation
     */
    private completeWithStreaming;
}
//# sourceMappingURL=llm-client.d.ts.map