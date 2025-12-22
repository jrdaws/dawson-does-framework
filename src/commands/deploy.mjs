/**
 * Deploy Command
 * Usage: framework deploy [options]
 *        framework deploy:auth <command>
 */

import path from 'path';
import { CredentialStore } from '../dd/credentials.mjs';
import { detectDeploymentProvider, detectProjectType } from '../dd/deployment-detector.mjs';

/**
 * Main deploy command handler
 * @param {string[]} args - Command arguments
 */
export async function cmdDeploy(args) {
  const flags = parseDeployFlags(args);

  console.log("\n🚀 Framework Deploy\n");

  // Step 1: Provider detection
  console.log("🔍 Detecting deployment provider...");

  let provider = flags.provider;
  if (!provider) {
    const detection = await detectDeploymentProvider(flags.cwd);
    if (detection) {
      provider = detection.provider;
      console.log(`   ✓ Detected: ${provider} (from ${detection.source})`);
    } else {
      console.log("   No provider detected");
      console.log("\n❌ Could not detect deployment provider.");
      console.log("\n💡 Solutions:");
      console.log("   1. Specify provider explicitly: framework deploy --provider vercel");
      console.log("   2. Add a config file:");
      console.log("      - vercel.json for Vercel");
      console.log("      - netlify.toml for Netlify");
      console.log("      - railway.json for Railway");
      console.log("   3. Or set explicit preference in .dd/config.json:\n");
      console.log('      { "deployment": { "provider": "vercel" } }');
      console.log("");
      process.exit(1);
    }
  }

  // Step 2: Load provider implementation
  console.log("\n📦 Loading provider...");
  let deployProvider;
  try {
    deployProvider = await loadProvider(provider);
    console.log(`   ✓ Provider loaded: ${deployProvider.name}`);
  } catch (error) {
    console.error(`\n❌ Failed to load provider: ${error.message}`);
    process.exit(1);
  }

  // Step 3: Check credentials
  console.log("\n🔐 Checking credentials...");
  const credStore = new CredentialStore();
  const credential = await credStore.getCredential(provider);

  if (!credential) {
    console.log(`\n❌ No ${provider.toUpperCase()} credentials found.\n`);
    printSetupGuide(provider);
    process.exit(1);
  }

  console.log(`   ✓ Credentials found (source: ${credential.source})`);

  // Step 4: Validate credentials
  console.log("   Validating...");
  const validation = await deployProvider.validateCredentials();
  if (!validation.valid) {
    console.error(`\n❌ Invalid credentials: ${validation.error}`);
    printSetupGuide(provider);
    process.exit(1);
  }
  console.log("   ✓ Credentials valid");

  // Step 5: Project detection
  console.log("\n📦 Detecting project...");
  const projectInfo = await deployProvider.detectProject(flags.cwd);
  const projectType = detectProjectType(flags.cwd);

  if (projectInfo.detected) {
    console.log(`   Project: ${projectInfo.projectName || projectInfo.projectId}`);
  }
  console.log(`   Framework: ${projectType.framework || 'static'}`);
  console.log(`   Build command: ${projectType.buildCommand || 'none'}`);

  // Step 6: Dry run preview
  if (flags.dryRun) {
    printDryRunPreview(provider, flags, projectInfo, projectType);
    return;
  }

  // Step 7: Deploy
  console.log(`\n🚀 Deploying to ${provider}${flags.prod ? ' (production)' : ' (preview)'}...\n`);

  const deployConfig = {
    cwd: flags.cwd,
    production: flags.prod,
    environment: flags.env,
    projectId: projectInfo.projectId,
    projectName: projectInfo.projectName || path.basename(flags.cwd),
    buildCommand: projectType.buildCommand
  };

  let result;
  try {
    result = await deployProvider.deploy(deployConfig);
  } catch (error) {
    console.error(`\n❌ Deployment failed: ${error.message}`);
    if (error.suggestions && error.suggestions.length > 0) {
      console.log("\n💡 Suggestions:");
      error.suggestions.forEach(s => console.log(`   • ${s}`));
    }
    process.exit(1);
  }

  console.log(`   ✓ Deployment created: ${result.deploymentId}`);

  // Step 8: Stream logs
  if (flags.logs && result.status !== 'ready') {
    console.log("\n📋 Build logs:\n");
    try {
      await deployProvider.streamLogs(result.deploymentId, (log) => {
        console.log(`   ${log}`);
      });
    } catch (error) {
      console.log(`\n⚠️  Could not stream logs: ${error.message}`);
    }
  }

  // Step 9: Wait for ready
  console.log("\n⏳ Waiting for deployment...");
  const status = await waitForDeployment(deployProvider, result.deploymentId);

  if (status.state === 'ready') {
    console.log(`\n✅ Deployment successful!\n`);
    console.log(`   URL: ${status.url || result.url}`);
    if (status.buildTime) {
      console.log(`   Build time: ${Math.round(status.buildTime / 1000)}s`);
    }
    console.log("");
  } else {
    console.error(`\n❌ Deployment failed: ${status.error || 'Unknown error'}`);
    process.exit(1);
  }

  // Update usage tracking
  await credStore.markUsed(provider);
}

/**
 * Deploy credential management command
 * @param {string[]} args - Command arguments
 */
