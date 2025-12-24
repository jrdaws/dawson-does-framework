# Media Studio GUI Design & Implementation Plan

> **Version**: 1.0.0 | **Created**: 2025-12-23
> **Author**: Website Agent
> **Status**: Design Complete - Ready for Implementation

---

## Executive Summary

This document defines a comprehensive GUI interface for the Media Generation Pipeline, enabling users to:
1. Plan and generate photorealistic images for their projects
2. Review and approve generated assets with quality scoring
3. Track generation progress and costs
4. Integrate approved assets into templates or projects

---

## Part 1: Requirements Analysis

### 1.1 User Stories

| # | As a... | I want to... | So that... |
|---|---------|--------------|------------|
| US1 | Project Creator | Generate hero images for my SaaS landing page | My project has professional visual assets |
| US2 | Project Creator | Upload inspiration images | The AI understands my desired aesthetic |
| US3 | Project Creator | Specify camera/lighting preferences | Generated images look photorealistic |
| US4 | Project Creator | See real-time generation progress | I know the status and estimated time |
| US5 | Project Creator | Review and approve/reject assets | Only quality images go into my project |
| US6 | Admin | Track generation costs | I can manage API spending |

### 1.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR1 | Asset planning form with project context | P0 |
| FR2 | Photorealistic prompt builder with camera/lens/lighting | P0 |
| FR3 | Image generation with progress streaming | P0 |
| FR4 | Quality review interface with scoring | P0 |
| FR5 | Asset gallery with approve/reject actions | P1 |
| FR6 | Cost estimation and tracking | P1 |
| FR7 | Batch generation support | P2 |
| FR8 | Reference image upload | P2 |

### 1.3 Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR1 | Generation response time | < 30 seconds per image |
| NFR2 | UI responsiveness | < 100ms interaction feedback |
| NFR3 | Error recovery | Automatic retry with exponential backoff |
| NFR4 | Accessibility | WCAG 2.1 AA compliance |

---

## Part 2: Navigation & Architecture

### 2.1 Navigation Structure

```
/configure (existing)
├── Step 1: Template
├── Step 2: Inspiration
├── Step 3: Project
├── Step 4: Integrations
├── Step 5: Environment
├── Step 6: AI Preview
├── Step 7: Context
├── Step 8: Export
│
/media-studio (NEW - separate route)
├── Plan Assets (form)
├── Build Prompts (prompt builder)
├── Generate (progress + gallery)
└── Review (quality scoring)
```

**Rationale**: Media Studio as a separate route (not a configurator step) because:
1. Can be used independently of project configuration
2. Has its own multi-step workflow
3. More complex state management
4. May be accessed post-export for additional assets

### 2.2 Integration with Configurator

```typescript
// Link from Export step (Step 8)
<Link href="/media-studio?project={projectName}&template={template}">
  Generate Media Assets →
</Link>

// Media Studio reads initial context from query params
// or from shared configurator state
```

---

## Part 3: Wireframes (ASCII)

