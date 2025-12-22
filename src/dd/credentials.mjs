import fs from 'fs-extra';
import path from 'path';
import os from 'os';

/**
 * Credential storage for deployment providers
 *
 * Storage priority:
 * 1. Environment variables (for CI/CD)
 * 2. ~/.dd/credentials.json (for local development)
 * 3. Prompt user (interactive)
 */
export class CredentialStore {
  constructor() {
    this.credentialsPath = path.join(os.homedir(), '.dd', 'credentials.json');
  }

  /**
   * Get credential for a provider
   * @param {string} provider - Provider name (vercel, netlify, railway)
   * @returns {Promise<{token: string, source: string, provider: string} | null>}
   */
  async getCredential(provider) {
    // 1. Check environment variable (CI/CD priority)
    const envKey = `${provider.toUpperCase()}_TOKEN`;
    if (process.env[envKey]) {
      return {
        token: process.env[envKey],
        source: 'env',
        provider
      };
    }

    // 2. Check credentials file (local dev)
    const creds = await this.loadCredentials();
    if (creds.credentials[provider]?.token) {
      return {
        ...creds.credentials[provider],
        source: 'file',
        provider
      };
    }

    return null;
  }

  /**
   * Save credential for a provider
   * @param {string} provider - Provider name
   * @param {string} token - API token
   * @param {object} metadata - Additional metadata
   */
  async saveCredential(provider, token, metadata = {}) {
    const creds = await this.loadCredentials();
    creds.credentials[provider] = {
      token,
      ...metadata,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };
    await this.writeCredentials(creds);
  }

  /**
   * Remove credential for a provider
   * @param {string} provider - Provider name
   */
  async removeCredential(provider) {
    const creds = await this.loadCredentials();
    delete creds.credentials[provider];
    await this.writeCredentials(creds);
  }

  /**
   * Mark credential as recently used
   * @param {string} provider - Provider name
   */
  async markUsed(provider) {
    const creds = await this.loadCredentials();
    if (creds.credentials[provider]) {
      creds.credentials[provider].lastUsed = new Date().toISOString();
      await this.writeCredentials(creds);
    }
  }

  /**
   * Load credentials from file
   * @returns {Promise<{version: string, credentials: object}>}
   */
  async loadCredentials() {
    try {
      await fs.ensureDir(path.dirname(this.credentialsPath));
      if (!(await fs.pathExists(this.credentialsPath))) {
        return { version: "1.0.0", credentials: {} };
      }
      return await fs.readJson(this.credentialsPath);
    } catch {
      return { version: "1.0.0", credentials: {} };
    }
  }

  /**
   * Write credentials to file with secure permissions
   * @param {object} creds - Credentials object
   */
  async writeCredentials(creds) {
    await fs.ensureDir(path.dirname(this.credentialsPath));

    // Write JSON file
    await fs.writeJson(this.credentialsPath, creds, { spaces: 2 });

    // Set secure permissions (owner read/write only) - only on Unix systems
    if (process.platform !== 'win32') {
      await fs.chmod(this.credentialsPath, 0o600);
    }
  }

  /**
   * List all saved credentials
   * @returns {Promise<object>}
   */
  async listCredentials() {
    return await this.loadCredentials();
  }

  /**
   * Check if a provider has credentials
   * @param {string} provider - Provider name
   * @returns {Promise<boolean>}
   */
  async hasCredential(provider) {
    const cred = await this.getCredential(provider);
    return cred !== null;
  }
}
