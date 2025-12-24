/**
 * Stub for @dawson-framework/ai-agent package
 * Used when the package is not available (e.g., Vercel build)
 */

export interface GenerateProjectOptions {
  template: string;
  description: string;
  projectName: string;
  integrations?: Record<string, string>;
}

export interface GenerateProjectResult {
  success: boolean;
  files?: Array<{ path: string; content: string }>;
  error?: string;
}

export async function generateProject(
  _options: GenerateProjectOptions
): Promise<GenerateProjectResult> {
  return {
    success: false,
    error: "AI agent not available in this build",
  };
}

export default {
  generateProject,
};

