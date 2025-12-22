# framework plugin

Manage framework plugins.

## Synopsis

```bash
framework plugin <command> [arguments] [options]
```

## Description

Plugins extend the framework by hooking into lifecycle events. Manage plugins with add, remove, list, and info commands.

## Commands

| Command | Description |
|---------|-------------|
| `add <path>` | Add a plugin |
| `remove <name>` | Remove a plugin |
| `list` | List installed plugins |
| `hooks` | Show available hook points |
| `info <path>` | Show plugin information |

## framework plugin add

Add a plugin to your project.

### Synopsis

```bash
framework plugin add <path>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `path` | Path to plugin file or npm package | Yes |

### Examples

**Add local plugin:**

```bash
framework plugin add ./my-plugin.mjs
```

**Add npm package:**

```bash
framework plugin add @company/framework-plugin
```

**Add from GitHub:**

```bash
framework plugin add github:user/repo/plugin.mjs
```

### Output

```
✅ Plugin added: my-plugin
   Version: 1.0.0
   Hooks: pre:export, post:export
```

## framework plugin remove

Remove a plugin.

### Synopsis

```bash
framework plugin remove <name>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `name` | Plugin name | Yes |

### Example

```bash
framework plugin remove my-plugin
```

### Output

```
✅ Plugin removed: my-plugin
```

## framework plugin list

List all installed plugins.

### Synopsis

```bash
framework plugin list
```

### Example

```bash
framework plugin list
```

### Output

```
📦 Installed Plugins:

my-validation-plugin
  Version: 1.0.0
  Path: ./my-validation-plugin.mjs
  Hooks: pre:export, post:export
  Added: 1/15/2025

slack-notifier
  Version: 1.2.0
  Path: @company/slack-plugin
  Hooks: post:export, post:deploy
  Added: 1/10/2025

Total: 2 plugins
```

## framework plugin hooks

Show available hook points.

### Synopsis

```bash
framework plugin hooks
```

### Example

```bash
framework plugin hooks
```

### Output

```
📦 Available Hooks:

Export Lifecycle:
  pre:export             - Before export starts
  pre:export:clone       - Before cloning template
  post:export:clone      - After cloning template
  post:export            - After export completes

Build Lifecycle:
  pre:build              - Before build starts
  post:build             - After build completes

Deploy Lifecycle:
  pre:deploy             - Before deployment
  post:deploy            - After deployment

Test Lifecycle:
  pre:test               - Before tests run
  post:test              - After tests complete

Doctor/Health:
  pre:doctor             - Before health check
  post:doctor            - After health check

Configuration:
  config:loaded          - After config is loaded
  config:validated       - After config is validated

See Plugin API documentation for details:
https://github.com/jrdaws/framework/docs/PLUGIN_API.md
```

## framework plugin info

Show detailed information about a plugin.

### Synopsis

```bash
framework plugin info <path>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `path` | Path to plugin file | Yes |

### Example

```bash
framework plugin info ./my-plugin.mjs
```

### Output

```
📦 Plugin Information

Name:         my-plugin
Version:      1.0.0
Description:  Validates project configuration before export
Author:       Your Name

Capabilities: export, validation

Hooks:
  pre:export   - Validates project name and directory
  post:export  - Logs export completion

Valid: ✅ Plugin structure is correct

To install:
  framework plugin add ./my-plugin.mjs
```

## Creating Plugins

### Plugin Structure

```javascript
// my-plugin.mjs
export default {
  name: "my-plugin",
  version: "1.0.0",
  description: "My custom plugin",
  author: "Your Name",
  capabilities: ["export"],

  hooks: {
    "pre:export": async (context) => {
      console.log(`Starting export: ${context.projectName}`);
      return { success: true };
    },

    "post:export": async (context) => {
      console.log(`Export complete: ${context.projectDir}`);
      return { success: true };
    }
  }
};
```

### Hook Context

Each hook receives a context object:

```typescript
{
  templateId: string;
  projectDir: string;
  projectName: string;
  flags: object;
  // ... more fields depending on hook
}
```

### Hook Return Value

Hooks must return:

```typescript
{
  success: boolean;        // Required
  message?: string;        // Optional
  data?: any;             // Optional
  skipNext?: boolean;     // Optional
}
```

## Plugin Examples

### Validation Plugin

```javascript
export default {
  name: "validation-plugin",
  version: "1.0.0",

  hooks: {
    "pre:export": async (context) => {
      // Validate project name
      if (!/^[a-z0-9-]+$/.test(context.projectName)) {
        return {
          success: false,
          message: "Project name must be lowercase alphanumeric"
        };
      }

      return { success: true };
    }
  }
};
```

### Notification Plugin

```javascript
export default {
  name: "slack-notifier",
  version: "1.0.0",

  hooks: {
    "post:export": async (context) => {
      await fetch('https://hooks.slack.com/services/YOUR/WEBHOOK', {
        method: 'POST',
        body: JSON.stringify({
          text: `✅ Project exported: ${context.projectName}`
        })
      });

      return { success: true };
    }
  }
};
```

### Git Automation Plugin

```javascript
import { execSync } from 'child_process';

