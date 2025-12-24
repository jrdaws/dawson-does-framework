# Photorealistic Image Prompt Guide

> **Goal**: Generate images indistinguishable from professional photography
> **Anti-Goal**: Avoid the "AI look" (oversaturated, plastic skin, uncanny valley)

---

## The Problem with Default AI Images

Default AI-generated images often have these tells:
- Over-saturated, hyper-vibrant colors
- Plastic/waxy skin on people
- Too-perfect symmetry
- Unrealistic lighting (everything lit evenly)
- Blurry or nonsensical backgrounds
- Text/numbers that don't make sense
- "Stock photo" generic feel

---

## The Solution: Camera-First Prompting

**Instead of describing the scene, describe how a photographer would shoot it.**

### Core Formula

```
[Subject] + [Photography Style] + [Camera/Lens] + [Lighting] + [Post-Processing] + [Negative Prompts]
```

---

## Photography Style References

### Product Photography
```
commercial product photography, studio lighting, clean white background, 
professional product shot, e-commerce style, high-end advertising
```

### Editorial/Lifestyle
```
editorial photography, lifestyle shot, candid moment, natural environment,
magazine quality, documentary style, authentic moment
```

### Corporate/Business
```
corporate photography, professional headshot, modern office environment,
business editorial, annual report style, Fortune 500 aesthetic
```

### Tech/SaaS
```
tech product photography, minimal composition, modern workspace,
startup culture, silicon valley aesthetic, clean and minimal
```

---

## Camera & Lens References (Critical for Realism)

### For Portraits/People
```
shot on Canon EOS R5, 85mm f/1.4 lens, shallow depth of field,
bokeh background, natural skin texture, catch lights in eyes
```

### For Products
```
shot on Hasselblad H6D, 120mm macro lens, focus stacking,
product photography lighting, precise focus, commercial quality
```

### For Interiors/Spaces
```
shot on Sony A7R IV, 24mm tilt-shift lens, architectural photography,
natural window light, interior design magazine quality
```

### For Wide Scenes
```
shot on Canon 5D Mark IV, 35mm f/1.4 lens, environmental portrait,
context and subject balance, photojournalistic style
```

---

## Lighting Descriptors

### Studio Lighting
```
three-point lighting setup, key light with softbox, rim light,
professional studio strobes, controlled lighting environment
```

### Natural Light
```
golden hour sunlight, soft diffused daylight, window light,
overcast sky natural lighting, backlit with sun flare
```

### Dramatic
```
Rembrandt lighting, chiaroscuro, single source dramatic light,
moody shadows, cinematic lighting setup
```

### Even/Commercial
```
beauty dish lighting, soft even illumination, no harsh shadows,
advertising quality lighting, high-key studio setup
```

---

## Post-Processing References

### Clean/Modern
```
color graded, VSCO preset style, subtle film grain,
professional retouching, skin texture preserved, clean edit
```

### Editorial
```
Lightroom edited, magazine post-processing, subtle contrast boost,
editorial color grade, professional photo editing
```

### Cinematic
```
cinematic color grade, teal and orange tones, film emulation,
movie still aesthetic, desaturated shadows
```

---

## Negative Prompts (CRITICAL)

Always include these to avoid AI tells:

### Essential Negative Prompts
```
Negative prompt: cartoon, illustration, 3d render, CGI, anime, 
painting, drawing, sketch, digital art, oversaturated, 
plastic skin, waxy, unrealistic, artificial, stock photo generic,
perfect symmetry, too clean, uncanny valley, airbrushed,
overprocessed, HDR overdone, blurry background artifacts,
bad anatomy, distorted features, extra limbs, malformed hands,
text, watermark, signature, logo
```

### For People/Portraits Add
```
Negative prompt: ... mannequin-like, expressionless, vacant stare,
unnatural pose, stiff posture, fake smile, over-retouched,
poreless skin, plastic hair, costume-like clothing
```

### For Products Add
```
Negative prompt: ... floating objects, inconsistent shadows,
wrong perspective, unrealistic reflections, cheap looking,
amateur photography, bad composition
```

---

## Complete Prompt Templates

### Template 1: SaaS Hero - Person Using Laptop

```
Prompt: Professional woman working on laptop in modern office space, 
candid moment of concentration, shot on Canon EOS R5 with 50mm f/1.4 lens, 
shallow depth of field with bokeh background, natural window light from left, 
minimal modern interior design, muted neutral color palette, 
editorial lifestyle photography, authentic and natural pose,
subtle film grain, magazine quality, professional color grading

Negative prompt: cartoon, illustration, 3d render, CGI, anime, stock photo,
oversaturated, plastic skin, fake smile, posed unnaturally, perfect symmetry,
HDR overdone, overprocessed, artificial lighting, costume-like clothing
```

### Template 2: Product Shot - Tech Device

