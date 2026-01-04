/**
 * Export Validation Utilities
 *
 * Core functions for validating framework exports against expected outputs.
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { execSync } from "child_process";

// Types
export interface TestConfig {
  id: string;
  name: string;
  tier: number;
  priority: "P0" | "P1" | "P2";
  config: {
    template: string;
    projectName: string;
    integrations: Record<string, string>;
    vision?: string;
    branding?: {
      primaryColor?: string;
      secondaryColor?: string;
    };
  };
  expectedFiles: string[];
  expectedEnvVars: string[];
  expectedDeps: string[];
}

export interface ValidationResult {
  id: string;
  name: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
  structure: {
    expected: number;
    found: number;
    missing: string[];
    extra: string[];
  };
  envVars: {
    expected: number;
    found: number;
    missing: string[];
  };
  dependencies: {
    expected: number;
    found: number;
    missing: string[];
  };
  build: {
    success: boolean;
    duration: number;
    error?: string;
  } | null;
  errors: string[];
}

export interface DiffResult {
  identical: boolean;
  newFiles: string[];
  removedFiles: string[];
  modifiedFiles: string[];
  checksumMismatches: number;
}

/**
 * Calculate MD5 checksum of a file
 */
export function getFileChecksum(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(content).digest("hex");
}

/**
 * Get all files in a directory recursively
 */
export function getAllFiles(dir: string, baseDir = dir): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    // Skip node_modules and .git
    if (entry.name === "node_modules" || entry.name === ".git") continue;

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Generate checksums for all files in a directory
 */
export function generateChecksums(dir: string): Record<string, string> {
  const checksums: Record<string, string> = {};
  const files = getAllFiles(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isFile()) {
      checksums[file] = getFileChecksum(fullPath);
    }
  }

  return checksums;
}

/**
 * Validate project structure
 */
export function validateStructure(
  projectPath: string,
  expectedFiles: string[]
): {
  expected: number;
  found: number;
  missing: string[];
  extra: string[];
} {
  const actualFiles = getAllFiles(projectPath);
  const missing: string[] = [];
  const found: string[] = [];

  for (const expected of expectedFiles) {
    const exists = actualFiles.some(
      (actual) => actual === expected || actual.endsWith(expected)
    );
    if (exists) {
      found.push(expected);
    } else {
      missing.push(expected);
    }
  }

  // Find extra files that weren't expected (only integration-related)
  const integrationDirs = [
    "lib/supabase",
    "lib/stripe",
    "lib/email",
    "lib/analytics",
    "lib/ai",
    "lib/search",
    "lib/uploadthing",
  ];
  const extra = actualFiles.filter((file) => {
    const isIntegration = integrationDirs.some((dir) => file.startsWith(dir));
    const isExpected = expectedFiles.some(
      (exp) => file === exp || file.endsWith(exp)
    );
    return isIntegration && !isExpected;
  });

  return {
    expected: expectedFiles.length,
    found: found.length,
    missing,
    extra,
  };
}

/**
 * Validate environment variables in .env.local.example
 */
export function validateEnvVars(
  projectPath: string,
  expectedVars: string[]
): {
  expected: number;
  found: number;
  missing: string[];
} {
  const envPath = path.join(projectPath, ".env.local.example");
  const missing: string[] = [];
  const found: string[] = [];

  if (!fs.existsSync(envPath)) {
    return { expected: expectedVars.length, found: 0, missing: expectedVars };
  }

  const envContent = fs.readFileSync(envPath, "utf-8");

  for (const varName of expectedVars) {
    if (envContent.includes(varName)) {
      found.push(varName);
    } else {
      missing.push(varName);
    }
  }

  return {
    expected: expectedVars.length,
    found: found.length,
    missing,
  };
}

/**
 * Validate package.json dependencies
 */
