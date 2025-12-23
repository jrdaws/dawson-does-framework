import Anthropic from "@anthropic-ai/sdk";
import type { LLMRequest, LLMResponse } from "../types.js";
import { getGlobalTracker, type PipelineStage } from "./token-tracker.js";

// Singleton Anthropic client
let _client: Anthropic | null = null;

function getAnthropicClient(apiKey?: string): Anthropic {
  if (!_client) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    _client = new Anthropic({ apiKey: key });
  }
  return _client;
}

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

export class LLMClient {
  private apiKey?: string;
  private trackUsage: boolean;

  constructor(apiKeyOrOptions?: string | LLMClientOptions) {
    if (typeof apiKeyOrOptions === "string") {
      this.apiKey = apiKeyOrOptions;
      this.trackUsage = true;
    } else {
      this.apiKey = apiKeyOrOptions?.apiKey;
      this.trackUsage = apiKeyOrOptions?.trackUsage ?? true;
    }
  }

  /**
   * Complete a request with optional token tracking and streaming
   * 
   * @param req - LLM request parameters (supports streaming via req.stream and req.onStream)
   * @param stage - Pipeline stage for token tracking (optional)
   */
  async complete(req: StreamingLLMRequest, stage?: PipelineStage): Promise<LLMResponse> {
    const client = getAnthropicClient(this.apiKey);
    const startTime = Date.now();

    try {
      // Separate system messages from others
      const systemMessages = req.messages.filter((m) => m.role === "system");
      const nonSystemMessages = req.messages.filter((m) => m.role !== "system");

      // Build system prompt
      let systemPrompt = req.system || "";
      if (systemMessages.length > 0) {
        systemPrompt = systemMessages.map((m) => m.content).join("\n");
      }

      const model = req.model || "claude-sonnet-4-20250514";
      const maxTokens = req.maxTokens || 4096;
      const temperature = req.temperature ?? 0;

      const messages: { role: "user" | "assistant"; content: string }[] = nonSystemMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" as const : "user" as const,
        content: m.content,
      }));

      const messageParams = {
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt || undefined,
        messages,
      };

      // Use streaming if requested
      if (req.stream && req.onStream) {
        return await this.completeWithStreaming(client, messageParams, req.onStream, stage, startTime, model);
      }

      // Non-streaming path
      const response = await client.messages.create(messageParams);

      const durationMs = Date.now() - startTime;

      // Extract text from response
      const text = response.content
        .filter((block) => block.type === "text")
        .map((block) => (block as { type: "text"; text: string }).text)
        .join("");

      const usage = {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      };

      // Track token usage if stage is provided
      if (this.trackUsage && stage) {
        const tracker = getGlobalTracker();
        tracker.record({
          stage,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          model,
          timestamp: new Date(),
          cached: false,
          durationMs,
        });
      }

      return {
        id: response.id,
        text,
        usage,
      };
    } catch (error) {
      // Re-throw with context - error handling will be done by error-handler.ts
      throw error;
    }
  }

  /**
   * Internal streaming implementation
   */
  private async completeWithStreaming(
    client: Anthropic,
    params: {
      model: string;
      max_tokens: number;
      temperature: number;
      system: string | undefined;
      messages: { role: "user" | "assistant"; content: string }[];
    },
    onStream: StreamCallback,
    stage: PipelineStage | undefined,
    startTime: number,
    model: string
  ): Promise<LLMResponse> {
    let text = "";
    let inputTokens = 0;
    let outputTokens = 0;
    let responseId = "";

    // Use streaming API
    const stream = await client.messages.stream(params);

    // Process stream events
    for await (const event of stream) {
      if (event.type === "message_start") {
        responseId = event.message.id;
        inputTokens = event.message.usage?.input_tokens || 0;
      } else if (event.type === "content_block_delta") {
        const delta = event.delta as { type: string; text?: string };
        if (delta.type === "text_delta" && delta.text) {
          text += delta.text;
          // Call the stream callback with the new chunk and accumulated text
          onStream(delta.text, text);
        }
      } else if (event.type === "message_delta") {
        const msgDelta = event as { type: string; usage?: { output_tokens: number } };
        if (msgDelta.usage?.output_tokens) {
          outputTokens = msgDelta.usage.output_tokens;
        }
      }
    }

    const durationMs = Date.now() - startTime;

    // Track token usage if stage is provided
    if (this.trackUsage && stage) {
      const tracker = getGlobalTracker();
      tracker.record({
        stage,
        inputTokens,
        outputTokens,
        model,
        timestamp: new Date(),
        cached: false,
        durationMs,
      });
    }

    return {
      id: responseId,
      text,
      usage: {
        inputTokens,
        outputTokens,
      },
    };
  }
}
