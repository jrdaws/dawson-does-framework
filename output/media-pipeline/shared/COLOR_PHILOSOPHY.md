# Media Pipeline Color Philosophy

> **Version**: 1.0 | **Last Updated**: 2025-12-23
> 
> **Purpose**: Official color guidelines for all Media Pipeline agents
> 
> **MANDATORY**: All agents generating visual assets MUST read this document

---

## Quick Reference Card

```
PRIMARY ACTION    → Indigo   #6366F1
SECONDARY/HOVER   → Violet   #8B5CF6
SUCCESS/COMPLETE  → Emerald  #10B981
WARNING           → Amber    #F59E0B
ERROR/DANGER      → Red      #EF4444
DISABLED/MUTED    → Gray     #71717A
LIGHT BACKGROUND  → White    #FFFFFF
DARK BACKGROUND   → Black    #0A0A0A
```

---

## Core Color Palette

### Brand Colors

| Name | Hex | RGB | HSL | Usage |
|------|-----|-----|-----|-------|
| **Indigo** (Primary) | `#6366F1` | 99, 102, 241 | 239°, 84%, 67% | CTAs, links, icons, active states |
| **Violet** (Secondary) | `#8B5CF6` | 139, 92, 246 | 263°, 90%, 66% | Gradients, hover states |
| **Emerald** (Success) | `#10B981` | 16, 185, 129 | 160°, 84%, 39% | Success states, checkmarks |
| **Amber** (Warning) | `#F59E0B` | 245, 158, 11 | 38°, 92%, 50% | Warnings, attention |
| **Red** (Error) | `#EF4444` | 239, 68, 68 | 0°, 84%, 60% | Errors, destructive |

### Neutral Colors

| Name | Hex | Light Mode Usage | Dark Mode Usage |
|------|-----|------------------|-----------------|
| **White** | `#FFFFFF` | Background | Text color |
| **Near Black** | `#0A0A0A` | Text color | Background |
| **Muted** | `#71717A` | Secondary text | Secondary text |
| **Light Surface** | `#F5F5F5` | Card backgrounds | - |
| **Dark Surface** | `#1A1A1A` | - | Card backgrounds |
| **Border Light** | `#E5E5E5` | Borders, dividers | - |
| **Border Dark** | `#333333` | - | Borders, dividers |

---

## The 60-30-10 Rule

