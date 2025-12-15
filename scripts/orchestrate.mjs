#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";

import { callOpenAI } from "./providers/openai.mjs";
import { callAnthropic } from "./providers/anthropic.mjs";

dotenv.config(); // loads .env if present

const ROOT = process.cwd();

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(p, content) {
  fs.writeFileSync(p, content, "utf8");
}

function nowStamp() {
  const d = new Date();
  return d.toISOString();
}

function safeRead(p) {
  try { return fs.readFileSync(p, "utf8"); } catch { return ""; }
}

function getConfig() {
  const cfgPath = path.join(ROOT, "orchestrator.config.json");
  if (!fs.existsSync(cfgPath)) {
    throw new Error(`Missing orchestrator.config.json at ${cfgPath}`);
  }
  return readJSON(cfgPath);
}

function resolveModel(cfg, role) {
  const m = cfg.models?.[role];
  if (!m?.provider || !m?.model) throw new Error(`Missing models.${role} in orchestrator.config.json`);
  return m;
}

async function callProvider({ provider, model, system, user }) {
  if (provider === "openai") return callOpenAI({ model, system, user });
  if (provider === "anthropic") return callAnthropic({ model, system, user });
  throw new Error(`Unknown provider: ${provider}`);
}

function loadFrameworkPrompts() {
  // Optional: pull your superprompt + agent prompts if present
  const superPrompt = safeRead(path.join(ROOT, "prompts", "superprompt", "v0.1.md"));
  const researchPrompt = safeRead(path.join(ROOT, "prompts", "agents", "research.v0.1.md"));
  const executorPrompt = safeRead(path.join(ROOT, "prompts", "agents", "executor.v0.1.md"));
  const reviewerPrompt = safeRead(path.join(ROOT, "prompts", "agents", "reviewer.v0.1.md"));

  return { superPrompt, researchPrompt, executorPrompt, reviewerPrompt };
}

function baseSystem(cfg) {
  return [
    `You are operating within: ${cfg.frameworkName}.`,
    `Core principle: bias toward shipping. Keep scope aligned with PROJECT_SIZE.`,
    `Assumption policy: ${cfg.projectDefaults?.assumptionPolicy || "State assumptions explicitly."}`,
    `Decision style: ${cfg.projectDefaults?.decisionStyle || "Make pragmatic decisions, then act."}`,
    ``,
    `When you output, be concrete: file paths, commands, and checklists.`,
  ].join("\n");
}

function phaseUserPrompt(phase, prompts) {
  const header = `# Dawson Does Orchestrator - Phase: ${phase}\nGenerated: ${nowStamp()}\n`;

  if (phase === "research") {
    return [
      header,
      `## SuperPrompt (if provided)\n${prompts.superPrompt || "(none found)"}\n`,
      `## Research Agent Prompt (if provided)\n${prompts.researchPrompt || "(none found)"}\n`,
      `## Your task`,
      `Create:`,
      `1) Market + keyword plan (if relevant)`,
      `2) Technical plan and repo structure recommendations`,
      `3) Clear next steps for Executor`,
      `Output must be immediately usable.`,
      ``,
      `If the project type is unknown, propose 3 likely project intents and pick the best default.`
    ].join("\n");
  }

  if (phase === "executor") {
    return [
      header,
      `## SuperPrompt (if provided)\n${prompts.superPrompt || "(none found)"}\n`,
      `## Executor Agent Prompt (if provided)\n${prompts.executorPrompt || "(none found)"}\n`,
      `## Your task`,
      `Produce concrete implementation steps and code edits. Use exact file paths and terminal commands.`,
      `Minimize over-engineering. Prefer cloneable, composable structure.`,
      `End with a checklist and "what to run next".`
    ].join("\n");
  }

  if (phase === "reviewer") {
    return [
      header,
      `## SuperPrompt (if provided)\n${prompts.superPrompt || "(none found)"}\n`,
      `## Reviewer Agent Prompt (if provided)\n${prompts.reviewerPrompt || "(none found)"}\n`,
      `## Your task`,
      `Audit the plan/code structure for: security, DX, lint/test, env safety, SEO (if applicable), and simplicity.`,
      `Return:`,
      `- Issues (critical/high/med/low)`,
      `- Specific fixes with file paths`,
      `- Final "ship checklist"`,
    ].join("\n");
  }

  return [header, "Unknown phase."].join("\n");
}

