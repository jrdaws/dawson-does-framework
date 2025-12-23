import { LLMClient, type StreamCallback } from "./utils/llm-client.js";
import { PromptLoader } from "./utils/prompt-loader.js";
import { withRetry } from "./utils/retry-strategy.js";
import { handleLLMError, handleValidationError } from "./error-handler.js";
import { ArchitectureSchema } from "./validators/architecture-schema.js";
import { TemplateSelector } from "./template-selector.js";
import { repairAndParseJSON } from "./utils/json-repair.js";
import type { ProjectIntent, ProjectArchitecture } from "./types.js";

/** Options for architecture generation */
export interface ArchitectureOptions {
  apiKey?: string;
  model?: string;
  stream?: boolean;
  onStream?: StreamCallback;
}

/**
 * Generate project architecture from analyzed intent
 *
 * @param intent - Analyzed project intent
 * @param options - Optional API key and model configuration
 * @returns Project architecture with pages, components, and routes
 */
export async function generateArchitecture(
  intent: ProjectIntent,
  options?: string | ArchitectureOptions
): Promise<ProjectArchitecture> {
  const opts: ArchitectureOptions = typeof options === "string" ? { apiKey: options } : options || {};
  const client = new LLMClient(opts.apiKey);
  const prompts = new PromptLoader();
  const selector = new TemplateSelector();

  return withRetry(async () => {
    try {
      // Load template metadata
      const template = await selector.selectTemplate(intent);

      // Validate integrations
      const validatedIntegrations = await selector.validateIntegrations(template, intent.integrations);

      // Prepare prompt variables
      const systemPrompt = await prompts.load("architecture-design", {
        intent: JSON.stringify(intent, null, 2),
        template: template.id,
        features: template.features.join(", "),
        supportedIntegrations: JSON.stringify(template.supportedIntegrations, null, 2),
      });

      // Use configured model (default to Haiku for cost efficiency)
      const model = opts.model || "claude-3-haiku-20240307";
      const response = await client.complete(
        {
          model,
          temperature: 0, // Deterministic
          maxTokens: 4096,
          messages: [
            {
              role: "user",
              content: "Design the project architecture based on the intent analysis.",
            },
          ],
          system: systemPrompt,
          stream: opts.stream,
          onStream: opts.onStream,
        },
        "architecture" // Track as architecture stage
      );

      // Extract and parse JSON with repair fallback
      const repairResult = repairAndParseJSON(response.text);

      if (!repairResult.success) {
        throw new Error(`Failed to parse AI response: ${repairResult.error}. Response: ${response.text.substring(0, 500)}`);
      }

      if (repairResult.repaired) {
        console.log(`[ArchitectureGenerator] JSON repaired: ${repairResult.repairs.join(", ")}`);
      }

      // Validate with Zod
      const validated = ArchitectureSchema.parse(repairResult.data);

      // Return with validated integrations
      return {
        ...validated,
        integrations: validatedIntegrations,
      } as ProjectArchitecture;
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        throw handleValidationError(error as any);
      }
      throw handleLLMError(error);
    }
  });
}
