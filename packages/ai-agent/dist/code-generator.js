import { readFile } from "fs/promises";
import { join } from "path";
import { LLMClient } from "./utils/llm-client.js";
import { PromptLoader } from "./utils/prompt-loader.js";
import { withRetry } from "./utils/retry-strategy.js";
import { handleLLMError, handleValidationError } from "./error-handler.js";
import { CodeSchema } from "./validators/code-schema.js";
import { repairAndParseJSON } from "./utils/json-repair.js";
/** Batch size for chunked generation */
export const BATCH_SIZE = 5;
/** Token limit per batch */
export const BATCH_TOKEN_LIMIT = 4096;
/**
 * Estimate file count from architecture
 * @internal Exported for testing
 */
export function estimateFileCount(architecture) {
    const pages = architecture.pages.length;
    const newComponents = architecture.components.filter(c => c.template === 'create-new').length;
    const apiRoutes = architecture.routes.filter(r => r.type === 'api').length;
    return pages + newComponents + apiRoutes;
}
/**
 * Group files into batches for generation
 * Groups related files together (e.g., page + its components)
 * @internal Exported for testing
 */
export function createBatches(architecture) {
    const batches = [];
    // Get all items to batch
    const pages = [...architecture.pages];
    const components = architecture.components.filter(c => c.template === 'create-new');
    const routes = architecture.routes.filter(r => r.type === 'api');
    // Create batches by grouping pages with their referenced components
    while (pages.length > 0 || components.length > 0 || routes.length > 0) {
        const batch = {
            description: '',
            pages: [],
            components: [],
            routes: []
        };
        let itemCount = 0;
        // Add pages and their referenced components
        while (pages.length > 0 && itemCount < BATCH_SIZE) {
            const page = pages.shift();
            batch.pages.push(page);
            itemCount++;
            // Find and add components used by this page
            for (const compName of page.components) {
                const compIdx = components.findIndex(c => c.name === compName);
                if (compIdx !== -1 && itemCount < BATCH_SIZE) {
                    batch.components.push(components.splice(compIdx, 1)[0]);
                    itemCount++;
                }
            }
        }
        // Fill remaining slots with components
        while (components.length > 0 && itemCount < BATCH_SIZE) {
            batch.components.push(components.shift());
            itemCount++;
        }
        // Fill remaining slots with API routes
        while (routes.length > 0 && itemCount < BATCH_SIZE) {
            batch.routes.push(routes.shift());
            itemCount++;
        }
        // Create batch description
        const parts = [];
        if (batch.pages.length)
            parts.push(`${batch.pages.length} pages`);
        if (batch.components.length)
            parts.push(`${batch.components.length} components`);
        if (batch.routes.length)
            parts.push(`${batch.routes.length} API routes`);
        batch.description = parts.join(', ');
        if (itemCount > 0) {
            batches.push(batch);
        }
    }
    return batches;
}
/**
 * Generate code files from project architecture
 *
 * Uses chunked generation for complex projects (>5 files) to avoid token limits.
 * Each chunk includes context of previously generated files for coherence.
 *
 * @param architecture - Project architecture definition
 * @param input - Original project input (for context)
 * @param options - Optional API key and model configuration
 * @returns Generated code files
 */
export async function generateCode(architecture, input, options) {
    const opts = typeof options === "string" ? { apiKey: options } : options || {};
    // Estimate file count to determine if chunking is needed
    const estimatedFiles = estimateFileCount(architecture);
    if (estimatedFiles <= BATCH_SIZE) {
        // Simple case: generate all at once
        return generateSingleBatch(architecture, input, opts);
    }
    // Complex case: chunked generation
    console.log(`[CodeGenerator] Using chunked generation for ${estimatedFiles} files`);
    return generateChunked(architecture, input, opts);
}
/**
 * Generate all files in a single batch (simple projects)
 */
async function generateSingleBatch(architecture, input, opts = {}) {
    const client = new LLMClient(opts.apiKey);
    const prompts = new PromptLoader();
    return withRetry(async () => {
        try {
            // Load template reference file to show AI the style
            const templateReference = await loadTemplateReference(architecture.template);
            // Load design quality reference
            const designReference = await loadDesignReference();
            // Prepare prompt variables
            const systemPrompt = await prompts.load("code-generation", {
                architecture: JSON.stringify(architecture, null, 2),
                projectName: input?.projectName || "MyApp",
                templateReference,
                designReference,
            });
            // Use configured model (default to Sonnet for code quality)
            const model = opts.model || "claude-sonnet-4-20250514";
            const response = await client.complete({
                model,
                temperature: 0, // Deterministic
                maxTokens: BATCH_TOKEN_LIMIT,
                messages: [
                    {
                        role: "user",
                        content: "Generate the code files based on the architecture definition.",
                    },
                ],
                system: systemPrompt,
                stream: opts.stream,
                onStream: opts.onStream,
            }, "code" // Track as code stage
            );
            // Extract and parse JSON with repair fallback
            const repairResult = repairAndParseJSON(response.text);
            if (!repairResult.success) {
                throw new Error(`Failed to parse AI response: ${repairResult.error}. Response: ${response.text.substring(0, 500)}`);
            }
            if (repairResult.repaired) {
                console.log(`[CodeGenerator] JSON repaired: ${repairResult.repairs.join(", ")}`);
            }
            // Validate with Zod
            const validated = CodeSchema.parse(repairResult.data);
            return validated;
        }
        catch (error) {
            if (error instanceof Error && error.name === "ZodError") {
                throw handleValidationError(error);
            }
            throw handleLLMError(error);
        }
    });
}
/**
 * Generate files in chunks for complex projects
 * Maintains context between batches for coherence
 */
