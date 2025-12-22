# CLI Agent Memory

> **Persistent memory for CLI Agent sessions. Update this file at the end of EVERY session.**

---

## 🧠 Persistent Context

### Core Responsibilities
- CLI commands in `bin/framework.js`
- Core modules in `src/dd/*.mjs`
- Command implementations in `src/commands/*.mjs`

### Critical Knowledge
- Main entry: `bin/framework.js` (~1200 lines)
- Uses JavaScript ESM, NO semicolons
- Logger: use `src/dd/logger.mjs`, never console.log
- All commands registered in dispatcher at bottom of framework.js

---

## 📅 Session History

| Date | Duration | Session ID | Summary |
|------|----------|------------|---------|
| 2024-12-22 | Initial | Setup | Created memory file, established baseline |
| 2024-12-22 | 30min | CLI-001 | Verified --cursor flag implementation complete, added comprehensive tests |

---

## 💡 Key Decisions

| Decision | Reasoning | Date |
|----------|-----------|------|
| Use degit for templates | Avoids full git history, faster downloads | 2024-12-19 |
| ESM over CJS | Modern Node.js, better tree-shaking | 2024-12-19 |
| Add comprehensive tests for cursorrules | No unit tests existed for generateCursorRules/generateStartPrompt - added 29 tests | 2024-12-22 |

---

## 🔍 Active Context

### Current State
- ✅ Export command working
- ✅ Demo command working
- ✅ Doctor/drift commands working
- ✅ Pull command with --cursor flag COMPLETE
- ✅ .cursorrules and START_PROMPT.md generation working
- ✅ Comprehensive tests for cursorrules (29 tests)
- ❌ Deploy command not started

### In Progress
- None

### Blocked
- None currently

---

## 📋 Task Queue

### High Priority
- [x] Complete `framework pull --cursor` with .cursorrules generation
- [ ] Implement `framework deploy` with Vercel support

### Medium Priority
- [ ] Add `framework init` for existing projects
- [ ] Improve error recovery guidance
- [ ] Add more detailed help text

### Low Priority
- [ ] Add `framework preview` for local preview server
- [ ] Add `framework sync` for GitHub bidirectional sync

---

## 🐛 Known Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| No deploy command | High | Manual deployment required |
| Some exit codes wrong | Medium | Error cases don't always exit(1) |

---

## 💭 Insights for Next Agent

1. **Command Structure**: All commands follow same pattern - see `cmdExport` as reference
2. **Flag Parsing**: Use `parseExportFlags` pattern for consistency
3. **Step Logging**: Use `logger.startStep/stepSuccess/endStep` for user feedback
4. **Error Format**: Always include recovery guidance in error messages
5. **Testing**: Run `npm test` before committing - tests in `tests/`
6. **Pull --cursor**: Already fully implemented in lines 1485-1499 of framework.js
7. **Test Coverage**: Always check if functions have tests before assuming they're incomplete

---

## 🔗 Related Files

| File | Relevance |
|------|-----------|
| `bin/framework.js` | Main CLI - all commands routed here |
| `src/dd/pull.mjs` | Pull command implementation |
| `src/dd/cursorrules.mjs` | .cursorrules generation |
| `src/dd/logger.mjs` | Logging utilities |
| `src/dd/manifest.mjs` | Manifest reading/writing |
| `tests/export-args.test.mjs` | Flag parsing tests |
| `tests/cli/cursorrules.test.mjs` | Cursorrules generation tests (29 tests) |
| `tests/cli/pull.test.mjs` | Pull command tests |
| `tests/cli/pull-integration.test.mjs` | Pull command integration tests |

---

## ✏️ How to Update This File

At the end of your session, add:

1. **Session Entry**: Date, duration, what you did
2. **Decisions**: Any choices you made and why
3. **Task Updates**: Mark done, add new tasks
4. **Issues**: Any bugs found
5. **Insights**: Tips for the next agent

---

*Last Updated: 2024-12-22 by CLI Agent (Session CLI-001)*

