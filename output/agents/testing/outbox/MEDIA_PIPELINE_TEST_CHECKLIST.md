# Media Pipeline End-to-End Test Checklist

> **Version**: 1.0 | **Created**: 2025-12-23
> **Purpose**: Validate the media generation pipeline works correctly end-to-end
> **Estimated Time**: 45-60 minutes for full test

---

## Prerequisites

Before running this test:

- [ ] All documentation files exist (verified below)
- [ ] At least one AI image generation API configured:
  - [ ] OpenAI API key (for DALL-E) OR
  - [ ] Stability AI API key (for Stable Diffusion)
- [ ] Required tools installed: `imagemagick` for image optimization

---

## Part 1: Documentation Existence Checks

### 1.1 Core Pipeline Documents

```bash
# Run these checks - all should return file contents, not errors
cat output/media-pipeline/MEDIA_PIPELINE.md > /dev/null && echo "✓ MEDIA_PIPELINE.md exists" || echo "✗ MISSING"
cat output/media-pipeline/shared/PHOTOREALISTIC_PROMPT_GUIDE.md > /dev/null && echo "✓ PHOTOREALISTIC_PROMPT_GUIDE.md exists" || echo "✗ MISSING"
cat output/media-pipeline/shared/ENFORCEMENT_CHECKLIST.md > /dev/null && echo "✓ ENFORCEMENT_CHECKLIST.md exists" || echo "✗ MISSING"
cat output/media-pipeline/shared/REJECTION_CRITERIA.md > /dev/null && echo "✓ REJECTION_CRITERIA.md exists" || echo "✗ MISSING"
cat output/media-pipeline/shared/QUICK_REFERENCE_CARDS.md > /dev/null && echo "✓ QUICK_REFERENCE_CARDS.md exists" || echo "✗ MISSING"
```

**Expected**: All 5 files exist ✓

### 1.2 Agent SOP Documents

```bash
cat prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md > /dev/null && echo "✓ RESEARCH_AGENT.md exists" || echo "✗ MISSING"
cat prompts/agents/roles/media-pipeline/MEDIA_AGENT.md > /dev/null && echo "✓ MEDIA_AGENT.md exists" || echo "✗ MISSING"
cat prompts/agents/roles/media-pipeline/QUALITY_AGENT.md > /dev/null && echo "✓ QUALITY_AGENT.md exists" || echo "✗ MISSING"
```

**Expected**: All 3 files exist ✓

### 1.3 Agent Policies Updated

```bash
grep -q "Media Pipeline Standards" prompts/agents/AGENT_POLICIES.md && echo "✓ Media Pipeline Standards section exists" || echo "✗ MISSING section"
```

**Expected**: Section exists ✓

---

## Part 2: Enforcement Mechanism Verification

### 2.1 Research Agent Enforcement

Check that RESEARCH_AGENT.md contains required sections:

```bash
echo "=== RESEARCH_AGENT.md Enforcement Checks ==="
grep -q "MANDATORY: Read Before Starting" prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md && echo "✓ Mandatory reading section" || echo "✗ MISSING"
grep -q "PHOTOREALISTIC_PROMPT_GUIDE" prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md && echo "✓ References prompt guide" || echo "✗ MISSING"
grep -q "Camera model" prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md && echo "✓ Camera requirement documented" || echo "✗ MISSING"
grep -q "Lens specification" prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md && echo "✓ Lens requirement documented" || echo "✗ MISSING"
grep -q "Negative prompt" prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md && echo "✓ Negative prompt requirement" || echo "✗ MISSING"
grep -q "Pre-Handoff Enforcement Checklist" prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md && echo "✓ Pre-handoff checklist" || echo "✗ MISSING"
grep -q "Asset Target" prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md && echo "✓ Asset Target requirement" || echo "✗ MISSING"
```

**Expected**: All 7 checks pass ✓

### 2.2 Media Agent Enforcement

Check that MEDIA_AGENT.md contains required sections:

