/**
 * E2E Tests: Integration Dependencies in package.json
 * 
 * Verifies that:
 * - Selected integrations add correct dependencies to package.json
 * - All required packages for each integration are included
 * 
 * These tests would have caught: R2 storage dependency missing
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
  readPackageJson,
  verifyDependencies,
  INTEGRATION_DEPENDENCIES,
  waitForIdle,
} from './test-utils';

test.describe('Integration Dependencies Export', () => {
  // Define integration test cases with expected dependencies
  const integrationTestCases = [
    {
      name: 'Supabase Auth',
      type: 'auth',
      provider: 'supabase',
      expectedDeps: ['@supabase/supabase-js', '@supabase/ssr'],
    },
    {
      name: 'Clerk Auth',
      type: 'auth',
      provider: 'clerk',
      expectedDeps: ['@clerk/nextjs'],
    },
    {
      name: 'Stripe Payments',
      type: 'payments',
      provider: 'stripe',
      expectedDeps: ['stripe'],
    },
    {
      name: 'Paddle Payments',
      type: 'payments',
      provider: 'paddle',
      expectedDeps: ['@paddle/paddle-js'],
    },
    {
      name: 'Resend Email',
      type: 'email',
      provider: 'resend',
      expectedDeps: ['resend', 'react-email', '@react-email/components'],
    },
    {
      name: 'SendGrid Email',
      type: 'email',
      provider: 'sendgrid',
      expectedDeps: ['@sendgrid/mail'],
    },
    {
      name: 'PlanetScale DB',
      type: 'db',
      provider: 'planetscale',
      expectedDeps: ['@planetscale/database'],
    },
    {
      name: 'OpenAI',
      type: 'ai',
      provider: 'openai',
      expectedDeps: ['openai', 'ai'],
    },
    {
      name: 'Anthropic AI',
      type: 'ai',
      provider: 'anthropic',
      expectedDeps: ['@anthropic-ai/sdk'],
    },
    {
      name: 'PostHog Analytics',
      type: 'analytics',
      provider: 'posthog',
      expectedDeps: ['posthog-js'],
    },
    {
      name: 'Plausible Analytics',
      type: 'analytics',
      provider: 'plausible',
      expectedDeps: ['next-plausible'],
    },
    // CRITICAL: These tests catch the R2 storage dependency bug
    {
      name: 'Cloudflare R2 Storage',
      type: 'storage',
      provider: 'r2',
      expectedDeps: ['@aws-sdk/client-s3'],
      description: 'R2 uses S3-compatible API, requires @aws-sdk/client-s3',
    },
    {
      name: 'AWS S3 Storage',
      type: 'storage',
      provider: 's3',
      expectedDeps: ['@aws-sdk/client-s3'],
    },
    {
      name: 'Supabase Storage',
      type: 'storage',
      provider: 'supabase',
      expectedDeps: ['@supabase/supabase-js'],
    },
  ];

  test.beforeEach(async ({ page }) => {
    await goToConfigurator(page);
    await waitForIdle(page);
    // Select SaaS template which supports most integrations
    await selectTemplate(page, 'saas');
  });

  for (const testCase of integrationTestCases) {
    test(`${testCase.name} selection adds correct dependencies`, async ({ page }) => {
      // 1. Navigate to integrations step
      await navigateToStep(page, 4); // Step 4 = Integrations

      // 2. Select the integration
      await selectIntegration(page, testCase.type, testCase.provider);

      // 3. Skip to export and download
      await skipToExport(page);
      const download = await downloadProject(page);
      const files = await extractZip(download);

      // 4. Parse package.json
      const packageJson = readPackageJson(files);
      expect(packageJson, 'package.json should be parseable').not.toBeNull();

      // 5. Verify all expected dependencies are present
      const { found, missing } = verifyDependencies(packageJson, testCase.expectedDeps);

      // Report all missing dependencies
      if (missing.length > 0) {
        const message = testCase.description 
          ? `${testCase.name}: Missing dependencies [${missing.join(', ')}]. ${testCase.description}`
          : `${testCase.name}: Missing dependencies [${missing.join(', ')}]`;
        expect(missing, message).toHaveLength(0);
      }

      // Verify found count matches expected
      expect(found).toHaveLength(testCase.expectedDeps.length);
    });
  }

  test('multiple integrations combine dependencies correctly', async ({ page }) => {
    const selectedIntegrations = {
      auth: 'supabase',
      payments: 'stripe',
      email: 'resend',
      analytics: 'posthog',
    };

    const expectedDeps = [
      '@supabase/supabase-js',
      '@supabase/ssr',
      'stripe',
      'resend',
      'react-email',
      '@react-email/components',
      'posthog-js',
    ];

    // Navigate to integrations
    await navigateToStep(page, 4);

    // Select all integrations
    for (const [type, provider] of Object.entries(selectedIntegrations)) {
      await selectIntegration(page, type, provider);
    }

    // Export and verify
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const packageJson = readPackageJson(files);
    expect(packageJson).not.toBeNull();

    const { missing } = verifyDependencies(packageJson, expectedDeps);
    expect(missing, `Missing deps: ${missing.join(', ')}`).toHaveLength(0);
  });

  test('template manifest includes selected integrations', async ({ page }) => {
    await navigateToStep(page, 4);

    await selectIntegration(page, 'auth', 'supabase');
    await selectIntegration(page, 'payments', 'stripe');

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const manifestContent = files.contents.get('.dd/template-manifest.json');
    expect(manifestContent).toBeTruthy();

    const manifest = JSON.parse(manifestContent!);
    expect(manifest.integrations).toBeDefined();
    expect(manifest.integrations.auth).toBe('supabase');
    expect(manifest.integrations.payments).toBe('stripe');
  });

  test('no duplicate dependencies when same provider used for multiple types', async ({ page }) => {
    // Supabase can be used for both auth and db
    await navigateToStep(page, 4);

    await selectIntegration(page, 'auth', 'supabase');
    await selectIntegration(page, 'db', 'supabase');

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const pkgContent = files.contents.get('package.json');
    expect(pkgContent).toBeTruthy();

    // Count occurrences of @supabase/supabase-js
    const matches = pkgContent!.match(/@supabase\/supabase-js/g);
    expect(matches?.length || 0).toBeLessThanOrEqual(1);
  });
});