### 3.1 Media Studio - Plan Assets View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ◀ Back to Configurator                            Media Studio    [?] Help │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ ● Plan Assets    ○ Build Prompts    ○ Generate    ○ Review         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Project Context                                        Auto-filled │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ Project: my-saas-app                                               │   │
│   │ Template: SaaS                                                     │   │
│   │ Style: Modern, minimal, professional                               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Asset Target                                                       │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ ◉ PROJECT - Assets for this specific app                          │   │
│   │ ○ TEMPLATE - Assets for the starter template (reused by all)       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Required Assets                                          [+ Add]   │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ ┌─────────────────────────────────────────────────────────────────┐ │   │
│   │ │ Type: [Hero Image ▼]  Dimensions: [1920] x [1080]  Priority: P1│ │   │
│   │ │ Description: Main hero image with person using laptop           │ │   │
│   │ └─────────────────────────────────────────────────────────────────┘ │   │
│   │ ┌─────────────────────────────────────────────────────────────────┐ │   │
│   │ │ Type: [Icon ▼]       Dimensions: [64] x [64]      Priority: P1 │ │   │
│   │ │ Description: Dashboard analytics icon                           │ │   │
│   │ └─────────────────────────────────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Inspiration Images (Optional)                          [Upload]    │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ [img1] [img2] [+]                                                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                                          [Continue to Prompt Builder →]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Media Studio - Prompt Builder View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ◀ Back to Plan                                    Media Studio    [?] Help │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ ○ Plan Assets    ● Build Prompts    ○ Generate    ○ Review         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Asset: hero-main (1920x1080)                            1 of 2 assets    │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Subject                                                            │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ Professional woman working on laptop in modern office space,       │   │
│   │ candid moment of concentration                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌──────────────────────────────────┬──────────────────────────────────┐   │
│   │ Camera & Lens                    │ Lighting                         │   │
│   ├──────────────────────────────────┼──────────────────────────────────┤   │
│   │ Camera: [Canon EOS R5 ▼]         │ Type: [Natural Window ▼]         │   │
│   │ Lens: [85mm f/1.4 ▼]             │ Direction: [From Left ▼]         │   │
│   │ ☑ Shallow depth of field         │ Style: [Soft Diffused ▼]         │   │
│   └──────────────────────────────────┴──────────────────────────────────┘   │
│                                                                             │
│   ┌──────────────────────────────────┬──────────────────────────────────┐   │
│   │ Photography Style                │ Color Grade                      │   │
│   ├──────────────────────────────────┼──────────────────────────────────┤   │
│   │ [Editorial Lifestyle ▼]          │ [Subtle Film Grain ▼]            │   │
│   │ ☑ Candid/authentic               │ ☑ Magazine quality               │   │
│   └──────────────────────────────────┴──────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Generated Prompt (read-only, auto-composed)                        │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ Professional woman working on laptop in modern office space,       │   │
│   │ candid moment of concentration, shot on Canon EOS R5 85mm f/1.4,   │   │
│   │ shallow depth of field, natural window light from left, soft       │   │
│   │ diffused lighting, editorial lifestyle photography, candid moment, │   │
│   │ subtle film grain, magazine quality                                │   │
│   │                                                                     │   │
│   │ Negative prompt: cartoon, illustration, 3d render, CGI, anime,     │   │
│   │ oversaturated, plastic skin, stock photo, fake, HDR overdone...    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Cost Estimate                                                      │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ ⚡ Stable Diffusion: $0.02    ✨ DALL-E 3: $0.08                    │   │
│   │ Recommended: Stable Diffusion for draft, DALL-E for final hero     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│              [◀ Previous Asset]  [Next Asset ▶]  [Generate All →]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Media Studio - Generate View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ◀ Back to Prompts                                 Media Studio    [?] Help │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ ○ Plan Assets    ○ Build Prompts    ● Generate    ○ Review         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Generation Progress                                                │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │                                                                     │   │
│   │  Generating hero-main.webp...                        42%  ~18s     │   │
│   │  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░                          │   │
│   │                                                                     │   │
│   │  ✓ Prompt validated                                                 │   │
│   │  ✓ Model loaded (Stable Diffusion XL)                               │   │
│   │  ⏳ Generating image (step 15/30)                                   │   │
│   │  ○ Optimizing for web                                               │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Generated Assets (2 of 5 complete)                                 │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ ┌────────────────┐  ┌────────────────┐  ┌────────────────┐          │   │
│   │ │                │  │                │  │      ⏳        │          │   │
│   │ │   [Preview]    │  │   [Preview]    │  │   Generating   │          │   │
│   │ │                │  │                │  │                │          │   │
│   │ ├────────────────┤  ├────────────────┤  ├────────────────┤          │   │
│   │ │ feature-1.webp │  │ feature-2.webp │  │ hero-main.webp │          │   │
│   │ │ ✓ Complete     │  │ ✓ Complete     │  │ In Progress    │          │   │
│   │ └────────────────┘  └────────────────┘  └────────────────┘          │   │
│   │                                                                     │   │
│   │ Pending: icon-dashboard.svg, icon-users.svg                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Cost Summary                                                       │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ Total: $0.14 | Stable Diffusion: 5 images × $0.02 = $0.10          │   │
│   │                DALL-E upgrade: 1 × $0.04 = $0.04 (pending)          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                                              [Proceed to Review →]         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Media Studio - Review View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ◀ Back to Generate                               Media Studio    [?] Help │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ ○ Plan Assets    ○ Build Prompts    ○ Generate    ● Review         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   Reviewing: hero-main.webp                              Iteration 1 of 3  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ ┌───────────────────────────────────────┐ ┌─────────────────────────┐ │ │
│   │ │                                       │ │ Photorealism Check      │ │ │
│   │ │                                       │ ├─────────────────────────┤ │ │
│   │ │                                       │ │ ☑ Skin texture natural  │ │ │
│   │ │        [Large Preview Image]          │ │ ☑ Eyes realistic        │ │ │
│   │ │                                       │ │ ☑ Lighting consistent   │ │ │
│   │ │                                       │ │ ☑ Colors natural        │ │ │
│   │ │                                       │ │ ☑ Hands correct         │ │ │
│   │ │                                       │ │ ☐ Background clean      │ │ │
│   │ │                                       │ │ ☑ Overall photorealistic│ │ │
│   │ └───────────────────────────────────────┘ └─────────────────────────┘ │ │
│   │                                                                       │ │
│   │ ┌───────────────────────────────────────────────────────────────────┐ │ │
│   │ │ Quality Score                                                     │ │ │
│   │ ├───────────────────────────────────────────────────────────────────┤ │ │
│   │ │ Visual Quality    [████████░░] 35/40                              │ │ │
│   │ │ Brand Alignment   [██████████] 30/30                              │ │ │
│   │ │ Technical         [████████░░] 25/30                              │ │ │
│   │ │ ─────────────────────────────────────                             │ │ │
│   │ │ TOTAL: 90/100  ✓ APPROVED                                         │ │ │
│   │ └───────────────────────────────────────────────────────────────────┘ │ │
│   └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Revision Feedback (if rejecting)                                   │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ Background has minor bokeh artifacts. Regenerate with:             │   │
│   │ Negative prompt: "blurry artifacts, bad bokeh"                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│      [❌ Reject & Regenerate]    [⚠️ Approve with Notes]    [✓ Approve]    │
│                                                                             │
│              [◀ Previous Asset]              [Next Asset ▶]                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 4: Component Specifications

