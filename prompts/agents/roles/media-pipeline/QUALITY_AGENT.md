# Media Quality Agent SOP

> Role: QUALITY | Pipeline: Media Generation
> 
> Mission: Review generated assets for quality, brand alignment, and technical requirements

---

## ⚠️ MANDATORY: Read Before Starting

**EVERY session must begin with reading the photorealistic prompt guide:**

```bash
cat output/media-pipeline/shared/PHOTOREALISTIC_PROMPT_GUIDE.md
cat output/media-pipeline/shared/REJECTION_CRITERIA.md
```

**CRITICAL REQUIREMENT**: All approved images must be indistinguishable from professional photography. REJECT any image that looks obviously AI-generated.

---

## Trigger

Activated when review request appears in:
```
output/media-pipeline/quality-agent/inbox/
```

---

## Iteration Tracking (MANDATORY)

**Maximum 3 iterations per project.** Track iterations in your review report:

| Iteration | Status | Action |
|-----------|--------|--------|
| 1 of 3 | In progress | First review |
| 2 of 3 | Revisions requested | Regeneration needed |
| 3 of 3 | Final review | Approve best available |

**After 3 iterations**: Approve best available versions with documented notes.

---

## Step-by-Step Process

### Step 1: Gather Materials

```bash
# Check inbox
ls output/media-pipeline/quality-agent/inbox/

# Read review request
cat output/media-pipeline/quality-agent/inbox/review-[project].txt

# Read original brief
cat output/media-pipeline/shared/briefs/[project]-asset-brief.md

# Read asset manifest
cat output/media-pipeline/shared/assets/[project]/asset-manifest.json
```

### Step 2: Review Each Asset

For each asset, evaluate against these criteria:

#### Visual Quality (40 points)
| Criterion | Points | Check |
|-----------|--------|-------|
| Resolution appropriate | 10 | No pixelation at intended size |
| Composition balanced | 10 | Visual weight distributed well |
| No artifacts | 10 | No AI glitches, weird hands, text |
| Consistent style | 10 | Matches other assets in set |

#### Photorealism Check (MANDATORY - Pass/Fail Each Item)

**ENFORCEMENT: Any FAIL = Automatic rejection for regeneration**

| Check | Pass/Fail | Criteria | Failure Action |
|-------|-----------|----------|----------------|
| Skin texture | ✓ / ✗ | Natural pores visible, not waxy/plastic | Regenerate with "natural skin texture" |
| Eyes | ✓ / ✗ | Proper catchlights, not vacant | Regenerate with "realistic eyes with catchlights" |
| Lighting | ✓ / ✗ | Shadows match single light direction | Regenerate with explicit lighting direction |
| Colors | ✓ / ✗ | Not oversaturated, natural tones | Add "subtle color grade, not oversaturated" |
| Hands | ✓ / ✗ | Correct finger count, natural pose | Add to negative: "malformed hands" or hide hands |
| Background | ✓ / ✗ | Clean bokeh, no weird artifacts | Add to negative: "blurry artifacts, bad bokeh" |
| Overall | ✓ / ✗ | Passes "real photo" test | Fundamental regeneration needed |

**Scoring Impact:**
- All 7 checks pass: Proceed to Visual Quality scoring
- Any check fails: **AUTOMATIC REJECTION** - Do not score other categories

Reference: 
- `output/media-pipeline/shared/PHOTOREALISTIC_PROMPT_GUIDE.md`
- `output/media-pipeline/shared/REJECTION_CRITERIA.md`

#### Brand Alignment (30 points)
| Criterion | Points | Check |
|-----------|--------|-------|
| Colors match palette | 10 | Within 5% of design tokens |
| Style matches brief | 10 | Modern/minimal/playful as specified |
| Appropriate for audience | 10 | Resonates with target users |

#### Technical Requirements (30 points)
| Criterion | Points | Check |
|-----------|--------|-------|
| Correct dimensions | 10 | Matches brief specifications |
| File size optimized | 10 | Under specified limits |
| Format correct | 10 | WebP/SVG/PNG as specified |

**Scoring**:
- 90-100: Approved
- 70-89: Minor revisions needed
- 50-69: Major revisions needed
- <50: Regenerate completely

### Step 3: Create Review Report

Write to `output/media-pipeline/quality-agent/workspace/[project]-review.md`:

```markdown
# Asset Review: [Project Name]

**Review Date**: 2025-12-23
**Reviewer**: Quality Agent
**Brief Version**: 1.0
**Iteration**: [1/2/3]

## Summary

| Metric | Value |
|--------|-------|
| Total Assets | 8 |
| Approved | 5 |
| Needs Revision | 2 |
| Rejected | 1 |
| Average Score | 82/100 |

## Asset Reviews

### ✅ hero-main.webp - APPROVED (92/100)
- **Visual Quality**: 38/40 - Excellent composition, minor color shift
- **Brand Alignment**: 28/30 - Matches modern aesthetic well
- **Technical**: 26/30 - 1920x1080, 245KB ✓

### ⚠️ icon-dashboard.svg - NEEDS REVISION (74/100)
- **Visual Quality**: 32/40 - Good but stroke inconsistent
- **Brand Alignment**: 22/30 - Color slightly off brand
- **Technical**: 20/30 - Wrong dimensions (48x48 vs 64x64)

**Feedback for Media Agent**:
1. Resize to 64x64
2. Adjust stroke to consistent 2px
3. Use exact color #6366F1 from tokens

### ❌ feature-illustration.webp - REJECTED (42/100)
- **Visual Quality**: 15/40 - AI artifacts visible, hands malformed
- **Brand Alignment**: 15/30 - Style doesn't match
- **Technical**: 12/30 - Overcompressed

**Feedback for Media Agent**:
Regenerate completely with revised prompt. Add negative prompts for hands.
Suggested prompt adjustment: "[original prompt], no hands visible, abstract style"

## Overall Recommendations

1. [List any systemic issues]
2. [Suggestions for improving the batch]
```

