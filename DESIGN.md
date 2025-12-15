# Design System & UI Workflow

## UI Component System
We use **shadcn/ui** as the canonical component library.

Rules:
- Do NOT create custom UI components if a shadcn equivalent exists
- Extend via variants before creating new components
- All components live in `src/components/ui`

Reference:
https://ui.shadcn.com

---

## Design Source of Truth
Design decisions come from:

1. Figma (structure + layout)
2. shadcn/ui (implementation)
3. Tailwind tokens (spacing, color, typography)

Figma is used for:
- Page layout
- Component grouping
- Interaction intent (not pixel perfection)

---

## Inspiration Sources
Dribbble is used ONLY for inspiration, not direct copying.

Rules:
- Capture inspiration as screenshots or links
- Translate patterns into shadcn-compatible components
- Never recreate bespoke CSS-heavy designs

Reference:
https://dribbble.com

---

## Workflow
1. Research inspiration (Dribbble)
2. Rough layout in Figma
3. Implement with shadcn/ui + Tailwind
4. Review for consistency and accessibility
