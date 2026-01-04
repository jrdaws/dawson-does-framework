import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. AI features will not work.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Generate a chat completion
 */
export async function generateChatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  }
) {
  const response = await openai.chat.completions.create({
    model: options?.model || DEFAULT_MODEL,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens,
    stream: options?.stream ?? false,
  });

  return response;
}

/**
 * Generate a streaming chat completion
 */
export async function* streamChatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  const stream = await openai.chat.completions.create({
    model: options?.model || DEFAULT_MODEL,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

/**
 * Generate a simple text completion
 */
export async function generateCompletion(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: options?.model || DEFAULT_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens,
  });

  return response.choices[0]?.message?.content || "";
}

export { OpenAI };

