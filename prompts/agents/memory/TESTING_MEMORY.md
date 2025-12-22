# Testing Agent Memory

> **Persistent memory for Testing Agent sessions. Update this file at the end of EVERY session.**

---

## 🧠 Persistent Context

### Core Responsibilities
- Tests in `tests/`
- Website E2E tests in `website/tests/`
- Test utilities and fixtures
- CI/CD pipeline
- Coverage reporting

### Critical Knowledge
- Use Node.js test runner (`node:test`)
- Tests use `.test.mjs` extension
- E2E uses Playwright
- Run `npm test` before committing

---

## 📅 Session History

| Date | Duration | Session ID | Summary |
|------|----------|------------|---------|
| 2024-12-22 | Initial | Setup | Created memory file, established baseline |
| | | | *Add your session here* |

---

## 💡 Key Decisions

| Decision | Reasoning | Date |
|----------|-----------|------|
| Node.js test runner | Built-in, no dependencies | 2024-12-19 |
| Playwright for E2E | Industry standard, cross-browser | 2024-12-22 |
| | *Add your decisions here* | |

---

## 🔍 Active Context

### Current State
- ✅ Basic test infrastructure
- ✅ Export args tests
- ✅ Manifest tests
- ✅ Capability tests
- ⚠️ Coverage low (<50%)
- ❌ No E2E tests
- ❌ No CI pipeline
- ❌ Pull command untested

### In Progress
- None currently

### Blocked
- None currently

---

## 📋 Task Queue

### High Priority
- [ ] Add tests for pull command
- [ ] Set up Playwright E2E
- [ ] Create GitHub Actions CI

### Medium Priority
- [ ] Add coverage reporting
- [ ] Test all CLI commands
- [ ] Add integration tests

### Low Priority
- [ ] Performance benchmarks
- [ ] Visual regression tests

---

## 🐛 Known Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| Low coverage | High | Many modules untested |
| No E2E | High | Website untested |
| No CI | High | PRs not auto-tested |
| Flaky tests | Low | Some timing-dependent |

---

## 💭 Insights for Next Agent

1. **Test Pattern**: Arrange-Act-Assert structure
2. **Naming**: `test("does X when Y", ...)` format
3. **Fixtures**: Use `tests/fixtures/` for test data
4. **Mocking**: Use temp directories for file operations
5. **Coverage**: Target 80% for critical paths

---

## 🔗 Related Files

| File | Relevance |
|------|-----------|
| `tests/export-args.test.mjs` | Reference test |
| `tests/manifest.test.mjs` | Reference test |
| `tests/fixtures/` | Test data |
| `package.json` | Test scripts |

---

## ✏️ How to Update This File

At the end of your session, add:

1. **Session Entry**: Date, duration, what you did
2. **Decisions**: Any choices you made and why
3. **Task Updates**: Mark done, add new tasks
4. **Issues**: Any bugs found
5. **Insights**: Tips for the next agent

---

*Last Updated: 2024-12-22 by governance setup*

