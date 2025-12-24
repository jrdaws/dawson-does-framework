# Session Checkpoint SOP

> **Version**: 1.0.0 | **Last Updated**: 2025-12-24
> 
> **Purpose**: Ensure agents periodically offload progress to the framework during long sessions
> **Audience**: All agents
> **Principle**: "If it's not committed, it doesn't exist"

---

## Table of Contents

1. [Overview](#1-overview)
2. [Checkpoint Triggers](#2-checkpoint-triggers)
3. [What to Offload](#3-what-to-offload)
4. [Checkpoint Format](#4-checkpoint-format)
5. [Offload Locations](#5-offload-locations)
6. [Examples](#6-examples)

---

## 1. Overview

### Problem

- Long chat sessions accumulate important information
- Crashes or disconnects can lose valuable progress
- Other agents can't see updates until session ends
- User has no visibility into what's been "saved"

### Solution

Periodic checkpoints where agents:
1. Commit code changes to git
2. Update shared state files (MINDFRAME.md)
3. Note progress in memory files
4. Output a clear checkpoint indicator

### Benefit

- **Persistence**: Work is saved incrementally
- **Visibility**: User knows what's been offloaded
- **Collaboration**: Other agents can see progress
- **Recovery**: Crashes don't lose significant work

---

## 2. Checkpoint Triggers

### Mandatory Triggers (MUST checkpoint)

| Trigger | Reason |
|---------|--------|
| **After completing a significant task** | Preserve the work |
| **After creating 3+ files** | Batch commit |
| **After making decisions affecting other agents** | Shared visibility |
| **After updating SOPs or governance** | Critical changes |
| **Before any destructive operation** | Safety checkpoint |
| **Before ending session** | Final state capture |

### Recommended Triggers (SHOULD checkpoint)

| Trigger | Reason |
|---------|--------|
| **Every 15-20 minutes of active work** | Regular saves |
| **When context is getting long (50+ exchanges)** | Memory management |
| **After discovering important information** | Knowledge capture |
| **After resolving a complex problem** | Solution preservation |
| **When switching between major tasks** | Clean transitions |

### Time-Based Guideline

```
0-15 min:  Work freely
15-20 min: Consider checkpoint
20-30 min: Checkpoint recommended
30+ min:   Checkpoint required
```

---

## 3. What to Offload

### Category Matrix

| Category | File Location | Update Frequency |
|----------|--------------|------------------|
| **Code Changes** | Git commit | Every checkpoint |
| **Decisions Made** | Memory file | Every checkpoint |
| **Discoveries** | MINDFRAME.md | When significant |
| **SOPs Identified** | sop-opportunities.md | When observed |
| **Certifications** | MINDFRAME.md | When earned |
| **Task Progress** | Outbox file | When complete |
| **Blockers** | PROJECT_PRIORITIES.md | Immediately |
| **New Tasks** | PROJECT_PRIORITIES.md | When identified |

### What NOT to Offload Mid-Session

- Incomplete code (commit only working code)
- Speculative decisions (wait for confirmation)
- Trivial changes (batch with significant ones)

---

## 4. Checkpoint Format

### Standard Checkpoint Block

```markdown
## 📦 Checkpoint [HH:MM]

### Offloaded:
- ✅ [file/change 1]
- ✅ [file/change 2]
- ✅ [file/change 3]

### Committed:
`[hash] [message]`

### Updated:
- **MINDFRAME**: [section] → [new value]
- **Memory**: [what noted]

### In Progress:
- [remaining task 1]
- [remaining task 2]

---
```

### Minimal Checkpoint (for small updates)

```markdown
## 📦 Checkpoint [HH:MM]
Committed: `[hash] [message]`
Updated: [file] with [change]

---
```

---

## 5. Offload Locations

### Quick Reference

| What | Where |
|------|-------|
| Code changes | `git commit` |
| Project state | `output/shared/MINDFRAME.md` |
| My notes | `prompts/agents/memory/[ROLE]_MEMORY.md` |
| Tasks | `output/shared/PROJECT_PRIORITIES.md` |
| SOP ideas | `output/media-pipeline/quality-agent/workspace/sop-opportunities.md` |
| Handoffs | `output/[agent]/inbox/` |
| Completed work | `output/[my-role]/outbox/` |

---

## 6. Examples

### Example 1: Code Implementation Checkpoint

```markdown
## 📦 Checkpoint 14:35

### Offloaded:
- ✅ Created ConfiguratorSidebar.tsx (new component)
- ✅ Added 24 SVG icons to public/icons/sidebar/
- ✅ Updated IntegrationSelector.tsx (icon imports)

### Committed:
`a1b2c3d feat(website): add sidebar navigation component with icons`

### Updated:
- **MINDFRAME**: Website section → "Sidebar component added"
- **Memory**: Noted icon naming convention used

### In Progress:
- Wire up navigation state
- Add keyboard shortcuts

---
```

### Example 2: Minimal Checkpoint

```markdown
## 📦 Checkpoint 11:45
Committed: `e5f6g7h fix(website): correct sidebar icon paths`
Updated: Fixed 3 broken icon imports

---
```

---

## Commands for Checkpoints

### Quick Commit

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework && git add -A && git commit -m "[type]([scope]): [description]"
```

### Update MINDFRAME Certification

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework && ./scripts/certify.sh [ROLE] "[Area]" "[Status]" "[vibe]" "[notes]"
```

---

## Related Documents

- [AGENT_POLICIES.md](../../prompts/agents/AGENT_POLICIES.md) - Session protocols
- [MINDFRAME.md](../../output/shared/MINDFRAME.md) - Shared state

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-24 | DOC Agent | Initial creation |
