# Strategist Agent Memory

> **Role**: Controller Agent - Strategic Planner
> **Code**: STR
> **Domain**: Task planning, prioritization, prompt creation
> **Cycle**: Every 6 hours (continuous improvement system)

---

## Role Summary

The Strategist Agent is the second agent in the continuous improvement cycle. It reads the Auditor's report, creates strategic priorities, and drafts task prompts for executor agents.

### Key Responsibilities
- Read and analyze Auditor's report
- Create strategic priorities aligned with project vision
- Draft task prompts for executor agents
- Prioritize tasks by impact and urgency
- Hand off to Curator for quality review

### Key Files
- SOP: `prompts/agents/roles/controllers/STRATEGIST.md`
- Output: `output/agents/strategist/`
- Reports: `output/shared/reports/strategy-*.txt`

---

## Session History

### Session: 2025-12-23 14:00 (Initial)

#### Work Completed
- Read audit report from Auditor
- Created strategic priorities
- Drafted task prompts for Testing, Documentation, and other agents
- Produced strategy report: `output/shared/reports/strategy-20251223-1400.txt`

#### Key Priorities Created
1. Test UploadThing integration (Testing Agent)
2. Create deployment guide (Documentation Agent)
3. Validate design resources integration (Testing Agent)

#### Blockers Encountered
- None

#### Next Priorities
1. Continue 6-hour strategy cycles
2. Improve task prioritization framework
3. Track task completion rates

#### Handoff Notes
Strategy report and draft prompts handed off to Curator Agent for review and distribution.

---

## Metrics Tracking

| Metric | Value | Trend |
|--------|-------|-------|
| Strategy cycles completed | 1 | - |
| Tasks created | 5 | - |
| Average tasks per cycle | 5 | - |
| High priority (P1) tasks | 2 | - |

---

## Priority Framework

| Priority | Criteria | Examples |
|----------|----------|----------|
| P1 - Critical | Blocks deployment, breaks tests | Production bugs, failing tests |
| P2 - High | Significant feature/improvement | New features, major docs |
| P3 - Medium | Nice to have, quality of life | Optimizations, minor docs |
| P4 - Low | Future consideration | Ideas, exploration |

---

## Common Patterns

### Strategy Report Structure
```
1. Audit Summary (from Auditor)
2. Strategic Priorities
3. Task Matrix (by agent)
4. Resource Allocation
5. Risk Mitigation
6. Success Metrics
```

### Task Prompt Template
```
TASK: [Name]
AGENT: [Target Agent]
PRIORITY: P[1-4]
OBJECTIVE: [Clear goal]
CONTEXT: [Background]
DELIVERABLES: [Expected outputs]
SUCCESS CRITERIA: [How to verify]
```

### Trigger Command
```
Read prompts/agents/roles/controllers/STRATEGIST.md and execute a strategy cycle.
```

---

## Notes

- Strategist is the SECOND agent in the improvement cycle
- REQUIRES Auditor report before starting
- Must complete before Curator can start
- Report goes to: `output/shared/reports/strategy-YYYYMMDD-HHMM.txt`
- Copy report + drafts to Curator inbox for handoff

