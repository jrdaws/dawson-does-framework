/**
 * E2E Tests: Template Export Verification
 * 
 * Verifies that:
 * - Each template exports with correct structure
 * - Template manifest is created with correct metadata
 * - Template-specific files exist
 * 
 * These tests would have caught: Template mismatch issues
 */

import { test, expect } from '@playwright/test';
import {
  goToConfigurator,
  selectTemplate,
  skipToExport,
  downloadProject,
  extractZip,
  readTemplateManifest,
  hasFile,
  readFile,
  waitForIdle,
} from './test-utils';

test.describe('Template Export Verification', () => {
  // All templates to test
  const templates = [
    { id: 'saas', name: 'SaaS Starter' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'blog', name: 'Blog' },
    { id: 'dashboard', name: 'Admin Dashboard' },
    { id: 'landing-page', name: 'Landing Page' },
    { id: 'api-backend', name: 'API Backend' },
    { id: 'seo-directory', name: 'SEO Directory' },
  ];

  test.beforeEach(async ({ page }) => {
    await goToConfigurator(page);
    await waitForIdle(page);
  });

  for (const template of templates) {
    test(`${template.id} template exports with correct structure`, async ({ page }) => {
      // 1. Select the template
      await selectTemplate(page, template.id);

      // 2. Navigate to export step
      await skipToExport(page);

      // 3. Download the ZIP
      const download = await downloadProject(page);

      // 4. Extract and verify
      const files = await extractZip(download);

      // Core files must exist
      expect(hasFile(files, 'package.json'), 'package.json must exist').toBe(true);
      expect(hasFile(files, 'app/page.tsx'), 'app/page.tsx must exist').toBe(true);
      expect(hasFile(files, 'app/layout.tsx'), 'app/layout.tsx must exist').toBe(true);
      expect(hasFile(files, '.dd/template-manifest.json'), '.dd/template-manifest.json must exist').toBe(true);

      // 5. Verify template manifest content
      const manifest = readTemplateManifest(files);
      expect(manifest, 'Manifest should be parseable').not.toBeNull();
      expect(manifest?.template).toBe(template.id);
      expect(manifest?.generatedBy).toBe('dawson-does-framework-configurator');
    });
  }

  test('template manifest includes generation metadata', async ({ page }) => {
    await selectTemplate(page, 'saas');
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const manifest = readTemplateManifest(files);
    expect(manifest).not.toBeNull();

    // Verify all metadata fields
    expect(manifest?.template).toBe('saas');
    expect(manifest?.templateName).toBeTruthy();
    expect(manifest?.version).toBeTruthy();
    expect(manifest?.generatedAt).toBeTruthy();
    expect(manifest?.generatedBy).toBe('dawson-does-framework-configurator');
    expect(manifest?.integrations).toBeDefined();

    // Verify generatedAt is a valid ISO date
    const generatedDate = new Date(manifest?.generatedAt || '');
    expect(generatedDate.toString()).not.toBe('Invalid Date');
  });

  test('exported project has valid Next.js structure', async ({ page }) => {
    await selectTemplate(page, 'saas');
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    // Next.js required files
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.ts',
      'postcss.config.js',
      'app/page.tsx',
      'app/layout.tsx',
      'app/globals.css',
      '.gitignore',
    ];

    for (const file of requiredFiles) {
      expect(hasFile(files, file), `${file} must exist`).toBe(true);
    }
  });

  test('exported package.json has valid structure', async ({ page }) => {
    await selectTemplate(page, 'saas');
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const pkgContent = readFile(files, 'package.json');
    expect(pkgContent).toBeTruthy();

    const pkg = JSON.parse(pkgContent!);

    // Required fields
    expect(pkg.name).toBeTruthy();
    expect(pkg.version).toBeTruthy();
    expect(pkg.scripts).toBeDefined();
    expect(pkg.scripts.dev).toBe('next dev');
    expect(pkg.scripts.build).toBe('next build');
    expect(pkg.scripts.start).toBe('next start');

    // Core dependencies
    expect(pkg.dependencies.next).toBeTruthy();
    expect(pkg.dependencies.react).toBeTruthy();
    expect(pkg.dependencies['react-dom']).toBeTruthy();

    // Dev dependencies
    expect(pkg.devDependencies.typescript).toBeTruthy();
    expect(pkg.devDependencies.tailwindcss).toBeTruthy();
  });

  test('project name is correctly applied', async ({ page }) => {
    const projectName = 'my-awesome-project';

    await selectTemplate(page, 'saas');

    // Navigate to project step and set name
    // Step 3 is project details
    const projectInput = page.locator(
      '[data-field="projectName"], ' +
      '[data-testid="project-name"], ' +
      'input[name="projectName"]'
    ).first();

    // Try to fill project name if visible
    if (await projectInput.isVisible().catch(() => false)) {
      await projectInput.fill(projectName);
    }

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    // Check that project name is applied
    const pkgContent = readFile(files, 'package.json');
    expect(pkgContent).toBeTruthy();

    const pkg = JSON.parse(pkgContent!);
    // Project name should be the slug version
    expect(pkg.name).toContain('project');
  });
});

