# SOP Opportunities Log

> **Purpose**: Track patterns and issues that might need formal SOPs
> **Maintained By**: Quality Agent
> **Last Updated**: 2025-12-23

---

## How to Use This File

1. **During ANY review session**, note:
   - Repeated issues you're flagging
   - Unclear processes you're following
   - Questions that come up multiple times

2. **Log observations** in the table below

3. **When count reaches 3+**, escalate to Documentation Agent for SOP creation

---

## Observations

| Date | Observation | Category | Count | Notes |
|------|-------------|----------|-------|-------|
| 2025-12-23 | Agents not outputting next agent prompts | Handoff | 3 | ✅ Resolved - added to policies |
| 2025-12-23 | Inconsistent image naming conventions | Media | 1 | ✅ **SOP CREATED** - `docs/sops/MEDIA_NAMING_SOP.md` |
| 2025-12-23 | No clear process for template versioning | Templates | 1 | ✅ **SOP CREATED** - `docs/sops/TEMPLATE_HYGIENE_SOP.md` |
| 2025-12-23 | AI code generation token limit truncation | Code | 5 | ✅ **SOP CREATED** - `docs/sops/AI_MODEL_SELECTION_SOP.md` |
| 2025-12-23 | Haiku model JSON schema compliance issues | Code | 4 | ✅ **SOP CREATED** - `docs/sops/HAIKU_JSON_COMPLIANCE_SOP.md` |
| 2025-12-23 | Template node_modules committed accidentally | Templates | 2 | ✅ **SOP CREATED** - `docs/sops/TEMPLATE_HYGIENE_SOP.md` |
| 2025-12-23 | SSR compatibility for client-only components | Code | 1 | ✅ **SOP CREATED** - `docs/sops/SSR_COMPATIBILITY_SOP.md` |

---

## Categories

- **Handoff**: Agent-to-agent communication
- **Media**: Image/asset generation and review
- **Templates**: Template creation and maintenance
- **Testing**: Test procedures and validation
- **Deployment**: Release and deployment processes
- **Documentation**: Doc creation and updates
- **Code**: Coding standards and patterns

---

## Escalation Template

When count reaches 3+, create an SOP proposal:

```markdown
## SOP Proposal: [Name]

**Observation**: [What pattern you've seen]
**Frequency**: [How often / count]
**Impact**: [What problems this causes]
**Proposed Solution**: [Brief outline of SOP]

### Escalation

## Next Agent: Documentation Agent

Copy this to activate:

Read output/media-pipeline/quality-agent/workspace/sop-opportunities.md and review the proposal for [topic]. Create a formal SOP in docs/sops/ if warranted.
```

---

## Active SOP Proposals

*None - all observations have been addressed with SOPs*

---

## Completed SOPs (from this log)

| SOP | Created | Source Observation |
|-----|---------|-------------------|
| AI Model Selection | 2025-12-23 | Token truncation (5 occurrences) |
| Haiku JSON Compliance | 2025-12-23 | Schema issues (4 occurrences) |
| Template Hygiene | 2025-12-23 | node_modules + versioning |
| Media Naming | 2025-12-23 | Image naming conventions |
| SSR Compatibility | 2025-12-23 | Client-only components |

---

**Log maintained by**: Quality Agent
**Last cleaned**: 2025-12-23
