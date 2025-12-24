# Multi-Step Wizard UX Best Practices Guide

> **Version**: 1.0 | **Last Updated**: 2025-12-23
> 
> **Purpose**: Guide for designing effective multi-step processes
> 
> **Applies To**: Project Configurator and any wizard/stepper flows

---

## Executive Summary

The best multi-step experiences follow these principles:

1. **Fewer visible steps** - Show 3-5 steps max, group the rest
2. **Clear progress indication** - Users must know where they are
3. **Smart defaults** - Reduce required decisions
4. **Chunking** - Group related steps into logical phases
5. **Mobile-first** - Design for smallest screen first

---

## Current Project Configurator Analysis

### Current Structure (8 Steps)

```
1. Template
2. Inspiration
3. Project
4. Integrations
5. Environment
6. Preview
7. Context
8. Export
```

### Issues Identified

| Issue | Impact | Severity |
|-------|--------|----------|
| 8 steps feels overwhelming | High cognitive load | High |
| Horizontal stepper crowded on mobile | Poor mobile UX | High |
| Steps don't indicate time/effort | Uncertainty | Medium |
| No grouping of related steps | Mental model confusion | Medium |
| Labels are single words | Unclear purpose | Medium |

---

## Recommendation: Grouped Phase Approach

### Proposed Structure (3 Phases, 8 Steps)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  PHASE 1: Setup         PHASE 2: Configure     PHASE 3: Go │
│  ─────────────────      ──────────────────     ─────────── │
│  ✓ Template              ○ Integrations        ○ Preview   │
│  ✓ Inspiration           ○ Environment         ○ Context   │
│  ○ Project Details       ○ (auto-expand)       ○ Export    │
│                                                             │
│  [────────────●─────────────────────────────────]  37%     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Phase Breakdown

| Phase | Steps | Purpose | User Mindset |
|-------|-------|---------|--------------|
| **Setup** | Template, Inspiration, Project | "What am I building?" | Exploration |
| **Configure** | Integrations, Environment | "How will it work?" | Decision |
| **Launch** | Preview, Context, Export | "Let's ship it!" | Excitement |

---

## Progress Indicator Patterns

### Pattern 1: Phase Stepper (Recommended)

**Best for**: 6+ steps that can be grouped

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ●────────○────────○                                     │
│   Setup   Configure  Launch                                 │
│                                                             │
│   Substeps: 1/3  ·  Template  ·  Inspiration  ·  Project   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Pros**: Reduces visual complexity, clear phases
**Cons**: Hides individual step progress

### Pattern 2: Collapsible Vertical (Linear-style)

**Best for**: Complex flows with variable steps

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ● Setup                                              Done │
│   │  Template: SaaS Starter                                 │
│   │  Inspiration: 2 images uploaded                         │
│   │                                                         │
│   ◉ Configure                                       Current │
│   │  ┌─────────────────────────────────────┐                │
│   │  │ Select your integrations...         │                │
│   │  └─────────────────────────────────────┘                │
│   │                                                         │
│   ○ Launch                                           Locked │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Pros**: Works great on mobile, clear hierarchy
**Cons**: Takes more vertical space

### Pattern 3: Progress Bar + Current Step

**Best for**: Simple flows, low-stress processes

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Step 3 of 8: Project Details                              │
│   [███████████░░░░░░░░░░░░░░░░░░░░░░]  37%                 │
│                                                             │
│   ← Back                                          Next →    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Pros**: Non-intimidating, clear progress
**Cons**: Less navigable

### Pattern 4: Stripe Connect Style (Timeline)

**Best for**: Compliance/onboarding with dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ✓  Choose template                                   Done │
│   │                                                         │
│   ✓  Add inspiration                                   Done │
│   │                                                         │
│   ●  Configure integrations                         Current │
│   │  ┌─────────────────────────────────────┐                │
│   │  │ Authentication: Supabase ▾          │                │
│   │  │ Payments: Stripe ▾                  │                │
│   │  │ Analytics: None ▾                   │                │
│   │  └─────────────────────────────────────┘                │
│   │                                                         │
│   ○  Add environment keys                           Pending │
│   ┊                                                         │
│   ○  Preview and export                              Locked │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Pros**: Clear dependencies, expandable content
**Cons**: Can feel long for many steps

---

## Best Practices Checklist

### Progress & Navigation

- [ ] Show current position clearly
- [ ] Indicate total number of steps (or phases)
- [ ] Allow navigation to completed steps
- [ ] Disable navigation to future steps (unless valid)
- [ ] Provide Back and Next buttons
- [ ] Show estimated time remaining (optional)
- [ ] Auto-save progress

### Visual Design

- [ ] Current step is visually prominent
- [ ] Completed steps show checkmark or filled state
- [ ] Future steps are visually muted
- [ ] Connector lines show progress
- [ ] Mobile: Use vertical layout or simplified indicator
- [ ] Animations: Smooth transitions between steps

### Cognitive Load

