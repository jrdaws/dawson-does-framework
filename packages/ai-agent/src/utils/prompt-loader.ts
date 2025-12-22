import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class PromptLoader {
  private promptsDir: string;
  private cache: Map<string, string> = new Map();

  constructor(promptsDir?: string) {
    // Default to src/prompts relative to this file
    this.promptsDir = promptsDir || join(__dirname, "../prompts");
  }

  async load(name: string, vars: Record<string, string> = {}): Promise<string> {
    // Check cache first
    const cacheKey = `${name}-${JSON.stringify(vars)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Load file
    const filePath = join(this.promptsDir, `${name}.md`);
    let content = await readFile(filePath, "utf-8");

    // Simple variable substitution: {variable} -> value
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\{${key}\\}`, "g");
      content = content.replace(regex, value);
    }

    // Cache result
    this.cache.set(cacheKey, content);

    return content;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
