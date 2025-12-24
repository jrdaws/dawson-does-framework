# Asset Brief: E2E Test SaaS Dashboard

> Created: 2025-12-23 | Research Agent
> Status: Ready for Media Agent

---

## Project Context

- **Asset Target**: TEMPLATE
- **Template Path**: `templates/saas/public/`
- **App Type**: SaaS Dashboard
- **Brand Style**: Modern, minimal, professional
- **Primary Color**: #6366F1 (Indigo)
- **Accent Color**: #10B981 (Emerald)
- **Background**: Light #FFFFFF / Dark #0A0A0A
- **Target Audience**: B2B professionals, startup founders, developers
- **Design Inspiration**: Linear, Vercel, Raycast

### Asset Target Explanation
- **TEMPLATE**: These assets go to starter templates for all future projects
- **Handoff**: Template Agent → `templates/saas/public/images/`

---

## Required Assets

### Category 1: Hero Images

| Asset | Dimensions | Format | Style Notes | Priority |
|-------|-----------|--------|-------------|----------|
| hero-workspace | 1920x1080 | WebP | Professional workspace with laptop showing dashboard, indigo/emerald accent lighting | P1 |
| hero-workspace-mobile | 750x1000 | WebP | Cropped/recomposed version for mobile | P1 |

### Category 2: Feature Icons

| Asset | Dimensions | Format | Style Notes | Priority |
|-------|-----------|--------|-------------|----------|
| icon-analytics | 64x64 | SVG | Analytics/chart icon, outline style, 2px stroke, #6366F1 | P1 |
| icon-analytics-2x | 128x128 | SVG | Same icon, 2x for retina | P2 |

### Category 3: Empty States

| Asset | Dimensions | Format | Style Notes | Priority |
|-------|-----------|--------|-------------|----------|
| empty-state-data | 400x300 | WebP | Friendly illustration for empty data state, minimal, indigo palette | P1 |

---

## Generation Prompts

### hero-workspace

**Prompt:**
```
Professional MacBook Pro displaying modern analytics dashboard interface on a minimal Scandinavian desk setup, sleek workspace with subtle indigo accent lighting from desk lamp, morning natural light from large window on left side, shot on Canon EOS R5 with 35mm f/1.4 lens, shallow depth of field with soft bokeh on background, clean minimal interior design with neutral tones and greenery, tech startup aesthetic, commercial interior photography, subtle Lightroom color grade with lifted shadows, professional workspace environment, high-end advertising quality, 8K resolution

Color reference: Indigo #6366F1 accent visible in ambient lighting, Emerald #10B981 visible in plant or subtle decoration

Negative prompt: cartoon, illustration, 3d render, CGI, anime, painting, drawing, oversaturated, plastic, waxy, unrealistic, artificial, stock photo generic, perfect symmetry, uncanny valley, airbrushed, HDR overdone, bad anatomy, distorted features, cluttered desk, cheap furniture, fake screen mockup, obvious placeholder dashboard, text watermark, signature, busy background, distracting elements, harsh shadows, amateur photography
```

**Camera/Lens Specifications:**
- Camera: Canon EOS R5
- Lens: 35mm f/1.4 (wide angle for environmental shot)
- Aperture: f/1.4-2.8 (shallow depth of field)
- ISO: 100-400 (clean, low noise)

**Lighting Specifications:**
- Primary: Natural window light from left (soft, diffused morning light)
- Secondary: Warm desk lamp accent with indigo gel/filter effect
- Fill: Ambient bounce from white walls
- Style: High-key with soft shadows, commercial interior photography

**Post-Processing:**
- Color grade: Subtle, clean, VSCO-style with lifted shadows
- Contrast: Medium, not harsh
- Saturation: Natural, slightly muted (avoid AI oversaturation)

---

### hero-workspace-mobile

**Prompt:**
```
Cropped close-up view of MacBook Pro screen displaying modern analytics dashboard, minimal desk surface visible, morning natural window light creating soft highlights on screen bezels, shot on Canon EOS R5 with 50mm f/1.4 lens, tight composition for mobile display, professional product photography, clean and minimal aesthetic, subtle indigo ambient lighting, editorial tech photography, vertical composition emphasis

Negative prompt: cartoon, illustration, 3d render, CGI, anime, oversaturated, plastic screen, fake mockup, obvious placeholder, text watermark, cluttered, busy background, amateur photography, harsh lighting, HDR overdone
```

**Camera/Lens Specifications:**
- Camera: Canon EOS R5
- Lens: 50mm f/1.4 (tighter framing)
- Aperture: f/2.0 (sharper screen focus)

**Lighting Specifications:**
- Primary: Natural window light from left
- Style: Clean product photography lighting

---

### icon-analytics

