/**
 * Client-side wrapper for AI project generation
 */

export type ModelTier = 'fast' | 'balanced' | 'quality';

export interface ProjectGenerationParams {
  description: string;
  projectName?: string;
  template?: string;
  vision?: string;
  mission?: string;
  inspirations?: Array<{ type: string; value: string; preview?: string }>;
  userApiKey?: string;
  sessionId: string;
  seed?: number;
  modelTier?: ModelTier;
}

export interface ProjectGenerationResult {
  success: boolean;
  intent: {
    category: string;
    confidence: number;
    reasoning: string;
    suggestedTemplate: string;
    features: string[];
    integrations: Record<string, string | null>;
    complexity: string;
    keyEntities: string[];
  };
  architecture: {
    template: string;
    pages: Array<{
      path: string;
      name: string;
      description: string;
      components: string[];
      layout?: string;
    }>;
    components: Array<{
      name: string;
      type: string;
      description: string;
      props?: Record<string, string>;
      template: string;
    }>;
    routes: Array<{
      path: string;
      type: string;
      method?: string;
      description: string;
    }>;
    integrations: Record<string, string | null>;
  };
  files: Array<{
    path: string;
    content: string;
    overwrite: boolean;
  }>;
  integrationCode: Array<{
    integration: string;
    files: Array<{
      path: string;
      content: string;
      overwrite: boolean;
    }>;
  }>;
  cursorrules: string;
  startPrompt: string;
  generatedAt: string;
  seed: number;
  cached?: boolean;
  remainingDemoGenerations?: number | null;
  redisEnabled?: boolean;
}

export interface ProjectGenerationError {
  success: false;
  error: string;
  message: string;
  retryable?: boolean;
  rateLimited?: boolean;
  resetAt?: number;
  remaining?: number;
  details?: string;
}

/**
 * Generate a complete project from a description
 */
export async function generateProject(
  params: ProjectGenerationParams
): Promise<ProjectGenerationResult | ProjectGenerationError> {
  try {
    const response = await fetch("/api/generate/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "generation_failed",
        message: data.message || "Failed to generate project",
        retryable: data.retryable,
        rateLimited: data.rateLimited,
        resetAt: data.resetAt,
        remaining: data.remaining,
        details: data.details,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: "network_error",
      message:
        error instanceof Error ? error.message : "Network error occurred",
      retryable: true,
    };
  }
}
