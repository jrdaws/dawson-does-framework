/**
 * E2E Test Utilities for Export Flow Testing
 * 
 * Provides helpers for:
 * - ZIP extraction and file reading
 * - Configurator step navigation
 * - Download interception
 */

import { Page, Download, expect } from '@playwright/test';
import JSZip from 'jszip';

// Re-export types for convenience
export interface ExtractedFiles {
  paths: string[];
  contents: Map<string, string>;
}

export interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface TemplateManifest {
  template: string;
  templateName: string;
  version: string;
  generatedAt: string;
  generatedBy: string;
  integrations: Record<string, string>;
}

/**
 * Navigate to the configurator page and wait for it to load
 */
export async function goToConfigurator(page: Page): Promise<void> {
  await page.goto('/configure');
  await page.waitForLoadState('networkidle');
  // Wait for configurator to be interactive
  await page.waitForSelector('[data-testid="configurator-step"], .configurator-step, [data-step]', { 
    timeout: 10000,
    state: 'visible'
  }).catch(() => {
    // Fallback: just wait for page body
  });
}

/**
 * Step navigation helpers
 * Steps: 1=Template, 2=Inspiration, 3=Project, 4=Integrations, 5=Environment, 6=Preview, 7=Context, 8=Export
 */
export async function navigateToStep(page: Page, stepNumber: number): Promise<void> {
  const stepNames = ['template', 'inspiration', 'project', 'integrations', 'environment', 'preview', 'context', 'export'];
  const stepName = stepNames[stepNumber - 1];

  // Try direct navigation by clicking step indicator
  const stepIndicator = page.locator(`[data-step="${stepNumber}"], [data-step-name="${stepName}"]`).first();
  
  if (await stepIndicator.isVisible().catch(() => false)) {
    await stepIndicator.click();
    await page.waitForTimeout(300); // Wait for animation
    return;
  }

  // Fallback: click Next button until we reach the step
  let currentStep = 1;
  while (currentStep < stepNumber) {
    const nextBtn = page.locator('[data-testid="next-button"], button:has-text("Next"), button:has-text("Continue")').first();
    if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(200);
    }
    currentStep++;
  }
}

/**
 * Skip directly to export step by completing minimal requirements
 */
export async function skipToExport(page: Page): Promise<void> {
  await navigateToStep(page, 8);
}

/**
 * Select a template in the configurator
 */
export async function selectTemplate(page: Page, templateId: string): Promise<void> {
  // Try various selectors for template cards
  const templateCard = page.locator(
    `[data-template="${templateId}"], ` +
    `[data-testid="template-${templateId}"], ` +
    `button:has-text("${templateId}"), ` +
    `[data-value="${templateId}"]`
  ).first();

  if (await templateCard.isVisible().catch(() => false)) {
    await templateCard.click();
    await page.waitForTimeout(200);
  }
}

/**
 * Select an integration provider
 */
export async function selectIntegration(page: Page, integrationType: string, provider: string): Promise<void> {
  // Try various selectors
  const integrationSelector = page.locator(
    `[data-integration="${provider}"], ` +
    `[data-integration-type="${integrationType}"][data-provider="${provider}"], ` +
    `[data-testid="integration-${integrationType}-${provider}"]`
  ).first();

  if (await integrationSelector.isVisible().catch(() => false)) {
    await integrationSelector.click();
    await page.waitForTimeout(200);
  }
}

/**
 * Select multiple integrations at once
 */
export async function selectIntegrations(page: Page, integrations: Record<string, string>): Promise<void> {
  for (const [type, provider] of Object.entries(integrations)) {
    await selectIntegration(page, type, provider);
  }
}

/**
 * Fill a form field by various selectors
 */
export async function fillField(page: Page, fieldName: string, value: string): Promise<void> {
  const field = page.locator(
    `[data-field="${fieldName}"], ` +
    `[data-testid="field-${fieldName}"], ` +
    `input[name="${fieldName}"], ` +
    `textarea[name="${fieldName}"], ` +
    `#${fieldName}`
  ).first();

  if (await field.isVisible().catch(() => false)) {
    await field.fill(value);
    await page.waitForTimeout(100);
  }
}

/**
 * Set an environment variable value
 */
export async function setEnvVar(page: Page, envKey: string, value: string): Promise<void> {
  const envField = page.locator(
    `[data-env="${envKey}"], ` +
    `[data-testid="env-${envKey}"], ` +
    `input[name="${envKey}"]`
  ).first();

  if (await envField.isVisible().catch(() => false)) {
    await envField.fill(value);
    await page.waitForTimeout(100);
  }
}

/**
 * Trigger project download and capture the ZIP file
 */
export async function downloadProject(page: Page): Promise<Download> {
  // Start waiting for download before clicking
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

  // Find and click the download button
  const downloadBtn = page.locator(
    '[data-testid="download-button"], ' +
    '[data-action="download"], ' +
    'button:has-text("Download"), ' +
    'button:has-text("Export"), ' +
    'button:has-text("Get Project")'
  ).first();

  await downloadBtn.click();

  return downloadPromise;
}

/**
 * Extract a downloaded ZIP file and return file paths and contents
 */
