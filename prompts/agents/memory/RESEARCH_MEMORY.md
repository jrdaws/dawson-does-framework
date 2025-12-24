# Research Agent Memory (Media Pipeline)

> **Role**: Media Pipeline Agent - Asset Researcher
> **Code**: RES
> **Domain**: Asset requirements analysis, brief creation, prompt engineering
> **Pipeline**: Media Generation (Agent 1 of 3)

---

## Role Summary

The Research Agent is the first agent in the Media Generation Pipeline. It analyzes project requirements, researches best practices for the app type, and creates comprehensive asset briefs with photorealistic prompts for the Media Agent.

### Key Responsibilities
- Analyze app type and brand requirements
- Research appropriate asset types and dimensions
- Create detailed asset briefs with generation prompts
- Apply photorealistic prompt engineering (camera + lens + lighting)
- Hand off briefs to Media Agent

### Key Files
- SOP: `prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md`
- Prompt Guide: `output/media-pipeline/shared/PHOTOREALISTIC_PROMPT_GUIDE.md`
- Brief Template: `output/media-pipeline/shared/briefs/BRIEF_TEMPLATE.md`
- Output: `output/agents/research/`

---

## Session History

### Session: 2025-12-23T23:30 (shadcn Migration + Sidebar Task)

#### Work Completed
- Analyzed current website shadcn usage (only 3 of 40+ components installed)
- Identified custom `terminal-*` classes that should use shadcn components
- Created comprehensive SOP: `docs/sops/SHADCN_IMPLEMENTATION_SOP.md`
- Created Website Agent task for shadcn migration + sidebar implementation
- Updated sidebar brief to reference shadcn components
- Delivered combined task to Website Agent inbox

#### Key Learnings
- Website has `components.json` but minimal component adoption
- Custom terminal styling creates maintenance burden
- Radix primitives installed but not leveraged properly
- Card, RadioGroup, Tabs are highest priority additions
- Sheet component essential for mobile sidebar drawer

#### Blockers Encountered
- None

#### Next Priorities
1. Monitor Website Agent progress on migration
2. Validate shadcn component styling matches brand
3. Review sidebar implementation when complete

#### Handoff Notes
Task delivered to: `output/agents/website/inbox/TASK-shadcn-migration-and-sidebar.txt`
SOP created: `docs/sops/SHADCN_IMPLEMENTATION_SOP.md`

---

### Session: 2025-12-23T20:39 (Configurator UX Redesign Brief)

#### Work Completed
- Read and integrated COLOR_PHILOSOPHY.md guidelines
- Read and applied UX_MULTI_STEP_GUIDE.md best practices
- Created configurator-ux-redesign-brief.md with 12 assets
- Applied 3-phase grouping (Setup, Configure, Launch)
- Specified icons, status indicators, connectors, and feedback graphics
- Included component specs for Website Agent

#### Key Learnings
- Phase grouping reduces cognitive load (8 steps → 3 phases)
- Emerald is ONLY for success/completed states (strict rule)
- Mobile-first means vertical stepper below 768px
- Fallback to Lucide icons if custom generation fails
- CSS variables enable dark mode switching

#### Blockers Encountered
- None

#### Next Priorities
1. Coordinate with Media Agent for icon generation
2. Review Website Agent implementation
3. Iterate based on user feedback

#### Handoff Notes
Brief delivered to: `output/agents/media/inbox/configurator-ux-redesign-brief.md`
Also relevant for: Website Agent (component specs included)

---

### Session: 2025-12-23T18:25 (Framework UI Redesign Brief)