async function generateChunked(architecture, input, opts = {}) {
    const client = new LLMClient(opts.apiKey);
    const prompts = new PromptLoader();
    const batches = createBatches(architecture);
    const allFiles = [];
    const allIntegrationCode = [];
    // Track previously generated files for context
    const previousFiles = [];
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const isFirstBatch = i === 0;
        const batchNum = i + 1;
        const totalBatches = batches.length;
        console.log(`[CodeGenerator] Generating batch ${batchNum}/${totalBatches}: ${batch.description}`);
        const result = await withRetry(async () => {
            try {
                // Load template reference file to show AI the style
                const templateReference = await loadTemplateReference(architecture.template);
                // Load design quality reference
                const designReference = await loadDesignReference();
                // Create batch-specific architecture
                const batchArchitecture = {
                    template: architecture.template,
                    pages: batch.pages,
                    components: batch.components,
                    routes: batch.routes,
                    integrations: architecture.integrations,
                };
                // Build context from previous files
                const previousContext = previousFiles.length > 0
                    ? `\n\nPREVIOUSLY GENERATED (for context, DO NOT regenerate):\n${previousFiles.map(f => `- ${f.path}: ${f.description}`).join('\n')}`
                    : '';
                // Prepare prompt variables with batch context
                const basePrompt = await prompts.load("code-generation", {
                    architecture: JSON.stringify(batchArchitecture, null, 2),
                    projectName: input?.projectName || "MyApp",
                    templateReference,
                    designReference,
                });
                // Add batch context to prompt
                const systemPrompt = isFirstBatch
                    ? basePrompt
                    : `${basePrompt}\n\nBATCH ${batchNum}/${totalBatches}: Generate ONLY the files for this batch.${previousContext}`;
                // Use configured model (default to Sonnet for code quality)
                const model = opts.model || "claude-sonnet-4-20250514";
                const response = await client.complete({
                    model,
                    temperature: 0, // Deterministic
                    maxTokens: BATCH_TOKEN_LIMIT,
                    messages: [
                        {
                            role: "user",
                            content: isFirstBatch
                                ? "Generate the code files based on the architecture definition."
                                : `Generate batch ${batchNum} of ${totalBatches}. Only generate files for: ${batch.description}`,
                        },
                    ],
                    system: systemPrompt,
                    stream: opts.stream,
                    onStream: opts.onStream,
                }, "code" // Track as code stage
                );
                // Extract and parse JSON with repair fallback
                const repairResult = repairAndParseJSON(response.text);
                if (!repairResult.success) {
                    throw new Error(`Failed to parse AI response: ${repairResult.error}. Response: ${response.text.substring(0, 500)}`);
                }
                if (repairResult.repaired) {
                    console.log(`[CodeGenerator] JSON repaired (batch ${batchNum}): ${repairResult.repairs.join(", ")}`);
                }
                // Validate with Zod
                const validated = CodeSchema.parse(repairResult.data);
                return validated;
            }
            catch (error) {
                if (error instanceof Error && error.name === "ZodError") {
                    throw handleValidationError(error);
                }
                throw handleLLMError(error);
            }
        });
        // Merge batch results
        allFiles.push(...result.files);
        allIntegrationCode.push(...result.integrationCode);
        // Update context for next batch
        for (const file of result.files) {
            // Extract brief description from path
            const pathParts = file.path.split('/');
            const fileName = pathParts[pathParts.length - 1];
            const folder = pathParts.length > 1 ? pathParts[pathParts.length - 2] : '';
            previousFiles.push({
                path: file.path,
                description: `${folder}/${fileName}`.replace('//', '/'),
            });
        }
    }
    console.log(`[CodeGenerator] Chunked generation complete: ${allFiles.length} files generated`);
    return {
        files: allFiles,
        integrationCode: allIntegrationCode,
    };
}
/**
 * Load a reference file from the template to show AI the code style
 */
async function loadTemplateReference(templateId) {
    try {
        const templatesDir = join(process.cwd(), "templates");
        const pagePath = join(templatesDir, templateId, "app", "page.tsx");
        const content = await readFile(pagePath, "utf-8");
        return `Example page from ${templateId} template:\n\n${content}`;
    }
    catch (error) {
        console.warn(`[CodeGenerator] Could not load template reference: ${error.message}`);
        return "// Template reference not available";
    }
}
/**
 * Load design quality reference standards
 */
async function loadDesignReference() {
    try {
        // Try to load from prompts directory first
        const promptsDir = join(process.cwd(), "packages", "ai-agent", "src", "prompts");
        const designPath = join(promptsDir, "design-quality.md");
        const content = await readFile(designPath, "utf-8");
        return content;
    }
    catch {
        // Fallback to inline reference
        return `DESIGN: Modern SaaS aesthetic (Linear/Vercel inspired), shadcn/ui patterns, 
consistent Tailwind spacing, dark mode ready, WCAG AA contrast, NO generic AI slop`;
    }
}
