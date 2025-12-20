/**
 * Simple structured logger with timing support
 */

let quietMode = false;
const timings = new Map();

export function setQuiet(quiet) {
  quietMode = quiet;
}

export function log(message) {
  if (!quietMode) {
    console.log(message);
  }
}

export function error(message) {
  // Always show errors, even in quiet mode
  console.error(message);
}

export function startStep(stepId, message) {
  if (!quietMode) {
    console.log(message);
  }
  timings.set(stepId, Date.now());
}

export function endStep(stepId, message) {
  const startTime = timings.get(stepId);
  const elapsed = startTime ? Date.now() - startTime : 0;
  timings.delete(stepId);

  if (!quietMode) {
    console.log(`${message} (${elapsed}ms)`);
  }
}

export function stepSuccess(message) {
  if (!quietMode) {
    console.log(`     ✓ ${message}`);
  }
}

export function stepWarning(message) {
  if (!quietMode) {
    console.log(`     ⚠️  ${message}`);
  }
}

export function stepInfo(message) {
  if (!quietMode) {
    console.log(`     ${message}`);
  }
}

export function stepError(message) {
  // Always show errors
  console.error(`     ✗ ${message}`);
}

/**
 * Format a step header with progress indicator
 * @param {number} current - Current step number
 * @param {number} total - Total steps
 * @param {string} title - Step title
 * @returns {string} Formatted step header
 */
export function formatStep(current, total, title) {
  return `[${current}/${total}] ${title}`;
}