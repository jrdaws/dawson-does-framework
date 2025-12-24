# Revision Request: Framework UI Redesign

> **From**: Quality Agent
> **Date**: 2025-12-23
> **Iteration**: 2 of 3
> **Assets Needing Revision**: 2

---

## Summary

| Asset | Issue | Priority | Action |
|-------|-------|----------|--------|
| terminal-mockup-clean.webp | Completely wrong subject | P1 Critical | Regenerate |
| hero-abstract-graphic.webp | Slightly busy, test first | P1 Minor | Test/Optional regenerate |

---

## Critical: terminal-mockup-clean.webp - REGENERATE

### Problem

The generated image is **completely wrong**. Instead of a macOS terminal window, it shows:
- An industrial/retro device with green/red LED bars
- Garbled spreadsheet content
- Silver industrial casing

This is unusable.

### What We Need

A clean UI-style mockup of a macOS terminal window:
- **NOT a photograph** of physical hardware
- Flat/2.5D design like Figma mockups
- Black terminal background with syntax-colored text
- macOS traffic light buttons (red/yellow/green)
- Framework CLI commands visible

### Regeneration Options

**Option A - AI with UI Style Prompt**:

```
Clean macOS terminal window UI mockup on subtle gradient background,
floating terminal window with red yellow green traffic light buttons,
black terminal background with monospace font,
green and cyan command text showing: npx @jrdaws/framework export saas ./my-app,
white cursor blinking, subtle drop shadow under window,
flat design mockup style, Figma presentation aesthetic,
clean minimal composition, professional documentation screenshot,
no physical device visible, pure UI presentation

Negative prompt: photograph, physical device, monitor, laptop, LED lights,
industrial equipment, hardware, real world, retro, vintage,
spreadsheet, data table, trading terminal, 3D render
```

**Option B - Composite Approach (Recommended)**:
1. Take actual screenshot of terminal running framework commands
2. Add macOS window chrome
3. Place on gradient background
4. Export as WebP

**Option C - Use Existing Asset**:
The `dashboard-preview.webp` shows a laptop - could crop/use terminal from that composition if visible.

### Requirements Checklist

- [ ] macOS-style window (rounded corners, traffic lights)
- [ ] Dark terminal background (#1E1E1E or similar)
- [ ] Visible CLI commands (framework syntax)
- [ ] Clean background (gradient or solid)
- [ ] UI mockup style, NOT photographic
- [ ] 1200x800 dimensions

---

## Minor: hero-abstract-graphic.webp - TEST FIRST

### Issue

Current version is visually dynamic but:
1. More chaotic/busy than Linear/Vercel aesthetic
2. Teal/emerald dominates visually
3. May clash with purple hero gradient when combined

### Recommendation

**TEST BEFORE REGENERATING**:

1. Composite the abstract graphic onto `hero-gradient-bg.webp`
2. Check visual harmony
3. If it works → Approve as-is
4. If it clashes → Regenerate with more subtle approach

### If Regeneration Needed

```
Subtle abstract geometric illustration for SaaS hero section,
minimal interconnected nodes and flowing lines,
clean vector style with soft indigo (#6366F1) and violet (#8B5CF6),
large amounts of negative space, elegant simplicity,
tech workflow metaphor with light touch,
Linear app inspired minimalism, premium aesthetic,
floating geometric elements with soft shadows,
not busy or chaotic, breathable composition

Color emphasis:
- 70% Indigo #6366F1
- 20% Violet #8B5CF6  
- 10% Emerald #10B981 (accent only)

Negative prompt: busy, cluttered, too many elements, chaotic,
aggressive geometry, neon colors, heavy saturation,
overwhelming, complex, dense composition
```

---

## Approved Assets (No Changes Needed)

These 15 assets passed quality review:

### Hero
- ✅ hero-gradient-bg.webp
- ✅ hero-gradient-bg-mobile.webp
- ✅ hero-mesh-pattern.svg

### Icons (All 6)
- ✅ icon-templates.svg
- ✅ icon-plugins.svg
- ✅ icon-providers.svg
- ✅ icon-trust.svg
- ✅ icon-cli.svg
- ✅ icon-extensible.svg

### Screenshots
- ✅ dashboard-preview.webp
- ✅ code-editor-visual.webp

### Avatars (All 3)
- ✅ avatar-placeholder-1.webp
- ✅ avatar-placeholder-2.webp
- ✅ avatar-placeholder-3.webp

### Patterns (All 2)
- ✅ section-divider.svg
- ✅ footer-pattern.svg

---

## Priority

1. **CRITICAL**: Fix terminal-mockup-clean.webp first (this is P1 and blocks demo section)
2. **MINOR**: Test hero-abstract-graphic.webp placement, regenerate only if needed

---

## Deadline

Please complete terminal-mockup regeneration and resubmit for Iteration 2 review.

**One more revision cycle remains after this.**

---

*Feedback from Quality Agent | Iteration 1 Complete | Awaiting Revisions*

