# Memory Format Reference

> **Purpose**: Full memory template for `cp full` checkpoints
> **Used By**: All agents during full checkpoints

---

## When to Use This Format

| Checkpoint Tier | Memory Format |
|-----------------|---------------|
| Light | None required |
| Standard | Brief (5 lines) |
| **Full** | **This 5-category template** |

---

## Brief Memory Entry (Standard Checkpoint)

```markdown
### Session: [DATE]
- **Work**: [1-2 line summary]
- **Files**: [comma-separated list]
- **Duration**: [X] min
- **Next**: [handoff or continue]
```

---

## Full 5-Category Template (Full Checkpoint)

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

---

## Category Quick Reference

| # | Category | What to Save | When | Required? |
|---|----------|--------------|------|-----------|
| 1 | **Operational** | Tasks, decisions, files | Every full CP | ✅ ALWAYS |
| 2 | **Metrics** | Duration, count, errors | Every full CP | ✅ ALWAYS |
| 3 | **Patterns** | Recurring issues | When count ≥2 | 🟡 If applicable |
| 4 | **Insights** | Commands, workarounds | When novel | 🟡 If applicable |
| 5 | **Relationships** | Handoffs, deps | When new | 🟡 If applicable |

---

## Cumulative Sections (Build Over Time)

Add these sections to memory files and update as discoveries occur:

### 🔧 Quick Reference
```markdown
## 🔧 Quick Reference

### Useful Commands
- `./scripts/checkpoint.sh` - Run checkpoint
- `./scripts/certify.sh [CODE]` - Update MINDFRAME

### Key File Locations
- Memory: `prompts/agents/memory/[ROLE]_MEMORY.md`
- Inbox: `output/agents/[role]/inbox/`
```

### ❓ FAQ
```markdown
## ❓ FAQ

### Q: [Common question]
A: [Answer for future reference]
```

### 📊 Session Metrics Table
```markdown
## 📊 Session Metrics

| Session | Duration | Tasks | Errors | Outcome |
|---------|----------|-------|--------|---------|
| 2025-12-25 | 45min | 5 | 0 | Complete |
```

---

*Memory Format v1.0 | Reference for Full Checkpoints*
