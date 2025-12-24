# Media Pipeline Rejection Criteria

> **Version**: 1.0 | **Last Updated**: 2025-12-23
>
> Specific criteria for rejecting AI-generated images. Use this guide to identify and reject images with obvious AI artifacts.

---

## Core Principle

**All images must be indistinguishable from professional photography.**

If you have ANY doubt whether an image looks AI-generated, it probably does. Reject and regenerate.

---

## Automatic Rejection Criteria

### 1. Plastic/Waxy Skin ❌

**What to look for:**
- Skin appears unnaturally smooth, like plastic or wax
- No visible pores or natural skin texture
- Overly airbrushed appearance
- Unnatural sheen or reflection on skin

**Examples:**
- Forehead looks like smooth plastic
- Cheeks have no natural texture
- Arms/hands look like mannequin parts

**Fix in prompt:**
```
Add: "natural skin texture, visible pores, realistic skin"
Add to negative: "plastic skin, waxy, airbrushed, poreless"
```

---

### 2. Vacant/Uncanny Eyes ❌

**What to look for:**
- Eyes appear lifeless or "dead"
- Missing proper catchlights (light reflections)
- Pupils don't focus on anything specific
- Eyes are too perfect or symmetrical
- Irises have unnatural patterns

**Examples:**
- Person staring blankly into distance
- Eyes that don't seem to "see"
- Perfectly identical eyes (humans have slight asymmetry)

**Fix in prompt:**
```
Add: "natural eyes with catchlights, genuine expression, focused gaze"
Add to negative: "vacant stare, lifeless eyes, expressionless"
```

---

### 3. Inconsistent Lighting/Shadows ❌

**What to look for:**
- Shadows going in multiple directions
- Light source doesn't match across the image
- Some areas brightly lit while others have no light source
- Shadows don't match object positions

**Examples:**
- Face lit from left but shadow on wrong side
- No shadows under chin despite overhead light
- Background lighting contradicts subject lighting

**Fix in prompt:**
```
Add: "consistent lighting from [direction], natural shadows"
Add: "single light source" or "three-point lighting setup"
```

---

### 4. Oversaturated/HDR Colors ❌

**What to look for:**
- Colors are unnaturally vibrant
- HDR-overdone look (everything is too bright)
- Teal and orange pushed too far
- Colors look like a bad Instagram filter

**Examples:**
- Grass is neon green instead of natural
- Skin has orange/magenta tint
- Sky is unnaturally blue

**Fix in prompt:**
```
Add: "natural color palette, subtle color grade, muted tones"
Add to negative: "oversaturated, HDR overdone, vibrant colors, hyperreal"
```

---

### 5. Malformed Hands/Fingers ❌

**What to look for:**
- Wrong number of fingers (more or fewer than 5)
- Fingers merged together
- Unnatural finger length or positioning
- Hands at impossible angles
- Missing thumbs or extra thumbs

**Examples:**
- 6 fingers on one hand
- Fingers that look like tentacles
- Hands with no clear structure

**Fix in prompt:**
```
Option 1: Hide hands ("hands behind back", "hands in pockets", "cropped at wrists")
Option 2: Add to negative: "bad hands, malformed hands, extra fingers, missing fingers, distorted hands"
```

---

### 6. Background Artifacts ❌

**What to look for:**
- Weird blobs or shapes in background
- Bokeh that doesn't look natural
- Objects that don't make sense
- Repeating patterns that break
- Text or letters that aren't readable

**Examples:**
- Bookshelves with books that melt together
- Signs with gibberish text
- Windows that have no view, just smear
- Plants with impossible leaves

**Fix in prompt:**
```
Add: "clean background, authentic environment, natural bokeh"
Add to negative: "blurry artifacts, weird background, unrealistic environment"
```

---

### 7. Stock Photo Generic Feel ❌

