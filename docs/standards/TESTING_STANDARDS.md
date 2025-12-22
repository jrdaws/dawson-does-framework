# Testing Standards

> How to write consistent, effective tests for the dawson-does-framework

## Overview

This project uses the Node.js built-in test runner for unit and integration tests, and Playwright for E2E tests. All code should be tested before committing.

---

## 1. Test File Organization

### Directory Structure

```
tests/
├── cli/                    # CLI command tests
│   ├── export.test.mjs
│   ├── version.test.mjs
│   └── ...
├── dd/                     # Core module tests
│   ├── logger.test.mjs
│   ├── manifest.test.mjs
│   └── ...
├── integration/            # Integration tests
│   ├── template-valid.test.mjs
│   └── ...
├── fixtures/               # Test fixtures
│   ├── template-mini/
│   ├── registry/
│   └── ...
├── utils/                  # Test utilities
│   └── assertions.mjs
└── framework-map.test.mjs  # Root-level tests

website/tests/              # E2E tests (Playwright)
├── configurator.spec.ts
├── homepage.spec.ts
└── ...
```

### File Naming Convention

- Unit tests: `{module-name}.test.mjs`
- Integration tests: `{feature-name}.test.mjs`
- E2E tests: `{page-name}.spec.ts`

### Test Location

- Test files live in `tests/` directory, mirroring the structure of `src/`
- Website E2E tests live in `website/tests/`

---

## 2. Test Structure

### Basic Test (Node.js Test Runner)

```javascript
import test from "node:test"
import assert from "node:assert/strict"

test("function name: does expected thing when given valid input", () => {
  // Arrange
  const input = { value: 42 }

  // Act
  const result = functionName(input)

  // Assert
  assert.strictEqual(result, expected)
})
```

### Grouped Tests with describe()

```javascript
import { test, describe } from "node:test"
import assert from "node:assert/strict"

describe("ModuleName", () => {
  describe("functionName", () => {
    test("returns correct value when given valid input", () => {
      // Arrange
      const input = "test"

      // Act
      const result = functionName(input)

      // Assert
      assert.strictEqual(result, "expected")
    })

    test("throws error when given invalid input", () => {
      assert.throws(
        () => functionName(null),
        { message: /expected pattern/ }
      )
    })
  })
})
```

### AAA Pattern (Arrange-Act-Assert)

Always structure tests with clear sections:

1. **Arrange**: Set up test data and preconditions
2. **Act**: Execute the code under test
3. **Assert**: Verify the results

---

## 3. Assertion Patterns

### Standard Assertions

| Use | For | Example |
|-----|-----|---------|
| `assert.strictEqual(a, b)` | Primitive equality | `assert.strictEqual(result, 42)` |
| `assert.deepStrictEqual(a, b)` | Object/array equality | `assert.deepStrictEqual(obj, { key: "value" })` |
| `assert.ok(value)` | Truthy check | `assert.ok(result)` |
| `assert.ok(!value)` | Falsy check | `assert.ok(!error)` |
| `assert.throws(fn, pattern)` | Error checking | `assert.throws(() => fn(), { message: /error/ })` |
| `assert.rejects(promise, pattern)` | Async error checking | `await assert.rejects(asyncFn(), { message: /error/ })` |
| `assert.doesNotThrow(fn)` | No error thrown | `assert.doesNotThrow(() => fn())` |

### Custom Assertions

Use the custom assertion utilities from `tests/utils/assertions.mjs`:

```javascript
import {
  assertValidTemplate,
  assertValidManifest,
  assertHasFiles,
  assertFileContains,
  assertIsGitRepo,
  assertHasDependencies,
  assertPackageJson
} from "../utils/assertions.mjs"

// Check template structure
assertValidTemplate("/path/to/template")

// Check for specific files
assertHasFiles(dirPath, ["README.md", "package.json"])

// Check file contents
assertFileContains(filePath, /expected pattern/)

// Check dependencies
assertHasDependencies(packageJsonPath, ["react", "next"])
```

---

## 4. Test Naming Convention

### Pattern: "module/function: does X when Y"

```javascript
// ✅ GOOD: Clear, descriptive names
test("registry: validateTemplateMetadata accepts valid metadata", ...)
test("registry: validateTemplateMetadata rejects missing id", ...)
test("logger: setQuiet enables quiet mode", ...)
test("export command: validates git availability before export", ...)

// ❌ BAD: Vague names
test("works correctly", ...)
test("handles edge case", ...)
test("test 1", ...)
```

