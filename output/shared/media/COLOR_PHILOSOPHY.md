# Media Pipeline Color Philosophy

> **Version**: 2.0 | **Last Updated**: 2025-12-25
> 
> **Purpose**: Official color guidelines for all Media Pipeline agents
> 
> **MANDATORY**: All agents generating visual assets MUST read this document
> 
> **Selected Scheme**: Warm Neutral (Scheme C)

---

## Quick Reference Card

```
PRIMARY ACTION    → Orange   #F97316
PRIMARY HOVER     → Orange   #EA580C
PRIMARY LIGHT     → Cream    #FFF7ED
SUCCESS/COMPLETE  → Emerald  #10B981
WARNING           → Amber    #F59E0B
ERROR/DANGER      → Red      #EF4444
DISABLED/MUTED    → Stone    #78716C
LIGHT BACKGROUND  → Stone 50 #FAFAF9
DARK BACKGROUND   → Stone 950 #0C0A09
```

---

## Why Warm Neutral?

After evaluating three color schemes (Mono-Violet, Dark Terminal, Warm Neutral), **Scheme C: Warm Neutral** was selected for:

1. **Differentiation** - Stands out from purple/blue developer tool crowd
2. **Approachability** - Warm tones feel premium and inviting
3. **Energy** - Orange suggests action, speed, and momentum
4. **Memorability** - Bold, distinctive brand color
5. **Full Mode Support** - Works beautifully in both light and dark modes

---

## Core Color Palette

### Brand Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Orange** (Primary) | `#F97316` | 249, 115, 22 | CTAs, links, icons, active states |
| **Orange Hover** | `#EA580C` | 234, 88, 12 | Hover states, pressed |
| **Orange Light** | `#FFF7ED` | 255, 247, 237 | Highlights, backgrounds |
| **Emerald** (Success) | `#10B981` | 16, 185, 129 | Success states, checkmarks |
| **Amber** (Warning) | `#F59E0B` | 245, 158, 11 | Warnings, attention |
| **Red** (Error) | `#EF4444` | 239, 68, 68 | Errors, destructive |

### Neutral Colors (Stone Scale)

| Name | Hex | Light Mode Usage | Dark Mode Usage |
|------|-----|------------------|-----------------|
| **Stone 50** | `#FAFAF9` | Page background | - |
| **Stone 100** | `#F5F5F4` | Card hover | - |
| **Stone 200** | `#E7E5E4` | Borders, dividers | - |
| **Stone 400** | `#A8A29E` | - | Secondary text |
| **Stone 500** | `#78716C` | Secondary text | - |
| **Stone 800** | `#292524` | - | Borders, dividers |
| **Stone 900** | `#1C1917` | Primary text | Surface |
| **Stone 950** | `#0C0A09` | - | Background |
| **White** | `#FFFFFF` | Cards, surfaces | Text color |

---

## The 60-30-10 Rule

