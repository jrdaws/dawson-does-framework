# Contributing to Dawson Does Framework

Thank you for your interest in contributing! This document provides guidelines and patterns for contributing to the framework.

---

## Table of Contents

- [Getting Started](#getting-started)
- [CLI Patterns](#cli-patterns)
- [Code Style](#code-style)
- [Testing](#testing)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/jrdaws/dawson-does-framework.git
cd dawson-does-framework

# Install dependencies
npm install

# Run tests
npm test

# Test CLI locally
npm link
framework version
```

### Project Structure

```
dawson-does-framework/
├── bin/framework.js       # Main CLI entry point
├── src/
│   ├── dd/                # Core framework modules (.mjs)
│   └── commands/          # CLI command implementations (.mjs)
├── templates/             # Starter templates (TypeScript)
├── website/               # Web configurator (TypeScript + Next.js)
├── tests/                 # Test files
└── docs/                  # Documentation
```

---

## CLI Patterns

When adding or modifying CLI commands, follow these patterns to ensure consistency across the framework.

### 1. Help Flag Handling

**All commands must support help flags**: `--help`, `-h`, and `help`

#### Pattern

```javascript
async function cmdExport(templateId, projectDir, restArgs) {
  // Handle help flag FIRST, before any validation
  if (!templateId || templateId === "--help" || templateId === "-h" || templateId === "help") {
    console.log(`Usage: framework export <templateId> <projectDir> [options]

Export a template to create a new project.

Arguments:
  templateId    Template to export (see list below)
  projectDir    Output directory for the project

Options:
  --name <name>    Project name
  --dry-run        Preview without creating files
  --force          Overwrite existing directory

Examples:
  framework export saas ./my-app
  framework export saas ./my-app --force
`);
    return; // Exit without error code
  }

  // Continue with command logic...
}
```

#### Rules

✅ **DO:**
- Check for help flags before any validation
- Use `console.log` for help text (stdout)
- Return without calling `process.exit()` (implicit exit code 0)
- Include usage, arguments, options, and examples
- List all available flags

❌ **DON'T:**
- Use `console.error` for help text
- Call `process.exit(1)` for help
- Skip help flag support

### 2. Error Message Format

Use the standardized error helpers from `src/dd/logger.mjs`:

#### showError() - For Errors

```javascript
import { showError } from '../src/dd/logger.mjs'

// Full error with reasons and solutions
showError('Project not found', {
  reasons: [
    'Token is incorrect or misspelled',
    'Project was deleted',
    'Token has expired (projects expire after 30 days)'
  ],
  solutions: [
    'Check the token is correct',
    'Create a new project at https://dawson.dev/configure',
    'Contact support if problem persists'
  ]
  // exit: true is default
})

// Simple error
showError('Invalid template name')

// Non-fatal error (for testing or warnings)
showError('Configuration warning', {
  reasons: ['Using default configuration'],
  exit: false
})
```

**Output:**
```
❌ Project not found

Possible reasons:
  • Token is incorrect or misspelled
  • Project was deleted
  • Token has expired (projects expire after 30 days)

💡 Solutions:
  1. Check the token is correct
  2. Create a new project at https://dawson.dev/configure
  3. Contact support if problem persists
```

#### showWarning() - For Warnings

```javascript
import { showWarning } from '../src/dd/logger.mjs'

showWarning('Directory already exists', {
  details: ['./my-app contains 5 files'],
  suggestions: [
    'Use --force to overwrite',
    'Choose a different directory',
    'Backup existing files first'
  ]
})
```

#### showInfo() - For Information

```javascript
import { showInfo } from '../src/dd/logger.mjs'

showInfo('Configuration loaded', {
  details: [
    'Template: saas',
    'Integrations: 3 active',
    'Auth: supabase'
  ]
})
```

#### showSuccess() - For Success Messages

```javascript
import { showSuccess } from '../src/dd/logger.mjs'

showSuccess('Project created successfully', {
  details: [
    'Location: ./my-app',
    'Template: saas'
  ],
  nextSteps: [
    'cd my-app',
    'npm install',
    'npm run dev'
  ]
})
```

#### Error Message Pattern: What → Why → How

1. **What went wrong**: Clear error message
2. **Why it happened**: Possible reasons
3. **How to fix**: Actionable solutions

### 3. Flag Parsing

Create dedicated parser functions for each command:

```javascript
export function parseCommandFlags(args) {
  const flags = {
    dryRun: false,
    force: false,
    name: null,
  }

  const hasValue = (idx) => args[idx + 1] && !args[idx + 1].startsWith("--")

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--dry-run') {
      flags.dryRun = true
    } else if (arg === '--force') {
      flags.force = true
    } else if (arg === '--name' && hasValue(i)) {
      flags.name = args[++i]
    }
  }

  return flags
}
```

#### Rules

✅ **DO:**
- Create dedicated parser functions
- Return an object with default values
- Use camelCase for flag names
- Check for value existence with `hasValue()`
- Increment index when consuming value (`++i`)

❌ **DON'T:**
- Parse flags inline in command function
- Assume values exist without checking
- Use snake_case for flag names

### 4. Exit Codes

Use consistent exit codes:

| Exit Code | Meaning | When to Use |
|-----------|---------|-------------|
| `0` (implicit) | Success | Command completed successfully |
| `1` | Error | Command failed, user error, validation error |

```javascript
// Success (implicit)
return

// Error
showError('Invalid input')  // exits with code 1 by default

// Manual exit
process.exit(1)
```

### 5. Dry-Run Support

For commands that make changes, support `--dry-run`:

```javascript
if (flags.dryRun) {
  console.log("DRY RUN - The following operations would be performed:\n")
  console.log(`Project: ${projectName}`)
  console.log(`Directory: ${absProjectDir}`)
  console.log("")

  console.log(`[1/3] Clone template`)
  console.log(`      Source: ${template}`)
  console.log(`      Destination: ${dir}`)

  console.log(`\n[2/3] Apply integrations`)
  // ... list operations

  console.log(`\n[3/3] Initialize git`)
  // ... list operations

  console.log("\n" + "─".repeat(60))
  console.log("DRY RUN complete. No changes made.")
  console.log("Run without --dry-run to execute these operations.")
  return
}

// Actual operations...
```

### 6. Emoji Usage

Use consistent emojis for visual feedback:

| Emoji | Meaning | Usage |
|-------|---------|-------|
| ✅ | Success | Completed operations, success messages |
| ❌ | Error | Error messages, failed operations |
| ⚠️ | Warning | Warnings, non-fatal issues |
| ℹ️ | Info | Informational messages |
| 🔍 | Searching | Detection, searching operations |
| 📦 | Package | Export, template operations |
| 🚀 | Deploy | Deployment operations |
| 💡 | Tip | Suggestions, tips |
| 🤖 | AI | AI-related operations |

### 7. Output Method

Follow Unix conventions:

```javascript
// Help text → stdout
console.log("Usage: framework command [options]")

// Error messages → stderr
console.error("❌ Command failed")

// Info/warnings → stdout
console.log("ℹ️ Configuration loaded")

// Use logger helpers (they handle this automatically)
import { log, error } from '../src/dd/logger.mjs'
log("Info message")    // → stdout
error("Error message") // → stderr
```

### 8. Command Structure Template

```javascript
/**
 * Command: framework mycommand
 * Description: Brief description of what this command does
 */
async function cmdMyCommand(arg1, arg2, restArgs) {
  // 1. Handle help flag
  if (!arg1 || arg1 === "--help" || arg1 === "-h" || arg1 === "help") {
    console.log(`Usage: framework mycommand <arg1> <arg2> [options]

Description of the command.

Arguments:
  arg1    Description of arg1
  arg2    Description of arg2

Options:
  --flag1    Description of flag1
  --flag2    Description of flag2

Examples:
  framework mycommand value1 value2
  framework mycommand value1 value2 --flag1
`)
    return
  }

  // 2. Parse flags
  const flags = parseMyCommandFlags(restArgs || [])

  // 3. Validate arguments
  if (!arg2) {
    showError('Missing required argument: arg2', {
      solutions: [
        'Provide arg2: framework mycommand <arg1> <arg2>',
        'Run framework mycommand --help for usage'
      ]
    })
  }

  // 4. Dry-run preview (if applicable)
  if (flags.dryRun) {
    console.log("DRY RUN - The following operations would be performed:\n")
    // ... show what would happen
    return
  }

  // 5. Perform operations with feedback
  console.log("🔍 Starting operation...")

  try {
    // ... do work

    showSuccess('Operation completed', {
      details: ['Result: success'],
      nextSteps: ['Next step 1', 'Next step 2']
    })
  } catch (error) {
    showError('Operation failed', {
      reasons: ['Reason 1', 'Reason 2'],
      solutions: ['Solution 1', 'Solution 2']
    })
  }
}
```

---

## Code Style

### JavaScript (.mjs files)

- **No semicolons**
- **2-space indentation**
- **ESM imports/exports**
- **camelCase** for functions/variables
- **PascalCase** for classes

```javascript
// ✅ Good
import path from 'node:path'
import { log } from './logger.mjs'

export async function myFunction(arg) {
  const result = await processArg(arg)
  return result
}

// ❌ Bad
import path from 'node:path';  // No semicolons!
import { log } from './logger.mjs';

export async function myFunction(arg) {
  const result = await processArg(arg);
  return result;
}
```

### TypeScript (.ts/.tsx files)

- **Use semicolons**
- **2-space indentation**
- **Explicit types** where not inferred
- **PascalCase** for components/interfaces

```typescript
// ✅ Good
export interface ProjectConfig {
  name: string;
  template: string;
}

export async function createProject(config: ProjectConfig): Promise<void> {
  // ...
}
```

---

## Testing

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- tests/cli/pull.test.mjs

# Watch mode
npm test -- --watch
```

### Writing Tests

```javascript
// tests/cli/mycommand.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { myFunction } from '../../src/dd/mymodule.mjs'

test('myFunction returns expected result', () => {
  const result = myFunction('input')
  assert.equal(result, 'expected')
})

test('myFunction handles errors', () => {
  assert.throws(() => myFunction(null), {
    message: /required/
  })
})
```

### Test Requirements

- ✅ Unit tests for all new functions
- ✅ Integration tests for CLI commands
- ✅ All tests must pass before committing
- ✅ Maintain or improve code coverage

---

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `chore`: Maintenance tasks
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `perf`: Performance improvements

### Examples

```bash
# Feature
feat(cli): add help flag support to export command

# Fix
fix(pull): handle expired tokens correctly

# Documentation
docs(cli): add CLI patterns to CONTRIBUTING.md

# Chore
chore: bump version to 0.3.2
```

### Commit Message Rules

✅ **DO:**
- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor" not "moves cursor")
- Keep subject line under 72 characters
- Reference issues in footer (`Fixes #123`)

❌ **DON'T:**
- Capitalize first letter of subject
- End subject line with period
- Include implementation details in subject

---

## Pull Request Process

### Before Submitting

1. **Run tests**: `npm test`
2. **Run linting**: `npm run lint` (if available)
3. **Test manually**: Verify your changes work
4. **Update docs**: Document new features
5. **Follow patterns**: Use CLI patterns from this guide

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] All tests pass
- [ ] Added new tests
- [ ] Tested manually

## Checklist
- [ ] Follows CLI patterns
- [ ] Includes documentation
- [ ] Uses conventional commits
- [ ] No breaking changes (or documented)
```

### Review Process

1. Submit PR with clear description
2. Wait for automated checks to pass
3. Address review feedback
4. Maintainer will merge when ready

---

## Questions?

- **Documentation**: Check [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/jrdaws/framework/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jrdaws/framework/discussions)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
