import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "FRAMEWORK_MAP.md");

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function section(title, body) {
  return `## ${title}\n\n${body}\n`;
}

function tree(dir, depth = 0, maxDepth = 4) {
  if (depth > maxDepth) return "";
  let out = "";
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    out += `${"  ".repeat(depth)}- ${entry.name}\n`;
    if (entry.isDirectory()) out += tree(full, depth + 1, maxDepth);
  }
  return out;
}

function listFiles(dir, exts, maxFiles = 4000) {
  const results = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === ".next") continue;
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else {
        if (exts.some((e) => entry.name.endsWith(e))) results.push(full);
        if (results.length >= maxFiles) return results;
      }
    }
  }
  return results;
}

function toRel(p) {
  return path.relative(ROOT, p).replaceAll("\\", "/");
}

function scanImports(fileContent) {
  const deps = new Set();

  const importRe = /import\s+(?:[^'"]+from\s+)?["']([^"']+)["']/g;
  const reqRe = /require\(\s*["']([^"']+)["']\s*\)/g;

  for (const m of fileContent.matchAll(importRe)) deps.add(m[1]);
  for (const m of fileContent.matchAll(reqRe)) deps.add(m[1]);

  return [...deps];
}

function resolveLocalImport(fromFile, spec) {
  if (!spec) return null;
  if (!spec.startsWith(".") && !spec.startsWith("/")) return null;

  const base = path.dirname(fromFile);
  const candidates = [];

  const raw = spec.startsWith("/") ? path.join(ROOT, spec) : path.join(base, spec);

  candidates.push(raw);
  candidates.push(raw + ".js");
  candidates.push(raw + ".mjs");
  candidates.push(raw + ".ts");
  candidates.push(raw + ".tsx");
  candidates.push(path.join(raw, "index.js"));
  candidates.push(path.join(raw, "index.mjs"));
  candidates.push(path.join(raw, "index.ts"));
  candidates.push(path.join(raw, "index.tsx"));

  for (const c of candidates) {
    if (exists(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

function buildCallGraph() {
  const exts = [".js", ".mjs", ".ts", ".tsx"];
  const roots = [path.join(ROOT, "bin"), path.join(ROOT, "scripts")].filter(exists);

  const files = roots.flatMap((r) => listFiles(r, exts));
  const edges = new Map();

  for (const f of files) {
    const content = read(f);
    const imports = scanImports(content);
    const locals = imports
      .map((s) => resolveLocalImport(f, s))
      .filter(Boolean)
      .map((p) => toRel(p));

    edges.set(toRel(f), [...new Set(locals)].sort());
  }

  const entry = exists("bin/framework.js") ? "bin/framework.js" : (edges.keys().next().value || null);
  if (!entry) return "(no files scanned)";

  const maxNodes = 500;
  const maxDepth = 12;

  const q = [entry];
  const depthBy = new Map([[entry, 0]]);
  const visited = new Set([entry]);

  const out = [];
  out.push(`- **ENTRY:** \`${entry}\``);

  while (q.length) {
    const cur = q.shift();
    const d = depthBy.get(cur) ?? 0;
    const indent = "  ".repeat(d + 1);
    const children = edges.get(cur) || [];

    if (d >= maxDepth) {
      out.push(`${indent}- ${cur} (maxDepth reached)`);
      continue;
    }

    if (cur !== entry) out.push(`${indent}- ${cur}`);

    const childIndent = "  ".repeat(d + 2);
    for (const child of children) {
      const already = visited.has(child);
      out.push(`${childIndent}- ${child}${already ? " (seen)" : ""}`);

      if (!already) {
        visited.add(child)
        depthBy.set(child, d + 1);
        q.push(child);
        if (visited.size >= maxNodes) {
          out.push(`${childIndent}- (stopped: maxNodes reached)`);
          q.length = 0;
          break;
        }
      }
    }
  }

  return out.join("\n");
}

function recentChanges() {
  try {
    const raw = execSync('git log -n 15 --date=short --pretty=format:"%ad %h %s"', { stdio: ["ignore", "pipe", "ignore"] })
      .toString("utf8")
      .trim();
    if (!raw) return "(no git history found)";
    return raw.split("\n").map((l) => `- ${l.replaceAll('"', "")}`).join("\n");
  } catch {
    return "Git not available (skipping).";
  }
}

let md = `# FRAMEWORK_MAP\n
Auto-generated. Do not edit manually.
Last updated: ${new Date().toISOString()}

This file is the authoritative roadmap for humans and AI agents.
\n`;

md += section("Project Structure", tree(ROOT));

if (exists("bin/framework.js")) {
  const cli = read("bin/framework.js");
  const cmds = [...cli.matchAll(/if\s*\(a\s*===\s*"([^"]+)"/g)].map((m) => m[1]);
  md += section("CLI Commands (detected)", cmds.length ? cmds.map((c) => `- \`framework ${c}\``).join("\n") : "(none detected)");
}

if (exists("scripts/orchestrator/capabilities.json")) {
  const caps = JSON.parse(read("scripts/orchestrator/capabilities.json"));
  const byTier = new Map();

  for (const c of caps.caps || []) {
    const t = c.tier || "unspecified";
    if (!byTier.has(t)) byTier.set(t, []);
    byTier.get(t).push(c);
  }

  const tiers = ["free", "pro", "team", "unspecified"].filter((t) => byTier.has(t));
  const body = tiers.map((t) => {
    const list = byTier.get(t).map((c) => {
      const env = (c.requiresEnv || []).length ? ` (env: ${c.requiresEnv.join(", ")})` : "";
      return `- **${c.id}** - ${c.phrase}\n  - Tier: \`${c.tier || "unspecified"}\`\n  - Command: \`${c.command}\`${env}`;
    }).join("\n");
    return `### ${t}\n\n${list}\n`;
  }).join("\n");

  md += section("Capabilities (tiered)", body);
}

if (exists("prompts")) {
  md += section("Prompts & Agents", tree(path.join(ROOT, "prompts"), 0, 3));
}

md += section("Call Graph (simple import scan)", buildCallGraph());

md += section("Recent Changes (git log)", recentChanges());

fs.writeFileSync(OUT, md);
console.log("Generated FRAMEWORK_MAP.md");
