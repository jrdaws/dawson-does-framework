#!/usr/bin/env node
/**
 * Asset Optimizer - Resize and convert to WebP
 * Requires: ImageMagick (brew install imagemagick)
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const assets = [
  {
    id: 'hero-workspace',
    input: 'raw/hero-workspace.png',
    output: 'optimized/hero-workspace.webp',
    resize: '1920x1080',
    quality: 85
  },
  {
    id: 'hero-workspace-mobile',
    input: 'raw/hero-workspace-mobile.png',
    output: 'optimized/hero-workspace-mobile.webp',
    resize: '750x1000',
    quality: 85
  },
  {
    id: 'empty-state-data',
    input: 'raw/empty-state-data.png',
    output: 'optimized/empty-state-data.webp',
    resize: '400x300',
    quality: 90
  }
]

// ImageMagick 7 uses 'magick' instead of 'convert'
const MAGICK_PATH = '/opt/homebrew/bin/magick'

async function checkImageMagick() {
  try {
    await execAsync(`${MAGICK_PATH} -version`)
    return true
  } catch {
    // Fallback to PATH
    try {
      await execAsync('magick -version')
      return true
    } catch {
      return false
    }
  }
}

async function optimizeAsset(asset) {
  console.log(`\n📐 Optimizing: ${asset.id}...`)
  
  const inputPath = path.join(__dirname, asset.input)
  const outputPath = path.join(__dirname, asset.output)
  
  // Check input exists
  try {
    await fs.access(inputPath)
  } catch {
    throw new Error(`Input file not found: ${asset.input}`)
  }
  
  // Resize and convert to WebP (using ImageMagick 7 'magick' command)
  const cmd = `${MAGICK_PATH} "${inputPath}" -resize ${asset.resize}! -quality ${asset.quality} "${outputPath}"`
  
  try {
    await execAsync(cmd)
    
    // Get file sizes
    const [inputStats, outputStats] = await Promise.all([
      fs.stat(inputPath),
      fs.stat(outputPath)
    ])
    
    const inputSize = (inputStats.size / 1024).toFixed(1)
    const outputSize = (outputStats.size / 1024).toFixed(1)
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(0)
    
    console.log(`   ✅ ${asset.input} → ${asset.output}`)
    console.log(`   📦 ${inputSize}KB → ${outputSize}KB (${reduction}% reduction)`)
    
    return {
      id: asset.id,
      status: 'optimized',
      file: asset.output,
      dimensions: asset.resize,
      inputSize: `${inputSize}KB`,
      outputSize: `${outputSize}KB`,
      reduction: `${reduction}%`
    }
  } catch (error) {
    throw new Error(`ImageMagick error: ${error.message}`)
  }
}

async function main() {
  console.log('🔧 Asset Optimization - Resize & WebP Conversion')
  console.log('━'.repeat(50))
  
  // Check ImageMagick
  const hasImageMagick = await checkImageMagick()
  if (!hasImageMagick) {
    console.error('❌ ImageMagick not found!')
    console.error('   Install with: brew install imagemagick')
    process.exit(1)
  }
  console.log('✓ ImageMagick found')
  
  const results = []
  let successCount = 0
  let failCount = 0
  
  for (const asset of assets) {
    try {
      const result = await optimizeAsset(asset)
      results.push(result)
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
  
  console.log('\n' + '━'.repeat(50))
  console.log(`✅ Complete! ${successCount}/${assets.length} assets optimized`)
  console.log('━'.repeat(50))
  
  // Summary
  console.log('\n📊 Optimization Summary:')
  for (const r of results) {
    if (r.status === 'optimized') {
      console.log(`   ${r.id}: ${r.inputSize} → ${r.outputSize} (${r.reduction})`)
    }
  }
  
  console.log('\n📋 Next steps:')
  console.log('   1. Review images for AI artifacts')
  console.log('   2. Create asset manifest')
  console.log('   3. Handoff to Quality Agent')
}

main().catch(console.error)

