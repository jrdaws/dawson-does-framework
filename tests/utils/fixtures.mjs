import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import fse from "fs-extra";

/**
 * Creates a temporary test project directory
 * @returns {string} Path to the temporary project
 */
export function createTempProject() {
  const tmpDir = path.join(os.tmpdir(), `framework-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  fs.mkdirSync(tmpDir, { recursive: true });
  return tmpDir;
}

/**
 * Cleans up a temporary project directory
 * @param {string} projectPath - Path to the project to clean up
 */
export function cleanupTempProject(projectPath) {
  if (fs.existsSync(projectPath)) {
    fse.removeSync(projectPath);
  }
}

/**
 * Creates a mock template structure for testing
 * @param {string} basePath - Base path to create the template in
 * @returns {string} Path to the created template
 */
export function createMockTemplate(basePath) {
  const templatePath = path.join(basePath, "template");
  fs.mkdirSync(templatePath, { recursive: true });

  // Create basic template structure
  fs.writeFileSync(
    path.join(templatePath, "package.json"),
    JSON.stringify({
      name: "test-template",
      version: "1.0.0",
      type: "module"
    }, null, 2)
  );

  // Create .dd directory with manifest
  const ddDir = path.join(templatePath, ".dd");
  fs.mkdirSync(ddDir, { recursive: true });

  fs.writeFileSync(
    path.join(ddDir, "manifest.json"),
    JSON.stringify({
      template: "test-template",
      version: "1.0.0",
      capabilities: []
    }, null, 2)
  );

  return templatePath;
}

/**
 * Creates a mock Supabase client for testing
 * @returns {object} Mock Supabase client
 */
export function mockSupabase() {
  return {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
    }),
    auth: {
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signIn: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
}

/**
 * Creates a temporary git repository for testing
 * @param {string} basePath - Base path to create the repo in
 * @returns {string} Path to the git repository
 */
export function createTempGitRepo(basePath) {
  const repoPath = path.join(basePath, "repo");
  fs.mkdirSync(repoPath, { recursive: true });

  // Initialize git repo
  spawnSync("git", ["init"], { cwd: repoPath });
  spawnSync("git", ["config", "user.name", "Test User"], { cwd: repoPath });
  spawnSync("git", ["config", "user.email", "test@example.com"], { cwd: repoPath });

  // Create initial commit
  fs.writeFileSync(path.join(repoPath, "README.md"), "# Test Repo");
  spawnSync("git", ["add", "."], { cwd: repoPath });
  spawnSync("git", ["commit", "-m", "Initial commit"], { cwd: repoPath });

  return repoPath;
}

/**
 * Reads and parses a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {object} Parsed JSON object
 */
export function readJSON(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

/**
 * Writes a JSON object to a file
 * @param {string} filePath - Path to write to
 * @param {object} data - Data to write
 */
export function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Creates a mock manifest file for testing
 * @param {string} templatePath - Path to the template directory
 * @param {object} overrides - Optional overrides for manifest fields
 * @returns {string} Path to the created manifest
 */
export function createMockManifest(templatePath, overrides = {}) {
  const ddDir = path.join(templatePath, ".dd");
  fs.mkdirSync(ddDir, { recursive: true });

  const manifest = {
    template: "test-template",
    version: "1.0.0",
    capabilities: [],
    ...overrides
  };

  const manifestPath = path.join(ddDir, "manifest.json");
  writeJSON(manifestPath, manifest);

  return manifestPath;
}

/**
 * Creates a mock project configuration for testing
 * @param {object} overrides - Optional overrides for project fields
 * @returns {object} Mock project configuration
 */
export function createMockProject(overrides = {}) {
  return {
    id: "test-project-id",
    token: "test-token-1234",
    template: "saas",
    project_name: "test-project",
    output_dir: "./test-project",
    integrations: {
      auth: "supabase",
      payments: "stripe"
    },
    env_keys: {
      STRIPE_SECRET_KEY: ""
    },
    vision: "Test vision",
    mission: "Test mission",
    success_criteria: "Test success criteria",
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Creates a mock fetch function for testing API calls
 * @param {object} responses - Map of URL patterns to responses
 * @returns {Function} Mock fetch function
 */
export function createMockFetch(responses = {}) {
  return async (url, options) => {
    // Find matching response
    for (const [pattern, response] of Object.entries(responses)) {
      if (url.includes(pattern) || url.match(new RegExp(pattern))) {
        if (typeof response === "function") {
          return response(url, options);
        }
        return {
          ok: response.ok ?? true,
          status: response.status ?? 200,
          json: async () => response.data ?? response,
          text: async () => JSON.stringify(response.data ?? response)
        };
      }
    }

    // Default 404 response
    return {
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" }),
      text: async () => JSON.stringify({ error: "Not found" })
    };
  };
}
