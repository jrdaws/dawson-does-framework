/**
 * Project Generator Orchestrator
 * 
 * Combines templates, features, and integrations into a complete project.
 */

import { ProjectConfig, GeneratedProject, GeneratedFile, IntegrationCategory } from "./types";
import { getIntegrationFiles, checkIntegrationDependencies } from "./integration-loader";
import { getTemplateBase } from "./template-base";
import { buildPackageJson } from "./package-builder";
import { buildEnvTemplate } from "./env-builder";
import { buildReadme } from "./readme-builder";

/**
 * Generate a complete project from configuration
 */
export async function generateProject(config: ProjectConfig): Promise<GeneratedProject> {
  const warnings: string[] = [];
  const setupInstructions: string[] = [];

  // 1. Check integration dependencies
  const depCheck = checkIntegrationDependencies(config.integrations);
  if (!depCheck.valid) {
    warnings.push(...depCheck.missing);
  }

  // 2. Get base template files
  const baseFiles = await getTemplateBase(config.template, config);

  // 3. Get integration files
  const integrationResult = await getIntegrationFiles(
    config.integrations as Partial<Record<IntegrationCategory, string>>,
    { projectName: config.projectName }
  );

  // 4. Merge all files
  const allFiles = mergeFiles([baseFiles, integrationResult.files]);

  // 5. Apply branding to files
  const brandedFiles = applyBranding(allFiles, config.branding, config.projectName);

  // 6. Build package.json
  const packageJson = buildPackageJson(config, integrationResult.dependencies, integrationResult.devDependencies);

  // 7. Build .env.example
  const envTemplate = buildEnvTemplate(integrationResult.envVars);

  // 8. Build README
  const readme = buildReadme(config, integrationResult.postInstall);

  // 9. Collect setup instructions
  setupInstructions.push(...integrationResult.postInstall);

  return {
    files: brandedFiles,
    packageJson,
    envTemplate,
    readme,
    setupInstructions,
    warnings,
  };
}

/**
 * Merge multiple file arrays, handling conflicts
 */
function mergeFiles(fileSets: GeneratedFile[][]): GeneratedFile[] {
  const fileMap = new Map<string, GeneratedFile>();

  for (const files of fileSets) {
    for (const file of files) {
      const existing = fileMap.get(file.path);
      if (!existing || file.overwrite) {
        fileMap.set(file.path, file);
      }
    }
  }

  return Array.from(fileMap.values());
}

/**
 * Apply branding colors and project name to files
 */
function applyBranding(
  files: GeneratedFile[],
  branding: ProjectConfig["branding"],
  projectName: string
): GeneratedFile[] {
  return files.map((file) => {
    let content = file.content;

    // Replace mustache-style placeholders
    content = content.replace(/\{\{projectName\}\}/g, projectName);
    content = content.replace(/\{\{primaryColor\}\}/g, branding.primaryColor);
    if (branding.secondaryColor) {
      content = content.replace(/\{\{secondaryColor\}\}/g, branding.secondaryColor);
    }
    if (branding.backgroundColor) {
      content = content.replace(/\{\{backgroundColor\}\}/g, branding.backgroundColor);
    }
    if (branding.textColor) {
      content = content.replace(/\{\{textColor\}\}/g, branding.textColor);
    }
    if (branding.fontFamily) {
      content = content.replace(/\{\{fontFamily\}\}/g, branding.fontFamily);
    }

    return { ...file, content };
  });
}

export * from "./types";
export { getIntegrationManifest, checkIntegrationDependencies } from "./integration-loader";