### 4.1 New Components to Create

| Component | Path | Description |
|-----------|------|-------------|
| `MediaStudioPage` | `app/media-studio/page.tsx` | Main page with step navigation |
| `MediaStudioLayout` | `app/media-studio/layout.tsx` | Layout with header |
| `AssetPlannerForm` | `app/components/media-studio/AssetPlannerForm.tsx` | Asset planning form |
| `PromptBuilder` | `app/components/media-studio/PromptBuilder.tsx` | Photorealistic prompt composer |
| `GenerationProgress` | `app/components/media-studio/GenerationProgress.tsx` | Streaming progress display |
| `AssetGallery` | `app/components/media-studio/AssetGallery.tsx` | Grid of generated assets |
| `QualityReviewer` | `app/components/media-studio/QualityReviewer.tsx` | Scoring and approval UI |
| `CostTracker` | `app/components/media-studio/CostTracker.tsx` | Cost estimation widget |

### 4.2 Component Hierarchy

```
MediaStudioPage
├── MediaStudioStepIndicator
│   ├── Step 1: Plan
│   ├── Step 2: Prompts
│   ├── Step 3: Generate
│   └── Step 4: Review
│
├── [Step 1] AssetPlannerForm
│   ├── ProjectContextCard
│   ├── AssetTargetSelector (PROJECT | TEMPLATE)
│   ├── AssetList
│   │   └── AssetItem (type, dimensions, priority, description)
│   └── InspirationUploader
│
├── [Step 2] PromptBuilder
│   ├── SubjectInput
│   ├── CameraLensSelector
│   ├── LightingSelector
│   ├── PhotographyStyleSelector
│   ├── ColorGradeSelector
│   ├── PromptPreview (read-only composed prompt)
│   └── NegativePromptDisplay
│
├── [Step 3] GenerationProgress
│   ├── ProgressBar
│   ├── StageIndicator
│   ├── AssetGallery
│   │   └── AssetCard (preview, status)
│   └── CostTracker
│
└── [Step 4] QualityReviewer
    ├── ImagePreview (large, zoomable)
    ├── PhotorealismChecklist (7 checkboxes)
    ├── QualityScoreSliders
    │   ├── VisualQuality (40 points)
    │   ├── BrandAlignment (30 points)
    │   └── Technical (30 points)
    ├── FeedbackInput
    └── ActionButtons (Approve | Approve with Notes | Reject)
```

---

## Part 5: State Management

### 5.1 New Zustand Store: `media-studio-state.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MediaStudioStep = 1 | 2 | 3 | 4;
export type AssetTarget = 'PROJECT' | 'TEMPLATE';
export type AssetType = 'hero' | 'icon' | 'illustration' | 'avatar' | 'background';
export type AssetStatus = 'pending' | 'generating' | 'complete' | 'reviewing' | 'approved' | 'rejected';
export type GeneratorModel = 'stable-diffusion' | 'dall-e-3';

