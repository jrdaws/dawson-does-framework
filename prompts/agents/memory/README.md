# Agent Memory Files

> **Purpose**: Persistent memory for AI agents across sessions
> **Last Updated**: 2025-12-23

---

## Overview

Each agent has a dedicated memory file that persists across sessions. Agents MUST:
1. Read their memory file at session start
2. Update their memory file at session end

---

## Agent Registry

### Executor Agents (7)

| Agent | Code | Memory File | Role File | Domain |
|-------|------|-------------|-----------|--------|
| CLI | `CLI` | `CLI_MEMORY.md` | `roles/CLI_AGENT.md` | Command-line interface |
| Website | `WEB` | `WEBSITE_MEMORY.md` | `roles/WEBSITE_AGENT.md` | Next.js web app |
| Template | `TPL` | `TEMPLATE_MEMORY.md` | `roles/TEMPLATE_AGENT.md` | Starter templates |
| Integration | `INT` | `INTEGRATION_MEMORY.md` | `roles/INTEGRATION_AGENT.md` | Third-party integrations |
| Documentation | `DOC` | `DOCS_MEMORY.md` | `roles/DOCUMENTATION_AGENT.md` | Docs and guides |
| Testing | `TST` | `TESTING_MEMORY.md` | `roles/TESTING_AGENT.md` | Tests and CI/CD |
| Platform | `PLT` | `PLATFORM_MEMORY.md` | `roles/PLATFORM_AGENT.md` | APIs and deployment |

### Controller Agents (3)

| Agent | Code | Memory File | Role File | Domain |
|-------|------|-------------|-----------|--------|
| Auditor | `AUD` | `AUDITOR_MEMORY.md` | `roles/controllers/AUDITOR.md` | Framework audits |
| Strategist | `STR` | `STRATEGIST_MEMORY.md` | `roles/controllers/STRATEGIST.md` | Task planning |
| Curator | `CUR` | `CURATOR_MEMORY.md` | `roles/controllers/CURATOR.md` | Prompt refinement |

### Media Pipeline Agents (3)

| Agent | Code | Memory File | Role File | Domain |
|-------|------|-------------|-----------|--------|
| Research | `RES` | `RESEARCH_MEMORY.md` | `roles/media-pipeline/RESEARCH_AGENT.md` | Asset briefs |
| Media | `MED` | `MEDIA_MEMORY.md` | `roles/media-pipeline/MEDIA_AGENT.md` | Image generation |
| Quality | `QUA` | `QUALITY_MEMORY.md` | `roles/media-pipeline/QUALITY_AGENT.md` | Asset review |

---

## Total Agents: 13

```
Executor Agents (7)     Controller Agents (3)     Media Pipeline (3)
├── CLI                 ├── Auditor               ├── Research
├── Website             ├── Strategist            ├── Media
├── Template            └── Curator               └── Quality
├── Integration
├── Documentation
├── Testing
└── Platform
```

---

## Memory File Structure

All memory files should follow this structure:

```markdown
# [Agent Name] Memory

> **Role**: [Type] - [Description]
> **Code**: [3-letter code]
> **Domain**: [Area of responsibility]

---

## Role Summary
[Brief description of responsibilities]

### Key Responsibilities
- [Responsibility 1]
- [Responsibility 2]

### Key Files
- SOP: [path]
- Output: [path]

---

## Session History

### Session: YYYY-MM-DD HH:MM

#### Work Completed
- [Item 1]
- [Item 2]

#### Blockers Encountered
- [Blocker, if any]

#### Next Priorities
1. [Priority 1]
2. [Priority 2]

#### Handoff Notes
[Context for next agent]

---

## Metrics Tracking
[Agent-specific metrics]

---

## Common Patterns
[Frequently used patterns/templates]

---

## Notes
[Important reminders]
```

---

## Session Update Requirements

At the END of every session, agents MUST update their memory with:

1. **Session timestamp**
2. **Work completed** (bullet list)
3. **Blockers encountered** (or "None")
4. **Next priorities** (numbered list)
5. **Handoff notes** (context for next agent)

---

## Cross-Agent Communication

Agents communicate via:
1. **Inbox folders**: `output/[agent]/inbox/` - receive tasks
2. **Outbox folders**: `output/[agent]/outbox/` - completed work
3. **Shared folders**: `output/shared/` - reports and metrics
4. **Memory files**: Context and history

---

## Quick Reference

### Read Memory
```bash
cat prompts/agents/memory/[CODE]_MEMORY.md
```

### Find Agent Inbox
```bash
ls output/[agent-name]/inbox/
```

### All Role Short Codes
```
CLI | WEB | TPL | INT | DOC | TST | PLT | AUD | STR | CUR | RES | MED | QUA
```
