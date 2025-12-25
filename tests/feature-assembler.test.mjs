import test from "node:test"
import assert from "node:assert/strict"
import path from "node:path"
import fs from "fs-extra"
import { fileURLToPath } from "url"
import {
  loadFeatureMapping,
  resolveFeatureDependencies,
  getTemplateFiles,
  getRequiredPackages,
  getRequiredEnvVars,
  validateFeatureSelection,
  getFeatureSummary,
} from "../src/dd/feature-assembler.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Test: loadFeatureMapping
test("feature-assembler: loadFeatureMapping returns valid mapping", async () => {
  const mapping = await loadFeatureMapping()
  
  assert.ok(mapping, "Mapping should be loaded")
  assert.ok(mapping.version, "Mapping should have version")
  assert.ok(mapping.categories, "Mapping should have categories")
  assert.ok(mapping.features, "Mapping should have features")
})

test("feature-assembler: mapping has required categories", async () => {
  const mapping = await loadFeatureMapping()
  
  const expectedCategories = ["user-management", "product-database", "search-filter", "ecommerce", "analytics"]
  for (const category of expectedCategories) {
    assert.ok(mapping.categories[category], `Should have category: ${category}`)
  }
})

// Test: resolveFeatureDependencies
test("feature-assembler: resolveFeatureDependencies includes dependencies", async () => {
  const mapping = await loadFeatureMapping()
  
  // admin-dashboard depends on email-registration
  const resolved = resolveFeatureDependencies(["admin-dashboard"], mapping)
  
  assert.ok(resolved.includes("admin-dashboard"), "Should include requested feature")
  assert.ok(resolved.includes("email-registration"), "Should include dependency")
})

test("feature-assembler: resolveFeatureDependencies handles no dependencies", async () => {
  const mapping = await loadFeatureMapping()
  
  // social-login has no dependencies
  const resolved = resolveFeatureDependencies(["social-login"], mapping)
  
  assert.equal(resolved.length, 1, "Should only have one feature")
  assert.ok(resolved.includes("social-login"), "Should include requested feature")
})

test("feature-assembler: resolveFeatureDependencies handles chain dependencies", async () => {
  const mapping = await loadFeatureMapping()
  
  // checkout-flow depends on shopping-cart and email-registration
  const resolved = resolveFeatureDependencies(["checkout-flow"], mapping)
  
  assert.ok(resolved.includes("checkout-flow"), "Should include requested feature")
  assert.ok(resolved.includes("shopping-cart"), "Should include shopping-cart dependency")
  assert.ok(resolved.includes("email-registration"), "Should include email-registration dependency")
})

// Test: getTemplateFiles
test("feature-assembler: getTemplateFiles returns template paths", async () => {
  const mapping = await loadFeatureMapping()
  
  const files = getTemplateFiles(["email-registration"], mapping)
  
  assert.ok(files.length > 0, "Should return template files")
  assert.ok(files[0].templatePath, "Files should have templatePath")
  assert.ok(files[0].outputPath, "Files should have outputPath")
  assert.ok(files[0].featureId, "Files should have featureId")
})

// Test: getRequiredPackages
test("feature-assembler: getRequiredPackages returns packages", async () => {
  const mapping = await loadFeatureMapping()
  
  // shopping-cart requires zustand
  const packages = getRequiredPackages(["shopping-cart"], mapping)
  
  assert.ok(packages.includes("zustand"), "Should include zustand for shopping-cart")
})

test("feature-assembler: getRequiredPackages returns empty for no packages", async () => {
  const mapping = await loadFeatureMapping()
  
  // email-registration has no package requirements
  const packages = getRequiredPackages(["email-registration"], mapping)
  
  assert.equal(packages.length, 0, "Should return empty array")
})

// Test: getRequiredEnvVars
test("feature-assembler: getRequiredEnvVars returns env vars", async () => {
  const mapping = await loadFeatureMapping()
  
  // social-login requires OAuth env vars
  const envVars = getRequiredEnvVars(["social-login"], mapping)
  
  assert.ok(envVars.includes("GOOGLE_CLIENT_ID"), "Should include Google OAuth var")
  assert.ok(envVars.includes("GITHUB_CLIENT_ID"), "Should include GitHub OAuth var")
})

// Test: validateFeatureSelection
test("feature-assembler: validateFeatureSelection accepts valid features", async () => {
  const result = await validateFeatureSelection(["email-registration", "social-login"])
  
  assert.ok(result.valid, "Should be valid")
  assert.equal(result.errors.length, 0, "Should have no errors")
})

test("feature-assembler: validateFeatureSelection warns about missing dependencies", async () => {
  // admin-dashboard requires email-registration
  const result = await validateFeatureSelection(["admin-dashboard"])
  
  assert.ok(result.valid, "Should still be valid (dependencies auto-added)")
  assert.ok(result.warnings.length > 0, "Should have warnings about missing dependencies")
})

test("feature-assembler: validateFeatureSelection errors on unknown features", async () => {
  const result = await validateFeatureSelection(["unknown-feature"])
  
  assert.ok(!result.valid, "Should not be valid")
  assert.ok(result.errors.length > 0, "Should have errors")
})

// Test: getFeatureSummary
test("feature-assembler: getFeatureSummary returns complexity info", async () => {
  const summary = await getFeatureSummary(["email-registration", "admin-dashboard"])
  
  assert.ok(summary.totalFeatures > 0, "Should count features")
  assert.ok(summary.byComplexity, "Should have complexity breakdown")
  assert.ok(summary.complexityScore >= 0, "Should have complexity score")
  assert.ok(summary.estimatedHours >= 0, "Should have estimated hours")
  assert.ok(["low", "medium", "high"].includes(summary.level), "Should have level")
})

test("feature-assembler: getFeatureSummary includes packages and envVars", async () => {
  const summary = await getFeatureSummary(["shopping-cart", "social-login"])
  
  assert.ok(Array.isArray(summary.packages), "Should have packages array")
  assert.ok(Array.isArray(summary.envVars), "Should have envVars array")
  assert.ok(summary.packages.includes("zustand"), "Should include zustand from shopping-cart")
  assert.ok(summary.envVars.includes("GOOGLE_CLIENT_ID"), "Should include env vars from social-login")
})

