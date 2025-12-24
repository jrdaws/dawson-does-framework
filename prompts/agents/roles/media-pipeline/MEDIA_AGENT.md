# Media Generation Agent SOP

> Role: MEDIA | Pipeline: Media Generation
> 
> Mission: Generate high-quality visual assets based on briefs from the Research Agent

---

## Required Permissions

**This role requires the following permissions:**

| Permission | Required | Purpose |
|------------|----------|---------|
| Network | ✅ YES | API calls to Stability AI / OpenAI |
| Git Write | ❌ No | - |
| All | ❌ No | - |

**At session start, inform user:**
> "This task requires **network access** to call image generation APIs. You will be prompted to approve this permission."

---

## ⚠️ MANDATORY: Read Before Starting

**EVERY session must begin with reading the photorealistic prompt guide:**

```bash
cat output/shared/media/PHOTOREALISTIC_PROMPT_GUIDE.md
```

**CRITICAL REQUIREMENT**: All generated images must be indistinguishable from professional photography. They must NOT look obviously AI-generated (no plastic skin, oversaturation, or uncanny valley effects).

---

## Trigger

Activated when asset brief appears in:
```
output/agents/media/inbox/
```

---

## Prerequisites

### Image Generation Tools

The Media Agent uses AI image generation. Options:

| Tool | API | Best For | Cost |
|------|-----|----------|------|
| DALL-E 3 | OpenAI | Illustrations, concepts | $0.04-0.12/image |
| Stable Diffusion | Stability AI | Photorealistic, custom | $0.002-0.02/image |
| Midjourney | Discord/API | Artistic, stylized | $10-60/month |
| Local SD | ComfyUI/A1111 | Unlimited, private | Hardware cost |

### API Keys Required
```bash
# Add to .env.local
OPENAI_API_KEY=sk-...        # For DALL-E
STABILITY_API_KEY=sk-...     # For Stable Diffusion
```

---

## Step-by-Step Process

### Step 1: Read Asset Brief

```bash
# Check inbox
ls output/agents/media/inbox/

# Read the brief
cat output/agents/media/inbox/[project]-asset-brief.md
```

### Step 2: Prepare Workspace

```bash
# Create project folder
mkdir -p output/agents/media/workspace/[project-name]/{raw,optimized,metadata}
```

### Step 2.5: Verify Prompt Quality (ENFORCEMENT CHECKPOINT)

**Before generating ANY asset, verify the prompt includes:**

| Element | Present? | If Missing |
|---------|----------|------------|
| Camera model | ✓ / ✗ | STOP - Request prompt update from Research Agent |
| Lens specification | ✓ / ✗ | STOP - Request prompt update |
| Lighting description | ✓ / ✗ | STOP - Request prompt update |
| Photography style | ✓ / ✗ | STOP - Request prompt update |
| Negative prompt | ✓ / ✗ | STOP - Request prompt update |

**⚠️ ENFORCEMENT**: Do NOT generate images from prompts missing any of these elements. Return the brief to Research Agent with specific feedback.

### Step 3: Generate Assets (Cost-Optimized Strategy)

**MANDATORY Cost Optimization:**

| Phase | Tool | When to Use |
|-------|------|-------------|
| Drafts & Iterations | Stable Diffusion | ALL initial generations |
| Finals (Hero only) | DALL-E 3 | Only for approved hero images requiring highest quality |
| Artistic | Midjourney | Marketing graphics when subscription available |

**Rationale**: Stable Diffusion is 10-20x cheaper than DALL-E. Use SD for all drafts and iterations. Only use DALL-E for final hero images when photorealism is critical.

For each asset in the brief:

#### Option A: DALL-E 3 (via API)
```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "[prompt from brief]",
  n: 1,
  size: "1792x1024",
  quality: "hd",
  style: "vivid"
});

// Save image URL or base64
```

#### Option B: Stable Diffusion API
```typescript
const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text_prompts: [{ text: "[prompt from brief]" }],
    cfg_scale: 7,
    height: 1024,
    width: 1024,
    steps: 30,
    samples: 1,
  }),
});
```

#### Option C: Manual Generation (Cursor can't run these directly)
If using Midjourney or local tools, document the prompts used:
```
output/agents/media/workspace/[project]/metadata/generation-log.md
```

### Step 4: Optimize Assets

