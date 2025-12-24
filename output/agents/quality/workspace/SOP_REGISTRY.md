# Quality Agent SOP Registry

> **Maintained By**: Quality Agent
> **Purpose**: Track all SOPs across the framework
> **Last Updated**: 2025-12-23

---

## Active SOPs

| SOP Name | Location | Version | Last Verified | Status |
|----------|----------|---------|---------------|--------|
| Bug Triage | `docs/sops/BUG_TRIAGE_SOP.md` | 1.0.0 | 2025-12-23 | ✅ Current |
| Documentation Sync | `docs/sops/DOCUMENTATION_SYNC_SOP.md` | 1.0.0 | 2025-12-23 | ✅ Current |
| Deployment | `docs/sops/DEPLOYMENT_SOP.md` | 1.0.1 | 2025-12-23 | ✅ Current |
| Photorealistic Prompting | `output/media-pipeline/shared/PHOTOREALISTIC_PROMPT_GUIDE.md` | 1.0 | 2025-12-23 | ✅ Current |
| Media Pipeline Flow | `output/media-pipeline/MEDIA_PIPELINE.md` | 1.0 | 2025-12-23 | ✅ Current |
| Agent Policies | `prompts/agents/AGENT_POLICIES.md` | 1.4 | 2025-12-23 | ✅ Current |
| File Update Policy | `docs/FILE_UPDATE_POLICY.md` | 1.0 | 2025-12-23 | ✅ Current |

---

## Pending SOP Proposals

| Proposed SOP | Reason | Frequency | Priority | Status |
|--------------|--------|-----------|----------|--------|
| Template Export Process | Unclear export validation steps | High | P2 | Proposed |
| API Error Handling | Inconsistent error responses | Medium | P3 | Idea |
| Agent Onboarding | No clear process for new agent roles | Low | P3 | Idea |

---

## SOP Opportunities Log

Track patterns that might need SOPs:

| Date | Observation | Times Seen | SOP Created? |
|------|-------------|------------|--------------|
| 2025-12-23 | Next Agent Prompt missing from sessions | 3+ | ✅ Yes (added to policies) |
| 2025-12-23 | Inconsistent iteration tracking | 2 | Monitoring |

---

## Version Check Schedule

| Check Type | Frequency | Last Run | Next Due |
|------------|-----------|----------|----------|
| Full SOP audit | Weekly | 2025-12-23 | 2025-12-30 |
| Quick version check | On use | Ongoing | Ongoing |
| Stale SOP alert | Auto (30 days) | N/A | N/A |

---

## How to Add Entries

### New SOP Created
```markdown
| [Name] | `[path]` | 1.0.0 | [date] | ✅ Current |
```

### SOP Proposal
```markdown
| [Name] | [Why needed] | [High/Medium/Low] | P[1-3] | Proposed |
```

### Pattern Observation
```markdown
| [date] | [What you observed] | [count] | [Yes/No/Monitoring] |
```

---

## Related Documents

- [Bug Triage SOP](../../../docs/sops/BUG_TRIAGE_SOP.md)
- [Documentation Sync SOP](../../../docs/sops/DOCUMENTATION_SYNC_SOP.md)
- [Deployment SOP](../../../docs/sops/DEPLOYMENT_SOP.md)
- [Agent Policies](../../../prompts/agents/AGENT_POLICIES.md)

