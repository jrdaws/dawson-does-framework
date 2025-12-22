// Client-side utility for preview generation

export interface GeneratePreviewParams {
  template: string;
  projectName?: string;
  integrations: Record<string, string>;
  inspirations: Array<{ type: string; value: string; preview?: string }>;
  description: string;
  vision?: string;
  mission?: string;
  userApiKey?: string;
  seed?: number;
}

export interface GeneratePreviewResponse {
  success: boolean;
  html?: string;
  components?: string[];
  generatedAt?: string;
  seed?: number;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  remainingDemoGenerations?: number | null;
  cached?: boolean;
  error?: string;
  message?: string;
  rateLimited?: boolean;
}

export async function generatePreview(
  params: GeneratePreviewParams
): Promise<GeneratePreviewResponse> {
  // Generate or retrieve session ID
  let sessionId = localStorage.getItem("preview-session-id");
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("preview-session-id", sessionId);
  }

  const response = await fetch("/api/preview/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...params,
      sessionId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data.error || "Generation failed",
      message: data.message,
      rateLimited: data.rateLimited,
    };
  }

  return data;
}

export function getSessionId(): string {
  let sessionId = localStorage.getItem("preview-session-id");
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("preview-session-id", sessionId);
  }
  return sessionId;
}

export function clearSessionId(): void {
  localStorage.removeItem("preview-session-id");
}
