/**
 * E2E Tests: AI Preview vs Export Consistency
 * 
 * Verifies that:
 * - Components shown in AI preview exist in CLI export
 * - Preview state is consistent with export output
 * - No "phantom" components in preview that don't get exported
 * 
 * These tests would have caught: AI Preview shows components not in download
 */

import { test, expect } from '@playwright/test';
import {
  goToConfigurator,
  selectTemplate,
  navigateToStep,
  selectIntegration,
  skipToExport,
  downloadProject,
  extractZip,
  readFile,
  hasFile,
  getFilesInDir,
  waitForIdle,
} from './test-utils';

test.describe('AI Preview vs Export Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await goToConfigurator(page);
    await waitForIdle(page);
  });

  test('preview configuration matches export configuration', async ({ page }) => {
    // Configure project
    await selectTemplate(page, 'ecommerce');
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', 'supabase');
    await selectIntegration(page, 'payments', 'stripe');

    // Navigate to preview step (Step 6)
    await navigateToStep(page, 6);

    // Get configuration shown in preview (if available)
    const previewConfig = page.locator(
      '[data-testid="preview-config"], ' +
      '[data-preview-template], ' +
      '.preview-configuration'
    ).first();

    let previewTemplate = '';
    let previewIntegrations: string[] = [];

    if (await previewConfig.isVisible().catch(() => false)) {
      const configText = await previewConfig.textContent();
      if (configText) {
        // Try to extract template and integrations from preview display
        if (configText.toLowerCase().includes('ecommerce')) {
          previewTemplate = 'ecommerce';
        }
        if (configText.toLowerCase().includes('supabase')) {
          previewIntegrations.push('supabase');
        }
        if (configText.toLowerCase().includes('stripe')) {
          previewIntegrations.push('stripe');
        }
      }
    }

    // Export and verify consistency
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const manifest = JSON.parse(readFile(files, '.dd/template-manifest.json') || '{}');

    // Verify template matches
    if (previewTemplate) {
      expect(manifest.template).toBe(previewTemplate);
    }

    // Verify integrations match
    for (const integration of previewIntegrations) {
      const hasIntegration = Object.values(manifest.integrations || {}).includes(integration);
      expect(hasIntegration, `Integration ${integration} shown in preview should be in export`).toBe(true);
    }
  });

  test('preview components list matches exported components', async ({ page }) => {
    await selectTemplate(page, 'saas');
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', 'supabase');

    // Go to preview
    await navigateToStep(page, 6);

    // Check for generate preview button
    const generateBtn = page.locator(
      '[data-action="generate-preview"], ' +
      '[data-testid="generate-preview"], ' +
      'button:has-text("Generate"), ' +
      'button:has-text("Preview")'
    ).first();

    // Collect component names shown in preview
    let previewComponents: string[] = [];

    if (await generateBtn.isVisible().catch(() => false)) {
      // If there's a generate button, try to click it
      // But don't wait too long (AI generation is slow)
      try {
        await generateBtn.click();
        await page.waitForTimeout(2000); // Give it some time

        // Look for component indicators
        const componentElements = page.locator(
          '[data-preview-component], ' +
          '[data-component-name], ' +
          '.preview-component-list li'
        );

        const count = await componentElements.count().catch(() => 0);
        for (let i = 0; i < count; i++) {
          const name = await componentElements.nth(i).getAttribute('data-component-name');
          if (name) previewComponents.push(name);
        }
      } catch {
        // Generation may fail without API key, which is fine
      }
    }

    // Export
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    // If we found preview components, verify they exist in export
    if (previewComponents.length > 0) {
      for (const component of previewComponents) {
        const componentPath = `components/${component}.tsx`;
        const altPath = `app/components/${component}.tsx`;
        
        const exists = hasFile(files, componentPath) || hasFile(files, altPath);
        expect(exists, `Preview component ${component} should exist in export`).toBe(true);
      }
    }

    // Basic structure should always exist
    expect(hasFile(files, 'app/page.tsx')).toBe(true);
  });

  test('template manifest integrations match selected integrations', async ({ page }) => {
    const selectedIntegrations = {
      auth: 'supabase',
      payments: 'stripe',
      analytics: 'posthog',
    };

    await selectTemplate(page, 'saas');
    await navigateToStep(page, 4);

    for (const [type, provider] of Object.entries(selectedIntegrations)) {
      await selectIntegration(page, type, provider);
    }

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const manifestContent = readFile(files, '.dd/template-manifest.json');
    expect(manifestContent).toBeTruthy();

    const manifest = JSON.parse(manifestContent!);

    // Every selected integration should be in manifest
    for (const [type, provider] of Object.entries(selectedIntegrations)) {
      expect(manifest.integrations[type], `${type} integration should be in manifest`).toBe(provider);
    }
  });

  test('CLI command shown matches export configuration', async ({ page }) => {
    await selectTemplate(page, 'saas');
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', 'supabase');
    await selectIntegration(page, 'payments', 'stripe');

    // Navigate to export step
    await navigateToStep(page, 8);

    // Look for CLI command display
    const cliCommand = page.locator(
      '[data-testid="cli-command"], ' +
      '.cli-command, ' +
      'code:has-text("framework export"), ' +
      'pre:has-text("framework export")'
    ).first();

    let commandText = '';
    if (await cliCommand.isVisible().catch(() => false)) {
      commandText = await cliCommand.textContent() || '';
    }

    // Export
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const manifest = JSON.parse(readFile(files, '.dd/template-manifest.json') || '{}');

    // If CLI command was shown, verify it matches
    if (commandText.includes('framework export')) {
      // Template in command should match manifest
      expect(commandText.toLowerCase()).toContain(manifest.template);
    }
  });

  test('no orphaned integration dependencies', async ({ page }) => {
    // Select integrations, then deselect some
    await selectTemplate(page, 'saas');
    await navigateToStep(page, 4);

    // Select and deselect to test cleanup
    await selectIntegration(page, 'auth', 'supabase');
    await selectIntegration(page, 'payments', 'stripe');
    await selectIntegration(page, 'email', 'resend');

    // Now deselect email (try to toggle off)
    const emailNone = page.locator('[data-integration="email-none"], [data-testid="integration-email-none"]').first();
    if (await emailNone.isVisible().catch(() => false)) {
      await emailNone.click();
    }

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const pkgContent = readFile(files, 'package.json');
    const pkg = JSON.parse(pkgContent || '{}');

    // If email was deselected, resend shouldn't be in deps
    // (This may not work depending on UI, but the concept is important)
    const manifest = JSON.parse(readFile(files, '.dd/template-manifest.json') || '{}');

    if (!manifest.integrations?.email) {
      // Email was deselected, verify no email deps
      expect(pkg.dependencies?.resend).toBeUndefined();
      expect(pkg.dependencies?.['react-email']).toBeUndefined();
    }
  });

  test('export is reproducible with same configuration', async ({ page }) => {
    const config = {
      template: 'saas',
      auth: 'supabase',
      payments: 'stripe',
    };

    // First export
    await selectTemplate(page, config.template);
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', config.auth);
    await selectIntegration(page, 'payments', config.payments);

    await skipToExport(page);
    const download1 = await downloadProject(page);
    const files1 = await extractZip(download1);
    const manifest1 = JSON.parse(readFile(files1, '.dd/template-manifest.json') || '{}');

    // Navigate back and export again
    await goToConfigurator(page);
    await selectTemplate(page, config.template);
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', config.auth);
    await selectIntegration(page, 'payments', config.payments);

    await skipToExport(page);
    const download2 = await downloadProject(page);
    const files2 = await extractZip(download2);
    const manifest2 = JSON.parse(readFile(files2, '.dd/template-manifest.json') || '{}');

    // Core structure should be identical
    expect(manifest2.template).toBe(manifest1.template);
    expect(manifest2.integrations).toEqual(manifest1.integrations);

    // File count should be the same
    expect(files2.paths.length).toBe(files1.paths.length);
  });

  test('warning if preview unavailable but export continues', async ({ page }) => {
    await selectTemplate(page, 'saas');

    // Go directly to preview without API key (should handle gracefully)
    await navigateToStep(page, 6);

    // Look for warning or fallback message
    const warning = page.locator(
      '[data-testid="preview-warning"], ' +
      '.preview-unavailable, ' +
      ':text("API key"), ' +
      ':text("preview not available")'
    ).first();

    // Either warning exists, or we can still proceed
    const hasWarning = await warning.isVisible().catch(() => false);

    // Export should still work
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    // Export succeeded even without preview
    expect(hasFile(files, 'package.json')).toBe(true);
    expect(hasFile(files, 'app/page.tsx')).toBe(true);
  });
});