```bash
echo "=== MEDIA_AGENT.md Enforcement Checks ==="
grep -q "MANDATORY: Read Before Starting" prompts/agents/roles/media-pipeline/MEDIA_AGENT.md && echo "✓ Mandatory reading section" || echo "✗ MISSING"
grep -q "PHOTOREALISTIC_PROMPT_GUIDE" prompts/agents/roles/media-pipeline/MEDIA_AGENT.md && echo "✓ References prompt guide" || echo "✗ MISSING"
grep -q "Step 2.5" prompts/agents/roles/media-pipeline/MEDIA_AGENT.md && echo "✓ Verification checkpoint step" || echo "✗ MISSING"
grep -q "ENFORCEMENT CHECKPOINT" prompts/agents/roles/media-pipeline/MEDIA_AGENT.md && echo "✓ Enforcement checkpoint label" || echo "✗ MISSING"
grep -q "Cost-Optimized Strategy" prompts/agents/roles/media-pipeline/MEDIA_AGENT.md && echo "✓ Cost optimization section" || echo "✗ MISSING"
grep -q "Stable Diffusion" prompts/agents/roles/media-pipeline/MEDIA_AGENT.md && echo "✓ SD for drafts documented" || echo "✗ MISSING"
grep -q "AI Artifact Self-Check" prompts/agents/roles/media-pipeline/MEDIA_AGENT.md && echo "✓ Self-check section" || echo "✗ MISSING"
grep -q "Skin texture" prompts/agents/roles/media-pipeline/MEDIA_AGENT.md && echo "✓ Photorealism checks included" || echo "✗ MISSING"
```

**Expected**: All 8 checks pass ✓

### 2.3 Quality Agent Enforcement

Check that QUALITY_AGENT.md contains required sections:

```bash
echo "=== QUALITY_AGENT.md Enforcement Checks ==="
grep -q "MANDATORY: Read Before Starting" prompts/agents/roles/media-pipeline/QUALITY_AGENT.md && echo "✓ Mandatory reading section" || echo "✗ MISSING"
grep -q "REJECTION_CRITERIA" prompts/agents/roles/media-pipeline/QUALITY_AGENT.md && echo "✓ References rejection criteria" || echo "✗ MISSING"
grep -q "Iteration Tracking" prompts/agents/roles/media-pipeline/QUALITY_AGENT.md && echo "✓ Iteration tracking section" || echo "✗ MISSING"
grep -q "3 iterations" prompts/agents/roles/media-pipeline/QUALITY_AGENT.md && echo "✓ Max 3 iterations documented" || echo "✗ MISSING"
grep -q "Pass/Fail" prompts/agents/roles/media-pipeline/QUALITY_AGENT.md && echo "✓ Pass/fail criteria table" || echo "✗ MISSING"
grep -q "AUTOMATIC REJECTION" prompts/agents/roles/media-pipeline/QUALITY_AGENT.md && echo "✓ Automatic rejection rule" || echo "✗ MISSING"
grep -q "Failure Action" prompts/agents/roles/media-pipeline/QUALITY_AGENT.md && echo "✓ Failure actions documented" || echo "✗ MISSING"
```

**Expected**: All 7 checks pass ✓

### 2.4 Cross-Reference Validation

```bash
echo "=== Cross-Reference Checks ==="
grep -c "PHOTOREALISTIC_PROMPT_GUIDE" prompts/agents/roles/media-pipeline/*.md
# Expected: At least 3 (one per agent)

grep -c "REJECTION_CRITERIA" output/media-pipeline/shared/ENFORCEMENT_CHECKLIST.md
# Expected: At least 1

grep -c "camera\|Camera" output/media-pipeline/shared/QUICK_REFERENCE_CARDS.md
# Expected: Multiple occurrences
```

---

## Part 3: Folder Structure Verification

### 3.1 Pipeline Folder Structure

```bash
echo "=== Pipeline Folder Structure ==="
ls -d output/media-pipeline/research-agent/inbox 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/research-agent/inbox"
ls -d output/media-pipeline/research-agent/done 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/research-agent/done"
ls -d output/media-pipeline/media-agent/inbox 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/media-agent/inbox"
ls -d output/media-pipeline/media-agent/workspace 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/media-agent/workspace"
ls -d output/media-pipeline/media-agent/done 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/media-agent/done"
ls -d output/media-pipeline/quality-agent/inbox 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/quality-agent/inbox"
ls -d output/media-pipeline/quality-agent/workspace 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/quality-agent/workspace"
ls -d output/media-pipeline/quality-agent/done 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/quality-agent/done"
ls -d output/media-pipeline/shared/briefs 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/shared/briefs"
ls -d output/media-pipeline/shared/assets 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/shared/assets"
ls -d output/media-pipeline/shared/approved 2>/dev/null && echo "✓" || echo "✗ Create: mkdir -p output/media-pipeline/shared/approved"
```

