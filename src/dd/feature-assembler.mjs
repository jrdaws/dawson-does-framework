/**
 * Feature Assembler
 * 
 * Assembles project files based on selected features.
 * Maps feature selections to code templates and generates
 * the appropriate project structure.
 */

import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Load feature mapping from JSON
 * @returns {object} Feature mapping configuration
 */
export async function loadFeatureMapping() {
  const mappingPath = path.join(__dirname, '..', '..', 'templates', 'features', 'feature-mapping.json')
  
  if (!fs.existsSync(mappingPath)) {
    throw new Error('Feature mapping not found. Run feature template setup first.')
  }
  
  return fs.readJSON(mappingPath)
}

/**
 * Resolve dependencies for selected features
 * @param {string[]} selectedFeatures - Array of feature IDs
 * @param {object} mapping - Feature mapping configuration
 * @returns {string[]} All features including dependencies
 */
export function resolveFeatureDependencies(selectedFeatures, mapping) {
  const resolved = new Set()
  const queue = [...selectedFeatures]
  
  while (queue.length > 0) {
    const featureId = queue.shift()
    if (resolved.has(featureId)) continue
    
    const feature = mapping.features[featureId]
    if (!feature) {
      console.warn(`Unknown feature: ${featureId}`)
      continue
    }
    
    // Add dependencies to queue first (to process in order)
    for (const dep of feature.dependencies) {
      if (!resolved.has(dep)) {
        queue.unshift(dep) // Add to front of queue
      }
    }
    
    resolved.add(featureId)
  }
  
  return Array.from(resolved)
}

/**
 * Get all template files for selected features
 * @param {string[]} selectedFeatures - Array of feature IDs (with dependencies resolved)
 * @param {object} mapping - Feature mapping configuration
 * @returns {object[]} Array of {templatePath, outputPath} objects
 */
export function getTemplateFiles(selectedFeatures, mapping) {
  const files = []
  
  for (const featureId of selectedFeatures) {
    const feature = mapping.features[featureId]
    if (!feature) continue
    
    for (const templatePath of feature.templates) {
      // Template path is relative to templates/features/
      // Output path removes the category/feature prefix
      const parts = templatePath.split('/')
      // Skip first two parts (category/feature-id/)
      const outputPath = parts.slice(2).join('/')
      
      files.push({
        featureId,
        templatePath: `features/${templatePath}`,
        outputPath,
      })
    }
  }
  
  return files
}

/**
 * Get all required packages for selected features
 * @param {string[]} selectedFeatures - Array of feature IDs
 * @param {object} mapping - Feature mapping configuration
 * @returns {string[]} Array of package names
 */
export function getRequiredPackages(selectedFeatures, mapping) {
  const packages = new Set()
  
  for (const featureId of selectedFeatures) {
    const feature = mapping.features[featureId]
    if (!feature) continue
    
    for (const pkg of feature.packages || []) {
      packages.add(pkg)
    }
  }
  
  return Array.from(packages)
}

/**
 * Get all required environment variables for selected features
 * @param {string[]} selectedFeatures - Array of feature IDs
 * @param {object} mapping - Feature mapping configuration
 * @returns {string[]} Array of env var names
 */
export function getRequiredEnvVars(selectedFeatures, mapping) {
  const envVars = new Set()
  
  for (const featureId of selectedFeatures) {
    const feature = mapping.features[featureId]
    if (!feature) continue
    
    for (const envVar of feature.envVars || []) {
      envVars.add(envVar)
    }
  }
  
  return Array.from(envVars)
}

/**
 * Copy feature templates to project directory
 * @param {string} projectDir - Target project directory
 * @param {string[]} selectedFeatures - Array of feature IDs
 * @param {object} options - Copy options
 * @returns {object} Result with copied files and errors
 */
export async function assembleFeatures(projectDir, selectedFeatures, options = {}) {
  const { dryRun = false, projectName = 'my-project' } = options
  
  const mapping = await loadFeatureMapping()
  const resolvedFeatures = resolveFeatureDependencies(selectedFeatures, mapping)
  const templateFiles = getTemplateFiles(resolvedFeatures, mapping)
  const packages = getRequiredPackages(resolvedFeatures, mapping)
  const envVars = getRequiredEnvVars(resolvedFeatures, mapping)
  
  const templatesBase = path.join(__dirname, '..', '..', 'templates')
  const copiedFiles = []
  const errors = []
  const skipped = []
  
  for (const { featureId, templatePath, outputPath } of templateFiles) {
    const sourcePath = path.join(templatesBase, templatePath)
    const targetPath = path.join(projectDir, outputPath)
    
    if (!fs.existsSync(sourcePath)) {
      skipped.push({ templatePath, reason: 'Template file not found' })
      continue
    }
    
    if (dryRun) {
      copiedFiles.push({ featureId, source: templatePath, target: outputPath })
      continue
    }
    
    try {
      // Ensure target directory exists
      await fs.ensureDir(path.dirname(targetPath))
      
      // Read template and replace placeholders
      let content = await fs.readFile(sourcePath, 'utf8')
      content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName)
      content = content.replace(/\{\{project_name\}\}/g, projectName.toLowerCase().replace(/\s+/g, '-'))
      
      // Write to target
      await fs.writeFile(targetPath, content, 'utf8')
      copiedFiles.push({ featureId, source: templatePath, target: outputPath })
    } catch (error) {
      errors.push({ templatePath, outputPath, error: error.message })
    }
  }
  
  return {
    success: errors.length === 0,
    features: resolvedFeatures,
    copiedFiles,
    skipped,
    errors,
    packages,
    envVars,
  }
}

