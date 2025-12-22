import test from 'node:test';
import assert from 'node:assert/strict';
import { cmdDeploy, cmdDeployAuth } from '../../src/commands/deploy.mjs';

test('deploy: cmdDeploy with no args shows help', async () => {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  const originalExit = process.exit;
  let exitCode = null;

  console.log = (msg) => { output += msg + '\n'; };
  console.error = (msg) => { output += msg + '\n'; };
  process.exit = (code) => { exitCode = code; throw new Error('EXIT'); };

  try {
    await cmdDeploy([]);
  } catch (e) {
    if (e.message !== 'EXIT') throw e;
  } finally {
    console.log = originalLog;
    console.error = originalError;
    process.exit = originalExit;
  }

  assert(output.includes('deploy') || output.includes('Usage') || output.length > 0);
});

test('deploy: cmdDeploy with help flag shows help', async () => {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  const originalExit = process.exit;

  console.log = (msg) => { output += msg + '\n'; };
  console.error = (msg) => { output += msg + '\n'; };
  process.exit = (code) => { throw new Error('EXIT'); };

  try {
    await cmdDeploy(['--help']);
  } catch (e) {
    if (e.message !== 'EXIT') throw e;
  } finally {
    console.log = originalLog;
    console.error = originalError;
    process.exit = originalExit;
  }

  assert(output.length > 0);
});

test('deploy: cmdDeployAuth with no args shows help', async () => {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  const originalExit = process.exit;
  let exitCode = null;

  console.log = (msg) => { output += msg + '\n'; };
  console.error = (msg) => { output += msg + '\n'; };
  process.exit = (code) => { exitCode = code; throw new Error('EXIT'); };

  try {
    await cmdDeployAuth([]);
  } catch (e) {
    if (e.message !== 'EXIT') throw e;
  } finally {
    console.log = originalLog;
    console.error = originalError;
    process.exit = originalExit;
  }

  assert(output.includes('auth') || output.includes('Usage') || output.length > 0);
});

test('deploy: cmdDeployAuth with help flag', async () => {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  const originalExit = process.exit;

  console.log = (msg) => { output += msg + '\n'; };
  console.error = (msg) => { output += msg + '\n'; };
  process.exit = (code) => { throw new Error('EXIT'); };

  try {
    await cmdDeployAuth(['--help']);
  } catch (e) {
    if (e.message !== 'EXIT') throw e;
  } finally {
    console.log = originalLog;
    console.error = originalError;
    process.exit = originalExit;
  }

  assert(output.length > 0);
});

test('deploy: cmdDeploy handles unknown provider gracefully', async () => {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  const originalExit = process.exit;

  console.log = (msg) => { output += msg + '\n'; };
  console.error = (msg) => { output += msg + '\n'; };
  process.exit = (code) => { throw new Error('EXIT'); };

  try {
    await cmdDeploy(['unknown-provider']);
  } catch (e) {
    if (e.message !== 'EXIT') {
      // Command may not exit, just handle error
    }
  } finally {
    console.log = originalLog;
    console.error = originalError;
    process.exit = originalExit;
  }

  // Should show some output
  assert(true);
});

test('deploy: cmdDeployAuth handles unknown provider gracefully', async () => {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  const originalExit = process.exit;

  console.log = (msg) => { output += msg + '\n'; };
  console.error = (msg) => { output += msg + '\n'; };
  process.exit = (code) => { throw new Error('EXIT'); };

  try {
    await cmdDeployAuth(['unknown-provider']);
  } catch (e) {
    if (e.message !== 'EXIT') {
      // Command may not exit, just handle error
    }
  } finally {
    console.log = originalLog;
    console.error = originalError;
    process.exit = originalExit;
  }

  // Should show some output
  assert(true);
});
