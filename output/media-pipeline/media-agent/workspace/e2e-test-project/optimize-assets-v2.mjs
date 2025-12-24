#!/usr/bin/env node
/**
 * Asset Optimizer - Iteration 2
 * Resize v2 assets and convert to WebP
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MAGICK_PATH = '/opt/homebrew/bin/magick'

const assets = [
  {
    id: 'hero-workspace-v2',
    input: 'raw/hero-workspace-v2.png',
    output: 'optimized/hero-workspace.webp', // Overwrite v1
    resize: '1920x1080',
    quality: 85
  },
  {
    id: 'hero-workspace-mobile-v2',
    input: 'raw/hero-workspace-mobile-v2.png',
    output: 'optimized/hero-workspace-mobile.webp', // Overwrite v1
    resize: '750x1000',
    quality: 85
  },
  {
    id: 'empty-state-data-v2',
    input: 'raw/empty-state-data-v2.png',
    output: 'optimized/empty-state-data.webp', // Overwrite v1
    resize: '400x300',
    quality: 90
  }
]

async function optimizeAsset(asset) {
  console.log(`\n📐 Optimizing: ${asset.id}...`)
  
  const inputPath = path.join(__dirname, asset.input)
  const outputPath = path.join(__dirname, asset.output)
  
  const cmd = `${MAGICK_PATH} "${inputPath}" -resize ${asset.resize}! -quality ${asset.quality} "${outputPath}"`
  
  await execAsync(cmd)
  
  const [inputStats, outputStats] = await Promise.all([
    fs.stat(inputPath),
    fs.stat(outputPath)
  ])
  
  const inputSize = (inputStats.size / 1024).toFixed(1)
  const outputSize = (outputStats.size / 1024).toFixed(1)
  const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(0)
  
  console.log(`   ✅ ${asset.input} → ${asset.output}`)
  console.log(`   📦 ${inputSize}KB → ${outputSize}KB (${reduction}% reduction)`)
  
  return { id: asset.id, outputSize: `${outputSize}KB`, reduction: `${reduction}%` }
}

async function main() {
  console.log('🔧 Iteration 2 - Optimize & Convert to WebP')
  console.log('━'.repeat(50))
  
  const results = []
  
  for (const asset of assets) {
    try {
      const result = await optimizeAsset(asset)
      results.push(result)
    } catch (error) {
      console.error(`   ❌ Failed: ${asset.id} - ${error.message}`)
    }
  }
  
  console.log('\n' + '━'.repeat(50))
  console.log(`✅ Iteration 2 optimization complete!`)
  console.log('━'.repeat(50))
  
  console.log('\n📊 Summary:')
  for (const r of results) {
    console.log(`   ${r.id}: ${r.outputSize} (${r.reduction})`)
  }
  
  console.log('\n📋 Next: Copy to shared/assets and update Quality Agent')
}

main().catch(console.error)

