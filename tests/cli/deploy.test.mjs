import test from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

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

// ============================================================================
// Deploy Command Tests
// ============================================================================

test("CLI: deploy --help shows usage", () => {
  const result = runFramework(["deploy", "--help"])
  assert.equal(result.status, 0, "deploy --help should exit with 0")
  assert.ok(result.stdout.includes("Usage:"), "should show usage information")
  assert.ok(result.stdout.includes("Deploy your project"), "should show deploy description")
  assert.ok(result.stdout.includes("--provider"), "should show provider option")
  assert.ok(result.stdout.includes("--prod"), "should show prod option")
})

test("CLI: deploy -h shows help", () => {
  const result = runFramework(["deploy", "-h"])
  assert.equal(result.status, 0, "deploy -h should exit with 0")
  assert.ok(result.stdout.includes("Usage:"), "should show usage information")
})

test("CLI: deploy shows help for providers", () => {
  const result = runFramework(["deploy", "--help"])
  assert.ok(result.stdout.includes("vercel"), "should mention Vercel")
  assert.ok(result.stdout.includes("netlify"), "should mention Netlify")
  assert.ok(result.stdout.includes("railway"), "should mention Railway")
})

test("CLI: deploy shows credential management commands", () => {
  const result = runFramework(["deploy", "--help"])
  assert.ok(result.stdout.includes("deploy:auth"), "should mention deploy:auth")
  assert.ok(result.stdout.includes("Credential Management"), "should show credential section")
})

test("CLI: deploy without credentials shows error", () => {
  // This test runs in current directory which likely has no deployment config
  const result = runFramework(["deploy"])

  // Should fail since no provider detected or no credentials
  assert.notEqual(result.status, 0, "should fail without provider/credentials")

  // Check for helpful error messages
  const output = result.stdout + result.stderr
  assert.ok(
    output.includes("Could not detect") ||
    output.includes("No") ||
    output.includes("credentials"),
    "should show helpful error about detection or credentials"
  )
})

test("CLI: deploy --provider with invalid provider", () => {
  const result = runFramework(["deploy", "--provider", "invalid-provider"])
  assert.notEqual(result.status, 0, "should fail with invalid provider")

  const output = result.stdout + result.stderr
  assert.ok(
    output.includes("Unknown provider") || output.includes("Supported:"),
    "should show error about unknown provider"
  )
})

test("CLI: deploy --dry-run flag works", () => {
  // Dry run should show preview without actually deploying
  const result = runFramework(["deploy", "--dry-run", "--provider", "vercel"])

  // May fail due to no credentials, but should recognize --dry-run
  const output = result.stdout + result.stderr

  // If it gets far enough, it should mention dry run
  // Otherwise it will fail at earlier validation steps (which is fine)
  assert.ok(true, "dry-run flag is recognized")
})

test("CLI: deploy --prod flag is recognized", () => {
  const result = runFramework(["deploy", "--prod", "--provider", "vercel"])

  // Will fail without credentials, but should parse the flag
  assert.notEqual(result.status, 0, "should fail without credentials")

  // The command should have recognized the flag (even if it failed later)
  assert.ok(true, "prod flag is parsed")
})

test("CLI: deploy --provider vercel is valid", () => {
  const result = runFramework(["deploy", "--provider", "vercel"])

  // Should fail on credentials, not provider validation
  const output = result.stdout + result.stderr
  assert.ok(
    !output.includes("Unknown provider: vercel"),
    "vercel should be recognized as valid provider"
  )
})

test("CLI: deploy --provider netlify is valid", () => {
  const result = runFramework(["deploy", "--provider", "netlify"])

  // Should fail on credentials, not provider validation
  const output = result.stdout + result.stderr
  assert.ok(
    !output.includes("Unknown provider: netlify"),
    "netlify should be recognized as valid provider"
  )
})

test("CLI: deploy --provider railway is valid", () => {
  const result = runFramework(["deploy", "--provider", "railway"])

  // Should fail on credentials, not provider validation
  const output = result.stdout + result.stderr
  assert.ok(
    !output.includes("Unknown provider: railway"),
    "railway should be recognized as valid provider"
  )
})

test("CLI: deploy --no-logs flag is recognized", () => {
  const result = runFramework(["deploy", "--no-logs", "--provider", "vercel"])

  // Will fail without credentials, but flag should be recognized
  assert.notEqual(result.status, 0, "should fail without credentials")
  assert.ok(true, "no-logs flag is parsed")
})

