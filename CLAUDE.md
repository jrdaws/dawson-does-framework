# CLAUDE.md - Automatic Context for Claude Code CLI

> **This file is automatically read by Claude Code CLI when starting a session in this project.**

## 🛑 MANDATORY FIRST STEPS (4 Steps)

Before responding to ANY prompt or doing ANY work, you MUST complete ALL steps:

### Step 1: Read Governing Documents
```bash
cat AGENT_CONTEXT.md
```

### Step 2: Self-Identify Your Role

Based on your assigned task, identify which role applies:

| If task involves... | Your Role |
|---------------------|-----------|
| CLI, bin/framework.js, src/dd/ | **CLI Agent** |
| Website UI, Next.js pages | **Website Agent** |
| Template creation, template.json | **Template Agent** |
| Integrations, auth, payments | **Integration Agent** |
| Documentation, README, guides | **Documentation Agent** |
| Tests, E2E, coverage | **Testing Agent** |
| APIs, preview, deploy, cloud | **Platform Agent** |

**Announce your role:**
```markdown
## Role Identification
**Assigned Role**: [ROLE_NAME] Agent
**Reason**: [Why this role applies]
```

### Step 3: Load Your Role Memory
```bash
cat prompts/agents/roles/[ROLE]_AGENT.md
cat prompts/agents/memory/[ROLE]_MEMORY.md
```

**Establish continuity:**
```markdown
## Session Continuity
**Previous Session**: [Date from memory file]
**Last Action**: [What was done]
**Picking Up From**: [Current state]
```

### Step 4: Confirm Understanding
State:
- The project's core philosophy (export-first, zero lock-in)
- The coding standards for your role
- What you should NOT do
- Your current priorities from the memory file

**Only then proceed** with the user's request.

If you skip these steps, your work may be rejected for not following project standards.

---

## Project: Dawson-Does Framework

A hybrid platform for building web apps with a visual configurator, then exporting to full local ownership.

### Core Philosophy
1. **Export-First** - Everything designed for local ownership
2. **Zero Lock-In** - Platform is optional after export
3. **Cursor-Native** - Optimized for Claude + Cursor workflow
4. **Transparency** - No magic, explicit complexity
5. **Fail Gracefully** - Helpful errors with recovery guidance

### Quick Reference

| Area | Location | Language |
|------|----------|----------|
| CLI | `bin/framework.js` | JavaScript ESM |
| Core modules | `src/dd/*.mjs` | JavaScript ESM |
| Website | `website/` | TypeScript + Next.js 15 |
| Templates | `templates/` | TypeScript + Next.js |
| Packages | `packages/` | TypeScript |

### Coding Standards
- **JavaScript (.mjs)**: No semicolons, 2-space indent
- **TypeScript (.ts/.tsx)**: Semicolons, 2-space indent
- **Commits**: Conventional format (`feat:`, `fix:`, `docs:`, `chore:`)
- **Tests**: Run `npm test` before committing

### Key Commands
```bash
npm test                    # Run tests
npm run lint                # Check linting
framework doctor .          # Health check
framework export saas ./app # Export template
framework pull <token>      # Pull from platform
```

### What NOT To Do
- ❌ Add features not requested
- ❌ Refactor unrelated code
- ❌ Change shared configs without coordination
- ❌ Skip reading AGENT_CONTEXT.md
- ❌ Commit .env files or secrets
- ❌ Use console.log for debugging (use logger.mjs)

### Important Files
- `AGENT_CONTEXT.md` - Full context (READ THIS)
- `FRAMEWORK_MAP.md` - Architecture and dependencies
- `.cursorrules` - Cursor-specific rules
- `bin/framework.js` - Main CLI entry point

---

## Verification Checkpoint

Before starting work, confirm you can answer:

1. What is the export-first philosophy?
2. What language/style is used for CLI code?
3. What command runs tests?
4. What should you NOT do?

If you cannot answer these, re-read AGENT_CONTEXT.md.

---

## 📋 Response Rules (MANDATORY)

### Before Ending: Update Your Memory File

**CRITICAL**: Before providing your final response, you MUST update your role's memory file:

```bash
# Edit: prompts/agents/memory/[ROLE]_MEMORY.md
```

Add:
1. **Session entry** in Session History table
2. **Decisions** you made with reasoning
3. **Updated tasks** (mark completed, add new)
4. **New issues** discovered
5. **Insights** for the next agent

### Final Response Format

**Your FINAL response MUST end with these four sections:**

### 1. Memory Updated Confirmation
```markdown
## 📝 Memory Updated
- Added session entry: [brief description]
- Updated tasks: [what changed]
- New insights added: [if any]
```

### 2. Summary of Achievements
```markdown
## ✅ Summary of Achievements
- [What was completed]
- [Files created/modified]
- [Test status]
```

### 3. Suggestions
```markdown
## 💡 Suggestions
- [Immediate improvements]
- [Future considerations]
```

### 4. Continuation Prompt
```markdown
## 🚀 Next Steps Prompt
[Ready-to-use expert-level prompt for continuing the work]
[Include role assignment and priority tasks]
```

**NEVER end abruptly. ALWAYS:**
- Update your memory file first
- Confirm the update
- Provide summary, suggestions, and continuation prompt

---

*This file is loaded automatically by Claude Code CLI. For full context, see AGENT_CONTEXT.md.*

