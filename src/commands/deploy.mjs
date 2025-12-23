/**
 * Deploy Command
 * Usage: framework deploy [options]
 *        framework deploy:auth <command>
 */

import path from 'path'
import { CredentialStore } from '../dd/credentials.mjs'
import { detectDeploymentProvider, detectProjectType } from '../dd/deployment-detector.mjs'
import { showError } from '../dd/logger.mjs'

/**
 * Main deploy command handler
 * @param {string[]} args - Command arguments
 */
export async function cmdDeploy(args) {
  // Handle help flag FIRST, before any other processing
  const firstArg = args[0]
  if (firstArg === "--help" || firstArg === "-h" || firstArg === "help") {
    console.log(`Usage: framework deploy [options]

Deploy your project to a hosting provider.

Options:
  --provider <name>   Specify deployment provider (vercel, netlify, railway)
  --prod              Deploy to production (default: preview)
  --env <name>        Environment name
  --no-logs           Don't stream build logs
  --dry-run           Preview deployment without making changes

Supported Providers:
  vercel              Vercel (https://vercel.com)
  netlify             Netlify (https://netlify.com)
  railway             Railway (https://railway.app)

Auto-Detection:
  The provider is auto-detected from config files:
  - vercel.json → Vercel
  - netlify.toml → Netlify
  - railway.json → Railway
  - .dd/config.json → Explicit preference

Examples:
  framework deploy                    # Auto-detect provider, preview deploy
  framework deploy --prod             # Deploy to production
  framework deploy --provider vercel  # Specify provider explicitly
  framework deploy --dry-run          # Preview without deploying

Credential Management:
  framework deploy:auth save <provider> <token>   Save credentials
  framework deploy:auth list                      List saved credentials
  framework deploy:auth test <provider>           Test credentials
  framework deploy:auth --help                    More credential commands
`)
    return
  }

  const flags = parseDeployFlags(args)

  console.log("\n🚀 Framework Deploy\n")

  // Step 1: Provider detection
  console.log("🔍 Detecting deployment provider...")

  let provider = flags.provider
  if (!provider) {
    const detection = await detectDeploymentProvider(flags.cwd)
    if (detection) {
      provider = detection.provider
      console.log(`   ✓ Detected: ${provider} (from ${detection.source})`)
    } else {
      console.log("   No provider detected")
      showError('Could not detect deployment provider', {
        reasons: [
          'No provider config file found (vercel.json, netlify.toml, railway.json)',
          'No explicit preference set in .dd/config.json'
        ],
        solutions: [
          'Specify provider explicitly: framework deploy --provider vercel',
          'Add a config file: vercel.json, netlify.toml, or railway.json',
          'Set preference in .dd/config.json: { "deployment": { "provider": "vercel" } }',
          'Run framework deploy --help for more options'
        ]
      })
    }
  }

  // Step 2: Load provider implementation
  console.log("\n📦 Loading provider...")
  let deployProvider
  try {
    deployProvider = await loadProvider(provider)
    console.log(`   ✓ Provider loaded: ${deployProvider.name}`)
  } catch (err) {
    showError(`Failed to load provider: ${err.message}`, {
      reasons: [
        `Provider "${provider}" may not be supported`,
        'Provider module may have errors'
      ],
      solutions: [
        'Use a supported provider: vercel, netlify, railway',
        'Run framework deploy --help to see available providers'
      ]
    })
  }

  // Step 3: Check credentials
  console.log("\n🔐 Checking credentials...")
  const credStore = new CredentialStore()
  const credential = await credStore.getCredential(provider)

  if (!credential) {
    showError(`No ${provider.toUpperCase()} credentials found`, {
      reasons: [
        `No saved token for ${provider}`,
        `Environment variable not set (e.g., ${provider.toUpperCase()}_TOKEN)`
      ],
      solutions: [
        `Save credentials: framework deploy:auth save ${provider} YOUR_TOKEN`,
        `Or set environment variable: export ${provider.toUpperCase()}_TOKEN=YOUR_TOKEN`,
        `Get your token from the ${provider} dashboard`
      ]
    })
  }

  console.log(`   ✓ Credentials found (source: ${credential.source})`)

  // Step 4: Validate credentials
  console.log("   Validating...")
  const validation = await deployProvider.validateCredentials()
  if (!validation.valid) {
    showError(`Invalid ${provider} credentials: ${validation.error}`, {
      reasons: [
        'Token may be expired or revoked',
        'Token may not have required permissions'
      ],
      solutions: [
        `Get a new token from ${provider} dashboard`,
        `Update credentials: framework deploy:auth save ${provider} NEW_TOKEN`,
        `Test credentials: framework deploy:auth test ${provider}`
      ]
    })
  }
  console.log("   ✓ Credentials valid")

  // Step 5: Project detection
  console.log("\n📦 Detecting project...")
  const projectInfo = await deployProvider.detectProject(flags.cwd)
  const projectType = detectProjectType(flags.cwd)

  if (projectInfo.detected) {
    console.log(`   Project: ${projectInfo.projectName || projectInfo.projectId}`)
  }
  console.log(`   Framework: ${projectType.framework || 'static'}`)
  console.log(`   Build command: ${projectType.buildCommand || 'none'}`)

  // Step 6: Dry run preview
  if (flags.dryRun) {
    printDryRunPreview(provider, flags, projectInfo, projectType)
    return
  }

  // Step 7: Deploy
  console.log(`\n🚀 Deploying to ${provider}${flags.prod ? ' (production)' : ' (preview)'}...\n`)

  const deployConfig = {
    cwd: flags.cwd,
    production: flags.prod,
    environment: flags.env,
    projectId: projectInfo.projectId,
    projectName: projectInfo.projectName || path.basename(flags.cwd),
    buildCommand: projectType.buildCommand
  }

  let result
  try {
    result = await deployProvider.deploy(deployConfig)
  } catch (err) {
    showError(`Deployment failed: ${err.message}`, {
      reasons: [
        'Build may have failed',
        'Project configuration may be invalid',
        'Provider API may be unavailable'
      ],
      solutions: err.suggestions && err.suggestions.length > 0
        ? err.suggestions
        : [
            'Check your build configuration',
            'Verify project files are valid',
            `Check ${provider} status page for outages`,
            'Run framework deploy --dry-run to preview'
          ]
    })
  }

  console.log(`   ✓ Deployment created: ${result.deploymentId}`)

  // Step 8: Stream logs
  if (flags.logs && result.status !== 'ready') {
    console.log("\n📋 Build logs:\n")
    try {
      await deployProvider.streamLogs(result.deploymentId, (log) => {
        console.log(`   ${log}`)
      })
    } catch (logErr) {
      console.log(`\n⚠️  Could not stream logs: ${logErr.message}`)
    }
  }

  // Step 9: Wait for ready
  console.log("\n⏳ Waiting for deployment...")
  const status = await waitForDeployment(deployProvider, result.deploymentId)

  if (status.state === 'ready') {
    console.log(`\n✅ Deployment successful!\n`)
    console.log(`   URL: ${status.url || result.url}`)
    if (status.buildTime) {
      console.log(`   Build time: ${Math.round(status.buildTime / 1000)}s`)
    }
    console.log("")
  } else {
    showError(`Deployment failed: ${status.error || 'Unknown error'}`, {
      reasons: [
        'Build process may have encountered errors',
        'Deployment timed out'
      ],
      solutions: [
        'Check the build logs for specific errors',
        `View deployment details in ${provider} dashboard`,
        'Verify your project builds locally: npm run build'
      ]
    })
  }

  // Update usage tracking
  await credStore.markUsed(provider)
}