export function validateDependencies(
  projectPath: string,
  expectedDeps: string[]
): {
  expected: number;
  found: number;
  missing: string[];
} {
  const pkgPath = path.join(projectPath, "package.json");
  const missing: string[] = [];
  const found: string[] = [];

  if (!fs.existsSync(pkgPath)) {
    return { expected: expectedDeps.length, found: 0, missing: expectedDeps };
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  for (const dep of expectedDeps) {
    if (allDeps[dep]) {
      found.push(dep);
    } else {
      missing.push(dep);
    }
  }

  return {
    expected: expectedDeps.length,
    found: found.length,
    missing,
  };
}

/**
 * Run npm install and build
 */
export function validateBuild(projectPath: string): {
  success: boolean;
  duration: number;
  error?: string;
} {
  const start = Date.now();

  try {
    // Run npm install
    execSync("npm install --legacy-peer-deps", {
      cwd: projectPath,
      stdio: "pipe",
      timeout: 120000, // 2 minutes
    });

    // Run npm run build
    execSync("npm run build", {
      cwd: projectPath,
      stdio: "pipe",
      timeout: 300000, // 5 minutes
    });

    return { success: true, duration: Date.now() - start };
  } catch (error) {
    const err = error as { stderr?: Buffer; message: string };
    return {
      success: false,
      duration: Date.now() - start,
      error: err.stderr?.toString() || err.message,
    };
  }
}

/**
 * Compare project to baseline
 */
export function compareToBaseline(
  projectPath: string,
  baselinePath: string
): DiffResult {
  if (!fs.existsSync(baselinePath)) {
    return {
      identical: false,
      newFiles: getAllFiles(projectPath),
      removedFiles: [],
      modifiedFiles: [],
      checksumMismatches: 0,
    };
  }

  const projectFiles = new Set(getAllFiles(projectPath));
  const baselineFiles = new Set(getAllFiles(baselinePath));

  const newFiles: string[] = [];
  const removedFiles: string[] = [];
  const modifiedFiles: string[] = [];
  let checksumMismatches = 0;

  // Find new and modified files
  for (const file of projectFiles) {
    if (!baselineFiles.has(file)) {
      newFiles.push(file);
    } else {
      // Compare checksums
      const projectChecksum = getFileChecksum(path.join(projectPath, file));
      const baselineChecksum = getFileChecksum(path.join(baselinePath, file));
      if (projectChecksum !== baselineChecksum) {
        modifiedFiles.push(file);
        checksumMismatches++;
      }
    }
  }

  // Find removed files
  for (const file of baselineFiles) {
    if (!projectFiles.has(file)) {
      removedFiles.push(file);
    }
  }

  return {
    identical: newFiles.length === 0 && removedFiles.length === 0 && modifiedFiles.length === 0,
    newFiles,
    removedFiles,
    modifiedFiles,
    checksumMismatches,
  };
}

/**
 * Run a single test
 */
export async function runTest(
  test: TestConfig,
  projectPath: string,
  options: { skipBuild?: boolean; baselinePath?: string } = {}
): Promise<ValidationResult> {
  const start = Date.now();
  const errors: string[] = [];

  // Validate structure
  const structure = validateStructure(projectPath, test.expectedFiles);
  if (structure.missing.length > 0) {
    errors.push(`Missing files: ${structure.missing.join(", ")}`);
  }

  // Validate env vars
  const envVars = validateEnvVars(projectPath, test.expectedEnvVars);
  if (envVars.missing.length > 0) {
    errors.push(`Missing env vars: ${envVars.missing.join(", ")}`);
  }

  // Validate dependencies
  const dependencies = validateDependencies(projectPath, test.expectedDeps);
  if (dependencies.missing.length > 0) {
    errors.push(`Missing dependencies: ${dependencies.missing.join(", ")}`);
  }

  // Run build if not skipped
  let build = null;
  if (!options.skipBuild) {
    build = validateBuild(projectPath);
    if (!build.success) {
      errors.push(`Build failed: ${build.error?.slice(0, 200)}`);
    }
  }

  const status =
    errors.length === 0
      ? "passed"
      : structure.missing.length > 0 || (build && !build.success)
      ? "failed"
      : "passed";

  return {
    id: test.id,
    name: test.name,
    status,
    duration: Date.now() - start,
    structure,
    envVars,
    dependencies,
    build,
    errors,
  };
}

/**
 * Generate summary report
 */
export function generateReport(results: ValidationResult[]): string {
  const passed = results.filter((r) => r.status === "passed").length;
  const failed = results.filter((r) => r.status === "failed").length;

  let report = `# Export Validation Results\n\n`;
  report += `**Date**: ${new Date().toISOString()}\n`;
  report += `**Total**: ${results.length} | **Passed**: ${passed} | **Failed**: ${failed}\n\n`;

  // Group by tier
  const tiers = new Map<number, ValidationResult[]>();
  for (const result of results) {
    const tier = parseInt(result.id.slice(1, 3)) <= 5 ? 1 : parseInt(result.id.slice(1, 3)) <= 10 ? 2 : parseInt(result.id.slice(1, 3)) <= 15 ? 3 : 4;
    if (!tiers.has(tier)) tiers.set(tier, []);
    tiers.get(tier)!.push(result);
  }

  for (const [tier, tierResults] of tiers) {
    report += `## Tier ${tier}\n\n`;
    for (const result of tierResults) {
      const icon = result.status === "passed" ? "✅" : "❌";
      const fileStatus = `[files: ${result.structure.found}/${result.structure.expected}]`;
      const buildStatus = result.build
        ? `[build: ${result.build.success ? "pass" : "FAIL"}]`
        : "";
      report += `${icon} **${result.id}** ${result.name} ${fileStatus} ${buildStatus}\n`;

      if (result.errors.length > 0) {
        for (const error of result.errors) {
          report += `   - ${error}\n`;
        }
      }
    }
    report += "\n";
  }

  return report;
}

/**
 * Save baseline
 */
export function saveBaseline(
  projectPath: string,
  baselineDir: string,
  testId: string
): void {
  const targetDir = path.join(baselineDir, testId);

  // Remove existing baseline
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true });
  }

  // Copy project to baseline (excluding node_modules)
  fs.mkdirSync(targetDir, { recursive: true });
  const files = getAllFiles(projectPath);
  for (const file of files) {
    const srcPath = path.join(projectPath, file);
    const destPath = path.join(targetDir, file);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  }

  // Save checksums
  const checksums = generateChecksums(targetDir);
  fs.writeFileSync(
    path.join(targetDir, "checksums.json"),
    JSON.stringify(checksums, null, 2)
  );
}

