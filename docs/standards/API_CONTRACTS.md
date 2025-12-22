# API Contracts

> Defining how modules communicate with each other

## Overview

This document defines the contracts for functions, modules, APIs, and hooks in the dawson-does-framework. Following these conventions ensures consistency and predictability across the codebase.

---

## 1. Function Signatures

### JavaScript (.mjs) Functions

```javascript
/**
 * Brief description of what the function does
 * @param {Type} paramName - Description of parameter
 * @param {Type} optionalParam - Optional parameter description
 * @returns {Type} Description of return value
 * @throws {Error} When something goes wrong
 */
export function functionName(paramName, optionalParam = null) {
  // Implementation
}
```

### Real Examples

```javascript
/**
 * Write .dd/template-manifest.json into outDir
 * @param {string} outDir - Output directory path
 * @param {object} data - Manifest data (templateId, flags, etc.)
 */
export function writeManifest(outDir, data) {
  // Implementation
}

/**
 * Return an array of absolute file paths under rootDir, recursively
 * @param {string} rootDir - Root directory to scan
 * @returns {string[]} Array of absolute file paths
 */
export function listTemplateFiles(rootDir) {
  // Implementation
}

/**
 * SHA256 hash of a file
 * @param {string} filePath - Path to file
 * @returns {string} Hex-encoded SHA256 hash
 */
export function sha256File(filePath) {
  // Implementation
}
```

### TypeScript Functions

```typescript
/**
 * Brief description
 */
export function functionName(
  param: ParamType,
  options?: OptionsType
): ReturnType {
  // Implementation
}
```

### Real Examples

```typescript
/**
 * Generate a unique project token
 */
export function generateToken(): string {
  return nanoid(12)
}

/**
 * Create project in database
 */
export async function createProject(
  input: CreateProjectInput
): Promise<Project> {
  // Implementation
}
```

---

## 2. Return Value Conventions

### Success Responses

#### Single Value

```javascript
// ✅ GOOD: Return the value directly
export function getName(user) {
  return user.name
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

#### Multiple Values - Use Objects

```javascript
// ✅ GOOD: Return object with named properties
export function validateMetadata(metadata) {
  return {
    valid: true,
    errors: [],
    warnings: []
  }
}

export function detectProvider(projectDir) {
  return {
    provider: "vercel",
    source: "vercel.json",
    confidence: "high"
  }
}
```

#### Optional Value

```javascript
// ✅ GOOD: Return null for missing values
export function findUser(id) {
  const user = database.get(id)
  return user || null  // Never return undefined
}

// ✅ GOOD: Return empty array for no results
export function searchTemplates(query) {
  const results = performSearch(query)
  return results.length > 0 ? results : []  // Never return null for arrays
}
```

### Error Handling

#### Throw for Unrecoverable Errors

```javascript
// ✅ GOOD: Throw when operation cannot continue
export function loadConfig(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`Config file not found: ${path}`)
  }

  const content = fs.readFileSync(path, "utf8")
  return JSON.parse(content)
}
```

#### Return Result Object for Recoverable Issues

```javascript
// ✅ GOOD: Return result object for validation
export function validateProject(project) {
  const errors = []

  if (!project.name) {
    errors.push("Project name is required")
  }

  if (!project.template) {
    errors.push("Template is required")
  }

  return {
    success: errors.length === 0,
    errors,
    data: project
  }
}
```

---

## 3. API Route Contracts (Next.js)

### HTTP Response Format

#### Success Response

```typescript
// ✅ GOOD: Success response structure
return Response.json(
  {
    success: true,
    data: { /* result data */ }
  },
  { status: 200 }
)

// With additional metadata
return Response.json(
  {
    success: true,
    data: project,
    token: "abc123",
    expiresAt: "2024-12-31T23:59:59Z"
  },
  { status: 200 }
)
```

#### Error Response

```typescript
// ✅ GOOD: Error response structure
return Response.json(
  {
    success: false,
    error: "Validation failed",
    message: "Human readable message",
    code: "VALIDATION_ERROR"  // Optional error code
  },
  { status: 400 }
)