export async function extractZip(download: Download): Promise<ExtractedFiles> {
  const downloadPath = await download.path();
  if (!downloadPath) {
    throw new Error('Download path is null - download may have failed');
  }

  const fs = await import('fs');
  const zipBuffer = fs.readFileSync(downloadPath);
  const zip = await JSZip.loadAsync(zipBuffer);

  const paths: string[] = [];
  const contents = new Map<string, string>();

  for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
    paths.push(relativePath);
    if (!zipEntry.dir) {
      const content = await zipEntry.async('string');
      contents.set(relativePath, content);
    }
  }

  return { paths, contents };
}

/**
 * Read a specific file from extracted ZIP contents
 */
export function readFile(extracted: ExtractedFiles, filePath: string): string | undefined {
  // Try with and without leading slash
  return extracted.contents.get(filePath) || 
         extracted.contents.get(filePath.replace(/^\//, '')) ||
         extracted.contents.get(`/${filePath}`);
}

/**
 * Parse package.json from extracted files
 */
export function readPackageJson(extracted: ExtractedFiles): PackageJson | null {
  const content = readFile(extracted, 'package.json');
  if (!content) return null;
  try {
    return JSON.parse(content) as PackageJson;
  } catch {
    return null;
  }
}

/**
 * Parse template manifest from extracted files
 */
export function readTemplateManifest(extracted: ExtractedFiles): TemplateManifest | null {
  const content = readFile(extracted, '.dd/template-manifest.json');
  if (!content) return null;
  try {
    return JSON.parse(content) as TemplateManifest;
  } catch {
    return null;
  }
}

/**
 * Parse .env.local.example from extracted files
 */
export function readEnvExample(extracted: ExtractedFiles): Record<string, string> {
  const content = readFile(extracted, '.env.local.example');
  if (!content) return {};
  
  const result: Record<string, string> = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;
    const [key, ...valueParts] = line.split('=');
    if (key) {
      result[key.trim()] = valueParts.join('=').trim();
    }
  }
  
  return result;
}

/**
 * Check if a file path exists in the extracted ZIP
 */
export function hasFile(extracted: ExtractedFiles, filePath: string): boolean {
  return extracted.paths.some(p => 
    p === filePath || 
    p === filePath.replace(/^\//, '') ||
    p === `/${filePath}` ||
    p.endsWith(filePath)
  );
}

/**
 * Get all files in a directory from extracted ZIP
 */
export function getFilesInDir(extracted: ExtractedFiles, dirPath: string): string[] {
  const normalizedDir = dirPath.endsWith('/') ? dirPath : `${dirPath}/`;
  return extracted.paths.filter(p => 
    p.startsWith(normalizedDir) || 
    p.startsWith(normalizedDir.replace(/^\//, ''))
  );
}

/**
 * Verify that expected dependencies are in package.json
 */
export function verifyDependencies(
  packageJson: PackageJson | null,
  expectedDeps: string[]
): { found: string[]; missing: string[] } {
  const found: string[] = [];
  const missing: string[] = [];

  if (!packageJson) {
    return { found: [], missing: expectedDeps };
  }

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  for (const dep of expectedDeps) {
    if (allDeps[dep]) {
      found.push(dep);
    } else {
      missing.push(dep);
    }
  }

  return { found, missing };
}

/**
 * Wait for any loading/generating states to complete
 */
export async function waitForIdle(page: Page, timeout = 10000): Promise<void> {
  // Wait for any spinners or loading states to disappear
  await page.waitForSelector('[data-loading="true"], .loading, .spinner', { 
    state: 'hidden',
    timeout 
  }).catch(() => {
    // No loading indicator found, proceed
  });
  
  await page.waitForLoadState('networkidle').catch(() => {});
}

/**
 * Integration dependency mappings (must match zip-generator.ts)
 */
export const INTEGRATION_DEPENDENCIES: Record<string, string[]> = {
  'auth:supabase': ['@supabase/supabase-js', '@supabase/ssr'],
  'auth:clerk': ['@clerk/nextjs'],
  'db:supabase': ['@supabase/supabase-js', '@supabase/ssr'],
  'db:planetscale': ['@planetscale/database'],
  'payments:stripe': ['stripe'],
  'payments:paddle': ['@paddle/paddle-js'],
  'email:resend': ['resend', 'react-email', '@react-email/components'],
  'email:sendgrid': ['@sendgrid/mail'],
  'ai:openai': ['openai', 'ai'],
  'ai:anthropic': ['@anthropic-ai/sdk'],
  'analytics:posthog': ['posthog-js'],
  'analytics:plausible': ['next-plausible'],
  'storage:r2': ['@aws-sdk/client-s3'],
  'storage:s3': ['@aws-sdk/client-s3'],
  'storage:supabase': ['@supabase/supabase-js'],
};

/**
 * Get expected dependencies for a set of integrations
 */
export function getExpectedDependencies(integrations: Record<string, string>): string[] {
  const deps = new Set<string>();

  for (const [type, provider] of Object.entries(integrations)) {
    if (!provider) continue;
    const key = `${type}:${provider}`;
    const depsForIntegration = INTEGRATION_DEPENDENCIES[key];
    if (depsForIntegration) {
      depsForIntegration.forEach(d => deps.add(d));
    }
  }

  return Array.from(deps);
}

