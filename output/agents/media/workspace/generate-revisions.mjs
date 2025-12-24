#!/usr/bin/env node
/**
 * Framework UI Redesign - Iteration 2 Revisions
 * Regenerating: terminal-mockup-clean (with UI mockup style, NOT photography)
 * 
 * Key change: Using "flat design mockup" style instead of photographic prompt
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

// Revision assets - using UI mockup style, NOT photographic
const assets = [
  {
    id: 'terminal-mockup-clean-v2',
    targetWidth: 1200,
    targetHeight: 800,
    sdxl: { width: 1216, height: 832 }, // 3:2 aspect
    priority: 'P1',
    category: 'screenshots',
    // KEY CHANGE: Using digital-art preset and flat design language
    stylePreset: 'digital-art',
    prompt: `Clean macOS terminal window UI mockup floating on subtle indigo-to-violet gradient background, modern rounded window frame with red yellow green traffic light buttons in top left corner, dark black terminal background #1E1E1E with monospace font text, green and cyan colored command line text showing CLI output, subtle realistic drop shadow beneath floating window, flat design mockup style like Figma or Dribbble presentation, clean minimal composition, professional software documentation screenshot aesthetic, no physical hardware visible, pure UI interface design, modern app window floating elegantly, premium tech product mockup style`,
    negativePrompt: `photograph, physical device, monitor screen, laptop, LED lights, industrial equipment, hardware, real world objects, retro vintage, spreadsheet data, trading terminal, 3D realistic render, hands, desk, keyboard, mouse, camera, photography, photorealistic, person, human, office environment, workspace, furniture`
  }
]

async function generateImage(asset) {
  const { width, height } = asset.sdxl
  console.log(`\n🎨 Generating: ${asset.id}`)
  console.log(`   Style: Flat UI mockup (NOT photography)`)
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
        cfg_scale: 8, // Slightly higher for more prompt adherence
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
  
  return { id: asset.id, status: 'generated' }
}

async function main() {
  console.log('🚀 Framework UI Redesign - ITERATION 2 REVISIONS')
  console.log('━'.repeat(60))
  console.log('Addressing Quality Agent feedback:')
  console.log('  • terminal-mockup-clean: Changed to flat UI mockup style')
  console.log('  • Style preset: digital-art (not photographic)')
  console.log('  • Focus: Pure UI interface, no physical hardware')
  console.log('━'.repeat(60))

  for (const asset of assets) {
    try {
      await generateImage(asset)
    } catch (error) {
      console.error(`   ❌ Failed: ${asset.id} - ${error.message}`)
    }
  }

  console.log('\n' + '━'.repeat(60))
  console.log('✅ Revision generation complete')
  console.log('📋 Next: Optimize and test hero-abstract placement')
  console.log('━'.repeat(60))
}

main().catch(console.error)

