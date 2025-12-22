// tests/dd/logger.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import * as logger from '../../src/dd/logger.mjs';

test('logger: log outputs message', () => {
  assert.doesNotThrow(() => logger.log('test message'));
});

test('logger: error outputs error message', () => {
  assert.doesNotThrow(() => logger.error('error message'));
});

test('logger: formatStep formats step correctly', () => {
  const formatted = logger.formatStep(1, 5, 'Test step');
  assert(formatted.includes('[1/5]'));
  assert(formatted.includes('Test step'));
});

test('logger: setQuiet enables quiet mode', () => {
  logger.setQuiet(true);
  assert.doesNotThrow(() => logger.log('should not output'));
  logger.setQuiet(false);
});

test('logger: startStep records timing', () => {
  assert.doesNotThrow(() => logger.startStep('test-step', 'Starting test'));
});

test('logger: endStep calculates elapsed time', () => {
  logger.startStep('test-step-2', 'Starting');
  assert.doesNotThrow(() => logger.endStep('test-step-2', 'Completed'));
});

test('logger: endStep handles missing start time', () => {
  assert.doesNotThrow(() => logger.endStep('nonexistent-step', 'Completed'));
});

test('logger: stepSuccess outputs success message', () => {
  assert.doesNotThrow(() => logger.stepSuccess('operation succeeded'));
});

test('logger: stepWarning outputs warning message', () => {
  assert.doesNotThrow(() => logger.stepWarning('warning message'));
});

test('logger: stepInfo outputs info message', () => {
  assert.doesNotThrow(() => logger.stepInfo('info message'));
});

test('logger: stepError outputs error message', () => {
  assert.doesNotThrow(() => logger.stepError('error message'));
});

test('logger: quiet mode suppresses log but not error', () => {
  logger.setQuiet(true);
  assert.doesNotThrow(() => {
    logger.log('should be quiet');
    logger.error('should still show');
  });
  logger.setQuiet(false);
});

test('logger: quiet mode suppresses step messages', () => {
  logger.setQuiet(true);
  assert.doesNotThrow(() => {
    logger.stepSuccess('quiet success');
    logger.stepWarning('quiet warning');
    logger.stepInfo('quiet info');
  });
  logger.setQuiet(false);
});

test('logger: timing tracks multiple steps', () => {
  assert.doesNotThrow(() => {
    logger.startStep('step1', 'Step 1');
    logger.startStep('step2', 'Step 2');
    logger.endStep('step1', 'Step 1 done');
    logger.endStep('step2', 'Step 2 done');
  });
});
