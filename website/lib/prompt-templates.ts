// Camera and lens options for photorealistic prompt building

export interface CameraOption {
  value: string;
  label: string;
  promptText: string;
  type: 'mirrorless' | 'dslr' | 'medium-format';
}

export interface LensOption {
  value: string;
  label: string;
  promptText: string;
  type: 'wide' | 'standard' | 'portrait' | 'macro' | 'telephoto';
  bestFor: string[];
}

export interface LightingOption {
  value: string;
  label: string;
  promptText: string;
  description: string;
}

export interface LightingDirection {
  value: string;
  label: string;
  promptText: string;
}

export interface PhotographyStyle {
  value: string;
  label: string;
  promptText: string;
  bestFor: string[];
}

export interface ColorGrade {
  value: string;
  label: string;
  promptText: string;
}

// Camera options
export const CAMERAS: CameraOption[] = [
  { 
    value: 'canon-eos-r5', 
    label: 'Canon EOS R5', 
    promptText: 'shot on Canon EOS R5',
    type: 'mirrorless' 
  },
  { 
    value: 'sony-a7r-iv', 
    label: 'Sony A7R IV', 
    promptText: 'shot on Sony A7R IV',
    type: 'mirrorless' 
  },
  { 
    value: 'nikon-z9', 
    label: 'Nikon Z9', 
    promptText: 'shot on Nikon Z9',
    type: 'mirrorless' 
  },
  { 
    value: 'hasselblad-h6d', 
    label: 'Hasselblad H6D', 
    promptText: 'shot on Hasselblad H6D medium format',
    type: 'medium-format' 
  },
  { 
    value: 'canon-5d-iv', 
    label: 'Canon 5D Mark IV', 
    promptText: 'shot on Canon 5D Mark IV',
    type: 'dslr' 
  },
  { 
    value: 'leica-sl2', 
    label: 'Leica SL2', 
    promptText: 'shot on Leica SL2',
    type: 'mirrorless' 
  },
];

// Lens options
export const LENSES: LensOption[] = [
  { 
    value: '24mm-f1.4', 
    label: '24mm f/1.4', 
    promptText: '24mm f/1.4 lens',
    type: 'wide',
    bestFor: ['architecture', 'landscapes', 'environmental portraits']
  },
  { 
    value: '35mm-f1.4', 
    label: '35mm f/1.4', 
    promptText: '35mm f/1.4 lens',
    type: 'standard',
    bestFor: ['street', 'documentary', 'lifestyle']
  },
  { 
    value: '50mm-f1.4', 
    label: '50mm f/1.4', 
    promptText: '50mm f/1.4 lens',
    type: 'standard',
    bestFor: ['portraits', 'general', 'low light']
  },
  { 
    value: '85mm-f1.4', 
    label: '85mm f/1.4', 
    promptText: '85mm f/1.4 lens',
    type: 'portrait',
    bestFor: ['portraits', 'headshots', 'beauty']
  },
  { 
    value: '105mm-f2.8', 
    label: '105mm f/2.8 Macro', 
    promptText: '105mm f/2.8 macro lens',
    type: 'macro',
    bestFor: ['products', 'details', 'close-ups']
  },
  { 
    value: '70-200mm-f2.8', 
    label: '70-200mm f/2.8', 
    promptText: '70-200mm f/2.8 telephoto lens',
    type: 'telephoto',
    bestFor: ['sports', 'events', 'compressed backgrounds']
  },
];

