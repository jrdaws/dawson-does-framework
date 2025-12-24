# Media Generation Pipeline

> Version: 1.0.0 | Last Updated: 2025-12-23

---

## Overview

A 3-agent system for generating high-quality visual assets for web applications.

```
                                                                      ┌─────────────┐
                                                              ┌──────▶│  TEMPLATE   │
                                                              │       │    AGENT    │
                                                              │       │ (templates) │
┌─────────────┐         ┌─────────────┐         ┌─────────────┐       └─────────────┘
│  RESEARCH   │────────▶│    MEDIA    │────────▶│   QUALITY   │
│   AGENT     │         │    AGENT    │         │    AGENT    │       ┌─────────────┐
│             │         │             │         │  (approve)  │──────▶│   WEBSITE   │
│ Analyzes    │         │ Generates   │         └─────────────┘       │    AGENT    │
│ requirements│         │ assets      │                │              │ (projects)  │
└─────────────┘         └─────────────┘                │              └─────────────┘
                               ▲                       │
                               │      Feedback Loop    │
                               └───────────────────────┘
                                   (max 3 iterations)
```

---

## Pipeline Flow

### Phase 1: Research (Research Agent)
**Input**: Project request or app description
**Output**: Comprehensive asset brief with prompts

1. Analyze app type (SaaS, E-commerce, Landing, etc.)
2. Research design requirements
3. Create detailed asset brief
4. Define AI generation prompts
5. Handoff to Media Agent

### Phase 2: Generation (Media Agent)
**Input**: Asset brief from Research Agent
**Output**: Generated and optimized assets

1. Read asset brief
2. Generate assets using AI tools (DALL-E, SD, etc.)
3. Optimize for web (compression, format conversion)
4. Create asset manifest
5. Handoff to Quality Agent

### Phase 3: Quality Review (Quality Agent)
**Input**: Generated assets + original brief
**Output**: Approved assets OR feedback for revision

1. Compare assets against brief requirements
2. Score on Visual Quality, Brand Alignment, Technical specs
3. If approved (≥90 score): Move to approved folder + handoff to Template Agent
4. If revisions needed: Send feedback to Media Agent
5. Max 3 iteration loops

### Phase 4: Integration (Varies by Asset Type)

Assets can be integrated into two different targets:

#### Option A: Template Assets (Template Agent)
**For**: Assets that become part of starter templates (used by all future projects)
**Handoff to**: Template Agent
**Destination**: `templates/[template]/public/`

1. Receive approved assets in `output/template-agent/inbox/media-[project]/`
2. Copy to appropriate template folders
3. Update component imports
4. Verify display in templates
5. Commit changes to template

#### Option B: Project Assets (Website Agent)
**For**: Assets for a specific user's generated app/website
**Handoff to**: Website Agent
**Destination**: User's project folder

1. Receive approved assets in `output/website-agent/inbox/media-[project]/`
2. For platform-hosted: Upload to storage (UploadThing/Supabase)
3. For exported: Copy to project's `public/` folder
4. Update component references
5. Verify display in app

---

## Folder Structure

```
output/media-pipeline/
├── research-agent/
│   ├── inbox/          # Incoming requests
│   ├── outbox/         # Completed briefs (copy)
│   ├── workspace/      # Active work
│   └── done/           # Archived tasks
├── media-agent/
│   ├── inbox/          # Asset briefs + feedback
│   ├── outbox/         # Generated assets (copy)
│   ├── workspace/      # Active generation
│   └── done/           # Completed tasks
├── quality-agent/
│   ├── inbox/          # Review requests
│   ├── outbox/         # Approval/feedback
│   ├── workspace/      # Review reports
│   └── done/           # Completed reviews
└── shared/
    ├── briefs/         # All asset briefs
    ├── assets/         # Generated assets (in progress)
    ├── approved/       # Final approved assets
    ├── feedback/       # Feedback history
    └── references/     # Reference images/styles
```

---

## Quick Start

### 1. Start a New Asset Project

Create a request file:
```bash
cat > output/media-pipeline/research-agent/inbox/new-project.txt << 'EOF'
PROJECT: My SaaS Dashboard
TYPE: SaaS Application
STYLE: Modern, minimal, professional
COLORS: Use design tokens from templates/saas/design/tokens.json
NEEDED:
- Hero image for landing page
- 6 feature icons
- Empty state illustrations
- User avatars (placeholder set)
EOF
```

### 2. Activate Research Agent

```
Read prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md and create an asset brief for the project in your inbox.
```

### 3. Activate Media Agent (After Brief Ready)