### Naming Rules

1. Start with module/function name for context
2. Use present tense ("returns", "throws", "validates")
3. Specify the condition ("when given invalid input", "when file not found")
4. Be specific about what's being tested

---

## 5. Fixtures

### Fixture Structure

```
tests/fixtures/
├── template-mini/          # Minimal template for testing
│   ├── .dd/
│   │   └── manifest.json
│   ├── package.json
│   └── ...
├── registry/               # Registry test fixtures
│   └── ...
└── plugins/                # Plugin test fixtures
    └── ...
```

### Using Fixtures

```javascript
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES_DIR = path.join(__dirname, "fixtures", "template-mini")

test("loads fixture correctly", () => {
  const templatePath = path.join(FIXTURES_DIR, "package.json")
  const pkg = JSON.parse(fs.readFileSync(templatePath, "utf8"))
  assert.ok(pkg.name)
})
```

### Creating Test Fixtures

1. Keep fixtures minimal - only include what's needed
2. Use realistic data (from actual templates)
3. Place in `tests/fixtures/{feature-name}/`
4. Document fixture purpose in README.md

---

## 6. Mocking

### Environment Variables

```javascript
test("uses environment variable when set", () => {
  const original = process.env.API_KEY

  // Arrange
  process.env.API_KEY = "test-key"

  // Act
  const result = getApiKey()

  // Assert
  assert.strictEqual(result, "test-key")

  // Cleanup
  if (original) {
    process.env.API_KEY = original
  } else {
    delete process.env.API_KEY
  }
})
```

### Temporary Directories

```javascript
import os from "node:os"
import fs from "node:fs"
import path from "node:path"

test("creates files in temp directory", () => {
  // Arrange
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "test-"))

  try {
    // Act
    createFilesInDirectory(tempDir)

    // Assert
    const files = fs.readdirSync(tempDir)
    assert.ok(files.length > 0)
  } finally {
    // Cleanup
    fs.rmSync(tempDir, { recursive: true })
  }
})
```

### Command Execution

```javascript
import { execSync } from "node:child_process"

test("CLI command exits successfully", () => {
  // Use { stdio: "ignore" } to suppress output
  assert.doesNotThrow(() => {
    execSync("node bin/framework.js --version", { stdio: "ignore" })
  })
})

test("CLI command returns expected output", () => {
  const output = execSync("node bin/framework.js --version", {
    encoding: "utf8"
  })
  assert.ok(output.includes("1.0"))
})
```

---

## 7. Testing Async Code

### Basic Async Test

```javascript
test("async function resolves correctly", async () => {
  // Arrange
  const input = "test"

  // Act
  const result = await asyncFunction(input)

  // Assert
  assert.strictEqual(result, "expected")
})
```

### Testing Async Rejections

```javascript
test("async function rejects on error", async () => {
  // Arrange
  const invalidInput = null

  // Act & Assert
  await assert.rejects(
    asyncFunction(invalidInput),
    {
      name: "Error",
      message: /Invalid input/
    }
  )
})

test("async function rejects with specific error code", async () => {
  await assert.rejects(
    asyncFunction("bad-input"),
    (err) => {
      assert.strictEqual(err.code, "INVALID_INPUT")
      assert.ok(err.message.includes("expected"))
      return true
    }
  )
})
```

### Testing Promise Resolution

```javascript
test("promise resolves to expected value", async () => {
  // Arrange
  const promise = createPromise("input")

  // Act
  const result = await promise

  // Assert
  assert.strictEqual(result, "expected")
})

test("Promise.all handles multiple promises", async () => {
  // Arrange
  const promises = [
    asyncFunction(1),
    asyncFunction(2),
    asyncFunction(3)
  ]

  // Act
  const results = await Promise.all(promises)

  // Assert
  assert.strictEqual(results.length, 3)
  assert.deepStrictEqual(results, [1, 2, 3])
})
```

### Testing Async Sequences

```javascript
test("performs async operations in sequence", async () => {
  // Arrange
  const operations = []

  // Act
  await operation1()
  operations.push(1)

  await operation2()
  operations.push(2)

  await operation3()
  operations.push(3)

  // Assert
  assert.deepStrictEqual(operations, [1, 2, 3])
})
```

### Testing Async Timeouts

