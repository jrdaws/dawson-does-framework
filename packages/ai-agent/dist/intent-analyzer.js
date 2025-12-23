import { LLMClient } from "./utils/llm-client.js";
import { PromptLoader } from "./utils/prompt-loader.js";
import { withRetry } from "./utils/retry-strategy.js";
import { handleLLMError, handleValidationError } from "./error-handler.js";
import { IntentSchema } from "./validators/intent-schema.js";
import { repairAndParseJSON } from "./utils/json-repair.js";
/**
 * Analyze user's project description and extract structured intent
 *
 * @param input - Project input with description and optional metadata
 * @param options - Optional API key and model configuration
 * @returns Structured project intent with template suggestion and integrations
 */
export async function analyzeIntent(input, options) {
    const opts = typeof options === "string" ? { apiKey: options } : options || {};
    const client = new LLMClient(opts.apiKey);
    const prompts = new PromptLoader();
    return withRetry(async () => {
        try {
            // Load prompt with description
            const systemPrompt = await prompts.load("intent-analysis", {
                description: input.description,
            });
            // Use configured model (default to Haiku for cost efficiency)
            const model = opts.model || "claude-3-haiku-20240307";
            const response = await client.complete({
                model,
                temperature: 0, // Deterministic
                maxTokens: 2048,
                messages: [
                    {
                        role: "user",
                        content: `Analyze this project description: ${input.description}`,
                    },
                ],
                system: systemPrompt,
            }, "intent" // Track as intent stage
            );
            // Extract and parse JSON with repair fallback
            const repairResult = repairAndParseJSON(response.text);
            if (!repairResult.success) {
                throw new Error(`Failed to parse AI response: ${repairResult.error}. Response: ${response.text.substring(0, 500)}`);
            }
            if (repairResult.repaired) {
                console.log(`[IntentAnalyzer] JSON repaired: ${repairResult.repairs.join(", ")}`);
            }
            // Validate with Zod schema
            const validated = IntentSchema.parse(repairResult.data);
            return validated;
        }
        catch (error) {
            // Handle Zod validation errors
            if (error instanceof Error && error.name === "ZodError") {
                throw handleValidationError(error);
            }
            // Handle LLM errors
            throw handleLLMError(error);
        }
    });
}
