# Testing Agent Role

> **Primary Responsibility**: Test coverage - unit tests, integration tests, E2E tests.

---

## 🎯 Role Definition

### Scope
- `tests/` - All CLI and core tests
- `website/tests/` - Website E2E tests
- Test utilities and fixtures
- CI/CD test configuration

### Owns
- Unit test implementation
- Integration test implementation
- E2E test implementation
- Test fixtures and utilities
- Coverage reporting
- CI test pipeline

### Does NOT Own
- Production code (→ respective agents)
- Documentation (→ Documentation Agent)

---

## 📊 Current State

### ✅ Working
- `tests/export-args.test.mjs` - Flag parsing tests
- `tests/manifest.test.mjs` - Manifest tests
- `tests/can.test.mjs` - Capability tests
- Basic test infrastructure with Node.js test runner
- Test fixtures in `tests/fixtures/`

### ⚠️ Needs Work
- Coverage is low (<50%)
- No E2E tests for website
- No integration tests for full flows
- Missing tests for new commands (pull, deploy)

### ❌ Not Started
- Playwright E2E for website
- CI/CD pipeline with GitHub Actions
- Coverage reporting
- Performance benchmarks

---

## 📝 Work Log

| Date | Agent | Action |
|------|-------|--------|
| 2024-12-19 | Initial | Created export-args tests |
| 2024-12-19 | Initial | Created manifest tests |
| 2024-12-19 | Initial | Created capability tests |
| 2024-12-22 | - | *Awaiting next agent* |

---

## 🚨 Active Issues

1. **Low coverage** - Many modules have no tests
2. **No E2E tests** - Website untested
3. **No CI** - Tests don't run on PRs
4. **Flaky tests** - Some tests depend on timing

---

## 📋 Next Priorities

1. **HIGH**: Add tests for `pull` command
2. **HIGH**: Set up Playwright for website E2E
3. **HIGH**: Create GitHub Actions CI workflow
4. **MEDIUM**: Add coverage reporting
5. **MEDIUM**: Test all CLI commands

---

## 🔧 Technical Context

### Test Structure
```
tests/
├── *.test.mjs           # Unit tests
├── cli/                  # CLI command tests
│   └── *.test.mjs
├── integration/          # Integration tests
│   └── *.test.mjs
├── fixtures/             # Test data
│   └── template-mini/
└── utils/                # Test utilities
    └── helpers.mjs

website/tests/
├── *.spec.ts            # Playwright E2E
└── fixtures/            # E2E fixtures
```

### Test Patterns
```javascript
import { test, describe, beforeEach, afterEach } from "node:test"
import assert from "node:assert"

describe("ModuleName", () => {
  describe("functionName", () => {
    test("does expected thing when given valid input", () => {
      // Arrange
      const input = { ... }
      
      // Act
      const result = functionName(input)
      
      // Assert
      assert.strictEqual(result, expected)
    })
  })
})
```

### Commands
```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm run test:coverage      # With coverage
cd website && npx playwright test  # E2E
```

---

## 🚀 Handoff Prompt

**Copy this entire section when starting a new Testing Agent session:**

---

# Testing Agent Session

## 🛑 MANDATORY: Read Context First
```bash
cat AGENT_CONTEXT.md
cat prompts/agents/roles/TESTING_AGENT.md
```

Answer the 5 verification questions from AGENT_CONTEXT.md, then confirm you've read this role file.

## Your Current Mission

Based on the priorities above, your immediate tasks are:

### Task 1: Add Pull Command Tests
Create `tests/cli/pull.test.mjs`:
- Test argument parsing
- Test token validation
- Test flag handling (--cursor, --open)
- Mock API responses

### Task 2: Set Up Playwright E2E
Create `website/tests/`:
- Install Playwright: `npm init playwright@latest`
- Create `configurator.spec.ts` - Test full flow
- Create `export.spec.ts` - Test export options

### Task 3: Create GitHub Actions CI
Create `.github/workflows/test.yml`:
- Run on push and PR
- Run npm test
- Run website tests
- Report coverage

## Files to Create
- `tests/cli/pull.test.mjs`
- `website/tests/configurator.spec.ts`
- `.github/workflows/test.yml`

## Success Criteria
- [ ] Pull command has >80% coverage
- [ ] E2E tests cover configurator happy path
- [ ] CI runs on PRs
- [ ] All tests pass

## When Complete
1. Update this role file with your work log entry
2. Update Current State section
3. Update Next Priorities
4. Commit changes
5. Provide Summary + Suggestions + Continuation Prompt

---

*Last updated: 2024-12-22 by governance setup*

