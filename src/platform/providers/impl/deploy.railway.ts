/**
 * Railway Deployment Provider
 * API Documentation: https://docs.railway.app/reference/public-api
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

const RAILWAY_API = 'https://backboard.railway.app/graphql/v2';

class RailwayDeploymentError extends Error {
  readonly code: string;
  readonly provider = 'railway';
  readonly suggestions: string[];

  constructor(message: string, code: string, suggestions: string[] = []) {
    super(message);
    this.name = 'RailwayDeploymentError';
    this.code = code;
    this.suggestions = suggestions;
  }
}

/**
 * Get Railway API token
 */
function getToken(): string {
  const token = process.env.RAILWAY_TOKEN;
  if (!token) {
    throw new RailwayDeploymentError(
      'RAILWAY_TOKEN not found',
      'missing_token',
      [
        'Set RAILWAY_TOKEN environment variable',
        'Or run: framework deploy:auth save railway YOUR_TOKEN',
        'Get token at: https://railway.app/account/tokens'
      ]
    );
  }
  return token;
}

/**
 * Make Railway GraphQL request
 */
async function railwayGraphQL(query: string, variables: any = {}): Promise<any> {
  const token = getToken();

  const response = await fetch(RAILWAY_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });

  const result = await response.json();

  if (result.errors) {
    throw new RailwayDeploymentError(
      result.errors[0].message,
      'graphql_error',
      ['Check your Railway API token', 'Verify project configuration']
    );
  }

  return result.data;
}

const provider: DeployProvider = {
  name: 'deploy.railway',

  async health(): Promise<ProviderHealth> {
    try {
      const token = process.env.RAILWAY_TOKEN;
      if (!token) {
        return {
          ok: false,
          provider: 'deploy.railway',
          details: {
            configured: false,
            error: 'RAILWAY_TOKEN not set'
          }
        };
      }

      // Test API connection with me query
      await railwayGraphQL('query { me { id } }');

      return {
        ok: true,
        provider: 'deploy.railway',
        details: {
          configured: true,
          hasToken: true
        }
      };
    } catch (error) {
      return {
        ok: false,
        provider: 'deploy.railway',
        details: {
          configured: false,
          error: error instanceof Error ? error.message : String(error)
        }
      };
    }
  },

  hasCredentials(): boolean {
    return Boolean(process.env.RAILWAY_TOKEN);
  },

  async validateCredentials(): Promise<{ valid: boolean; error?: string }> {
    try {
      await railwayGraphQL('query { me { id } }');
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  async detectProject(cwd: string): Promise<ProjectDetection> {
    // Check railway.json (if exists)
    const railwayConfig = path.join(cwd, 'railway.json');
    if (await fs.pathExists(railwayConfig)) {
      try {
        const config = await fs.readJson(railwayConfig);
        return {
          detected: true,
          projectId: config.projectId,
          projectName: config.name || path.basename(cwd)
        };
      } catch {
        // Ignore parse errors
      }
    }

    // Check railway.toml
    const railwayToml = path.join(cwd, 'railway.toml');
    if (await fs.pathExists(railwayToml)) {
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
      // 1. Create or get project
      // 2. Create service
      // 3. Trigger deployment from GitHub or upload source
      // 4. Return deployment info

      throw new RailwayDeploymentError(
        'Railway deployment requires full GraphQL API integration',
        'not_implemented',
        [
          'Use Railway CLI for deployments: npm i -g @railway/cli && railway up',
          'Or integrate Railway GraphQL API: https://docs.railway.app/reference/public-api',
          'Railway deploys from GitHub - connect your repository first'
        ]
      );
    } catch (error) {
      if (error instanceof RailwayDeploymentError) {
        throw error;
      }
      throw new RailwayDeploymentError(
        `Deployment failed: ${error instanceof Error ? error.message : String(error)}`,
        'deployment_failed',
        [
          'Check your project configuration',
          'Ensure your project is connected to GitHub',
          'Verify environment variables in Railway dashboard'
        ]
      );
    }
  },

  async streamLogs(deploymentId: string, onLog: (log: string) => void): Promise<void> {
    // Railway provides log streaming via GraphQL subscriptions
    // For now, use polling
    onLog('[Railway] Polling deployment status...');

    const maxAttempts = 60;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const status = await this.getDeploymentStatus(deploymentId);

        onLog(`[${new Date().toISOString()}] Status: ${status.state}`);

        if (status.state === 'ready' || status.state === 'error') {
          if (status.error) {
            onLog(`Error: ${status.error}`);
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
      // Note: Replace with actual GraphQL query for deployment status
      const query = `
        query GetDeployment($id: String!) {
          deployment(id: $id) {
            id
            status
            url
            createdAt
          }
        }
      `;

      const data = await railwayGraphQL(query, { id: deploymentId });

      return {
        state: data.deployment.status,
        url: data.deployment.url,
        error: undefined
      };
    } catch (error) {
      throw new RailwayDeploymentError(
        `Failed to get deployment status: ${error instanceof Error ? error.message : String(error)}`,
        'status_failed'
      );
    }
  }
};

export default provider;
