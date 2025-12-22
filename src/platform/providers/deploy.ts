import type { ProviderHealth } from "./types";

/**
 * Deployment provider interface for deploying applications to various platforms.
 * Implementations: Vercel, Netlify, Railway
 */
export interface DeployProvider {
  /** Provider name (e.g., "deploy.vercel") */
  name: string;

  /** Check provider health and configuration */
  health(): Promise<ProviderHealth>;

  /** Check if credentials are available (env or file) */
  hasCredentials(): boolean;

  /** Validate stored credentials */
  validateCredentials(): Promise<{ valid: boolean; error?: string }>;

  /** Detect project configuration in the given directory */
  detectProject(cwd: string): Promise<ProjectDetection>;

  /** Deploy the project */
  deploy(config: DeployConfig): Promise<DeployResult>;

  /** Stream build logs for a deployment */
  streamLogs(deploymentId: string, onLog: (log: string) => void): Promise<void>;

  /** Get deployment status */
  getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus>;
}

/**
 * Project detection result
 */
export type ProjectDetection = {
  detected: boolean;
  projectId?: string;
  projectName?: string;
  framework?: string;
  orgId?: string;
};

/**
 * Deployment configuration
 */
export type DeployConfig = {
  /** Working directory */
  cwd: string;
  /** Deploy to production (vs preview) */
  production: boolean;
  /** Target environment name */
  environment?: string;
  /** Project ID (if already exists) */
  projectId?: string;
  /** Project name (for new projects) */
  projectName?: string;
  /** Build command override */
  buildCommand?: string;
  /** Environment variables */
  env?: Record<string, string>;
};

/**
 * Deployment result
 */
export type DeployResult = {
  success: boolean;
  deploymentId: string;
  url: string;
  status: "queued" | "building" | "ready" | "error";
  buildTime?: number;
  error?: string;
};

/**
 * Deployment status
 */
export type DeploymentStatus = {
  state: "queued" | "building" | "ready" | "error" | "canceled";
  url?: string;
  buildTime?: number;
  error?: string;
  logs?: string[];
};

/**
 * Project type detection result
 */
export type ProjectType = {
  type: "nextjs" | "vite" | "cra" | "sveltekit" | "nuxt" | "static";
  framework: string | null;
  buildCommand: string | null;
};

/**
 * Provider detection result
 */
export type ProviderDetection = {
  provider: "vercel" | "netlify" | "railway";
  source: string;
  confidence: "explicit" | "high" | "medium" | "low";
};

/**
 * Deployment error with recovery suggestions
 */
export class DeploymentError extends Error {
  readonly code: string;
  readonly provider?: string;
  readonly suggestions: string[];
  readonly statusCode?: number;
  readonly originalError?: unknown;

  constructor(
    message: string,
    code: string,
    provider?: string,
    suggestions: string[] = [],
    statusCode?: number,
    originalError?: unknown
  ) {
    super(message);
    this.name = "DeploymentError";
    this.code = code;
    this.provider = provider;
    this.suggestions = suggestions;
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}