export async function cmdDeployAuth(args) {
  const [action, provider, token] = args;
  const credStore = new CredentialStore();

  if (!action || action === 'help') {
    console.log(`
Usage: framework deploy:auth <command>

Commands:
  save <provider> <token>   Save deployment credentials
  list                      List saved credentials
  remove <provider>         Remove credentials
  test <provider>          Test credentials

Providers:
  vercel, netlify, railway

Examples:
  framework deploy:auth save vercel YOUR_TOKEN
  framework deploy:auth list
  framework deploy:auth remove netlify
  framework deploy:auth test vercel
`);
    return;
  }

  if (action === 'save') {
    if (!provider || !token) {
      console.error("❌ Usage: framework deploy:auth save <provider> <token>");
      process.exit(1);
    }
    await credStore.saveCredential(provider, token);
    console.log(`✅ Credentials saved for ${provider}`);
    return;
  }

  if (action === 'list') {
    const creds = await credStore.listCredentials();
    if (Object.keys(creds.credentials).length === 0) {
      console.log("\n📋 No saved credentials.\n");
      console.log("Save credentials with:");
      console.log("  framework deploy:auth save <provider> <token>\n");
      return;
    }

    console.log("\n📋 Saved credentials:\n");
    for (const [prov, data] of Object.entries(creds.credentials)) {
      console.log(`   ${prov}:`);
      console.log(`     Created: ${new Date(data.createdAt).toLocaleDateString()}`);
      console.log(`     Last used: ${new Date(data.lastUsed).toLocaleDateString()}`);
      console.log(`     Token: ${data.token.substring(0, 10)}...`);
      console.log("");
    }
    return;
  }

  if (action === 'remove') {
    if (!provider) {
      console.error("❌ Usage: framework deploy:auth remove <provider>");
      process.exit(1);
    }
    await credStore.removeCredential(provider);
    console.log(`✅ Credentials removed for ${provider}`);
    return;
  }

  if (action === 'test') {
    if (!provider) {
      console.error("❌ Usage: framework deploy:auth test <provider>");
      process.exit(1);
    }

    const cred = await credStore.getCredential(provider);
    if (!cred) {
      console.log(`❌ No credentials found for ${provider}`);
      printSetupGuide(provider);
      return;
    }

    console.log(`\n🧪 Testing ${provider} credentials...\n`);

    try {
      const deployProvider = await loadProvider(provider);
      const validation = await deployProvider.validateCredentials();

      if (validation.valid) {
        console.log(`✅ Credentials valid for ${provider}`);
        console.log(`   Source: ${cred.source}`);
      } else {
        console.log(`❌ Credentials invalid: ${validation.error}`);
      }
    } catch (error) {
      console.error(`❌ Test failed: ${error.message}`);
    }

    return;
  }

  console.error(`❌ Unknown command: ${action}`);
  console.log("Run 'framework deploy:auth help' for usage");
  process.exit(1);
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
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--prod") {
      flags.prod = true;
    } else if (arg === "--provider" && args[i + 1]) {
      flags.provider = args[++i];
    } else if (arg === "--no-logs") {
      flags.logs = false;
    } else if (arg === "--env" && args[i + 1]) {
      flags.env = args[++i];
    } else if (arg === "--dry-run") {
      flags.dryRun = true;
    }
  }

  return flags;
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
  };

  if (!providers[providerName]) {
    throw new Error(`Unknown provider: ${providerName}. Supported: vercel, netlify, railway`);
  }

  const module = await providers[providerName]();
  return module.default;
}

/**
 * Print setup guide for a provider
 * @param {string} provider - Provider name
 */
function printSetupGuide(provider) {
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
  };

  console.log(guides[provider] || "Setup guide not available");
}

/**
 * Wait for deployment to complete
 * @param {object} provider - Deploy provider
 * @param {string} deploymentId - Deployment ID
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<object>} Deployment status
 */
async function waitForDeployment(provider, deploymentId, timeout = 300000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const status = await provider.getDeploymentStatus(deploymentId);

    if (status.state === 'ready' || status.state === 'error') {
      return status;
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  throw new Error("Deployment timeout (5 minutes)");
}

/**
 * Print dry run preview
 * @param {string} provider - Provider name
 * @param {object} flags - Command flags
 * @param {object} projectInfo - Project info
 * @param {object} projectType - Project type
 */
function printDryRunPreview(provider, flags, projectInfo, projectType) {
  console.log("\n📋 DRY RUN - Deployment Preview\n");
  console.log(`Provider: ${provider}`);
  console.log(`Mode: ${flags.prod ? 'production' : 'preview'}`);
  console.log(`Project: ${projectInfo.projectName || 'auto-detected'}`);
  console.log(`Framework: ${projectType.framework || 'static'}`);
  console.log(`Build command: ${projectType.buildCommand || 'none'}`);
  console.log("");
  console.log("Actions that would be performed:");
  console.log("  1. Validate credentials");
  console.log("  2. Prepare files for deployment");
  console.log("  3. Upload to provider");
  console.log("  4. Trigger build");
  console.log("  5. Stream build logs");
  console.log("  6. Wait for deployment to be ready");
  console.log("  7. Return live URL");
  console.log("");
  console.log("Run without --dry-run to deploy");
}
