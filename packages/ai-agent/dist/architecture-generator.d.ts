import type { ProjectIntent, ProjectArchitecture } from "./types.js";
/** Options for architecture generation */
export interface ArchitectureOptions {
    apiKey?: string;
    model?: string;
}
/**
 * Generate project architecture from analyzed intent
 *
 * @param intent - Analyzed project intent
 * @param options - Optional API key and model configuration
 * @returns Project architecture with pages, components, and routes
 */
export declare function generateArchitecture(intent: ProjectIntent, options?: string | ArchitectureOptions): Promise<ProjectArchitecture>;
//# sourceMappingURL=architecture-generator.d.ts.map