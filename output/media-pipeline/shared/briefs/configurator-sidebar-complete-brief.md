# Media Brief: Configurator Sidebar UX Complete Asset Package

> **Priority**: P0 - CRITICAL
> **Created**: 2025-12-23
> **Type**: Complete Asset Package
> **Destination**: `website/public/images/configurator/`
> **Based On**: UX-PROPOSAL-configurator-sidebar-redesign.md + COLOR_PHILOSOPHY.md

---

## Executive Summary

Generate a complete visual asset package for transforming the Project Configurator from a linear 8-step wizard into a professional sidebar-driven workspace with expanding panels. This package must support all navigation states, panel backgrounds, feedback animations, and decorative elements.

**Target Aesthetic**: Linear.app meets Vercel - clean, minimal, professional SaaS dashboard

---

## Color Palette (STRICT ADHERENCE REQUIRED)

```
PRIMARY (CTAs, active states)    → Indigo   #6366F1
SECONDARY (gradients, hovers)    → Violet   #8B5CF6
SUCCESS (completed only)         → Emerald  #10B981
WARNING (attention)              → Amber    #F59E0B
ERROR (destructive)              → Red      #EF4444
DISABLED (inactive)              → Gray     #71717A

BACKGROUND (dark mode)           → #0A0A0A
SURFACE (cards, panels)          → #141414
BORDER                           → #262626
TEXT PRIMARY                     → #EDEDED
TEXT MUTED                       → #71717A
```

**60-30-10 Rule**: 60% neutral, 30% Indigo, 10% accents

---

## Asset Categories

### Category 1: Navigation Bar Icons (7 icons)

