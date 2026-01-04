/**
 * Project Generator Orchestrator
 * 
 * Combines templates, features, and integrations into a complete project.
 */

import { ProjectConfig, GeneratedProject, GeneratedFile, IntegrationCategory } from "./types";
import { getIntegrationFiles, checkIntegrationDependencies } from "./integration-loader";
import { getFeatureFiles, validateFeatureSelection, resolveFeatureDependencies } from "./feature-loader";
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

  // 2. Validate feature selection
  if (config.features && config.features.length > 0) {
    const featureValidation = validateFeatureSelection(config.features);
    warnings.push(...featureValidation.warnings);
    if (!featureValidation.valid) {
      warnings.push(...featureValidation.errors);
    }
  }

  // 3. Get base template files
  const baseFiles = await getTemplateBase(config.template, config);

  // 4. Get integration files
  const integrationResult = await getIntegrationFiles(
    config.integrations as Partial<Record<IntegrationCategory, string>>,
    { projectName: config.projectName }
  );

  // 5. Get feature files
  const featureResult = config.features && config.features.length > 0
    ? getFeatureFiles(config.features, { projectName: config.projectName })
    : { files: [], packages: {}, devPackages: {}, envVars: [] };

  // 6. Merge all files (base + integrations + features)
  const allFiles = mergeFiles([baseFiles, integrationResult.files, featureResult.files]);

  // 7. Apply branding to files
  const brandedFiles = applyBranding(allFiles, config.branding, config.projectName);

  // 8. Merge all dependencies
  const allDependencies = {
    ...integrationResult.dependencies,
    ...featureResult.packages,
  };
  const allDevDependencies = {
    ...integrationResult.devDependencies,
    ...featureResult.devPackages,
  };

  // 9. Merge all env vars
  const allEnvVars = [...integrationResult.envVars];
  for (const envVar of featureResult.envVars) {
    if (!allEnvVars.some(e => e.name === envVar.name)) {
      allEnvVars.push(envVar);
    }
  }

  // 10. Build package.json
  const packageJson = buildPackageJson(config, allDependencies, allDevDependencies);

  // 11. Build .env.example
  const envTemplate = buildEnvTemplate(allEnvVars);

  // 12. Build README with feature info
  const readme = buildReadme(config, integrationResult.postInstall);

  // 13. Collect setup instructions
  setupInstructions.push(...integrationResult.postInstall);

  // Add feature-specific instructions
  if (config.features && config.features.length > 0) {
    const resolvedFeatures = resolveFeatureDependencies(config.features);
    setupInstructions.push(`\n## Selected Features (${resolvedFeatures.length})\n`);
    for (const featureId of resolvedFeatures) {
      setupInstructions.push(`- ${featureId}`);
    }
  }

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
export { getFeatureFiles, validateFeatureSelection, resolveFeatureDependencies, getFeatureSummary } from "./feature-loader";

