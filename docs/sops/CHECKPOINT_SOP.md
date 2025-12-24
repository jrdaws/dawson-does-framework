# Checkpoint SOP

> **Version**: 1.0.0 | **Last Updated**: 2025-12-24
> 
> **Purpose**: Standardize checkpoint process with mandatory memory updates
> **Audience**: All 13 agents
> **Maintained By**: Auditor Agent

---

## Overview

A "checkpoint" is a mid-session or end-session save point. It ensures:
1. Work is committed and pushed
2. Memory is updated for continuity
3. State is certified in MINDFRAME

---

## Checkpoint Trigger

When user says: `checkpoint`, `cp`, `save`, `commit`, or `end session`

**Shorthand:** `cp` = run checkpoint immediately

### Graceful Stop Rule

Before checkpointing, agents MUST:

1. **Complete quick tasks** - If a task is 80%+ done, finish it (< 2 min remaining)
2. **Find a safe stopping point** - Don't leave code in broken state
3. **Document partial work** - Note what's done and what remains
4. **Avoid mid-file edits** - Complete the current file before stopping

**Quick Stop Checklist:**
- [ ] Current file edit complete?
- [ ] No syntax errors introduced?
- [ ] Tests still pass (if applicable)?
- [ ] Clear handoff notes for next agent?

**If task is complex:** State "Stopping at safe point" and explain what was completed vs remaining.

---

## Mandatory Checkpoint Steps

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHECKPOINT PROTOCOL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  0. PRE-CHECK: REVIEW RECENT CHANGES (FIRST!)                   │
│     git log --oneline -5                                        │
│     git diff --name-only HEAD~3                                 │
│     └── Check if governance/SOP files changed                  │
│     └── Re-read if AGENT_POLICIES.md or CHECKPOINT_SOP.md      │
│         were updated since session start                        │
│                                                                  │
│  1. RUN TESTS                                                    │
│     npm test                                                     │
│     └── Must pass before continuing                             │
│                                                                  │
│  2. STAGE FOR AUDITOR REVIEW (do NOT commit directly)           │
│     git add -A                                                   │
│     git status                                                   │
│     └── List all staged files in checkpoint output             │
│     └── Create review request for Auditor Agent                │
│                                                                  │
│  3. UPDATE MEMORY (MANDATORY)                                   │
│     prompts/agents/memory/[ROLE]_MEMORY.md                      │
│     └── Add session entry with required fields                 │
│                                                                  │
│  4. CERTIFY (if significant work)                               │
│     ./scripts/certify.sh [CODE] [AREA] [STATUS] [VIBE] [NOTES] │
│     └── Updates MINDFRAME.md                                    │
│                                                                  │
│  5. SOP OPPORTUNITY SCAN                                        │
│     └── Review chat for repeating patterns/issues              │
│     └── Identify procedures that could become SOPs             │
│     └── Log opportunities to sop-opportunities.md              │
│                                                                  │
│  6. OUTPUT SUMMARY + AUDITOR HANDOFF                            │
│     └── Show checkpoint confirmation to user                   │
│     └── Include any SOP suggestions for review                 │
│     └── Create handoff prompt for Auditor to review & commit   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step 0: Pre-Check Details

Before checkpointing, review files that may affect your process:

```bash
# Check recent commits for governance changes
git log --oneline -5 --all -- prompts/agents/AGENT_POLICIES.md docs/sops/*.md CLAUDE.md

# Check if checkpoint SOP itself was updated
git log -1 --format="%ar" -- docs/sops/CHECKPOINT_SOP.md
```

**If governance files changed since session start**: Re-read before proceeding.

### Step 2: Auditor Review Handoff

Instead of committing directly, agents stage files and create a review request:

```markdown
## Auditor Review Request

**Agent**: [ROLE] Agent
**Date**: [TIMESTAMP]
**Files Staged**: [count]

### Staged Files:
- [file1.ts] - [brief description]
- [file2.md] - [brief description]

### Proposed Commit Message:
`[type]([scope]): [description]`

### Summary:
[What was done and why]

### Ready for commit: ✅ Yes / ⏳ Needs review
```

Save to: `output/agents/auditor/inbox/REVIEW-[date]-[agent].txt`

---

### Step 5: SOP Opportunity Scan

During every checkpoint, agents MUST review the current session for patterns that could become SOPs:

**Questions to Ask:**

1. Did I encounter a problem that required a workaround?
2. Did I have to look something up that should be documented?
3. Did I repeat a process that could be standardized?
4. Did the user request something that other users might want?
5. Was there confusion that a clear procedure could prevent?