```javascript
test("async operation completes within timeout", async () => {
  // Arrange
  const timeout = 1000
  const startTime = Date.now()

  // Act
  await slowAsyncOperation()

  // Assert
  const elapsed = Date.now() - startTime
  assert.ok(elapsed < timeout, `Operation took ${elapsed}ms, expected < ${timeout}ms`)
})

test("async operation times out after delay", async () => {
  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 100)
  )

  // Race between operation and timeout
  await assert.rejects(
    Promise.race([verySlowOperation(), timeoutPromise]),
    { message: /Timeout/ }
  )
})
```

### Testing Async Error Recovery

```javascript
test("recovers from async error with fallback", async () => {
  // Arrange
  let attemptCount = 0

  async function unreliableOperation() {
    attemptCount++
    if (attemptCount < 3) {
      throw new Error("Temporary failure")
    }
    return "success"
  }

  // Act
  const result = await retryOperation(unreliableOperation, 3)

  // Assert
  assert.strictEqual(result, "success")
  assert.strictEqual(attemptCount, 3)
})
```

### Testing Network Calls (Optional Mocking)

```javascript
test("checkForUpdates handles network errors gracefully", async () => {
  try {
    // Act
    const result = await checkForUpdates()

    // Assert - if successful
    assert.ok(typeof result === "object")
    assert.ok(result.hasOwnProperty("updateAvailable"))
  } catch (err) {
    // Assert - network errors are acceptable in tests
    assert.ok(
      err.message.includes("ENOTFOUND") ||
      err.message.includes("fetch") ||
      err.message.includes("network"),
      `Unexpected error: ${err.message}`
    )
  }
})

test("API call retries on failure", async () => {
  // Arrange
  let callCount = 0
  const mockFetch = async () => {
    callCount++
    if (callCount < 3) {
      throw new Error("Network error")
    }
    return { ok: true, json: async () => ({ data: "success" }) }
  }

  // Act
  const result = await retryFetch(mockFetch, { maxRetries: 3 })

  // Assert
  assert.strictEqual(callCount, 3)
  assert.strictEqual(result.data, "success")
})
```

### Testing Async Callbacks

```javascript
test("async callback is called with correct arguments", async () => {
  // Arrange
  let callbackCalled = false
  let callbackArg = null

  const callback = async (arg) => {
    callbackCalled = true
    callbackArg = arg
    return "processed"
  }

  // Act
  const result = await processWithCallback("input", callback)

  // Assert
  assert.ok(callbackCalled)
  assert.strictEqual(callbackArg, "input")
  assert.strictEqual(result, "processed")
})
```

### Testing Event Emitters (Async)

```javascript
import { EventEmitter } from "node:events"

test("async event handler processes event", async () => {
  // Arrange
  const emitter = new EventEmitter()
  let eventData = null

  const eventPromise = new Promise((resolve) => {
    emitter.once("data", (data) => {
      eventData = data
      resolve()
    })
  })

  // Act
  emitter.emit("data", { value: 42 })
  await eventPromise

  // Assert
  assert.deepStrictEqual(eventData, { value: 42 })
})
```

### Testing Parallel Async Operations

```javascript
test("parallel async operations complete independently", async () => {
  // Arrange
  const start = Date.now()

  // Act - all operations run in parallel
  const [result1, result2, result3] = await Promise.all([
    asyncOperation(1), // Takes 100ms
    asyncOperation(2), // Takes 100ms
    asyncOperation(3)  // Takes 100ms
  ])

  // Assert
  const elapsed = Date.now() - start
  assert.strictEqual(result1, 1)
  assert.strictEqual(result2, 2)
  assert.strictEqual(result3, 3)

  // Should complete in ~100ms (parallel), not 300ms (sequential)
  assert.ok(elapsed < 200, `Took ${elapsed}ms, expected < 200ms`)
})
```

### Async Patterns Summary

| Pattern | Use When | Example |
|---------|----------|---------|
| `await fn()` | Testing async functions | `const result = await asyncFn()` |
| `assert.rejects()` | Testing async errors | `await assert.rejects(fn(), { message: /error/ })` |
| `Promise.all()` | Testing parallel operations | `await Promise.all([fn1(), fn2()])` |
| `Promise.race()` | Testing timeouts | `await Promise.race([fn(), timeoutPromise])` |
| `try/catch` | Optional error handling | `try { await fn() } catch (err) { /* ok */ }` |
| Event promise | Testing event emitters | `new Promise(resolve => emitter.once('event', resolve))` |

---

## 8. E2E Tests (Playwright)

### Basic E2E Test