// With details in development
return Response.json(
  {
    success: false,
    error: "Internal server error",
    message: "Failed to save project",
    details: process.env.NODE_ENV === "development" ? error.message : undefined
  },
  { status: 500 }
)
```

### Real Example

```typescript
export async function POST(request: NextRequest) {
  try {
    const body: CreateProjectInput = await request.json()

    // Validation
    if (!body.template) {
      return NextResponse.json(
        { error: "Validation failed", message: "Template is required" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Operation
    const { data, error } = await supabase
      .from("projects")
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Database error", message: "Failed to save project" },
        { status: 500, headers: corsHeaders }
      )
    }

    // Success
    return NextResponse.json(
      {
        success: true,
        token: data.token,
        project: data
      },
      { headers: corsHeaders }
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to process request" },
      { status: 500, headers: corsHeaders }
    )
  }
}
```

### Standard HTTP Status Codes

| Status | Meaning | When to Use |
|--------|---------|-------------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE or OPTIONS |
| 400 | Bad Request | Invalid input/validation failure |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not allowed |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 410 | Gone | Resource expired or deleted |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Unexpected server failure |

---

## 4. Module Export Patterns

### Single Responsibility - One Purpose Per Function

```javascript
// ✅ GOOD: Clear purpose for each function
// src/dd/manifest.mjs
export function writeManifest(projectDir, data) { }
export function readManifest(projectDir) { }
export function validateManifest(manifest) { }

// ❌ BAD: Mixed responsibilities
export function manifestStuff(action, ...args) {
  if (action === "write") { /* ... */ }
  if (action === "read") { /* ... */ }
  if (action === "validate") { /* ... */ }
}
```

### Grouping Related Functions

```javascript
// ✅ GOOD: Related functions in same module
// src/dd/logger.mjs
export function log(message) { }
export function error(message) { }
export function startStep(stepId, message) { }
export function endStep(stepId, message) { }
export function stepSuccess(message) { }
export function stepError(message) { }
export function setQuiet(quiet) { }
```

### Export Constants and Types

```javascript
// ✅ GOOD: Export reusable constants
export const HOOK_POINTS = {
  "pre:export": "Before template export starts",
  "post:export": "After template export completes",
  "pre:build": "Before build starts",
  "post:build": "After build completes"
}

export const TEMPLATE_IDS = ["saas", "blog", "seo-directory", "dashboard"]
```

---

## 5. Options Objects (3+ Parameters)

### When to Use Options Objects

Use options objects when a function has:
- 3 or more parameters
- Optional parameters
- Related configuration values

```javascript
// ❌ BAD: Too many positional parameters
export function exportTemplate(
  templateId,
  outputDir,
  includeIntegrations,
  skipPostInstall,
  force,
  dryRun,
  quiet
) { }

// ✅ GOOD: Options object
export function exportTemplate(templateId, outputDir, options = {}) {
  const {
    includeIntegrations = true,
    skipPostInstall = false,
    force = false,
    dryRun = false,
    quiet = false
  } = options

  // Implementation
}
```

### TypeScript Options Interface

```typescript
interface ExportOptions {
  template: string
  outputDir: string
  integrations?: Record<string, string>
  force?: boolean
  dryRun?: boolean
  quiet?: boolean
  skipPostInstall?: boolean
}

export function exportProject(options: ExportOptions): Promise<Result> {
  // Implementation
}
```

---

## 6. Async Patterns

### Always Use async/await

```javascript
// ✅ GOOD: Use async/await
export async function loadProject(path) {
  const content = await fs.promises.readFile(path, "utf8")
  return JSON.parse(content)
}

export async function fetchProjectData(token) {
  const response = await fetch(`${API_URL}/projects/${token}`)
  const data = await response.json()
  return data
}

// ❌ BAD: Don't use .then() chains
export function loadProject(path) {
  return fs.promises.readFile(path, "utf8")
    .then(content => JSON.parse(content))
}
```

### Sequential vs Parallel Operations

```javascript
// ✅ GOOD: Sequential when operations depend on each other
export async function deployProject(projectDir) {
  const config = await loadConfig(projectDir)
  const validated = await validateConfig(config)
  const deployed = await deploy(validated)
  return deployed
}

// ✅ GOOD: Parallel when operations are independent
export async function loadAllData(projectId) {
  const [project, templates, integrations] = await Promise.all([
    fetchProject(projectId),
    fetchTemplates(),
    fetchIntegrations()
  ])

  return { project, templates, integrations }
}
```

### Error Handling in Async Functions

```javascript
// ✅ GOOD: Let errors propagate for critical operations
export async function saveProject(data) {
  const result = await supabase
    .from("projects")
    .insert(data)
    .single()

  if (result.error) {
    throw new Error(`Failed to save project: ${result.error.message}`)
  }

  return result.data
}

// ✅ GOOD: Try/catch for recoverable operations
export async function fetchOptionalData(id) {
  try {
    const data = await fetch(`${API_URL}/data/${id}`)
    return await data.json()
  } catch (error) {
    console.warn(`Failed to fetch optional data: ${error.message}`)
    return null  // Graceful fallback
  }
}
```

---

## 7. Hook/Event Patterns

### Hook Interface

```javascript
/**
 * Hook Context - Passed to all hook functions
 */
interface HookContext {
  projectId: string
  projectDir: string
  templateId: string
  flags: Record<string, any>
  metadata?: any
}

/**
 * Hook Result - Returned by hook functions
 */
interface HookResult {
  success: boolean
  message?: string      // Optional message to display
  data?: any           // Optional data to pass to next hook
  skipNext?: boolean   // Stop hook chain if true
}

/**
 * Hook Function Type
 */
type HookFunction = (context: HookContext) => Promise<HookResult>
```

### Implementing a Hook

```javascript
// ✅ GOOD: Hook implementation
export async function postExportHook(context) {
  const { projectDir, templateId } = context

  try {
    // Do something after export
    await runCustomSetup(projectDir)

    return {
      success: true,
      message: "Custom setup completed"
    }
  } catch (error) {
    return {
      success: false,
      message: `Setup failed: ${error.message}`
    }
  }
}
```

### Executing Hooks

```javascript
/**
 * Execute hooks for a given hook point
 * @param {string} hookName - Hook point name (e.g., "post:export")
 * @param {HookContext} context - Context to pass to hooks
 * @returns {Promise<HookResult[]>} Results from all hooks
 */
export async function executeHooks(hookName, context) {
  const plugins = loadPluginRegistry(context.projectDir)
  const results = []

  for (const plugin of plugins.plugins) {
    if (!plugin.hooks || !plugin.hooks[hookName]) {
      continue
    }

    const hookFn = plugin.hooks[hookName]
    const result = await hookFn(context)
    results.push(result)

    // Stop if hook requests it
    if (result.skipNext) {
      break
    }
  }

  return results
}
```

### Available Hook Points

```javascript
export const HOOK_POINTS = {
  // Export lifecycle
  "pre:export": "Before template export starts",
  "post:export": "After template export completes",

  // Build lifecycle
  "pre:build": "Before build starts",
  "post:build": "After build completes",

  // Deploy lifecycle
  "pre:deploy": "Before deployment",
  "post:deploy": "After deployment",

  // Test lifecycle
  "pre:test": "Before tests run",
  "post:test": "After tests complete"
}
```

---

## 8. Error Message Format

### User-Facing Error Messages

```javascript
// ✅ GOOD: Descriptive error with recovery steps
throw new Error(
  `Could not find template: ${templateId}\n` +
  `\n` +
  `Available templates:\n` +
  `  - saas\n` +
  `  - blog\n` +
  `  - seo-directory\n` +
  `  - dashboard\n` +
  `\n` +
  `Usage: framework export <template> <directory>`
)

// ✅ GOOD: Error with recovery guidance
throw new Error(
  `No deployment provider detected\n` +
  `\n` +
  `To fix this:\n` +
  `  1. Specify provider explicitly: framework deploy --provider vercel\n` +
  `  2. Add a config file (vercel.json, netlify.toml, etc.)\n` +
  `  3. Set preference in .dd/config.json:\n` +
  `     { "deployment": { "provider": "vercel" } }\n` +
  `\n` +
  `For more help: https://docs.dawson.dev/deploy`
)
```

### Error Message Template

```javascript
throw new Error(
  `Brief description of what went wrong\n` +
  `\n` +
  `To fix this:\n` +
  `  1. First recovery step\n` +
  `  2. Second recovery step\n` +
  `  3. Alternative approach\n` +
  `\n` +
  `For more help: https://docs.dawson.dev/errors/ERROR_CODE`
)
```

### Validation Error Messages

```javascript
// ✅ GOOD: Clear validation messages
export function validateMetadata(metadata) {
  const errors = []

  if (!metadata.id) {
    errors.push("Missing required field: 'id'")
  }

  if (!metadata.name) {
    errors.push("Missing required field: 'name'")
  }

  if (metadata.tags && !Array.isArray(metadata.tags)) {
    errors.push("Field 'tags' must be an array")
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
```

### Using Recovery Guidance Module

```javascript
import { getRecoveryGuidance, printRecoveryGuidance } from "../dd/recovery-guidance.mjs"

try {
  await performOperation()
} catch (error) {
  console.error(`\n❌ Operation failed: ${error.message}\n`)
  printRecoveryGuidance(error)  // Prints contextual recovery steps
  process.exit(1)
}
```

---

## 9. Command Structure

### Command Function Pattern

```javascript
/**
 * Command: framework {commandName}
 * Description: What the command does
 * @param {string[]} args - Command arguments
 */
export async function cmdCommandName(args) {
  // 1. Parse arguments
  const flags = parseFlags(args)
  const [arg1, arg2] = args.filter(a => !a.startsWith("--"))

  // 2. Validate
  if (!arg1) {
    console.error("Usage: framework commandName <required-arg> [options]")
    console.error("\nOptions:")
    console.error("  --flag1    Description of flag1")
    console.error("  --flag2    Description of flag2")
    process.exit(1)
  }

  // 3. Execute with progress tracking
  logger.startStep("step1", "[1/3] Doing first thing...")
  await doFirstThing()
  logger.stepSuccess("First thing done")
  logger.endStep("step1", "     Complete")

  logger.startStep("step2", "[2/3] Doing second thing...")
  await doSecondThing()
  logger.stepSuccess("Second thing done")
  logger.endStep("step2", "     Complete")

  logger.startStep("step3", "[3/3] Doing final thing...")
  await doFinalThing()
  logger.stepSuccess("Final thing done")
  logger.endStep("step3", "     Complete")

  // 4. Output summary
  console.log("\n✅ Command completed successfully!\n")
}
```

### Real Example: Deploy Command

```javascript
export async function cmdDeploy(args) {
  // Handle help flag
  if (args.includes("--help") || args.includes("-h")) {
    printDeployHelp()
    return
  }

  const flags = parseDeployFlags(args)

  console.log("\n🚀 Framework Deploy\n")

  // Step 1: Provider detection
  console.log("🔍 Detecting deployment provider...")
  const provider = await detectProvider(flags)
  console.log(`   ✓ Detected: ${provider}`)

  // Step 2: Load provider
  console.log("\n📦 Loading provider...")
  const deployProvider = await loadProvider(provider)
  console.log(`   ✓ Provider loaded: ${deployProvider.name}`)

  // Step 3: Check credentials
  console.log("\n🔐 Checking credentials...")
  const credential = await getCredential(provider)
  console.log(`   ✓ Credentials found`)

  // Step 4: Deploy
  console.log("\n🚀 Deploying...")
  const result = await deployProvider.deploy(flags)
  console.log(`   ✓ Deployed to: ${result.url}`)

  console.log("\n✅ Deployment complete!\n")
}
```

### Flag Parsing

```javascript
/**
 * Parse command flags
 * @param {string[]} args - Command arguments
 * @returns {object} Parsed flags
 */
function parseFlags(args) {
  const flags = {
    force: false,
    dryRun: false,
    quiet: false,
    provider: null
  }

  for (const arg of args) {
    if (arg === "--force" || arg === "-f") {
      flags.force = true
    } else if (arg === "--dry-run") {
      flags.dryRun = true
    } else if (arg === "--quiet" || arg === "-q") {
      flags.quiet = true
    } else if (arg.startsWith("--provider=")) {
      flags.provider = arg.split("=")[1]
    }
  }

  return flags
}
```

---

## 10. Logging Patterns

### Using the Logger Module

```javascript
import * as logger from "../dd/logger.mjs"

// Basic logging
logger.log("Starting operation...")
logger.error("Something went wrong")

// Step tracking with timing
logger.startStep("export", "[1/3] Exporting template...")
await performExport()
logger.stepSuccess("Template exported")
logger.endStep("export", "     Complete")  // Shows elapsed time

// Status messages
logger.stepSuccess("Operation succeeded")
logger.stepWarning("This might be an issue")
logger.stepInfo("Additional information")
logger.stepError("Operation failed")

// Quiet mode (suppress non-error output)
logger.setQuiet(true)
logger.log("This won't show")
logger.error("This will still show")
logger.setQuiet(false)

// Format step headers
const header = logger.formatStep(2, 5, "Processing templates")
// Returns: "[2/5] Processing templates"
```

### Progress Indicators

```javascript
// ✅ GOOD: Show progress for multi-step operations
async function exportTemplate(templateId, outputDir) {
  console.log(`\n📦 Exporting ${templateId} to ${outputDir}\n`)

  logger.startStep("validate", "[1/4] Validating template...")
  await validateTemplate(templateId)
  logger.stepSuccess("Template validated")
  logger.endStep("validate", "     Complete")

  logger.startStep("clone", "[2/4] Cloning template...")
  await cloneTemplate(templateId, outputDir)
  logger.stepSuccess("Template cloned")
  logger.endStep("clone", "     Complete")

  logger.startStep("integrate", "[3/4] Applying integrations...")
  await applyIntegrations(outputDir)
  logger.stepSuccess("Integrations applied")
  logger.endStep("integrate", "     Complete")

  logger.startStep("manifest", "[4/4] Writing manifest...")
  await writeManifest(outputDir)
  logger.stepSuccess("Manifest written")
  logger.endStep("manifest", "     Complete")

  console.log("\n✅ Export complete!\n")
}
```

---

## 11. Type Definitions

### Shared Types (TypeScript)

```typescript
// types.ts - Shared types across modules

export interface Project {
  id: string
  token: string
  template: string
  project_name: string
  output_dir: string
  integrations: Record<string, string>
  env_keys: Record<string, string>
  created_at: string
  expires_at: string
}

export interface Template {
  id: string
  name: string
  version: string
  description: string
  tags: string[]
  capabilities: string[]
}

export interface Integration {
  provider: string
  type: string
  version: string
  dependencies: Record<string, string>
  devDependencies?: Record<string, string>
  envVars: string[]
  files: Record<string, string[]>
}

export interface DeploymentResult {
  success: boolean
  url?: string
  error?: string
  logs?: string[]
}
```

### Using Shared Types

```typescript
import type { Project, Template, Integration } from "./types"

export async function loadProject(token: string): Promise<Project> {
  // Implementation
}

export function validateTemplate(template: Template): boolean {
  // Implementation
}
```

### JSDoc for JavaScript

```javascript
/**
 * @typedef {Object} ProjectData
 * @property {string} id - Project identifier
 * @property {string} template - Template ID
 * @property {Object<string, string>} integrations - Integration config
 */

/**
 * Load project data
 * @param {string} token - Project token
 * @returns {Promise<ProjectData>} Project data
 */
export async function loadProject(token) {
  // Implementation
}
```

---

## 12. Validation Patterns

### Input Validation

```javascript
// ✅ GOOD: Validate early, fail fast
export function validateExportArgs(templateId, outputDir) {
  const errors = []

  if (!templateId || typeof templateId !== "string") {
    errors.push("Template ID is required (string)")
  }

  if (!outputDir || typeof outputDir !== "string") {
    errors.push("Output directory is required (string)")
  }

  if (outputDir && path.isAbsolute(outputDir) && !fs.existsSync(path.dirname(outputDir))) {
    errors.push(`Parent directory does not exist: ${path.dirname(outputDir)}`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
```

### Schema Validation

```javascript
// ✅ GOOD: Define schema and validate
const TEMPLATE_SCHEMA = {
  required: ["id", "name", "version"],
  properties: {
    id: { type: "string", pattern: /^[a-z0-9-]+$/ },
    name: { type: "string", minLength: 1 },
    version: { type: "string", pattern: /^\d+\.\d+\.\d+$/ },
    tags: { type: "array", items: { type: "string" } }
  }
}

export function validateTemplate(template) {
  const errors = []

  // Check required fields
  for (const field of TEMPLATE_SCHEMA.required) {
    if (!(field in template)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  // Validate field types and patterns
  for (const [key, schema] of Object.entries(TEMPLATE_SCHEMA.properties)) {
    if (key in template) {
      const value = template[key]

      if (schema.type === "string" && typeof value !== "string") {
        errors.push(`Field '${key}' must be a string`)
      }

      if (schema.pattern && !schema.pattern.test(value)) {
        errors.push(`Field '${key}' has invalid format`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
```

---

## Summary

### Function Signatures
- Use JSDoc comments for JavaScript (.mjs)
- Use TypeScript types for TypeScript (.ts)
- Document parameters, return values, and thrown errors

### Return Values
- Return single values directly
- Use objects for multiple values
- Return `null` for missing values (not `undefined`)
- Return empty arrays instead of `null` for collections

### API Routes
- Use consistent response format: `{ success, data/error, message }`
- Use standard HTTP status codes
- Include CORS headers for CLI access
- Hide sensitive details in production

### Module Exports
- One clear purpose per function
- Group related functions in same module
- Export constants and types
- Use options objects for 3+ parameters

### Async Patterns
- Always use `async/await` (never `.then()`)
- Parallel operations use `Promise.all()`
- Sequential operations use `await` in sequence
- Let critical errors propagate

### Hooks/Events
- Follow `HookContext` → `HookResult` contract
- Support `skipNext` for stopping hook chains
- Document available hook points

### Error Messages
- Include description of problem
- Provide recovery steps
- Link to documentation when available

### Commands
- Parse → Validate → Execute → Output
- Use logger for progress tracking
- Handle `--help` flag
- Show clear success/failure messages

---

*For testing these contracts, see TESTING_STANDARDS.md*
