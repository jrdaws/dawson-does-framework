#!/usr/bin/env node
/**
 * Media Pipeline Asset Generator
 * Uses Stability AI API (Stable Diffusion XL) for cost-efficient image generation
 * 
 * Usage: STABILITY_API_KEY=sk-... node generate-assets.mjs
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const STABILITY_API_KEY = process.env.STABILITY_API_KEY
const API_HOST = 'https://api.stability.ai'

if (!STABILITY_API_KEY) {
  console.error('Error: STABILITY_API_KEY environment variable is required')
  console.error('Usage: STABILITY_API_KEY=sk-... node generate-assets.mjs')
  process.exit(1)
}

// SDXL allowed dimensions - pick closest aspect ratio to target
// Allowed: 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, 896x1152
const SDXL_DIMENSIONS = {
  '16:9': { width: 1344, height: 768 },   // for hero-workspace (1920x1080)
  '3:4': { width: 768, height: 1344 },    // for hero-workspace-mobile (750x1000) - close to 3:4
  '4:3': { width: 1152, height: 896 },    // for empty-state (400x300)
  '1:1': { width: 1024, height: 1024 }    // square
}

// Asset definitions from the brief
const assets = [
  {
    id: 'hero-workspace',
    targetWidth: 1920,
    targetHeight: 1080,
    sdxlDimensions: SDXL_DIMENSIONS['16:9'],
    prompt: `Professional MacBook Pro displaying modern analytics dashboard interface on a minimal Scandinavian desk setup, sleek workspace with subtle indigo accent lighting from desk lamp, morning natural light from large window on left side, shot on Canon EOS R5 with 35mm f/1.4 lens, shallow depth of field with soft bokeh on background, clean minimal interior design with neutral tones and greenery, tech startup aesthetic, commercial interior photography, subtle Lightroom color grade with lifted shadows, professional workspace environment, high-end advertising quality, 8K resolution, Color reference: Indigo #6366F1 accent visible in ambient lighting, Emerald #10B981 visible in plant or subtle decoration`,
    negativePrompt: `cartoon, illustration, 3d render, CGI, anime, painting, drawing, oversaturated, plastic, waxy, unrealistic, artificial, stock photo generic, perfect symmetry, uncanny valley, airbrushed, HDR overdone, bad anatomy, distorted features, cluttered desk, cheap furniture, fake screen mockup, obvious placeholder dashboard, text watermark, signature, busy background, distracting elements, harsh shadows, amateur photography`,
    priority: 'P1',
    stylePreset: 'photographic'
  },
  {
    id: 'hero-workspace-mobile',
    targetWidth: 750,
    targetHeight: 1000,
    sdxlDimensions: SDXL_DIMENSIONS['3:4'],
    prompt: `Cropped close-up view of MacBook Pro screen displaying modern analytics dashboard, minimal desk surface visible, morning natural window light creating soft highlights on screen bezels, shot on Canon EOS R5 with 50mm f/1.4 lens, tight composition for mobile display, professional product photography, clean and minimal aesthetic, subtle indigo ambient lighting, editorial tech photography, vertical composition emphasis`,
    negativePrompt: `cartoon, illustration, 3d render, CGI, anime, oversaturated, plastic screen, fake mockup, obvious placeholder, text watermark, cluttered, busy background, amateur photography, harsh lighting, HDR overdone`,
    priority: 'P1',
    stylePreset: 'photographic'
  },
  {
    id: 'empty-state-data',
    targetWidth: 400,
    targetHeight: 300,
    sdxlDimensions: SDXL_DIMENSIONS['4:3'],
    prompt: `Minimal abstract illustration of empty data visualization concept, soft indigo and emerald color palette on clean white background, geometric shapes suggesting empty chart or graph placeholder, subtle shadows and depth, modern flat design with slight 3D elements, premium SaaS aesthetic, friendly and approachable mood, clean vector-style illustration, professional software UI empty state design, Linear app inspired aesthetic, minimal and sophisticated, Color palette: Primary #6366F1 Indigo for main shapes, Accent #10B981 Emerald for subtle highlights, Neutral #E5E5E5 and #F5F5F5 for shadows`,
    negativePrompt: `cartoon characters, mascots, people, hands, faces, childish, cluttered, busy, too many colors, harsh contrasts, 3d realistic, photorealistic, text, words, complex scenes, overwhelming detail, amateurish, clipart style, outdated design, generic stock illustration`,
    priority: 'P1',
    stylePreset: 'digital-art'
  }
]

async function generateImage(asset) {
  const { width, height } = asset.sdxlDimensions
  console.log(`\n🎨 Generating: ${asset.id} (${width}x${height} → resize to ${asset.targetWidth}x${asset.targetHeight})...`)
  
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
        steps: 40,
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
  
  // Save raw PNG
  const rawPath = path.join(__dirname, 'raw', `${asset.id}.png`)
  const imageBuffer = Buffer.from(result.artifacts[0].base64, 'base64')
  await fs.writeFile(rawPath, imageBuffer)
  
  console.log(`   ✅ Saved: raw/${asset.id}.png (${(imageBuffer.length / 1024).toFixed(1)}KB)`)
  console.log(`   📐 Generated at ${width}x${height}, needs resize to ${asset.targetWidth}x${asset.targetHeight}`)
  
  return {
    id: asset.id,
    rawFile: `raw/${asset.id}.png`,
    generatedDimensions: `${width}x${height}`,
    targetDimensions: `${asset.targetWidth}x${asset.targetHeight}`,
    size: `${(imageBuffer.length / 1024).toFixed(1)}KB`,
    prompt: asset.prompt,
    negativePrompt: asset.negativePrompt,
    settings: {
      model: 'stable-diffusion-xl-1024-v1-0',
      steps: 40,
      cfg_scale: 7,
      style_preset: asset.stylePreset
    }
  }
}

async function main() {
  console.log('🚀 Media Pipeline - Asset Generation')
  console.log('━'.repeat(50))
  console.log(`API: Stability AI (Stable Diffusion XL)`)
  console.log(`Assets to generate: ${assets.length}`)
  console.log(`Estimated cost: ~$${(assets.length * 0.02).toFixed(2)} (at $0.02/image)`)
  console.log('━'.repeat(50))

  const results = []
  let successCount = 0
  let failCount = 0

  for (const asset of assets) {
    try {
      const result = await generateImage(asset)
      results.push({ ...result, status: 'generated' })
      successCount++
    } catch (error) {
      console.error(`   ❌ Failed: ${asset.id} - ${error.message}`)
      results.push({
        id: asset.id,
        status: 'failed',
        error: error.message
      })
      failCount++
    }
  }

  // Write generation log
  const logPath = path.join(__dirname, 'metadata', 'generation-log.md')
  const logContent = `# Generation Log

> Generated: ${new Date().toISOString()}
> Generator: Stability AI (Stable Diffusion XL)

## Summary
- Total: ${assets.length}
- Success: ${successCount}
- Failed: ${failCount}
- Estimated Cost: ~$${(successCount * 0.02).toFixed(2)}

## Assets

${results.map(r => `### ${r.id}
- Status: ${r.status}
- File: ${r.rawFile || 'N/A'}
- Generated: ${r.generatedDimensions || 'N/A'}
- Target: ${r.targetDimensions || 'N/A'}
- Size: ${r.size || 'N/A'}
${r.error ? `- Error: ${r.error}` : ''}
${r.settings ? `- Model: ${r.settings.model}
- Steps: ${r.settings.steps}
- CFG Scale: ${r.settings.cfg_scale}
- Style: ${r.settings.style_preset}` : ''}
`).join('\n')}

## Next Steps
1. Resize images to target dimensions using ImageMagick
2. Convert to WebP format
3. Verify quality and run AI artifact checks
`
  await fs.writeFile(logPath, logContent)
  console.log(`\n📝 Generation log: metadata/generation-log.md`)

  console.log('\n' + '━'.repeat(50))
  console.log(`✅ Complete! ${successCount}/${assets.length} assets generated`)
  console.log(`💰 Estimated cost: ~$${(successCount * 0.02).toFixed(2)}`)
  console.log('━'.repeat(50))
  console.log('\n📋 Next steps:')
  console.log('   1. Resize and convert to WebP: node optimize-assets.mjs')
  console.log('   2. Review images for AI artifacts')
  console.log('   3. Create asset manifest')
}

main().catch(console.error)
