# Asset Brief: Framework Website UI Redesign

> Created: 2025-12-23 | Research Agent
> Priority: P1 - HIGH
> Status: Ready for Media Agent

---

## Project Context

### Objective
Create assets for a comprehensive UI redesign of the dawson-does-framework website. The new design must be a **WORKING CLONE** that maintains 100% feature parity with the current site, but with a more user-friendly, clean, and modern aesthetic.

### Asset Target
- **Type**: PROJECT (specific website redesign)
- **Destination**: `website/public/images/`
- **Handoff**: Website Agent for implementation

### Current vs New Direction

| Element | Current | New Direction |
|---------|---------|---------------|
| Theme | Terminal/Hacker (green #00ff41 on black #0a0e14) | Clean Modern (light/dark toggle) |
| Typography | Monospace heavy (JetBrains Mono) | Sans-serif primary, mono for code only |
| Colors | Green + Cyan on dark | Neutral grays + vibrant accent system |
| Layout | Dense, technical | Spacious, breathable, modern |
| Tone | Hacker/Technical | Professional + Approachable |
| Effects | Scanlines, CRT, glowing | Subtle gradients, smooth animations |

### Target Audience
1. **Beginners**: Need approachable, clear UI - not intimidating
2. **Enterprise**: Need professional, trustworthy aesthetic
3. **Developers**: Need technical credibility without "hacker" gatekeeping

### Design Inspiration
- **Vercel.com**: Clean, minimal, powerful
- **Linear.app**: Polished, fast, modern
- **Supabase.com**: Developer-friendly, clear
- **Railway.app**: Simple, approachable
- **Stripe.com**: Trust-building, professional

---

## Color Palette Proposal

### Primary Palette

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Background | #FFFFFF | #0A0A0A | Page background |
| Foreground | #171717 | #EDEDED | Primary text |
| Muted | #F5F5F5 | #262626 | Secondary backgrounds |
| Border | #E5E5E5 | #333333 | Borders, dividers |

### Accent Colors

| Name | Value | Usage |
|------|-------|-------|
| Primary | #6366F1 (Indigo) | CTAs, links, primary actions |
| Secondary | #8B5CF6 (Violet) | Hover states, secondary elements |
| Success | #10B981 (Emerald) | Success states, checkmarks |
| Warning | #F59E0B (Amber) | Warnings, cautions |
| Error | #EF4444 (Red) | Errors, destructive actions |

### Gradient Palette

```css
/* Hero gradient - subtle, professional */
--gradient-hero: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);

/* Card hover gradient - elegant */
--gradient-card: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);

/* Background mesh gradient */
--gradient-mesh: radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                 radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
```

### Accessibility
- All text: WCAG AA minimum (4.5:1 contrast ratio)
- Large text: 3:1 minimum
- Interactive elements: Clear focus states

---

## Typography Recommendations

### Font Stack

```css
/* Headings */
font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;

/* Body */
font-family: 'Inter', 'SF Pro Text', system-ui, sans-serif;

/* Code */
font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

### Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | 4.5rem (72px) | 700 | 1.1 | Hero headline |
| H1 | 3rem (48px) | 700 | 1.2 | Section titles |
| H2 | 2rem (32px) | 600 | 1.3 | Subsections |
| H3 | 1.5rem (24px) | 600 | 1.4 | Card titles |
| Body | 1rem (16px) | 400 | 1.6 | Paragraphs |
| Small | 0.875rem (14px) | 400 | 1.5 | Captions, meta |
| Code | 0.875rem (14px) | 500 | 1.6 | Code blocks |

---

## Required Assets (18 Total)

### Category 1: Hero Section (4 assets)

| Asset | Dimensions | Format | Priority |
|-------|-----------|--------|----------|
| hero-gradient-bg | 1920x1080 | WebP | P1 |
| hero-gradient-bg-mobile | 750x1334 | WebP | P1 |
| hero-abstract-graphic | 800x600 | SVG | P1 |
| hero-mesh-pattern | 1920x1080 | SVG | P2 |

### Category 2: Feature Icons (6 assets)

| Asset | Dimensions | Format | Priority |
|-------|-----------|--------|----------|
| icon-templates | 64x64 | SVG | P1 |
| icon-plugins | 64x64 | SVG | P1 |
| icon-providers | 64x64 | SVG | P1 |
| icon-trust | 64x64 | SVG | P1 |
| icon-cli | 64x64 | SVG | P1 |
| icon-extensible | 64x64 | SVG | P1 |

### Category 3: Demo/Screenshot Assets (3 assets)

| Asset | Dimensions | Format | Priority |
|-------|-----------|--------|----------|
| terminal-mockup-clean | 1200x800 | WebP | P1 |
| dashboard-preview | 1200x800 | WebP | P2 |
| code-editor-visual | 800x600 | WebP | P2 |

### Category 4: Trust & Social Proof (3 assets)

| Asset | Dimensions | Format | Priority |
|-------|-----------|--------|----------|
| avatar-placeholder-1 | 80x80 | WebP | P1 |
| avatar-placeholder-2 | 80x80 | WebP | P1 |
| avatar-placeholder-3 | 80x80 | WebP | P1 |

### Category 5: UI Elements (2 assets)

| Asset | Dimensions | Format | Priority |
|-------|-----------|--------|----------|
| section-divider | 1920x100 | SVG | P2 |
| footer-pattern | 1920x400 | SVG | P2 |

---

## Generation Prompts

### hero-gradient-bg

**Prompt:**
```
Subtle abstract gradient background for modern SaaS website hero section, 
soft indigo (#6366F1) to violet (#8B5CF6) gradient with organic flowing shapes,
professional and premium aesthetic, suitable for text overlay,
minimal design with sophisticated depth, smooth color transitions,
high-resolution texture without noise, modern 2024 design trends,
corporate presentation quality, Vercel/Linear inspired aesthetic,
clean and not busy, elegant simplicity

Negative prompt: busy, cluttered, harsh colors, 90s design, clip art, 
amateur, overdesigned, distracting patterns, text, logos, icons,
photorealistic, people, faces, hands, objects, realistic elements
```

**Design Specifications:**
- Style: Abstract gradient with subtle organic shapes
- Colors: Indigo #6366F1 → Violet #8B5CF6
- Texture: Smooth, subtle grain for depth
- Purpose: Hero section background, must work with white text overlay

---

### hero-gradient-bg-mobile

**Prompt:**
```
Mobile-optimized abstract gradient background for SaaS website hero,
vertical composition emphasizing center-focus gradient,
indigo (#6366F1) to violet (#8B5CF6) soft transition,
minimal organic shapes, professional premium aesthetic,
portrait orientation optimized, suitable for mobile text overlay,
clean sophisticated depth, modern minimal design

Negative prompt: busy, cluttered, harsh colors, landscape elements,
text, logos, photorealistic, distracting patterns, amateur design
```

**Design Specifications:**
- Style: Same as desktop but vertical composition
- Dimensions: 750x1334 (mobile viewport)
- Focus: Center gradient concentration for content overlay area

---

### hero-abstract-graphic

**Style Specification (Vector):**
```
Abstract geometric illustration for SaaS hero section,
interconnected nodes and lines suggesting workflow/automation,
clean vector style with indigo (#6366F1) and violet (#8B5CF6) accents,
subtle 3D depth with soft shadows, modern tech aesthetic,
minimal and sophisticated, Linear app inspired design,
floating geometric shapes suggesting speed and efficiency,
professional developer tool visual metaphor

Color palette:
- Primary shapes: #6366F1 (Indigo)
- Secondary: #8B5CF6 (Violet) 
- Accent details: #10B981 (Emerald)
- Background elements: #F5F5F5 (light) or #262626 (dark)

Negative prompt: realistic, photographic, clipart, cartoon mascots,
busy complexity, too many colors, childish, amateurish, stock illustration
```

**Design Specifications:**
- Type: Vector illustration (SVG preferred)
- Style: Abstract geometric, tech workflow metaphor
- Mood: Fast, efficient, modern, professional

---

### hero-mesh-pattern

**Style Specification (SVG Pattern):**
```
SVG mesh gradient pattern for website background texture,
subtle dot grid or line pattern, very low opacity (5-10%),
creates depth without distraction, geometric precision,
works on both light and dark backgrounds,
modern minimal aesthetic, Vercel-inspired subtle pattern

Pattern specifications:
- Grid: 40px x 40px cells
- Elements: Small dots (2px) or thin lines (1px)
- Opacity: 5-10% for subtlety
- Colors: #6366F1 at low opacity
```

---

### Feature Icons (icon-templates, icon-plugins, icon-providers, icon-trust, icon-cli, icon-extensible)

**Style Specification (SVG Icon Set):**
```
Set of 6 feature icons for modern SaaS website,
consistent outline style with 2px stroke weight,
rounded line caps and joins for friendliness,
24x24 base grid scaling to 64x64,
single color: #6366F1 (Indigo) for strokes,
optional fill at 10% opacity for depth,
clean minimal aesthetic matching Lucide/Heroicons style

Individual icons:
1. icon-templates: Stack of layered cards/documents
2. icon-plugins: Puzzle piece or plug connector
3. icon-providers: Connected nodes/integration symbol
4. icon-trust: Shield with checkmark
5. icon-cli: Terminal/command prompt window
6. icon-extensible: Modular blocks or gear/cog

Stroke specifications:
- Weight: 2px
- Linecap: round
- Linejoin: round
- Grid: 24x24 with 2px padding
- Viewbox: 0 0 24 24

Negative prompt: filled/solid icons, inconsistent weights,
sharp corners, realistic 3D, complex details, multiple colors
```

**Reference:** Lucide Icons, Heroicons Outline, Radix Icons

---

### terminal-mockup-clean

**Prompt:**
```
Clean modern terminal window mockup on minimal light gray background,
macOS-style window chrome with red/yellow/green dots,
terminal content showing framework CLI commands in action,
shot on Hasselblad H6D medium format camera, 90mm lens,
professional product photography lighting with soft even illumination,
subtle shadow underneath for depth, high-end advertising quality,
clean gradient background transitioning from #F5F5F5 to #FFFFFF,
tech startup aesthetic, premium quality, Apple-style product shot

Screen content suggestions:
- Dark terminal background (#1E1E1E)
- Green/cyan text for commands
- Clean monospace font
- Framework install and export commands visible

Negative prompt: cartoon, CGI, 3d render, floating, wrong shadows,
amateur photography, cheap looking, oversaturated, unrealistic materials,
cluttered background, fake screen content, obvious placeholder text
```

**Camera/Lens Specifications:**
- Camera: Hasselblad H6D (medium format for detail)
- Lens: 90mm (product photography standard)
- Lighting: Professional studio softbox, even illumination
- Style: Apple-style product photography

---

### dashboard-preview

**Prompt:**
```
Modern SaaS dashboard interface displayed on laptop screen,
clean analytics dashboard with charts and metrics,
minimal desk setup with premium MacBook Pro,
shot on Canon EOS R5 with 50mm f/1.4 lens,
natural window light from left creating soft highlights,
shallow depth of field with soft bokeh background,
professional tech workspace, modern minimal aesthetic,
editorial lifestyle photography, authentic environment

Dashboard content suggestions:
- Clean white background with subtle grid
- Simple bar/line charts in indigo (#6366F1)
- Metric cards with numbers
- Clean sidebar navigation

Negative prompt: fake screen, obvious mockup, cluttered desk,
oversaturated, plastic, cartoon, CGI, cheap furniture,
amateur photography, unrealistic perspective, stock photo generic
```

**Camera/Lens Specifications:**
- Camera: Canon EOS R5
- Lens: 50mm f/1.4
- Lighting: Natural window light, soft diffused
- Style: Editorial lifestyle, authentic workspace

---

### code-editor-visual

**Prompt:**
```
Clean code editor interface showing TypeScript/JavaScript code,
modern dark theme with syntax highlighting,
displayed on minimal monitor or laptop screen,
shot on Sony A7R IV with 85mm f/1.8 lens,
professional product photography lighting,
clean desk environment visible in shallow depth of field,
tech developer workspace aesthetic, premium quality,
code visible but not distracting, focus on aesthetic

Code content suggestions:
- Dark editor theme (VS Code dark)
- Syntax highlighting in blues, greens, oranges
- Clean sidebar with file tree
- Minimal editor chrome

Negative prompt: messy code, errors visible, cluttered screen,
amateur photography, fake mockup, cartoon, CGI, oversaturated
```

**Camera/Lens Specifications:**
- Camera: Sony A7R IV
- Lens: 85mm f/1.8
- Lighting: Professional studio + ambient mix
- Style: Tech product photography

---

### Avatar Placeholders (avatar-placeholder-1, 2, 3)

**Prompt Template:**
```
Professional headshot portrait of [VARIATION] person,
diverse representation, friendly genuine smile,
modern professional attire, casual smart style,
shot on Canon EOS R5 with 85mm f/1.4 lens,
natural window light from front-left creating soft catchlights,
shallow depth of field with creamy bokeh background,
editorial portrait photography, magazine quality,
authentic expression not posed, corporate but approachable,
subtle Lightroom color grade, natural skin tones preserved

Variations:
1. avatar-placeholder-1: Man in 30s, dark hair, tech casual
2. avatar-placeholder-2: Woman in 30s, professional, diverse
3. avatar-placeholder-3: Person in 40s, senior/leadership vibe

Negative prompt: stock photo, posed fake smile, plastic skin,
oversaturated, HDR overdone, costume-like clothing, mannequin,
uncanny valley, airbrushed poreless skin, unnatural pose,
cartoon, illustration, CGI, perfect symmetry
```

**Camera/Lens Specifications:**
- Camera: Canon EOS R5
- Lens: 85mm f/1.4 (portrait standard)
- Aperture: f/1.4-2.0 (creamy bokeh)
- Lighting: Natural window light, soft diffused
- Style: Editorial corporate portrait

---

### section-divider

**Style Specification (SVG):**
```
Subtle wave or curve SVG divider for section transitions,
gentle organic curve, not aggressive,
works in both light (#E5E5E5) and dark (#333333) modes,
fluid minimal aesthetic, modern web design trend,
subtle gradient fill optional (indigo at 5% opacity)

Specifications:
- Width: 100vw (1920px reference)
- Height: 80-120px
- Style: Single fluid curve or subtle wave
- Fill: Background color with slight tint
```

---

### footer-pattern

**Style Specification (SVG):**
```
Subtle geometric pattern for footer background,
dot grid or subtle line pattern at very low opacity,
creates visual interest without distraction,
works on dark footer background (#0A0A0A),
modern minimal aesthetic, premium feel

Specifications:
- Pattern: Dot grid (4px dots, 40px spacing) OR subtle lines
- Opacity: 3-5%
- Color: #6366F1 (Indigo) or #FFFFFF
- Creates depth without distraction
```

---

## File Naming Convention

```
website/public/images/redesign/
├── hero/
│   ├── hero-gradient-bg.webp
│   ├── hero-gradient-bg-mobile.webp
│   ├── hero-abstract-graphic.svg
│   └── hero-mesh-pattern.svg
├── icons/
│   ├── icon-templates.svg
│   ├── icon-plugins.svg
│   ├── icon-providers.svg
│   ├── icon-trust.svg
│   ├── icon-cli.svg
│   └── icon-extensible.svg
├── screenshots/
│   ├── terminal-mockup-clean.webp
│   ├── dashboard-preview.webp
│   └── code-editor-visual.webp
├── avatars/
│   ├── avatar-placeholder-1.webp
│   ├── avatar-placeholder-2.webp
│   └── avatar-placeholder-3.webp
└── patterns/
    ├── section-divider.svg
    └── footer-pattern.svg
```

---

## Quality Criteria

### All Assets
- [ ] Colors match proposed palette (within 5% variance)
- [ ] No text in generated images (add via code)
- [ ] Consistent style across all assets
- [ ] Optimized file sizes (<500KB for WebP, <15KB for SVG)
- [ ] Works in both light and dark mode contexts

### Photorealistic Images (screenshots, avatars)
- [ ] Natural skin texture if people visible (not waxy/plastic)
- [ ] Realistic lighting with consistent direction
- [ ] Colors not oversaturated (natural tones)
- [ ] Background has appropriate bokeh, no artifacts
- [ ] Screen content looks realistic (not obviously fake)
- [ ] Would believe this is a real photo

### Vector Graphics (icons, patterns)
- [ ] Consistent stroke width (2px for icons)
- [ ] Correct colors from palette
- [ ] Clean paths (no unnecessary nodes)
- [ ] Proper viewBox sizing
- [ ] Scales well at multiple sizes

### Gradient Backgrounds
- [ ] Smooth transitions, no banding
- [ ] Subtle, not overwhelming
- [ ] Works with text overlay (check contrast)
- [ ] Consistent across light/dark mode variants

---

## Section Mapping (Feature Parity Check)

| Current Section | Redesign Section | Assets Needed |
|-----------------|------------------|---------------|
| Hero (ASCII + Terminal) | Hero (Gradient + Graphic) | hero-gradient-bg, hero-abstract-graphic |
| Features Grid (6 cards) | Features Grid (6 cards) | 6 feature icons |
| Demo Toggle | Demo Toggle | terminal-mockup-clean |
| Before/After | Before/After | code-editor-visual (optional) |
| Testimonials (4) | Testimonials (4) | 3 avatar-placeholders |
| CTA Section | CTA Section | No new assets (reuse hero) |
| Footer | Footer | footer-pattern |

### Features Maintained (100% Parity)
- [x] Animated terminal typing effect
- [x] 6 feature cards with icons
- [x] Beginner/Advanced toggle
- [x] Before/After code comparison
- [x] 4 Testimonial quotes
- [x] Footer with navigation
- [x] Responsive mobile design
- [x] Static export ready
- [x] WCAG AA accessible

---

## Standard Negative Prompt Reference

**For all photorealistic prompts, include:**
```
Negative prompt: cartoon, illustration, 3d render, CGI, anime, painting, drawing,
oversaturated, plastic skin, waxy, unrealistic, artificial, stock photo generic,
perfect symmetry, uncanny valley, airbrushed, HDR overdone, bad anatomy,
distorted features, extra limbs, malformed hands, text, watermark, signature
```

**For avatars/portraits, add:**
```
Negative prompt: ... mannequin-like, expressionless, vacant stare,
unnatural pose, stiff posture, fake smile, over-retouched,
poreless skin, plastic hair, costume-like clothing
```

---

## Pre-Handoff Checklist ✓

### Photorealistic Prompt Requirements
- [x] Read PHOTOREALISTIC_PROMPT_GUIDE.md at session start
- [x] Asset Target specified (PROJECT)
- [x] Every photorealistic prompt includes camera model
- [x] Every photorealistic prompt includes lens specification
- [x] Every photorealistic prompt includes lighting description
- [x] Every prompt has negative prompts (anti-AI-tells list)

### Brief Quality
- [x] All required asset types identified (18 assets, 5 categories)
- [x] Dimensions specified for each asset
- [x] Style notes align with design direction
- [x] Generation prompts are detailed and specific
- [x] Priority levels assigned (P1/P2)
- [x] Quality criteria defined
- [x] Feature parity maintained (all 6 sections covered)

### Design Direction
- [x] Color palette specified with hex values
- [x] Typography recommendations included
- [x] Light/dark mode considerations noted
- [x] Accessibility requirements stated (WCAG AA)
- [x] Inspiration references provided

---

## Implementation Notes for Website Agent

1. **This is a REDESIGN, not a new build** - Maintain all existing functionality
2. **Progressive enhancement** - Can implement in phases:
   - Phase 1: Color palette + typography changes
   - Phase 2: Hero section with new assets
   - Phase 3: Feature icons and cards
   - Phase 4: Screenshots and testimonials
3. **Keep terminal component** - Update styling, keep animation logic
4. **Dark mode required** - Use CSS variables for theme switching
5. **Test mobile** - Hero gradient must work on both orientations

---

*Brief created by Research Agent | Ready for Media Agent pickup*

