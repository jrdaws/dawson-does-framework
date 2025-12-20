/**
 * Integration Schema Definitions
 *
 * This module defines the JSON schemas and TypeScript-like interfaces for
 * the integration system, including integration metadata, template integration
 * support declarations, and validation rules.
 */

import { z } from "zod";

/**
 * Schema for integration.json metadata file
 * Located in templates/{template}/integrations/{type}/{provider}/integration.json
 */
export const integrationMetadataSchema = z.object({
  provider: z.string().min(1),
  type: z.enum(["auth", "payments", "email", "db", "ai", "analytics", "storage"]),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().optional(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  envVars: z.array(z.string()).optional(),
  files: z
    .object({
      lib: z.array(z.string()).optional(),
      app: z.array(z.string()).optional(),
      components: z.array(z.string()).optional(),
      middleware: z.array(z.string()).optional(),
      types: z.array(z.string()).optional(),
      config: z.array(z.string()).optional(),
    })
    .optional(),
  postInstallInstructions: z.string().optional(),
  conflicts: z.array(z.string()).optional(), // List of conflicting providers
  requires: z.array(z.string()).optional(), // List of required integration types
});

/**
 * Schema for template.json integration support declaration
 */
export const templateIntegrationSchema = z.object({
  supportedIntegrations: z
    .record(z.string(), z.array(z.string()))
    .optional(),
  defaultIntegrations: z
    .record(z.string(), z.string())
    .optional(),
  requiredIntegrations: z
    .array(z.string())
    .optional(),
}).passthrough();

/**
 * Schema for integration flags passed via CLI
 */
export const integrationFlagsSchema = z.object({
  auth: z.string().optional(),
  payments: z.string().optional(),
  email: z.string().optional(),
  db: z.string().optional(),
  ai: z.string().optional(),
  analytics: z.string().optional(),
  storage: z.string().optional(),
});

/**
 * Schema for manifest integration tracking
 */
export const manifestIntegrationsSchema = z.object({
  appliedIntegrations: z
    .array(
      z.object({
        type: z.enum(["auth", "payments", "email", "db", "ai", "analytics", "storage"]),
        provider: z.string(),
        version: z.string(),
        appliedAt: z.string(), // ISO date string
      })
    )
    .optional(),
});

/**
 * Type exports for use in other modules
 */
export const IntegrationTypes = {
  AUTH: "auth",
  PAYMENTS: "payments",
  EMAIL: "email",
  DB: "db",
  AI: "ai",
  ANALYTICS: "analytics",
  STORAGE: "storage",
};

/**
 * Known provider names for validation and display
 */
export const KnownProviders = {
  auth: ["supabase", "clerk", "auth0", "nextauth"],
  payments: ["stripe", "paddle", "lemonsqueezy"],
  email: ["resend", "sendgrid", "mailchimp"],
  db: ["supabase", "planetscale", "mongodb", "postgres", "mysql"],
  ai: ["openai", "anthropic", "cohere"],
  analytics: ["posthog", "mixpanel", "plausible", "google-analytics"],
  storage: ["supabase", "s3", "cloudinary", "r2"],
};

/**
 * Validate integration metadata from integration.json
 */
export function validateIntegrationMetadata(data) {
  try {
    const result = integrationMetadataSchema.safeParse(data);
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: JSON.stringify(result.error.errors),
        errors: result.error.errors,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errors: [],
    };
  }
}

/**
 * Validate template integration support from template.json
 */
export function validateTemplateIntegrationSupport(data) {
  try {
    return {
      success: true,
      data: templateIntegrationSchema.parse(data),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errors: error.errors,
    };
  }
}

/**
 * Validate integration flags from CLI
 */
export function validateIntegrationFlags(flags) {
  try {
    return {
      success: true,
      data: integrationFlagsSchema.parse(flags),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errors: error.errors,
    };
  }
}