**If YES to any, create an SOP Opportunity:**

```markdown
### SOP Opportunity Identified

**Pattern**: [What happened]
**Count**: [How many times - 1 if first occurrence]
**Potential SOP**: [Suggested name]
**Description**: [What the SOP would cover]
**Priority**: [P1-P4 based on impact/frequency]
```

**Log to**: `output/agents/quality/workspace/sop-opportunities.md`

**Escalation Threshold**: When count reaches 3+, create formal SOP proposal.

**Include in Checkpoint Output:**

```markdown
### SOP Opportunities This Session:
| Pattern | Count | Suggested SOP | Priority |
|---------|-------|---------------|----------|
| [pattern] | [n] | [name] | P[1-4] |
```

If no opportunities identified, state: "No SOP opportunities identified this session."

---

## Memory Update Requirements

### The 5 Distillation Categories

Every checkpoint MUST capture insights from these 5 categories:

| # | Category | What to Save | When | Required? |
|---|----------|--------------|------|-----------|
| 1 | **Operational** | Tasks, decisions, files changed | Every session | ✅ ALWAYS |
| 2 | **Patterns** | Recurring errors, common questions | When count ≥2 | 🟡 If applicable |
| 3 | **Insights** | Commands, gotchas, workarounds | When novel | 🟡 If applicable |
| 4 | **Metrics** | Duration, task count, errors | Every session | ✅ ALWAYS |
| 5 | **Relationships** | Handoffs, agent coordination | When new | 🟡 If applicable |

### Mandatory Session Entry Template

```markdown
### Session: [DATE] [TIME] ([Brief Label])

## 📋 OPERATIONAL (Required)
#### Work Completed
- [Task 1]
- [Task 2]

#### Key Decisions
- [Decision]: [Reasoning]

#### Files Changed
- [file1.ts] - [what changed]
- [file2.md] - [what changed]

#### Blockers/Issues
- [Issue or "None"]

## 📊 METRICS (Required)
- **Duration**: [X] minutes
- **Tasks Completed**: [N]
- **Errors Encountered**: [N]

## 🔄 PATTERNS (If applicable - when count ≥2)
#### Recurring Issues
- [Issue seen multiple times]: [Count]

#### Common Questions
- [Question asked repeatedly]

## 💡 INSIGHTS (If applicable - when novel)
#### Useful Commands Discovered
- `[command]`: [what it does]

#### Gotchas/Workarounds
- [Problem]: [Solution]

## 🤝 RELATIONSHIPS (If applicable - when new)
#### Agent Handoffs
- From [Agent] → To [Agent]: [Topic]

#### Dependencies Discovered
- [File/Component] depends on [Other]
```

### Quick Capture Checklist

Before completing checkpoint, mentally run through:

```
□ OPERATIONAL: What did I do? What did I decide? What files?
□ METRICS: How long? How many tasks? Any errors?
□ PATTERNS: Did I see this issue before? Is this a repeat question?
□ INSIGHTS: Did I learn something useful? Any gotchas?
□ RELATIONSHIPS: Did I hand off to another agent? New dependencies?
```

---

## Cumulative Memory Sections

In addition to session entries, memory files should have these **persistent sections** that accumulate over time:

### 🔧 Quick Reference Section

Useful commands and file locations discovered during sessions:

```markdown
## 🔧 Quick Reference

### Useful Commands
- `./scripts/checkpoint.sh AUD` - Run checkpoint with memory enforcement
- `./scripts/certify.sh AUD [AREA]` - Update MINDFRAME certification

### Key File Locations
- Memory: `prompts/agents/memory/AUDITOR_MEMORY.md`
- Inbox: `output/agents/auditor/inbox/`
```

**When to update**: Add new commands/locations when you discover them.

### ❓ FAQ Section

Answers to questions users ask repeatedly:

```markdown
## ❓ FAQ

### Q: Where are chats logged?
A: They're not. Only key insights go to memory files.

### Q: How do I know what the last agent did?
A: Check their memory file and MINDFRAME.md certifications.
```

**When to update**: Add when you answer a question that might be asked again.

### 📊 Session Metrics Table

Running tally of session performance:

```markdown
## 📊 Session Metrics

| Session | Duration | Tasks | Errors | Outcome |
|---------|----------|-------|--------|---------|
| 2025-12-24 | 45min | 5 | 0 | Complete |
| 2025-12-23 | 30min | 3 | 1 | Partial |
```

**When to update**: Add a row for each session.

### Checkpoint Script Prompts

