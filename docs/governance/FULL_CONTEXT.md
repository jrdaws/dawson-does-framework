# Full Agent Context (Verbose Reference)

> **Use with `[full]` bootstrap mode only**
> For quick reference, see the trimmed `AGENT_CONTEXT.md`

---

## Mandatory Verification Test (Full Mode Only)

In `[full]` mode, answer these questions in your first response:

1. **Philosophy**: What does "export-first" mean in this project?
2. **Code Style**: What is the semicolon rule for `.mjs` files vs `.ts` files?
3. **Architecture**: Where is the main CLI entry point located?
4. **Forbidden**: Name 3 things you should NOT do.
5. **Process**: What command must you run before committing?

---

## Fenced Output Integrity (CRITICAL)

**All agents MUST follow these rules when outputting code blocks, prompts, or documents.**

### The One Block Rule
1. **ONE BLOCK**: All related content goes in ONE fenced block - NEVER split
2. **NO MID-FENCE BREAKS**: Never close a fence to add explanation, then reopen
3. **COMMENTS OVER INTERRUPTIONS**: If clarification needed, use inline comments inside the fence
4. **PRE-FLIGHT CHECK**: Before closing \`\`\`, verify: "Have I included ALL the requested content?"

### Explanation Placement
- **BEFORE**: Explanations go BEFORE the opening fence
- **AFTER**: Follow-up notes go AFTER the closing fence
- **NEVER BETWEEN**: NOTHING goes between multiple fences that should be one

### Pre-Output Verification
Before outputting fenced content:
- [ ] Is this ONE continuous block?
- [ ] Does it contain EVERYTHING requested?
- [ ] Am I about to break out of the fence? (DON'T - use comments instead)

### If Content Is Too Long
1. **SAY SO EXPLICITLY** - Don't silently split
2. **ASK FIRST** - Get user confirmation before splitting
3. **LOGICAL BOUNDARIES** - If splitting, use natural boundaries (by file, by section)

---

## Git Branch Policy

**All AI agents MUST work on `main` branch only.**

Why:
- Prevents branch divergence and lost work
- Keeps memory files in sync across agents
- Avoids complex merge conflicts
- Changes are immediately visible to all agents

Rules:
1. **Never create feature branches** (humans do that)
2. **Commit frequently** (after each significant change)
3. **Pull before starting**: `git pull origin main`
4. **Push after committing**: `git push origin main`

---

## Commit Checkpoint Policy

**Commit every 15-20 minutes or after any significant change.**

Commit when:
- ✅ Completing any task in the task queue
- ✅ Updating memory files
- ✅ Creating or modifying 3+ files
- ✅ Before ending session (ALWAYS)

Commit message format:
```
<type>(<scope>): <description>

Types: feat, fix, docs, chore, test, refactor
Example: docs(agents): update CLI memory with session notes
```

---

## Check for Active Agents (Anti-Collision)

Before starting work, check if other agents might be active:

```bash
# 1. Check recent commits (last 10 minutes = potential active agent)
git log --oneline --since="10 minutes ago"

# 2. Check for uncommitted changes
git status

# 3. Check terminal files (Cursor-specific)
ls -la ~/.cursor/projects/*/terminals/
```

**If you detect another agent may be active:**
- Coordinate tasks to avoid overlap
- Focus on different files/areas
- Commit and push frequently

---

## Scripts for Agents

### Session Management
| Script | Usage |
|--------|-------|
| `./scripts/agent-session.sh start <role>` | Start session, display memory for continuity |
| `./scripts/agent-session.sh end <role>` | End session, verify memory updated |
| `./scripts/session-token.sh generate <role>` | Generate session token (include in first response) |
| `./scripts/session-token.sh verify <token>` | Verify agent token is correct |

### Lock & Sync
| Script | Usage |
|--------|-------|
| `./scripts/agent-lock.sh acquire <role>` | Acquire workspace lock before starting |
| `./scripts/agent-lock.sh release` | Release lock when done |
| `./scripts/agent-lock.sh status` | Check if workspace is locked |
| `./scripts/git-push-safe.sh` | Push with auto-retry on conflict |

### Validation
| Script | Usage |
|--------|-------|
| `./scripts/validate-agent-work.sh` | Validate agent followed governance rules |
| `./scripts/validate-agent-work.sh --strict` | Strict mode (fail on warnings) |
| `./scripts/install-hooks.sh` | Install git hooks (run once after clone) |

### Auto-Continuation (Multi-Step Tasks)
| Script | Usage |
|--------|-------|
| `./scripts/auto-continue/trigger-continue.sh "AGENT" "prompt" WAIT STEP TOTAL` | Trigger next step |
| `./scripts/auto-continue/check-continue.sh` | Check pending continuation |
| `./scripts/auto-continue/cancel-continue.sh` | Cancel pending continuation |

**When to use**: Tasks with 3+ steps, overnight operation, unattended multi-step work.
**Full docs**: `docs/automation/AUTO_CONTINUE.md`

---

## Full Role Name Table

| Short | Full Name |
|-------|-----------|
| CLI | CLI AGENT |
| WEB | WEBSITE AGENT |
| DOC | DOCUMENTATION AGENT |
| TST | TESTING AGENT |
| PLT | PLATFORM AGENT |
| TPL | TEMPLATE AGENT |
| INT | INTEGRATION AGENT |
| RES | RESEARCH AGENT |
| MED | MEDIA AGENT |
| QUA | QUALITY AGENT |
| AUD | AUDITOR AGENT |
| STR | STRATEGIST AGENT |
| CUR | CURATOR AGENT |

---

## Additional Resources

| Document | Purpose |
|----------|---------|
| `output/shared/MINDFRAME.md` | **Read First** - Shared agent state and certifications |
| `docs/standards/PROMPT_STANDARDS.md` | **Required** - Token-optimized AI prompt writing |
| `docs/standards/API_CONTRACTS.md` | **Required** - Standard API response formats and error handling |
| `docs/standards/CODING_STANDARDS.md` | Code style and conventions |
| `docs/sops/SHADCN_IMPLEMENTATION_SOP.md` | **UI Dev** - shadcn/ui component standards |
| `output/shared/media/COLOR_PHILOSOPHY.md` | **Design** - Brand color guidelines |
| `prompts/agents/UNIVERSAL_BOOTSTRAP.md` | For initializing agents on any platform |
| `prompts/agents/roles/ROLE_PROTOCOL.md` | Agent lifecycle and memory management |
| `prompts/agents/MEMORY_FORMAT.md` | Standard format for memory files (append-only) |
| `docs/CONSOLIDATION_CHECKLIST.md` | Human checklist for daily branch consolidation |
| `.protected-files` | List of files agents must never delete |

---

*Moved from AGENT_CONTEXT.md on 2025-12-25 for token efficiency.*

