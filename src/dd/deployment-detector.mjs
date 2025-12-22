import fs from 'fs-extra';
import path from 'path';

/**
 * Detect deployment provider from project configuration
 * @param {string} cwd - Current working directory
 * @returns {Promise<{provider: string, source: string, confidence: string} | null>}
 */
export async function detectDeploymentProvider(cwd) {
  // 1. Check .dd/config.json for explicit preference
  const ddConfig = path.join(cwd, '.dd', 'config.json');
  if (await fs.pathExists(ddConfig)) {
    try {
      const config = await fs.readJson(ddConfig);
      if (config.deployment?.provider) {
        return {
          provider: config.deployment.provider,
          source: '.dd/config.json',
          confidence: 'explicit'
        };
      }
    } catch {
      // Ignore parse errors
    }
  }

  // 2. Check for provider-specific config files
  const detections = [
    { files: ['vercel.json', '.vercel/project.json'], provider: 'vercel' },
    { files: ['netlify.toml', '.netlify/state.json'], provider: 'netlify' },
    { files: ['railway.json', 'railway.toml'], provider: 'railway' }
  ];

  for (const { files, provider } of detections) {
    for (const file of files) {
      if (await fs.pathExists(path.join(cwd, file))) {
        return { provider, source: file, confidence: 'high' };
      }
    }
  }

  // 3. Check package.json scripts
  const pkgPath = path.join(cwd, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    try {
      const pkg = await fs.readJson(pkgPath);
      if (pkg.scripts) {
        if (pkg.scripts.vercel || pkg.scripts['deploy:vercel']) {
          return { provider: 'vercel', source: 'package.json', confidence: 'medium' };
        }
        if (pkg.scripts.netlify || pkg.scripts['deploy:netlify']) {
          return { provider: 'netlify', source: 'package.json', confidence: 'medium' };
        }
        if (pkg.scripts.railway || pkg.scripts['deploy:railway']) {
          return { provider: 'railway', source: 'package.json', confidence: 'medium' };
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  return null;
}

/**
 * Detect project type and framework
 * @param {string} cwd - Current working directory
 * @returns {{type: string, framework: string|null, buildCommand: string|null}}
 */
export function detectProjectType(cwd) {
  const pkgPath = path.join(cwd, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    return { type: 'static', framework: null, buildCommand: null };
  }

  try {
    const pkg = fs.readJsonSync(pkgPath);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    // Check for frameworks in order of specificity
    if (deps.next) {
      return {
        type: 'nextjs',
        framework: 'nextjs',
        buildCommand: 'npm run build'
      };
    }

    if (deps.vite) {
      return {
        type: 'vite',
        framework: 'vite',
        buildCommand: 'npm run build'
      };
    }

    if (deps['react-scripts']) {
      return {
        type: 'cra',
        framework: 'create-react-app',
        buildCommand: 'npm run build'
      };
    }

    if (deps['@sveltejs/kit']) {
      return {
        type: 'sveltekit',
        framework: 'svelte-kit',
        buildCommand: 'npm run build'
      };
    }

    if (deps.nuxt) {
      return {
        type: 'nuxt',
        framework: 'nuxt',
        buildCommand: 'npm run build'
      };
    }

    // Has package.json but no recognized framework
    if (pkg.scripts?.build) {
      return {
        type: 'nodejs',
        framework: null,
        buildCommand: 'npm run build'
      };
    }

    return { type: 'static', framework: null, buildCommand: null };
  } catch {
    return { type: 'static', framework: null, buildCommand: null };
  }
}

/**
 * Get build output directory for a project type
 * @param {string} type - Project type
 * @param {string} cwd - Current working directory
 * @returns {string}
 */
export function getOutputDirectory(type, cwd) {
  const outputDirs = {
    nextjs: '.next',
    vite: 'dist',
    cra: 'build',
    sveltekit: 'build',
    nuxt: '.output',
    nodejs: 'dist',
    static: '.'
  };

  return outputDirs[type] || 'dist';
}
