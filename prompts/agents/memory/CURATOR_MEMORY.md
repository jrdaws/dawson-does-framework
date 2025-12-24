# Curator Agent Memory

> **Role**: Controller Agent - Quality Controller & Distributor
> **Code**: CUR
> **Domain**: Prompt refinement, quality assurance, task distribution
> **Cycle**: Every 6 hours (continuous improvement system)

---

## Role Summary

The Curator Agent is the third and final agent in the continuous improvement cycle. It reviews the Strategist's work, refines prompts to expert level, and distributes final tasks to executor agent inboxes.

### Key Responsibilities
- Review Auditor report and Strategist drafts
- Refine prompts to expert-level quality
- Ensure alignment with project vision/mission
- Distribute final prompts to agent inboxes
- Track cycle completion and metrics

### Key Files
- SOP: `prompts/agents/roles/controllers/CURATOR.md`
- Output: `output/controller-agents/curator/`
- Cycle Summary: `output/shared/reports/cycle-summary-*.txt`

---

## Session History

### Session: 2025-12-23 (Pending)

#### Work Completed
- Awaiting first full cycle completion

#### Key Refinements Made
- TBD

#### Blockers Encountered
- None

#### Next Priorities
1. Complete first curation cycle
2. Establish quality standards for prompts
3. Create prompt refinement checklist

#### Handoff Notes
Final prompts distributed to executor agent inboxes.

---

## Metrics Tracking

| Metric | Value | Trend |
|--------|-------|-------|
| Curation cycles completed | 0 | - |
| Prompts refined | 0 | - |
| Prompts distributed | 0 | - |
| Average refinement time | TBD | - |

---

## Prompt Quality Standards

### Expert-Level Prompt Requirements
- [ ] Clear, specific objective
- [ ] Complete context provided
- [ ] Explicit success criteria
- [ ] Files to read listed
- [ ] Expected outputs defined
- [ ] Handoff instructions included
- [ ] Aligned with project vision

### Common Refinements
1. Add missing context files
2. Clarify ambiguous objectives
3. Add success criteria
4. Include handoff instructions
5. Reference relevant SOPs

---

## Distribution Locations

| Agent | Inbox Location |
|-------|----------------|
| CLI | `output/cli-agent/inbox/` |
| Website | `output/website-agent/inbox/` |
| Template | `output/template-agent/inbox/` |
| Integration | `output/integration-agent/inbox/` |
| Documentation | `output/documentation-agent/inbox/` |
| Testing | `output/testing-agent/inbox/` |
| Platform | `output/platform-agent/inbox/` |
| Research (Media) | `output/media-pipeline/research-agent/inbox/` |
| Media | `output/media-pipeline/media-agent/inbox/` |
| Quality (Media) | `output/media-pipeline/quality-agent/inbox/` |

---

## Common Patterns

### Cycle Summary Structure
```
1. Cycle Metadata (date, duration)
2. Audit Highlights
3. Strategic Priorities
4. Tasks Distributed
5. Quality Metrics
6. Recommendations for Next Cycle
```

### Trigger Command
```
Read prompts/agents/roles/controllers/CURATOR.md and execute a curation cycle.
```

---

## Notes

- Curator is the THIRD and FINAL agent in the improvement cycle
- REQUIRES both Auditor and Strategist reports before starting
- Final prompts go directly to executor agent inboxes
- Cycle summary goes to: `output/shared/reports/cycle-summary-YYYYMMDD-HHMM.txt`
- Updates velocity log: `output/shared/metrics/velocity-log.csv`

