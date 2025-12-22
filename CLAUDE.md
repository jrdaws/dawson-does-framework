# CLAUDE.md - Automatic Context for Claude Code CLI

> **Governance Version: 1.0** | This file is automatically read by Claude Code CLI.

---

## 🛑 MANDATORY: 4-Step Initialization

Complete ALL steps before responding to any prompt:

### Step 1: Read Governance
```bash
cat AGENT_CONTEXT.md
```

### Step 2: Self-Identify Your Role

| Task Involves | Your Role |
|---------------|-----------|
| CLI, bin/framework.js, src/dd/ | **CLI Agent** |
| Website UI, Next.js pages | **Website Agent** |
| Templates, template.json | **Template Agent** |
| Auth, payments, integrations | **Integration Agent** |
| Documentation, README, guides | **Documentation Agent** |
| Tests, E2E, coverage | **Testing Agent** |
| APIs, preview, deploy, cloud | **Platform Agent** |

**Announce:** `"I am the [ROLE] Agent because [reason]."`

### Step 3: Load Memory
```bash
cat prompts/agents/roles/[ROLE]_AGENT.md
cat prompts/agents/memory/[ROLE]_MEMORY.md
```

### Step 4: Establish Continuity

State from your memory file:
- Previous session date and action
- Current priorities
- What you will NOT do

**Then proceed** with the user's request.

---

## Quick Reference

| Area | Location | Style |
|------|----------|-------|
| CLI | `bin/framework.js`, `src/dd/*.mjs` | JS ESM, no semicolons |
| Website | `website/` | TypeScript, semicolons |
| Templates | `templates/` | TypeScript, semicolons |
| Docs | `docs/`, `prompts/` | Markdown |

**Philosophy:** Export-first · Zero lock-in · Cursor-native · Transparent · Fail gracefully

**Commands:** `npm test` · `npm run lint` · `framework doctor .`

---

## 📋 Session End Protocol (MANDATORY)

### 1. Update Memory File
Edit `prompts/agents/memory/[ROLE]_MEMORY.md`:
- Add session entry (date, duration, summary)
- Record decisions with reasoning
- Update task queue
- Add insights for next agent

### 2. Final Response Format

Your response MUST end with these 4 sections:

```markdown
## 📝 Memory Updated
- Session entry: [what you added]
- Tasks updated: [completed/new]

## ✅ Summary
- [Achievements]
- [Files modified]

## 💡 Suggestions
- [Improvements]
- **Recommended Next Agent**: [ROLE] Agent
- **Priority**: [What they should do]

## 🚀 Continuation Prompt
[Ready-to-use expert prompt for the recommended agent, including:
- Role identification
- Task assignment
- Files to modify
- Success criteria]
```

---

## Important Files

| File | Purpose |
|------|---------|
| `AGENT_CONTEXT.md` | Full project context |
| `prompts/agents/AGENT_POLICIES.md` | Corporate standards |
| `prompts/agents/roles/ROLE_PROTOCOL.md` | Role lifecycle |
| `prompts/agents/memory/[ROLE]_MEMORY.md` | Your persistent memory |

---

## ❌ Forbidden

- Adding unrequested features
- Working outside your role
- Skipping initialization
- Ending without handoff
- Deleting memory history

---

*Version 1.0 | See AGENT_POLICIES.md for full standards*
