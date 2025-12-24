# Research Task: Project Configurator UX & Color Philosophy

> **Priority**: P1 - HIGH
> **Created**: 2025-12-23
> **Requested By**: User via Quality Agent
> **Type**: UX Research + Design System Documentation

---

## Problem Statement

The Project Configurator 'set-up walk through' still doesn't look right. The user has requested:

1. **Research** on good UX for multi-step processes
2. **Documentation** of the color scheme and how colors are chosen
3. **Clear color philosophy** for the Media Agent to follow

---

## Part 1: Multi-Step Wizard UX Best Practices

### Research Questions

1. What are the best practices for multi-step onboarding/wizard flows?
2. How do top SaaS companies (Linear, Vercel, Stripe, Notion) design their setup flows?
3. What progress indicators work best for 8+ step processes?
4. How to reduce cognitive load in multi-step processes?
5. When to use horizontal vs vertical steppers?

### Current Implementation Analysis

The current Project Configurator has 8 steps:
1. Template
2. Inspiration
3. Project
4. Integrations
5. Environment
6. Preview
7. Context
8. Export

**Current Issues to Address**:
- 8 steps may be overwhelming
- Horizontal stepper gets crowded on mobile
- Step labels may not clearly indicate purpose
- Visual hierarchy unclear

### UX Patterns to Research

#### Progress Indicators
- **Horizontal Stepper**: Linear sequence, shows all steps
- **Vertical Stepper**: Detailed, works well on mobile
- **Progress Bar**: Simple %, less overwhelming
- **Breadcrumbs**: For non-linear navigation
- **Tabs with Progress**: Grouped steps

#### Cognitive Load Reduction
- **Chunking**: Group related steps (e.g., "Setup" → "Configure" → "Deploy")
- **Progressive Disclosure**: Show only relevant information
- **Smart Defaults**: Pre-fill common choices
- **Conditional Steps**: Hide irrelevant steps based on mode

#### Best Practice Examples

**Linear.app Onboarding**:
- Minimal steps (3-4 max visible)
- Large click targets
- Immediate visual feedback
- Animated transitions

**Vercel Setup Flow**:
- Git-connect → Configure → Deploy (3 steps)
- Grouped related config in expandable sections
- Progress shown as simple bar

**Stripe Connect Onboarding**:
- Vertical timeline format
- Steps expand/collapse
- Clear status indicators (todo, in-progress, complete)
- Saves progress automatically

### Recommended Research Output

Create: `output/media-pipeline/shared/UX_MULTI_STEP_GUIDE.md`

Contents:
1. Executive summary of best practices
2. Comparison of stepper patterns with pros/cons
3. Recommendations for dawson-does-framework configurator
4. Suggested step grouping/consolidation
5. Mobile-first considerations
6. Accessibility requirements

---

## Part 2: Color Scheme Documentation

### Current Color System

From `website/app/globals.css` and design brief:

#### Brand Colors
```css
--brand-primary: #6366F1    /* Indigo - CTAs, links, primary actions */
--brand-secondary: #8B5CF6  /* Violet - Hover states, gradients */
--brand-success: #10B981    /* Emerald - Success states, checkmarks */
--brand-bg-light: #FFFFFF   /* Light mode background */
--brand-bg-dark: #0A0A0A    /* Dark mode background */
--brand-muted: #71717A      /* Muted text, secondary info */
```

#### Semantic Colors
```css
--terminal-accent: #6366F1  /* Primary interactive */
--terminal-error: #EF4444   /* Errors, destructive actions */
--terminal-warning: #F59E0B /* Warnings, cautions */
```

### Color Palette Reference

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Indigo (Primary) | #6366F1 | 99, 102, 241 | CTAs, links, icons, accents |
| Violet (Secondary) | #8B5CF6 | 139, 92, 246 | Gradients, hover states |
| Emerald (Success) | #10B981 | 16, 185, 129 | Success, checkmarks, positive |
| Amber (Warning) | #F59E0B | 245, 158, 11 | Warnings, attention |
| Red (Error) | #EF4444 | 239, 68, 68 | Errors, destructive |
| White (Light BG) | #FFFFFF | 255, 255, 255 | Light mode background |
| Near Black (Dark BG) | #0A0A0A | 10, 10, 10 | Dark mode background |
| Gray (Muted) | #71717A | 113, 113, 122 | Secondary text, disabled |