// Lighting types
export const LIGHTING_TYPES: LightingOption[] = [
  { 
    value: 'natural-window', 
    label: 'Natural Window Light', 
    promptText: 'natural window light',
    description: 'Soft, diffused light from windows'
  },
  { 
    value: 'golden-hour', 
    label: 'Golden Hour', 
    promptText: 'golden hour sunlight',
    description: 'Warm, directional light during sunrise/sunset'
  },
  { 
    value: 'overcast', 
    label: 'Overcast Daylight', 
    promptText: 'soft overcast daylight',
    description: 'Even, shadowless natural light'
  },
  { 
    value: 'studio-softbox', 
    label: 'Studio Softbox', 
    promptText: 'professional studio softbox lighting',
    description: 'Controlled, soft studio lighting'
  },
  { 
    value: 'three-point', 
    label: 'Three-Point Lighting', 
    promptText: 'professional three-point lighting setup',
    description: 'Key, fill, and rim lights'
  },
  { 
    value: 'rembrandt', 
    label: 'Rembrandt Lighting', 
    promptText: 'dramatic Rembrandt lighting',
    description: 'Classic portrait lighting with triangle highlight'
  },
  { 
    value: 'beauty-dish', 
    label: 'Beauty Dish', 
    promptText: 'beauty dish lighting',
    description: 'Even, flattering light for portraits'
  },
  { 
    value: 'ring-light', 
    label: 'Ring Light', 
    promptText: 'ring light illumination',
    description: 'Even, shadowless frontal light'
  },
];

// Lighting directions
export const LIGHTING_DIRECTIONS: LightingDirection[] = [
  { value: 'from-left', label: 'From Left', promptText: 'from the left side' },
  { value: 'from-right', label: 'From Right', promptText: 'from the right side' },
  { value: 'from-above', label: 'From Above', promptText: 'from above' },
  { value: 'from-behind', label: 'Backlit', promptText: 'backlit with rim light' },
  { value: 'frontal', label: 'Frontal', promptText: 'frontal illumination' },
  { value: '45-degree', label: '45° Angle', promptText: 'at 45 degree angle' },
];

// Photography styles
export const PHOTOGRAPHY_STYLES: PhotographyStyle[] = [
  { 
    value: 'editorial', 
    label: 'Editorial/Lifestyle', 
    promptText: 'editorial lifestyle photography, candid authentic moment',
    bestFor: ['hero', 'feature', 'avatar']
  },
  { 
    value: 'commercial', 
    label: 'Commercial/Advertising', 
    promptText: 'commercial advertising photography, high-end professional',
    bestFor: ['hero', 'background']
  },
  { 
    value: 'product', 
    label: 'Product Photography', 
    promptText: 'commercial product photography, e-commerce quality',
    bestFor: ['icon', 'feature']
  },
  { 
    value: 'corporate', 
    label: 'Corporate/Business', 
    promptText: 'corporate business photography, professional Fortune 500 quality',
    bestFor: ['hero', 'avatar', 'feature']
  },
  { 
    value: 'documentary', 
    label: 'Documentary', 
    promptText: 'documentary photography style, authentic real moment',
    bestFor: ['feature', 'illustration']
  },
  { 
    value: 'portrait', 
    label: 'Portrait', 
    promptText: 'professional portrait photography, flattering natural',
    bestFor: ['avatar', 'hero']
  },
  { 
    value: 'architectural', 
    label: 'Architectural', 
    promptText: 'architectural photography, clean lines modern design',
    bestFor: ['background', 'feature']
  },
  { 
    value: 'minimalist', 
    label: 'Minimalist', 
    promptText: 'minimalist photography, clean simple composition',
    bestFor: ['icon', 'background', 'feature']
  },
];

// Color grades
export const COLOR_GRADES: ColorGrade[] = [
  { 
    value: 'natural', 
    label: 'Natural', 
    promptText: 'natural color grading, true to life colors'
  },
  { 
    value: 'film-grain', 
    label: 'Subtle Film Grain', 
    promptText: 'subtle film grain, magazine quality color grade'
  },
  { 
    value: 'warm', 
    label: 'Warm Tones', 
    promptText: 'warm color temperature, inviting atmosphere'
  },
  { 
    value: 'cool', 
    label: 'Cool Tones', 
    promptText: 'cool color temperature, modern clean feel'
  },
  { 
    value: 'cinematic', 
    label: 'Cinematic', 
    promptText: 'cinematic color grade, teal and orange tones'
  },
  { 
    value: 'muted', 
    label: 'Muted/Desaturated', 
    promptText: 'muted desaturated tones, subtle elegant'
  },
  { 
    value: 'high-contrast', 
    label: 'High Contrast', 
    promptText: 'high contrast, punchy colors'
  },
  { 
    value: 'vsco', 
    label: 'VSCO Style', 
    promptText: 'VSCO preset style, lifted blacks, slight fade'
  },
];

