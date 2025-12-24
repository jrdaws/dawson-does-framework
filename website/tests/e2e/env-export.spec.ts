/**
 * E2E Tests: Environment Variables Transfer
 * 
 * Verifies that:
 * - Selected integrations generate correct .env.local.example
 * - User-entered env values are transferred to export
 * - All required env vars for integrations are listed
 * 
 * These tests would have caught: Environment variables not transferred
 */

import { test, expect } from '@playwright/test';
import {
  goToConfigurator,
  selectTemplate,
  navigateToStep,
  selectIntegration,
  setEnvVar,
  skipToExport,
  downloadProject,
  extractZip,
  hasFile,
  readEnvExample,
  readFile,
  waitForIdle,
} from './test-utils';

test.describe('Environment Variables Export', () => {
  // Expected env vars for each integration
  const integrationEnvVars: Record<string, string[]> = {
    'auth:supabase': [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ],
    'auth:clerk': [
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'CLERK_SECRET_KEY',
    ],
    'payments:stripe': [
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    ],
    'payments:paddle': [
      'PADDLE_API_KEY',
    ],
    'email:resend': [
      'RESEND_API_KEY',
    ],
    'email:sendgrid': [
      'SENDGRID_API_KEY',
    ],
    'ai:openai': [
      'OPENAI_API_KEY',
    ],
    'ai:anthropic': [
      'ANTHROPIC_API_KEY',
    ],
    'analytics:posthog': [
      'NEXT_PUBLIC_POSTHOG_KEY',
    ],
    'storage:r2': [
      'R2_ACCESS_KEY_ID',
      'R2_SECRET_ACCESS_KEY',
      'R2_ENDPOINT',
    ],
  };

  test.beforeEach(async ({ page }) => {
    await goToConfigurator(page);
    await waitForIdle(page);
    await selectTemplate(page, 'saas');
  });

  test('creates .env.local.example with correct structure', async ({ page }) => {
    await navigateToStep(page, 4); // Integrations
    await selectIntegration(page, 'auth', 'supabase');

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    expect(hasFile(files, '.env.local.example'), '.env.local.example must exist').toBe(true);

    const envContent = readFile(files, '.env.local.example');
    expect(envContent).toBeTruthy();

    // Should have header comments
    expect(envContent).toContain('# Environment Variables');
    expect(envContent).toContain('.env.local');
  });

  test('transfers entered env values to .env.local.example', async ({ page }) => {
    const testValues = {
      'NEXT_PUBLIC_SUPABASE_URL': 'https://myproject.supabase.co',
      'STRIPE_SECRET_KEY': 'sk_test_123abc',
    };

    // Select integrations
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', 'supabase');
    await selectIntegration(page, 'payments', 'stripe');

    // Navigate to environment step (Step 5)
    await navigateToStep(page, 5);

    // Enter values
    for (const [key, value] of Object.entries(testValues)) {
      await setEnvVar(page, key, value);
    }

    // Export
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const envVars = readEnvExample(files);

    // Verify values were transferred
    for (const [key, value] of Object.entries(testValues)) {
      expect(envVars[key], `${key} should be in .env.local.example`).toBeDefined();
      expect(envVars[key]).toBe(value);
    }
  });

  test('Supabase auth requires correct env vars', async ({ page }) => {
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', 'supabase');

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const envContent = readFile(files, '.env.local.example');
    expect(envContent).toBeTruthy();

    // Check for Supabase env vars
    expect(envContent).toContain('NEXT_PUBLIC_SUPABASE_URL');
    expect(envContent).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  });

  test('Stripe payments requires correct env vars', async ({ page }) => {
    await navigateToStep(page, 4);
    await selectIntegration(page, 'payments', 'stripe');

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const envContent = readFile(files, '.env.local.example');
    expect(envContent).toBeTruthy();

    expect(envContent).toContain('STRIPE');
  });

  test('multiple integrations combine env vars', async ({ page }) => {
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', 'supabase');
    await selectIntegration(page, 'payments', 'stripe');
    await selectIntegration(page, 'email', 'resend');

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const envContent = readFile(files, '.env.local.example');
    expect(envContent).toBeTruthy();

    // Should have vars from all integrations
    expect(envContent).toContain('SUPABASE');
    expect(envContent).toContain('STRIPE');
    expect(envContent).toContain('RESEND');
  });

  test('env file includes integration metadata in comments', async ({ page }) => {
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', 'supabase');
    await selectIntegration(page, 'payments', 'stripe');

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const envContent = readFile(files, '.env.local.example');
    expect(envContent).toBeTruthy();

    // Should mention integrations in header
    expect(envContent).toContain('Integrations:');
    expect(envContent).toMatch(/auth.*supabase/i);
    expect(envContent).toMatch(/payments.*stripe/i);
  });

  test('placeholder values are descriptive', async ({ page }) => {
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', 'supabase');

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const envContent = readFile(files, '.env.local.example');
    expect(envContent).toBeTruthy();

    // Should have placeholder values
    expect(envContent).toMatch(/=.*your.*here|=.*value/i);
  });

  test('no env file when no integrations selected', async ({ page }) => {
    // Select blog template which has no required integrations
    await selectTemplate(page, 'blog');

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    // Either no env file, or empty/minimal one
    const envContent = readFile(files, '.env.local.example');
    
    if (envContent) {
      // If exists, should just be comments
      const lines = envContent.split('\n').filter(l => !l.startsWith('#') && l.trim());
      expect(lines.length).toBeLessThanOrEqual(2);
    }
  });

  test('R2 storage has correct env vars', async ({ page }) => {
    await navigateToStep(page, 4);
    await selectIntegration(page, 'storage', 'r2');

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const envContent = readFile(files, '.env.local.example');
    
    // R2 should have S3-compatible env vars
    if (envContent) {
      const hasR2Vars = 
        envContent.includes('R2') ||
        envContent.includes('S3') ||
        envContent.includes('ACCESS_KEY');
      
      expect(hasR2Vars, 'R2 storage should have appropriate env vars').toBe(true);
    }
  });

  test('env values persist across step navigation', async ({ page }) => {
    await navigateToStep(page, 4);
    await selectIntegration(page, 'auth', 'supabase');

    await navigateToStep(page, 5);
    await setEnvVar(page, 'NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');

    // Navigate away and back
    await navigateToStep(page, 4);
    await navigateToStep(page, 5);

    // Value should still be there (check input field)
    const input = page.locator('[data-env="NEXT_PUBLIC_SUPABASE_URL"], input[name="NEXT_PUBLIC_SUPABASE_URL"]').first();
    if (await input.isVisible().catch(() => false)) {
      const value = await input.inputValue();
      expect(value).toBe('https://test.supabase.co');
    }

    // Verify in export
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const envVars = readEnvExample(files);
    expect(envVars['NEXT_PUBLIC_SUPABASE_URL']).toBe('https://test.supabase.co');
  });
});

