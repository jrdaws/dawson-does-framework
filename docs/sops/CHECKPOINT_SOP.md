# Checkpoint SOP v2.0

> **Purpose**: Tiered checkpoint system for efficient session management
> **Audience**: All agents | **Maintained By**: Auditor Agent

---

## Tier Overview

| Tier | Trigger | Token Cost | When to Use |
|------|---------|------------|-------------|
| **Light** | `cp light` | ~100 | Quick fixes < 15 min |
| **Standard** | `cp` | ~500 | Normal sessions 15-60 min |
| **Full** | `cp full` | ~2,500 | Major work > 60 min |

**Default**: Standard tier (when just `cp` is used)

---

## Light Checkpoint

**Use for**: Quick fixes, single-file edits, < 15 min sessions

```bash
git add -A && git commit -m "type(scope): desc" && git push origin main
```

**Output**:
```
✅ CHECKPOINT (Light)
Committed: [hash] | Pushed: origin/main
(ROLE AGENT)
```

---

## Standard Checkpoint

**Use for**: Normal sessions, 15-60 minutes, multiple files

### Steps:
1. **Graceful Stop** - Complete current file, find safe stopping point
2. **Test** - `npm test` (if code changed)
3. **Commit** - `git add -A && git commit -m "..." && git push`
4. **Brief Memory** - 5 lines max to memory file

### Memory Entry (Standard):
```markdown
### Session: [DATE]
- **Work**: [1-2 line summary]
- **Files**: [comma-separated list]
- **Duration**: [X] min
- **Next**: [handoff or continue]
```

**Output**:
```
✅ CHECKPOINT (Standard)
| Item | Status |
|------|--------|
| Tests | ✅ [N] passing |
| Committed | ✅ [hash] |
| Memory | ✅ Updated |

(ROLE AGENT)
```

---

## Full Checkpoint

**Use for**: Major work, > 60 min, significant decisions, handoffs

### Steps:
1. **Graceful Stop** - Complete current file
2. **Pre-Check** - `git log --oneline -5` (check for governance changes)
3. **Test** - `npm test`
4. **Stage** - `git add -A && git status` (list all files)
5. **Full Memory** - See `prompts/agents/MEMORY_FORMAT.md` for 5-category template
6. **SOP Scan** - Check for patterns that could become SOPs
7. **Certify** - `./scripts/certify.sh [CODE] [AREA] [STATUS] [VIBE]`
8. **Commit** - Create review request or commit directly
9. **Handoff** - Generate Next Agent Prompt if applicable

### SOP Opportunity Scan:
- Did I repeat a process that could be standardized?
- Did I encounter a problem needing documentation?
- Log to: `output/agents/quality/workspace/sop-opportunities.md`

**Output**:
```
✅ CHECKPOINT (Full)
| Item | Status |
|------|--------|
| Tests | ✅ [N] passing |
| Committed | ✅ [hash] |
| Memory | ✅ Full 5-category |
| Certified | ✅ [area] |
| SOP Scan | ✅ [N] opportunities |

### Session Summary
- Duration: [time]
- Tasks: [count]
- Key Decision: [most important]
- Next: [handoff prompt or continue]

(ROLE AGENT)
```

---

## Graceful Stop Rule

Before any checkpoint tier:
1. Complete quick tasks (< 2 min remaining)
2. Find safe stopping point
3. Complete current file edit
4. No syntax errors left

---

## Quick Reference

| Trigger | What Happens |
|---------|--------------|
| `cp light` | Commit + sign off only |
| `cp` | Test + commit + brief memory |
| `cp full` | All steps + MINDFRAME + SOP scan |
| `checkpoint` | Same as `cp` |

---

## Related Documents

- **Full Memory Template**: `prompts/agents/MEMORY_FORMAT.md`
- **Certification**: `output/shared/MINDFRAME.md`
- **SOP Opportunities**: `output/agents/quality/workspace/sop-opportunities.md`

---

*SOP v2.0 | Tiered Checkpoint System | 2025-12-25*
