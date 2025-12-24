# Asset Brief: E2E Test Project

## Project Context
- **Asset Target**: TEMPLATE
- **Template Name**: saas
- **App Type**: SaaS Application
- **Brand Style**: Modern, minimal (Linear.app, Vercel.com, Raycast.com inspired)
- **Primary Colors**:
  - Light mode: #0070f3 (primary), #6366f1 (secondary), #10b981 (accent)
  - Dark mode: #3b82f6 (primary), #818cf8 (secondary), #34d399 (accent)
- **Target Audience**: B2B software users, developers, product teams
- **Design Aesthetic**: Clean, high-contrast, professional, tech-forward

### Asset Target Explanation
- **TEMPLATE**: Assets go to starter templates (for all future projects)
  - Handoff: Template Agent → `templates/saas/public/`
- This is a test asset to validate the end-to-end media pipeline

## Required Assets

### Category 1: Hero Images
| Asset | Dimensions | Format | Style Notes | Priority |
|-------|-----------|--------|-------------|----------|
| hero-main | 1920x1080 | WebP | Modern SaaS workspace, photorealistic, editorial style | P1 |

## Reference Images

**Style References:**
- Linear.app hero sections - clean, minimal, tech-focused
- Vercel.com photography - modern, professional, authentic moments
- Raycast.com visual language - high-contrast, focused on workflow

**Color Palette Application:**
- Muted neutral backgrounds (#f5f5f5 light, #262626 dark)
- Subtle blue accent highlights (#0070f3)
- Professional, not oversaturated
- Real-world lighting, not artificial studio look

## Generation Prompts

### hero-main

**Subject Context:** This is the primary hero image for a modern SaaS template. It should convey professionalism, productivity, and modern tech workspace culture without being generic stock photography.

**Full Photorealistic Prompt:**

```
Professional developer working on code in modern minimal workspace,
candid moment of focused concentration, authentic working environment,
shot on Sony A7R IV with 35mm f/1.4 lens, shallow depth of field,
natural window light from left creating soft shadows, clean minimal desk setup,
MacBook Pro with external monitor showing terminal and code editor,
muted neutral color palette with subtle blue accent lighting,
contemporary tech startup aesthetic, uncluttered background,
editorial lifestyle photography style, genuine workspace not staged,
professional color grading with subtle desaturation,
magazine quality composition, modern SaaS brand photography
```

**Negative Prompt:**

```
Negative prompt: cartoon, illustration, 3d render, CGI, anime, painting, drawing,
oversaturated, plastic skin, waxy, unrealistic, artificial, stock photo generic,
perfect symmetry, too clean, uncanny valley, airbrushed, overprocessed,
HDR overdone, blurry background artifacts, bad anatomy, distorted features,
extra limbs, malformed hands, text on screen, watermark, signature, logo,
staged pose, fake smile, costume-like clothing, unnaturally perfect lighting,
floating objects, wrong perspective, cluttered desk, busy background,
obvious mockup, cheap looking desk, amateur photography
```

**Technical Specifications:**
- **Camera**: Sony A7R IV
- **Lens**: 35mm f/1.4 (environmental portrait, context + subject)
- **Lighting**: Natural window light from left (soft, directional)
- **Photography Style**: Editorial lifestyle, documentary
- **Color Grade**: Professional, subtle desaturation, muted tones
- **Depth of Field**: Shallow (f/1.4) with natural bokeh
- **Composition**: Environmental portrait showing workspace context

**Quality Requirements:**
- Natural skin texture visible (no waxy/plastic appearance)
- Realistic eye reflections and catchlights
- Consistent lighting direction with natural shadows
- Colors match brand palette (muted neutrals with blue accent)
- Background appropriately blurred but recognizable as real workspace
- No text artifacts or unrealistic elements
- File size optimized: target <500KB after compression

## Quality Criteria

### Photorealistic Requirements ✓
- [ ] Camera model specified (Sony A7R IV)
- [ ] Lens specification included (35mm f/1.4)
- [ ] Lighting description detailed (natural window light)
- [ ] Photography style referenced (editorial lifestyle)
- [ ] Negative prompts included (anti-AI-tells)

### Technical Quality ✓
- [ ] Colors match brand palette (within 5% variance)
- [ ] No text in generated images (screens can show abstract code/UI)
- [ ] Consistent style with modern SaaS aesthetic
- [ ] Optimized file size (<500KB for WebP)
- [ ] Dimensions exact: 1920x1080px
- [ ] Format: WebP with fallback

### Composition Quality ✓
- [ ] Natural, candid moment (not posed)
- [ ] Clean, uncluttered workspace
- [ ] Appropriate depth of field
- [ ] Professional but authentic feel
- [ ] Aligns with Linear/Vercel/Raycast aesthetic

### Pre-Generation Checklist ✓
- [ ] Photorealistic prompt guide read and applied
- [ ] All mandatory prompt elements included
- [ ] Negative prompts comprehensive
- [ ] Style matches design tokens
- [ ] Asset target confirmed (TEMPLATE)
- [ ] Handoff path identified (Template Agent → templates/saas/public/)

## Handoff Instructions

**Media Agent Tasks:**
1. Generate hero-main using the photorealistic prompt above
2. Verify quality against photorealistic checklist
3. Optimize to WebP format (<500KB)
4. Place in: `output/media-pipeline/media-agent/outbox/test-e2e/hero-main.webp`
5. Create asset manifest with metadata

**Template Agent Handoff:**
- Source: `output/media-pipeline/media-agent/outbox/test-e2e/`
- Destination: `templates/saas/public/images/`
- Filename: `hero-main.webp`

## Success Metrics

This E2E test validates:
- Research Agent → Media Agent → Template Agent pipeline flow
- Photorealistic prompt engineering applied correctly
- Asset quality meets professional standards
- File optimization and format conversion
- Correct handoff to template destination

**Expected Outcome:**
A single hero image that:
1. Passes photorealistic quality check
2. Matches brand aesthetic (modern SaaS minimal)
3. Successfully integrates into saas template
4. Serves as quality benchmark for future pipeline assets

---

**Research Agent Notes:**
- This brief was created following RESEARCH_AGENT.md SOP v1.0
- Photorealistic prompt guide applied (PHOTOREALISTIC_PROMPT_GUIDE.md)
- Design tokens referenced from templates/saas/design/tokens.json
- All mandatory prompt elements included and verified

**Created:** 2025-12-23
**Pipeline Stage:** Research → Media (Ready for handoff)