### 3.2 Create Missing Folders (If Needed)

```bash
mkdir -p output/media-pipeline/research-agent/{inbox,outbox,workspace,done}
mkdir -p output/media-pipeline/media-agent/{inbox,outbox,workspace,done}
mkdir -p output/media-pipeline/quality-agent/{inbox,outbox,workspace,done}
mkdir -p output/media-pipeline/shared/{briefs,assets,approved,feedback,references,metrics}
```

---

## Part 4: End-to-End Pipeline Test (Manual)

### 4.1 Create Test Request

```bash
cat > output/media-pipeline/research-agent/inbox/TEST-pipeline-validation.txt << 'EOF'
PROJECT: Pipeline Validation Test
TYPE: SaaS Application
STYLE: Modern, minimal, professional
ASSET TARGET: TEMPLATE

ASSETS NEEDED:
- 1 hero image (1920x1080) - Person using laptop
- 1 feature icon (64x64) - Dashboard chart icon

PURPOSE: End-to-end pipeline validation test
EOF

echo "✓ Test request created"
```

### 4.2 Research Agent Test

**Activate with:**
```
Read prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md and create an asset brief for the test project in your inbox.
```

**Verification Points:**
- [ ] Agent reads PHOTOREALISTIC_PROMPT_GUIDE.md first
- [ ] Asset Target is specified (TEMPLATE in this case)
- [ ] Hero image prompt includes camera model (e.g., "Canon EOS R5")
- [ ] Hero image prompt includes lens (e.g., "85mm f/1.4")
- [ ] Hero image prompt includes lighting description
- [ ] Hero image prompt includes photography style
- [ ] Negative prompt is included
- [ ] Brief saved to `output/media-pipeline/shared/briefs/`
- [ ] Brief copied to Media Agent inbox
- [ ] Pre-handoff checklist completed in response

### 4.3 Media Agent Test

**Activate with:**
```
Read prompts/agents/roles/media-pipeline/MEDIA_AGENT.md and generate assets from the brief in your inbox.
```

**Verification Points:**
- [ ] Agent reads PHOTOREALISTIC_PROMPT_GUIDE.md first
- [ ] Agent verifies prompt has all 5 required elements (Step 2.5)
- [ ] Agent uses cost-optimized strategy (SD for draft, not DALL-E)
- [ ] Agent performs self-check on generated images
- [ ] AI artifact self-check documented (7 items)
- [ ] Asset manifest created with metadata
- [ ] Generation settings documented (model, steps, CFG)
- [ ] Handoff to Quality Agent inbox

### 4.4 Quality Agent Test

**Activate with:**
```
Read prompts/agents/roles/media-pipeline/QUALITY_AGENT.md and review the assets waiting in your inbox.
```

**Verification Points:**
- [ ] Agent reads REJECTION_CRITERIA.md first
- [ ] Iteration count noted (should be "1 of 3")
- [ ] Photorealism checklist applied (7 items)
- [ ] Any failures trigger automatic rejection (not just lower score)
- [ ] Scoring only happens if photorealism passes
- [ ] Decision made based on score thresholds
- [ ] Feedback uses rejection template format
- [ ] If approved, correct handoff agent identified (Template Agent for TEMPLATE assets)

### 4.5 Rejection Flow Test (If Quality Fails)

**Verification Points:**
- [ ] Feedback file created in Media Agent inbox
- [ ] Iteration incremented (now "2 of 3")
- [ ] Specific prompt fix suggestions included
- [ ] Media Agent regenerates with fixes
- [ ] Max 3 iterations enforced

### 4.6 Integration Handoff Test

