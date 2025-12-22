# Agent Policies & Standards

> **Version 1.0** | Last Updated: 2024-12-22

This document defines corporate-level policies, procedures, and standards for ALL AI agents working on dawson-does-framework.

---

## 📋 Policy Versioning

**Current Governance Version: 1.0**

Agents MUST check this version at the start of each session. If your memory file shows a different version, re-read all governance documents.

| Document | Version | Last Updated |
|----------|---------|--------------|
| AGENT_POLICIES.md | 1.0 | 2024-12-22 |
| ROLE_PROTOCOL.md | 1.0 | 2024-12-22 |
| AGENT_CONTEXT.md | 1.0 | 2024-12-22 |
| CLAUDE.md | 1.0 | 2024-12-22 |

---

## 🎯 Core Agent Principles

### 1. Role Ownership
- Each agent owns ONE role per session
- Roles have clear boundaries - don't cross them
- If work requires another role, create a handoff prompt
- Never work outside your role's scope

### 2. Memory Persistence
- Memory files are the single source of truth for each role
- Update memory at the END of every session (not during)
- Never delete history - only append
- Be specific and actionable in memory entries

### 3. Information Continuity
- Zero information should be lost between sessions
- Every decision must be documented with reasoning
- Every task must be tracked to completion
- Every insight should be preserved for future agents

### 4. Quality Standards
- Code must pass linting and tests before commit
- Documentation must be clear and complete
- Errors must include recovery guidance
- All work must align with project philosophy

---

## 📝 Memory Update Policy

### When to Update Memory

**Update your memory file:**
1. ✅ At the END of every session (before final response)
2. ✅ After completing a significant task
3. ✅ When making an important decision
4. ✅ When discovering an issue
5. ✅ Before any handoff to another agent

**Do NOT update memory:**
- ❌ In the middle of active work (wait until done)
- ❌ For trivial observations
- ❌ To log every small action

### What to Include

| Section | What to Add | Example |
|---------|-------------|---------|
| Session History | Date, duration, summary | "2024-12-22 \| 30min \| Added Stripe webhooks" |
| Key Decisions | Choice + reasoning | "Used edge functions because lower latency" |
| Task Queue | Mark done, add new | "✅ Stripe complete, added LemonSqueezy" |
| Known Issues | Bugs found | "Webhook retry logic missing" |
| Insights | Tips for next agent | "Test with Stripe CLI before deploying" |

### Memory Entry Quality

**Good entry:**
```markdown
| 2024-12-22 | 45min | Session-5 | Completed Stripe webhook handler with signature verification, added retry logic, updated integration.json with new env vars |
```

**Bad entry:**
```markdown
| 2024-12-22 | ? | - | Did some stuff |
```

---

## 🔄 Session Handoff Protocol

### End of Session Checklist

Before ending any session, verify:

- [ ] Memory file updated with session entry
- [ ] All decisions documented with reasoning
- [ ] Task queue updated (completed/new tasks)
- [ ] Known issues logged
- [ ] Insights added for next agent
- [ ] Summary provided
- [ ] Suggestions provided (with recommended agent)
- [ ] Continuation prompt provided

### Handoff Prompt Requirements

Every session MUST end with a handoff that includes:

1. **Recommended Next Agent** - Which role should continue
2. **Priority Tasks** - What needs to be done
3. **Context** - What was just completed
4. **Blockers** - Any issues to be aware of
5. **Ready-to-Use Prompt** - Copy-paste ready

**Example:**
```markdown
## 🚀 Handoff

**Recommended Agent**: Integration Agent
**Priority**: Complete Stripe webhook implementation

### Prompt for Next Agent:
"You are the Integration Agent. Read your memory file at 
prompts/agents/memory/INTEGRATION_MEMORY.md and continue 
from the last session. Priority: Add Stripe webhook retry 
logic and test with Stripe CLI. Files: templates/saas/
integrations/payments/stripe/"
```

---

## 🏢 Corporate Role Structure

### Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT GOVERNANCE                        │
│  (AGENT_CONTEXT.md, AGENT_POLICIES.md, ROLE_PROTOCOL.md)   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
   ┌────▼────┐                               ┌─────▼─────┐
   │  CORE   │                               │ SUPPORT   │
   │  ROLES  │                               │  ROLES    │
   └────┬────┘                               └─────┬─────┘
        │                                          │
   ┌────┴────────────┐                    ┌───────┴──────┐
   │ CLI Agent       │                    │ Docs Agent   │
   │ Website Agent   │                    │ Testing Agent│
   │ Template Agent  │                    └──────────────┘
   │ Integration Agent│
   │ Platform Agent  │
   └─────────────────┘
```

### Role Responsibilities

| Role | Owns | Delivers | Quality Metric |
|------|------|----------|----------------|
| CLI Agent | Commands, core modules | Working CLI | Tests pass |
| Website Agent | UI, pages, components | Working UI | Responsive, accessible |
| Template Agent | Templates, structures | Runnable templates | npm run dev works |
| Integration Agent | Auth, payments, etc. | Working integrations | integration.json valid |
| Platform Agent | APIs, deploy, preview | Working APIs | Response format correct |
| Docs Agent | All documentation | Clear docs | Complete, accurate |
| Testing Agent | All tests | Passing tests | Coverage > 80% |

---

## 🚫 Forbidden Actions

All agents are PROHIBITED from:

1. **Working outside their role** - Create handoff instead
2. **Deleting memory history** - Only append
3. **Skipping governance docs** - Always read first
4. **Ending without handoff** - Always provide continuation
5. **Making undocumented decisions** - Always explain why
6. **Breaking existing tests** - Fix before committing
7. **Ignoring memory file** - Always load and update
8. **Adding unrequested features** - Stay focused
9. **Changing shared configs** - Coordinate first
10. **Committing secrets** - Never include .env values

---

## 🔍 Version Check Protocol

At the start of every session, agents should verify they have the latest governance:

```markdown
## Governance Check
**Current Policy Version**: 1.0
**Memory File Version**: [version from memory]
**Status**: ✅ Up to date / ⚠️ Update needed
```

If versions don't match:
1. Re-read AGENT_POLICIES.md
2. Re-read ROLE_PROTOCOL.md
3. Update your memory file with new version
4. Proceed with session

---

## 📊 Performance Expectations

### Response Time
- Read governance docs: ~2 minutes
- Load memory and establish continuity: ~1 minute
- Complete assigned task: Varies
- Update memory and handoff: ~3 minutes

### Quality Standards
- No linter errors in committed code
- All tests pass
- Memory updated with specifics
- Handoff prompt is actionable

### Success Metrics
- Information loss between sessions: 0%
- Tasks completed without re-work: >90%
- Memory entries are specific: 100%
- Handoffs include next agent: 100%

---

## 🆕 Creating New Roles

If a new role is needed:

1. Use `prompts/agents/ROLE_TEMPLATE.md` as starting point
2. Define clear scope and boundaries
3. Create role file in `prompts/agents/roles/`
4. Create memory file in `prompts/agents/memory/`
5. Add to role identification table in CLAUDE.md
6. Add to .cursorrules
7. Document in ROLE_PROTOCOL.md

---

*Policy Version: 1.0 | Effective: 2024-12-22*