**Style Specification (SVG - Not AI Generated):**
```
SVG icon design specification:
- Style: Outline/stroke-based, 2px stroke width
- Color: Stroke #6366F1 (Indigo primary)
- Background: Transparent
- Concept: Bar chart with upward trend line
- Corner radius: 2px for chart bars
- Grid: 64x64 with 4px padding

Design notes:
- Three vertical bars at different heights (ascending)
- Optional: trend line overlay
- Optional: small dot/circle data point accent
- Keep stroke consistent at 2px
- Round stroke-linecap: round
- Match style of Lucide or Heroicons (outline variant)
```

**Reference:** Lucide icons, Heroicons (outline), Radix Icons

---

### icon-analytics-2x

Same specifications as icon-analytics, scaled to 128x128 grid with 8px padding.

---

### empty-state-data

**Prompt:**
```
Minimal abstract illustration of empty data visualization concept, soft indigo and emerald color palette on clean white background, geometric shapes suggesting empty chart or graph placeholder, subtle shadows and depth, modern flat design with slight 3D elements, premium SaaS aesthetic, friendly and approachable mood, clean vector-style illustration, professional software UI empty state design, Linear app inspired aesthetic, minimal and sophisticated

Color palette:
- Primary: #6366F1 (Indigo) for main shapes
- Accent: #10B981 (Emerald) for subtle highlights
- Neutral: #E5E5E5 and #F5F5F5 for shadows and background elements
- Background: Pure white or very subtle gradient

Negative prompt: cartoon characters, mascots, people, hands, faces, childish, cluttered, busy, too many colors, harsh contrasts, 3d realistic, photorealistic, text, words, complex scenes, overwhelming detail, amateurish, clipart style, outdated design, generic stock illustration
```

**Style Specifications:**
- Type: Abstract geometric illustration (not photorealistic)
- Aesthetic: Modern SaaS empty state (Linear, Notion, Figma style)
- Mood: Friendly, approachable, not frustrating
- Elements: Simplified chart/data shapes, subtle floating elements
- Technique: Soft shadows, clean edges, premium feel

**Reference:** 
- Linear app empty states
- Notion placeholder illustrations
- Figma empty canvas designs

---

## File Naming Convention

```
templates/saas/public/images/
├── hero/
│   ├── hero-workspace.webp
│   └── hero-workspace-mobile.webp
├── icons/
│   ├── icon-analytics.svg
│   └── icon-analytics-2x.svg
└── empty-states/
    └── empty-state-data.webp
```

---

## Quality Criteria

### All Assets
- [ ] Colors match brand palette (within 5% variance)
- [ ] No text in generated images (add via code)
- [ ] Consistent style across all assets
- [ ] Optimized file sizes (<500KB for WebP, <10KB for SVG)

### Photorealistic Images (hero-workspace)
- [ ] Natural skin texture if people visible (not waxy/plastic)
- [ ] Realistic lighting with consistent direction
- [ ] Colors not oversaturated (natural tones)
- [ ] Background has appropriate bokeh, no artifacts
- [ ] Screen content looks realistic (not obviously fake)
- [ ] Overall feel: Would believe this is a real photo

### Icons (SVG)
- [ ] Consistent stroke width (2px)
- [ ] Correct color (#6366F1)
- [ ] Clean paths (no unnecessary nodes)
- [ ] Proper viewBox sizing

### Empty State Illustration
- [ ] Matches brand color palette
- [ ] Friendly, not frustrating mood
- [ ] Premium feel (not clipart)
- [ ] Works on both light and dark backgrounds

---

## Standard Negative Prompt Reference

Include with ALL photorealistic prompts:
```
Negative prompt: cartoon, illustration, 3d render, CGI, anime, painting, drawing,
oversaturated, plastic skin, waxy, unrealistic, artificial, stock photo generic,
perfect symmetry, uncanny valley, airbrushed, HDR overdone, bad anatomy,
distorted features, extra limbs, malformed hands, text, watermark, signature
```

---

## Pre-Handoff Checklist ✓

### Photorealistic Prompt Requirements
- [x] Read PHOTOREALISTIC_PROMPT_GUIDE.md at session start
- [x] Asset Target specified (TEMPLATE)
- [x] Every prompt includes camera model (Canon EOS R5)
- [x] Every prompt includes lens (35mm f/1.4, 50mm f/1.4)
- [x] Every prompt includes lighting (natural window light, accent desk lamp)
- [x] Every prompt has negative prompts (anti-AI-tells list)

### Brief Quality
- [x] All required asset types identified (3 types, 5 assets)
- [x] Dimensions specified for each asset
- [x] Style notes align with design tokens
- [x] Generation prompts are detailed and specific
- [x] Priority levels assigned (P1/P2)
- [x] Quality criteria defined

---

## Notes for Media Agent

1. **This is a test run** - Keep it minimal to validate pipeline
2. **Hero image is critical** - This validates photorealistic prompt quality
3. **Icon can be sourced** - Consider using Lucide icon if generation isn't needed
4. **Empty state is illustration** - Different generation approach than photos
5. **Verify indigo/emerald** - Brand colors must be visible but not overwhelming

---

*Brief created by Research Agent | Ready for Media Agent pickup*

