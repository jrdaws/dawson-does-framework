# Asset Brief Template

> Copy this template when creating new asset briefs

---

# Asset Brief: [PROJECT NAME]

**Created**: YYYY-MM-DD
**Created By**: Research Agent
**Status**: Draft | Ready for Generation | In Progress | Complete

---

## Project Context

| Field | Value |
|-------|-------|
| **Asset Target** | [TEMPLATE / PROJECT] |
| **App Type** | [SaaS / E-commerce / Landing / Blog / Mobile] |
| **App Name** | [Name of the application] |
| **Template Name** | [saas / landing / etc. - if TEMPLATE] |
| **Project Path** | [path to project - if PROJECT] |
| **Brand Style** | [Modern / Minimal / Playful / Corporate / Bold / Elegant] |
| **Target Audience** | [Description of who will use this] |

### Asset Target Explanation
- **TEMPLATE**: Assets will be added to starter templates (used by all future projects)
  - Handoff to: Template Agent
  - Destination: `templates/[template-name]/public/`
- **PROJECT**: Assets for a specific user's generated app
  - Handoff to: Website Agent
  - Destination: User's project folder

### Color Palette
*From design tokens or specified:*

| Role | Color | Hex |
|------|-------|-----|
| Primary | [Name] | #XXXXXX |
| Secondary | [Name] | #XXXXXX |
| Accent | [Name] | #XXXXXX |
| Background | [Name] | #XXXXXX |
| Text | [Name] | #XXXXXX |

### Typography Reference
- **Headings**: [Font Family]
- **Body**: [Font Family]
- **Style**: [Weights, sizing notes]

---

## Required Assets

### Category 1: Hero Images

| ID | Asset Name | Dimensions | Format | Priority | Style Notes |
|----|------------|------------|--------|----------|-------------|
| hero-001 | hero-main | 1920x1080 | WebP | P1 | [Description] |
| hero-002 | hero-mobile | 750x1334 | WebP | P1 | [Description] |

**Generation Prompt for hero-001** (MUST use photorealistic formula):
```
[Subject description], shot on [Camera Model] with [Lens mm f/stop],
[Lighting description], [Photography style], [Color grade/post-processing]

Negative prompt: cartoon, illustration, 3d render, CGI, anime, 
oversaturated, plastic skin, waxy, stock photo generic, perfect symmetry,
uncanny valley, HDR overdone, malformed hands, bad anatomy
```

**Example (copy and adapt):**
```
Professional woman working on MacBook Pro in modern co-working space,
candid focused expression, shot on Canon EOS R5 with 85mm f/1.4 lens,
natural window light from left side, shallow depth of field with soft bokeh,
editorial lifestyle photography, subtle Lightroom color grade

Negative prompt: cartoon, illustration, 3d render, CGI, anime, 
oversaturated, plastic skin, waxy, stock photo generic, perfect symmetry,
uncanny valley, HDR overdone, malformed hands, bad anatomy, vacant stare
```

### Category 2: Icons

| ID | Asset Name | Dimensions | Format | Priority | Style Notes |
|----|------------|------------|--------|----------|-------------|
| icon-001 | icon-dashboard | 64x64 | SVG | P1 | Outline, 2px stroke |
| icon-002 | icon-users | 64x64 | SVG | P1 | Outline, 2px stroke |

**Generation Prompt for icons**:
```
[Icon generation prompt - may be batch prompt for consistency]
```

### Category 3: Illustrations

| ID | Asset Name | Dimensions | Format | Priority | Style Notes |
|----|------------|------------|--------|----------|-------------|
| illust-001 | empty-state | 400x300 | SVG/PNG | P2 | Minimal, friendly |

**Generation Prompt for illust-001**:
```
[Illustration generation prompt]
```

### Category 4: Backgrounds/Patterns

| ID | Asset Name | Dimensions | Format | Priority | Style Notes |
|----|------------|------------|--------|----------|-------------|
| bg-001 | gradient-hero | 1920x1080 | WebP | P2 | Subtle gradient |

---

## Reference Images

*Include links or descriptions of style references:*

1. **Style Reference**: [URL or description]
2. **Color Reference**: [URL or description]
3. **Composition Reference**: [URL or description]

---

## Quality Criteria

### Must Have
- [ ] Colors within 5% of brand palette
- [ ] No visible AI artifacts
- [ ] No text in generated images
- [ ] Consistent style across all assets
- [ ] Correct dimensions as specified

### Should Have
- [ ] Optimized file sizes (<500KB images, <10KB icons)
- [ ] WebP format for photos
- [ ] SVG format for icons/simple graphics

### Nice to Have
- [ ] Multiple variations for A/B testing
- [ ] Dark mode versions
- [ ] Animated versions (if applicable)

---

## Technical Specifications

| Spec | Requirement |
|------|-------------|
| Max file size (images) | 500KB |
| Max file size (icons) | 10KB |
| Image format | WebP (with PNG fallback) |
| Icon format | SVG preferred |
| Color space | sRGB |
| Resolution | 2x for retina |

---

## Delivery Checklist

- [ ] All P1 assets delivered
- [ ] Asset manifest created
- [ ] Files properly named
- [ ] Optimized versions provided
- [ ] Generation prompts documented

---

## Notes

[Any additional context, constraints, or special requirements]