**Format**: SVG, 24x24 viewBox
**Style**: 2px stroke, rounded linecaps, Lucide-compatible
**Color**: Single color (#6366F1 for active, #71717A for inactive)
**Variants**: Each icon needs `default` and `active` state

| Icon ID | Concept | Description | Reference |
|---------|---------|-------------|-----------|
| `nav-home` | Dashboard/overview | Four squares grid or home | Lucide: LayoutDashboard |
| `nav-template` | Template selection | Stacked boxes or layers | Lucide: Layers |
| `nav-inspiration` | Vision/inspiration | Lightbulb or sparkles | Lucide: Lightbulb |
| `nav-integrations` | Integrations/plugins | Puzzle piece or sliders | Lucide: Puzzle |
| `nav-keys` | Environment keys | Key or lock-open | Lucide: Key |
| `nav-preview` | Live preview | Eye or monitor | Lucide: Eye |
| `nav-export` | Export/deploy | Rocket or upload | Lucide: Rocket |

**SVG Template**:
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 2px stroke, rounded caps, single color -->
  <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="..." />
</svg>
```

---

### Category 2: Navigation State Indicators (4 icons)

**Format**: SVG, 16x16 viewBox
**Purpose**: Badges overlaid on nav icons to show completion/status

| Icon ID | Concept | Color | Description |
|---------|---------|-------|-------------|
| `badge-complete` | Checkmark | Emerald #10B981 | Filled circle with white check |
| `badge-warning` | Exclamation | Amber #F59E0B | Filled circle with ! |
| `badge-error` | X mark | Red #EF4444 | Filled circle with X |
| `badge-count` | Number | Indigo #6366F1 | Pill shape for "3 items" |

---

### Category 3: Panel Backgrounds & Decorative (5 assets)

**Format**: SVG (patterns) or WebP (textures)
**Purpose**: Subtle backgrounds for panels, not distracting

| Asset ID | Dimensions | Description |
|----------|------------|-------------|
| `panel-bg-subtle` | Tileable 100x100 | Very subtle dot grid at 3% opacity |
| `panel-divider-v` | 1x100 | Vertical gradient line (Indigo→transparent) |
| `panel-divider-h` | 100x1 | Horizontal gradient line |
| `panel-glow` | 200x200 | Radial gradient glow for active panel edge |
| `workspace-mesh` | 800x600 | Large mesh gradient for main content area |

**Pattern Example** (panel-bg-subtle):
```svg
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1" fill="#6366F1" fill-opacity="0.03"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#dots)"/>
</svg>
```

---

### Category 4: Integration Category Icons (8 icons)

**Format**: SVG, 32x32 viewBox
**Style**: 2px stroke, Indigo #6366F1, Lucide-compatible
**Context**: Used in the triple-panel integration selector

| Icon ID | Category | Concept | Description |
|---------|----------|---------|-------------|
| `cat-auth` | Authentication | Shield with checkmark | Security/login |
| `cat-payments` | Payments | Credit card or dollar | Financial |
| `cat-email` | Email | Envelope | Communication |
| `cat-database` | Database | Cylinder/database | Storage |
| `cat-ai` | AI/ML | Brain or sparkles | Intelligence |
| `cat-analytics` | Analytics | Bar chart trending up | Metrics |
| `cat-storage` | File Storage | Cloud with arrow | Files |
| `cat-other` | Other/Custom | Plus in circle | Extensibility |

---

### Category 5: Provider Logos (Optional Enhancement - 14 assets)

**Format**: SVG, 24x24 or 32x32 viewBox
**Style**: Monochrome versions in gray, colorized on selection
**Note**: If trademark issues, create abstract representations

| Provider | Category | Abstraction if needed |
|----------|----------|----------------------|
| Supabase | Auth, DB, Storage | Green database icon |
| Clerk | Auth | Purple shield |
| Stripe | Payments | Blue/purple gradient |
| Paddle | Payments | Teal waves |
| Resend | Email | Red envelope |
| SendGrid | Email | Blue paper plane |
| PlanetScale | Database | Yellow/orange planet |
| OpenAI | AI | Green brain |
| Anthropic | AI | Orange sparkle |
| PostHog | Analytics | Blue hedgehog abstract |
| Plausible | Analytics | Purple chart |
| Cloudflare R2 | Storage | Orange cloud |
| AWS S3 | Storage | Orange bucket |
| Uploadthing | Storage | Purple upload arrow |

---

### Category 6: Step/Progress Indicators (6 assets)

**Format**: SVG, 24x24 viewBox
**Purpose**: For the sub-step indicators within each phase

| Asset ID | State | Color | Description |
|----------|-------|-------|-------------|
| `step-active` | Current | Indigo #6366F1 | Solid filled circle with pulse |
| `step-complete` | Done | Emerald #10B981 | Filled circle + white check |
| `step-pending` | Future | Gray at 30% | Empty circle outline |
| `step-locked` | Unavailable | Gray at 50% | Padlock inside circle |
| `step-optional` | Skippable | Gray dashed | Dashed circle outline |
| `step-error` | Invalid | Red #EF4444 | Filled circle + exclamation |

---

### Category 7: Feedback & Celebration (5 assets)

**Format**: SVG with CSS animations or WebP
**Purpose**: Success states, completion celebrations

| Asset ID | Format | Dimensions | Description |
|----------|--------|------------|-------------|
| `success-check-animated` | SVG | 48x48 | Animated checkmark with ring expansion |
| `confetti-burst` | SVG | 300x300 | Celebration particles (CSS animated) |
| `export-success` | WebP | 400x300 | Illustration: rocket launching with code |
| `project-created` | WebP | 400x300 | Illustration: blueprint becoming reality |
| `integration-connected` | SVG | 64x64 | Plug connecting animation |

**Animation Guidelines**:
- Duration: 0.3-0.6s for micro-interactions
- Duration: 1-2s for celebrations
- Easing: ease-out for entrances, ease-in-out for loops
- Colors: Use brand palette only

---

### Category 8: Empty States & Placeholders (4 assets)

**Format**: WebP or SVG
**Dimensions**: 200x150
**Style**: Minimal line illustrations, Indigo accent

| Asset ID | Context | Description |
|----------|---------|-------------|
| `empty-integrations` | No integrations selected | Abstract puzzle pieces |
| `empty-inspiration` | No inspiration added | Lightbulb outline |
| `empty-preview` | Preview not generated | Monitor with sparkles |
| `empty-keys` | No API keys entered | Key with question mark |

---

### Category 9: Sidebar Chrome & Decorative (4 assets)

**Format**: SVG
**Purpose**: UI chrome elements for the sidebar

| Asset ID | Dimensions | Description |
|----------|------------|-------------|
| `sidebar-collapse` | 16x16 | Chevron for collapse/expand |
| `sidebar-resize` | 8x24 | Drag handle for panel resize |
| `sidebar-logo` | 32x32 | Small DD logo for sidebar header |
| `sidebar-divider` | 200x1 | Horizontal divider with fade |

---

### Category 10: Tooltip Pointers & Callouts (3 assets)

**Format**: SVG
**Purpose**: Tooltip arrows and callout bubbles

| Asset ID | Description |
|----------|-------------|
| `tooltip-arrow-up` | 12x6 arrow pointing up |
| `tooltip-arrow-down` | 12x6 arrow pointing down |
| `tooltip-arrow-left` | 6x12 arrow pointing left |

---

## Generation Specifications

### For SVG Icons (Categories 1, 2, 4, 6, 9, 10)

**Prompt Template**:
```
Create a minimal SVG icon for [CONCEPT].
Style: 2px stroke weight, rounded linecaps and linejoins.
Color: Single color [#6366F1 or #71717A].
ViewBox: [24x24 or 32x32].
Aesthetic: Matches Lucide icon library - clean, geometric, professional.
No fills except for status indicators which use solid fills.
Export as clean SVG with no unnecessary groups or metadata.
```

### For WebP Illustrations (Categories 7, 8)

**Prompt Template**:
```
Create a minimal flat illustration for [CONCEPT].
Style: Modern SaaS aesthetic, similar to Linear or Vercel marketing.
Colors: 
- Primary: Indigo #6366F1 (dominant)
- Secondary: Violet #8B5CF6 (accents)
- Background: Transparent or very subtle gray
- Accent: Emerald #10B981 (small highlights only)
Mood: Professional, optimistic, developer-friendly.
No gradients except subtle depth. No photorealistic elements.
Clean vector-style illustration with minimal detail.
Dimensions: [as specified per asset].
```

### For Patterns (Category 3)

**Prompt Template**:
```
Create a subtle tileable pattern for UI backgrounds.
Style: Minimal, not distracting, professional SaaS dashboard.
Colors: Use brand colors at very low opacity (3-10%).
Pattern type: [dots/lines/mesh as specified].
Must be seamlessly tileable.
Dark mode optimized - assumes dark background.
```

### For Animations (Category 7)

**SVG Animation Requirements**:
```css
/* All animations should use CSS, not SMIL */
@keyframes checkDraw {
  from { stroke-dashoffset: 24; }
  to { stroke-dashoffset: 0; }
}

@keyframes ringExpand {
  from { transform: scale(0.8); opacity: 1; }
  to { transform: scale(1.5); opacity: 0; }
}

/* Timing */
animation-duration: 0.4s;
animation-timing-function: ease-out;
animation-fill-mode: forwards;
```

---

## File Structure

```
website/public/images/configurator/
├── nav/
│   ├── home.svg
│   ├── template.svg
│   ├── inspiration.svg
│   ├── integrations.svg
│   ├── keys.svg
│   ├── preview.svg
│   └── export.svg
├── badges/
│   ├── complete.svg
│   ├── warning.svg
│   ├── error.svg
│   └── count.svg
├── categories/
│   ├── auth.svg
│   ├── payments.svg
│   ├── email.svg
│   ├── database.svg
│   ├── ai.svg
│   ├── analytics.svg
│   ├── storage.svg
│   └── other.svg
├── providers/
│   ├── supabase.svg
│   ├── clerk.svg
│   ├── stripe.svg
│   └── ... (14 total)
├── steps/
│   ├── active.svg
│   ├── complete.svg
│   ├── pending.svg
│   ├── locked.svg
│   ├── optional.svg
│   └── error.svg
├── patterns/
│   ├── panel-bg-subtle.svg
│   ├── panel-divider-v.svg
│   ├── panel-divider-h.svg
│   ├── panel-glow.svg
│   └── workspace-mesh.svg
├── feedback/
│   ├── success-check-animated.svg
│   ├── confetti-burst.svg
│   ├── export-success.webp
│   ├── project-created.webp
│   └── integration-connected.svg
├── empty/
│   ├── integrations.svg
│   ├── inspiration.svg
│   ├── preview.svg
│   └── keys.svg
└── chrome/
    ├── collapse.svg
    ├── resize.svg
    ├── logo.svg
    └── divider.svg
```

---

## Quality Checklist (For Quality Agent Review)

### SVG Icons
- [ ] 2px stroke weight consistent
- [ ] Rounded linecaps/linejoins
- [ ] Correct viewBox dimensions
- [ ] Single color (no gradients in icons)
- [ ] Clean paths (no extra nodes)
- [ ] Works on dark background
- [ ] Works on light background (if needed)
- [ ] Matches Lucide aesthetic
- [ ] <3KB file size

### WebP Illustrations
- [ ] Uses brand color palette only
- [ ] Indigo dominant (30%+)
- [ ] Emerald accent only (not dominant)
- [ ] Professional SaaS aesthetic
- [ ] Transparent or subtle background
- [ ] <50KB file size
- [ ] Clear at 400px width

### Patterns
- [ ] Tileable without visible seams
- [ ] Very subtle (not distracting)
- [ ] Uses brand colors at low opacity
- [ ] <2KB file size

### Animations
- [ ] CSS-based (not SMIL)
- [ ] Duration 0.3-0.6s for micro
- [ ] Duration 1-2s for celebration
- [ ] Smooth easing
- [ ] Doesn't loop infinitely (except where needed)

---

## Asset Count Summary

| Category | Count | Format | Priority |
|----------|-------|--------|----------|
| Navigation Icons | 7 | SVG | P0 |
| State Badges | 4 | SVG | P0 |
| Integration Categories | 8 | SVG | P0 |
| Step Indicators | 6 | SVG | P0 |
| Sidebar Chrome | 4 | SVG | P1 |
| Patterns/Backgrounds | 5 | SVG | P1 |
| Feedback/Celebration | 5 | SVG/WebP | P1 |
| Empty States | 4 | SVG/WebP | P2 |
| Provider Logos | 14 | SVG | P2 |
| Tooltip Arrows | 3 | SVG | P2 |
| **TOTAL** | **60** | - | - |

---

## Iteration Plan

### Iteration 1 (P0 - Core Navigation)
- Navigation icons (7)
- State badges (4)
- Integration category icons (8)
- Step indicators (6)
**Total: 25 assets**

### Iteration 2 (P1 - Polish)
- Sidebar chrome (4)
- Patterns/backgrounds (5)
- Feedback animations (5)
**Total: 14 assets**

### Iteration 3 (P2 - Enhancements)
- Empty states (4)
- Provider logos (14)
- Tooltip arrows (3)
**Total: 21 assets**

---

## References

- **UX Proposal**: `output/media-pipeline/research-agent/inbox/UX-PROPOSAL-configurator-sidebar-redesign.md`
- **Color Philosophy**: `output/media-pipeline/shared/COLOR_PHILOSOPHY.md`
- **shadcn SOP**: `docs/sops/SHADCN_IMPLEMENTATION_SOP.md`
- **Lucide Icons**: https://lucide.dev/icons
- **Linear.app**: Design reference for sidebar patterns
- **Vercel Dashboard**: Design reference for professional SaaS aesthetic

---

*Complete Media Brief for Configurator Sidebar UX | Quality Agent | 2025-12-23*