```
Prompt: Sleek modern tech product on minimal white surface, 
commercial product photography, shot on Hasselblad medium format,
120mm lens with focus stacking, professional studio lighting with softbox,
clean gradient background, subtle reflections, high-end advertising quality,
Apple-style product photography, precise focus throughout,
color accurate, professional retouching

Negative prompt: cartoon, CGI, 3d render, floating, wrong shadows,
amateur photography, cheap looking, oversaturated, unrealistic materials,
bad perspective, inconsistent lighting
```

### Template 3: Team/Office Environment

```
Prompt: Diverse team collaborating in bright modern startup office,
candid meeting moment, authentic interactions, shot on Sony A7R IV,
35mm lens, environmental portrait style, large windows with natural daylight,
contemporary office design, real workspace not staged,
documentary photography style, genuine expressions,
editorial color grade, Fortune 500 quality

Negative prompt: stock photo, posed, fake smiles, oversaturated, 
costume-like business attire, unrealistic office, too perfect,
mannequin-like people, artificial lighting, HDR overdone
```

### Template 4: Abstract/Graphic Background

```
Prompt: Subtle gradient background with organic flowing shapes,
professional graphic design, premium brand aesthetic,
minimal and sophisticated, soft color transitions,
high-resolution texture, modern design trends 2024,
suitable for text overlay, corporate presentation quality

Negative prompt: busy, cluttered, cheap looking, harsh colors,
90s design, clip art, amateur, overdesigned, distracting patterns
```

### Template 5: Dashboard/App Screenshot Context

```
Prompt: Clean modern laptop displaying dashboard interface,
isometric angle on minimal desk setup, professional workspace,
shot on Canon 5D Mark IV, 85mm lens, product photography lighting,
shallow depth of field, modern minimal office background,
tech startup aesthetic, premium quality, advertising photography

Negative prompt: fake screen, obvious mockup, cheap desk,
cluttered background, bad angles, amateur photography,
unrealistic perspective, floating elements
```

---

## Model-Specific Recommendations

### Stable Diffusion (SDXL)
- **Best models**: RealVisXL, Juggernaut XL, AlbedoBase XL
- **Samplers**: DPM++ 2M Karras, Euler a
- **Steps**: 30-50 for photorealism
- **CFG**: 5-7 (lower = more natural, higher = more prompt adherence)

### DALL-E 3
- Emphasize "photograph" and "shot on [camera]" in prompts
- Reference real photography styles
- Keep prompts detailed but natural language

### Midjourney
- Use `--style raw` for less stylized output
- Add `--v 6` for latest version
- Use `photographic` and specific camera references

---

## Quality Checklist for Photorealistic Images

Before approving, verify:

- [ ] **Skin texture**: Natural pores visible, not waxy or plastic
- [ ] **Eyes**: Realistic reflections, proper catchlights
- [ ] **Lighting**: Consistent direction, natural shadows
- [ ] **Colors**: Not oversaturated, realistic tones
- [ ] **Background**: Appropriate blur/bokeh, no artifacts
- [ ] **Hands/Fingers**: Correct count, natural positioning
- [ ] **Text/Numbers**: If present, are they legible and correct?
- [ ] **Overall feel**: Would I believe this is a real photo?

---

## Examples: Before/After Prompts

### ❌ Bad (Generic AI)
```
A woman working on a laptop in an office
```

### ✅ Good (Photorealistic)
```
Professional Asian woman in her 30s working on MacBook Pro in 
bright modern co-working space, candid focused expression, 
shot on Canon EOS R5 85mm f/1.4, natural window light from left side, 
shallow depth of field with soft bokeh, wearing casual smart clothing,
authentic workspace environment, editorial lifestyle photography,
subtle Lightroom color grade, genuine moment captured

Negative prompt: stock photo, posed, fake, plastic skin, 
oversaturated, HDR, illustration, CGI, perfect symmetry
```

---

## Integration with Pipeline

Update the RESEARCH_AGENT to use these templates:

1. **Analyze app type** → Select appropriate template category
2. **Define brand style** → Choose lighting and color grade approach  
3. **Generate prompts** → Use formula with camera/lens specifics
4. **Include negative prompts** → ALWAYS add the anti-AI tells list

---

## Quick Reference Card

```
FORMULA:
[Subject] + shot on [Camera Model] + [Lens mm f/stop] + 
[Lighting Type] + [Photography Style] + [Color Grade] +
Negative: [Anti-AI-tells list]

ESSENTIAL PHRASES:
- "shot on Canon/Sony/Hasselblad"
- "shallow depth of field"
- "natural lighting" or "studio softbox"
- "editorial/commercial/lifestyle photography"
- "authentic/candid moment"
- "subtle color grade"

ALWAYS INCLUDE NEGATIVE:
cartoon, illustration, CGI, 3d render, oversaturated, 
plastic skin, stock photo, fake, artificial, HDR overdone
```

