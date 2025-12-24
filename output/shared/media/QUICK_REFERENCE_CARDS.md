# Media Pipeline Quick Reference Cards

> **Version**: 1.0 | **Last Updated**: 2025-12-23
>
> One-page reference for each pipeline agent. Print or keep visible during work.

---

# 🔬 RESEARCH AGENT - Quick Reference

## Essentials (Non-Negotiable)

```
BEFORE STARTING: Read PHOTOREALISTIC_PROMPT_GUIDE.md
```

## Prompt Formula

```
[Subject] + [Camera/Lens] + [Lighting] + [Style] + [Negative Prompt]
```

## Every Prompt MUST Include

| Element | Example |
|---------|---------|
| ✅ Camera | "shot on Canon EOS R5" |
| ✅ Lens | "85mm f/1.4" |
| ✅ Lighting | "natural window light from left" |
| ✅ Style | "editorial lifestyle photography" |
| ✅ Negative | "cartoon, CGI, plastic skin..." |

## Standard Negative Prompt

```
cartoon, illustration, 3d render, CGI, anime, oversaturated, 
plastic skin, waxy, stock photo generic, perfect symmetry, 
uncanny valley, HDR overdone, malformed hands, bad anatomy
```

## Camera Reference

| Subject | Camera | Lens |
|---------|--------|------|
| Portraits | Canon EOS R5 | 85mm f/1.4 |
| Products | Hasselblad H6D | 120mm macro |
| Interiors | Sony A7R IV | 24mm tilt-shift |
| Wide scenes | Canon 5D Mark IV | 35mm f/1.4 |

## Brief Must Specify

- [ ] Asset Target: TEMPLATE or PROJECT
- [ ] All assets with dimensions
- [ ] Priority levels (P1/P2/P3)

---

# 🎨 MEDIA AGENT - Quick Reference

## Essentials (Non-Negotiable)

```
BEFORE STARTING: Read PHOTOREALISTIC_PROMPT_GUIDE.md
BEFORE GENERATING: Verify camera/lens in prompt
```

## Cost Optimization (MANDATORY)

| Phase | Tool | Cost |
|-------|------|------|
| ✅ ALL drafts | Stable Diffusion | $0.002-0.02 |
| ✅ Final heroes ONLY | DALL-E 3 | $0.04-0.12 |
| ❌ Don't use DALL-E for iterations |

## Pre-Generation Check

```
□ Camera model in prompt?
□ Lens specification?
□ Lighting description?
□ Negative prompt included?

ANY missing? → Return to Research Agent
```

## Self-Check Before Handoff

For EACH image verify:
- [ ] Skin natural (not plastic)
- [ ] Eyes have catchlights
- [ ] Lighting consistent
- [ ] Colors not oversaturated
- [ ] Hands correct (or hidden)
- [ ] Background clean
- [ ] Passes "real photo" test

**ANY fail? → Regenerate before handoff**

## Common Fixes

| Problem | Solution |
|---------|----------|
| Plastic skin | Add: "natural skin texture, visible pores" |
| Bad hands | Hide hands OR add to negative: "malformed hands" |
| Oversaturated | Add: "subtle color grade, muted tones" |

---

# ✅ QUALITY AGENT - Quick Reference

## Essentials (Non-Negotiable)

```
BEFORE STARTING: Read REJECTION_CRITERIA.md
TRACK: Iteration count (max 3)
```

## Photorealism Checklist (ALL Must Pass)

| Check | Pass? | If Fail |
|-------|-------|---------|
| Skin texture | ✓/✗ | Reject |
| Eyes realistic | ✓/✗ | Reject |
| Lighting consistent | ✓/✗ | Reject |
| Colors natural | ✓/✗ | Reject |
| Hands correct | ✓/✗ | Reject |
| Background clean | ✓/✗ | Reject |
| Overall "real" | ✓/✗ | Reject |

**ANY FAIL = Don't score. Immediate rejection.**

## Scoring (Only if photorealism passes)

| Category | Points |
|----------|--------|
| Visual Quality | /40 |
| Brand Alignment | /30 |
| Technical | /30 |
| **TOTAL** | /100 |

## Decision Matrix

| Score | Action |
|-------|--------|
| 90-100 | ✅ APPROVE → Integration |
| 70-89 | ⚠️ Minor revisions → Media Agent |
| 50-69 | 🔄 Major revisions → Regenerate |
| <50 | ❌ Reject → Research for new approach |

## After 3 Iterations

```
Approve best available with NOTES.txt documenting limitations
```

---

# 🔧 INTEGRATION AGENT - Quick Reference

## Essentials (Non-Negotiable)

```
BEFORE INTEGRATING: Verify APPROVAL.txt exists
```

## Asset Target Destinations

| Target | Agent | Destination |
|--------|-------|-------------|
| TEMPLATE | Template Agent | `templates/[name]/public/` |
| PROJECT | Website Agent | User's project folder |

## Integration Checklist

- [ ] All assets have APPROVAL.txt
- [ ] Manifest reviewed for correct files
- [ ] Assets copied to correct location
- [ ] Component imports updated
- [ ] Images display correctly
- [ ] Naming conventions followed

## Folder Structure

```
templates/[template]/public/
├── images/      ← Hero images
├── icons/       ← Icon files
└── illustrations/ ← Illustrations
```

---

# 📊 PROMPT CHEAT SHEET

## Hero Image - Person at Computer

```
Professional woman working on MacBook Pro in modern co-working space, 
candid focused expression, shot on Canon EOS R5 85mm f/1.4, 
natural window light from left, shallow depth of field with soft bokeh, 
editorial lifestyle photography, subtle Lightroom color grade

Negative: stock photo, posed, plastic skin, oversaturated, HDR, 
cartoon, CGI, perfect symmetry, vacant stare, malformed hands
```

## Product Shot

```
Sleek tech product on minimal white surface, commercial product photography, 
shot on Hasselblad H6D 120mm macro, professional studio softbox lighting, 
clean gradient background, Apple-style product shot, precise focus

Negative: CGI, 3d render, floating, amateur photography, 
wrong shadows, cheap looking, oversaturated
```

## Team Collaboration

```
Diverse team collaborating in bright modern office, candid meeting moment, 
shot on Sony A7R IV 35mm f/1.4, large windows with natural daylight, 
genuine expressions, documentary photography style, Fortune 500 quality

Negative: stock photo, posed, fake smiles, costume-like business attire, 
HDR overdone, mannequin-like, artificial lighting
```

---

# 🚨 REJECTION QUICK GUIDE

## Immediate Rejection Triggers

| Issue | What It Looks Like |
|-------|-------------------|
| 🚫 Plastic skin | Smooth like wax, no pores |
| 🚫 Vacant eyes | Lifeless, no catchlights |
| 🚫 Wrong fingers | More or fewer than 5 |
| 🚫 Multiple light sources | Shadows in wrong directions |
| 🚫 HDR overdone | Everything too bright/vibrant |
| 🚫 Stock photo feel | Too posed, generic smiles |

## The "Real Photo" Test

```
If you can tell it's AI-generated, it fails.
When in doubt, reject and regenerate.
```

---

*Full documentation: `output/media-pipeline/MEDIA_PIPELINE.md`*

