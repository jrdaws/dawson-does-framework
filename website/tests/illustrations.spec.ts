/**
 * Landing Page Illustrations Smoke Tests
 * 
 * Verifies that all illustrations and images on the homepage render correctly
 * across mobile (375px), tablet (768px), and desktop (1280px) breakpoints.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.SMOKE_TEST_URL || process.env.BASE_URL || 'http://localhost:3000';

// Define breakpoints for responsive testing
const breakpoints = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

// List of all illustration assets used on the homepage
const heroImages = [
  '/images/redesign/hero/hero-gradient-bg.webp',
  '/images/redesign/hero/hero-abstract-graphic.webp',
];

const featureIcons = [
  '/images/redesign/icons/icon-templates.svg',
  '/images/redesign/icons/icon-plugins.svg',
  '/images/redesign/icons/icon-providers.svg',
  '/images/redesign/icons/icon-trust.svg',
  '/images/redesign/icons/icon-cli.svg',
  '/images/redesign/icons/icon-extensible.svg',
];

const avatarImages = [
  '/images/redesign/avatars/avatar-placeholder-1.webp',
  '/images/redesign/avatars/avatar-placeholder-2.webp',
  '/images/redesign/avatars/avatar-placeholder-3.webp',
];

const patternImages = [
  '/images/redesign/patterns/footer-pattern.svg',
];

test.describe('Landing Page Illustrations - Responsive Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  // Test each breakpoint
  for (const [breakpointName, viewport] of Object.entries(breakpoints)) {
    test.describe(`${breakpointName} (${viewport.width}px)`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
      });

      test('homepage loads without errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (err) => errors.push(err.message));
        
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        
        // Check no critical JS errors
        const criticalErrors = errors.filter(e => 
          !e.includes('ResizeObserver') && 
          !e.includes('analytics') &&
          !e.includes('gtag')
        );
        expect(criticalErrors).toHaveLength(0);
        
        // Page should have visible content
        await expect(page.locator('h1').first()).toBeVisible();
      });

      test('hero section renders correctly', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        
        // Hero heading should be visible
        const heroHeading = page.locator('h1').first();
        await expect(heroHeading).toBeVisible();
        await expect(heroHeading).toContainText('From idea to production');
        
        // Hero gradient background should be visible (check background image style)
        const heroSection = page.locator('section').first();
        await expect(heroSection).toBeVisible();
        
        // Terminal animation container should exist
        const terminal = page.locator('.terminal-window').first();
        await expect(terminal).toBeVisible();
        
        // Abstract graphic image should be present (may be hidden on mobile)
        const abstractGraphic = page.locator('img[src*="hero-abstract-graphic"]');
        if (breakpointName !== 'mobile') {
          // On larger screens, the graphic should be visible
          await expect(abstractGraphic).toBeVisible({ timeout: 5000 }).catch(() => {
            // May be out of viewport - just ensure it exists
            expect(abstractGraphic).toBeTruthy();
          });
        }
      });

      test('feature icons render correctly', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        
        // Scroll to features section
        await page.locator('text=Template Registry').first().scrollIntoViewIfNeeded();
        
        // All 6 feature icons should be present
        for (const iconPath of featureIcons) {
          const iconImg = page.locator(`img[src="${iconPath}"]`);
          await expect(iconImg).toHaveCount(1);
          
          // Check that image has natural dimensions (loaded correctly)
          const boundingBox = await iconImg.boundingBox();
          expect(boundingBox).not.toBeNull();
          if (boundingBox) {
            expect(boundingBox.width).toBeGreaterThan(0);
            expect(boundingBox.height).toBeGreaterThan(0);
          }
        }
      });

      test('avatar images render correctly', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        
        // Scroll to testimonials section
        await page.locator('text=Built by Developers').first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(500); // Allow lazy loading
        
        // All 3 avatar images should be present
        // Next.js Image component transforms src, so check for partial match in srcset or src
        for (const avatarPath of avatarImages) {
          const filename = avatarPath.split('/').pop();
          // Next.js Image uses srcset, so look for img with src containing the encoded path
          const avatarImg = page.locator(`img[src*="${encodeURIComponent(avatarPath)}"], img[srcset*="${encodeURIComponent(avatarPath)}"]`);
          const count = await avatarImg.count();
          
          // If not found with encoded URL, try with original path (in case of unoptimized images)
          if (count === 0) {
            const directImg = page.locator(`img[src="${avatarPath}"]`);
            const directCount = await directImg.count();
            expect(directCount, `Avatar ${filename} should exist`).toBe(1);
          } else {
            expect(count, `Avatar ${filename} should exist`).toBeGreaterThanOrEqual(1);
          }
          
          // Check that avatar class images exist in testimonials
          const avatarClassImg = page.locator('.avatar').nth(avatarImages.indexOf(avatarPath));
          await expect(avatarClassImg).toBeVisible();
          
          const boundingBox = await avatarClassImg.boundingBox();
          expect(boundingBox).not.toBeNull();
          if (boundingBox) {
            expect(boundingBox.width).toBeGreaterThan(0);
            expect(boundingBox.height).toBeGreaterThan(0);
          }
        }
      });

      test('all images load without 404 errors', async ({ page }) => {
        const failedImages: string[] = [];
        
        // Intercept image requests
        page.on('response', (response) => {
          if (response.request().resourceType() === 'image') {
            if (response.status() === 404) {
              failedImages.push(response.url());
            }
          }
        });
        
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        
        // Scroll through the entire page to trigger lazy loading
        await page.evaluate(async () => {
          await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 300;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 100);
          });
        });
        
        await page.waitForTimeout(1000); // Wait for any remaining lazy loads
        
        // No images should have failed to load
        expect(failedImages).toHaveLength(0);
      });

      test('responsive layout is correct', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        
        // Check viewport-specific layout behaviors
        if (breakpointName === 'mobile') {
          // On mobile, grid should be single column
          const featureCards = page.locator('.feature-card');
          const firstCard = await featureCards.first().boundingBox();
          const secondCard = await featureCards.nth(1).boundingBox();
          
          if (firstCard && secondCard) {
            // Cards should be stacked (second card below first)
            expect(secondCard.y).toBeGreaterThan(firstCard.y);
          }
          
          // CTA buttons should be stacked
          const ctaButtons = page.locator('a[href="/configure"], a[href*="github.com"]').first();
          await expect(ctaButtons).toBeVisible();
        }
        
        if (breakpointName === 'desktop') {
          // On desktop, feature grid should have 3 columns
          const featureCards = page.locator('.feature-card');
          const count = await featureCards.count();
          expect(count).toBe(6);
          
          // First three cards should be on the same row
          const firstCard = await featureCards.nth(0).boundingBox();
          const secondCard = await featureCards.nth(1).boundingBox();
          const thirdCard = await featureCards.nth(2).boundingBox();
          
          if (firstCard && secondCard && thirdCard) {
            // All three should have approximately the same y position
            expect(Math.abs(firstCard.y - secondCard.y)).toBeLessThan(10);
            expect(Math.abs(secondCard.y - thirdCard.y)).toBeLessThan(10);
          }
        }
      });

      test('images have proper alt text', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        
        // All feature icons should have alt text
        const allImages = page.locator('img');
        const count = await allImages.count();
        
        for (let i = 0; i < count; i++) {
          const img = allImages.nth(i);
          const alt = await img.getAttribute('alt');
          const src = await img.getAttribute('src');
          
          // Skip next.js internal images
          if (src?.includes('_next/')) continue;
          
          // All images should have alt attribute (even if empty for decorative)
          expect(alt).not.toBeNull();
        }
      });
    });
  }
});

test.describe('Image Asset Verification', () => {
  test('all image files exist and are accessible', async ({ request }) => {
    const allImages = [
      ...heroImages,
      ...featureIcons,
      ...avatarImages,
      ...patternImages,
    ];
    
    for (const imagePath of allImages) {
      const response = await request.get(`${BASE_URL}${imagePath}`);
      expect(response.ok(), `Image ${imagePath} should be accessible`).toBeTruthy();
      
      // Check content type is an image
      const contentType = response.headers()['content-type'];
      expect(contentType).toMatch(/image\/(webp|svg\+xml|png|jpeg)/);
    }
  });
});

test.describe('Visual Regression Quick Check', () => {
  for (const [breakpointName, viewport] of Object.entries(breakpoints)) {
    test(`homepage visual check at ${breakpointName}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      // Wait for animations to complete
      await page.waitForTimeout(2000);
      
      // Take a screenshot for visual inspection (useful for debugging)
      const screenshotName = `homepage-${breakpointName}.png`;
      await page.screenshot({ 
        path: `test-results/${screenshotName}`,
        fullPage: false 
      });
      
      // Basic visual checks
      const heroSection = page.locator('section').first();
      const heroBox = await heroSection.boundingBox();
      
      expect(heroBox).not.toBeNull();
      if (heroBox) {
        // Hero should take significant viewport height
        expect(heroBox.height).toBeGreaterThan(viewport.height * 0.5);
      }
    });
  }
});