**What to look for:**
- Overly posed and staged feeling
- Everyone smiling the exact same way
- Perfect diversity quota arrangement
- Generic conference room setting
- Pointing at invisible whiteboards

**Examples:**
- Business people high-fiving
- Everyone looking at laptop with same expression
- Perfect circle of diverse people laughing

**Fix in prompt:**
```
Add: "authentic moment, candid, natural pose, genuine expression"
Add: "documentary style, editorial photography, not staged"
Add to negative: "stock photo, posed, fake smile, generic"
```

---

### 8. Perfect Unnatural Symmetry ❌

**What to look for:**
- Face is perfectly symmetrical (humans aren't)
- Objects are too precisely aligned
- Everything feels mathematically perfect
- Lack of natural asymmetry

**Examples:**
- Both sides of face are mirror images
- Furniture arranged too perfectly
- All elements equally spaced

**Fix in prompt:**
```
Add: "natural asymmetry, authentic, imperfect"
Add to negative: "perfect symmetry, artificial, too clean"
```

---

## Severity Levels

| Level | Criteria | Action |
|-------|----------|--------|
| **Critical** | Plastic skin, malformed hands, vacant eyes | Immediate rejection - regenerate |
| **Major** | Inconsistent lighting, oversaturation, stock photo feel | Rejection - prompt adjustment needed |
| **Minor** | Slight background artifacts, small asymmetry issues | Can be approved if other aspects excellent |

---

## Rejection Feedback Template

When rejecting an image, use this format:

```markdown
## Rejection: [asset-name]

**Reason**: [Primary issue - use criteria name above]

**Details**: [Specific description of what's wrong]

**Prompt Fix Suggestions**:
1. Add to main prompt: "[suggestion]"
2. Add to negative prompt: "[suggestion]"

**Alternative Approach** (if needed):
[Suggest different composition, hiding problematic elements, etc.]
```

---

## Examples of Acceptable vs. Rejectable

### Hero Image - Person at Laptop

**REJECT** if:
- Person has plastic-looking skin
- Eyes are vacant or don't focus
- Lighting comes from multiple conflicting directions
- Colors are oversaturated
- Visible hands have wrong finger count

**ACCEPT** if:
- Natural skin texture with visible pores
- Eyes have catchlights and genuine expression
- Consistent lighting with natural shadows
- Muted, professional color grade
- Hands hidden or correct

### Product Shot

**REJECT** if:
- Shadows don't match product position
- Reflections are inconsistent
- Product looks like CGI render
- Background has weird artifacts

**ACCEPT** if:
- Consistent studio lighting
- Natural reflections
- Product looks photographed, not rendered
- Clean, professional background

---

## Iteration Guidance

| Iteration | Focus |
|-----------|-------|
| 1st attempt | Check all criteria - identify primary issues |
| 2nd attempt | Verify fixes worked - check for new issues introduced |
| 3rd attempt | Accept best available OR recommend alternative approach |

**After 3 iterations**: Approve with documented notes, or recommend hiding/replacing problematic elements.

---

## Quality Agent Decision Tree

```
                    ┌─────────────────┐
                    │ Receive Assets  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Photorealism    │
                    │ Check (7 items) │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
     ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
     │ ALL PASS    │  │ 1-2 FAIL   │  │ 3+ FAIL     │
     └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
            │                │                │
     ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
     │ Continue to │  │ REJECT -    │  │ REJECT -    │
     │ Full Scoring│  │ Specific    │  │ Fundamental │
     │             │  │ Feedback    │  │ Regeneration│
     └──────┬──────┘  └─────────────┘  └─────────────┘
            │
     ┌──────▼──────┐
     │ Score ≥90?  │──Yes──▶ APPROVE
     └──────┬──────┘
            │No
     ┌──────▼──────┐
     │ REVISIONS   │
     │ NEEDED      │
     └─────────────┘
```

---

*Reference: `output/media-pipeline/shared/PHOTOREALISTIC_PROMPT_GUIDE.md`*

