#!/usr/bin/env node
/**
 * Framework UI Redesign - Complete Asset Generator
 * Uses Stability AI (Stable Diffusion XL) for cost efficiency
 * 
 * Generates: 9 images (backgrounds, screenshots, avatars)
 * SVG assets are created separately (icons, patterns)
 * 
 * Estimated cost: ~$0.18 (9 images × $0.02)
 * 
 * Usage: STABILITY_API_KEY=sk-... node generate-all-assets.mjs
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const STABILITY_API_KEY = process.env.STABILITY_API_KEY
const API_HOST = 'https://api.stability.ai'

if (!STABILITY_API_KEY) {
  console.error('Error: STABILITY_API_KEY environment variable is required')
  process.exit(1)
}

// SDXL allowed dimensions mapping
const SDXL_DIMS = {
  '16:9': { width: 1344, height: 768 },
  '9:16': { width: 768, height: 1344 },
  '4:3': { width: 1152, height: 896 },
  '3:4': { width: 896, height: 1152 },
  '1:1': { width: 1024, height: 1024 },
  '3:2': { width: 1216, height: 832 }
}

// All image assets to generate
const assets = [
  // === HERO BACKGROUNDS ===
  {
    id: 'hero-gradient-bg',
    targetWidth: 1920, targetHeight: 1080,
    sdxl: SDXL_DIMS['16:9'],
    priority: 'P1',
    category: 'hero',
    stylePreset: 'digital-art',
    prompt: `Subtle abstract gradient background for modern SaaS website hero section, soft indigo #6366F1 to violet #8B5CF6 gradient with organic flowing shapes, professional and premium aesthetic, suitable for white text overlay, minimal design with sophisticated depth, smooth color transitions, high-resolution texture without noise, modern 2024 design trends, corporate presentation quality, Vercel and Linear inspired aesthetic, clean and not busy, elegant simplicity, abstract flowing waves of color`,
    negativePrompt: `busy, cluttered, harsh colors, 90s design, clip art, amateur, overdesigned, distracting patterns, text, logos, icons, photorealistic, people, faces, hands, objects, realistic elements, sharp edges, geometric shapes, grid patterns`
  },
  {
    id: 'hero-gradient-bg-mobile',
    targetWidth: 750, targetHeight: 1334,
    sdxl: SDXL_DIMS['9:16'],
    priority: 'P1',
    category: 'hero',
    stylePreset: 'digital-art',
    prompt: `Mobile-optimized abstract gradient background for SaaS website hero, vertical composition with center-focus gradient, indigo #6366F1 to violet #8B5CF6 soft transition, minimal organic flowing shapes, professional premium aesthetic, portrait orientation optimized, suitable for mobile text overlay, clean sophisticated depth, modern minimal design, abstract color waves`,
    negativePrompt: `busy, cluttered, harsh colors, landscape elements, text, logos, photorealistic, distracting patterns, amateur design, geometric shapes, grid`
  },
  
  // === DEMO SCREENSHOTS ===
  {
    id: 'terminal-mockup-clean',
    targetWidth: 1200, targetHeight: 800,
    sdxl: SDXL_DIMS['3:2'],
    priority: 'P1',
    category: 'screenshots',
    stylePreset: 'photographic',
    prompt: `Clean modern terminal window mockup displayed on subtle light gray gradient background, macOS-style window chrome with red yellow green traffic light buttons, dark terminal background #1E1E1E with colorful CLI output text in green and cyan, shot on Hasselblad H6D medium format camera 90mm lens, professional product photography lighting with soft even illumination, subtle shadow underneath floating terminal window for depth, high-end advertising quality, tech startup aesthetic, premium quality, Apple-style product shot, clean minimal composition`,
    negativePrompt: `cartoon, CGI, 3d render, floating randomly, wrong shadows, amateur photography, cheap looking, oversaturated, unrealistic materials, cluttered background, fake screen content, obvious placeholder text, text watermark, busy, messy`
  },
  {
    id: 'dashboard-preview',
    targetWidth: 1200, targetHeight: 800,
    sdxl: SDXL_DIMS['3:2'],
    priority: 'P2',
    category: 'screenshots',
    stylePreset: 'photographic',
    prompt: `Modern SaaS analytics dashboard interface displayed on premium MacBook Pro laptop screen, clean dashboard with simple bar charts and metric cards in indigo #6366F1, minimal Scandinavian desk setup with laptop, shot on Canon EOS R5 with 50mm f/1.4 lens, natural window light from left creating soft highlights, shallow depth of field with soft bokeh background, professional tech workspace, modern minimal aesthetic, editorial lifestyle photography, authentic workspace environment`,
    negativePrompt: `fake screen, obvious mockup, cluttered desk, oversaturated, plastic, cartoon, CGI, cheap furniture, amateur photography, unrealistic perspective, stock photo generic, iMac, desktop computer, Windows laptop`
  },
  {
    id: 'code-editor-visual',
    targetWidth: 800, targetHeight: 600,
    sdxl: SDXL_DIMS['4:3'],
    priority: 'P2',
    category: 'screenshots',
    stylePreset: 'photographic',
    prompt: `Clean VS Code editor interface showing TypeScript code with modern dark theme and syntax highlighting, displayed on minimal monitor or MacBook Pro screen, shot on Sony A7R IV with 85mm f/1.8 lens, professional product photography lighting, clean desk environment visible in shallow depth of field, tech developer workspace aesthetic, premium quality, code visible with blue green orange syntax colors, dark editor background, minimal editor chrome, file tree sidebar visible`,
    negativePrompt: `messy code, errors visible, cluttered screen, amateur photography, fake mockup, cartoon, CGI, oversaturated, cheap desk, bad lighting, Windows computer, iMac`
  },
  
  // === AVATAR PLACEHOLDERS ===
  {
    id: 'avatar-placeholder-1',
    targetWidth: 80, targetHeight: 80,
    sdxl: SDXL_DIMS['1:1'],
    priority: 'P1',
    category: 'avatars',
    stylePreset: 'photographic',
    prompt: `Professional headshot portrait of a man in his 30s with dark hair, diverse representation, friendly genuine warm smile, modern professional attire with casual smart tech style, shot on Canon EOS R5 with 85mm f/1.4 lens, natural window light from front-left creating soft catchlights in eyes, shallow depth of field with creamy bokeh background, editorial portrait photography, magazine quality, authentic expression not posed, corporate but approachable, subtle Lightroom color grade, natural skin tones and texture preserved`,
    negativePrompt: `stock photo, posed fake smile, plastic skin, oversaturated, HDR overdone, costume-like clothing, mannequin, uncanny valley, airbrushed poreless skin, unnatural pose, cartoon, illustration, CGI, perfect symmetry, stiff, formal suit`
  },
  {
    id: 'avatar-placeholder-2',
    targetWidth: 80, targetHeight: 80,
    sdxl: SDXL_DIMS['1:1'],
    priority: 'P1',
    category: 'avatars',
    stylePreset: 'photographic',
    prompt: `Professional headshot portrait of a woman in her 30s, diverse representation, confident friendly smile, modern professional attire with smart casual tech style, shot on Canon EOS R5 with 85mm f/1.4 lens, natural window light from front-left creating soft catchlights in eyes, shallow depth of field with creamy bokeh background, editorial portrait photography, magazine quality, authentic genuine expression, corporate yet approachable, subtle Lightroom color grade, natural skin tones and texture preserved`,
    negativePrompt: `stock photo, posed fake smile, plastic skin, oversaturated, HDR overdone, costume-like clothing, mannequin, uncanny valley, airbrushed poreless skin, unnatural pose, cartoon, illustration, CGI, perfect symmetry, heavy makeup, glamour shot`
  },
  {
    id: 'avatar-placeholder-3',
    targetWidth: 80, targetHeight: 80,
    sdxl: SDXL_DIMS['1:1'],
    priority: 'P1',
    category: 'avatars',
    stylePreset: 'photographic',
    prompt: `Professional headshot portrait of a person in their 40s with distinguished senior leadership presence, diverse representation, warm confident smile, modern professional attire smart business casual, shot on Canon EOS R5 with 85mm f/1.4 lens, natural window light from front-left creating soft catchlights in eyes, shallow depth of field with creamy bokeh background, editorial corporate portrait photography, executive magazine quality, authentic trustworthy expression, subtle Lightroom color grade, natural skin tones preserved`,
    negativePrompt: `stock photo, posed fake smile, plastic skin, oversaturated, HDR overdone, costume-like formal suit, mannequin, uncanny valley, airbrushed poreless skin, unnatural pose, cartoon, illustration, CGI, perfect symmetry, stiff posture`
  },
  
  // === ABSTRACT HERO GRAPHIC ===
  {
    id: 'hero-abstract-graphic',
    targetWidth: 800, targetHeight: 600,
    sdxl: SDXL_DIMS['4:3'],
    priority: 'P1',
    category: 'hero',
    stylePreset: 'digital-art',
    prompt: `Abstract geometric illustration for SaaS website hero section, interconnected nodes and flowing lines suggesting workflow automation and data flow, clean vector-style design with indigo #6366F1 and violet #8B5CF6 as main colors with emerald #10B981 small accents, subtle 3D depth with soft shadows, modern tech aesthetic, minimal and sophisticated, Linear app inspired geometric design, floating abstract shapes suggesting speed and efficiency, professional developer tool visual metaphor, transparent background friendly, clean edges`,
    negativePrompt: `realistic, photographic, clipart, cartoon mascots, busy complexity, too many colors, childish, amateurish, stock illustration, people, faces, hands, text, logos, concrete objects, literal representations`
  }
]

async function generateImage(asset) {
  const { width, height } = asset.sdxl
  console.log(`\n🎨 Generating: ${asset.id} [${asset.priority}]`)
  console.log(`   ${width}x${height} → ${asset.targetWidth}x${asset.targetHeight}`)
  
  const response = await fetch(
    `${API_HOST}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [
          { text: asset.prompt, weight: 1 },
          { text: asset.negativePrompt, weight: -1 }
        ],
        cfg_scale: 7,
        height: height,
        width: width,
        steps: 50,
        samples: 1,
        style_preset: asset.stylePreset
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`API Error: ${JSON.stringify(error)}`)
  }

  const result = await response.json()
  
  const rawPath = path.join(__dirname, 'raw', `${asset.id}.png`)
  const imageBuffer = Buffer.from(result.artifacts[0].base64, 'base64')
  await fs.writeFile(rawPath, imageBuffer)
  
  console.log(`   ✅ Saved: raw/${asset.id}.png (${(imageBuffer.length / 1024).toFixed(1)}KB)`)
  
  return {
    id: asset.id,
    category: asset.category,
    priority: asset.priority,
    rawFile: `raw/${asset.id}.png`,
    targetDimensions: `${asset.targetWidth}x${asset.targetHeight}`,
    status: 'generated'
  }
}

async function main() {
  console.log('🚀 Framework UI Redesign - Asset Generation')
  console.log('━'.repeat(60))
  console.log(`API: Stability AI (Stable Diffusion XL)`)
  console.log(`Total images: ${assets.length}`)
  console.log(`Estimated cost: ~$${(assets.length * 0.02).toFixed(2)}`)
  console.log('━'.repeat(60))
  console.log('\nAssets by category:')
  console.log('  Hero: hero-gradient-bg, hero-gradient-bg-mobile, hero-abstract-graphic')
  console.log('  Screenshots: terminal-mockup-clean, dashboard-preview, code-editor-visual')
  console.log('  Avatars: avatar-placeholder-1, 2, 3')
  console.log('━'.repeat(60))

  const results = []
  let successCount = 0
  let failCount = 0

  for (const asset of assets) {
    try {
      const result = await generateImage(asset)
      results.push(result)
      successCount++
    } catch (error) {
      console.error(`   ❌ Failed: ${asset.id} - ${error.message}`)
      results.push({ id: asset.id, status: 'failed', error: error.message })
      failCount++
    }
  }

  // Write generation log
  const logPath = path.join(__dirname, 'metadata', 'generation-log.md')
  const logContent = `# Framework UI Redesign - Generation Log

> Generated: ${new Date().toISOString()}
> Generator: Stable Diffusion XL 1.0
> Model Steps: 50

## Summary
- Total: ${assets.length}
- Success: ${successCount}
- Failed: ${failCount}
- Cost: ~$${(successCount * 0.02).toFixed(2)}

## Assets Generated

${results.map(r => `### ${r.id}
- Category: ${r.category || 'unknown'}
- Priority: ${r.priority || '-'}
- Status: ${r.status}
- Target: ${r.targetDimensions || 'N/A'}
${r.error ? `- Error: ${r.error}` : ''}
`).join('\n')}

## Next Steps
1. Create SVG icons (6 feature icons)
2. Create SVG patterns (mesh, divider, footer)
3. Optimize all images to WebP
4. Create asset manifest
`

  await fs.writeFile(logPath, logContent)

  console.log('\n' + '━'.repeat(60))
  console.log(`✅ Generation complete: ${successCount}/${assets.length}`)
  console.log(`💰 Cost: ~$${(successCount * 0.02).toFixed(2)}`)
  console.log('━'.repeat(60))
  console.log('\n📋 Next: Create SVG icons & patterns, then optimize')
}

main().catch(console.error)

