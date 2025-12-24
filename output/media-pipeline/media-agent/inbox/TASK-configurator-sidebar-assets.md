# Media Agent Task: Configurator Sidebar Complete Asset Package

> **Priority**: P0 - CRITICAL
> **Created**: 2025-12-23
> **From**: Quality Agent
> **Brief Location**: `output/media-pipeline/shared/briefs/configurator-sidebar-complete-brief.md`

---

## Activation Prompt

```
Read output/media-pipeline/shared/briefs/configurator-sidebar-complete-brief.md and generate 
the complete asset package for the Configurator Sidebar UX redesign.

Start with Iteration 1 (P0 - Core Navigation):
- 7 navigation bar icons
- 4 state badges
- 8 integration category icons
- 6 step indicators

Total: 25 SVG assets

Follow these requirements:
1. All icons: 2px stroke, rounded linecaps, Lucide-compatible
2. Colors: #6366F1 (Indigo) for active, #71717A (Gray) for inactive
3. ViewBox: 24x24 for nav icons, 16x16 for badges, 32x32 for categories
4. File size: <3KB each
5. Clean SVG output (no metadata, no unnecessary groups)

Output to: output/media-pipeline/shared/assets/configurator-sidebar/

Reference:
- COLOR_PHILOSOPHY.md for brand colors
- Lucide icon library for aesthetic reference
- Linear.app for sidebar pattern inspiration
```

---

## Quick Reference

### Asset Counts by Iteration

| Iteration | Assets | Priority | Effort |
|-----------|--------|----------|--------|
| 1 - Core Navigation | 25 | P0 | ~2 hours |
| 2 - Polish | 14 | P1 | ~1 hour |
| 3 - Enhancements | 21 | P2 | ~1.5 hours |
| **TOTAL** | **60** | - | ~4.5 hours |

### Color Quick Reference

```
Indigo    #6366F1  →  Active, CTAs, primary
Violet    #8B5CF6  →  Gradients, hovers
Emerald   #10B981  →  Success/complete ONLY
Amber     #F59E0B  →  Warnings
Red       #EF4444  →  Errors
Gray      #71717A  →  Inactive, disabled
```

### File Structure

```
assets/configurator-sidebar/
├── nav/          (7 icons)
├── badges/       (4 icons)
├── categories/   (8 icons)
├── steps/        (6 icons)
├── chrome/       (4 icons)
├── patterns/     (5 assets)
├── feedback/     (5 assets)
├── empty/        (4 assets)
├── providers/    (14 icons)
└── tooltips/     (3 icons)
```

---

## After Generation

1. Run optimization (SVGO for SVGs, WebP compression)
2. Create `asset-manifest.json` with metadata
3. Notify Quality Agent for review
4. Quality Agent reviews against COLOR_PHILOSOPHY.md
5. Approved assets move to `shared/approved/configurator-sidebar/`
6. Website Agent receives handoff for implementation

---

*Task created by Quality Agent | Ready for Media Agent activation*