**If assets approved, verify:**
- [ ] Assets copied to `output/media-pipeline/shared/approved/`
- [ ] APPROVAL.txt created
- [ ] For TEMPLATE assets: Handoff to Template Agent inbox
- [ ] For PROJECT assets: Handoff to Website Agent inbox
- [ ] INTEGRATE.txt includes correct instructions

---

## Part 5: Quick Smoke Tests

### 5.1 Prompt Formula Verification

The following prompt should include ALL required elements:

```
Expected format:
[Subject] + shot on [Camera] [Lens] + [Lighting] + [Photography Style] + [Negative Prompt]

Example to verify:
"Professional woman working on laptop in modern office, 
shot on Canon EOS R5 85mm f/1.4, 
natural window light from left, 
editorial lifestyle photography, 
Negative prompt: cartoon, CGI, plastic skin, oversaturated..."
```

### 5.2 Quick Rejection Test

The following issues should trigger automatic rejection:
- [ ] Plastic/waxy skin → REJECT
- [ ] Wrong number of fingers → REJECT
- [ ] Vacant/lifeless eyes → REJECT
- [ ] Inconsistent lighting → REJECT
- [ ] HDR-overdone colors → REJECT
- [ ] Stock photo generic feel → REJECT

### 5.3 Cost Optimization Verification

```bash
echo "Cost optimization rules:"
echo "- ALL drafts: Stable Diffusion (✓ correct)"
echo "- ALL iterations: Stable Diffusion (✓ correct)"
echo "- Final hero ONLY: DALL-E 3 (✓ correct)"
echo "- Never use DALL-E for iterations (✓ documented)"
```

---

## Part 6: Metrics and Logging

### 6.1 Metrics File Setup

```bash
# Create metrics tracking file if not exists
mkdir -p output/media-pipeline/shared/metrics
if [ ! -f output/media-pipeline/shared/metrics/pipeline-log.csv ]; then
  echo "date,project,research_time,generation_time,review_time,iterations,approved_count,total_count,cost" > output/media-pipeline/shared/metrics/pipeline-log.csv
  echo "✓ Metrics file created"
else
  echo "✓ Metrics file exists"
fi
```

### 6.2 Quality Metrics Setup

```bash
if [ ! -f output/media-pipeline/shared/metrics/quality-log.csv ]; then
  echo "date,project,total_assets,approved_first,revisions_needed,avg_score,iterations_used" > output/media-pipeline/shared/metrics/quality-log.csv
  echo "✓ Quality metrics file created"
else
  echo "✓ Quality metrics file exists"
fi
```

---

## Test Results Summary

| Test Category | Total Checks | Passed | Failed |
|---------------|--------------|--------|--------|
| Documentation Existence | 9 | __ | __ |
| Research Agent Enforcement | 7 | __ | __ |
| Media Agent Enforcement | 8 | __ | __ |
| Quality Agent Enforcement | 7 | __ | __ |
| Folder Structure | 11 | __ | __ |
| E2E Pipeline Flow | 25+ | __ | __ |
| **TOTAL** | **67+** | __ | __ |

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Missing camera/lens in prompt | Research Agent must include per checklist |
| DALL-E used for iterations | Media Agent must use SD for cost optimization |
| Failed images passed to Quality | Media Agent self-check not performed |
| Score given despite photorealism fail | Quality Agent must reject automatically |
| Wrong handoff agent | Check Asset Target (TEMPLATE vs PROJECT) |
| No iteration tracking | Quality Agent must note "X of 3" |

---

## Test Completion Checklist

- [ ] All documentation exists
- [ ] All enforcement sections present in SOPs
- [ ] Folder structure created
- [ ] E2E test completed successfully
- [ ] Rejection flow tested
- [ ] Metrics files created
- [ ] Test request cleaned up

---

## Cleanup After Test

```bash
# Remove test files
rm -f output/media-pipeline/research-agent/inbox/TEST-pipeline-validation.txt
rm -rf output/media-pipeline/shared/assets/TEST-*
rm -rf output/media-pipeline/shared/approved/TEST-*
echo "✓ Test files cleaned up"
```

---

*Created by Testing Agent | 2025-12-23*
*Reference: output/documentation-agent/outbox/media-pipeline-audit-report.txt*