async function runStart(cfg) {
  const outDir = path.join(ROOT, cfg.projectDefaults?.outputDir || "tasks");
  ensureDir(outDir);

  const prompts = loadFrameworkPrompts();

  const phases = cfg.commands?.start?.phases || ["research", "executor", "reviewer"];

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const modelSpec = resolveModel(cfg, phase);

    const system = baseSystem(cfg);
    const user = phaseUserPrompt(phase, prompts);

    const result = await callProvider({
      provider: modelSpec.provider,
      model: modelSpec.model,
      system,
      user
    });

    const fileName = phase === "research" ? "01-research.md"
      : phase === "executor" ? "02-executor.md"
      : "03-reviewer.md";

    writeFile(path.join(outDir, fileName), result);
    console.log(`Wrote ${path.join(outDir, fileName)}`);
  }
}

async function runFollowRules(cfg) {
  const outDir = path.join(ROOT, cfg.projectDefaults?.outputDir || "tasks");
  ensureDir(outDir);

  const prompts = loadFrameworkPrompts();

  const system = baseSystem(cfg);

  const user = [
    `# Follow rules - workflow audit`,
    `Generated: ${nowStamp()}`,
    ``,
    `Check for workflow violations in the following framework rules:`,
    `- Bias toward shipping`,
    `- Do not over-engineer beyond PROJECT_SIZE`,
    `- Prefer composable, cloneable systems`,
    `- Explain decisions briefly, then act`,
    ``,
    `Review these artifacts if present:`,
    `- tasks/01-research.md`,
    `- tasks/02-executor.md`,
    `- tasks/03-reviewer.md`,
    ``,
    `SuperPrompt:\n${prompts.superPrompt || "(none)"}\n`,
    `If violations exist, propose corrections as a numbered list with concrete next steps.`,
  ].join("\n");

  // Use reviewer model by default
  const m = resolveModel(cfg, "reviewer");
  const result = await callProvider({ provider: m.provider, model: m.model, system, user });

  const outFile = cfg.commands?.["follow-rules"]?.outputFile || "RULES_AUDIT.md";
  writeFile(path.join(outDir, outFile), result);
  console.log(`Wrote ${path.join(outDir, outFile)}`);
}

async function runCompacting(cfg) {
  const outDir = path.join(ROOT, cfg.projectDefaults?.outputDir || "tasks");
  ensureDir(outDir);

  const system = baseSystem(cfg);

  const research = safeRead(path.join(outDir, "01-research.md"));
  const exec = safeRead(path.join(outDir, "02-executor.md"));
  const review = safeRead(path.join(outDir, "03-reviewer.md"));

  const user = [
    `# Compacting - handoff summary`,
    `Generated: ${nowStamp()}`,
    ``,
    `You are generating a handoff summary to paste into a NEW Cursor chat.`,
    `Constraints:`,
    `- Keep it tight and actionable`,
    `- Include current status, key decisions, and immediate next steps`,
    `- Include any required environment variables and commands`,
    ``,
    `## Research output\n${research || "(missing)"}\n`,
    `## Executor output\n${exec || "(missing)"}\n`,
    `## Reviewer output\n${review || "(missing)"}\n`,
    ``,
    `Now produce the HANDOFF.`
  ].join("\n");

  const m = resolveModel(cfg, "reviewer");
  const result = await callProvider({ provider: m.provider, model: m.model, system, user });

  const outFile = cfg.commands?.["compacting"]?.outputFile || "HANDOFF.md";
  writeFile(path.join(outDir, outFile), result);
  console.log(`Wrote ${path.join(outDir, outFile)}`);
}

async function main() {
  const cfg = getConfig();
  const cmd = process.argv[2];

  if (!cmd || ["start", "follow-rules", "compacting"].includes(cmd) === false) {
    console.log(`Usage:
  node scripts/orchestrate.mjs start
  node scripts/orchestrate.mjs follow-rules
  node scripts/orchestrate.mjs compacting
`);
    process.exit(cmd ? 1 : 0);
  }

  if (cmd === "start") return runStart(cfg);
  if (cmd === "follow-rules") return runFollowRules(cfg);
  if (cmd === "compacting") return runCompacting(cfg);
}

main().catch((err) => {
  console.error(err?.stack || err?.message || String(err));
  process.exit(1);
});
