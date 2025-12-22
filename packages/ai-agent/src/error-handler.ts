import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

export class AIAgentError extends Error {
  constructor(
    public code: string,
    message: string,
    public retryable: boolean = false,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AIAgentError";
  }
}

export function handleLLMError(error: unknown): AIAgentError {
  // Handle Anthropic API errors
  if (error instanceof Anthropic.APIError) {
    const retryable = error.status === 429 || (error.status >= 500 && error.status < 600);

    let message = "API Error";
    let code = `anthropic_${error.status}`;

    switch (error.status) {
      case 401:
        message = "Invalid API key. Please check your ANTHROPIC_API_KEY.";
        break;
      case 429:
        message = "Rate limit exceeded. Please try again in a few moments.";
        break;
      case 400:
        message = "Invalid request to Claude API.";
        break;
      case 500:
      case 503:
        message = "Claude API is temporarily unavailable.";
        break;
      default:
        message = `API Error: ${error.message}`;
    }

    return new AIAgentError(
      code,
      message,
      retryable,
      { status: error.status, originalMessage: error.message }
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    return new AIAgentError(
      "unknown_error",
      `Unexpected error: ${error.message}`,
      false,
      { error: error.message, stack: error.stack }
    );
  }

  return new AIAgentError(
    "unknown_error",
    "An unexpected error occurred",
    false,
    { error: String(error) }
  );
}

export function handleValidationError(error: z.ZodError): AIAgentError {
  const errorMessages = error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");

  return new AIAgentError(
    "validation_error",
    `Invalid AI output: ${errorMessages}`,
    true, // Retryable - AI might generate valid output on retry
    { errors: error.errors }
  );
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof AIAgentError) {
    return error.retryable;
  }
  return false;
}