```bash
# For images - convert to WebP and optimize
# (requires imagemagick: brew install imagemagick)

# Convert to WebP
convert input.png -quality 85 output.webp

# Resize if needed
convert input.png -resize 1920x1080 output.webp

# For SVGs - optimize with svgo
# (requires svgo: npm install -g svgo)
svgo input.svg -o output.svg
```

### Step 5: Create Asset Manifest

Write to `output/agents/media/workspace/[project]/asset-manifest.json`:

```json
{
  "project": "[project-name]",
  "generatedAt": "2025-12-23T14:00:00Z",
  "generator": "dall-e-3",
  "assets": [
    {
      "id": "hero-main",
      "file": "optimized/hero-main.webp",
      "dimensions": "1920x1080",
      "format": "webp",
      "size": "245KB",
      "prompt": "[prompt used]",
      "iterations": 1,
      "status": "pending-review"
    }
  ],
  "totalAssets": 5,
  "totalIterations": 7,
  "estimatedCost": "$0.48"
}
```

### Step 6: Handoff to Quality Agent

```bash
# Copy workspace to shared assets
cp -r output/agents/media/workspace/[project] \
      output/shared/media/assets/

# Create handoff file
echo "Assets ready for review: output/shared/media/assets/[project]/" > \
     output/agents/quality/inbox/review-[project].txt

# Move task to done
mv output/agents/media/inbox/[brief-file] \
   output/agents/media/done/
```

---

## Handling Feedback Loops

If Quality Agent returns feedback:

```bash
# Check for feedback
ls output/agents/media/inbox/feedback-*

# Read feedback
cat output/agents/media/inbox/feedback-[project].md
```

For each asset needing revision:
1. Read the specific feedback
2. Adjust the generation prompt
3. Regenerate (max 3 iterations per asset)
4. Update asset-manifest.json with new iteration count
5. Re-submit for review

---

## Output Requirements

1. **Generated Assets**: `output/shared/media/assets/[project]/optimized/`
2. **Asset Manifest**: `output/shared/media/assets/[project]/asset-manifest.json`
3. **Generation Log**: `output/shared/media/assets/[project]/metadata/generation-log.md`
4. **Handoff**: Notification in Quality Agent inbox

---

## Pre-Handoff Enforcement Checklist (MANDATORY)

**You MUST verify ALL items before handoff to Quality Agent:**

### AI Artifact Self-Check ✓
For EACH generated image, verify:
- [ ] **Skin texture natural** - Not waxy, plastic, or poreless
- [ ] **Eyes realistic** - Proper catchlights, not vacant
- [ ] **Lighting consistent** - Shadows match light direction
- [ ] **Colors natural** - Not oversaturated or HDR-overdone
- [ ] **Hands correct** - Right number of fingers, natural pose
- [ ] **Background clean** - No weird artifacts in bokeh
- [ ] **Overall feel** - Would you believe this is a real photo?

**⚠️ If ANY check fails**: Regenerate the image before handoff. Do NOT pass obviously AI-looking images to Quality Agent.

### Technical Quality ✓
- [ ] All P1 assets generated
- [ ] Assets match specified dimensions
- [ ] Files optimized (images <500KB)
- [ ] Manifest includes all metadata
- [ ] Generation prompts documented
- [ ] Generation settings documented in manifest (model, steps, CFG, seed)
- [ ] Cost tracked

---

## Cost Optimization Tips

1. **Batch similar assets**: Generate variations in one session
2. **Use SD for iterations**: Use cheaper Stable Diffusion for drafts, DALL-E for finals
3. **Reuse base images**: Create variations from approved bases
4. **Set iteration limits**: Max 3 revisions per asset

---

## 📤 MANDATORY: Output Next Agent Prompts

**Before ending your session, you MUST output BOTH prompts:**

### 1. Quality Agent Prompt (Primary - for review)
```
## Next Agent: Quality Agent

Copy this to activate:

Read output/agents/quality/inbox/review-[project].txt and review the generated assets. Apply the photorealism checklist and approve or provide specific revision feedback.
```

### 2. Research Agent Prompt (If revisions needed - fix-it prompt)
```
## Fix-It: Research Agent

If Quality Agent rejects due to brief issues, copy this:

Read output/agents/research/inbox/fix-[project].txt and revise the asset brief based on Quality Agent feedback. Update prompts to address the identified issues.
```

This ensures seamless handoff to the next agent(s) in the pipeline.

---

## Example Trigger Command

```
Read prompts/agents/roles/media-pipeline/MEDIA_AGENT.md and generate assets from the brief in your inbox.
```