All visual assets should follow this color proportion:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│     60% NEUTRAL                                         │
│     (Stone scale, White, Cream)                         │
│     Background, negative space, text                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│     30% PRIMARY                                         │
│     (Orange #F97316)                                    │
│     Buttons, icons, active elements                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│     10% ACCENT (Emerald only)                           │
│     Success states, completion indicators               │
└─────────────────────────────────────────────────────────┘
```

---

## Color Hierarchy (Orange-First)

### Priority Order

1. **Orange** - Primary color for all interactive elements
2. **Stone** - Neutral foundation, text, backgrounds
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

### Hero Gradient (Warm Glow)
```css
background: linear-gradient(
  135deg,
  rgba(249, 115, 22, 0.1) 0%,
  rgba(251, 146, 60, 0.05) 100%
);
```
- **Direction**: 135° (top-left to bottom-right)
- **Colors**: Subtle orange glow
- **Usage**: Hero backgrounds, feature sections

### Progress Bar Gradient
```css
background: linear-gradient(90deg, #F97316 0%, #FB923C 100%);
```
- **Usage**: Progress indicators, loading bars

### Card Hover Effect
```css
box-shadow: 0 8px 24px rgba(249, 115, 22, 0.12);
border-color: #F97316;
```
- **Usage**: Card hover states

### Background Mesh (Subtle)
```css
background: 
  radial-gradient(
    ellipse at top right,
    rgba(249, 115, 22, 0.08) 0%,
    transparent 50%
  );
```
- **Usage**: Page backgrounds, depth effect

---

## Semantic Color Mapping

| Meaning | Color | Hex | Icon |
|---------|-------|-----|------|
| Primary Action | Orange | `#F97316` | → |
| Hover/Active | Orange Dark | `#EA580C` | ↗ |
| Success | Emerald | `#10B981` | ✓ |
| Warning | Amber | `#F59E0B` | ⚠ |
| Error | Red | `#EF4444` | ✕ |
| Disabled | Stone | `#78716C` | — |
| Info | Orange (light) | `#FFF7ED` | ℹ |

### Never Override Semantic Meanings

❌ **Wrong**: Using red for a success state
❌ **Wrong**: Using green for a CTA button
❌ **Wrong**: Using amber for a positive message

✅ **Correct**: Success = Emerald, always
✅ **Correct**: CTA = Orange, always
✅ **Correct**: Warning = Amber, always

---

## Color Decision Flowchart

```
What type of element?
│
├── Button/CTA
│   ├── Primary → Orange #F97316 (solid, with shadow)
│   ├── Secondary → Stone #1C1917 outline
│   └── Destructive → Red #EF4444
│
├── Icon/Graphic
│   ├── Standard → Orange #F97316
│   ├── Success → Emerald #10B981
│   └── Warning/Error → Amber/Red
│
├── Text
│   ├── Primary → #1C1917 (light) / #FAFAF9 (dark)
│   ├── Secondary → #78716C (light) / #A8A29E (dark)
│   ├── Link → Orange #F97316
│   └── Error → Red #EF4444
│
├── Background
│   ├── Page → #FAFAF9 (light) / #0C0A09 (dark)
│   ├── Card → #FFFFFF (light) / #1C1917 (dark)
│   ├── Highlight → Orange at 10% opacity (#FFF7ED)
│   └── Hero → Warm gradient glow
│
└── Border
    ├── Default → #E7E5E4 (light) / #292524 (dark)
    ├── Focus → Orange #F97316
    └── Error → Red #EF4444
```

---

## Asset Generation Guidelines

### For AI Image Generation (DALL-E, Stable Diffusion, etc.)

When prompting for images, include color specifications:

```
Color requirements:
- Primary color: Orange #F97316 (dominant)
- Secondary color: Stone/cream tones (supporting)
- Accent color: Emerald #10B981 (minimal, success only)
- Neutral base: Warm stone/cream tones (not cool grays)
- Avoid: Cool blues, purples, neon colors, rainbow gradients
```

### For SVG Icons

```svg
<!-- Standard icon using currentColor -->
<svg stroke="currentColor" stroke-width="2" fill="none">
  <!-- paths -->
</svg>

<!-- Fixed orange icon -->
<svg stroke="#F97316" stroke-width="2" fill="none">
  <!-- paths -->
</svg>

<!-- With subtle fill -->
<svg stroke="#F97316" stroke-width="2" fill="#FFF7ED">
  <!-- paths -->
</svg>
```

### For Gradients in Assets

Always use the official gradient direction (135°):
```
Top-left → Bottom-right
#F97316 → #FB923C (orange to light orange)
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

✅ **Safe on Light Background (#FAFAF9)**:
- Stone 900 #1C1917 text → 13:1 ✓
- Orange #F97316 on white button → 3.1:1 ✓ (large text/icons)

✅ **Safe on Dark Background (#0C0A09)**:
- Stone 50 #FAFAF9 text → 17:1 ✓
- Orange #FB923C (lighter for dark mode) → 5:1 ✓

⚠️ **Use Carefully**:
- Orange text on white → 3:1 (large text/icons only)
- Emerald on white → 3:1 (large text only)

---

## Anti-Patterns

### ❌ DON'T Do This

```
❌ Make emerald the dominant color
❌ Use cool purples or blues (old scheme)
❌ Mix more than 3 colors in one asset
❌ Use neon or oversaturated colors
❌ Create busy multi-color patterns
❌ Use cool grays (use warm stone scale)
❌ Ignore dark mode
❌ Use low-contrast combinations
```

### ✅ DO This

```
✅ Keep Orange as the primary color
✅ Use warm stone tones for neutrals
✅ Use gradients subtly (backgrounds, not text)
✅ Maintain high contrast for readability
✅ Use Emerald ONLY for success states
✅ Test assets on both light and dark modes
✅ Follow the 60-30-10 rule
✅ Add subtle shadows to orange buttons
```

---

## Color Palette CSS Variables

For website implementation:

```css
:root {
  /* Brand - Warm Neutral */
  --color-primary: #F97316;
  --color-primary-hover: #EA580C;
  --color-primary-light: #FFF7ED;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  
  /* Neutrals - Light Mode (Stone scale) */
  --color-background: #FAFAF9;
  --color-foreground: #1C1917;
  --color-muted: #78716C;
  --color-surface: #FFFFFF;
  --color-border: #E7E5E4;
  
  /* Gradients */
  --gradient-hero: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%);
  --gradient-progress: linear-gradient(90deg, #F97316 0%, #FB923C 100%);
  --shadow-primary: 0 4px 14px rgba(249, 115, 22, 0.25);
  --shadow-primary-hover: 0 6px 20px rgba(249, 115, 22, 0.35);
}

.dark {
  --color-background: #0C0A09;
  --color-foreground: #FAFAF9;
  --color-muted: #A8A29E;
  --color-surface: #1C1917;
  --color-border: #292524;
  --color-primary: #FB923C; /* Slightly lighter for dark mode */
}
```

---

## Typography Color Pairing

### Light Mode
| Element | Color | Hex |
|---------|-------|-----|
| Headings | Stone 900 | `#1C1917` |
| Body text | Stone 700 | `#44403C` |
| Secondary | Stone 500 | `#78716C` |
| Links | Orange | `#F97316` |
| Link hover | Orange Dark | `#EA580C` |

### Dark Mode
| Element | Color | Hex |
|---------|-------|-----|
| Headings | Stone 50 | `#FAFAF9` |
| Body text | Stone 200 | `#E7E5E4` |
| Secondary | Stone 400 | `#A8A29E` |
| Links | Orange Light | `#FB923C` |
| Link hover | Orange | `#F97316` |

---

## Font Recommendation

For the Warm Neutral scheme, consider:
- **Primary**: DM Sans (used in mockup) - friendly, modern
- **Monospace**: JetBrains Mono or SF Mono - for code/terminal

---

## Quick Reference for Media Agent

When generating ANY visual asset:

1. **Read this document first**
2. **Primary color = Orange #F97316**
3. **Use warm Stone scale for neutrals**
4. **Emerald is for success ONLY**
5. **Follow 60-30-10 proportion**
6. **Test on both light and dark modes**
7. **Use 135° gradient direction**
8. **Add shadows to primary buttons**

---

## Reference Mockup

View the approved color scheme mockup:
```
output/shared/design/color-tests/scheme-c-warm-neutral/mockup.html
```

---

*Color Philosophy v2.0 | Warm Neutral Scheme | dawson-does-framework Media Pipeline*
