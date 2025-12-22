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
| 2024-12-22 | 45min | CLI-002 | Added agent-prompt command with --role and --task flags for generating bootstrap prompts |
| 2024-12-22 | 20min | CLI-003 | Discovered deploy command already complete, added to help text and updated memory |
| 2024-12-22 | 25min | CLI-004 | Added comprehensive tests for deploy command (24 tests) covering cmdDeploy and cmdDeployAuth |
| 2024-12-22 | 120min | CLI-005 | MAJOR: Added --no-git and --template-version to pull; Enhanced help text; Updated README; Created 45 API mock tests; Implemented full framework init command with --cursor, --force, --no-git flags; All 526 tests passing |
| 2024-12-22 | 20min | CLI-006 | Added comprehensive tests for init command (19 tests) covering all flags, project detection, and Cursor file generation |

---

## 💡 Key Decisions

| Decision | Reasoning | Date |
|----------|-----------|------|
| Use degit for templates | Avoids full git history, faster downloads | 2024-12-19 |
| ESM over CJS | Modern Node.js, better tree-shaking | 2024-12-19 |
| Add comprehensive tests for cursorrules | No unit tests existed for generateCursorRules/generateStartPrompt - added 29 tests | 2024-12-22 |
| Output agent-prompt to stdout | Allows easy copy-paste into AI platforms, avoids file management | 2024-12-22 |
| Extract only key sections from memory | Full memory too verbose, focus on recent sessions, queue, issues | 2024-12-22 |
| Deploy command was already complete | Previous agents implemented full deploy system, just needed help text update | 2024-12-22 |
| Test deploy without real API calls | Deploy tests use CLI output validation, no mocking needed for command-level tests | 2024-12-22 |
| Add --no-git flag to pull | Allows users to skip git commit amendments while still benefiting from export's git init | 2024-12-22 |
| Add --template-version flag to pull | Maps to existing --framework-version flag in export for version control | 2024-12-22 |
| Implement framework init as standalone | Allows initializing existing projects without starting from template | 2024-12-22 |
| Create separate init.mjs module | Keeps init logic modular and testable, follows existing src/dd/ pattern | 2024-12-22 |
| Init detects project type via package.json | Smart defaults based on Next.js, React, TypeScript detection | 2024-12-22 |

---

## 🔍 Active Context

### Current State
- ✅ Export command working
- ✅ Demo command working
- ✅ Doctor/drift commands working
- ✅ Pull command ENHANCED with --no-git and --template-version flags
- ✅ Pull command with --cursor flag COMPLETE
- ✅ .cursorrules and START_PROMPT.md generation working
- ✅ Comprehensive tests for pull (29 unit + 11 integration + 20 API mock = 60 tests)
- ✅ Agent-prompt command COMPLETE (generates bootstrap prompts)
- ✅ Deploy command COMPLETE (Vercel, Netlify, Railway support)
- ✅ Deploy:auth credential management COMPLETE
- ✅ Init command COMPLETE (initialize existing projects with framework tooling)
- ✅ All 526 tests passing

### In Progress
- None

### Blocked
- None currently

---

## 📋 Task Queue

### High Priority
- [x] Complete `framework pull --cursor` with .cursorrules generation
- [x] Implement `framework deploy` with Vercel support
- [x] Add `framework init` for existing projects
- [x] Add pull command new flags (--no-git, --template-version)
- [x] Improve help text and documentation

### Medium Priority
- [ ] Improve error recovery guidance
- [x] Add tests for init command

### Low Priority
- [ ] Add `framework preview` for local preview server
- [ ] Add `framework sync` for GitHub bidirectional sync

---

## 🐛 Known Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| Some exit codes wrong | Medium | Error cases don't always exit(1) |
| Deploy command not in help | FIXED | Added in CLI-003 |

---

## 💭 Insights for Next Agent

1. **Command Structure**: All commands follow same pattern - see `cmdExport` as reference
2. **Flag Parsing**: Use `parseExportFlags` pattern for consistency
3. **Step Logging**: Use `logger.startStep/stepSuccess/endStep` for user feedback
4. **Error Format**: Always include recovery guidance in error messages
5. **Testing**: Run `npm test` before committing - tests in `tests/`
6. **Pull --cursor**: Already fully implemented in lines 1485-1499 of framework.js
7. **Test Coverage**: Always check if functions have tests before assuming they're incomplete
8. **Agent-prompt**: New command at line 1086, uses extractSection helper to parse memory files
9. **Dispatcher Pattern**: All commands added around line 1747, use process.argv.slice to get args
10. **Deploy Command**: FULLY implemented at src/commands/deploy.mjs - supports Vercel, Netlify, Railway
11. **Always Check Implementation**: Memory can be outdated - verify files exist before assuming work needed
12. **Deploy Tests**: 24 tests in tests/cli/deploy.test.mjs cover help, flags, providers, and credential management
13. **Pull Flags Enhanced**: --no-git skips git amendments, --template-version maps to --framework-version in export
14. **Init Command**: Full implementation at src/dd/init.mjs with cmdInit in framework.js:1048-1258
15. **Init Features**: Detects project type, creates .dd structure, generates Cursor files, optional git init
16. **API Mock Tests**: Created comprehensive test suite (tests/cli/pull-api-mock.test.mjs) with 20 scenarios
17. **Test Count**: Pull command now has 60 total tests (29 unit + 11 integration + 20 API mock)
18. **Init Tests**: 19 comprehensive tests in tests/cli/init.test.mjs cover all init functionality with temp dir cleanup

---

## 🔗 Related Files

| File | Relevance |
|------|-----------|
| `bin/framework.js` | Main CLI - all commands routed here (~2000 lines, init at 1048) |
| `src/dd/pull.mjs` | Pull command implementation with parsePullFlags |
| `src/dd/init.mjs` | Init command implementation (NEW in CLI-005) |
| `src/dd/cursorrules.mjs` | .cursorrules generation |
| `src/dd/logger.mjs` | Logging utilities |
| `src/dd/manifest.mjs` | Manifest reading/writing |
| `src/commands/deploy.mjs` | Deploy command implementation |
| `tests/export-args.test.mjs` | Flag parsing tests |
| `tests/cli/cursorrules.test.mjs` | Cursorrules generation tests (29 tests) |
| `tests/cli/pull.test.mjs` | Pull command unit tests (29 tests with new flag tests) |
| `tests/cli/pull-integration.test.mjs` | Pull CLI integration tests (11 tests) |
| `tests/cli/pull-api-mock.test.mjs` | Pull API mock tests (NEW in CLI-005, 20 tests) |
| `tests/cli/deploy.test.mjs` | Deploy command tests (24 tests) |
| `tests/cli/init.test.mjs` | Init command tests (NEW in CLI-006, 19 tests) |

---

## ✏️ How to Update This File

At the end of your session, add:

1. **Session Entry**: Date, duration, what you did
2. **Decisions**: Any choices you made and why
3. **Task Updates**: Mark done, add new tasks
4. **Issues**: Any bugs found
5. **Insights**: Tips for the next agent

---

*Last Updated: 2024-12-22 by CLI Agent (Session CLI-006)*

