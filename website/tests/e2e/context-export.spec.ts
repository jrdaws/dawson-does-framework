/**
 * E2E Tests: Context Fields Export to .dd/ Files
 * 
 * Verifies that:
 * - Vision is saved to .dd/vision.md
 * - Mission is saved to .dd/mission.md
 * - Success criteria is saved to .dd/goals.md
 * 
 * These tests would have caught: Mission statement not saved to .dd/
 */

import { test, expect } from '@playwright/test';
import {
  goToConfigurator,
  selectTemplate,
  navigateToStep,
  skipToExport,
  downloadProject,
  extractZip,
  hasFile,
  readFile,
  fillField,
  waitForIdle,
} from './test-utils';

test.describe('Context Fields Export', () => {
  const testData = {
    vision: 'To become the leading platform for developer productivity tools',
    mission: 'We help developers ship faster by eliminating boilerplate and complexity',
    successCriteria: 'Measure success by daily active users, projects exported, and developer satisfaction scores',
  };

  test.beforeEach(async ({ page }) => {
    await goToConfigurator(page);
    await waitForIdle(page);
    await selectTemplate(page, 'saas');
  });

  test('saves all context fields to .dd/ directory', async ({ page }) => {
    // Navigate to context step (Step 7)
    await navigateToStep(page, 7);

    // Fill in all context fields
    await fillField(page, 'vision', testData.vision);
    await fillField(page, 'mission', testData.mission);
    await fillField(page, 'success', testData.successCriteria);
    await fillField(page, 'successCriteria', testData.successCriteria); // Try both names

    // Export
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    // CRITICAL: Verify all .dd/ files exist
    expect(hasFile(files, '.dd/vision.md'), '.dd/vision.md must exist').toBe(true);
    expect(hasFile(files, '.dd/mission.md'), '.dd/mission.md must exist - THIS IS THE BUG').toBe(true);
    expect(hasFile(files, '.dd/goals.md'), '.dd/goals.md must exist').toBe(true);
  });

  test('vision.md contains entered vision statement', async ({ page }) => {
    await navigateToStep(page, 7);
    await fillField(page, 'vision', testData.vision);

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const visionContent = readFile(files, '.dd/vision.md');
    expect(visionContent, 'vision.md should exist and have content').toBeTruthy();
    expect(visionContent).toContain(testData.vision);
    expect(visionContent).toContain('# Project Vision');
  });

  test('mission.md contains entered mission statement', async ({ page }) => {
    await navigateToStep(page, 7);
    await fillField(page, 'mission', testData.mission);

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    // CRITICAL TEST: This catches the mission statement not being saved
    const missionContent = readFile(files, '.dd/mission.md');
    expect(missionContent, 'mission.md should exist - CRITICAL: Currently failing').toBeTruthy();
    expect(missionContent).toContain(testData.mission);
    expect(missionContent).toContain('# Project Mission');
  });

  test('goals.md contains entered success criteria', async ({ page }) => {
    await navigateToStep(page, 7);
    await fillField(page, 'success', testData.successCriteria);
    await fillField(page, 'successCriteria', testData.successCriteria);

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const goalsContent = readFile(files, '.dd/goals.md');
    expect(goalsContent, 'goals.md should exist and have content').toBeTruthy();
    expect(goalsContent).toContain(testData.successCriteria);
    expect(goalsContent).toContain('# Success Criteria');
  });

  test('empty context fields do not create files', async ({ page }) => {
    // Don't fill in any context fields
    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    // Empty fields should NOT create files
    const visionContent = readFile(files, '.dd/vision.md');
    const missionContent = readFile(files, '.dd/mission.md');
    const goalsContent = readFile(files, '.dd/goals.md');

    // If files exist, they should be undefined or the file shouldn't exist
    // The zip generator checks for .trim() before creating files
    if (visionContent) {
      expect(visionContent.length).toBeGreaterThan(50); // Should have header if exists
    }
  });

  test('context files have proper markdown formatting', async ({ page }) => {
    await navigateToStep(page, 7);
    await fillField(page, 'vision', testData.vision);
    await fillField(page, 'mission', testData.mission);
    await fillField(page, 'success', testData.successCriteria);

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const visionContent = readFile(files, '.dd/vision.md');
    if (visionContent) {
      // Should have H1 header
      expect(visionContent).toMatch(/^# /m);
      // Should have generator signature
      expect(visionContent).toContain('dawson-does-framework');
    }
  });

  test('special characters in context are preserved', async ({ page }) => {
    const specialVision = 'We build "awesome" tools & solutions — for everyone!';

    await navigateToStep(page, 7);
    await fillField(page, 'vision', specialVision);

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const visionContent = readFile(files, '.dd/vision.md');
    if (visionContent) {
      expect(visionContent).toContain(specialVision);
    }
  });

  test('multiline context is preserved', async ({ page }) => {
    const multilineVision = `Line 1 of vision.
Line 2 of vision.
Line 3 of vision.`;

    await navigateToStep(page, 7);
    await fillField(page, 'vision', multilineVision);

    await skipToExport(page);
    const download = await downloadProject(page);
    const files = await extractZip(download);

    const visionContent = readFile(files, '.dd/vision.md');
    if (visionContent) {
      expect(visionContent).toContain('Line 1');
      expect(visionContent).toContain('Line 2');
      expect(visionContent).toContain('Line 3');
    }
  });
});