/**
 * Generate CLAUDE.md with feature context
 * @param {string} projectDir - Target project directory  
 * @param {string[]} selectedFeatures - Array of feature IDs
 * @param {object} projectConfig - Project configuration
 */
export async function generateClaudeMd(projectDir, selectedFeatures, projectConfig = {}) {
  const { projectName = 'My Project', description = '' } = projectConfig
  
  const mapping = await loadFeatureMapping()
  const resolvedFeatures = resolveFeatureDependencies(selectedFeatures, mapping)
  
  // Group features by category
  const featuresByCategory = {}
  for (const featureId of resolvedFeatures) {
    const feature = mapping.features[featureId]
    if (!feature) continue
    
    const category = feature.category
    if (!featuresByCategory[category]) {
      featuresByCategory[category] = []
    }
    featuresByCategory[category].push(featureId)
  }
  
  // Build CLAUDE.md content
  let content = `# ${projectName}

> Auto-generated by Dawson-Does Framework

${description ? `## Project Description\n\n${description}\n\n` : ''}## Selected Features

This project includes the following features:

`
  
  for (const [category, features] of Object.entries(featuresByCategory)) {
    const categoryDef = mapping.categories[category]
    content += `### ${categoryDef?.label || category}\n\n`
    
    for (const featureId of features) {
      const feature = mapping.features[featureId]
      content += `- **${featureId}**: ${feature.complexity} complexity\n`
    }
    content += '\n'
  }
  
  content += `## File Structure

Feature-related files are organized as follows:

\`\`\`
`
  
  const templateFiles = getTemplateFiles(resolvedFeatures, mapping)
  const paths = templateFiles.map(f => f.outputPath).sort()
  for (const p of paths) {
    content += `${p}\n`
  }
  
  content += `\`\`\`

## Development Notes

- Run \`npm install\` to install dependencies
- Copy \`.env.example\` to \`.env.local\` and configure
- Run \`npm run dev\` to start development server

---

*Generated by dawson-does-framework*
`
  
  const claudePath = path.join(projectDir, 'CLAUDE.md')
  await fs.writeFile(claudePath, content, 'utf8')
  
  return claudePath
}

/**
 * Validate feature selection
 * @param {string[]} selectedFeatures - Array of feature IDs
 * @returns {object} Validation result
 */
export async function validateFeatureSelection(selectedFeatures) {
  const mapping = await loadFeatureMapping()
  const errors = []
  const warnings = []
  
  for (const featureId of selectedFeatures) {
    const feature = mapping.features[featureId]
    
    if (!feature) {
      errors.push(`Unknown feature: ${featureId}`)
      continue
    }
    
    // Check dependencies
    for (const dep of feature.dependencies) {
      if (!selectedFeatures.includes(dep)) {
        warnings.push(`Feature "${featureId}" requires "${dep}" which is not selected (will be auto-added)`)
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Get feature summary for CLI display
 * @param {string[]} selectedFeatures - Array of feature IDs
 * @returns {object} Summary object
 */
export async function getFeatureSummary(selectedFeatures) {
  const mapping = await loadFeatureMapping()
  const resolvedFeatures = resolveFeatureDependencies(selectedFeatures, mapping)
  
  let simpleCount = 0
  let mediumCount = 0
  let complexCount = 0
  
  for (const featureId of resolvedFeatures) {
    const feature = mapping.features[featureId]
    if (!feature) continue
    
    switch (feature.complexity) {
      case 'simple': simpleCount++; break
      case 'medium': mediumCount++; break
      case 'complex': complexCount++; break
    }
  }
  
  const complexityScore = simpleCount + (mediumCount * 2) + (complexCount * 4)
  const estimatedHours = complexityScore * 2
  
  return {
    totalFeatures: resolvedFeatures.length,
    byComplexity: { simple: simpleCount, medium: mediumCount, complex: complexCount },
    complexityScore,
    estimatedHours,
    level: complexityScore <= 5 ? 'low' : complexityScore <= 12 ? 'medium' : 'high',
    packages: getRequiredPackages(resolvedFeatures, mapping),
    envVars: getRequiredEnvVars(resolvedFeatures, mapping),
  }
}

