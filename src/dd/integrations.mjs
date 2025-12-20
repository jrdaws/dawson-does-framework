/**
 * Integration Management System
 *
 * This module handles validation, application, and management of integrations
 * for @jrdaws/framework templates. Integrations allow templates to include
 * optional functionality like authentication, payments, email, etc.
 */

import fs from "fs-extra";
import path from "path";
import {
  validateIntegrationMetadata,
  validateTemplateIntegrationSupport,
  IntegrationTypes,
} from "./integration-schema.mjs";

/**
 * Validate requested integrations against template capabilities
 *
 * @param {string} templatePath - Path to the template directory
 * @param {Object} requestedIntegrations - Integration flags from CLI
 * @returns {Object} Validation result with errors and warnings
 */
export async function validateIntegrations(templatePath, requestedIntegrations) {
  const errors = [];
  const warnings = [];

  // Read template.json
  const templateJsonPath = path.join(templatePath, "template.json");

  if (!fs.existsSync(templateJsonPath)) {
    errors.push("Template does not have a template.json file");
    return { valid: false, errors, warnings };
  }

  const templateData = await fs.readJSON(templateJsonPath);
  const validationResult = validateTemplateIntegrationSupport(templateData);

  if (!validationResult.success) {
    errors.push(
      `Invalid template integration configuration: ${validationResult.error}`
    );
    return { valid: false, errors, warnings };
  }

  const {
    supportedIntegrations = {},
    requiredIntegrations = [],
  } = templateData;

  // Check if template supports any integrations
  if (Object.keys(supportedIntegrations).length === 0) {
    const hasAnyIntegration = Object.values(requestedIntegrations).some(
      (v) => v
    );
    if (hasAnyIntegration) {
      errors.push("This template does not support any integrations");
      return { valid: false, errors, warnings };
    }
    // No integrations requested or supported, this is fine
    return { valid: true, errors, warnings };
  }

  // Validate each requested integration
  for (const [type, provider] of Object.entries(requestedIntegrations)) {
    if (!provider) continue;

    // Check if template supports this integration type
    if (!supportedIntegrations[type]) {
      errors.push(
        `Template does not support ${type} integrations. Supported types: ${Object.keys(
          supportedIntegrations
        ).join(", ")}`
      );
      continue;
    }

    // Check if template supports this specific provider
    if (!supportedIntegrations[type].includes(provider)) {
      errors.push(
        `Template does not support ${provider} for ${type}. Supported providers: ${supportedIntegrations[
          type
        ].join(", ")}`
      );
      continue;
    }

    // Check if integration files exist
    const integrationPath = path.join(
      templatePath,
      "integrations",
      type,
      provider
    );
    if (!fs.existsSync(integrationPath)) {
      errors.push(
        `Integration files not found for ${type}/${provider} at ${integrationPath}`
      );
      continue;
    }

    // Validate integration.json
    const integrationJsonPath = path.join(integrationPath, "integration.json");
    if (!fs.existsSync(integrationJsonPath)) {
      errors.push(
        `Missing integration.json for ${type}/${provider}`
      );
      continue;
    }

    let integrationData;
    try {
      integrationData = await fs.readJSON(integrationJsonPath);

      // Basic validation - check required fields
      if (!integrationData.provider || !integrationData.type || !integrationData.version) {
        errors.push(
          `Invalid integration.json for ${type}/${provider}: missing required fields (provider, type, version)`
        );
        continue;
      }
    } catch (error) {
      errors.push(
        `Invalid integration.json for ${type}/${provider}: ${error.message}`
      );
      continue;
    }

    // Check for conflicts
    if (integrationData.conflicts) {
      for (const conflictProvider of integrationData.conflicts) {
        if (requestedIntegrations[type] === conflictProvider) {
          errors.push(
            `Integration conflict: ${provider} conflicts with ${conflictProvider} for ${type}`
          );
        }
      }
    }

    // Check for required dependencies
    if (integrationData.requires) {
      for (const requiredType of integrationData.requires) {
        if (!requestedIntegrations[requiredType]) {
          warnings.push(
            `${type}/${provider} recommends also adding a ${requiredType} integration`
          );
        }
      }
    }
  }

  // Check required integrations
  for (const requiredType of requiredIntegrations) {
    if (!requestedIntegrations[requiredType]) {
      errors.push(
        `Template requires a ${requiredType} integration. Supported providers: ${
          supportedIntegrations[requiredType]?.join(", ") || "none"
        }`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Apply integrations to an exported project
 *
 * @param {string} projectDir - Path to the exported project
 * @param {string} templatePath - Path to the source template
 * @param {Object} integrations - Integration flags from CLI
 * @returns {Object} Application result with applied integrations
 */
export async function applyIntegrations(
  projectDir,
  templatePath,
  integrations
) {
  const applied = [];
  const errors = [];

  for (const [type, provider] of Object.entries(integrations)) {
    if (!provider) continue;

    try {
      const integrationPath = path.join(
        templatePath,
        "integrations",
        type,
        provider
      );

      // Read integration metadata
      const integrationJsonPath = path.join(
        integrationPath,
        "integration.json"
      );
      const integrationData = await fs.readJSON(integrationJsonPath);

      // Copy integration files
      await copyIntegrationFiles(projectDir, integrationPath, integrationData);

      // Merge package.json dependencies
      await mergeDependencies(projectDir, integrationData);

      // Merge .env.example
      await mergeEnvExample(projectDir, integrationData);

      applied.push({
        type,
        provider,
        version: integrationData.version,
        postInstallInstructions: integrationData.postInstallInstructions,
      });
    } catch (error) {
      errors.push(`Failed to apply ${type}/${provider}: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0,
    applied,
    errors,
  };
}

/**
 * Copy integration files to project
 */
async function copyIntegrationFiles(projectDir, integrationPath, metadata) {
  if (!metadata.files) return;

  for (const [category, filePatterns] of Object.entries(metadata.files)) {
    if (!filePatterns) continue;

    for (const pattern of filePatterns) {
      const sourcePath = path.join(integrationPath, pattern);

      // Handle glob patterns (basic support for **)
      if (pattern.includes("**")) {
        // Copy entire directory
        const baseDir = pattern.split("/**")[0];
        const sourceDir = path.join(integrationPath, baseDir);
        const targetDir = path.join(projectDir, baseDir);

        if (fs.existsSync(sourceDir)) {
          await fs.copy(sourceDir, targetDir, {
            overwrite: false,
            errorOnExist: false,
          });
        }
      } else {
        // Copy specific file
        const targetPath = path.join(projectDir, pattern);

        if (fs.existsSync(sourcePath)) {
          await fs.ensureDir(path.dirname(targetPath));
          await fs.copy(sourcePath, targetPath, {
            overwrite: false,
            errorOnExist: false,
          });
        }
      }
    }
  }
}

/**
 * Merge dependencies into project's package.json
 */
async function mergeDependencies(projectDir, integrationData) {
  const packageJsonPath = path.join(projectDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    // Create a basic package.json if it doesn't exist
    await fs.writeJSON(
      packageJsonPath,
      {
        name: path.basename(projectDir),
        version: "0.1.0",
        private: true,
        dependencies: {},
        devDependencies: {},
      },
      { spaces: 2 }
    );
  }

  const packageJson = await fs.readJSON(packageJsonPath);

  // Merge dependencies
  if (integrationData.dependencies) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...integrationData.dependencies,
    };
  }

  // Merge devDependencies
  if (integrationData.devDependencies) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...integrationData.devDependencies,
    };
  }

  await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
}

/**
 * Merge environment variables into .env.example
 */
async function mergeEnvExample(projectDir, integrationData) {
  if (!integrationData.envVars || integrationData.envVars.length === 0) {
    return;
  }

  const envExamplePath = path.join(projectDir, ".env.example");
  let envContent = "";

  // Read existing .env.example if it exists
  if (fs.existsSync(envExamplePath)) {
    envContent = await fs.readFile(envExamplePath, "utf-8");
  }

  // Add integration env vars with a comment header
  const integrationEnvSection = `\n# ${integrationData.provider} (${integrationData.type})\n${integrationData.envVars
    .map((varName) => `${varName}=`)
    .join("\n")}\n`;

  // Append to env content
  envContent += integrationEnvSection;

  await fs.writeFile(envExamplePath, envContent);
}

/**
 * Get integration conflicts
 *
 * @param {Object} integrations - Integration flags
 * @returns {Array} List of conflicts
 */
export function getIntegrationConflicts(integrations) {
  const conflicts = [];

  // Check for multiple providers of the same type
  const providerCounts = {};

  for (const [type, provider] of Object.entries(integrations)) {
    if (!provider) continue;

    if (!providerCounts[type]) {
      providerCounts[type] = [];
    }
    providerCounts[type].push(provider);
  }

  for (const [type, providers] of Object.entries(providerCounts)) {
    if (providers.length > 1) {
      conflicts.push(
        `Multiple ${type} providers selected: ${providers.join(
          ", "
        )}. Only one is allowed.`
      );
    }
  }

  return conflicts;
}

/**
 * Get list of available integrations for a template
 *
 * @param {string} templatePath - Path to the template
 * @returns {Object} Available integrations by type
 */
export async function getAvailableIntegrations(templatePath) {
  const integrationsPath = path.join(templatePath, "integrations");

  if (!fs.existsSync(integrationsPath)) {
    return {};
  }

  const available = {};

  const types = await fs.readdir(integrationsPath);

  for (const type of types) {
    const typePath = path.join(integrationsPath, type);
    const stat = await fs.stat(typePath);

    if (!stat.isDirectory()) continue;

    const providers = await fs.readdir(typePath);
    available[type] = [];

    for (const provider of providers) {
      const providerPath = path.join(typePath, provider);
      const providerStat = await fs.stat(providerPath);

      if (!providerStat.isDirectory()) continue;

      const integrationJsonPath = path.join(providerPath, "integration.json");

      if (fs.existsSync(integrationJsonPath)) {
        available[type].push(provider);
      }
    }
  }

  return available;
}