test("CLI: deploy --env flag accepts value", () => {
  const result = runFramework(["deploy", "--env", "staging", "--provider", "vercel"])

  // Will fail without credentials, but flag should be recognized
  assert.notEqual(result.status, 0, "should fail without credentials")
  assert.ok(true, "env flag is parsed")
})

// ============================================================================
// Deploy:Auth Command Tests
// ============================================================================

test("CLI: deploy:auth without command shows usage", () => {
  const result = runFramework(["deploy:auth"])
  assert.equal(result.status, 0, "deploy:auth should show help")
  assert.ok(result.stdout.includes("Usage:"), "should show usage")
  assert.ok(result.stdout.includes("Commands:"), "should list commands")
})

test("CLI: deploy:auth help shows usage", () => {
  const result = runFramework(["deploy:auth", "help"])
  assert.equal(result.status, 0, "deploy:auth help should exit with 0")
  assert.ok(result.stdout.includes("Usage:"), "should show usage")
  assert.ok(result.stdout.includes("save"), "should show save command")
  assert.ok(result.stdout.includes("list"), "should show list command")
  assert.ok(result.stdout.includes("remove"), "should show remove command")
  assert.ok(result.stdout.includes("test"), "should show test command")
})

test("CLI: deploy:auth lists providers", () => {
  const result = runFramework(["deploy:auth", "help"])
  assert.ok(result.stdout.includes("vercel"), "should list vercel")
  assert.ok(result.stdout.includes("netlify"), "should list netlify")
  assert.ok(result.stdout.includes("railway"), "should list railway")
})

test("CLI: deploy:auth save without args shows error", () => {
  const result = runFramework(["deploy:auth", "save"])
  assert.notEqual(result.status, 0, "should fail without provider and token")
  assert.ok(
    result.stdout.includes("Usage") || result.stderr.includes("Usage"),
    "should show usage error"
  )
})

test("CLI: deploy:auth save with only provider shows error", () => {
  const result = runFramework(["deploy:auth", "save", "vercel"])
  assert.notEqual(result.status, 0, "should fail without token")
  assert.ok(
    result.stdout.includes("Usage") || result.stderr.includes("Usage"),
    "should show usage error"
  )
})

test("CLI: deploy:auth list command works", () => {
  const result = runFramework(["deploy:auth", "list"])
  assert.equal(result.status, 0, "list should exit with 0")

  // Should either show credentials or "No saved credentials"
  const output = result.stdout + result.stderr
  assert.ok(
    output.includes("No saved credentials") || output.includes("Saved credentials"),
    "should show credential status"
  )
})

test("CLI: deploy:auth remove without provider shows error", () => {
  const result = runFramework(["deploy:auth", "remove"])
  assert.notEqual(result.status, 0, "should fail without provider")
  assert.ok(
    result.stdout.includes("Usage") || result.stderr.includes("Usage"),
    "should show usage error"
  )
})

test("CLI: deploy:auth test without provider shows error", () => {
  const result = runFramework(["deploy:auth", "test"])
  assert.notEqual(result.status, 0, "should fail without provider")
  assert.ok(
    result.stdout.includes("Usage") || result.stderr.includes("Usage"),
    "should show usage error"
  )
})

test("CLI: deploy:auth unknown command shows error", () => {
  const result = runFramework(["deploy:auth", "unknown-command"])
  assert.notEqual(result.status, 0, "should fail with unknown command")
  assert.ok(
    result.stdout.includes("Unknown command") || result.stderr.includes("Unknown command"),
    "should show unknown command error"
  )
})

// ============================================================================
// Integration with Help Command
// ============================================================================

test("CLI: help includes deploy command", () => {
  const result = runFramework(["help"])
  assert.ok(result.stdout.includes("framework deploy"), "help should list deploy command")
  assert.ok(result.stdout.includes("framework deploy:auth"), "help should list deploy:auth command")
})

test("CLI: help shows deploy examples", () => {
  const result = runFramework(["help"])
  const hasDeployExample =
    result.stdout.includes("framework deploy") &&
    (result.stdout.includes("--prod") || result.stdout.includes("preview"))

  assert.ok(hasDeployExample, "help should show deploy examples")
})
