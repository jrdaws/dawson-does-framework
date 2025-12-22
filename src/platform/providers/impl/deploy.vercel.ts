/**
 * Vercel Deployment Provider
 * API Documentation: https://vercel.com/docs/rest-api
 */

import fs from 'fs-extra';
import path from 'path';
import type {
  DeployProvider,
  DeployConfig,
  DeployResult,
  DeploymentStatus,
  ProjectDetection,
  DeploymentError
} from '../deploy';
import type { ProviderHealth } from '../types';

// Note: For production, consider using @vercel/client SDK
// This implementation uses direct API calls for simplicity and control

const VERCEL_API = 'https://api.vercel.com';

class VercelDeploymentError extends Error {
  readonly code: string;
  readonly provider = 'vercel';
  readonly suggestions: string[];
  readonly statusCode?: number;

  constructor(message: string, code: string, suggestions: string[] = [], statusCode?: number) {
    super(message);
    this.name = 'VercelDeploymentError';
    this.code = code;
    this.suggestions = suggestions;
    this.statusCode = statusCode;
  }
}

/**
 * Get Vercel API token from environment or credentials file
 */
function getToken(): string {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new VercelDeploymentError(
      'VERCEL_TOKEN not found',
      'missing_token',
      [
        'Set VERCEL_TOKEN environment variable',
        'Or run: framework deploy:auth save vercel YOUR_TOKEN',
        'Get token at: https://vercel.com/account/tokens'
      ]
    );
  }
  return token;
}

/**
 * Make Vercel API request
 */
async function vercelApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getToken();
  const url = `${VERCEL_API}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new VercelDeploymentError(
      data.error?.message || 'Vercel API error',
      data.error?.code || 'api_error',
      [],
      response.status
    );
  }

  return data;
}

const provider: DeployProvider = {
  name: 'deploy.vercel',

  async health(): Promise<ProviderHealth> {
    try {
      const token = process.env.VERCEL_TOKEN;
      if (!token) {
        return {
          ok: false,
          provider: 'deploy.vercel',
          details: {
            configured: false,
            error: 'VERCEL_TOKEN not set'
          }
        };
      }

      // Test API connection with user endpoint
      await vercelApi('/v2/user');

      return {
        ok: true,
        provider: 'deploy.vercel',
        details: {
          configured: true,
          hasToken: true
        }
      };
    } catch (error) {
      return {
        ok: false,
        provider: 'deploy.vercel',
        details: {
          configured: false,
          error: error instanceof Error ? error.message : String(error)
        }
      };
    }
  },

  hasCredentials(): boolean {
    return Boolean(process.env.VERCEL_TOKEN);
  },

  async validateCredentials(): Promise<{ valid: boolean; error?: string }> {
    try {
      await vercelApi('/v2/user');
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  async detectProject(cwd: string): Promise<ProjectDetection> {
    // Check .vercel/project.json (created by `vercel link`)
    const projectFile = path.join(cwd, '.vercel', 'project.json');
    if (await fs.pathExists(projectFile)) {
      try {
        const project = await fs.readJson(projectFile);
        return {
          detected: true,
          projectId: project.projectId,
          projectName: project.name,
          orgId: project.orgId
        };
      } catch {
        // Ignore parse errors
      }
    }

    // Check vercel.json for hints
    const vercelConfig = path.join(cwd, 'vercel.json');
    if (await fs.pathExists(vercelConfig)) {
      try {
        const config = await fs.readJson(vercelConfig);
        return {
          detected: true,
          projectName: config.name || path.basename(cwd),
          framework: config.framework
        };
      } catch {
        // Ignore parse errors
      }
    }

    return { detected: false };
  },

  async deploy(config: DeployConfig): Promise<DeployResult> {
    try {
      // Note: Full implementation would:
      // 1. Create or get project
      // 2. Prepare file tree
      // 3. Create deployment with files
      // 4. Upload files
      // 5. Return deployment info

      // For now, return a helpful error
      throw new VercelDeploymentError(
        'Vercel deployment requires full API integration',
        'not_implemented',
        [
          'Use `vercel` CLI for deployments: npm i -g vercel && vercel',
          'Or integrate Vercel REST API: https://vercel.com/docs/rest-api',
          'Example: POST /v13/deployments with project files'
        ]
      );
    } catch (error) {
      if (error instanceof VercelDeploymentError) {
        throw error;
      }
      throw new VercelDeploymentError(
        `Deployment failed: ${error instanceof Error ? error.message : String(error)}`,
        'deployment_failed',
        [
          'Check your project configuration',
          'Ensure build command is correct',
          'Verify environment variables are set'
        ]
      );
    }
  },

  async streamLogs(deploymentId: string, onLog: (log: string) => void): Promise<void> {
    // Vercel provides deployment events endpoint
    // GET /v2/deployments/{id}/events
    onLog('[Vercel] Log streaming not yet implemented');
    onLog('[Vercel] Check deployment status at: https://vercel.com/dashboard');
  },

  async getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
    try {
      const deployment = await vercelApi(`/v13/deployments/${deploymentId}`);

      return {
        state: deployment.readyState,
        url: deployment.url,
        buildTime: deployment.buildingAt
          ? Date.now() - deployment.buildingAt
          : undefined,
        error: deployment.error?.message
      };
    } catch (error) {
      throw new VercelDeploymentError(
        `Failed to get deployment status: ${error instanceof Error ? error.message : String(error)}`,
        'status_failed'
      );
    }
  }
};

export default provider;
