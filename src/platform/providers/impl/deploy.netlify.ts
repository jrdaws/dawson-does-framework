/**
 * Netlify Deployment Provider
 * API Documentation: https://docs.netlify.com/api/get-started/
 */

import fs from 'fs-extra';
import path from 'path';
import type {
  DeployProvider,
  DeployConfig,
  DeployResult,
  DeploymentStatus,
  ProjectDetection
} from '../deploy';
import type { ProviderHealth } from '../types';

const NETLIFY_API = 'https://api.netlify.com/api/v1';

class NetlifyDeploymentError extends Error {
  readonly code: string;
  readonly provider = 'netlify';
  readonly suggestions: string[];
  readonly statusCode?: number;

  constructor(message: string, code: string, suggestions: string[] = [], statusCode?: number) {
    super(message);
    this.name = 'NetlifyDeploymentError';
    this.code = code;
    this.suggestions = suggestions;
    this.statusCode = statusCode;
  }
}

/**
 * Get Netlify API token
 */
function getToken(): string {
  const token = process.env.NETLIFY_TOKEN;
  if (!token) {
    throw new NetlifyDeploymentError(
      'NETLIFY_TOKEN not found',
      'missing_token',
      [
        'Set NETLIFY_TOKEN environment variable',
        'Or run: framework deploy:auth save netlify YOUR_TOKEN',
        'Get token at: https://app.netlify.com/user/applications'
      ]
    );
  }
  return token;
}

/**
 * Make Netlify API request
 */
async function netlifyApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getToken();
  const url = `${NETLIFY_API}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new NetlifyDeploymentError(
      error.message || 'Netlify API error',
      error.code || 'api_error',
      [],
      response.status
    );
  }

  return await response.json();
}

const provider: DeployProvider = {
  name: 'deploy.netlify',

  async health(): Promise<ProviderHealth> {
    try {
      const token = process.env.NETLIFY_TOKEN;
      if (!token) {
        return {
          ok: false,
          provider: 'deploy.netlify',
          details: {
            configured: false,
            error: 'NETLIFY_TOKEN not set'
          }
        };
      }

      // Test API connection with user endpoint
      await netlifyApi('/user');

      return {
        ok: true,
        provider: 'deploy.netlify',
        details: {
          configured: true,
          hasToken: true
        }
      };
    } catch (error) {
      return {
        ok: false,
        provider: 'deploy.netlify',
        details: {
          configured: false,
          error: error instanceof Error ? error.message : String(error)
        }
      };
    }
  },

  hasCredentials(): boolean {
    return Boolean(process.env.NETLIFY_TOKEN);
  },

  async validateCredentials(): Promise<{ valid: boolean; error?: string }> {
    try {
      await netlifyApi('/user');
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  async detectProject(cwd: string): Promise<ProjectDetection> {
    // Check .netlify/state.json (created by `netlify link`)
    const stateFile = path.join(cwd, '.netlify', 'state.json');
    if (await fs.pathExists(stateFile)) {
      try {
        const state = await fs.readJson(stateFile);
        return {
          detected: true,
          projectId: state.siteId,
          projectName: state.siteName
        };
      } catch {
        // Ignore parse errors
      }
    }

    // Check netlify.toml for hints
    const netlifyConfig = path.join(cwd, 'netlify.toml');
    if (await fs.pathExists(netlifyConfig)) {
      return {
        detected: true,
        projectName: path.basename(cwd)
      };
    }

    return { detected: false };
  },

  async deploy(config: DeployConfig): Promise<DeployResult> {
    try {
      // Note: Full implementation would:
      // 1. Create or get site
      // 2. Hash files
      // 3. Create site deploy
      // 4. Upload required files
      // 5. Return deployment info

      throw new NetlifyDeploymentError(
        'Netlify deployment requires full API integration',
        'not_implemented',
        [
          'Use `netlify` CLI for deployments: npm i -g netlify-cli && netlify deploy',
          'Or integrate Netlify API: https://docs.netlify.com/api/get-started/',
          'Example: POST /sites/{site_id}/deploys with file hashes'
        ]
      );
    } catch (error) {
      if (error instanceof NetlifyDeploymentError) {
        throw error;
      }
      throw new NetlifyDeploymentError(
        `Deployment failed: ${error instanceof Error ? error.message : String(error)}`,
        'deployment_failed',
        [
          'Check your project configuration',
          'Ensure build command is correct in netlify.toml',
          'Verify environment variables are set in Netlify dashboard'
        ]
      );
    }
  },

  async streamLogs(deploymentId: string, onLog: (log: string) => void): Promise<void> {
    // Netlify doesn't provide real-time log streaming via API
    // Poll deployment status instead
    onLog('[Netlify] Polling deployment status...');

    let lastState = null;
    const maxAttempts = 60; // 3 minutes with 3s intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const deploy = await netlifyApi(`/deploys/${deploymentId}`);

        if (deploy.state !== lastState) {
          onLog(`[${new Date().toISOString()}] Status: ${deploy.state}`);
          lastState = deploy.state;
        }

        if (deploy.state === 'ready' || deploy.state === 'error') {
          if (deploy.error_message) {
            onLog(`Error: ${deploy.error_message}`);
          }
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;
      } catch (error) {
        onLog(`Error checking status: ${error instanceof Error ? error.message : String(error)}`);
        break;
      }
    }
  },

  async getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
    try {
      const deploy = await netlifyApi(`/deploys/${deploymentId}`);

      return {
        state: deploy.state,
        url: deploy.deploy_ssl_url || deploy.url,
        buildTime: deploy.deploy_time,
        error: deploy.error_message
      };
    } catch (error) {
      throw new NetlifyDeploymentError(
        `Failed to get deployment status: ${error instanceof Error ? error.message : String(error)}`,
        'status_failed'
      );
    }
  }
};

export default provider;
