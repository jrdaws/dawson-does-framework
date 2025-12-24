#!/usr/bin/env node
/**
 * Configurator UX Redesign - Generate export-success-graphic
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const STABILITY_API_KEY = process.env.STABILITY_API_KEY
const API_HOST = 'https://api.stability.ai'

if (!STABILITY_API_KEY) {
  console.error('Error: STABILITY_API_KEY required')
  process.exit(1)
}

const asset = {
  id: 'export-success-graphic',
  targetWidth: 300,
  targetHeight: 200,
  sdxl: { width: 1152, height: 896 }, // 4:3 closest to 3:2
  stylePreset: 'digital-art',
  prompt: `Clean modern illustration of successful project export and deployment, abstract rocket or arrow launching upward with elegant trail, indigo #6366F1 and violet #8B5CF6 color scheme with small emerald #10B981 accents, white background, celebration achievement mood, minimal modern flat design style, suitable for success modal dialog, subtle sparkle elements, professional SaaS aesthetic, Linear app inspired clean illustration, not busy or cluttered, premium and sophisticated`,
  negativePrompt: `realistic, photographic, cluttered, busy, too many colors, childish, clip art, cartoon mascot, generic stock illustration, rainbow effects, text, words, people, hands, faces, 3D realistic, complex scene`
}

async function generateImage() {
  const { width, height } = asset.sdxl
  console.log(`\n🎨 Generating: ${asset.id}`)
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
        cfg_scale: 8,
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
}

generateImage().then(() => {
  console.log('\n✅ Export success graphic generated')
  console.log('📋 Next: Optimize to WebP and create celebration SVGs')
}).catch(console.error)