- [ ] Group related steps into phases
- [ ] Use descriptive labels (not just "Step 1")
- [ ] Provide context for each step
- [ ] Show what information is needed before starting
- [ ] Use smart defaults to reduce decisions
- [ ] Mark optional steps clearly

### Validation & Feedback

- [ ] Inline validation (don't wait for submit)
- [ ] Clear error messages
- [ ] Prevent navigation if current step is invalid
- [ ] Celebrate completion (confetti? checkmark animation?)

---

## Mobile-First Design

### Problems with Horizontal Steppers on Mobile

```
Desktop (OK):
┌─────────────────────────────────────────────────────────────┐
│  ●───●───●───○───○───○───○───○                              │
│  1   2   3   4   5   6   7   8                              │
└─────────────────────────────────────────────────────────────┘

Mobile (Problems):
┌───────────────────┐
│ ●●●○○○○○          │  ← Steps too small to tap
│ 12345678          │  ← Labels illegible or hidden
└───────────────────┘
```

### Mobile Solutions

**Option A: Condensed Indicator**
```
┌───────────────────┐
│  Step 3 of 8      │
│  Project Details  │
│  [████░░░░]  37%  │
└───────────────────┘
```

**Option B: Phase Dots**
```
┌───────────────────┐
│  Configure (2/3)  │
│  ● ● ○            │
│  Integrations     │
└───────────────────┘
```

**Option C: Vertical Stepper** (Preferred)
```
┌───────────────────┐
│ ✓ Setup           │
│ ● Configure       │
│   └ Integrations  │
│ ○ Launch          │
└───────────────────┘
```

---

## Specific Recommendations for Project Configurator

### Immediate Improvements

1. **Reduce to 3 visible phases**
   - Setup (Template + Inspiration + Project)
   - Configure (Integrations + Environment)
   - Launch (Preview + Context + Export)

2. **Use vertical stepper on mobile**
   - Collapse completed phases
   - Expand current phase

3. **Add descriptive sublabels**
   ```
   Template
   "Choose your starting point"
   
   Integrations  
   "Auth, payments, and more"
   ```

4. **Show step count within phases**
   ```
   Configure (Step 1 of 2)
   ```

5. **Smart defaults for Beginner mode**
   - Pre-select common integrations
   - Skip Environment step if using defaults
   - Auto-fill Context from Template

### Implementation Priorities

| Priority | Change | Effort | Impact |
|----------|--------|--------|--------|
| P1 | Phase grouping (3 phases) | Medium | High |
| P1 | Mobile vertical stepper | Medium | High |
| P2 | Descriptive sublabels | Low | Medium |
| P2 | Progress percentage | Low | Medium |
| P3 | Animation polish | Medium | Low |
| P3 | Time estimates | Low | Low |

---

## Inspiration: Best-in-Class Examples

### Linear.app
- **Steps**: 3-4 maximum visible
- **Style**: Clean, spacious, one question per screen
- **Navigation**: Large next button, subtle back
- **Special**: Keyboard navigation, instant feedback

### Vercel
- **Steps**: Connect → Configure → Deploy (3 steps)
- **Style**: Grouped options in expandable sections
- **Navigation**: Single-page with scroll sections
- **Special**: Real-time validation, deploy preview

### Stripe Connect
- **Steps**: Timeline/checklist format
- **Style**: Vertical with expand/collapse
- **Navigation**: Click any step to expand
- **Special**: Dependencies clearly shown

### Notion
- **Steps**: Single-page questionnaire
- **Style**: Cards for options, progressive disclosure
- **Navigation**: Scroll-based, no explicit steps
- **Special**: AI suggestions based on answers

---

## Code Snippets

### Phase Stepper Component (Conceptual)

```tsx
interface Phase {
  id: string;
  label: string;
  steps: Step[];
  status: 'completed' | 'current' | 'pending';
}

const phases: Phase[] = [
  {
    id: 'setup',
    label: 'Setup',
    steps: ['template', 'inspiration', 'project'],
    status: 'completed'
  },
  {
    id: 'configure',
    label: 'Configure',
    steps: ['integrations', 'environment'],
    status: 'current'
  },
  {
    id: 'launch',
    label: 'Launch',
    steps: ['preview', 'context', 'export'],
    status: 'pending'
  }
];

// Render shows 3 phases, not 8 steps
```

### Mobile Detection

```tsx
const isMobile = useMediaQuery('(max-width: 768px)');

return isMobile ? (
  <VerticalStepper phases={phases} />
) : (
  <HorizontalPhaseIndicator phases={phases} />
);
```

---

## Summary

1. **Group 8 steps into 3 phases** - Setup, Configure, Launch
2. **Use vertical layout on mobile** - More touch-friendly
3. **Add sublabels** - Help users understand each step
4. **Show progress %** - Reduce uncertainty
5. **Smart defaults** - Fewer decisions = faster completion

---

*UX Multi-Step Guide v1.0 | dawson-does-framework*