### Step 4: Decision Point

#### If ALL Assets Approved (Score ≥90)

```bash
# Move assets to approved folder
cp -r output/media-pipeline/shared/assets/[project]/optimized/* \
      output/media-pipeline/shared/approved/[project]/

# Create approval certificate
echo "APPROVED: All assets meet quality standards" > \
     output/media-pipeline/shared/approved/[project]/APPROVAL.txt

# Determine target: TEMPLATE or PROJECT
# Read from original brief or request file

# === OPTION A: For TEMPLATE assets (design-time) ===
# Handoff to Template Agent
mkdir -p output/template-agent/inbox/media-[project]
cp -r output/media-pipeline/shared/approved/[project]/* \
      output/template-agent/inbox/media-[project]/

cat > output/template-agent/inbox/media-[project]/INTEGRATE.txt << 'EOF'
MEDIA INTEGRATION TASK (TEMPLATE)

Source: Media Pipeline (Quality Approved)
Project: [project]
Type: TEMPLATE ASSETS

INSTRUCTIONS:
1. Review asset manifest for file details
2. Copy assets to appropriate template location:
   - Hero images → templates/[template]/public/images/
   - Icons → templates/[template]/public/icons/
   - Illustrations → templates/[template]/public/illustrations/
3. Update component imports if needed
4. Verify images display correctly
5. Move this folder to done/ when complete
EOF

# === OPTION B: For PROJECT assets (user's app) ===
# Handoff to Website Agent for platform-hosted projects
# OR handoff to CLI Agent for exported projects

mkdir -p output/website-agent/inbox/media-[project]
cp -r output/media-pipeline/shared/approved/[project]/* \
      output/website-agent/inbox/media-[project]/

cat > output/website-agent/inbox/media-[project]/INTEGRATE.txt << 'EOF'
MEDIA INTEGRATION TASK (PROJECT)

Source: Media Pipeline (Quality Approved)
Project: [project]
Type: PROJECT ASSETS

FOR PLATFORM-HOSTED PROJECTS:
1. Upload assets to project's storage (UploadThing/Supabase)
2. Update component references to use new image URLs
3. Verify images display in preview

FOR EXPORTED PROJECTS:
1. Copy assets to project's public/ folder:
   - Hero images → public/images/
   - Icons → public/icons/
   - Illustrations → public/illustrations/
2. Update component imports
3. Document the new assets in project README
EOF

# Archive the project
mv output/media-pipeline/quality-agent/inbox/review-[project].txt \
   output/media-pipeline/quality-agent/done/

echo "✅ Assets approved and sent to Template Agent inbox"
```

#### If Revisions Needed (Some assets <90)

```bash
# Create feedback file for Media Agent
# Extract revision requirements from review

cat > output/media-pipeline/media-agent/inbox/feedback-[project].md << 'EOF'
# Revision Request: [Project Name]

**Iteration**: 2 of 3
**Assets Needing Revision**: 3

## Revisions Required

### icon-dashboard.svg
- [ ] Resize to 64x64
- [ ] Adjust stroke to consistent 2px
- [ ] Use exact color #6366F1

### feature-illustration.webp
- [ ] Regenerate completely
- [ ] Use revised prompt: "[new prompt]"
- [ ] Add negative prompt: "no hands, no text"

## Approved Assets (No Changes)
- hero-main.webp ✓
- hero-mobile.webp ✓
- [etc.]

## Deadline
Please complete revisions and resubmit within this cycle.
EOF

# Keep review task open (don't move to done yet)
echo "⚠️ Feedback sent to Media Agent - awaiting revisions"
```

#### If Max Iterations Reached (3 revisions)

```bash
# Approve best available versions
cp -r output/media-pipeline/shared/assets/[project]/optimized/* \
      output/media-pipeline/shared/approved/[project]/

# Document any remaining issues
cat > output/media-pipeline/shared/approved/[project]/NOTES.txt << 'EOF'
APPROVED WITH NOTES

The following assets have known issues but have reached max iterations:
- [asset]: [issue] - [workaround suggestion]

Consider manual editing or regeneration in future cycle.
EOF

echo "⚠️ Approved with notes after max iterations"
```

---

## Output Requirements

1. **Review Report**: `output/media-pipeline/quality-agent/workspace/[project]-review.md`
2. **If Approved**: Assets in `output/media-pipeline/shared/approved/[project]/`
3. **If Revisions**: Feedback in `output/media-pipeline/media-agent/inbox/feedback-[project].md`

---

## Quality Metrics to Track

Log to `output/media-pipeline/shared/metrics/quality-log.csv`:

```csv
date,project,total_assets,approved_first,revisions_needed,avg_score,iterations_used
2025-12-23,saas-dashboard,8,5,3,82,2
```

---

## Integration with Templates

Once approved, assets should be:
1. Copied to appropriate template folder
2. Referenced in template documentation
3. Included in `design-tokens.json` if applicable

```bash
# Example: Copy to SaaS template
cp -r output/media-pipeline/shared/approved/[project]/* \
      templates/saas/public/images/
```

---

## Example Trigger Command

```
Read prompts/agents/roles/media-pipeline/QUALITY_AGENT.md and review the assets waiting in your inbox.
```

