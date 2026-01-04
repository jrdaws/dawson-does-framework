#!/usr/bin/env tsx
/**
 * Export Validation Test Runner
 *
 * Usage:
 *   npm run test:exports              # Run all tests
 *   npm run test:exports -- --tier=1  # Run only tier 1 tests
 *   npm run test:exports -- --id=T01  # Run specific test
 *   npm run test:exports -- --quick   # Skip build validation
 *   npm run test:exports -- --compare # Compare to baselines
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import { execSync } from "child_process";
import {
  TestConfig,
  ValidationResult,
  runTest,
  generateReport,
  saveBaseline,
} from "./lib/export-validator";

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  tier: args.find((a) => a.startsWith("--tier="))?.split("=")[1],
  id: args.find((a) => a.startsWith("--id="))?.split("=")[1],
  quick: args.includes("--quick"),
  compare: args.includes("--compare"),
  updateBaseline: args.includes("--update-baseline"),
  baseUrl: args.find((a) => a.startsWith("--url="))?.split("=")[1] || "http://localhost:3000",
};

// Load test configurations
const configPath = path.join(__dirname, "test-configs/export-tests.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const outputDir = path.resolve(process.cwd(), config.outputDir);
const baselineDir = path.resolve(process.cwd(), config.baselineDir);

// Filter tests based on options
let tests: TestConfig[] = config.tests;

if (options.tier) {
  tests = tests.filter((t: TestConfig) => t.tier === parseInt(options.tier!));
}

if (options.id) {
  tests = tests.filter((t: TestConfig) => t.id === options.id);
}

console.log("\n🧪 Export Validation Test Runner\n");
console.log(`📁 Output: ${outputDir}`);
console.log(`🔗 Base URL: ${options.baseUrl}`);
console.log(`📊 Tests: ${tests.length}\n`);

/**
 * Download ZIP from export API
 */
async function downloadExport(test: TestConfig): Promise<string> {
  const url = `${options.baseUrl}/api/export/zip`;
  const projectPath = path.join(outputDir, test.config.projectName);

  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Make API request
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(test.config),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Export failed: ${response.status} - ${errorText}`);
  }

  // Save ZIP file
  const zipPath = path.join(outputDir, `${test.config.projectName}.zip`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(zipPath, buffer);

  // Extract ZIP
  if (fs.existsSync(projectPath)) {
    fs.rmSync(projectPath, { recursive: true });
  }
  fs.mkdirSync(projectPath, { recursive: true });

  try {
    execSync(`unzip -q "${zipPath}" -d "${projectPath}"`, { stdio: "pipe" });
  } catch {
    // Try with tar if unzip fails
    execSync(`tar -xf "${zipPath}" -C "${projectPath}"`, { stdio: "pipe" });
  }

  return projectPath;
}

/**
 * Run all tests
 */
async function runAllTests(): Promise<void> {
  const results: ValidationResult[] = [];

  for (const test of tests) {
    process.stdout.write(`  ${test.id} ${test.name}... `);

    try {
      // Download and extract
      const projectPath = await downloadExport(test);

      // Run validation
      const result = await runTest(test, projectPath, {
        skipBuild: options.quick,
        baselinePath: options.compare
          ? path.join(baselineDir, test.id)
          : undefined,
      });

      results.push(result);

      // Update baseline if requested and test passed
      if (options.updateBaseline && result.status === "passed") {
        saveBaseline(projectPath, baselineDir, test.id);
        console.log("✅ (baseline updated)");
      } else {
        const icon = result.status === "passed" ? "✅" : "❌";
        const details = result.build
          ? `[build: ${result.build.success ? "pass" : "FAIL"}]`
          : "[build: skipped]";
        console.log(`${icon} ${details}`);
      }

      if (result.errors.length > 0) {
        for (const error of result.errors.slice(0, 3)) {
          console.log(`     ⚠️  ${error.slice(0, 80)}`);
        }
      }
    } catch (error) {
      const err = error as Error;
      console.log(`❌ Error: ${err.message.slice(0, 60)}`);
      results.push({
        id: test.id,
        name: test.name,
        status: "failed",
        duration: 0,
        structure: { expected: 0, found: 0, missing: [], extra: [] },
        envVars: { expected: 0, found: 0, missing: [] },
        dependencies: { expected: 0, found: 0, missing: [] },
        build: null,
        errors: [err.message],
      });
    }
  }

  // Generate and save report
  const report = generateReport(results);
  const reportPath = path.join(outputDir, "validation-report.md");
  fs.writeFileSync(reportPath, report);

  // Save JSON results
  const jsonPath = path.join(outputDir, "validation-results.json");
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        options,
        summary: {
          total: results.length,
          passed: results.filter((r) => r.status === "passed").length,
          failed: results.filter((r) => r.status === "failed").length,
        },
        results,
      },
      null,
      2
    )
  );

  // Print summary
  const passed = results.filter((r) => r.status === "passed").length;
  const failed = results.filter((r) => r.status === "failed").length;

  console.log("\n" + "=".repeat(50));
  console.log(`\n📊 Summary: ${passed}/${results.length} passed`);

  if (failed > 0) {
    console.log(`\n❌ Failed tests:`);
    for (const result of results.filter((r) => r.status === "failed")) {
      console.log(`   - ${result.id}: ${result.name}`);
    }
  }

  console.log(`\n📄 Report saved: ${reportPath}`);
  console.log(`📄 JSON saved: ${jsonPath}\n`);

  // Exit with error if any tests failed
  if (failed > 0) {
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error("Test runner error:", error);
  process.exit(1);
});