#### Work Completed
- Analyzed current website (page.tsx, globals.css, tailwind.config.js)
- Researched modern SaaS design patterns (Vercel, Linear, Supabase, Railway)
- Proposed new color palette (Indigo #6366F1 + Violet #8B5CF6 system)
- Defined typography system (Inter + JetBrains Mono)
- Created comprehensive brief with 18 assets across 5 categories
- Included full camera/lens/lighting specs for photorealistic assets
- Maintained 100% feature parity mapping

#### Key Learnings
- UI redesigns need section-by-section feature mapping
- Color palettes need light AND dark mode variants
- Gradients work better than solid backgrounds for modern SaaS
- Vector icons (SVG) should match a specific icon library style
- Avatar portraits need diverse representation

#### Blockers Encountered
- None

#### Next Priorities
1. Review Media Agent output quality for hero gradient
2. Validate icon style consistency with design direction
3. Coordinate with Website Agent for phased implementation

#### Handoff Notes
Brief delivered to: `output/agents/media/inbox/framework-ui-redesign-brief.md`

---

### Session: 2025-12-23T17:48 (E2E Test Project Brief)

#### Work Completed
- Created comprehensive asset brief for e2e-test-project
- Applied photorealistic prompt engineering (Canon EOS R5, 35mm f/1.4)
- Specified 5 assets: hero (2), icon (2), empty state (1)
- Included full camera/lens/lighting specifications
- Handed off to Media Agent inbox

#### Key Learnings
- Hero images need environmental context (35mm lens)
- Mobile variants need tighter framing (50mm lens)
- Empty states work better as illustrations than photos
- Icons are better sourced from libraries (Lucide) than generated

#### Blockers Encountered
- None

#### Next Priorities
1. Review Media Agent output quality
2. Iterate prompts based on generation results
3. Expand asset library for other template types

#### Handoff Notes
Brief delivered to: `output/agents/media/inbox/e2e-test-project-asset-brief.md`

---

### Session: 2025-12-23 (Initial Setup)

#### Work Completed
- SOP created
- Brief template established
- Photorealistic prompt guide integrated

#### Key Learnings
- Always include camera + lens + lighting in prompts
- Negative prompts are essential to avoid AI artifacts
- Asset Target (TEMPLATE vs PROJECT) must be specified

#### Blockers Encountered
- None

#### Next Priorities
1. Create first asset brief for a real project
2. Refine prompt templates based on results
3. Build library of proven prompts

#### Handoff Notes
Briefs go to Media Agent inbox.

---

## Metrics Tracking

| Metric | Value | Trend |
|--------|-------|-------|
| Briefs created | 4 | ↑ |
| Assets specified | 50 | ↑↑ |
| SOPs created | 1 | NEW |
| Average brief completion time | ~15 min | → |

---

## Asset Type Reference

| App Type | Typical Assets |
|----------|----------------|
| SaaS | Hero, feature icons, empty states, avatars |
| E-commerce | Product shots, category banners, trust badges |
| Landing Page | Hero, feature icons, testimonial avatars |
| Blog | Header images, author avatars, category icons |
| Mobile App | App icons, splash, onboarding illustrations |

---

## Photorealistic Prompt Formula

```
[Subject] + [Photography Style] + [Camera/Lens] + [Lighting] + [Color Grade]
+ Negative prompt: [Anti-AI-tells]
```

### Essential Elements
- Camera: "shot on Canon EOS R5" (or Sony, Hasselblad)
- Lens: "85mm f/1.4" (specifies depth of field)
- Lighting: "natural window light" or "studio softbox"
- Style: "editorial/commercial/lifestyle photography"
- Negative: cartoon, CGI, plastic skin, oversaturated, etc.

---

## Common Patterns

### Brief Structure
1. Project Context (type, style, colors)
2. Asset Categories (hero, icons, illustrations)
3. Per-Asset Details (dimensions, format, priority)
4. Generation Prompts (with negative prompts)
5. Quality Criteria

### Trigger Command
```
Read prompts/agents/roles/media-pipeline/RESEARCH_AGENT.md and create an asset brief for the project in your inbox.
```

---

## Notes

- Research Agent is the FIRST agent in the Media Pipeline
- MUST read PHOTOREALISTIC_PROMPT_GUIDE.md before creating prompts
- All prompts MUST include camera + lens + lighting
- Brief goes to: `output/media-pipeline/shared/briefs/[project]-asset-brief.md`
- Copy to Media Agent inbox for handoff

