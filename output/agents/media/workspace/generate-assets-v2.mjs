#!/usr/bin/env node
/**
 * Media Pipeline Asset Generator - ITERATION 2
 * Addresses Quality Agent feedback:
 * - hero-workspace: Better screen content prompt
 * - hero-workspace-mobile: Explicitly MacBook, not iMac
 * - empty-state-data: Correct empty state concept
 * 
 * Usage: STABILITY_API_KEY=sk-... node generate-assets-v2.mjs
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

// SDXL allowed dimensions
const SDXL_DIMENSIONS = {
  '16:9': { width: 1344, height: 768 },
  '3:4': { width: 768, height: 1344 },
  '4:3': { width: 1152, height: 896 }
}

// ITERATION 2 - Improved prompts based on Quality Agent feedback
const assets = [
  {
    id: 'hero-workspace-v2',
    targetWidth: 1920,
    targetHeight: 1080,
    sdxlDimensions: SDXL_DIMENSIONS['16:9'],
    // IMPROVED: Focus on workspace atmosphere, avoid specific screen content
    // Screen will show subtle gradient/glow instead of fake UI
    prompt: `Professional MacBook Pro laptop on a minimal Scandinavian oak desk, laptop screen displaying a soft indigo and white gradient glow suggesting a modern interface, sleek workspace with subtle purple-indigo ambient lighting from minimalist desk lamp, morning natural light streaming from large window on left side creating beautiful rim light on laptop edge, shot on Canon EOS R5 with 35mm f/1.4 lens, shallow depth of field with creamy bokeh background, clean minimal Scandinavian interior with white walls and a small potted plant, high-end tech startup aesthetic, commercial interior photography for Apple or WeWork, subtle Lightroom color grade with lifted shadows and muted tones, professional advertising quality photograph`,
    negativePrompt: `cartoon, illustration, 3d render, CGI, anime, painting, drawing, oversaturated, plastic, waxy, unrealistic, artificial, stock photo generic, perfect symmetry, uncanny valley, airbrushed, HDR overdone, bad anatomy, cluttered desk, cheap furniture, fake dashboard mockup, obvious text on screen, readable interface elements, busy screen content, text watermark, signature, harsh shadows, amateur photography, Windows laptop, ThinkPad, Dell, HP laptop`,
    priority: 'P1',
    stylePreset: 'photographic'
  },
  {
    id: 'hero-workspace-mobile-v2',
    targetWidth: 750,
    targetHeight: 1000,
    sdxlDimensions: SDXL_DIMENSIONS['3:4'],
    // IMPROVED: Explicitly MacBook Pro LAPTOP, negative prompt includes iMac/desktop
    prompt: `Close-up overhead view of silver MacBook Pro laptop computer on minimal white marble desk surface, laptop lid open at 45 degree angle showing soft glowing screen with indigo gradient, morning natural window light from side creating soft shadows, shot on Canon EOS R5 with 50mm f/1.4 lens macro-style close-up, shallow depth of field, clean and minimal aesthetic, subtle purple ambient lighting reflection on aluminum laptop body, professional product photography for Apple advertising, tight vertical composition, premium tech lifestyle photography`,
    negativePrompt: `cartoon, illustration, 3d render, CGI, anime, oversaturated, plastic, fake mockup, obvious dashboard, readable text on screen, busy interface, text watermark, cluttered background, amateur photography, harsh lighting, HDR overdone, iMac, desktop computer, monitor, external display, keyboard separate from laptop, desktop setup, PC, Windows computer, tower, all-in-one computer`,
    priority: 'P1',
    stylePreset: 'photographic'
  },
  {
    id: 'empty-state-data-v2',
    targetWidth: 400,
    targetHeight: 300,
    sdxlDimensions: SDXL_DIMENSIONS['4:3'],
    // COMPLETELY NEW: Actual empty state illustration concept
    // Shows visual metaphor for "no data yet" - empty clipboard/folder with friendly vibe
    prompt: `Minimal flat design illustration of an empty clipboard or document with a subtle dotted outline placeholder in the center, soft indigo #6366F1 as primary color with emerald #10B981 accent, clean white background, simple geometric shapes, friendly empty state UI illustration for modern SaaS application, soft drop shadow beneath clipboard, one small decorative element like a tiny magnifying glass or plus icon suggesting "add data", Linear app and Notion inspired minimalist aesthetic, professional software empty state design, vector art style with clean edges, premium and sophisticated mood, no text or words`,
    negativePrompt: `cartoon characters, mascots, people, hands, faces, animals, childish style, cluttered, busy, too many colors, harsh contrasts, photorealistic, 3d realistic, text, words, letters, numbers, complex scenes, overwhelming detail, amateurish, clipart, outdated design, generic stock illustration, sad face, error icon, warning symbol, red color, broken or error theme`,
    priority: 'P1',
    stylePreset: 'digital-art'
  }
]

async function generateImage(asset) {
  const { width, height } = asset.sdxlDimensions
  console.log(`\n🎨 Generating: ${asset.id} (${width}x${height})...`)
  
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
        steps: 50, // Increased for better quality
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
    rawFile: `raw/${asset.id}.png`,
    generatedDimensions: `${width}x${height}`,
    targetDimensions: `${asset.targetWidth}x${asset.targetHeight}`,
    size: `${(imageBuffer.length / 1024).toFixed(1)}KB`
  }
}

async function main() {
  console.log('🚀 Media Pipeline - ITERATION 2')
  console.log('━'.repeat(50))
  console.log('Addressing Quality Agent feedback:')
  console.log('  • hero-workspace: Better screen content (gradient glow)')
  console.log('  • hero-workspace-mobile: Explicitly MacBook laptop')
  console.log('  • empty-state-data: Correct empty state concept')
  console.log('━'.repeat(50))
  console.log(`Assets to regenerate: ${assets.length}`)
  console.log(`Estimated cost: ~$${(assets.length * 0.02).toFixed(2)}`)
  console.log('━'.repeat(50))

  const results = []
  let successCount = 0

  for (const asset of assets) {
    try {
      const result = await generateImage(asset)
      results.push({ ...result, status: 'generated' })
      successCount++
    } catch (error) {
      console.error(`   ❌ Failed: ${asset.id} - ${error.message}`)
      results.push({ id: asset.id, status: 'failed', error: error.message })
    }
  }

  // Update generation log
  const logPath = path.join(__dirname, 'metadata', 'generation-log.md')
  const existingLog = await fs.readFile(logPath, 'utf-8').catch(() => '')
  
  const newLogSection = `

---

## Iteration 2 - ${new Date().toISOString()}

### Changes Made
- hero-workspace: Prompt updated to show gradient glow instead of fake UI
- hero-workspace-mobile: Added explicit "laptop" emphasis, negative for iMac/desktop
- empty-state-data: Completely new concept - empty clipboard/document illustration

### Results
${results.map(r => `- ${r.id}: ${r.status}${r.error ? ` (${r.error})` : ''}`).join('\n')}

### Cost
- Estimated: ~$${(successCount * 0.02).toFixed(2)}
`
  
  await fs.writeFile(logPath, existingLog + newLogSection)

  console.log('\n' + '━'.repeat(50))
  console.log(`✅ Iteration 2 complete! ${successCount}/${assets.length} regenerated`)
  console.log('━'.repeat(50))
  console.log('\n📋 Next: Run optimize-assets-v2.mjs')
}

main().catch(console.error)

