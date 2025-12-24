# SOP Proposal Process

> **Version**: 1.0.0 | **Last Updated**: 2025-12-23
> 
> **Purpose**: Define the process for proposing, reviewing, and adopting SOPs
> **Audience**: All 13 agents
> **Maintained By**: Documentation Agent + Auditor Agent

---

## Table of Contents

1. [Overview](#1-overview)
2. [Proposal Workflow](#2-proposal-workflow)
3. [Agent Roles](#3-agent-roles)
4. [Proposal Template](#4-proposal-template)
5. [Review Criteria](#5-review-criteria)
6. [Adoption Process](#6-adoption-process)

---

## 1. Overview

**Any agent can propose SOP changes.** All proposals go through a structured review process before adoption.

### Key Principle

```
Propose → Draft → Review → Approve → Publish
   ↑                          ↓
   └── Revise if rejected ────┘
```

### Where Proposals Go

**All SOP proposals go to: Documentation Agent**

The Documentation Agent is the central hub for all governance suggestions.

---

## 2. Proposal Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     SOP PROPOSAL WORKFLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. ANY AGENT identifies need                                    │
│     └── Logs to: output/shared/sop-proposals/                   │
│              │                                                   │
│              ▼                                                   │
│  2. DOCUMENTATION AGENT receives                                 │
│     └── Reviews proposal                                         │
│     └── Drafts SOP if valid                                     │
│              │                                                   │
│              ▼                                                   │
│  3. AUDITOR AGENT reviews                                        │
│     └── Checks for conflicts                                     │
│     └── Verifies alignment with project goals                   │
│     └── Approves / Requests changes / Rejects                  │
│              │                                                   │
│              ▼                                                   │
│  4. If APPROVED:                                                 │
│     └── Documentation Agent publishes to docs/sops/            │
│     └── Updates AGENT_POLICIES.md                               │
│     └── Updates MINDFRAME.md certification                      │
│     └── Notifies all agents                                     │
│                                                                  │
│  5. If REJECTED or NEEDS REVISION:                               │
│     └── Feedback sent to proposing agent                        │
│     └── Proposer can revise and resubmit                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Agent Roles

| Role | Agent | Responsibility |
|------|-------|----------------|
| **Proposer** | Any Agent | Identify need, create proposal |
| **Drafter** | Documentation Agent | Write formal SOP from proposal |
| **Reviewer** | Auditor Agent | Review for conflicts, alignment, quality |
| **Approver** | Auditor Agent | Final approval decision |
| **Publisher** | Documentation Agent | Add to docs/sops/, update governance |

### Special Roles

| Agent | Additional Responsibility |
|-------|--------------------------|
| **Strategist** | May prioritize proposals during planning cycles |
| **Testing Agent** | May be asked to verify SOP is testable/actionable |
| **Quality Agent** | Maintains SOP registry, tracks proposal status |

---

## 4. Proposal Template

**All proposals must use this format.**

Save to: `output/shared/sop-proposals/PROPOSAL-[date]-[short-name].md`

```markdown
# SOP Proposal: [Title]

**Proposed By**: [Agent Role]
**Date**: YYYY-MM-DD
**Priority**: P[1-3]
**Status**: Proposed | Under Review | Approved | Rejected

---

## Problem Statement

[What problem does this SOP solve? Why is it needed?]

## Proposed Solution

[Brief description of the SOP]

## Scope

- **Applies To**: [Which agents/processes]
- **Does NOT Apply To**: [Exclusions]

## Key Requirements

1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

## Expected Benefit

- [Benefit 1]
- [Benefit 2]

## Related Documents

- [Link to related SOPs or docs]

---

## Review Notes (filled by Auditor)

**Reviewed By**: 
**Review Date**: 
**Decision**: Approved / Needs Revision / Rejected
**Feedback**: 
```

---

## 5. Review Criteria

**Auditor Agent evaluates proposals against these criteria:**

| Criterion | Question | Weight |
|-----------|----------|--------|
| **Necessity** | Is there a real problem being solved? | 25% |
| **Alignment** | Does it align with project philosophy? | 20% |
| **Clarity** | Is it clear and actionable? | 20% |
| **Conflicts** | Does it conflict with existing SOPs? | 15% |
| **Overhead** | Is the benefit worth the overhead? | 10% |
| **Testability** | Can we verify compliance? | 10% |

### Decision Outcomes

| Score | Decision | Action |
|-------|----------|--------|
| 80-100% | **Approved** | Proceed to publish |
| 60-79% | **Needs Revision** | Return to proposer with feedback |
| <60% | **Rejected** | Document reason, may resubmit later |

---

## 6. Adoption Process

### Step 1: Documentation Agent Publishes

```bash
# Create SOP file
cd /Users/joseph.dawson/Documents/dawson-does-framework
touch docs/sops/[SOP_NAME].md

# Add to protected files
echo "docs/sops/[SOP_NAME].md" >> .protected-files
```

### Step 2: Update Governance

Add reference to `prompts/agents/AGENT_POLICIES.md`:
- Add to SOPs section
- Update version number
- Add to version history

### Step 3: Update SOP Registry

Quality Agent updates:
```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework && cat output/media-pipeline/quality-agent/workspace/SOP_REGISTRY.md
```

### Step 4: Update MINDFRAME

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework && ./scripts/certify.sh DOC "Documentation" "New SOP published" "good" "[SOP name] adopted"
```

### Step 5: Notify Agents

Move proposal to done and create notification:
```bash
mv output/shared/sop-proposals/PROPOSAL-*.md output/shared/sop-proposals/done/
```

---

## Quick Reference

### Submit a Proposal

```bash
# Create proposal file
cd /Users/joseph.dawson/Documents/dawson-does-framework
mkdir -p output/shared/sop-proposals
touch output/shared/sop-proposals/PROPOSAL-$(date +%Y%m%d)-[short-name].md
```

### Check Proposal Status

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework && ls output/shared/sop-proposals/
```

### Proposal Lifecycle

```
Proposed → Under Review → Approved → Published
                ↓
          Needs Revision → Revised → Under Review
                ↓
           Rejected (with reason)
```

---

## Related Documents

- [AGENT_POLICIES.md](../../prompts/agents/AGENT_POLICIES.md) - Main governance
- [SOP_REGISTRY.md](../../output/media-pipeline/quality-agent/workspace/SOP_REGISTRY.md) - SOP tracking
- [Bug Triage SOP](./BUG_TRIAGE_SOP.md)
- [Documentation Sync SOP](./DOCUMENTATION_SYNC_SOP.md)
- [Deployment SOP](./DEPLOYMENT_SOP.md)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-23 | DOC Agent | Initial creation |

