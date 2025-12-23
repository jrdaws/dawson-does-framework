import { type StreamCallback } from "./utils/llm-client.js";
import type { ProjectIntent, ProjectArchitecture, GeneratedCode, CursorContext } from "./types.js";
export interface ContextInput {
    intent: ProjectIntent;
    architecture: ProjectArchitecture;
    code: GeneratedCode;
    projectName?: string;
    description?: string;
}
/** Options for context building */
export interface ContextOptions {
    apiKey?: string;
    model?: string;
    stream?: boolean;
    onStream?: StreamCallback;
}
/**
 * Build Cursor context files (.cursorrules and START_PROMPT.md)
 *
 * OPTIMIZED: Generates both files in a single API call using delimiter format
 * This reduces API calls from 2 to 1 (~$0.02 savings per generation)
 *
 * @param input - Project context (intent, architecture, code)
 * @param options - Optional API key and model configuration
 * @returns Cursor context files
 */
export declare function buildCursorContext(input: ContextInput, options?: string | ContextOptions): Promise<CursorContext>;
//# sourceMappingURL=context-builder.d.ts.map