/**
 * Deploy credential management command
 * @param {string[]} args - Command arguments
 */
export async function cmdDeployAuth(args) {
  const [action, authProvider, authToken] = args
  const credStore = new CredentialStore()

  // Handle help flag (--help, -h, help)
  if (!action || action === 'help' || action === '--help' || action === '-h') {
    console.log(`Usage: framework deploy:auth <command>

Commands:
  save <provider> <token>   Save deployment credentials
  list                      List saved credentials
  remove <provider>         Remove credentials
  test <provider>           Test credentials

Providers:
  vercel, netlify, railway

Examples:
  framework deploy:auth save vercel YOUR_TOKEN
  framework deploy:auth list
  framework deploy:auth remove netlify
  framework deploy:auth test vercel
`)
    return
  }

  if (action === 'save') {
    if (!authProvider || !authToken) {
      showError('Missing required arguments', {
        solutions: [
          'Usage: framework deploy:auth save <provider> <token>',
          'Example: framework deploy:auth save vercel YOUR_TOKEN'
        ]
      })
    }
    await credStore.saveCredential(authProvider, authToken)
    console.log(`✅ Credentials saved for ${authProvider}`)
    return
  }

  if (action === 'list') {
    const creds = await credStore.listCredentials()
    if (Object.keys(creds.credentials).length === 0) {
      console.log("\n📋 No saved credentials.\n")
      console.log("Save credentials with:")
      console.log("  framework deploy:auth save <provider> <token>\n")
      return
    }

    console.log("\n📋 Saved credentials:\n")
    for (const [prov, data] of Object.entries(creds.credentials)) {
      console.log(`   ${prov}:`)
      console.log(`     Created: ${new Date(data.createdAt).toLocaleDateString()}`)
      console.log(`     Last used: ${new Date(data.lastUsed).toLocaleDateString()}`)
      console.log(`     Token: ${data.token.substring(0, 10)}...`)
      console.log("")
    }
    return
  }

  if (action === 'remove') {
    if (!authProvider) {
      showError('Missing provider argument', {
        solutions: [
          'Usage: framework deploy:auth remove <provider>',
          'Example: framework deploy:auth remove netlify'
        ]
      })
    }
    await credStore.removeCredential(authProvider)
    console.log(`✅ Credentials removed for ${authProvider}`)
    return
  }

  if (action === 'test') {
    if (!authProvider) {
      showError('Missing provider argument', {
        solutions: [
          'Usage: framework deploy:auth test <provider>',
          'Example: framework deploy:auth test vercel'
        ]
      })
    }

    const cred = await credStore.getCredential(authProvider)
    if (!cred) {
      console.log(`❌ No credentials found for ${authProvider}`)
      printSetupGuide(authProvider)
      return
    }

    console.log(`\n🧪 Testing ${authProvider} credentials...\n`)

    try {
      const testProvider = await loadProvider(authProvider)
      const validation = await testProvider.validateCredentials()

      if (validation.valid) {
        console.log(`✅ Credentials valid for ${authProvider}`)
        console.log(`   Source: ${cred.source}`)
      } else {
        console.log(`❌ Credentials invalid: ${validation.error}`)
      }
    } catch (testErr) {
      console.error(`❌ Test failed: ${testErr.message}`)
    }

    return
  }

  showError(`Unknown command: ${action}`, {
    solutions: [
      "Run 'framework deploy:auth --help' for usage",
      'Valid commands: save, list, remove, test'
    ]
  })
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse deploy command flags
 * @param {string[]} args - Command arguments
 * @returns {object} Parsed flags
 */
function parseDeployFlags(args) {
  const flags = {
    prod: false,
    provider: null,
    logs: true,
    env: null,
    dryRun: false,
    cwd: process.cwd()
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === "--prod") {
      flags.prod = true
    } else if (arg === "--provider" && args[i + 1]) {
      flags.provider = args[++i]
    } else if (arg === "--no-logs") {
      flags.logs = false
    } else if (arg === "--env" && args[i + 1]) {
      flags.env = args[++i]
    } else if (arg === "--dry-run") {
      flags.dryRun = true
    }
  }

  return flags
}

