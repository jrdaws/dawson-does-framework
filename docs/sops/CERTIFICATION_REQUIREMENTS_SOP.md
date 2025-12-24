# Certification Requirements SOP

> **Version**: 1.0.0 | **Last Updated**: 2025-12-23
> 
> **Purpose**: Define which certifications are required before which actions
> **Audience**: All 13 agents
> **Maintained By**: Auditor Agent

---

## Table of Contents

1. [Overview](#1-overview)
2. [Certification Matrix](#2-certification-matrix)
3. [Certification Types](#3-certification-types)
4. [Verification Process](#4-verification-process)
5. [Sequence Violations](#5-sequence-violations)

---

## 1. Overview

**Certifications are trust signals.** When an agent certifies something, other agents trust that certification and skip redundant checks.

### Key Principle

```
Before Action X → Require Certification Y → From Agent Z
```

### Where Certifications Live

All certifications are tracked in: `output/shared/MINDFRAME.md`

---

## 2. Certification Matrix

| Action | Requires Certification | From Agent | Max Age | Check Before |
|--------|----------------------|------------|---------|--------------|
| **Deploy to production** | Tests pass | Testing Agent | 24 hours | Platform Agent deploys |
| **Deploy to production** | Build healthy | Platform Agent | Until code change | Production push |
| **Feature release** | Tests pass | Testing Agent | 24 hours | Announcement |
| **Feature release** | Docs updated | Documentation Agent | 48 hours | Announcement |
| **SOP adoption** | SOP drafted | Documentation Agent | N/A | Auditor review |
| **SOP adoption** | SOP approved | Auditor Agent | N/A | Publication |
| **Template export** | Template valid | Template Agent | Until template change | User export |
| **Template export** | Tests pass | Testing Agent | 24 hours | User export |
| **Media integration** | Assets approved | Quality Agent | Until asset change | Website/Template use |
| **Code merge** | Tests pass | Testing Agent | Until code change | Merge to main |
| **AI generation** | Brief complete | Research Agent | Until brief change | Media/Code generation |

---

## 3. Certification Types

### 3.1 Code Quality

| Certification | Certifying Agent | Meaning |
|--------------|------------------|---------|
| Tests pass | Testing Agent | All 693+ tests green |
| Lint clean | Testing Agent | No linter errors |
| SOPs verified | Testing Agent | SOPs are actionable |

### 3.2 Governance

| Certification | Certifying Agent | Meaning |
|--------------|------------------|---------|
| Governance compliant | Auditor Agent | Rules are being followed |
| Sequence correct | Auditor Agent | Correct agent order |
| SOP approved | Auditor Agent | SOP is valid and complete |

### 3.3 Documentation

| Certification | Certifying Agent | Meaning |
|--------------|------------------|---------|
| Docs current | Documentation Agent | Docs match code |
| Context fresh | Documentation Agent | Governance files updated |
| SOP drafted | Documentation Agent | SOP is ready for review |

### 3.4 Deployment

| Certification | Certifying Agent | Meaning |
|--------------|------------------|---------|
| Build healthy | Platform Agent | Build succeeds |
| Deploy ready | Platform Agent | Config complete |
| Production stable | Platform Agent | Production is running |

### 3.5 Assets

| Certification | Certifying Agent | Meaning |
|--------------|------------------|---------|
| Assets approved | Quality Agent | Media quality verified |
| Brief complete | Research Agent | Creative brief is complete |
| Pipeline ready | Quality Agent | Media workflow is set up |

### 3.6 Templates

| Certification | Certifying Agent | Meaning |
|--------------|------------------|---------|
| Template valid | Template Agent | Template exports correctly |
| Integrations working | Integration Agent | Third-party connections work |

---

## 4. Verification Process

### Before Taking Action

1. **Check MINDFRAME.md** for relevant certification
2. **Verify certification age** is within limits
3. **If expired or missing**, request certification first
4. **If certified**, proceed with confidence

### Verification Command

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework && cat output/shared/MINDFRAME.md | grep -A 2 "[AREA]"
```

### Requesting Certification

If certification is missing or expired:

```markdown
⚠️ Certification Required

Before I can [ACTION], I need:
- [CERTIFICATION] from [AGENT]

## Next Agent: [Agent Role]

Copy this to activate:

Confirm you are the [Agent]. [Request for certification].
```

---

## 5. Sequence Violations

### What is a Sequence Violation?

An action taken without required certification, or in the wrong order.

### Examples

| Violation | Why It's Wrong | Correct Sequence |
|-----------|----------------|------------------|
| Deploy without tests | Code may be broken | Testing → Platform |
| Publish SOP without review | May conflict with others | DOC → AUD → Publish |
| Use assets without approval | Quality may be poor | Media → Quality → Use |
| Export template without testing | May not work | Template → Testing → Export |

### When You Find a Violation

1. **STOP** the current action
2. **DOCUMENT** the violation in audit report
3. **NOTIFY** which agent should have gone first
4. **PROVIDE** redirect prompt for correct agent
5. **CERTIFY** once sequence is corrected

### Reporting Violations

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework
echo "[DATE] [ACTION] by [AGENT] - Missing [CERTIFICATION] from [REQUIRED AGENT]" >> output/shared/sequence-violations.log
```

---

## 6. Certification Expiry

| Certification Type | Valid For | After Expiry |
|-------------------|-----------|--------------|
| Tests passing | 24 hours | Re-run tests |
| Governance | 48 hours | Re-audit |
| Documentation | 1 week | Freshness check |
| Build health | Until code change | Re-verify |
| Asset approval | Until brief change | Re-review |
| SOP approval | Permanent | N/A |

---

## Quick Reference

### Check Certification Status

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework && cat output/shared/MINDFRAME.md
```

### Add Certification

```bash
./scripts/certify.sh [AGENT_CODE] [AREA] [STATUS] [VIBE] "[NOTES]"
```

### Check for Violations

```bash
cat output/shared/sequence-violations.log 2>/dev/null || echo "No violations logged"
```

---

## Related Documents

- [MINDFRAME.md](../../output/shared/MINDFRAME.md) - Certification tracking
- [AGENT_POLICIES.md](../../prompts/agents/AGENT_POLICIES.md) - Agent roles
- [SOP_PROPOSAL_PROCESS.md](./SOP_PROPOSAL_PROCESS.md) - How SOPs are approved

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-23 | Auditor Agent | Initial creation |

