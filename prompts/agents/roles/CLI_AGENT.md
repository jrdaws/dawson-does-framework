# CLI Agent Role

> **Primary Responsibility**: Core framework CLI development - commands, parsing, output, and core modules.

---

## 🎯 Role Definition

### Scope
- `bin/framework.js` - Main CLI entry point
- `src/dd/*.mjs` - Core framework modules
- `src/commands/*.mjs` - Individual command implementations
- CLI argument parsing, flag handling, output formatting

### Owns
- All CLI commands (export, pull, demo, doctor, drift, etc.)
- Logger system (`src/dd/logger.mjs`)
- Manifest system (`src/dd/manifest.mjs`)
- Version/upgrade system (`src/dd/version.mjs`)
- Plugin system (`src/dd/plugins.mjs`)
- Recovery guidance (`src/dd/recovery-guidance.mjs`)

### Does NOT Own
- Website code (→ Website Agent)
- Template content (→ Template Agent)
- Integration implementations (→ Integration Agent)

---

## 📊 Current State

### ✅ Working
- `framework export <template> <dir>` - Full export flow with git init
- `framework demo` - Quick export for testing
- `framework doctor` - Health checks
- `framework drift` - Template divergence detection
- `framework version` / `framework upgrade` - Version management
- `framework pull <token>` - Pull from platform (basic implementation)
- `framework templates` - Template listing/search
- `framework plugin` - Plugin management

### ⚠️ Needs Work
- `framework pull` - Needs --cursor flag implementation
- `framework deploy` - Not yet implemented
- Error recovery guidance could be more comprehensive
- Help text could be more detailed

### ❌ Not Started
- `framework init` - Initialize existing project
- `framework sync` - Bidirectional GitHub sync
- `framework preview` - Local preview server

---

## 📝 Work Log

| Date | Agent | Action |
|------|-------|--------|
| 2024-12-19 | Initial | Created export, demo, doctor, drift commands |
| 2024-12-19 | Initial | Added plugin system with hooks |
| 2024-12-19 | Initial | Added template registry |
| 2024-12-21 | Agent A | Added pull command basic implementation |
| 2024-12-22 | - | *Awaiting next agent* |

---

## 🚨 Active Issues

1. **Pull command incomplete** - Needs --cursor flag to generate .cursorrules and START_PROMPT.md
2. **No deploy command** - Users have to deploy manually
3. **Exit codes** - Some error cases don't set proper exit codes

---

## 📋 Next Priorities

1. **HIGH**: Complete `framework pull --cursor` with .cursorrules generation
2. **HIGH**: Implement `framework deploy` with Vercel/Railway support
3. **MEDIUM**: Add `framework init` for existing projects
4. **MEDIUM**: Improve error messages with recovery guidance
5. **LOW**: Add `framework preview` for local preview server

---

## 🔧 Technical Context

### File Locations
```
bin/
└── framework.js          # Main entry, command routing (~1200 lines)

src/
├── commands/
│   ├── llm.mjs          # LLM provider commands
│   ├── auth.mjs         # Auth provider commands
│   ├── plugin.mjs       # Plugin management
│   └── templates.mjs    # Template listing/search
└── dd/
    ├── manifest.mjs     # .dd/manifest.json handling
    ├── plugins.mjs      # Plugin loading/execution
    ├── logger.mjs       # Structured logging
    ├── version.mjs      # Version checking
    ├── drift.mjs        # Template drift detection
    ├── pull.mjs         # Pull command logic
    ├── cursorrules.mjs  # .cursorrules generation
    └── recovery-guidance.mjs  # Error recovery
```

### Coding Standards
- JavaScript ESM (.mjs)
- No semicolons
- 2-space indent
- Use logger.mjs, not console.log
- JSDoc comments for public functions

### Key Patterns
```javascript
// Command structure
async function cmdName(restArgs) {
  // 1. Parse flags
  const flags = parseFlags(restArgs)
  
  // 2. Validate
  if (!required) {
    console.error("Usage: ...")
    process.exit(1)
  }
  
  // 3. Execute with step logging
  logger.startStep("step-id", "[1/3] Doing thing...")
  // ... work ...
  logger.stepSuccess("Done")
  logger.endStep("step-id", "     Complete")
  
  // 4. Success output
  console.log("\n✅ Complete!")
}

// Register in dispatcher
if (a === "mycommand") { await cmdName([b, c, d]); process.exit(0); }
```

---

## 🚀 Handoff Prompt

**Copy this entire section when starting a new CLI Agent session:**

---

# CLI Agent Session

## 🛑 MANDATORY: Read Context First
```bash
cat AGENT_CONTEXT.md
cat prompts/agents/roles/CLI_AGENT.md
```

Answer the 5 verification questions from AGENT_CONTEXT.md, then confirm you've read this role file.

## Your Current Mission

Based on the priorities above, your immediate tasks are:

### Task 1: Complete `framework pull --cursor`
- Add `--cursor` flag to pull command in `bin/framework.js`
- When flag is set, generate `.cursorrules` using `src/dd/cursorrules.mjs`
- Generate `START_PROMPT.md` with project context

### Task 2: Add `framework deploy`
- Create deployment engine in `src/dd/deploy.mjs`
- Support Vercel deployment (priority)
- Add to CLI dispatcher

## Files to Modify
- `bin/framework.js` - Add deploy command, enhance pull
- `src/dd/pull.mjs` - Add --cursor flag handling
- `src/dd/deploy.mjs` (new) - Deployment logic

## Success Criteria
- [ ] `framework pull <token> --cursor` generates Cursor files
- [ ] `framework deploy` deploys to Vercel
- [ ] All existing tests still pass
- [ ] Help text updated

## When Complete
1. Update this role file with your work log entry
2. Update Current State section
3. Update Next Priorities
4. Commit changes
5. Provide Summary + Suggestions + Continuation Prompt

---

*Last updated: 2024-12-22 by governance setup*