export default {
  name: "git-auto-commit",
  version: "1.0.0",

  hooks: {
    "post:export": async (context) => {
      // Auto-commit after export
      execSync('git add .', { cwd: context.projectDir });
      execSync('git commit -m "Initial commit from framework"', {
        cwd: context.projectDir
      });

      return {
        success: true,
        message: "Auto-committed changes"
      };
    }
  }
};
```

## Plugin Workflow

### Development Workflow

```bash
# 1. Create plugin file
cat > my-plugin.mjs << 'EOF'
export default {
  name: "my-plugin",
  version: "1.0.0",
  hooks: {
    "pre:export": async (ctx) => {
      console.log("Hook running!");
      return { success: true };
    }
  }
};
EOF

# 2. Validate plugin structure
framework plugin info ./my-plugin.mjs

# 3. Add plugin
framework plugin add ./my-plugin.mjs

# 4. Test with export
framework export saas ./test-app

# 5. Remove plugin
framework plugin remove my-plugin
```

### Publishing Workflow

```bash
# 1. Create npm package
mkdir my-framework-plugin
cd my-framework-plugin
npm init

# 2. Add plugin file
# Create plugin.mjs with your plugin code

# 3. Publish to npm
npm publish

# 4. Users can install
framework plugin add @yourname/my-framework-plugin
```

## Plugin Storage

Plugins are stored in `.dd/plugins.json`:

```json
{
  "plugins": [
    {
      "name": "my-plugin",
      "version": "1.0.0",
      "path": "./my-plugin.mjs",
      "hooks": ["pre:export", "post:export"],
      "addedAt": "2025-01-20T10:00:00Z"
    }
  ]
}
```

## Common Issues

### Plugin Not Loading

**Error:**
```
❌ Failed to load plugin: SyntaxError
```

**Solutions:**
1. Check plugin syntax is valid JavaScript
2. Ensure default export exists
3. Validate with: `framework plugin info ./plugin.mjs`

### Hook Not Running

**Error:**
Plugin installed but hook doesn't run

**Solutions:**
1. Verify plugin is installed: `framework plugin list`
2. Check hook name is correct: `framework plugin hooks`
3. Ensure hook returns success: `{ success: true }`

### Missing Dependencies

**Error:**
```
❌ Cannot find module 'some-package'
```

**Solutions:**
1. Install dependencies where plugin runs
2. Document plugin dependencies
3. Use try-catch for graceful errors

## Best Practices

1. **Fail fast** - Return `{ success: false }` immediately on errors
2. **Provide messages** - Include helpful error messages
3. **Handle errors** - Wrap logic in try-catch
4. **Keep hooks fast** - Don't block export process
5. **Version plugins** - Use semantic versioning
6. **Document dependencies** - List required packages

## Next Steps

- **[Plugin API Documentation →](../PLUGIN_API.md)** - Complete API reference
- **[Plugin Examples →](../docs/examples/)** - Example plugins
- **[Create Your First Plugin →](../guides/creating-plugins.md)** - Tutorial

## Related Commands

- [`framework export`](export.md) - Uses plugins during export
- [`framework deploy`](deploy.md) - Uses plugins during deployment

## See Also

- [Plugin API](../PLUGIN_API.md) - Complete plugin documentation
- [Hook Reference](../PLUGIN_API.md#available-hooks) - All available hooks
- [Example Plugins](../docs/examples/) - Reference implementations
