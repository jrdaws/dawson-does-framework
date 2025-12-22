import test from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs"
import os from "node:os"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const frameworkBin = path.resolve(__dirname, "../../bin/framework.js")

/**
 * Helper to run framework CLI and capture output
 */
function runFramework(args, options = {}) {
  const result = spawnSync("node", [frameworkBin, ...args], {
    encoding: "utf-8",
    ...options,
  })
  return {
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    status: result.status,
    error: result.error,
  }
}

/**
 * Create a temporary test directory
 */
function createTempDir(prefix = "test-init-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix))
}

/**
 * Clean up temporary directory
 */
function cleanupTempDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true })
  } catch (err) {
    // Ignore cleanup errors
  }
}

// ============================================================================
// Init Command - Help and Usage
// ============================================================================

test("CLI: init --help shows usage", () => {
  const result = runFramework(["init", "--help"])
  assert.equal(result.status, 0, "init --help should exit with 0")
  assert.ok(result.stdout.includes("Usage:"), "should show usage information")
  assert.ok(result.stdout.includes("Initialize an existing project"), "should show description")
  assert.ok(result.stdout.includes("--cursor"), "should show cursor option")
  assert.ok(result.stdout.includes("--force"), "should show force option")
})

test("CLI: init -h shows help", () => {
  const result = runFramework(["init", "-h"])
  assert.equal(result.status, 0, "init -h should exit with 0")
  assert.ok(result.stdout.includes("Usage:"), "should show usage information")
})

test("CLI: init help shows usage", () => {
  const result = runFramework(["init", "help"])
  assert.equal(result.status, 0, "init help should exit with 0")
  assert.ok(result.stdout.includes("Usage:"), "should show usage information")
})

// ============================================================================
// Init Command - Directory Validation
// ============================================================================

test("CLI: init on non-existent directory fails", () => {
  const nonExistentDir = "/tmp/definitely-does-not-exist-" + Date.now()
  const result = runFramework(["init", nonExistentDir])

  assert.notEqual(result.status, 0, "should fail with non-existent directory")
  const output = result.stdout + result.stderr
  assert.ok(output.includes("does not exist"), "should show error about directory not existing")
})

// ============================================================================
// Init Command - Basic Initialization
// ============================================================================

