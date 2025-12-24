# File Update Policy

> Version: 1.0.0 | Last Updated: 2025-12-23
> 
> Defines which files require updates, triggers, frequency, and staleness risks.

---

## File Categories

### 1. 🔴 MANDATORY UPDATE FILES (Session-Based)

These files MUST be updated at the end of EVERY agent session:

| File Pattern | Trigger | Updated By | Staleness Risk |
|--------------|---------|------------|----------------|
| `prompts/agents/memory/*_MEMORY.md` | Session end | Assigned agent | HIGH - context lost |
| `output/[agent]/done/*.txt` | Task completion | Any agent | MEDIUM - history lost |

**Rule**: If you worked on something, you MUST update your memory file.

---

### 2. 🟠 CYCLE-BASED UPDATE FILES

These files are updated on a regular cycle (every 6 hours):

| File | Trigger | Updated By | Staleness Risk |
|------|---------|------------|----------------|
| `output/shared/reports/audit-*.txt` | Auditor cycle | Auditor Agent | HIGH after 6 hours |
| `output/shared/reports/strategy-*.txt` | Strategist cycle | Strategist Agent | HIGH after 6 hours |
| `output/shared/reports/cycle-summary-*.txt` | Curator cycle | Curator Agent | MEDIUM |
| `output/shared/metrics/velocity-log.csv` | Cycle completion | Curator Agent | LOW - cumulative |

---

### 3. 🟡 EVENT-TRIGGERED UPDATE FILES

These files update when specific events occur:

| File | Trigger Event | Updated By | Staleness Risk |
|------|---------------|------------|----------------|
| `docs/COMPLETE_SETUP_GUIDE.md` | Infrastructure change | Any agent | HIGH - setup fails |
| `FRAMEWORK_MAP.md` | Architecture change | CLI/Platform Agent | MEDIUM |
| `output/shared/media/assets/*/asset-manifest.json` | Asset generation | Media Agent | LOW |
| `templates/*/template.json` | Template change | Template Agent | MEDIUM |

---

### 4. 🟢 RARELY UPDATED FILES (Stable)

These files change infrequently:

| File | Update Trigger | Staleness Risk |
|------|----------------|----------------|
| `CLAUDE.md` | Governance policy change | LOW |
| `.cursorrules` | Governance policy change | LOW |
| `prompts/agents/AGENT_POLICIES.md` | Process change | LOW |
| `prompts/agents/roles/*.md` | Role definition change | LOW |
| `docs/standards/*.md` | Standard change | LOW |

---

### 5. 🔒 PROTECTED FILES (Never Delete)

See `.protected-files` for the complete list. These can be UPDATED but never DELETED:

```
AGENT_CONTEXT.md
CLAUDE.md
.cursorrules
prompts/agents/memory/*.md
prompts/agents/roles/*.md
docs/standards/*
docs/COMPLETE_SETUP_GUIDE.md
```

---

## Update Frequency Summary

| Frequency | Files | Notes |
|-----------|-------|-------|
| **Every Session** | Memory files | Non-negotiable |
| **Every 6 Hours** | Audit/Strategy/Cycle reports | Continuous improvement |
| **On Change** | Setup guide, Framework map | Event-triggered |
| **Rarely** | Governance, SOPs | Only for process changes |

---

## Staleness Detection

### High Staleness Risk Indicators

| Symptom | Likely Stale File | Action |
|---------|-------------------|--------|
| Agent doesn't know recent changes | Memory file | Read git log, update memory |
| Setup instructions fail | COMPLETE_SETUP_GUIDE.md | Audit and update |
| Wrong folder structure | FRAMEWORK_MAP.md | Verify and update |
| Outdated metrics | velocity-log.csv | Run audit cycle |

### Staleness Check Commands

```bash
# Check memory file age
ls -la prompts/agents/memory/*.md | head -10

# Check last audit
ls -la output/shared/reports/audit-*.txt | tail -1

# Check setup guide version
head -5 docs/COMPLETE_SETUP_GUIDE.md

# Check recent commits
git log --oneline -10
```

---

## File Update Triggers

### Automatic Triggers

| Event | Files Updated | By |
|-------|---------------|-----|
| Commit pushed | None (manual) | - |
| 6-hour timer | Audit → Strategy → Cycle | Controller agents |
| Asset generation | Manifest, brief | Media pipeline |
| Test run | Test results | Testing agent |

### Manual Triggers

| Event | Files to Update | By |
|-------|-----------------|-----|
| New dependency added | COMPLETE_SETUP_GUIDE.md | Any agent |
| New agent created | Memory README, Policies | DOC agent |
| SOP changed | Role files, Policies | DOC agent |
| Session end | Memory file | Active agent |

---

## Quick Reference

### Before Starting Work
```bash
# Check your memory is current
cat prompts/agents/memory/[YOUR_ROLE]_MEMORY.md | tail -30

# Check for recent changes
git log --oneline --since="6 hours ago"
```

### After Completing Work
```bash
# 1. Update your memory file
# 2. Move completed tasks to done/
# 3. Create handoff prompt for next agent
# 4. Commit changes
git add -A && git commit -m "docs([role]): update memory and complete task"
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-23 | Initial creation |

