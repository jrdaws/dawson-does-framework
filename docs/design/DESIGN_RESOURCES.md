# Design Resources for AI Generation

> Quality benchmarks and reference sources for generated UI/UX
> Version: 1.0 | Created: 2025-12-23

---

## Overview

This document defines the design resources and quality benchmarks used by the AI generation engine to ensure high-quality, modern UI/UX output.

---

## Primary Design References

### Component Libraries (Code Examples)

| Resource | Purpose | URL |
|----------|---------|-----|
| **shadcn/ui** | Primary component reference | https://ui.shadcn.com |
| **Radix UI** | Accessible primitives | https://radix-ui.com |
| **Tailwind UI** | Premium patterns | https://tailwindui.com |
| **Headless UI** | Unstyled components | https://headlessui.com |

### Design Inspiration

| Resource | Purpose | URL |
|----------|---------|-----|
| **Dribbble** | Visual inspiration | https://dribbble.com/tags/saas |
| **Awwwards** | Award-winning sites | https://awwwards.com |
| **Mobbin** | Mobile patterns | https://mobbin.com |
| **SaaS Landing Pages** | Industry examples | https://saaslandingpage.com |
| **Land-book** | Landing inspiration | https://land-book.com |

### Design Systems

| Resource | Purpose | URL |
|----------|---------|-----|
| **Vercel Design** | Modern SaaS aesthetic | https://vercel.com/design |
| **Linear Design** | Clean product design | https://linear.app |
| **Stripe Design** | Payment/fintech | https://stripe.com/docs |
| **GitHub Primer** | Developer tools | https://primer.style |

---

## Design Quality Benchmarks

### Visual Hierarchy Checklist

- [ ] Clear H1 → H2 → H3 hierarchy
- [ ] Consistent spacing system (4px/8px base)
- [ ] Logical visual flow (F-pattern or Z-pattern)
- [ ] Proper use of whitespace
- [ ] Maximum 2-3 font sizes per page

### Color & Theme Standards

- [ ] Primary, secondary, accent colors defined
- [ ] Dark mode support (CSS variables)
- [ ] Sufficient contrast ratios (WCAG AA minimum)
- [ ] Consistent color application
- [ ] No more than 5 colors in palette

### Typography Standards

- [ ] Modern font stack (Inter, Geist, SF Pro, or distinctive choice)
- [ ] Readable body text (16px+ base)
- [ ] Line height 1.5-1.7 for body
- [ ] Font weight variety (regular, medium, bold)
- [ ] NO generic fonts (Arial, Times, system-ui alone)

### Component Quality

- [ ] Consistent border radius (4px, 8px, or 12px)
- [ ] Proper hover/focus states
- [ ] Smooth transitions (150-300ms)
- [ ] Loading states defined
- [ ] Error states styled

### Responsive Design

- [ ] Mobile-first approach
- [ ] Breakpoints: sm(640) md(768) lg(1024) xl(1280)
- [ ] Touch-friendly targets (44px minimum)
- [ ] Collapsible navigation
- [ ] No horizontal scroll

---

## Aesthetic Templates

### Modern SaaS (Default)
```
Theme: Dark or light with high contrast accents
Fonts: Inter, Geist Mono
Colors: Neutral grays + vibrant accent (blue, purple, or green)
Radius: 8-12px
Shadows: Soft, elevated cards
Reference: Linear, Vercel, Raycast
```

### Corporate/Enterprise
```
Theme: Light, professional
Fonts: IBM Plex Sans, Source Sans Pro
Colors: Blue primary, conservative palette
Radius: 4-6px
Shadows: Subtle
Reference: Stripe, Atlassian
```

### Creative/Portfolio
```
Theme: Bold, expressive
Fonts: Space Grotesk, Playfair Display, custom
Colors: Unique, memorable palette
Radius: Variable (0-24px)
Shadows: Dramatic or none
Reference: Awwwards winners
```

### E-commerce
```
Theme: Clean, product-focused
Fonts: DM Sans, Outfit
Colors: Neutral with accent CTAs
Radius: 8px
Shadows: Card elevation for products
Reference: Shopify, Gumroad
```

### Dashboard/Analytics
```
Theme: Dark or muted light
Fonts: JetBrains Mono (data), Inter (UI)
Colors: Data-viz palette (categorical, sequential)
Radius: 6-8px
Shadows: Minimal
Reference: Grafana, Datadog, Posthog
```

---

## Anti-Patterns to Avoid

### The "AI Slop" Aesthetic

These patterns indicate generic, low-quality AI output:

❌ **Avoid:**
- Purple gradient on white background
- Inter font for everything
- Generic hero with stock photo
- "Get Started" as only CTA
- Perfectly symmetrical layouts
- Blue buttons on everything
- Card-based everything
- Generic icons (feather icons without customization)

✅ **Instead:**
- Distinctive color choices
- Font pairing with character
- Custom illustrations or unique photography
- Specific, action-oriented CTAs
- Asymmetric, dynamic layouts
- Contextual button colors
- Mixed content patterns
- Custom or curated iconography

---

## Reference Files for AI

The AI generation engine should reference these files:

### Template Reference (Current)
```
templates/{templateId}/app/page.tsx
```

### Design Tokens (Proposed)
```
templates/{templateId}/design/tokens.json
```

### Component Examples (Proposed)
```
templates/{templateId}/design/examples/
  ├── hero-variants.tsx
  ├── card-variants.tsx
  ├── navigation-variants.tsx
  └── form-variants.tsx
```

---

## Implementation Notes

1. **loadTemplateReference()** should include design tokens
2. **Intent analysis** should detect aesthetic preferences
3. **Architecture** should match template to aesthetic
4. **Code generation** should apply design tokens

---

## Quality Scoring

Rate generated designs against these criteria:

| Criterion | Weight | Score 1-10 |
|-----------|--------|------------|
| Visual distinctiveness | 20% | |
| Usability/accessibility | 25% | |
| Modern aesthetic | 20% | |
| Consistency | 20% | |
| Technical quality | 15% | |

**Minimum passing score: 7.0**

---

*This document should be referenced by AI agents when evaluating design quality.*

