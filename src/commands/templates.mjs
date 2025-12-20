/**
 * Template management commands
 */

import {
  discoverLocalTemplates,
  searchTemplates,
  getTemplateById,
  getCategories,
  getTags,
  sortTemplates,
  filterByCategory,
  filterByTag,
  isCompatible,
} from "../dd/registry.mjs";
import { getCurrentVersion } from "../dd/version.mjs";

export async function cmdTemplates(args = []) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === "help") {
    showTemplatesHelp();
    return;
  }

  switch (subcommand) {
    case "list":
      await cmdTemplatesList(rest);
      break;
    case "search":
      await cmdTemplatesSearch(rest);
      break;
    case "info":
      await cmdTemplatesInfo(rest);
      break;
    case "categories":
      await cmdTemplatesCategories();
      break;
    case "tags":
      await cmdTemplatesTags();
      break;
    default:
      console.error(`Unknown templates subcommand: ${subcommand}`);
      console.error("Run 'framework templates help' for usage");
      process.exit(1);
  }
}

function showTemplatesHelp() {
  console.log(`Template Management Commands:

  framework templates list              List all available templates
  framework templates search <query>    Search templates
  framework templates info <id>         Show template details
  framework templates categories        List all categories
  framework templates tags              List all tags

List Options:
  --category <name>    Filter by category
  --tag <name>         Filter by tag
  --sort <field>       Sort by: name (default), id, category

Examples:
  framework templates list
  framework templates list --category "SaaS"
  framework templates list --tag "nextjs"
  framework templates search "blog"
  framework templates info saas
`);
}

async function cmdTemplatesList(args = []) {
  // Parse flags
  const flags = parseListFlags(args);

  try {
    let templates = discoverLocalTemplates();

    // Apply filters
    if (flags.category) {
      templates = filterByCategory(templates, flags.category);
    }

    if (flags.tag) {
      templates = filterByTag(templates, flags.tag);
    }

    // Sort
    templates = sortTemplates(templates, flags.sort);

    // Get framework version for compatibility check
    const frameworkVersion = getCurrentVersion();

    if (templates.length === 0) {
      console.log("No templates found.");
      return;
    }

    console.log(`Available Templates (${templates.length}):\n`);

    for (const template of templates) {
      const compatible = isCompatible(template, frameworkVersion);
      const compatMarker = compatible ? "" : " ⚠️";

      console.log(`📦 ${template.name}${compatMarker}`);
      console.log(`   ID: ${template.id}`);

      if (template.description) {
        console.log(`   ${template.description}`);
      }

      if (template.category) {
        console.log(`   Category: ${template.category}`);
      }

      if (template.tags && template.tags.length > 0) {
        console.log(`   Tags: ${template.tags.join(", ")}`);
      }

      if (template.version && template.version !== "unknown") {
        console.log(`   Version: ${template.version}`);
      }

      if (template.minFrameworkVersion) {
        console.log(`   Min Framework: v${template.minFrameworkVersion}`);
      }

      if (!compatible) {
        console.log(`   ⚠️  Requires framework v${template.minFrameworkVersion} or higher`);
      }

      if (template.legacy) {
        console.log(`   ℹ️  Legacy template (no template.json)`);
      }

      console.log();
    }

    console.log(`Use 'framework templates info <id>' for more details`);
  } catch (error) {
    console.error(`❌ Failed to list templates: ${error.message}`);
    process.exit(1);
  }
}

async function cmdTemplatesSearch([query, ...args]) {
  if (!query) {
    console.error("Error: Search query is required");
    console.error("Usage: framework templates search <query>");
    process.exit(1);
  }

  try {
    let templates = discoverLocalTemplates();
    templates = searchTemplates(templates, query);
    templates = sortTemplates(templates, "name");

    if (templates.length === 0) {
      console.log(`No templates found matching: "${query}"`);
      return;
    }

    console.log(`Search Results for "${query}" (${templates.length}):\n`);

    for (const template of templates) {
      console.log(`📦 ${template.name}`);
      console.log(`   ID: ${template.id}`);

      if (template.description) {
        console.log(`   ${template.description}`);
      }

      if (template.category) {
        console.log(`   Category: ${template.category}`);
      }

      console.log();
    }
  } catch (error) {
    console.error(`❌ Failed to search templates: ${error.message}`);
    process.exit(1);
  }
}

