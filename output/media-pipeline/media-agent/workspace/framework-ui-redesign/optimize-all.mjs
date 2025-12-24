#!/usr/bin/env node
/**
 * Framework UI Redesign - Optimize all assets
 * Resizes to target dimensions and converts to WebP
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
  // Hero backgrounds
  { id: 'hero-gradient-bg', input: 'raw/hero-gradient-bg.png', output: 'optimized/hero-gradient-bg.webp', resize: '1920x1080', quality: 85 },
  { id: 'hero-gradient-bg-mobile', input: 'raw/hero-gradient-bg-mobile.png', output: 'optimized/hero-gradient-bg-mobile.webp', resize: '750x1334', quality: 85 },
  { id: 'hero-abstract-graphic', input: 'raw/hero-abstract-graphic.png', output: 'optimized/hero-abstract-graphic.webp', resize: '800x600', quality: 90 },
  
  // Screenshots
  { id: 'terminal-mockup-clean', input: 'raw/terminal-mockup-clean.png', output: 'optimized/terminal-mockup-clean.webp', resize: '1200x800', quality: 85 },
  { id: 'dashboard-preview', input: 'raw/dashboard-preview.png', output: 'optimized/dashboard-preview.webp', resize: '1200x800', quality: 85 },
  { id: 'code-editor-visual', input: 'raw/code-editor-visual.png', output: 'optimized/code-editor-visual.webp', resize: '800x600', quality: 85 },
  
  // Avatars (small, high quality)
  { id: 'avatar-placeholder-1', input: 'raw/avatar-placeholder-1.png', output: 'optimized/avatar-placeholder-1.webp', resize: '80x80', quality: 90 },
  { id: 'avatar-placeholder-2', input: 'raw/avatar-placeholder-2.png', output: 'optimized/avatar-placeholder-2.webp', resize: '80x80', quality: 90 },
  { id: 'avatar-placeholder-3', input: 'raw/avatar-placeholder-3.png', output: 'optimized/avatar-placeholder-3.webp', resize: '80x80', quality: 90 },
]

async function optimizeAsset(asset) {
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
  
  console.log(`✅ ${asset.id}: ${inputSize}KB → ${outputSize}KB (${reduction}% reduction)`)
  
  return { id: asset.id, outputSize: `${outputSize}KB`, reduction: `${reduction}%` }
}

async function main() {
  console.log('🔧 Framework UI Redesign - Optimizing Assets')
  console.log('━'.repeat(60))
  
  const results = []
  
  for (const asset of assets) {
    try {
      const result = await optimizeAsset(asset)
      results.push(result)
    } catch (error) {
      console.error(`❌ ${asset.id}: ${error.message}`)
    }
  }
  
  console.log('\n' + '━'.repeat(60))
  console.log(`✅ Optimization complete: ${results.length}/${assets.length}`)
  
  // Calculate total size
  const totalSize = results.reduce((sum, r) => sum + parseFloat(r.outputSize), 0)
  console.log(`📦 Total optimized size: ${totalSize.toFixed(1)}KB`)
  console.log('━'.repeat(60))
}

main().catch(console.error)

