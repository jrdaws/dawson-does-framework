# Media Pipeline Standards

> Moved from AGENT_POLICIES.md to reduce bootstrap token consumption.
> **All Media Pipeline agents must enforce these photorealistic image standards.**

---

## Photorealistic Prompt Requirements

**Every image prompt MUST include:**

| Element | Example | Required? |
|---------|---------|-----------|
| Camera model | "shot on Canon EOS R5" | ✅ YES |
| Lens specification | "85mm f/1.4" | ✅ YES |
| Lighting description | "natural window light from left" | ✅ YES |
| Photography style | "editorial lifestyle photography" | ✅ YES |
| Negative prompt | "cartoon, CGI, plastic skin..." | ✅ YES |

**Standard Negative Prompt (include in every brief):**
```
cartoon, illustration, 3d render, CGI, anime, painting, drawing,
oversaturated, plastic skin, waxy, unrealistic, artificial, stock photo generic,
perfect symmetry, uncanny valley, airbrushed, HDR overdone, bad anatomy,
distorted features, extra limbs, malformed hands, text, watermark, signature
```

---

## Cost Optimization Requirements

| Phase | Tool | Cost |
|-------|------|------|
| ALL drafts & iterations | Stable Diffusion | $0.002-0.02/image |
| Final hero images ONLY | DALL-E 3 | $0.04-0.12/image |
| Artistic/marketing | Midjourney | Subscription |

**Rationale**: SD is 10-20x cheaper than DALL-E. Use SD for all drafts. Reserve DALL-E for final hero images only.

---

## Quality Enforcement

**Images MUST have:**
- Natural skin texture (not waxy or plastic)
- Realistic eyes with proper catchlights
- Consistent lighting direction
- Natural color saturation (not oversaturated)
- Correct hands/fingers
- Authentic background bokeh
- Overall "real photo" feel

**Images MUST NOT have:**
- Plastic or poreless skin
- Vacant or expressionless eyes
- Inconsistent shadow directions
- HDR-overdone look
- Wrong number of fingers
- Weird artifacts in backgrounds
- Stock photo generic feel
- Perfect unnatural symmetry

---

## Agent-Specific Enforcement

| Agent | Enforcement Requirement |
|-------|------------------------|
| Research Agent | Read `PHOTOREALISTIC_PROMPT_GUIDE.md` before creating prompts |
| Media Agent | Verify camera/lens in prompt before generating; Self-check for AI artifacts |
| Quality Agent | Use photorealism checklist; Reject images with obvious AI tells |
| Integration Agents | Verify all assets approved before integration |

---

## Iteration Limits

- Maximum **3 iterations** per project
- After 3 iterations: Approve best available with documented notes
- Track iteration count in every review report

---

## Documentation References

- `output/shared/media/PHOTOREALISTIC_PROMPT_GUIDE.md` - Full prompt engineering guide
- `output/shared/media/ENFORCEMENT_CHECKLIST.md` - Pre-handoff checklists
- `output/shared/media/REJECTION_CRITERIA.md` - What to reject and why
- `output/shared/media/QUICK_REFERENCE_CARDS.md` - One-page agent summaries

