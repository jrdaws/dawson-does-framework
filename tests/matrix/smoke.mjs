import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const combos = [
  { template: "seo-directory", name: "smoke-seo" },
  { template: "saas", name: "smoke-saas" }
];

const root = path.join(os.tmpdir(), "dd-framework-matrix");
fs.rmSync(root, { recursive: true, force: true });
fs.mkdirSync(root, { recursive: true });

for (const c of combos) {
  const out = path.join(root, c.name);
  console.log("\n== matrix case ==", c.template, "->", out);

  run("node", ["bin/framework.js", "export", c.template, out, "--force"], process.cwd());
  run("npm", ["install"], out);
  run("npm", ["run", "build"], out);
  run("npm", ["test"], out);
}

console.log("\n✅ matrix smoke passed:", root);
