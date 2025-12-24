# Quality Agent Memory (Media Pipeline)

> **Role**: Media Pipeline Agent - Quality Reviewer
> **Code**: QUA
> **Domain**: Asset review, photorealism validation, approval/feedback
> **Pipeline**: Media Generation (Agent 3 of 3)

---

## Role Summary

The Quality Agent is the third and final agent in the Media Generation Pipeline. It reviews generated assets against the original brief, validates photorealism quality, and either approves assets or sends feedback for revision.

### Key Responsibilities
- Review assets against original brief requirements
- Validate photorealism (no AI artifacts)
- Score assets on Visual Quality, Brand Alignment, Technical specs
- Approve (≥90) or request revisions (<90)
- Hand off approved assets to Template Agent or Website Agent
- Manage feedback loops (max 3 iterations)

### Key Files
- SOP: `prompts/agents/roles/media-pipeline/QUALITY_AGENT.md`
- Prompt Guide: `output/media-pipeline/shared/PHOTOREALISTIC_PROMPT_GUIDE.md`
- Output: `output/media-pipeline/quality-agent/`
- Approved: `output/media-pipeline/shared/approved/[project]/`

---

## Session History

### Session: 2025-12-23 (First Review Cycle - E2E Test Project)

#### Work Completed
- ✅ First asset review cycle completed
- ✅ Reviewed 5 assets (3 WebP images, 2 SVG icons)
- ✅ Approved 2 SVG icons (icon-analytics.svg, icon-analytics-2x.svg)
- ✅ Sent revision feedback for 3 WebP images
- ✅ Created review report: `quality-agent/workspace/e2e-test-project-review.md`
- ✅ Created feedback: `media-agent/inbox/feedback-e2e-test-project.md`
- ✅ Moved approved SVGs to: `shared/approved/e2e-test-project/`

#### Key Learnings
- **Screen content is hard to control**: Both hero images struggled with displaying correct dashboard UI
- **Prompt interpretation issues**: "Empty state" was interpreted as "collection of charts" instead of "illustration for no data"
- **SVG icons are reliable**: Hand-coded SVGs passed without issues
- **Photorealism quality is good**: All 3 WebP images passed photorealism checks - issues were content mismatches, not AI artifacts

#### Blockers Encountered
- None (process working as designed)

#### Issues Identified for Pipeline Improvement
1. Screen content generation needs explicit compositing approach (photo + screenshot overlay)
2. "Empty state" illustrations may be better as hand-coded SVG than AI-generated
3. Consider prompt templates with worked examples for abstract concepts

#### Next Priorities
1. Review iteration 2 when Media Agent completes revisions
2. If hero-workspace can't be fixed, recommend composite approach
3. Consider alternative empty-state as SVG

#### Handoff Notes
- 2 SVG icons ready in `shared/approved/e2e-test-project/`
- Awaiting Media Agent revisions for 3 WebP images (iteration 2)
- Asset target: TEMPLATE (templates/saas/public/images/)

---

### Session: 2025-12-23 (Initial Setup)

#### Work Completed
- SOP created
- Photorealism checklist integrated
- Scoring system established (100-point scale)

#### Key Learnings
- Plastic/waxy skin is the most common AI tell
- Hands/fingers require extra scrutiny
- Consistent lighting direction is critical
- Score ≥90 = approved, <90 = revisions needed

#### Blockers Encountered
- None

#### Next Priorities
1. Complete first review cycle
2. Build rejection criteria library
3. Track approval rates by asset type

#### Handoff Notes
Approved assets go to Template Agent (for templates) or Website Agent (for projects).

---

## Metrics Tracking

| Metric | Value | Trend |
|--------|-------|-------|
| Assets reviewed | 5 | ↑ |
| First-pass approval rate | 40% (2/5) | - |
| Average iterations needed | 1+ (in progress) | - |
| Revision rate | 60% (3/5) | - |

### Review History
| Date | Project | Total | Approved | Revisions | Avg Score |
|------|---------|-------|----------|-----------|-----------|
| 2025-12-23 | e2e-test-project | 5 | 2 | 3 | 74/100 |

---

## Scoring System

### Visual Quality (40 points)
- Resolution appropriate (10)
- Composition balanced (10)
- No artifacts (10)
- Consistent style (10)

### Brand Alignment (30 points)
- Colors match palette (10)
- Style matches brief (10)
- Appropriate for audience (10)

### Technical Requirements (30 points)
- Correct dimensions (10)
- File size optimized (10)
- Format correct (10)

### Score Interpretation
| Score | Status | Action |
|-------|--------|--------|
| 90-100 | ✅ Approved | Move to approved folder |
| 70-89 | ⚠️ Minor revisions | Send specific feedback |
| 50-69 | 🔄 Major revisions | Regenerate with new prompt |
| <50 | ❌ Rejected | Back to Research |

---

## Photorealism Checklist

| Check | What to Look For |
|-------|------------------|
| Skin texture | Natural pores, not waxy/plastic |
| Eyes | Realistic catchlights, not vacant |
| Lighting | Consistent direction, natural shadows |
| Colors | Not oversaturated, realistic tones |
| Hands | Correct fingers, natural positioning |
| Background | Appropriate bokeh, no artifacts |
| Overall | Would you believe this is a real photo? |

---

## Common Rejection Reasons

1. **Plastic skin** - Regenerate with "natural skin texture, visible pores"
2. **Wrong hands** - Add "natural hand position" + negative "malformed hands"
3. **Oversaturated** - Lower CFG, add "natural colors, subtle tones"
4. **Inconsistent lighting** - Specify single light source direction
5. **Stock photo feel** - Add "authentic, candid, genuine moment"

---

## Handoff Destinations

| Asset Target | Receiving Agent | Inbox |
|--------------|-----------------|-------|
| TEMPLATE | Template Agent | `output/template-agent/inbox/media-[project]/` |
| PROJECT | Website Agent | `output/website-agent/inbox/media-[project]/` |

---

## Common Patterns

### Review Report Structure
```
1. Summary (approved/revisions/rejected counts)
2. Per-Asset Reviews (score breakdown)
3. Feedback for Media Agent (if revisions needed)
4. Overall Recommendations
```

### Trigger Command
```
Read prompts/agents/roles/media-pipeline/QUALITY_AGENT.md and review the assets waiting in your inbox.
```

---

## Notes

- Quality Agent is the THIRD and FINAL agent in the Media Pipeline
- REQUIRES assets from Media Agent
- All images must pass photorealism checklist
- Max 3 iterations before forced approval with notes
- Approved assets go to: `output/media-pipeline/shared/approved/[project]/`
- Handoff to Template Agent or Website Agent based on Asset Target