async function cmdTemplatesInfo([templateId]) {
  if (!templateId) {
    console.error("Error: Template ID is required");
    console.error("Usage: framework templates info <id>");
    process.exit(1);
  }

  try {
    const templates = discoverLocalTemplates();
    const template = getTemplateById(templates, templateId);

    if (!template) {
      console.error(`❌ Template not found: ${templateId}`);
      console.error("\nAvailable templates:");
      for (const t of templates) {
        console.error(`  - ${t.id}`);
      }
      process.exit(1);
    }

    const frameworkVersion = getCurrentVersion();
    const compatible = isCompatible(template, frameworkVersion);

    console.log(`📦 ${template.name}\n`);

    console.log(`ID:          ${template.id}`);
    console.log(`Version:     ${template.version}`);
    console.log(`Category:    ${template.category || "Uncategorized"}`);

    if (template.author) {
      console.log(`Author:      ${template.author}`);
    }

    console.log(`\nDescription:`);
    console.log(`  ${template.description || "No description available"}`);

    if (template.tags && template.tags.length > 0) {
      console.log(`\nTags: ${template.tags.join(", ")}`);
    }

    if (template.capabilities && template.capabilities.length > 0) {
      console.log(`\nCapabilities:`);
      for (const cap of template.capabilities) {
        console.log(`  - ${cap}`);
      }
    }

    if (template.dependencies && Object.keys(template.dependencies).length > 0) {
      console.log(`\nDependencies:`);
      for (const [name, version] of Object.entries(template.dependencies)) {
        console.log(`  - ${name}: ${version}`);
      }
    }

    console.log(`\nFramework Compatibility:`);
    if (template.minFrameworkVersion) {
      console.log(`  Requires: v${template.minFrameworkVersion} or higher`);
      console.log(`  Current:  v${frameworkVersion}`);
      console.log(`  Status:   ${compatible ? "✅ Compatible" : "⚠️  Incompatible"}`);
    } else {
      console.log(`  No minimum version specified`);
    }

    console.log(`\nSource:`);
    console.log(`  Type: ${template.source || "local"}`);
    console.log(`  Path: ${template.path}`);

    if (template.legacy) {
      console.log(`\n  ℹ️  This is a legacy template without template.json metadata`);
    }

    console.log(`\nUsage:`);
    console.log(`  framework export ${template.id} <project-dir>`);
  } catch (error) {
    console.error(`❌ Failed to get template info: ${error.message}`);
    process.exit(1);
  }
}

async function cmdTemplatesCategories() {
  try {
    const templates = discoverLocalTemplates();
    const categories = getCategories(templates);

    if (categories.length === 0) {
      console.log("No categories found.");
      return;
    }

    console.log(`Template Categories (${categories.length}):\n`);

    for (const category of categories) {
      const count = templates.filter(t => t.category === category).length;
      console.log(`  ${category} (${count} template${count !== 1 ? "s" : ""})`);
    }

    console.log(`\nUse --category flag to filter:`);
    console.log(`  framework templates list --category "${categories[0]}"`);
  } catch (error) {
    console.error(`❌ Failed to list categories: ${error.message}`);
    process.exit(1);
  }
}

async function cmdTemplatesTags() {
  try {
    const templates = discoverLocalTemplates();
    const tags = getTags(templates);

    if (tags.length === 0) {
      console.log("No tags found.");
      return;
    }

    console.log(`Template Tags (${tags.length}):\n`);

    const tagCounts = new Map();
    for (const template of templates) {
      if (template.tags) {
        for (const tag of template.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      }
    }

    for (const tag of tags) {
      const count = tagCounts.get(tag) || 0;
      console.log(`  ${tag} (${count} template${count !== 1 ? "s" : ""})`);
    }

    console.log(`\nUse --tag flag to filter:`);
    console.log(`  framework templates list --tag "${tags[0]}"`);
  } catch (error) {
    console.error(`❌ Failed to list tags: ${error.message}`);
    process.exit(1);
  }
}

function parseListFlags(args) {
  const flags = {
    category: null,
    tag: null,
    sort: "name",
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--category" && args[i + 1]) {
      flags.category = args[i + 1];
      i++;
    } else if (args[i] === "--tag" && args[i + 1]) {
      flags.tag = args[i + 1];
      i++;
    } else if (args[i] === "--sort" && args[i + 1]) {
      flags.sort = args[i + 1];
      i++;
    }
  }

  return flags;
}
