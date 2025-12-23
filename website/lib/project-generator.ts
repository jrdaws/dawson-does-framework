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
  stream?: boolean;
}

// Progress event from streaming API
export interface StreamProgressEvent {
  type: 'progress';
  stage: 'intent' | 'architecture' | 'code' | 'context';
  eventType: 'start' | 'chunk' | 'complete';
  message?: string;
}

// Callback for streaming progress updates
export type StreamProgressCallback = (event: StreamProgressEvent) => void;

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
 * 
 * @param params - Generation parameters
 * @param onProgress - Optional callback for streaming progress updates
 */
export async function generateProject(
  params: ProjectGenerationParams,
  onProgress?: StreamProgressCallback
): Promise<ProjectGenerationResult | ProjectGenerationError> {
  // Use streaming if callback is provided
  const enableStreaming = !!onProgress;
  
  try {
    const response = await fetch("/api/generate/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...params, stream: enableStreaming }),
    });

    if (!response.ok) {
      const data = await response.json();
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

    // Handle streaming response
    if (enableStreaming && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let result: ProjectGenerationResult | null = null;
      let errorResult: ProjectGenerationError | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Parse SSE events from buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6));
              
              if (eventData.type === 'progress') {
                onProgress({
                  type: 'progress',
                  stage: eventData.stage,
                  eventType: eventData.eventType,
                  message: eventData.message,
                });
              } else if (eventData.type === 'complete') {
                result = eventData.result;
              } else if (eventData.type === 'error') {
                errorResult = {
                  success: false,
                  error: eventData.error,
                  message: eventData.message,
                  retryable: eventData.retryable,
                };
              }
            } catch (parseError) {
              console.error('Failed to parse SSE event:', parseError);
            }
          }
        }
      }

      // Return the final result or error
      if (errorResult) {
        return errorResult;
      }
      if (result) {
        return result;
      }
      
      return {
        success: false,
        error: "stream_ended",
        message: "Stream ended without result",
        retryable: true,
      };
    }

    // Non-streaming: parse JSON response directly
    const data = await response.json();
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