export interface PlannedAsset {
  id: string;
  type: AssetType;
  name: string;
  dimensions: { width: number; height: number };
  description: string;
  priority: 'P1' | 'P2' | 'P3';
  prompt?: GeneratedPrompt;
  status: AssetStatus;
  generatedUrl?: string;
  score?: number;
  feedback?: string;
  iterations: number;
}

export interface GeneratedPrompt {
  subject: string;
  camera: string;
  lens: string;
  lighting: string;
  lightingDirection: string;
  photographyStyle: string;
  colorGrade: string;
  additionalModifiers: string[];
  negativePrompt: string;
  composedPrompt: string;
}

export interface MediaStudioState {
  // Step tracking
  currentStep: MediaStudioStep;
  
  // Project context (from configurator)
  projectName: string;
  template: string;
  assetTarget: AssetTarget;
  
  // Planned assets
  assets: PlannedAsset[];
  currentAssetIndex: number;
  
  // Inspiration images
  inspirations: { id: string; url: string }[];
  
  // Generation
  isGenerating: boolean;
  generationProgress: { assetId: string; percent: number; stage: string };
  
  // Costs
  estimatedCost: number;
  actualCost: number;
  
  // Actions
  setStep: (step: MediaStudioStep) => void;
  setProjectContext: (projectName: string, template: string) => void;
  setAssetTarget: (target: AssetTarget) => void;
  addAsset: (asset: Omit<PlannedAsset, 'id' | 'status' | 'iterations'>) => void;
  removeAsset: (id: string) => void;
  updateAsset: (id: string, updates: Partial<PlannedAsset>) => void;
  setCurrentAsset: (index: number) => void;
  setPrompt: (assetId: string, prompt: GeneratedPrompt) => void;
  setGenerating: (isGenerating: boolean) => void;
  updateProgress: (assetId: string, percent: number, stage: string) => void;
  approveAsset: (assetId: string, score: number) => void;
  rejectAsset: (assetId: string, feedback: string) => void;
  reset: () => void;
}
```

### 5.2 State Integration

The Media Studio store is **separate** from the configurator store but can read from it:

```typescript
// In media-studio/page.tsx
const { projectName, template } = useConfiguratorStore();
const { setProjectContext } = useMediaStudioStore();

useEffect(() => {
  setProjectContext(projectName, template);
}, [projectName, template]);
```

---

## Part 6: API Routes

### 6.1 New API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/media/generate` | Trigger image generation |
| GET | `/api/media/status/[jobId]` | Check generation status (polling) |
| POST | `/api/media/review` | Submit quality review |
| POST | `/api/media/approve` | Approve and save asset |
| GET | `/api/media/assets/[projectId]` | List project assets |

### 6.2 API Route Specifications

#### POST `/api/media/generate`

**Request:**
```typescript
interface GenerateRequest {
  projectId: string;
  assetTarget: 'PROJECT' | 'TEMPLATE';
  assets: {
    id: string;
    name: string;
    dimensions: { width: number; height: number };
    prompt: string;
    negativePrompt: string;
    model: 'stable-diffusion' | 'dall-e-3';
  }[];
}
```

**Response:**
```typescript
interface GenerateResponse {
  success: boolean;
  jobId: string;
  estimatedTime: number; // seconds
  estimatedCost: number; // dollars
}
```

#### GET `/api/media/status/[jobId]`

**Response (SSE streaming):**
```typescript
interface StatusEvent {
  type: 'progress' | 'complete' | 'error';
  assetId: string;
  percent?: number;
  stage?: string;
  url?: string;
  error?: string;
}
```

#### POST `/api/media/approve`

**Request:**
```typescript
interface ApproveRequest {
  assetId: string;
  projectId: string;
  assetTarget: 'PROJECT' | 'TEMPLATE';
  score: number;
  notes?: string;
}
```

**Response:**
```typescript
interface ApproveResponse {
  success: boolean;
  destination: string; // Path where asset was saved
  handoffTarget: 'template-agent' | 'website-agent';
}
```

---

## Part 7: Implementation Plan

### 7.1 Phase 1: Foundation (Week 1)

| Task | Time | Dependencies |
|------|------|--------------|
| Create `media-studio-state.ts` | 2h | - |
| Create `MediaStudioPage` with step navigation | 3h | State |
| Create `AssetPlannerForm` component | 4h | State |
| Add `/media-studio` route | 1h | Page |
| Integration test: Navigate and add assets | 2h | All above |