### Gradient Palette

```css
/* Hero gradient */
linear-gradient(135deg, #667EEA 0%, #764BA2 100%)

/* Card hover */
linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)

/* Background mesh */
radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
```

---

## Part 3: Color Philosophy for Media Agent

### Create Official Color Philosophy Document

**Output**: `output/media-pipeline/shared/COLOR_PHILOSOPHY.md`

### Core Principles

#### 1. Indigo-First Hierarchy
- **Primary actions**: Always Indigo #6366F1
- **Secondary elements**: Violet #8B5CF6
- **Accent sparingly**: Emerald #10B981 (success only)
- **Never** use emerald as primary - it's an accent color

#### 2. Color Proportion Rule (60-30-10)
- **60%**: Neutral backgrounds (white/dark gray)
- **30%**: Primary brand color (Indigo)
- **10%**: Accent colors (Violet, Emerald)

#### 3. Semantic Consistency
| Meaning | Color | When to Use |
|---------|-------|-------------|
| Primary action | Indigo | Buttons, links, active states |
| Secondary/hover | Violet | Hover effects, gradients |
| Success/complete | Emerald | Checkmarks, success messages |
| Warning/caution | Amber | Non-critical alerts |
| Error/danger | Red | Errors, destructive actions |
| Disabled/muted | Gray | Inactive elements |

#### 4. Contrast Requirements
- **Normal text**: 4.5:1 minimum (WCAG AA)
- **Large text**: 3:1 minimum
- **Interactive elements**: Clear focus states
- **Icons on backgrounds**: Test at 50% opacity

#### 5. Dark Mode Considerations
- Colors may need adjustment in dark mode
- Use lighter tints on dark backgrounds
- Maintain same semantic meaning
- Test readability on both modes

### Color Selection Decision Tree

```
Need a color for an element?
│
├── Is it a primary action (CTA, link)?
│   └── Use Indigo #6366F1
│
├── Is it a hover/secondary state?
│   └── Use Violet #8B5CF6
│
├── Is it indicating success/completion?
│   └── Use Emerald #10B981
│
├── Is it a warning?
│   └── Use Amber #F59E0B
│
├── Is it an error/destructive action?
│   └── Use Red #EF4444
│
├── Is it disabled/inactive?
│   └── Use Gray #71717A
│
└── Is it a background/surface?
    ├── Light mode: #FFFFFF (bg), #F5F5F5 (surface)
    └── Dark mode: #0A0A0A (bg), #1A1A1A (surface)
```

### Asset Generation Guidelines

When generating images/graphics:

1. **Dominant color**: Indigo #6366F1 (60-70% of color)
2. **Supporting color**: Violet #8B5CF6 (20-30%)
3. **Accent only**: Emerald #10B981 (5-10%, never dominant)
4. **Avoid**: Rainbow effects, neon colors, oversaturated
5. **Gradients**: Indigo → Violet direction, 135° angle
6. **Icons**: Outline style, 2px stroke, Indigo only

### Anti-Patterns to Avoid

❌ **Don't**:
- Use green/emerald as primary color
- Mix too many accent colors
- Use colors outside the defined palette
- Create busy multi-color gradients
- Use low-contrast combinations
- Override semantic color meanings

✅ **Do**:
- Keep designs predominantly Indigo
- Use gradients subtly (backgrounds, not text)
- Maintain high contrast for text
- Use emerald only for success states
- Test on both light and dark modes

---

## Deliverables

1. **`UX_MULTI_STEP_GUIDE.md`** - Best practices for wizard/stepper UX
2. **`COLOR_PHILOSOPHY.md`** - Official color guidelines for Media Agent
3. **Configurator Improvement Recommendations** - Specific suggestions

---

## Research Sources to Consult

1. Nielsen Norman Group - Wizard patterns
2. Material Design - Steppers
3. Apple HIG - Onboarding
4. Baymard Institute - Checkout UX (multi-step)
5. Linear, Vercel, Stripe, Notion - Real examples

---

*Research Task created by Quality Agent | 2025-12-23*