/**
 * Load provider implementation
 * @param {string} providerName - Provider name
 * @returns {Promise<object>} Provider implementation
 */
async function loadProvider(providerName) {
  const providers = {
    'vercel': () => import('../platform/providers/impl/deploy.vercel.ts'),
    'netlify': () => import('../platform/providers/impl/deploy.netlify.ts'),
    'railway': () => import('../platform/providers/impl/deploy.railway.ts')
  }

  if (!providers[providerName]) {
    throw new Error(`Unknown provider: ${providerName}. Supported: vercel, netlify, railway`)
  }

  const mod = await providers[providerName]()
  return mod.default
}

/**
 * Print setup guide for a provider
 * @param {string} guideProvider - Provider name
 */
function printSetupGuide(guideProvider) {
  const guides = {
    vercel: `
📖 Vercel Setup Guide

1. Get your token:
   https://vercel.com/account/tokens

2. Save it:
   framework deploy:auth save vercel YOUR_TOKEN

   Or set environment variable:
   export VERCEL_TOKEN=YOUR_TOKEN

3. Try deploying again:
   framework deploy
`,
    netlify: `
📖 Netlify Setup Guide

1. Get your token:
   https://app.netlify.com/user/applications

2. Save it:
   framework deploy:auth save netlify YOUR_TOKEN

   Or set environment variable:
   export NETLIFY_TOKEN=YOUR_TOKEN

3. Try deploying again:
   framework deploy
`,
    railway: `
📖 Railway Setup Guide

1. Get your token:
   https://railway.app/account/tokens

2. Save it:
   framework deploy:auth save railway YOUR_TOKEN

   Or set environment variable:
   export RAILWAY_TOKEN=YOUR_TOKEN

3. Try deploying again:
   framework deploy
`
  }

  console.log(guides[guideProvider] || "Setup guide not available")
}

/**
 * Wait for deployment to complete
 * @param {object} deployProvider - Deploy provider
 * @param {string} deploymentId - Deployment ID
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<object>} Deployment status
 */
async function waitForDeployment(deployProvider, deploymentId, timeout = 300000) {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const deployStatus = await deployProvider.getDeploymentStatus(deploymentId)

    if (deployStatus.state === 'ready' || deployStatus.state === 'error') {
      return deployStatus
    }

    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  throw new Error("Deployment timeout (5 minutes)")
}

/**
 * Print dry run preview
 * @param {string} previewProvider - Provider name
 * @param {object} previewFlags - Command flags
 * @param {object} projectInfo - Project info
 * @param {object} projectType - Project type
 */
function printDryRunPreview(previewProvider, previewFlags, projectInfo, projectType) {
  console.log("\n📋 DRY RUN - Deployment Preview\n")
  console.log(`Provider: ${previewProvider}`)
  console.log(`Mode: ${previewFlags.prod ? 'production' : 'preview'}`)
  console.log(`Project: ${projectInfo.projectName || 'auto-detected'}`)
  console.log(`Framework: ${projectType.framework || 'static'}`)
  console.log(`Build command: ${projectType.buildCommand || 'none'}`)
  console.log("")
  console.log("Actions that would be performed:")
  console.log("  1. Validate credentials")
  console.log("  2. Prepare files for deployment")
  console.log("  3. Upload to provider")
  console.log("  4. Trigger build")
  console.log("  5. Stream build logs")
  console.log("  6. Wait for deployment to be ready")
  console.log("  7. Return live URL")
  console.log("")
  console.log("Run without --dry-run to deploy")
}
