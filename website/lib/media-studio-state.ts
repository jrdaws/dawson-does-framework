import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type MediaStudioStep = 1 | 2 | 3 | 4;
export type AssetTarget = 'PROJECT' | 'TEMPLATE';
export type AssetType = 'hero' | 'icon' | 'illustration' | 'avatar' | 'background' | 'feature';
export type AssetStatus = 'pending' | 'generating' | 'complete' | 'reviewing' | 'approved' | 'rejected';
export type GeneratorModel = 'stable-diffusion' | 'dall-e-3';
export type Priority = 'P1' | 'P2' | 'P3';

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

export interface PlannedAsset {
  id: string;
  type: AssetType;
  name: string;
  dimensions: { width: number; height: number };
  description: string;
  priority: Priority;
  prompt?: GeneratedPrompt;
  status: AssetStatus;
  generatedUrl?: string;
  score?: number;
  feedback?: string;
  iterations: number;
  model: GeneratorModel;
}

export interface Inspiration {
  id: string;
  url: string;
  name?: string;
}

export interface GenerationProgress {
  assetId: string;
  percent: number;
  stage: string;
  message?: string;
}

export interface MediaStudioState {
  // Step tracking
  currentStep: MediaStudioStep;
  completedSteps: Set<MediaStudioStep>;

  // Project context (from configurator or manual)
  projectName: string;
  template: string;
  assetTarget: AssetTarget;

  // Planned assets
  assets: PlannedAsset[];
  currentAssetIndex: number;

  // Inspiration images
  inspirations: Inspiration[];

  // Generation
  isGenerating: boolean;
  generationProgress: GenerationProgress | null;
  jobId: string | null;

  // Costs
  estimatedCost: number;
  actualCost: number;

  // Actions - Step navigation
  setStep: (step: MediaStudioStep) => void;
  completeStep: (step: MediaStudioStep) => void;
  canProceedToStep: (step: MediaStudioStep) => boolean;

  // Actions - Project context
  setProjectContext: (projectName: string, template: string) => void;
  setAssetTarget: (target: AssetTarget) => void;

  // Actions - Asset management
  addAsset: (asset: Omit<PlannedAsset, 'id' | 'status' | 'iterations' | 'model'>) => void;
  removeAsset: (id: string) => void;
  updateAsset: (id: string, updates: Partial<PlannedAsset>) => void;
  setCurrentAssetIndex: (index: number) => void;
  nextAsset: () => void;
  prevAsset: () => void;

  // Actions - Prompt building
  setPrompt: (assetId: string, prompt: GeneratedPrompt) => void;

  // Actions - Inspirations
  addInspiration: (url: string, name?: string) => void;
  removeInspiration: (id: string) => void;

  // Actions - Generation
  setGenerating: (isGenerating: boolean) => void;
  setJobId: (jobId: string | null) => void;
  updateProgress: (progress: GenerationProgress | null) => void;
  markAssetComplete: (assetId: string, generatedUrl: string) => void;
  markAssetFailed: (assetId: string, error: string) => void;

  // Actions - Review
  approveAsset: (assetId: string, score: number, notes?: string) => void;
  rejectAsset: (assetId: string, feedback: string) => void;

  // Actions - Costs
  updateCosts: (estimated: number, actual: number) => void;

  // Actions - Utility
  reset: () => void;
  getAssetById: (id: string) => PlannedAsset | undefined;
  getPendingAssets: () => PlannedAsset[];
  getApprovedAssets: () => PlannedAsset[];
}

