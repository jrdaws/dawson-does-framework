# Media Agent Memory (Media Pipeline)

> **Role**: Media Pipeline Agent - Image Generator
> **Code**: MED
> **Domain**: AI image generation, asset optimization, manifest creation
> **Pipeline**: Media Generation (Agent 2 of 3)

---

## Role Summary

The Media Agent is the second agent in the Media Generation Pipeline. It receives asset briefs from the Research Agent, generates images using AI tools (Stable Diffusion, DALL-E), optimizes files for web, and hands off to the Quality Agent.

### Key Responsibilities
- Read and execute asset briefs
- Generate images using AI tools (SD API, DALL-E, etc.)
- Optimize images for web (compression, format conversion)
- Create asset manifests with metadata
- Handle feedback loops for revisions (max 3 iterations)
- Hand off to Quality Agent

### Key Files
- SOP: `prompts/agents/roles/media-pipeline/MEDIA_AGENT.md`
- Output: `output/media-pipeline/media-agent/`
- Assets: `output/media-pipeline/shared/assets/[project]/`

---

## Session History

### Session: 2025-12-23 (Initial Setup)

#### Work Completed
- SOP created
- Generation workflow established
- Cost optimization strategy defined

#### Key Learnings
- Use Stable Diffusion for drafts (10-20x cheaper than DALL-E)
- Use DALL-E only for final hero images
- Always document generation prompts in manifest
- Max 3 iterations per asset

#### Blockers Encountered
- None

#### Next Priorities
1. Generate first asset set
2. Establish optimal SD settings for photorealism
3. Build prompt refinement library

#### Handoff Notes
Generated assets go to Quality Agent inbox.

---

## Metrics Tracking

| Metric | Value | Trend |
|--------|-------|-------|
| Assets generated | 0 | - |
| Iterations used | 0 | - |
| Total cost | $0.00 | - |
| First-pass approval rate | TBD | - |

---

## Cost Optimization Strategy

| Tool | Cost/Image | Use For |
|------|-----------|---------|
| Stable Diffusion API | $0.002-0.02 | All drafts, iterations, bulk |
| DALL-E 3 | $0.04-0.12 | Final hero images only |
| Local SD | Free | High volume, privacy needs |

### Recommended Workflow
1. Generate drafts with SD ($0.01/image)
2. Iterate with SD until close to final
3. Final hero images only with DALL-E
4. Expected savings: 60-80% vs all DALL-E

---

## Generation Settings (Stable Diffusion XL)

| Setting | Recommended Value |
|---------|-------------------|
| Model | RealVisXL, Juggernaut XL |
| Sampler | DPM++ 2M Karras |
| Steps | 30-50 |
| CFG Scale | 5-7 (lower = more natural) |
| Size | 1024x1024, then upscale |

---

## Common Patterns

### Asset Manifest Structure
```json
{
  "project": "project-name",
  "generatedAt": "2025-12-23T14:00:00Z",
  "generator": "stable-diffusion-xl",
  "assets": [
    {
      "id": "hero-main",
      "file": "optimized/hero-main.webp",
      "dimensions": "1920x1080",
      "format": "webp",
      "size": "245KB",
      "prompt": "...",
      "iterations": 2,
      "status": "pending-review"
    }
  ]
}
```

### Trigger Command
```
Read prompts/agents/roles/media-pipeline/MEDIA_AGENT.md and generate assets from the brief in your inbox.
```

---

## Notes

- Media Agent is the SECOND agent in the Media Pipeline
- REQUIRES brief from Research Agent
- Verify prompts include camera/lens before generating
- Generated assets go to: `output/media-pipeline/shared/assets/[project]/`
- Create review request in Quality Agent inbox for handoff
- Max 3 iterations per asset before escalation

