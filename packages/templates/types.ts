/**
 * Integration & Feature Template Types
 * 
 * Defines the schema for code templates that get merged into generated projects.
 */

/**
 * File entry in a template manifest
 */
export interface TemplateFile {
  /** Destination path in the generated project (e.g., "lib/auth.ts") */
  path: string;
  /** Source template file relative to the integration folder */
  template: string;
  /** How to process the template */
  transform?: "mustache" | "none";
  /** Whether to overwrite if file exists */
  overwrite?: boolean;
}

/**
 * Integration template manifest (files.json)
 */
export interface IntegrationManifest {
  /** Unique identifier (e.g., "supabase") */
  id: string;
  /** Display name (e.g., "Supabase") */
  name: string;
  /** Category this integration belongs to */
  category: IntegrationCategory;
  /** Version of this template */
  version: string;
  /** Brief description */
  description: string;
  /** Files to copy into the project */
  files: TemplateFile[];
  /** Dependencies required */
  dependencies: {
    /** npm packages to add to package.json */
    npm: Record<string, string>;
    /** npm dev dependencies */
    npmDev?: Record<string, string>;
    /** Environment variables required */
    env: EnvVariable[];
    /** Other integrations this requires (e.g., auth requires database) */
    integrations?: string[];
  };
  /** Post-install instructions shown to user */
  postInstall?: string[];
  /** Files to merge into existing files (e.g., add provider to layout) */
  mergeInto?: MergeInstruction[];
}

/**
 * Environment variable definition
 */
export interface EnvVariable {
  /** Variable name (e.g., "NEXT_PUBLIC_SUPABASE_URL") */
  name: string;
  /** Description for .env.example comments */
  description: string;
  /** Whether this is required (vs optional) */
  required: boolean;
  /** Example value for .env.example */
  example?: string;
  /** Is this a public (NEXT_PUBLIC_) variable? */
  public?: boolean;
}

/**
 * Instruction for merging content into existing files
 */
export interface MergeInstruction {
  /** Target file path */
  file: string;
  /** Type of merge operation */
  type: "import" | "provider" | "export" | "append";
  /** Content to merge */
  content: string;
  /** Where to insert (for provider wrapping) */
  position?: "wrap-children" | "before" | "after";
}

/**
 * Feature template manifest
 */
export interface FeatureManifest {
  /** Unique identifier (e.g., "shopping-cart") */
  id: string;
  /** Display name */
  name: string;
  /** Feature category */
  category: FeatureCategory;
  /** Version */
  version: string;
  /** Description */
  description: string;
  /** Files to copy */
  files: TemplateFile[];
  /** Dependencies */
  dependencies: {
    npm: Record<string, string>;
    npmDev?: Record<string, string>;
    env?: EnvVariable[];
    /** Other features this depends on */
    features?: string[];
    /** Integrations required for this feature */
    integrations?: string[];
  };
  /** Component to render in preview */
  previewComponent?: string;
  /** Post-install instructions */
  postInstall?: string[];
}

/**
 * Integration categories matching the configurator sections
 */
export type IntegrationCategory =
  | "auth"
  | "payments"
  | "email"
  | "analytics"
  | "database"
  | "ai"
  | "storage"
  | "search"
  | "monitoring"
  | "cms"
  | "notifications"
  | "background-jobs"
  | "feature-flags"
  | "image-optimization";

/**
 * Feature categories matching lib/features.ts
 */
export type FeatureCategory =
  | "user-management"
  | "product-database"
  | "search-filter"
  | "ecommerce"
  | "analytics"
  | "billing"
  | "enterprise";

/**
 * Complete project configuration passed to the generator
 */
export interface ProjectConfig {
  /** Project name/slug */
  projectName: string;
  /** Project description */
  description: string;
  /** Selected template type */
  template: string;
  /** Vision statement (for AI customization) */
  vision?: string;
  /** Mission statement */
  mission?: string;
  /** Selected integrations by category */
  integrations: Record<IntegrationCategory, string | undefined>;
  /** Selected feature IDs */
  features: string[];
  /** Branding configuration */
  branding: {
    primaryColor: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
  };
}

/**
 * Generated file output
 */
export interface GeneratedFile {
  /** File path in the project */
  path: string;
  /** File contents */
  content: string;
  /** Whether to overwrite existing */
  overwrite: boolean;
}

/**
 * Complete generated project output
 */
export interface GeneratedProject {
  /** All generated files */
  files: GeneratedFile[];
  /** package.json content */
  packageJson: {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
  };
  /** .env.example content */
  envTemplate: string;
  /** README.md content */
  readme: string;
  /** Setup instructions to display */
  setupInstructions: string[];
  /** Warnings or notes */
  warnings?: string[];
}