```typescript
import { test, expect } from "@playwright/test"

test.describe("Configurator", () => {
  test("loads configurator page", async ({ page }) => {
    // Arrange & Act
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // Assert
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })
})
```

### User Interaction Tests

```typescript
test("allows template selection", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")

  // Click template button
  await page.click('[data-testid="template-saas"]')

  // Verify selection
  await expect(page.locator(".selected-template")).toContainText("SaaS")
})

test("validates form input", async ({ page }) => {
  await page.goto("/configure")

  // Fill form
  await page.fill('[name="projectName"]', "my-app")
  await page.fill('[name="description"]', "My test app")

  // Submit
  await page.click('[data-testid="submit"]')

  // Verify success
  await expect(page.locator(".success-message")).toBeVisible()
})
```

### E2E Test Patterns

1. Always wait for `networkidle` after navigation
2. Use `data-testid` attributes for reliable selectors
3. Test critical user flows (happy path)
4. Test form validation and error states
5. Keep E2E tests focused - don't test every edge case

---

## 9. Coverage Requirements

### Target Coverage

- **Minimum**: 80% line coverage
- **Critical paths**: 100% coverage (export, pull, manifest operations)
- **New features**: Must include tests

### Running Coverage

```bash
# Run tests with coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Tools

- **c8**: Coverage tool for Node.js test runner
- Generates lcov, text, and HTML reports
- Configuration in package.json

### What to Prioritize

1. Core CLI commands (export, pull, start)
2. Manifest parsing and validation
3. Template resolution
4. Integration merging
5. Error recovery paths

---

## 10. Running Tests

### All Tests

```bash
npm test
```

### Specific Test File

```bash
npm test -- tests/cli/version.test.mjs
```

### Watch Mode

```bash
npm run test:watch
```

### CLI Tests Only

```bash
npm run test:cli
```

### Integration Tests Only

```bash
npm run test:integration
```

### Coverage Report

```bash
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
cd website
npx playwright test

# Run in headed mode
npx playwright test --headed

# Run specific test
npx playwright test configurator.spec.ts
```

---

## 11. Test Organization Guidelines

### When to Use describe()

```javascript
// ✅ GOOD: Group related tests
describe("registry", () => {
  describe("validateTemplateMetadata", () => {
    test("accepts valid metadata", ...)
    test("rejects missing id", ...)
    test("rejects missing name", ...)
  })

  describe("searchTemplates", () => {
    test("filters by id", ...)
    test("filters by name", ...)
  })
})

// ✅ ALSO GOOD: Simple tests without describe
test("registry: validateTemplateMetadata accepts valid metadata", ...)
test("registry: validateTemplateMetadata rejects missing id", ...)
```

### Test Independence

Each test should be independent and not rely on other tests:

```javascript
// ❌ BAD: Tests depend on each other
let sharedState

test("first test sets state", () => {
  sharedState = "value"
})

test("second test uses state", () => {
  assert.strictEqual(sharedState, "value") // Fails if first test doesn't run
})

// ✅ GOOD: Each test is independent
test("first test", () => {
  const state = "value"
  assert.strictEqual(state, "value")
})

test("second test", () => {
  const state = "value"
  assert.strictEqual(state, "value")
})
```

---

## 12. Common Patterns

### Testing for Existence

```javascript
test("file exists", () => {
  assert.ok(fs.existsSync(filePath))
})

test("function is exported", async () => {
  const module = await import("./module.mjs")
  assert.ok(module.functionName)
  assert.strictEqual(typeof module.functionName, "function")
})
```

### Testing Validation

```javascript
test("validates required fields", () => {
  const result = validateMetadata({ name: "test" })
  assert.strictEqual(result.valid, false)
  assert.ok(result.errors.some(e => e.includes("id")))
})
```

### Testing Filtering/Sorting

```javascript
test("filters by category", () => {
  const templates = [
    { id: "a", category: "SaaS" },
    { id: "b", category: "Blog" }
  ]

  const filtered = filterByCategory(templates, "SaaS")
  assert.strictEqual(filtered.length, 1)
  assert.strictEqual(filtered[0].id, "a")
})

