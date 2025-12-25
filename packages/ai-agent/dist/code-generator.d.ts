import { type StreamCallback } from "./utils/llm-client.js";
import type { ProjectArchitecture, GeneratedCode, ProjectInput } from "./types.js";
/** Options for code generation */
export interface CodeOptions {
    apiKey?: string;
    model?: string;
    stream?: boolean;
    onStream?: StreamCallback;
}
/** Batch size for chunked generation */
export declare const BATCH_SIZE = 5;
/** Token limit per batch */
export declare const BATCH_TOKEN_LIMIT = 4096;
/**
 * Estimate file count from architecture
 * @internal Exported for testing
 */
export declare function estimateFileCount(architecture: ProjectArchitecture): number;
/**
 * Group files into batches for generation
 * Groups related files together (e.g., page + its components)
 * @internal Exported for testing
 */
export declare function createBatches(architecture: ProjectArchitecture): Array<{
    description: string;
    pages: typeof architecture.pages;
    components: typeof architecture.components;
    routes: typeof architecture.routes;
}>;
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
export declare function generateCode(architecture: ProjectArchitecture, input?: ProjectInput, options?: string | CodeOptions): Promise<GeneratedCode>;
//# sourceMappingURL=code-generator.d.ts.map