// Helper to generate unique IDs
const generateId = () => `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Initial state
const initialState = {
  currentStep: 1 as MediaStudioStep,
  completedSteps: new Set<MediaStudioStep>(),
  projectName: '',
  template: 'saas',
  assetTarget: 'PROJECT' as AssetTarget,
  assets: [] as PlannedAsset[],
  currentAssetIndex: 0,
  inspirations: [] as Inspiration[],
  isGenerating: false,
  generationProgress: null,
  jobId: null,
  estimatedCost: 0,
  actualCost: 0,
};

// Store
export const useMediaStudioStore = create<MediaStudioState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Step navigation
      setStep: (step) => set({ currentStep: step }),

      completeStep: (step) => set((state) => ({
        completedSteps: new Set([...state.completedSteps, step]),
      })),

      canProceedToStep: (step) => {
        const state = get();
        switch (step) {
          case 1:
            return true;
          case 2:
            // Need at least one asset planned
            return state.assets.length > 0;
          case 3:
            // Need prompts for all assets
            return state.assets.every((a) => a.prompt?.composedPrompt);
          case 4:
            // Need all assets generated
            return state.assets.every((a) => 
              a.status === 'complete' || a.status === 'reviewing' || 
              a.status === 'approved' || a.status === 'rejected'
            );
          default:
            return false;
        }
      },

      // Project context
      setProjectContext: (projectName, template) => set({ projectName, template }),

      setAssetTarget: (assetTarget) => set({ assetTarget }),

      // Asset management
      addAsset: (assetData) => set((state) => ({
        assets: [
          ...state.assets,
          {
            ...assetData,
            id: generateId(),
            status: 'pending',
            iterations: 0,
            model: 'stable-diffusion',
          },
        ],
      })),

      removeAsset: (id) => set((state) => ({
        assets: state.assets.filter((a) => a.id !== id),
        currentAssetIndex: Math.min(state.currentAssetIndex, Math.max(0, state.assets.length - 2)),
      })),

      updateAsset: (id, updates) => set((state) => ({
        assets: state.assets.map((a) => 
          a.id === id ? { ...a, ...updates } : a
        ),
      })),

      setCurrentAssetIndex: (index) => set({ currentAssetIndex: index }),

      nextAsset: () => set((state) => ({
        currentAssetIndex: Math.min(state.currentAssetIndex + 1, state.assets.length - 1),
      })),

      prevAsset: () => set((state) => ({
        currentAssetIndex: Math.max(state.currentAssetIndex - 1, 0),
      })),

      // Prompt building
      setPrompt: (assetId, prompt) => set((state) => ({
        assets: state.assets.map((a) =>
          a.id === assetId ? { ...a, prompt } : a
        ),
      })),

      // Inspirations
      addInspiration: (url, name) => set((state) => ({
        inspirations: [
          ...state.inspirations,
          { id: generateId(), url, name },
        ],
      })),

      removeInspiration: (id) => set((state) => ({
        inspirations: state.inspirations.filter((i) => i.id !== id),
      })),

      // Generation
      setGenerating: (isGenerating) => set({ isGenerating }),

      setJobId: (jobId) => set({ jobId }),

      updateProgress: (generationProgress) => set({ generationProgress }),

      markAssetComplete: (assetId, generatedUrl) => set((state) => ({
        assets: state.assets.map((a) =>
          a.id === assetId 
            ? { ...a, status: 'complete' as AssetStatus, generatedUrl, iterations: a.iterations + 1 }
            : a
        ),
      })),

      markAssetFailed: (assetId, error) => set((state) => ({
        assets: state.assets.map((a) =>
          a.id === assetId 
            ? { ...a, status: 'pending' as AssetStatus, feedback: error }
            : a
        ),
      })),

      // Review
      approveAsset: (assetId, score, notes) => set((state) => ({
        assets: state.assets.map((a) =>
          a.id === assetId
            ? { ...a, status: 'approved' as AssetStatus, score, feedback: notes }
            : a
        ),
      })),

      rejectAsset: (assetId, feedback) => set((state) => ({
        assets: state.assets.map((a) =>
          a.id === assetId
            ? { ...a, status: 'rejected' as AssetStatus, feedback }
            : a
        ),
      })),

      // Costs
      updateCosts: (estimatedCost, actualCost) => set({ estimatedCost, actualCost }),

      // Utility
      reset: () => set({
        ...initialState,
        completedSteps: new Set<MediaStudioStep>(),
      }),

      getAssetById: (id) => get().assets.find((a) => a.id === id),

      getPendingAssets: () => get().assets.filter((a) => 
        a.status === 'pending' || a.status === 'rejected'
      ),

      getApprovedAssets: () => get().assets.filter((a) => a.status === 'approved'),
    }),
    {
      name: 'media-studio-storage',
      partialize: (state) => ({
        // Persist everything except transient generation state
        currentStep: state.currentStep,
        completedSteps: Array.from(state.completedSteps),
        projectName: state.projectName,
        template: state.template,
        assetTarget: state.assetTarget,
        assets: state.assets,
        currentAssetIndex: state.currentAssetIndex,
        inspirations: state.inspirations,
        estimatedCost: state.estimatedCost,
        actualCost: state.actualCost,
      }),
      onRehydrateStorage: () => (state) => {
        // Convert completedSteps array back to Set
        if (state && Array.isArray(state.completedSteps)) {
          state.completedSteps = new Set(state.completedSteps as unknown as MediaStudioStep[]);
        }
      },
    }
  )
);

// Selector hooks for common patterns
export const useCurrentAsset = () => {
  const { assets, currentAssetIndex } = useMediaStudioStore();
  return assets[currentAssetIndex];
};

export const useAssetCount = () => {
  const { assets } = useMediaStudioStore();
  return {
    total: assets.length,
    pending: assets.filter((a) => a.status === 'pending').length,
    generating: assets.filter((a) => a.status === 'generating').length,
    complete: assets.filter((a) => a.status === 'complete').length,
    approved: assets.filter((a) => a.status === 'approved').length,
    rejected: assets.filter((a) => a.status === 'rejected').length,
  };
};