test("sorts by name", () => {
  const items = [
    { name: "Charlie" },
    { name: "Alice" },
    { name: "Bob" }
  ]

  const sorted = sortByName(items)
  assert.strictEqual(sorted[0].name, "Alice")
  assert.strictEqual(sorted[1].name, "Bob")
  assert.strictEqual(sorted[2].name, "Charlie")
})
```

### Testing Error Messages

```javascript
test("provides helpful error message", () => {
  assert.throws(
    () => functionName(null),
    {
      name: "Error",
      message: /Invalid input: expected.*but got null/
    }
  )
})
```

---

## 13. What NOT to Test

### Avoid Over-Testing

- **Don't test third-party libraries**: Trust that dependencies work
- **Don't test implementation details**: Test behavior, not internals
- **Don't test trivial getters/setters**: Only test complex logic
- **Don't duplicate tests**: One test per behavior

### Example

```javascript
// ❌ BAD: Testing trivial getter
test("getName returns name", () => {
  const obj = { name: "test" }
  assert.strictEqual(obj.name, "test") // This is trivial
})

// ✅ GOOD: Testing meaningful behavior
test("getDisplayName formats name correctly", () => {
  const user = { firstName: "John", lastName: "Doe" }
  assert.strictEqual(getDisplayName(user), "John Doe")
})
```

---

## 14. Debugging Tests

### Run Single Test

```bash
node --test tests/cli/version.test.mjs
```

### Add Debug Output

```javascript
test("debugs with console", () => {
  const result = complexFunction()
  console.log("Result:", result) // Temporary debug output
  assert.ok(result)
})
```

### Use --inspect

```bash
node --inspect --test tests/cli/version.test.mjs
```

---

## 15. Pre-Commit Checklist

Before committing:

- [ ] All tests pass: `npm test`
- [ ] Coverage meets minimum: `npm run test:coverage`
- [ ] New features have tests
- [ ] Tests are independent and isolated
- [ ] Test names are clear and descriptive
- [ ] No console.log left in test code
- [ ] Fixtures are minimal and documented

---

## 16. Style Guide

### Import Order

```javascript
// 1. Node.js built-ins
import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

// 2. Project modules
import { functionName } from "../src/dd/module.mjs"

// 3. Test utilities
import { assertValidTemplate } from "./utils/assertions.mjs"
```

### Formatting

- **No semicolons** in .mjs test files
- **2-space indentation**
- **Double quotes** for strings
- **Consistent naming**: camelCase for variables/functions

---

## 17. Common Pitfalls

### Pitfall 1: Not Cleaning Up

```javascript
// ❌ BAD: Leaves files behind
test("creates temp file", () => {
  const tempFile = "/tmp/test-file"
  fs.writeFileSync(tempFile, "data")
  assert.ok(fs.existsSync(tempFile))
  // No cleanup!
})

// ✅ GOOD: Cleans up after test
test("creates temp file", () => {
  const tempFile = "/tmp/test-file"
  try {
    fs.writeFileSync(tempFile, "data")
    assert.ok(fs.existsSync(tempFile))
  } finally {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile)
    }
  }
})
```

### Pitfall 2: Testing Multiple Things

```javascript
// ❌ BAD: Tests multiple behaviors
test("validates and transforms data", () => {
  const result = processData(input)
  assert.ok(result.valid) // Testing validation
  assert.strictEqual(result.transformed, expected) // Testing transformation
})

// ✅ GOOD: Separate tests
test("validates data correctly", () => {
  const result = processData(input)
  assert.ok(result.valid)
})

test("transforms data correctly", () => {
  const result = processData(input)
  assert.strictEqual(result.transformed, expected)
})
```

### Pitfall 3: Flaky Tests

```javascript
// ❌ BAD: Depends on timing
test("processes async operation", async () => {
  startAsyncOperation()
  await new Promise(resolve => setTimeout(resolve, 100)) // Arbitrary delay
  assert.ok(isComplete())
})

// ✅ GOOD: Wait for actual completion
test("processes async operation", async () => {
  const promise = startAsyncOperation()
  await promise
  assert.ok(isComplete())
})
```

---

## Summary

- Use Node.js test runner for unit/integration tests
- Use Playwright for E2E tests
- Follow AAA pattern (Arrange-Act-Assert)
- Write clear, descriptive test names
- Keep tests independent and isolated
- Use fixtures for complex test data
- Aim for 80%+ coverage
- Run `npm test` before committing
- Use custom assertions from `tests/utils/assertions.mjs`
- Clean up after tests (files, env vars, etc.)
- **Async patterns clear**: Use `await` for async tests, `assert.rejects()` for errors, `Promise.all()` for parallel ops

---

*For more context on the project structure, see AGENT_CONTEXT.md and FRAMEWORK_MAP.md.*
