# Media Pipeline Enforcement Checklist

> **Version**: 1.0 | **Last Updated**: 2025-12-23
>
> Pre-handoff checklists for each pipeline agent. Complete ALL items before handoff.

---

## Research Agent → Media Agent

**Complete this checklist before sending brief to Media Agent:**

### Session Start ✓
- [ ] Read `PHOTOREALISTIC_PROMPT_GUIDE.md` at session start
- [ ] Understand camera/lens/lighting formula

### Brief Content ✓
- [ ] **Asset Target** specified (TEMPLATE or PROJECT)
- [ ] App type identified (SaaS/E-commerce/Landing/Blog/Mobile)
- [ ] Brand style documented
- [ ] Color palette from design tokens
- [ ] All required assets listed with dimensions

### Prompt Requirements (EVERY prompt must include) ✓
- [ ] **Camera model** (e.g., "shot on Canon EOS R5")
- [ ] **Lens specification** (e.g., "85mm f/1.4")
- [ ] **Lighting description** (e.g., "natural window light from left")
- [ ] **Photography style** (e.g., "editorial lifestyle photography")
- [ ] **Negative prompt** with anti-AI-tells list

### Quality Criteria ✓
- [ ] Priority levels assigned (P1/P2/P3)
- [ ] Quality criteria defined for each asset
- [ ] Reference images included (if available)

**⚠️ STOP**: If ANY prompt is missing camera/lens/lighting/negative prompts, the brief is NOT ready.

---

## Media Agent → Quality Agent

**Complete this checklist before sending assets for review:**

### Session Start ✓
- [ ] Read `PHOTOREALISTIC_PROMPT_GUIDE.md` at session start
- [ ] Verify cost-optimization strategy (SD for drafts, DALL-E for finals only)

### Pre-Generation Verification ✓
For EACH prompt, verify:
- [ ] Camera model present in prompt
- [ ] Lens specification present
- [ ] Lighting description present
- [ ] Photography style present
- [ ] Negative prompt included

**⚠️ STOP**: If ANY element is missing, return brief to Research Agent.

### AI Artifact Self-Check ✓
For EACH generated image, verify:
- [ ] **Skin texture** natural (not waxy/plastic/poreless)
- [ ] **Eyes** realistic (proper catchlights, not vacant)
- [ ] **Lighting** consistent (shadows match light direction)
- [ ] **Colors** natural (not oversaturated/HDR-overdone)
- [ ] **Hands** correct (right number of fingers, natural pose)
- [ ] **Background** clean (no weird artifacts in bokeh)
- [ ] **Overall** passes "real photo" test

**⚠️ STOP**: If ANY check fails, regenerate the image. Do NOT pass to Quality Agent.

### Technical Quality ✓
- [ ] All P1 assets generated
- [ ] Assets match specified dimensions
- [ ] Files optimized (images <500KB)
- [ ] Asset manifest created with full metadata
- [ ] Generation settings documented (model, steps, CFG, seed)
- [ ] Cost tracked

---

## Quality Agent → Integration Agent

**Complete this checklist before approving assets:**

### Session Start ✓
- [ ] Read `PHOTOREALISTIC_PROMPT_GUIDE.md`
- [ ] Read `REJECTION_CRITERIA.md`
- [ ] Note current iteration (1/2/3 of max 3)

### Photorealism Check (MANDATORY - All must pass) ✓
- [ ] **Skin texture** - Natural pores, not waxy/plastic
- [ ] **Eyes** - Proper catchlights, not vacant
- [ ] **Lighting** - Consistent shadow direction
- [ ] **Colors** - Natural, not oversaturated
- [ ] **Hands** - Correct finger count
- [ ] **Background** - Clean bokeh, no artifacts
- [ ] **Overall** - Passes "real photo" test

**⚠️ STOP**: ANY fail = Automatic rejection. Do not proceed to scoring.

### Scoring (Only if photorealism passes) ✓
- [ ] Visual Quality scored (40 points max)
- [ ] Brand Alignment scored (30 points max)
- [ ] Technical Requirements scored (30 points max)
- [ ] Total score calculated

### Decision ✓
- [ ] Score ≥90: APPROVED → Proceed to handoff
- [ ] Score 70-89: MINOR REVISIONS → Send specific feedback to Media Agent
- [ ] Score 50-69: MAJOR REVISIONS → Regenerate with new prompt
- [ ] Score <50: REJECTED → Back to Research for new approach

### Handoff (If Approved) ✓
- [ ] Assets moved to `shared/approved/[project]/`
- [ ] APPROVAL.txt created
- [ ] Asset Target verified (TEMPLATE or PROJECT)
- [ ] Handoff package created for correct agent (Template or Website)
- [ ] Review archived to `done/`

---

## Integration Agent → Completion

**Complete this checklist before marking integration complete:**

### Pre-Integration ✓
- [ ] All assets have APPROVAL.txt
- [ ] Asset manifest reviewed
- [ ] Correct destination folder identified

### Integration ✓
- [ ] Assets copied to correct location:
  - TEMPLATE: `templates/[name]/public/`
  - PROJECT: User's project folder
- [ ] Component imports updated
- [ ] Images display correctly in preview
- [ ] Naming conventions followed

### Documentation ✓
- [ ] Changes documented
- [ ] README updated (if applicable)
- [ ] Component references updated

---

## Escalation Path

If an asset fails quality after **3 iterations**:

1. **Document the issue** in NOTES.txt
2. **Approve best available** with documented limitations
3. **Recommend manual editing** or future regeneration
4. **Consider alternative approach** (different style, hide problematic elements)

---

## Metrics Tracking

Log all pipeline runs to:
```
output/media-pipeline/shared/metrics/pipeline-log.csv
```

Format:
```csv
date,project,research_time,generation_time,review_time,iterations,approved_count,total_count,cost
```

---

*Reference: `prompts/agents/AGENT_POLICIES.md` - Media Pipeline Standards section*