The `./scripts/checkpoint.sh` script prompts for cumulative updates:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CUMULATIVE SECTIONS (builds up over sessions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔧 Useful command discovered? (or ENTER to skip): 
   ❓ User question worth saving for FAQ? (or ENTER to skip): 
```

---

## Distillation Categories

### Category 1: Operational State (ALWAYS save)

| What | Why | Where |
|------|-----|-------|
| Tasks completed | Continuity | Session entry |
| Decisions made | Audit trail | Session entry |
| Files changed | Reference | Session entry |
| Current blockers | Handoff | Active Context |

### Category 2: Patterns (Save when count ≥2)

| What | Why | Where |
|------|-----|-------|
| Recurring errors | SOP candidate | Known Issues |
| Common questions | FAQ candidate | Insights |
| Slow operations | Optimization | Performance Notes |
| Lock conflicts | Process improvement | Coordination Notes |

### Category 3: Insights (Save when novel)

| What | Why | Where |
|------|-----|-------|
| Useful commands | Future reference | Quick Reference |
| File locations | Navigation | Key Files |
| Gotchas discovered | Avoid repeating | Insights |
| Workarounds used | Problem solving | Session Notes |

### Category 4: Metrics (Save every session)

| What | Why | Where |
|------|-----|-------|
| Session duration | Velocity tracking | Metrics |
| Tasks completed | Productivity | Metrics |
| Tests passed | Health | Metrics |
| Errors hit | Quality | Metrics |

### Category 5: Relationships (Save when new)

| What | Why | Where |
|------|-----|-------|
| Agent handoffs | Coordination | Handoff Notes |
| File dependencies | Architecture | Key Files |
| SOP references | Governance | Related SOPs |
| External tools used | Environment | Tools |

---

## Checkpoint Confirmation Format

After completing checkpoint, output:

```
## ✅ CHECKPOINT COMPLETE

| Item | Status |
|------|--------|
| Tests | ✅ [N] passing |
| Committed | ✅ [hash] |
| Pushed | ✅ origin/main |
| Memory Updated | ✅ [file] |
| Certified | ✅/⏭️ [area] |

### Session Summary (saved to memory)
- Duration: [time]
- Tasks: [count] completed
- Key Decision: [most important]
- Next: [handoff or continue]
```

---

## Memory File Structure Enhancement

### Proposed New Sections

```markdown
## 🔧 Quick Reference

### Useful Commands
- [command]: [what it does]

### Key File Locations
- [file]: [purpose]

---

## 📊 Session Metrics

| Session | Duration | Tasks | Decisions | Errors |
|---------|----------|-------|-----------|--------|
| 2025-12-24 | 45min | 5 | 2 | 0 |
| 2025-12-23 | 30min | 3 | 1 | 1 |

---

## ❓ FAQ (from user questions)

### Q: [Common question]
A: [Answer for future reference]

---

## 🔄 Coordination Log

| Date | With Agent | Topic | Resolution |
|------|------------|-------|------------|
| 2025-12-24 | Testing | Lock conflict | Waited 5min |
```

---

## Checkpoint Script

```bash
#!/bin/bash
# scripts/checkpoint.sh

AGENT_CODE=$1

echo "🔄 Running checkpoint for $AGENT_CODE Agent..."

# 1. Run tests
echo "📋 Running tests..."
npm test || { echo "❌ Tests failed - fix before checkpoint"; exit 1; }

# 2. Stage all changes
git add -A

# 3. Check for changes
if git diff --cached --quiet; then
  echo "ℹ️ No changes to commit"
else
  # 4. Commit
  read -p "Commit message: " MSG
  git commit -m "$MSG"
  
  # 5. Push
  ./scripts/git-push-safe.sh
fi

# 6. Remind about memory
echo ""
echo "📝 REMINDER: Update your memory file!"
echo "   File: prompts/agents/memory/${AGENT_CODE}_MEMORY.md"
echo ""
echo "   Required fields:"
echo "   - Work Completed"
echo "   - Key Decisions"
echo "   - Time Spent"
echo ""

echo "✅ Checkpoint complete!"
```

---

## Related Documents

- [MEMORY_FORMAT.md](../../prompts/agents/MEMORY_FORMAT.md) - Memory file structure
- [MINDFRAME.md](../../output/shared/MINDFRAME.md) - Certification tracking

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-24 | Auditor Agent | Initial creation |

---

## Approval Chain

| Role | Agent | Date | Status |
|------|-------|------|--------|
| Proposer | Auditor Agent | 2025-12-24 | ✅ Created |
| Reviewer | Auditor Agent | 2025-12-24 | ✅ Self-approved (meta-SOP) |