### 7.2 Phase 2: Prompt Builder (Week 1-2)

| Task | Time | Dependencies |
|------|------|--------------|
| Create camera/lens/lighting selector data | 2h | - |
| Create `PromptBuilder` component | 6h | Selectors |
| Implement prompt composition logic | 3h | Builder |
| Add negative prompt defaults | 1h | Logic |
| Integration test: Build and preview prompts | 2h | All above |

### 7.3 Phase 3: Generation (Week 2)

| Task | Time | Dependencies |
|------|------|--------------|
| Create `/api/media/generate` endpoint | 4h | - |
| Implement Stability AI integration | 4h | API |
| Create `GenerationProgress` component | 4h | API |
| Create `AssetGallery` component | 3h | Progress |
| Add SSE streaming for progress | 3h | API |
| Integration test: Generate and display images | 3h | All above |

### 7.4 Phase 4: Review (Week 3)

| Task | Time | Dependencies |
|------|------|--------------|
| Create `QualityReviewer` component | 5h | Gallery |
| Implement photorealism checklist | 2h | Reviewer |
| Create `/api/media/approve` endpoint | 3h | - |
| Implement handoff to Template/Website Agent | 4h | Approve API |
| Create `CostTracker` component | 2h | - |
| E2E test: Full pipeline through GUI | 4h | All above |

### 7.5 Total Estimated Time

| Phase | Hours |
|-------|-------|
| Foundation | 12h |
| Prompt Builder | 14h |
| Generation | 21h |
| Review | 20h |
| **Total** | **67h** |

---

## Part 8: Testing Requirements

### 8.1 Unit Tests

| Component | Tests |
|-----------|-------|
| `media-studio-state.ts` | State transitions, asset CRUD |
| `PromptBuilder` | Prompt composition, negative prompts |
| `QualityReviewer` | Score calculation, validation |

### 8.2 Integration Tests

| Test | Description |
|------|-------------|
| `media-studio-navigation.test.tsx` | Step navigation works correctly |
| `asset-planning.test.tsx` | Can add/remove/edit planned assets |
| `prompt-building.test.tsx` | Prompts include all required elements |
| `generation-flow.test.tsx` | API calls with correct payloads |
| `review-approval.test.tsx` | Approve/reject updates state correctly |

### 8.3 E2E Tests (Playwright)

```typescript
// e2e/media-studio.spec.ts
test.describe('Media Studio', () => {
  test('full pipeline: plan → build → generate → approve', async ({ page }) => {
    // Step 1: Plan
    await page.goto('/media-studio');
    await page.selectOption('[data-testid="asset-type"]', 'hero');
    await page.fill('[data-testid="asset-description"]', 'Modern SaaS hero');
    await page.click('[data-testid="add-asset"]');
    await page.click('[data-testid="continue-to-prompts"]');
    
    // Step 2: Build Prompts
    await expect(page).toHaveURL(/\/media-studio.*step=2/);
    await page.selectOption('[data-testid="camera-select"]', 'Canon EOS R5');
    await expect(page.locator('[data-testid="composed-prompt"]'))
      .toContainText('Canon EOS R5');
    await page.click('[data-testid="generate-all"]');
    
    // Step 3: Generate (wait for completion)
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="asset-complete"]'))
      .toBeVisible({ timeout: 60000 });
    await page.click('[data-testid="proceed-to-review"]');
    
    // Step 4: Review
    await expect(page.locator('[data-testid="quality-reviewer"]')).toBeVisible();
    await page.click('[data-testid="approve-asset"]');
    await expect(page.locator('[data-testid="approval-success"]')).toBeVisible();
  });
});
```

### 8.4 Accessibility Tests

| Test | Requirement |
|------|-------------|
| Keyboard navigation | All steps accessible via Tab/Enter |
| Screen reader | All images have alt text, forms labeled |
| Color contrast | Meets WCAG 2.1 AA |
| Focus indicators | Visible focus rings on all interactive elements |

---

## Part 9: Success Criteria

### 9.1 MVP Criteria (Must Have)

- [ ] User can plan assets with type, dimensions, description
- [ ] User can build photorealistic prompts with camera/lens/lighting
- [ ] System generates images via Stable Diffusion API
- [ ] User can review and approve/reject images
- [ ] Approved assets are saved to correct output folder
- [ ] Costs are estimated before generation

### 9.2 Extended Criteria (Should Have)

