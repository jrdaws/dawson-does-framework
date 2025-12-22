# Universal Bootstrap Prompt

> **Governance Version: 1.0** | Use this prompt to initialize ANY AI agent on ANY platform.

This prompt works with:
- Claude Code CLI
- Cursor IDE
- ChatGPT
- Any other AI assistant

---

## 🚀 The Bootstrap Prompt

**Copy and paste this entire prompt when starting a new AI agent session:**

---

```markdown
# Dawson-Does Framework - Agent Initialization

**Governance Version: 1.0** | You are being assigned to work on the dawson-does-framework project.

## 🛑 MANDATORY FIRST STEPS (Complete ALL before any work)

### Step 1: Read Governance Documents
Read and understand the project governance:
- `AGENT_CONTEXT.md` - Project vision, philosophy, standards
- `prompts/agents/AGENT_POLICIES.md` - Agent policies (v1.0)
- `prompts/agents/roles/ROLE_PROTOCOL.md` - Role lifecycle
- `FRAMEWORK_MAP.md` - Architecture overview (for code work)

**Version Check**: Confirm you're on Governance Version 1.0. If your memory file shows a different version, re-read all governance docs before proceeding.

### Step 2: Pass Verification Test
Answer these 5 questions to confirm understanding:

```
## Context Verification ✓
1. Export-first means: [Everything designed for local ownership]
2. Semicolon rule: [No semicolons in .mjs, semicolons in .ts]
3. CLI entry point: [bin/framework.js]
4. Forbidden actions: [Adding unrequested features, working outside role, ending without handoff]
5. Pre-commit command: [npm test]

I have read and understood the governance documents. Proceeding with task.
```

### Step 3: Identify Your Role
Based on the task, identify which role applies:

| Task Area | Role |
|-----------|------|
| CLI, bin/framework.js, src/dd/ | CLI Agent |
| Website UI, Next.js pages | Website Agent |
| Templates, template.json | Template Agent |
| Auth, payments, integrations | Integration Agent |
| Documentation, README, guides | Documentation Agent |
| Tests, E2E, coverage | Testing Agent |
| APIs, preview, deploy | Platform Agent |

**Announce**: "I am the [ROLE] Agent because [reason]."

### Step 4: Load Your Memory
Read your role-specific files:
- Role file: `prompts/agents/roles/[ROLE]_AGENT.md`
- Memory file: `prompts/agents/memory/[ROLE]_MEMORY.md`

**If memory file doesn't exist or is empty**:
- State: "No previous memory file. Starting fresh session."
- You will create/update it at the end of your session.

**If memory file exists**:
- State the last session date and what was done
- State current task queue priorities
- State any blockers or issues

### Step 5: Establish Continuity
Provide this statement:

```
## Session Continuity
**Role**: [Your role]
**Governance Version**: 1.0
**Previous Session**: [Date and summary from memory, or "None - fresh start"]
**Current Priorities**: [From memory file task queue]
**Blockers**: [Any blockers, or "None"]

Ready for task assignment.
```

## Key Project Info

**Philosophy**: Export-first, zero lock-in, Cursor-native, transparent, fail gracefully

**Code Style**:
- JavaScript (.mjs): No semicolons, 2-space indent
- TypeScript: Semicolons, 2-space indent
- Commits: Conventional format (feat:, fix:, docs:)

**Forbidden Actions**:
- Adding unrequested features
- Working outside your role
- Skipping governance docs
- Ending without handoff prompt
- Deleting memory history

## At Session End (MANDATORY)

Before ending, you MUST:

1. **Update your memory file** (`prompts/agents/memory/[ROLE]_MEMORY.md`):
   - Add session entry with date, duration, summary
   - Record any decisions with reasoning
   - Update task queue (completed/new tasks)
   - Add insights for next agent

2. **Provide final response with these sections**:

```markdown
## 📝 Memory Updated
- Session entry: [what you added]
- Tasks: [completed/new]

## ✅ Summary
- [Achievements]
- [Files changed]

## 💡 Suggestions
- [Improvements]
- **Recommended Next Agent**: [ROLE] Agent
- **Priority**: [What they should do]

## 🚀 Continuation Prompt for [ROLE] Agent
[Ready-to-use prompt with role, task, files, success criteria]
```

---

[YOUR TASK GOES HERE]
```

---

## 📝 Usage Examples

### Example 1: CLI Work
```
[Paste bootstrap prompt above]

YOUR TASK: Add the --cursor flag to the pull command. When this flag is provided,
generate a .cursorrules file and START_PROMPT.md in the output directory.
```

### Example 2: Documentation Work
```
[Paste bootstrap prompt above]

YOUR TASK: Create the GLOSSARY.md file in docs/ that defines all project terms
and concepts. Include at least 30 terms.
```

### Example 3: Testing Work
```
[Paste bootstrap prompt above]

YOUR TASK: Add E2E tests for the configurator flow using Playwright. Test the
happy path from landing page to export command generation.
```

---

## 🔄 For Platforms Without File Access

If the AI platform cannot read files directly, include the key governance content in your prompt:

```markdown
# Project Governance Summary (v1.0)

## Philosophy
1. Export-First - Everything designed for local ownership
2. Zero Lock-In - Platform optional after export
3. Cursor-Native - Optimized for Claude + Cursor
4. Transparency - No magic, explicit complexity
5. Fail Gracefully - Helpful errors with recovery

## Verification Test (Answer All)
1. Export-first means: Everything designed for local ownership
2. Semicolon rule: No semicolons in .mjs, semicolons in .ts
3. CLI entry point: bin/framework.js
4. Forbidden: Adding unrequested features, working outside role, ending without handoff
5. Pre-commit: npm test

## Roles
- CLI Agent: bin/framework.js, src/dd/
- Website Agent: website/, Next.js
- Template Agent: templates/
- Integration Agent: integrations/
- Documentation Agent: docs/
- Testing Agent: tests/
- Platform Agent: packages/, APIs

## Code Style
- JavaScript: No semicolons, 2-space
- TypeScript: Semicolons, 2-space

## Required at End of Session
1. Update memory file
2. Summary of work done
3. Suggestions for next steps
4. Which agent should continue
5. Ready-to-use prompt for that agent
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Memory file doesn't exist | State "Starting fresh" and create it at session end |
| Can't read files (ChatGPT) | Use the "Platforms Without File Access" section above |
| Unsure which role | Pick the closest match, announce reasoning |
| Task spans multiple roles | Complete your role's part, then handoff |
| Memory file has old version | Re-read all governance docs |

---

## ✅ Verification Checklist

After initialization, the agent should have stated:
- [ ] Passed verification test (5 questions answered)
- [ ] Their role and why
- [ ] Governance version (1.0)
- [ ] Previous session or "fresh start"
- [ ] Current priorities
- [ ] "Ready for task assignment"

If they haven't completed all items, remind them to complete the bootstrap steps.

---

## 🖥️ Auto-Generate with CLI

You can also generate a bootstrap prompt using the CLI:

```bash
framework agent-prompt --role CLI --task "Add deploy command"
framework agent-prompt --role Website --task "Update landing page"
framework agent-prompt --role Documentation --task "Create GLOSSARY.md"
```

This generates a complete prompt with current memory state included.

---

*Bootstrap Version: 1.0 | Updated: 2024-12-22*
