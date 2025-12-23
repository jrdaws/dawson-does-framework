#!/usr/bin/env node

/**
 * Test streaming functionality for AI project generation
 *
 * This script demonstrates real-time streaming output from the AI pipeline.
 * Run with: ANTHROPIC_API_KEY=your_key node test-streaming.mjs
 */

import { generateProject } from './dist/index.js';

console.log('🚀 Starting AI Project Generation with Streaming\n');

// Test configuration
const testProject = {
  description: 'A simple note-taking app with markdown support',
  projectName: 'NotesApp',
};

console.log('📋 Test Project Configuration:');
console.log(`   Name: ${testProject.projectName}`);
console.log(`   Description: ${testProject.description}`);
console.log('');

// Check for API key
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('❌ Error: ANTHROPIC_API_KEY environment variable not set');
  console.error('   Please set it with: export ANTHROPIC_API_KEY=your_key_here');
  process.exit(1);
}

console.log('✅ API key found');
console.log('');

// Track stage progress
const stageEmoji = {
  intent: '🎯',
  architecture: '🏗️',
  code: '💻',
  context: '📝',
};

const stageNames = {
  intent: 'Intent Analysis',
  architecture: 'Architecture Design',
  code: 'Code Generation',
  context: 'Context Building',
};

let currentStage = null;
let stageChars = 0;
const MAX_PREVIEW_CHARS = 200;

try {
  console.log('🤖 Starting generation with streaming enabled...\n');

  const startTime = Date.now();

  const result = await generateProject(testProject, {
    apiKey,
    logTokenUsage: true,
    modelTier: 'balanced', // Use balanced tier for reliability
    stream: true,
    onProgress: (event) => {
      if (event.type === 'start') {
        currentStage = event.stage;
        stageChars = 0;
        console.log(`\n${stageEmoji[event.stage]} ${stageNames[event.stage]} starting...`);
      } else if (event.type === 'chunk' && event.chunk) {
        // Show a preview of streaming (first N chars)
        if (stageChars < MAX_PREVIEW_CHARS) {
          const remaining = MAX_PREVIEW_CHARS - stageChars;
          const toShow = event.chunk.substring(0, remaining);
          process.stdout.write(toShow);
          stageChars += toShow.length;
          if (stageChars >= MAX_PREVIEW_CHARS) {
            process.stdout.write('...\n   [streaming remaining output]');
          }
        }
      } else if (event.type === 'complete') {
        console.log(`\n   ✅ ${stageNames[event.stage]} complete!`);
      }
    },
  });

  const duration = Math.round((Date.now() - startTime) / 1000);

  console.log(`\n\n${'═'.repeat(50)}`);
  console.log(`✅ Generation completed in ${duration} seconds!\n`);

  // Quick summary
  console.log('📊 Results Summary:');
  console.log(`   Intent: ${result.intent.category} (${Math.round(result.intent.confidence * 100)}% confidence)`);
  console.log(`   Template: ${result.intent.suggestedTemplate}`);
  console.log(`   Pages: ${result.architecture.pages.length}`);
  console.log(`   Components: ${result.architecture.components.length}`);
  console.log(`   Files generated: ${result.code.files.length}`);
  console.log('');

  console.log('✨ Streaming test SUCCESSFUL!');
  process.exit(0);

} catch (error) {
  console.error('\n\n❌ Error during generation:');
  console.error(`   ${error.message}`);
  console.error('');
  console.error('Stack trace:');
  console.error(error.stack);
  process.exit(1);
}

