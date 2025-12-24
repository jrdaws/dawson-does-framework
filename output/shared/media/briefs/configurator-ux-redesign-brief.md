# Asset Brief: Project Configurator UX Redesign

> Created: 2025-12-23 | Research Agent
> Priority: P1 - HIGH
> Status: Ready for Media Agent + Website Agent
> Based on: COLOR_PHILOSOPHY.md + UX_MULTI_STEP_GUIDE.md

---

## Project Context

### Objective
Create visual assets and UI components for redesigning the Project Configurator multi-step wizard. Transform an 8-step overwhelming flow into a clean 3-phase experience with improved visual hierarchy.

### Asset Target
- **Type**: PROJECT (website configurator)
- **Destination**: `website/public/images/configurator/`
- **Handoff**: Website Agent for implementation

### Problem Being Solved
| Issue | Current | Improved |
|-------|---------|----------|
| Step overload | 8 visible steps | 3 phases (8 steps grouped) |
| Mobile UX | Horizontal stepper (crowded) | Vertical stepper |
| Visual hierarchy | Unclear progression | Clear phase indicators |
| Cognitive load | High | Reduced with grouping |

---

## Color Philosophy Applied

### Required Colors (from COLOR_PHILOSOPHY.md)

| Usage | Color | Hex |
|-------|-------|-----|
| Primary actions (CTAs, active) | Indigo | `#6366F1` |
| Hover/secondary | Violet | `#8B5CF6` |
| Completed steps | Emerald | `#10B981` |
| Warnings | Amber | `#F59E0B` |
| Errors | Red | `#EF4444` |
| Disabled/pending | Gray | `#71717A` |
| Light background | White | `#FFFFFF` |
| Dark background | Near Black | `#0A0A0A` |

### 60-30-10 Rule Application
```
60% Neutral   → White/dark backgrounds, text
30% Indigo    → Active states, CTAs, progress indicators
10% Accents   → Success (Emerald), subtle Violet highlights
```

