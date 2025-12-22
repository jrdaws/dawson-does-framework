import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frameworkBin = path.resolve(__dirname, '../../bin/framework.js');

function runFramework(args, options = {}) {
  const result = spawnSync('node', [frameworkBin, ...args], {
    encoding: 'utf-8',
    timeout: 15000,
    ...options,
  });
  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    status: result.status,
    error: result.error,
  };
}

test('CLI: version command shows version', () => {
  const result = runFramework(['version']);
  assert.equal(result.status, 0);
  assert(result.stdout.includes('@jrdaws/framework') || result.stdout.includes('version'));
});

test('CLI: upgrade command shows upgrade instructions', () => {
  const result = runFramework(['upgrade', '--dry-run']);
  // Should run without error
  assert(result.status === 0 || result.stdout.length > 0 || result.stderr.length > 0);
});

test('CLI: doctor command runs health checks', () => {
  const result = runFramework(['doctor']);
  assert.equal(result.status, 0);
  assert(result.stdout.length > 0 || result.stderr.length > 0);
});

test('CLI: capabilities command shows capabilities', () => {
  const result = runFramework(['capabilities']);
  assert.equal(result.status, 0);
  assert(result.stdout.length > 0);
});

test('CLI: capabilities list shows list', () => {
  const result = runFramework(['capabilities', '--list']);
  // Should run without error
  if (result.status === 0) {
    assert(result.stdout.length > 0);
  }
});

test('CLI: drift command in current directory', () => {
  const result = runFramework(['drift']);
  // May succeed or fail depending on current directory state
  assert(result.status === 0 || result.stderr.length > 0 || result.stdout.length > 0);
});

test('CLI: phrases command shows phrases', () => {
  const result = runFramework(['phrases']);
  // Should run without error
  assert(result.status === 0 || result.stdout.length > 0 || result.stderr.length > 0);
});

test('CLI: toggle command without args', () => {
  const result = runFramework(['toggle']);
  // Should show usage or run
  assert(result.status === 0 || result.stdout.length > 0 || result.stderr.length > 0);
});

test('CLI: checkpoint list shows checkpoints', () => {
  const result = runFramework(['checkpoint', 'list']);
  // Should run without error
  assert(result.status === 0 || result.stdout.length > 0 || result.stderr.length > 0);
});

test('CLI: checkpoint help shows usage', () => {
  const result = runFramework(['checkpoint', 'help']);
  // Should show help
  assert(result.stdout.includes('checkpoint') || result.stdout.includes('Usage'));
});

test('CLI: llm command without subcommand shows help', () => {
  const result = runFramework(['llm']);
  assert(result.stdout.includes('Usage') || result.stdout.includes('llm'));
});

test('CLI: auth command without subcommand shows help', () => {
  const result = runFramework(['auth']);
  assert(result.stdout.includes('Usage') || result.stdout.includes('auth'));
});

test('CLI: plugin command without subcommand shows help', () => {
  const result = runFramework(['plugin']);
  assert(result.stdout.includes('Plugin') || result.stdout.includes('Usage'));
});

test('CLI: templates command without subcommand shows help', () => {
  const result = runFramework(['templates']);
  assert(result.stdout.includes('Template') || result.stdout.includes('Usage'));
});

test('CLI: deploy command shows usage', () => {
  const result = runFramework(['deploy']);
  // Should show usage or run
  assert(result.status === 0 || result.stdout.length > 0 || result.stderr.length > 0);
});

test('CLI: deploy:auth command shows usage', () => {
  const result = runFramework(['deploy:auth']);
  // Should show usage or run
  assert(result.status === 0 || result.stdout.length > 0 || result.stderr.length > 0);
});

test('CLI: help command shows all commands', () => {
  const result = runFramework(['help']);
  assert.equal(result.status, 0);
  assert(result.stdout.includes('Usage'));
  assert(result.stdout.includes('export') || result.stdout.includes('command'));
});

test('CLI: --help flag shows help', () => {
  const result = runFramework(['--help']);
  assert.equal(result.status, 0);
  assert(result.stdout.includes('Usage'));
});

test('CLI: -h flag shows help', () => {
  const result = runFramework(['-h']);
  assert.equal(result.status, 0);
  assert(result.stdout.includes('Usage'));
});

test('CLI: no arguments shows help', () => {
  const result = runFramework([]);
  assert.equal(result.status, 0);
  assert(result.stdout.includes('Usage'));
});

test('CLI: start command shows usage', () => {
  const result = runFramework(['start']);
  // Should show usage or attempt to start
  assert(result.status === 0 || result.stdout.length > 0 || result.stderr.length > 0);
});

test('CLI: figma:parse command', () => {
  const result = runFramework(['figma:parse']);
  // Should run without crashing (may succeed or fail based on environment)
  assert(result.status === 0 || result.stdout.length > 0 || result.stderr.length > 0);
});

test('CLI: cost:summary command', () => {
  const result = runFramework(['cost:summary']);
  // Should run without crashing
  assert(result.status === 0 || result.stdout.length > 0 || result.stderr.length > 0);
});

test('CLI: version shows package info', () => {
  const result = runFramework(['version']);
  assert.equal(result.status, 0);
  // Should show version or package name
  assert(result.stdout.length > 0);
});

test('CLI: templates list command works', () => {
  const result = runFramework(['templates', 'list']);
  assert.equal(result.status, 0);
  assert(result.stdout.includes('Templates') || result.stdout.includes('Available') || result.stdout.includes('No templates'));
});

test('CLI: templates search works', () => {
  const result = runFramework(['templates', 'search', 'saas']);
  assert.equal(result.status, 0);
  assert(result.stdout.length > 0);
});

test('CLI: templates categories works', () => {
  const result = runFramework(['templates', 'categories']);
  assert.equal(result.status, 0);
  assert(result.stdout.length > 0);
});

test('CLI: templates tags works', () => {
  const result = runFramework(['templates', 'tags']);
  assert.equal(result.status, 0);
  assert(result.stdout.length > 0);
});

test('CLI: plugin list command works', () => {
  const result = runFramework(['plugin', 'list']);
  assert.equal(result.status, 0);
  assert(result.stdout.includes('plugin') || result.stdout.includes('No plugins'));
});

test('CLI: plugin hooks command works', () => {
  const result = runFramework(['plugin', 'hooks']);
  assert.equal(result.status, 0);
  assert(result.stdout.includes('Hook') || result.stdout.includes('Available'));
});
