#!/usr/bin/env node

/**
 * End-to-end test for AI project generation
 *
 * This script tests the complete generation pipeline:
 * 1. Intent analysis
 * 2. Architecture generation
 * 3. Code generation
 * 4. Cursor context building
 */

import { generateProject } from './dist/index.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

console.log('🚀 Starting AI Project Generation End-to-End Test\n');

// Test configuration
const testProject = {
  description: 'A simple todo list application where users can create, edit, and delete tasks. Include user authentication and the ability to mark tasks as complete.',
  projectName: 'TodoApp',
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

try {
  console.log('🤖 Calling generateProject...');
  console.log('   This may take 30-60 seconds...\n');

  const startTime = Date.now();

  const result = await generateProject(testProject, apiKey);

  const duration = Math.round((Date.now() - startTime) / 1000);

  console.log(`✅ Generation completed in ${duration} seconds!\n`);

  // Display results
  console.log('📊 Results Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Intent Analysis
  console.log('🎯 Intent Analysis:');
  console.log(`   Category: ${result.intent.category}`);
  console.log(`   Template: ${result.intent.suggestedTemplate}`);
  console.log(`   Confidence: ${Math.round(result.intent.confidence * 100)}%`);
  console.log(`   Complexity: ${result.intent.complexity}`);
  console.log(`   Features: ${result.intent.features.slice(0, 3).join(', ')}${result.intent.features.length > 3 ? '...' : ''}`);
  console.log(`   Key Entities: ${result.intent.keyEntities.join(', ')}`);
  console.log('');

  // Integrations
  const activeIntegrations = Object.entries(result.intent.integrations)
    .filter(([_, value]) => value)
    .map(([type, provider]) => `${type}:${provider}`)
    .join(', ');
  console.log(`   Integrations: ${activeIntegrations || 'none'}`);
  console.log('');

  // Architecture
  console.log('🏗️  Architecture:');
  console.log(`   Pages: ${result.architecture.pages.length}`);
  result.architecture.pages.forEach(page => {
    console.log(`      - ${page.path}: ${page.name}`);
  });
  console.log('');

  const customComponents = result.architecture.components.filter(c => c.template === 'create-new');
  console.log(`   Custom Components: ${customComponents.length}`);
  customComponents.forEach(comp => {
    console.log(`      - ${comp.name} (${comp.type})`);
  });
  console.log('');

  console.log(`   API Routes: ${result.architecture.routes.length}`);
  result.architecture.routes.forEach(route => {
    console.log(`      - ${route.method || 'GET'} ${route.path}`);
  });
  console.log('');

  // Code Generation
  console.log('💻 Generated Code:');
  console.log(`   Files: ${result.code.files.length}`);
  result.code.files.slice(0, 5).forEach(file => {
    const size = Math.round(file.content.length / 1024 * 10) / 10;
    console.log(`      - ${file.path} (${size} KB)`);
  });
  if (result.code.files.length > 5) {
    console.log(`      ... and ${result.code.files.length - 5} more files`);
  }
  console.log('');

  // Cursor Context
  console.log('📝 Cursor Context:');
  console.log(`   .cursorrules: ${Math.round(result.context.cursorrules.length / 1024 * 10) / 10} KB`);
  console.log(`   START_PROMPT.md: ${Math.round(result.context.startPrompt.length / 1024 * 10) / 10} KB`);
  console.log('');

  // Save output for inspection
  const outputDir = join(process.cwd(), 'test-output');
  await mkdir(outputDir, { recursive: true });

  // Save full result as JSON
  await writeFile(
    join(outputDir, 'generation-result.json'),
    JSON.stringify(result, null, 2)
  );
  console.log(`💾 Full result saved to: test-output/generation-result.json`);

  // Save individual files
  await writeFile(join(outputDir, '.cursorrules'), result.context.cursorrules);
  await writeFile(join(outputDir, 'START_PROMPT.md'), result.context.startPrompt);

  // Save a sample generated file
  if (result.code.files.length > 0) {
    const sampleFile = result.code.files[0];
    await mkdir(join(outputDir, 'sample-code'), { recursive: true });
    const safePath = sampleFile.path.replace(/\//g, '_');
    await writeFile(join(outputDir, 'sample-code', safePath), sampleFile.content);
    console.log(`💾 Sample file saved: test-output/sample-code/${safePath}`);
  }

  console.log('💾 Cursor context saved to: test-output/');
  console.log('');

  // Validation checks
  console.log('✅ Validation Checks:');
  const checks = [
    { name: 'Intent has category', pass: !!result.intent.category },
    { name: 'Intent has features', pass: result.intent.features.length > 0 },
    { name: 'Architecture has pages', pass: result.architecture.pages.length > 0 },
    { name: 'Architecture has components', pass: result.architecture.components.length > 0 },
    { name: 'Code files generated', pass: result.code.files.length > 0 },
    { name: 'Cursorrules generated', pass: result.context.cursorrules.length > 0 },
    { name: 'Start prompt generated', pass: result.context.startPrompt.length > 0 },
    { name: 'Files have content', pass: result.code.files.every(f => f.content.length > 10) },
  ];

  checks.forEach(check => {
    console.log(`   ${check.pass ? '✅' : '❌'} ${check.name}`);
  });

  const allPassed = checks.every(c => c.pass);
  console.log('');

  if (allPassed) {
    console.log('🎉 All validation checks passed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✨ End-to-end test SUCCESSFUL!');
    process.exit(0);
  } else {
    console.log('⚠️  Some validation checks failed');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('❌ End-to-end test FAILED');
    process.exit(1);
  }

} catch (error) {
  console.error('');
  console.error('❌ Error during generation:');
  console.error(`   ${error.message}`);
  console.error('');

  if (error.code) {
    console.error(`   Error Code: ${error.code}`);
  }

  if (error.retryable) {
    console.error('   This error is retryable - the system should have retried automatically.');
  }

  if (error.context) {
    console.error('   Context:', JSON.stringify(error.context, null, 2));
  }

  console.error('');
  console.error('Stack trace:');
  console.error(error.stack);

  process.exit(1);
}