- [ ] Support for DALL-E 3 as alternative model
- [ ] Batch generation (multiple assets at once)
- [ ] Iteration tracking (max 3 per asset)
- [ ] Reference image upload for style matching
- [ ] Export approved assets as ZIP

### 9.3 Future Enhancements (Could Have)

- [ ] Real-time preview with lower quality draft
- [ ] AI-powered prompt suggestions based on project type
- [ ] Integration with Figma for design token matching
- [ ] Admin dashboard for cost tracking across all users

---

## Part 10: File Structure

```
website/
├── app/
│   ├── media-studio/
│   │   ├── page.tsx                    # Main page
│   │   └── layout.tsx                  # Layout with header
│   ├── api/
│   │   └── media/
│   │       ├── generate/
│   │       │   └── route.ts            # POST: trigger generation
│   │       ├── status/
│   │       │   └── [jobId]/
│   │       │       └── route.ts        # GET: SSE streaming status
│   │       ├── approve/
│   │       │   └── route.ts            # POST: approve asset
│   │       └── assets/
│   │           └── [projectId]/
│   │               └── route.ts        # GET: list assets
│   └── components/
│       └── media-studio/
│           ├── AssetPlannerForm.tsx
│           ├── PromptBuilder.tsx
│           ├── GenerationProgress.tsx
│           ├── AssetGallery.tsx
│           ├── QualityReviewer.tsx
│           ├── CostTracker.tsx
│           └── MediaStudioStepIndicator.tsx
├── lib/
│   ├── media-studio-state.ts           # Zustand store
│   ├── prompt-templates.ts             # Camera/lens/lighting data
│   └── media-generator.ts              # API client
└── tests/
    └── media-studio/
        ├── state.test.ts
        ├── prompt-builder.test.tsx
        └── e2e/
            └── media-studio.spec.ts
```

---

## Appendix A: Prompt Template Data

### Camera Options

```typescript
export const CAMERAS = [
  { value: 'canon-eos-r5', label: 'Canon EOS R5', type: 'mirrorless' },
  { value: 'sony-a7r-iv', label: 'Sony A7R IV', type: 'mirrorless' },
  { value: 'nikon-z9', label: 'Nikon Z9', type: 'mirrorless' },
  { value: 'hasselblad-h6d', label: 'Hasselblad H6D', type: 'medium-format' },
  { value: 'canon-5d-iv', label: 'Canon 5D Mark IV', type: 'dslr' },
];

export const LENSES = [
  { value: '24mm-f1.4', label: '24mm f/1.4', type: 'wide' },
  { value: '35mm-f1.4', label: '35mm f/1.4', type: 'standard' },
  { value: '50mm-f1.4', label: '50mm f/1.4', type: 'standard' },
  { value: '85mm-f1.4', label: '85mm f/1.4', type: 'portrait' },
  { value: '120mm-macro', label: '120mm Macro', type: 'macro' },
];
```

### Lighting Options

```typescript
export const LIGHTING_TYPES = [
  { value: 'natural-window', label: 'Natural Window Light' },
  { value: 'golden-hour', label: 'Golden Hour Sunlight' },
  { value: 'studio-softbox', label: 'Studio Softbox' },
  { value: 'three-point', label: 'Three-Point Lighting' },
  { value: 'rembrandt', label: 'Rembrandt (Dramatic)' },
];

export const LIGHTING_DIRECTIONS = [
  { value: 'from-left', label: 'From Left' },
  { value: 'from-right', label: 'From Right' },
  { value: 'from-above', label: 'From Above' },
  { value: 'backlit', label: 'Backlit' },
];
```

---

## Appendix B: Standard Negative Prompt

```typescript
export const STANDARD_NEGATIVE_PROMPT = `
cartoon, illustration, 3d render, CGI, anime, painting, drawing, sketch,
digital art, oversaturated, plastic skin, waxy, unrealistic, artificial,
stock photo generic, perfect symmetry, too clean, uncanny valley, airbrushed,
overprocessed, HDR overdone, blurry background artifacts, bad anatomy,
distorted features, extra limbs, malformed hands, text, watermark, signature,
logo, mannequin-like, expressionless, vacant stare, unnatural pose, stiff posture,
fake smile, over-retouched, poreless skin, plastic hair, costume-like clothing
`.trim().replace(/\n/g, ' ');
```

---

*Document created by Website Agent | 2025-12-23*
*Reference: output/website-agent/inbox/TASK-media-pipeline-gui-integration.txt*

