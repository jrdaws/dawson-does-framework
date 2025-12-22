// tests/integration/manifest.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createTempProject, cleanupTempProject, createMockManifest } from '../utils/fixtures.mjs';
import { assertValidManifest } from '../utils/assertions.mjs';
import { writeManifest } from '../../src/dd/manifest.mjs';

test('writeManifest: creates valid manifest', () => {
  const tempDir = createTempProject();

  try {
    const manifestPath = writeManifest(tempDir, {
      templateId: 'saas',
      flags: { afterInstall: 'prompt' },
      resolved: { mode: 'local', localPath: '/path/to/template' },
    });

    assert(fs.existsSync(manifestPath), 'Manifest file not created');

    // Read and validate the template-manifest.json structure
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.templateId, 'saas');
    assert.equal(manifest.schemaVersion, 1);
    assert(manifest.generatedAt);
    assert(Array.isArray(manifest.files));
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('writeManifest: includes template metadata', () => {
  const tempDir = createTempProject();

  try {
    const manifestPath = writeManifest(tempDir, {
      templateId: 'saas',
      flags: {
        templateSource: 'local',
        frameworkVersion: 'v0.3.0',
      },
      resolved: { mode: 'local', localPath: '/path/to/template' },
    });

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.templateId, 'saas');
    assert.equal(manifest.templateSource, 'local');
    assert.equal(manifest.frameworkVersion, 'v0.3.0');
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('writeManifest: includes timestamp', () => {
  const tempDir = createTempProject();

  try {
    const beforeTime = new Date().toISOString();
    const manifestPath = writeManifest(tempDir, {
      templateId: 'saas',
      flags: {},
      resolved: { mode: 'local' },
    });
    const afterTime = new Date().toISOString();

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert(manifest.generatedAt, 'Manifest missing generatedAt');
    assert(manifest.generatedAt >= beforeTime, 'Timestamp too early');
    assert(manifest.generatedAt <= afterTime, 'Timestamp too late');
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('manifest validation: rejects invalid manifest', () => {
  const tempDir = createTempProject();

  try {
    const ddDir = path.join(tempDir, '.dd');
    fs.mkdirSync(ddDir, { recursive: true });

    // Create invalid manifest (missing required fields)
    const manifestPath = path.join(ddDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify({ invalid: true }));

    assert.throws(() => {
      assertValidManifest(manifestPath);
    }, 'Should reject invalid manifest');
  } finally {
    cleanupTempProject(tempDir);
  }
});

test('manifest validation: accepts valid manifest', () => {
  const tempDir = createTempProject();

  try {
    createMockManifest(tempDir, {
      template: 'saas',
      version: '0.1.0',
      capabilities: ['auth', 'billing'],
    });

    const manifestPath = path.join(tempDir, '.dd/manifest.json');
    assert.doesNotThrow(() => {
      assertValidManifest(manifestPath);
    });
  } finally {
    cleanupTempProject(tempDir);
  }
});
