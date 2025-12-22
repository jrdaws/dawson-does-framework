// tests/cli/init-integration.test.mjs
/**
 * Integration tests for framework init command
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const frameworkBin = path.resolve(__dirname, '../../bin/framework.js')

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'framework-test-'))
}

function cleanupTempDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

function runFramework(args, options = {}) {
  const result = spawnSync('node', [frameworkBin, ...args], {
    encoding: 'utf-8',
    timeout: 15000,
    ...options,
  })
  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    status: result.status,
    error: result.error,
  }
}

// ===== Help Tests =====

test('CLI init: init without args uses current directory', () => {
  const tempDir = createTempDir()
  const originalCwd = process.cwd()

  try {
    process.chdir(tempDir)

    const result = runFramework(['init'])

    // Should initialize current directory (tempDir)
    assert(result.status === 0 || result.stdout.includes('✅'))

    // Check .dd was created in current directory
    const ddDir = path.join(tempDir, '.dd')
    assert(fs.existsSync(ddDir), '.dd should exist in current directory')
  } finally {
    process.chdir(originalCwd)
    cleanupTempDir(tempDir)
  }
})

test('CLI init: init --help shows usage', () => {
  const result = runFramework(['init', '--help'])

  assert(result.stdout.includes('Usage'))
  assert(result.stdout.includes('Initialize'))
  assert(result.stdout.includes('--cursor'))
  assert(result.stdout.includes('--force'))
  assert(result.stdout.includes('Examples'))
  assert(result.status === 0)
})

test('CLI init: init help shows usage', () => {
  const result = runFramework(['init', 'help'])

  assert(result.stdout.includes('Usage'))
  assert(result.stdout.includes('Initialize'))
})

// ===== Basic Initialization Tests =====

test('CLI init: initializes directory with basic structure', () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(['init', tempDir])

    // Check command success
    assert(
      result.stdout.includes('initialized successfully') ||
        result.stdout.includes('✅'),
      'Should show success message'
    )

    // Check .dd directory was created
    const ddDir = path.join(tempDir, '.dd')
    assert(fs.existsSync(ddDir), '.dd directory should exist')

    // Check manifest.json
    const manifestPath = path.join(ddDir, 'manifest.json')
    assert(fs.existsSync(manifestPath), 'manifest.json should exist')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    assert.equal(manifest.schemaVersion, 1)
    assert.equal(manifest.template, 'custom')
    assert.equal(manifest.initializedFrom, 'framework init')

    // Check config.json
    const configPath = path.join(ddDir, 'config.json')
    assert(fs.existsSync(configPath), 'config.json should exist')
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    assert.equal(config.plan, 'free')

    // Check .gitkeep
    const gitkeepPath = path.join(ddDir, '.gitkeep')
    assert(fs.existsSync(gitkeepPath), '.gitkeep should exist')
  } finally {
    cleanupTempDir(tempDir)
  }
})

test('CLI init: initializes with custom name', () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(['init', tempDir, '--name', 'custom-project'])

    assert(result.status === 0 || result.stdout.includes('✅'))

    const manifestPath = path.join(tempDir, '.dd', 'manifest.json')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    assert.equal(manifest.projectName, 'custom-project')
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ===== Cursor Flag Tests =====

test('CLI init: --cursor generates cursor files', () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(['init', tempDir, '--cursor'])

    assert(result.status === 0 || result.stdout.includes('✅'))

    // Check .cursorrules was created
    const cursorRulesPath = path.join(tempDir, '.cursorrules')
    assert(fs.existsSync(cursorRulesPath), '.cursorrules should exist')
    const cursorRules = fs.readFileSync(cursorRulesPath, 'utf8')
    assert(cursorRules.includes('Cursor Rules'))
    assert(cursorRules.includes('framework'))

    // Check START_PROMPT.md was created
    const startPromptPath = path.join(tempDir, 'START_PROMPT.md')
    assert(fs.existsSync(startPromptPath), 'START_PROMPT.md should exist')
    const startPrompt = fs.readFileSync(startPromptPath, 'utf8')
    assert(startPrompt.includes('Getting Started'))
    assert(startPrompt.includes('framework'))
  } finally {
    cleanupTempDir(tempDir)
  }
})

test('CLI init: without --cursor skips cursor files', () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(['init', tempDir])

    assert(result.status === 0 || result.stdout.includes('✅'))

    // Cursor files should NOT be created
    const cursorRulesPath = path.join(tempDir, '.cursorrules')
    assert(!fs.existsSync(cursorRulesPath), '.cursorrules should not exist')

    const startPromptPath = path.join(tempDir, 'START_PROMPT.md')
    assert(!fs.existsSync(startPromptPath), 'START_PROMPT.md should not exist')
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ===== Project Detection Tests =====

test('CLI init: detects Next.js project', () => {
  const tempDir = createTempDir()

  try {
    // Create package.json with Next.js
    const pkg = {
      name: 'nextjs-test',
      dependencies: {
        next: '^14.0.0',
        react: '^18.0.0',
      },
    }
    fs.writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify(pkg),
      'utf8'
    )

    const result = runFramework(['init', tempDir, '--cursor'])

    assert(result.status === 0 || result.stdout.includes('✅'))

    // Check that cursor rules mention Next.js
    const cursorRulesPath = path.join(tempDir, '.cursorrules')
    const cursorRules = fs.readFileSync(cursorRulesPath, 'utf8')
    assert(cursorRules.includes('Next.js'), 'Should detect Next.js')
  } finally {
    cleanupTempDir(tempDir)
  }
})

test('CLI init: detects TypeScript project', () => {
  const tempDir = createTempDir()

  try {
    // Create package.json and tsconfig.json
    const pkg = {
      name: 'ts-test',
      devDependencies: {
        typescript: '^5.0.0',
      },
    }
    fs.writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify(pkg),
      'utf8'
    )
    fs.writeFileSync(
      path.join(tempDir, 'tsconfig.json'),
      JSON.stringify({ compilerOptions: {} }),
      'utf8'
    )

    const result = runFramework(['init', tempDir, '--cursor'])

    assert(result.status === 0 || result.stdout.includes('✅'))

    // Check that cursor rules mention TypeScript
    const cursorRulesPath = path.join(tempDir, '.cursorrules')
    const cursorRules = fs.readFileSync(cursorRulesPath, 'utf8')
    assert(cursorRules.includes('TypeScript'), 'Should detect TypeScript')

    // Check that START_PROMPT shows tsconfig
    const startPromptPath = path.join(tempDir, 'START_PROMPT.md')
    const startPrompt = fs.readFileSync(startPromptPath, 'utf8')
    assert(startPrompt.includes('tsconfig.json'), 'Should mention tsconfig')
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ===== Dry Run Tests =====

test('CLI init: --dry-run shows preview without changes', () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(['init', tempDir, '--dry-run'])

    // Should show what would happen
    assert(result.stdout.includes('DRY RUN'))
    assert(result.stdout.includes('.dd directory'))
    assert(result.stdout.includes('manifest.json'))
    assert(result.stdout.includes('config.json'))

    // Should NOT create .dd directory
    const ddDir = path.join(tempDir, '.dd')
    assert(!fs.existsSync(ddDir), '.dd should not exist in dry run')
  } finally {
    cleanupTempDir(tempDir)
  }
})

test('CLI init: --dry-run with --cursor shows cursor file preview', () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(['init', tempDir, '--dry-run', '--cursor'])

    assert(result.stdout.includes('DRY RUN'))
    assert(result.stdout.includes('.cursorrules'))
    assert(result.stdout.includes('START_PROMPT.md'))

    // Should NOT create files
    assert(!fs.existsSync(path.join(tempDir, '.cursorrules')))
    assert(!fs.existsSync(path.join(tempDir, 'START_PROMPT.md')))
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ===== Force Flag Tests =====

test('CLI init: fails when already initialized without --force', () => {
  const tempDir = createTempDir()

  try {
    // Initialize once
    const firstResult = runFramework(['init', tempDir])
    assert(firstResult.status === 0 || firstResult.stdout.includes('✅'))

    // Try to initialize again without --force
    const secondResult = runFramework(['init', tempDir])

    assert(secondResult.status !== 0, 'Should fail without --force')
    assert(
      secondResult.stdout.includes('already initialized') ||
        secondResult.stderr.includes('already initialized'),
      'Should mention already initialized'
    )
  } finally {
    cleanupTempDir(tempDir)
  }
})

test('CLI init: --force reinitializes existing project', () => {
  const tempDir = createTempDir()

  try {
    // Initialize with first name
    const firstResult = runFramework(['init', tempDir, '--name', 'first-name'])
    assert(firstResult.status === 0 || firstResult.stdout.includes('✅'))

    // Reinitialize with different name using --force
    const secondResult = runFramework([
      'init',
      tempDir,
      '--name',
      'second-name',
      '--force',
    ])
    assert(secondResult.status === 0 || secondResult.stdout.includes('✅'))

    // Check that name was updated
    const manifestPath = path.join(tempDir, '.dd', 'manifest.json')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    assert.equal(manifest.projectName, 'second-name')
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ===== Error Handling Tests =====

test('CLI init: fails for non-existent directory', () => {
  const nonExistentDir = path.join(os.tmpdir(), 'does-not-exist-' + Date.now())

  const result = runFramework(['init', nonExistentDir])

  assert(result.status !== 0, 'Should fail for non-existent directory')
  assert(
    result.stdout.includes('does not exist') ||
      result.stderr.includes('does not exist'),
    'Should mention directory does not exist'
  )
})

test('CLI init: current directory with . argument', () => {
  const tempDir = createTempDir()
  const originalCwd = process.cwd()

  try {
    process.chdir(tempDir)

    const result = runFramework(['init', '.'])

    assert(result.status === 0 || result.stdout.includes('✅'))

    // Check .dd was created in current directory
    const ddDir = path.join(tempDir, '.dd')
    assert(fs.existsSync(ddDir), '.dd should exist in current directory')
  } finally {
    process.chdir(originalCwd)
    cleanupTempDir(tempDir)
  }
})

test('CLI init: handles flags-first with current directory', () => {
  const tempDir = createTempDir()
  const originalCwd = process.cwd()

  try {
    process.chdir(tempDir)

    // When flags come first, command uses current directory
    const result = runFramework(['init', '--cursor', '--force'])

    // Should initialize current directory
    assert(result.status === 0 || result.stdout.includes('✅'))

    const ddDir = path.join(tempDir, '.dd')
    assert(fs.existsSync(ddDir), '.dd should exist')

    // Cursor files should also be created
    assert(fs.existsSync(path.join(tempDir, '.cursorrules')))
  } finally {
    process.chdir(originalCwd)
    cleanupTempDir(tempDir)
  }
})

// ===== Git Integration Tests =====

test('CLI init: creates git commit when not a repo (if git available)', () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(['init', tempDir])

    // Check if git is available on system
    const gitCheck = spawnSync('git', ['--version'], { encoding: 'utf-8' })

    if (gitCheck.status === 0) {
      // Git is available, check if repo was created
      const gitDir = path.join(tempDir, '.git')

      if (fs.existsSync(gitDir)) {
        // Check git log for init commit
        const logResult = spawnSync('git', ['log', '--oneline'], {
          cwd: tempDir,
          encoding: 'utf-8',
        })

        if (logResult.status === 0) {
          assert(
            logResult.stdout.includes('initialize') ||
              logResult.stdout.includes('dawson-does-framework'),
            'Should have initialization commit'
          )
        }
      }
    }

    // Always verify .dd was created
    assert(fs.existsSync(path.join(tempDir, '.dd')))
  } finally {
    cleanupTempDir(tempDir)
  }
})

test('CLI init: --no-git skips git initialization', () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(['init', tempDir, '--no-git'])

    assert(result.status === 0 || result.stdout.includes('✅'))

    // Output should mention skipping git
    assert(
      result.stdout.includes('skipped') || result.stdout.includes('no-git')
    )

    // .dd should still be created
    assert(fs.existsSync(path.join(tempDir, '.dd')))
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ===== Output Verification Tests =====

test('CLI init: shows next steps after initialization', () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(['init', tempDir])

    assert(result.stdout.includes('Next steps') || result.stdout.includes('📋'))
    assert(result.stdout.includes('framework doctor'))
    assert(result.stdout.includes('framework deploy'))
  } finally {
    cleanupTempDir(tempDir)
  }
})

test('CLI init: shows cursor suggestion when not using --cursor', () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(['init', tempDir])

    // Should suggest using --cursor flag
    assert(
      result.stdout.includes('--cursor') &&
        (result.stdout.includes('Generate') ||
          result.stdout.includes('AI context'))
    )
  } finally {
    cleanupTempDir(tempDir)
  }
})

test('CLI init: multiple flags with directory first', () => {
  const tempDir = createTempDir()

  try {
    // Directory first, then flags
    const result = runFramework([
      'init',
      tempDir,
      '--name',
      'test-project',
      '--cursor',
      '--force',
    ])

    assert(result.status === 0 || result.stdout.includes('✅'))

    // Verify all flags were processed
    const manifest = JSON.parse(
      fs.readFileSync(path.join(tempDir, '.dd', 'manifest.json'), 'utf8')
    )
    assert.equal(manifest.projectName, 'test-project')

    assert(fs.existsSync(path.join(tempDir, '.cursorrules')))
  } finally {
    cleanupTempDir(tempDir)
  }
})
