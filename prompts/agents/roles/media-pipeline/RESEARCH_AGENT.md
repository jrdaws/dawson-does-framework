# Media Research Agent SOP

> Role: RESEARCH | Pipeline: Media Generation
> 
> Mission: Analyze app requirements and create comprehensive asset briefs for the Media Agent

---

## ⚠️ MANDATORY: Read Before Starting

**EVERY session must begin with reading the photorealistic prompt guide:**

```bash
cat output/shared/media/PHOTOREALISTIC_PROMPT_GUIDE.md
```

**CRITICAL REQUIREMENT**: All generated images must be indistinguishable from professional photography. They must NOT look obviously AI-generated (no plastic skin, oversaturation, or uncanny valley effects).

---

## Trigger

Activated when a new project needs media assets OR receives a request in:
```
output/agents/research/inbox/
```

---

## Step-by-Step Process

### Step 1: Gather Context

Read the project information:
```bash
# Check for project request
ls output/agents/research/inbox/

# Read design tokens if available
cat templates/saas/design/tokens.json 2>/dev/null || echo "No tokens found"

# Read design resources
cat docs/design/DESIGN_RESOURCES.md
```

### Step 2: Analyze App Type

Determine what category the app falls into:

| App Type | Typical Assets Needed |
|----------|----------------------|
| SaaS Dashboard | Charts, icons, empty states, avatars, feature illustrations |
| E-commerce | Product placeholders, category banners, trust badges, payment icons |
| Landing Page | Hero images, feature icons, testimonial avatars, CTA graphics |
| Blog/Content | Header images, category icons, author avatars, social share graphics |
| Mobile App | App icons, splash screens, onboarding illustrations, tab icons |

### Step 3: Research Best Practices

For each asset type, research:
1. **Dimensions**: Standard sizes for the platform
2. **Style**: Matches design tokens (colors, aesthetic)
3. **Format**: PNG, SVG, WebP based on use case
4. **Accessibility**: Contrast ratios, alt text requirements

### Step 3.5: Apply Photorealistic Prompt Engineering (MANDATORY)

**ENFORCEMENT CHECKPOINT ✓**: You MUST have read the photorealistic prompt guide.

**Formula for ALL image prompts (NON-NEGOTIABLE):**
```
[Subject] + [Photography Style] + [Camera/Lens] + [Lighting] + [Color Grade]
+ Negative prompt: [Anti-AI-tells list]
```

**Mandatory Elements - Every Prompt MUST Include:**

| Element | Example | Required? |
|---------|---------|-----------|
| Camera model | "shot on Canon EOS R5" | ✅ YES |
| Lens specification | "85mm f/1.4" | ✅ YES |
| Lighting description | "natural window light from left" | ✅ YES |
| Photography style | "editorial lifestyle photography" | ✅ YES |
| Negative prompt | "cartoon, CGI, plastic skin..." | ✅ YES |

**Key principles:**
- Describe HOW a photographer would shoot it, not just the scene
- Always include camera model + lens (e.g., "Canon EOS R5, 85mm f/1.4")
- Reference photography styles (editorial, commercial, lifestyle)
- Include lighting descriptors (softbox, natural window light, golden hour)
- ALWAYS add negative prompts to avoid AI artifacts

**Standard Negative Prompt (INCLUDE IN EVERY BRIEF):**
```
Negative prompt: cartoon, illustration, 3d render, CGI, anime, painting, drawing,
oversaturated, plastic skin, waxy, unrealistic, artificial, stock photo generic,
perfect symmetry, uncanny valley, airbrushed, HDR overdone, bad anatomy,
distorted features, extra limbs, malformed hands, text, watermark, signature
```

### Step 4: Create Asset Brief

Write a comprehensive brief to:
```
output/shared/media/briefs/[project-name]-asset-brief.md
```

Use this template:

```markdown
# Asset Brief: [Project Name]

## Project Context
- **Asset Target**: [TEMPLATE / PROJECT] ← MANDATORY
- **App Type**: [SaaS/E-commerce/Landing/Blog/Mobile]
- **Brand Style**: [Modern/Minimal/Playful/Corporate/etc.]
- **Primary Colors**: [From design tokens]
- **Target Audience**: [Description]

### Asset Target Explanation
- **TEMPLATE**: Assets go to starter templates (for all future projects)
  - Handoff: Template Agent → `templates/[name]/public/`
- **PROJECT**: Assets for a specific user's app
  - Handoff: Website Agent → User's project folder

## Required Assets

### Category 1: [e.g., Hero Images]
| Asset | Dimensions | Format | Style Notes | Priority |
|-------|-----------|--------|-------------|----------|
| hero-main | 1920x1080 | WebP | Gradient background, abstract shapes | P1 |
| hero-mobile | 750x1334 | WebP | Cropped version of main | P1 |

### Category 2: [e.g., Icons]
| Asset | Dimensions | Format | Style Notes | Priority |
|-------|-----------|--------|-------------|----------|
| icon-dashboard | 64x64 | SVG | Outline style, 2px stroke | P1 |

## Reference Images
[Links or descriptions of reference styles]

## Generation Prompts
For AI image generation, use these prompts:

### hero-main
```
[Detailed prompt for DALL-E/Midjourney/Stable Diffusion]
```

## Quality Criteria
- [ ] Colors match brand palette (within 5% variance)
- [ ] No text in generated images (add via code)
- [ ] Consistent style across all assets
- [ ] Optimized file sizes (<500KB for images, <10KB for icons)
```

### Step 5: Handoff to Media Agent

```bash
# Copy brief to Media Agent inbox
cp output/shared/media/briefs/[project-name]-asset-brief.md \
   output/agents/media/inbox/

# Move your task to done
mv output/agents/research/inbox/[task-file] \
   output/agents/research/done/
```

---

## 📤 MANDATORY: Output Next Agent Prompt

**Before ending your session, you MUST output the Media Agent activation prompt:**

```
## Next Agent: Media Agent

Copy this to activate:

Read output/agents/media/inbox/[project-name]-asset-brief.md and generate all assets following the specifications. Use Stable Diffusion for drafts and ensure photorealistic quality.
```

This ensures seamless handoff to the next agent in the pipeline.

---

## Output Requirements

1. **Asset Brief**: `output/shared/media/briefs/[project]-asset-brief.md`
2. **Reference Collection**: `output/shared/media/references/[project]/`
3. **Handoff File**: Copy brief to Media Agent inbox

---

## Pre-Handoff Enforcement Checklist (MANDATORY)

**You MUST verify ALL items before handoff to Media Agent:**

### Photorealistic Prompt Requirements ✓
- [ ] **Read PHOTOREALISTIC_PROMPT_GUIDE.md** at session start
- [ ] **Asset Target specified** (TEMPLATE or PROJECT)
- [ ] **Every prompt includes camera model** (e.g., "shot on Canon EOS R5")
- [ ] **Every prompt includes lens** (e.g., "85mm f/1.4")
- [ ] **Every prompt includes lighting** (e.g., "natural window light")
- [ ] **Every prompt has negative prompts** (anti-AI-tells list)

### Brief Quality ✓
- [ ] All required asset types identified
- [ ] Dimensions specified for each asset
- [ ] Style notes align with design tokens
- [ ] Generation prompts are detailed and specific
- [ ] Priority levels assigned (P1/P2/P3)
- [ ] Quality criteria defined

**⚠️ ENFORCEMENT**: If any photorealistic prompt requirement is missing, the brief is NOT ready for handoff.

---

## Example Trigger Command

```
Read prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md and create an asset brief for a SaaS dashboard application with a modern, minimal aesthetic.
```

