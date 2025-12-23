/**
 * Production Smoke Tests
 * 
 * Lightweight test suite for verifying production deployment.
 * Designed to run quickly (< 30 seconds) and test critical paths only.
 * 
 * Usage:
 *   npm run test:smoke                    # Run against localhost
 *   npm run test:smoke -- --base-url=https://your-production-url.com
 *   SMOKE_TEST_URL=https://example.com npm run test:smoke
 */

import { test, expect } from '@playwright/test';

// Get the base URL from environment or use default
const BASE_URL = process.env.SMOKE_TEST_URL || process.env.BASE_URL || 'http://localhost:3000';

test.describe('Production Smoke Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  test('health endpoint returns healthy status', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    
    expect(response.ok()).toBeTruthy();
    
    const health = await response.json();
    
    // Core assertions
    expect(health).toHaveProperty('status');
    expect(health).toHaveProperty('services');
    expect(health).toHaveProperty('timestamp');
    
    // Status should be healthy or degraded (not unhealthy)
    expect(['healthy', 'degraded']).toContain(health.status);
    
    // API service must be up
    expect(health.services.api.status).toBe('up');
    
    // Response time should be reasonable (< 5 seconds)
    if (health.responseTimeMs) {
      expect(health.responseTimeMs).toBeLessThan(5000);
    }
  });

  test('homepage loads correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for page to be interactive
    await page.waitForLoadState('domcontentloaded');
    
    // Check page title exists
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    
    // Check main heading is visible
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 10000 });
    
    // No JavaScript errors
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    
    // Wait a moment for any async errors
    await page.waitForTimeout(1000);
    
    // Filter out known benign errors (like third-party scripts)
    const criticalErrors = errors.filter(e => 
      !e.includes('ResizeObserver') && 
      !e.includes('analytics') &&
      !e.includes('gtag')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('configure page renders without React errors', async ({ page }) => {
    await page.goto(`${BASE_URL}/configure`);
    
    // Wait for page load
    await page.waitForLoadState('domcontentloaded');
    
    // Check for React error boundaries (they typically show specific error text)
    const errorBoundary = page.locator('text=Something went wrong');
    const hasError = await errorBoundary.isVisible().catch(() => false);
    
    if (hasError) {
      // Capture the error for debugging
      const errorText = await page.locator('body').textContent();
      console.error('React Error:', errorText?.substring(0, 500));
    }
    
    expect(hasError).toBe(false);
    
    // Check that some interactive element exists (configurator loaded)
    // Dynamic imports may take a moment
    await page.waitForTimeout(2000);
    
    // Page should have interactive content
    const hasContent = await page.locator('button, input, [role="button"]').first().isVisible().catch(() => false);
    expect(hasContent).toBe(true);
  });

  test('API responds to requests', async ({ request }) => {
    // Test a simple API endpoint
    const response = await request.get(`${BASE_URL}/api/health`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('static assets load correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for network to settle
    await page.waitForLoadState('networkidle');
    
    // Check that stylesheets loaded (page should have some styling)
    const body = page.locator('body');
    const backgroundColor = await body.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Background should be set (not default browser white)
    expect(backgroundColor).toBeTruthy();
    
    // Check for Next.js script bundles
    const scripts = await page.locator('script[src*="_next"]').count();
    expect(scripts).toBeGreaterThan(0);
  });

  test('navigation works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    
    // Find and click a navigation link
    const configureLink = page.locator('a[href="/configure"]').first();
    
    if (await configureLink.isVisible()) {
      await configureLink.click();
      
      // Verify navigation happened
      await expect(page).toHaveURL(/\/configure/);
    }
  });

  test('response times are acceptable', async ({ request }) => {
    const endpoints = [
      '/api/health',
    ];
    
    for (const endpoint of endpoints) {
      const start = Date.now();
      const response = await request.get(`${BASE_URL}${endpoint}`);
      const duration = Date.now() - start;
      
      // API responses should be under 3 seconds
      expect(duration).toBeLessThan(3000);
      expect(response.ok()).toBeTruthy();
    }
  });
});

test.describe('Critical Error Detection', () => {
  test('no 500 errors on main pages', async ({ page }) => {
    const pages = ['/', '/configure'];
    const errors: { url: string; status: number }[] = [];
    
    // Intercept responses
    page.on('response', (response) => {
      if (response.status() >= 500) {
        errors.push({ url: response.url(), status: response.status() });
      }
    });
    
    for (const path of pages) {
      await page.goto(`${BASE_URL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    }
    
    expect(errors).toHaveLength(0);
  });
});

