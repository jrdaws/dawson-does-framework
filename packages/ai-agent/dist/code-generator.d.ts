import type { ProjectArchitecture, GeneratedCode, ProjectInput } from "./types.js";
/** Options for code generation */
export interface CodeOptions {
    apiKey?: string;
    model?: string;
}
/**
 * Generate code files from project architecture
 *
 * @param architecture - Project architecture definition
 * @param input - Original project input (for context)
 * @param options - Optional API key and model configuration
 * @returns Generated code files
 */
export declare function generateCode(architecture: ProjectArchitecture, input?: ProjectInput, options?: string | CodeOptions): Promise<GeneratedCode>;
//# sourceMappingURL=code-generator.d.ts.map