// Standard negative prompt - always included
export const STANDARD_NEGATIVE_PROMPT = `cartoon, illustration, 3d render, CGI, anime, painting, drawing, sketch, digital art, oversaturated, plastic skin, waxy, unrealistic, artificial, stock photo generic, perfect symmetry, too clean, uncanny valley, airbrushed, overprocessed, HDR overdone, blurry background artifacts, bad anatomy, distorted features, extra limbs, malformed hands, text, watermark, signature, logo, mannequin-like, expressionless, vacant stare, unnatural pose, stiff posture, fake smile, over-retouched, poreless skin, plastic hair, costume-like clothing`;

// Asset type presets
export const ASSET_TYPE_PRESETS = {
  hero: {
    defaultDimensions: { width: 1920, height: 1080 },
    suggestedCamera: 'canon-eos-r5',
    suggestedLens: '50mm-f1.4',
    suggestedLighting: 'natural-window',
    suggestedStyle: 'editorial',
  },
  icon: {
    defaultDimensions: { width: 64, height: 64 },
    suggestedCamera: 'hasselblad-h6d',
    suggestedLens: '105mm-f2.8',
    suggestedLighting: 'studio-softbox',
    suggestedStyle: 'product',
  },
  illustration: {
    defaultDimensions: { width: 800, height: 600 },
    suggestedCamera: 'sony-a7r-iv',
    suggestedLens: '35mm-f1.4',
    suggestedLighting: 'overcast',
    suggestedStyle: 'documentary',
  },
  avatar: {
    defaultDimensions: { width: 256, height: 256 },
    suggestedCamera: 'canon-eos-r5',
    suggestedLens: '85mm-f1.4',
    suggestedLighting: 'beauty-dish',
    suggestedStyle: 'portrait',
  },
  background: {
    defaultDimensions: { width: 1920, height: 1080 },
    suggestedCamera: 'sony-a7r-iv',
    suggestedLens: '24mm-f1.4',
    suggestedLighting: 'golden-hour',
    suggestedStyle: 'architectural',
  },
  feature: {
    defaultDimensions: { width: 600, height: 400 },
    suggestedCamera: 'canon-5d-iv',
    suggestedLens: '50mm-f1.4',
    suggestedLighting: 'three-point',
    suggestedStyle: 'commercial',
  },
};

// Compose a full prompt from components
export function composePrompt(
  subject: string,
  camera: string,
  lens: string,
  lighting: string,
  lightingDirection: string,
  photographyStyle: string,
  colorGrade: string,
  additionalModifiers: string[] = []
): string {
  const cameraOption = CAMERAS.find((c) => c.value === camera);
  const lensOption = LENSES.find((l) => l.value === lens);
  const lightingOption = LIGHTING_TYPES.find((l) => l.value === lighting);
  const directionOption = LIGHTING_DIRECTIONS.find((d) => d.value === lightingDirection);
  const styleOption = PHOTOGRAPHY_STYLES.find((s) => s.value === photographyStyle);
  const gradeOption = COLOR_GRADES.find((g) => g.value === colorGrade);

  const parts = [
    subject,
    cameraOption?.promptText || '',
    lensOption?.promptText || '',
    lightingOption?.promptText || '',
    directionOption?.promptText || '',
    styleOption?.promptText || '',
    gradeOption?.promptText || '',
    ...additionalModifiers,
  ].filter(Boolean);

  return parts.join(', ');
}

// Get cost estimate for a model
export function getModelCost(model: 'stable-diffusion' | 'dall-e-3'): number {
  return model === 'stable-diffusion' ? 0.02 : 0.08;
}

// Get recommended model based on asset type
export function getRecommendedModel(assetType: string): 'stable-diffusion' | 'dall-e-3' {
  // Always use Stable Diffusion for cost optimization
  // Only recommend DALL-E for final hero images when explicitly requested
  return 'stable-diffusion';
}