```
Read prompts/agents/roles/media-pipeline/MEDIA_AGENT.md and generate assets from the brief in your inbox.
```

### 4. Activate Quality Agent (After Assets Generated)

```
Read prompts/agents/roles/media-pipeline/QUALITY_AGENT.md and review the assets waiting in your inbox.
```

---

## Image Generation Options

| Tool | Cost/Image | Pros | Cons | Best For |
|------|-----------|------|------|----------|
| **Stable Diffusion API** | $0.002-0.02 | ✅ Cheapest, fast | Less coherent | Icons, iterations, bulk |
| **DALL-E 3** | $0.04-0.12 | High quality | Most expensive API | Final hero images |
| **Midjourney** | ~$0.02-0.10* | Artistic, beautiful | Requires Discord | Marketing graphics |
| **Local SD (ComfyUI)** | Free | Unlimited | Needs GPU setup | High volume, privacy |

*Midjourney: $10/month for ~200 images

### Recommended Cost-Optimized Strategy
1. **All iterations & drafts**: Stable Diffusion API (10-20x cheaper than DALL-E)
2. **Final hero images only**: DALL-E 3 (when quality is critical)
3. **Artistic/marketing**: Midjourney (subscription model)
4. **High volume**: Local Stable Diffusion (one-time GPU cost)

---

## Quality Scoring System

| Score | Status | Action |
|-------|--------|--------|
| 90-100 | ✅ Approved | Move to approved folder |
| 70-89 | ⚠️ Minor Revisions | Send specific feedback |
| 50-69 | 🔄 Major Revisions | Regenerate with new prompt |
| <50 | ❌ Rejected | Back to Research for new approach |

---

## Integration with Framework

### After Approval

Assets are automatically integrated:

```bash
# Copy to template
cp -r output/media-pipeline/shared/approved/[project]/* \
      templates/saas/public/images/

# Update design tokens if needed
# Reference in components
```

### Template Integration

```tsx
// In template component
import heroImage from '@/public/images/hero-main.webp';

export function Hero() {
  return <Image src={heroImage} alt="Dashboard hero" priority />;
}
```

---

## Automation Options

### Manual (Current)
Activate each agent sequentially via copy-paste commands.

### Semi-Automated
Add to Keyboard Maestro or create a script:

```bash
#!/bin/bash
# scripts/run-media-pipeline.sh

echo "Step 1: Research Agent"
# ... wait for completion ...

echo "Step 2: Media Agent"
# ... wait for completion ...

echo "Step 3: Quality Agent"
# ... review and loop if needed ...
```

### Future: API Integration
When the ai-agent package supports image generation:

```typescript
import { generateMediaAssets } from '@dawson-does/ai-agent';

const assets = await generateMediaAssets({
  projectName: 'My SaaS',
  appType: 'saas-dashboard',
  style: 'modern-minimal',
  designTokens: './templates/saas/design/tokens.json',
});
```

---

## Cost Estimation

| Project Size | Assets | Stable Diffusion API | DALL-E 3 | Savings |
|--------------|--------|---------------------|----------|---------|
| Small (Landing) | 5-10 | **$0.02-0.20** | $0.40-1.20 | 85-95% |
| Medium (SaaS) | 15-25 | **$0.15-0.50** | $1.20-3.00 | 80-90% |
| Large (E-commerce) | 30-50 | **$0.30-1.00** | $2.40-6.00 | 85-90% |

*Includes 2x iterations average*

**Cost-Optimized Approach:**
- Use Stable Diffusion for ALL assets: $0.30-1.00 for medium project
- Use DALL-E only for 2-3 critical hero images: +$0.24-0.36
- **Total**: ~$0.50-1.50 vs $1.20-3.00 (50-60% savings)

---

## Metrics Tracking

Log all pipeline runs to:
```
output/media-pipeline/shared/metrics/pipeline-log.csv
```

Format:
```csv
date,project,research_time,generation_time,review_time,iterations,approved,cost
2025-12-23,saas-dashboard,15min,45min,20min,2,8/10,$1.44
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API rate limits | Add delays, use multiple API keys |
| Inconsistent styles | Use style reference images, seed locking |
| Wrong dimensions | Add explicit size prompts, post-process |
| Brand color mismatch | Use color correction, inpainting |
| AI artifacts | Add negative prompts, upscale + fix |

---

## Related Documents

- `prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md`
- `prompts/agents/roles/media-pipeline/MEDIA_AGENT.md`
- `prompts/agents/roles/media-pipeline/QUALITY_AGENT.md`
- `docs/design/DESIGN_RESOURCES.md`
- `templates/saas/design/tokens.json`

