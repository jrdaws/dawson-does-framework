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

### Session: 2025-12-24 11:30 (Cycle 9)

#### Work Completed
- Completed full curation cycle (Cycle 9)
- Reviewed 5 draft prompts from Strategist outbox
- Scored all prompts against quality criteria (Vision, Clarity, Completeness, Actionability, Scope)
- All 5 prompts approved (average score: 9.0/10)
- Archived processed drafts to `output/controller-agents/strategist/outbox/archived/`
- Updated `output/ACTIVATE_AGENTS.txt` with Phase 1/2/3 launch commands
- Updated velocity log with Cycle 9 metrics
- Created `output/shared/reports/cycle-summary-20251224-1130.txt`

#### Key Refinements Made
- No refinements needed - all prompts exceeded 8.5/10 quality threshold
- Confirmed existing curated tasks in agent inboxes are still high-quality

#### Quality Scores
| Prompt | Score |
|--------|-------|
| LAUNCH-testing-agent.txt | 9.4/10 |
| LAUNCH-documentation-agent.txt | 9.2/10 |
| T1-uploadthing-validation.txt | 9.0/10 |
| T2-deployment-execution-guide.txt | 8.8/10 |
| T3-design-resources-validation.txt | 8.8/10 |

#### Blockers Encountered
- **Execution gap (CRITICAL)**: 9 tasks queued, 0 executed for 4 consecutive cycles
- Controller cycles keep running but worker agents aren't being launched

#### Next Priorities
1. **PAUSE controller cycles** until worker agents execute tasks
2. Launch Testing Agent (2 P1/P2 tasks ready)
3. Launch Documentation Agent (1 P2 task ready)
4. Human needs to deploy to Vercel after docs complete

#### Handoff Notes
Tasks are curated and ready. Stop creating - start executing.

---

### Session: 2025-12-23 (Cycles 5-8)

#### Work Completed
- Established initial curation workflow
- Curated 8+ tasks distributed across 6 agents
- Created ACTIVATE_AGENTS.txt format
- Archived duplicate tasks

---

## Metrics Tracking

| Metric | Value | Trend |
|--------|-------|-------|
| Curation cycles completed | 5 | ↑ |
| Prompts reviewed | 5 (this cycle) | → |
| Prompts approved | 5 (this cycle) | → |
| Prompts rejected | 0 | → |
| Average quality score | 9.0/10 | ↑ |
| Execution gap | 4 cycles | ↑ Critical |

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