### ⚠️ Critical: Emerald Usage
Emerald (#10B981) is ONLY for completed steps and success checkmarks.
**NEVER** use emerald as primary color for buttons, active states, or CTAs.

---

## UX Pattern Selected

### Pattern: Phase Stepper with Collapsible Steps

Based on UX_MULTI_STEP_GUIDE.md recommendation - Pattern 1 + Pattern 2 hybrid:

```
Desktop:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ●────────○────────○                                     │
│   Setup   Configure  Launch                                 │
│                                                             │
│   Current: 1/3  ·  Template  ·  Inspiration  ·  Project    │
│   [████████████░░░░░░░░░░░░░░░░░░░░░]  37%                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile:
┌───────────────────┐
│ ✓ Setup      Done │
│ ● Configure  2/2  │
│   └ Integrations  │
│ ○ Launch   Locked │
└───────────────────┘
```

### Phase Grouping

| Phase | Label | Steps Included | Mindset |
|-------|-------|----------------|---------|
| 1. Setup | "Setup" | Template, Inspiration, Project | "What am I building?" |
| 2. Configure | "Configure" | Integrations, Environment | "How will it work?" |
| 3. Launch | "Launch" | Preview, Context, Export | "Ship it!" |

---

## Required Assets (12 Total)

### Category 1: Phase Indicator Icons (3 assets)

| Asset | Dimensions | Format | Priority |
|-------|-----------|--------|----------|
| phase-setup-icon | 32x32 | SVG | P1 |
| phase-configure-icon | 32x32 | SVG | P1 |
| phase-launch-icon | 32x32 | SVG | P1 |

### Category 2: Step Status Icons (4 assets)

| Asset | Dimensions | Format | Priority |
|-------|-----------|--------|----------|
| step-completed | 24x24 | SVG | P1 |
| step-current | 24x24 | SVG | P1 |
| step-pending | 24x24 | SVG | P1 |
| step-locked | 24x24 | SVG | P2 |

### Category 3: Phase Backgrounds (2 assets)

| Asset | Dimensions | Format | Priority |
|-------|-----------|--------|----------|
| stepper-connector-horizontal | 200x4 | SVG | P1 |
| stepper-connector-vertical | 4x200 | SVG | P1 |

### Category 4: Celebration/Feedback (3 assets)

| Asset | Dimensions | Format | Priority |
|-------|-----------|--------|----------|
| completion-confetti | 400x400 | SVG/Lottie | P2 |
| step-success-animation | 48x48 | SVG/Lottie | P2 |
| export-success-graphic | 300x200 | WebP | P2 |

---

## Generation Prompts

### phase-setup-icon

**Style Specification (SVG):**
```
Icon representing "Setup" phase for multi-step wizard,
simple cube or building block metaphor,
outline style with 2px stroke weight,
color: Indigo #6366F1,
rounded corners, friendly aesthetic,
matches Lucide/Heroicons style,
24x24 base grid, viewBox 0 0 24 24

Concept options:
- Stacked layers/blocks (foundation)
- Package/box icon
- Grid/template icon

Stroke specs:
- Weight: 2px
- Linecap: round
- Linejoin: round
- Fill: none (outline only)
```

---

### phase-configure-icon

**Style Specification (SVG):**
```
Icon representing "Configure" phase for multi-step wizard,
settings/gear or sliders metaphor,
outline style with 2px stroke weight,
color: Indigo #6366F1,
rounded corners, friendly aesthetic,
matches Lucide/Heroicons style,
24x24 base grid, viewBox 0 0 24 24

Concept options:
- Gear/cog with lines
- Adjustment sliders
- Toggle switches
- Puzzle piece connecting

Stroke specs:
- Weight: 2px
- Linecap: round
- Linejoin: round
- Fill: none (outline only)
```

---

### phase-launch-icon

**Style Specification (SVG):**
```
Icon representing "Launch" phase for multi-step wizard,
rocket or send/deploy metaphor,
outline style with 2px stroke weight,
color: Indigo #6366F1,
rounded corners, friendly aesthetic,
matches Lucide/Heroicons style,
24x24 base grid, viewBox 0 0 24 24

Concept options:
- Rocket launching
- Paper plane (send)
- Arrow pointing up-right
- Play/start button

Stroke specs:
- Weight: 2px
- Linecap: round
- Linejoin: round
- Fill: none (outline only)
```

---

### step-completed

**Style Specification (SVG):**
```
Checkmark icon indicating completed step,
circle with centered checkmark,
FILLED style (not outline) for visual weight,
color: Emerald #10B981 (SUCCESS color only),
rounded, satisfying proportions,
24x24 viewBox

Structure:
- Circle fill: #10B981 (solid)
- Checkmark stroke: #FFFFFF (white)
- Checkmark weight: 2px
- Optional: subtle inner shadow for depth
```

---

### step-current

**Style Specification (SVG):**
```
Dot/circle indicating current active step,
filled circle with subtle ring,
color: Indigo #6366F1,
indicates "you are here",
24x24 viewBox

Structure:
- Inner circle: #6366F1 (solid, 8px diameter)
- Outer ring: #6366F1 at 30% opacity (12px diameter)
- Optional: pulsing animation class
```

---

### step-pending

**Style Specification (SVG):**
```
Empty circle indicating pending/future step,
outline only (not filled),
color: Gray #71717A at 50% opacity,
understated, doesn't distract,
24x24 viewBox

Structure:
- Circle stroke: #71717A at 50%
- Stroke width: 2px
- Fill: none
- Interior: transparent
```

---

### step-locked

**Style Specification (SVG):**
```
Lock icon indicating locked/unavailable step,
small padlock outline,
color: Gray #71717A,
communicates "complete previous first",
24x24 viewBox

Structure:
- Lock body: rounded rectangle
- Lock shackle: curved top
- Stroke: #71717A, 1.5px
- Fill: none
```

---

### stepper-connector-horizontal

**Style Specification (SVG):**
```
Horizontal connector line for desktop stepper,
gradient line from left to right,
indicates progress between phases,
200px width x 4px height

Structure:
- Completed portion: gradient Indigo → Violet
- Pending portion: Gray #E5E5E5 (light) / #333333 (dark)
- CSS classes for dynamic width adjustment

Gradient:
- Start: #6366F1 (Indigo)
- End: #8B5CF6 (Violet)
- Direction: left to right
```

---

### stepper-connector-vertical

**Style Specification (SVG):**
```
Vertical connector line for mobile stepper,
gradient line from top to bottom,
indicates progress between steps,
4px width x 200px height

Structure:
- Completed portion: solid Emerald #10B981
- Current portion: gradient Indigo → Violet
- Pending portion: dashed Gray #E5E5E5

Line specs:
- Width: 2px centered in 4px viewBox
- Dashed for pending: 4px dash, 4px gap
```

---

### export-success-graphic

**Prompt:**
```
Clean modern illustration of successful project export,
abstract visualization of code/project being deployed,
rocket or arrow launching upward with trail,
indigo (#6366F1) and violet (#8B5CF6) color scheme,
white or light background, celebration mood,
minimal modern style, suitable for modal/dialog,
subtle confetti or sparkle elements optional,
professional SaaS aesthetic, Linear-app inspired

Color requirements:
- Primary: Indigo #6366F1 (main element)
- Secondary: Violet #8B5CF6 (trail/accent)
- Accent: Emerald #10B981 (small success indicators only)
- Background: Transparent or #FFFFFF

Negative prompt: realistic, photographic, cluttered, busy,
too many colors, childish, clip art, cartoon mascot,
generic stock illustration, rainbow effects
```

**Style Specifications:**
- Type: Vector illustration (abstract)
- Mood: Celebration, accomplishment, excitement
- Aesthetic: Premium SaaS, not childish

---

## Component Specifications (for Website Agent)

### Phase Indicator Component

```tsx
interface PhaseIndicatorProps {
  phases: Phase[];
  currentPhase: number;
  currentStep: number;
}

interface Phase {
  id: string;
  label: string;
  icon: 'setup' | 'configure' | 'launch';
  steps: string[];
  status: 'completed' | 'current' | 'pending';
}

// Colors to use:
const colors = {
  completed: '#10B981',  // Emerald - SUCCESS ONLY
  current: '#6366F1',    // Indigo - PRIMARY
  pending: '#71717A',    // Gray - MUTED
  connector: {
    filled: 'linear-gradient(to right, #6366F1, #8B5CF6)',
    empty: '#E5E5E5'
  }
};
```

### Mobile Vertical Stepper

```tsx
// Breakpoint: 768px
// Below 768px: Render vertical layout
// Above 768px: Render horizontal layout

const isMobile = useMediaQuery('(max-width: 768px)');

return isMobile ? (
  <VerticalPhaseStepper 
    phases={phases}
    expandCurrentPhase={true}
  />
) : (
  <HorizontalPhaseIndicator 
    phases={phases}
    showSubsteps={true}
    showProgress={true}
  />
);
```

### Progress Calculation

```typescript
// Total: 8 steps across 3 phases
// Progress = (completedSteps / totalSteps) * 100

const calculateProgress = (currentPhase: number, currentStep: number): number => {
  const stepsPerPhase = [3, 2, 3]; // Setup: 3, Configure: 2, Launch: 3
  
  let completed = 0;
  for (let i = 0; i < currentPhase; i++) {
    completed += stepsPerPhase[i];
  }
  completed += currentStep;
  
  return Math.round((completed / 8) * 100);
};
```

---

## File Naming Convention

```
website/public/images/configurator/
├── phases/
│   ├── phase-setup-icon.svg
│   ├── phase-configure-icon.svg
│   └── phase-launch-icon.svg
├── steps/
│   ├── step-completed.svg
│   ├── step-current.svg
│   ├── step-pending.svg
│   └── step-locked.svg
├── connectors/
│   ├── stepper-connector-horizontal.svg
│   └── stepper-connector-vertical.svg
└── feedback/
    ├── completion-confetti.svg (or .json for Lottie)
    ├── step-success-animation.svg
    └── export-success-graphic.webp
```

---

## Quality Criteria

### All SVG Assets
- [ ] Consistent stroke width (2px for icons)
- [ ] Correct colors from palette (no deviations)
- [ ] Clean paths (no unnecessary nodes)
- [ ] Proper viewBox sizing (24x24 or specified)
- [ ] Works on both light and dark backgrounds
- [ ] File size < 5KB each

### Color Validation
- [ ] Indigo #6366F1 used for primary/current states
- [ ] Emerald #10B981 used ONLY for completed/success
- [ ] Violet #8B5CF6 used only for gradients/hover
- [ ] Gray #71717A used for disabled/pending
- [ ] No colors outside the defined palette

### UX Compliance
- [ ] Icons are clearly distinguishable at 24x24
- [ ] Completed state is visually "done" (filled, not outline)
- [ ] Current state is visually prominent
- [ ] Pending state is visually subdued
- [ ] Connectors show clear progress visualization

---

## Implementation Priority

| Priority | Asset | Effort | Impact |
|----------|-------|--------|--------|
| P1 | Phase icons (3) | Low | High |
| P1 | Step status icons (4) | Low | High |
| P1 | Connectors (2) | Low | Medium |
| P2 | Success animation | Medium | Medium |
| P2 | Export success graphic | Medium | Low |
| P2 | Confetti | Medium | Low |

---

## Pre-Handoff Checklist ✓

### Color Philosophy Compliance
- [x] Read COLOR_PHILOSOPHY.md before creating brief
- [x] All colors from approved palette
- [x] 60-30-10 rule applied
- [x] Emerald used ONLY for success states
- [x] Indigo is the primary color
- [x] Dark mode considerations noted

### UX Guide Compliance
- [x] Read UX_MULTI_STEP_GUIDE.md
- [x] Phase grouping applied (3 phases, 8 steps)
- [x] Mobile-first approach (vertical stepper)
- [x] Progress indicator specified
- [x] Cognitive load reduced

### Brief Quality
- [x] All assets have dimensions specified
- [x] All assets have format specified
- [x] Style notes detailed
- [x] Priority levels assigned
- [x] File naming convention defined
- [x] Component specs for Website Agent included

---

## Notes for Website Agent

1. **Phased implementation possible**:
   - Phase 1: Update stepper logic to phases (code only)
   - Phase 2: Add new phase icons and connectors
   - Phase 3: Add animations and polish

2. **Use existing Lucide icons as fallback**:
   - Setup: `Layers` or `Package`
   - Configure: `Settings` or `Sliders`
   - Launch: `Rocket` or `Send`

3. **Animation library recommendation**:
   - Use Framer Motion for step transitions
   - Or Lottie for complex celebratory animations

4. **CSS custom properties for colors**:
   - All colors should use CSS variables from COLOR_PHILOSOPHY.md
   - Enables dark mode switching

---

*Brief created by Research Agent | Ready for Media Agent + Website Agent pickup*