test("CLI: init creates .dd directory", () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(["init", tempDir])

    assert.equal(result.status, 0, "init should exit with 0")
    assert.ok(fs.existsSync(path.join(tempDir, ".dd")), ".dd directory should be created")
    assert.ok(fs.existsSync(path.join(tempDir, ".dd", "manifest.json")), "manifest.json should be created")
    assert.ok(fs.existsSync(path.join(tempDir, ".dd", "config.json")), "config.json should be created")

    const output = result.stdout + result.stderr
    assert.ok(output.includes("initialized successfully"), "should show success message")
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("CLI: init with --name sets project name", () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(["init", tempDir, "--name", "My Test Project"])

    assert.equal(result.status, 0, "init should exit with 0")

    const manifestPath = path.join(tempDir, ".dd", "manifest.json")
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))

    assert.equal(manifest.projectName, "My Test Project", "project name should be set in manifest")
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("CLI: init on already initialized directory fails", () => {
  const tempDir = createTempDir()

  try {
    // First init
    const result1 = runFramework(["init", tempDir])
    assert.equal(result1.status, 0, "first init should succeed")

    // Second init (should fail)
    const result2 = runFramework(["init", tempDir])
    assert.notEqual(result2.status, 0, "second init should fail")

    const output = result2.stdout + result2.stderr
    assert.ok(output.includes("already initialized"), "should show already initialized error")
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("CLI: init with --force overwrites existing .dd", () => {
  const tempDir = createTempDir()

  try {
    // First init
    runFramework(["init", tempDir, "--name", "Original Name"])

    // Second init with --force
    const result = runFramework(["init", tempDir, "--name", "New Name", "--force"])

    assert.equal(result.status, 0, "init with --force should succeed")

    const manifestPath = path.join(tempDir, ".dd", "manifest.json")
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))

    assert.equal(manifest.projectName, "New Name", "project name should be updated")
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ============================================================================
// Init Command - Cursor Files
// ============================================================================

test("CLI: init with --cursor generates Cursor files", () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(["init", tempDir, "--cursor"])

    assert.equal(result.status, 0, "init should exit with 0")
    assert.ok(fs.existsSync(path.join(tempDir, ".cursorrules")), ".cursorrules should be created")
    assert.ok(fs.existsSync(path.join(tempDir, "START_PROMPT.md")), "START_PROMPT.md should be created")

    const cursorRules = fs.readFileSync(path.join(tempDir, ".cursorrules"), "utf8")
    assert.ok(cursorRules.includes("Cursor Rules"), ".cursorrules should have content")

    const startPrompt = fs.readFileSync(path.join(tempDir, "START_PROMPT.md"), "utf8")
    assert.ok(startPrompt.includes("Getting Started"), "START_PROMPT.md should have content")
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("CLI: init without --cursor skips Cursor files", () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(["init", tempDir])

    assert.equal(result.status, 0, "init should exit with 0")
    assert.ok(!fs.existsSync(path.join(tempDir, ".cursorrules")), ".cursorrules should not be created")
    assert.ok(!fs.existsSync(path.join(tempDir, "START_PROMPT.md")), "START_PROMPT.md should not be created")
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ============================================================================
// Init Command - Dry Run
// ============================================================================

test("CLI: init --dry-run shows preview without making changes", () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(["init", tempDir, "--dry-run"])

    assert.equal(result.status, 0, "dry run should exit with 0")
    assert.ok(result.stdout.includes("DRY RUN"), "should show dry run message")
    assert.ok(result.stdout.includes("No changes made"), "should indicate no changes")

    // Verify no files were created
    assert.ok(!fs.existsSync(path.join(tempDir, ".dd")), ".dd directory should not be created in dry run")
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("CLI: init --dry-run shows all planned operations", () => {
  const tempDir = createTempDir()

  try {
    const result = runFramework(["init", tempDir, "--dry-run", "--cursor"])

    assert.ok(result.stdout.includes("Create .dd directory"), "should mention .dd creation")
    assert.ok(result.stdout.includes("manifest.json"), "should mention manifest")
    assert.ok(result.stdout.includes("config.json"), "should mention config")
    assert.ok(result.stdout.includes(".cursorrules"), "should mention cursorrules")
    assert.ok(result.stdout.includes("START_PROMPT.md"), "should mention START_PROMPT")
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ============================================================================
// Init Command - Project Detection
// ============================================================================

test("CLI: init detects package.json if present", () => {
  const tempDir = createTempDir()

  try {
    // Create a package.json
    const packageJson = {
      name: "test-package",
      version: "1.0.0",
      description: "A test package",
      dependencies: {
        react: "^18.0.0",
        next: "^14.0.0"
      }
    }
    fs.writeFileSync(
      path.join(tempDir, "package.json"),
      JSON.stringify(packageJson, null, 2),
      "utf8"
    )

    const result = runFramework(["init", tempDir, "--cursor"])

    assert.equal(result.status, 0, "init should exit with 0")

    // Check that cursorrules includes detected tech
    const cursorRules = fs.readFileSync(path.join(tempDir, ".cursorrules"), "utf8")
    assert.ok(cursorRules.includes("Next.js") || cursorRules.includes("React"), "should detect Next.js or React")
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ============================================================================
// Init Command - Manifest Validation
// ============================================================================

test("CLI: init creates valid manifest.json", () => {
  const tempDir = createTempDir()

  try {
    runFramework(["init", tempDir])

    const manifestPath = path.join(tempDir, ".dd", "manifest.json")
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))

    assert.ok(manifest.schemaVersion, "manifest should have schemaVersion")
    assert.ok(manifest.projectName, "manifest should have projectName")
    assert.ok(manifest.initializedAt, "manifest should have initializedAt")
    assert.equal(manifest.initializedFrom, "framework init", "should indicate source")
    assert.equal(manifest.template, "custom", "should use custom template for init")
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("CLI: init creates valid config.json", () => {
  const tempDir = createTempDir()

  try {
    runFramework(["init", tempDir])

    const configPath = path.join(tempDir, ".dd", "config.json")
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"))

    assert.ok(config.plan, "config should have plan")
    assert.ok(config.featureOverrides !== undefined, "config should have featureOverrides")
    assert.ok(config.afterInstall, "config should have afterInstall")
  } finally {
    cleanupTempDir(tempDir)
  }
})

// ============================================================================
// Init Command - Integration with Help
// ============================================================================

test("CLI: help includes init command", () => {
  const result = runFramework(["help"])
  assert.ok(result.stdout.includes("framework init"), "help should list init command")
})

test("CLI: help shows init examples", () => {
  const result = runFramework(["help"])
  assert.ok(
    result.stdout.includes("framework init") && result.stdout.includes("Initialize"),
    "help should show init examples"
  )
})
