import Anthropic from "@anthropic-ai/sdk";
import { type ZodError, type ZodIssue } from "zod";

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
    const status = error.status || 500;
    const retryable = status === 429 || (status >= 500 && status < 600);

    let message = "API Error";
    let code = `anthropic_${error.status}`;

    switch (status) {
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
      { status, originalMessage: error.message }
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

export function handleValidationError(error: ZodError<any>): AIAgentError {
  const errorMessages = error.issues.map((e: ZodIssue) => `${e.path.join(".")}: ${e.message}`).join(", ");

  return new AIAgentError(
    "validation_error",
    `Invalid AI output: ${errorMessages}`,
    true, // Retryable - AI might generate valid output on retry
    { errors: error.issues }
  );
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof AIAgentError) {
    return error.retryable;
  }
  return false;
}