All visual assets should follow this color proportion:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│     60% NEUTRAL                                         │
│     (White, Near Black, Grays)                         │
│     Background, negative space, text                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│     30% PRIMARY                                         │
│     (Indigo #6366F1)                                    │
│     Icons, buttons, active elements                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│     10% ACCENT (Violet, Emerald)                        │
│     Highlights, success states, gradients               │
└─────────────────────────────────────────────────────────┘
```

---

## Color Hierarchy (Indigo-First)

### Priority Order

1. **Indigo** - Primary color for all interactive elements
2. **Violet** - Secondary, used for hover states and gradients
3. **Emerald** - Accent ONLY for success/completion
4. **Amber/Red** - Semantic states (warning/error)

### ⚠️ Critical Rule: Emerald is NOT a Primary Color

Emerald (#10B981) should NEVER be:
- The dominant color in any asset
- Used for CTAs or primary buttons
- The main color in illustrations

Emerald is ONLY for:
- ✓ Checkmarks
- ✓ Success messages
- ✓ Completion states
- ✓ Small accent highlights (10% max)

---

## Gradient Specifications

### Hero Gradient (Primary)
```css
background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
```
- **Direction**: 135° (top-left to bottom-right)
- **Colors**: Light Indigo → Violet
- **Usage**: Hero backgrounds, feature sections

### Card Hover Gradient
```css
background: linear-gradient(135deg, 
  rgba(99, 102, 241, 0.1) 0%, 
  rgba(139, 92, 246, 0.1) 100%
);
```
- **Opacity**: 10%
- **Usage**: Card hovers, subtle backgrounds

### Background Mesh
```css
background: 
  radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
  radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
```
- **Usage**: Page backgrounds, depth effect

---

## Semantic Color Mapping

| Meaning | Color | Hex | Icon |
|---------|-------|-----|------|
| Primary Action | Indigo | `#6366F1` | → |
| Hover/Active | Violet | `#8B5CF6` | ↗ |
| Success | Emerald | `#10B981` | ✓ |
| Warning | Amber | `#F59E0B` | ⚠ |
| Error | Red | `#EF4444` | ✕ |
| Disabled | Gray | `#71717A` | — |
| Info | Indigo (light) | `#6366F1` at 20% | ℹ |

### Never Override Semantic Meanings

❌ **Wrong**: Using red for a success state
❌ **Wrong**: Using green for a CTA button
❌ **Wrong**: Using amber for a positive message

✅ **Correct**: Success = Emerald, always
✅ **Correct**: CTA = Indigo, always
✅ **Correct**: Warning = Amber, always

---

## Color Decision Flowchart

```
What type of element?
│
├── Button/CTA
│   ├── Primary → Indigo #6366F1 (solid)
│   ├── Secondary → Indigo #6366F1 (outline)
│   └── Destructive → Red #EF4444
│
├── Icon/Graphic
│   ├── Standard → Indigo #6366F1
│   ├── Success → Emerald #10B981
│   └── Warning/Error → Amber/Red
│
├── Text
│   ├── Primary → #171717 (light) / #EDEDED (dark)
│   ├── Secondary → #71717A
│   ├── Link → Indigo #6366F1
│   └── Error → Red #EF4444
│
├── Background
│   ├── Page → #FFFFFF (light) / #0A0A0A (dark)
│   ├── Card → #F5F5F5 (light) / #1A1A1A (dark)
│   ├── Highlight → Indigo at 10% opacity
│   └── Hero → Indigo→Violet gradient
│
└── Border
    ├── Default → #E5E5E5 (light) / #333333 (dark)
    ├── Focus → Indigo #6366F1
    └── Error → Red #EF4444
```

---

## Asset Generation Guidelines

### For AI Image Generation (DALL-E, Stable Diffusion, etc.)

When prompting for images, include color specifications:

```
Color requirements:
- Primary color: Indigo #6366F1 (dominant)
- Secondary color: Violet #8B5CF6 (supporting)
- Accent color: Emerald #10B981 (minimal, success only)
- Avoid: Rainbow, neon, oversaturated colors
```

### For SVG Icons

```svg
<!-- Standard icon -->
<svg stroke="#6366F1" stroke-width="2" fill="none">
  <!-- paths -->
</svg>

<!-- With subtle fill -->
<svg stroke="#6366F1" stroke-width="2" fill="rgba(99, 102, 241, 0.1)">
  <!-- paths -->
</svg>
```

### For Gradients in Assets

Always use the official gradient direction (135°):
```
Top-left → Bottom-right
#667EEA → #764BA2
```

---

## Accessibility Requirements

### Contrast Ratios

| Element Type | Minimum Ratio | Standard |
|--------------|---------------|----------|
| Normal text | 4.5:1 | WCAG AA |
| Large text (18px+) | 3:1 | WCAG AA |
| UI components | 3:1 | WCAG AA |
| Graphics | 3:1 | WCAG AA |

### Tested Combinations

✅ **Safe on Light Background (#FFFFFF)**:
- Indigo #6366F1 text → 4.5:1 ✓
- Near Black #171717 text → 12:1 ✓

✅ **Safe on Dark Background (#0A0A0A)**:
- White #FFFFFF text → 18:1 ✓
- Light Gray #EDEDED text → 14:1 ✓

⚠️ **Use Carefully**:
- Emerald on white → 3:1 (large text only)
- Amber on white → 2:1 (not for text)

---

## Anti-Patterns

### ❌ DON'T Do This

```
❌ Make emerald the dominant color
❌ Use rainbow gradients
❌ Mix more than 3 colors in one asset
❌ Use neon or oversaturated colors
❌ Create busy multi-color patterns
❌ Use colors outside this palette
❌ Ignore dark mode
❌ Use low-contrast combinations
```

### ✅ DO This

```
✅ Keep Indigo as the primary color
✅ Use gradients subtly (backgrounds, not text)
✅ Maintain high contrast for readability
✅ Use Emerald ONLY for success states
✅ Test assets on both light and dark modes
✅ Follow the 60-30-10 rule
✅ Use semantic colors consistently
```

---

## Color Palette CSS Variables

For website implementation:

```css
:root {
  /* Brand */
  --color-primary: #6366F1;
  --color-secondary: #8B5CF6;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  
  /* Neutrals - Light Mode */
  --color-background: #FFFFFF;
  --color-foreground: #171717;
  --color-muted: #71717A;
  --color-surface: #F5F5F5;
  --color-border: #E5E5E5;
  
  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  --gradient-card: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
}

.dark {
  --color-background: #0A0A0A;
  --color-foreground: #EDEDED;
  --color-surface: #1A1A1A;
  --color-border: #333333;
}
```

---

## Quick Reference for Media Agent

When generating ANY visual asset:

1. **Read this document first**
2. **Primary color = Indigo #6366F1**
3. **Emerald is for success ONLY**
4. **Follow 60-30-10 proportion**
5. **Test on both light and dark modes**
6. **Use 135° gradient direction**

---

*Color Philosophy v1.0 | dawson-does-framework Media Pipeline*

