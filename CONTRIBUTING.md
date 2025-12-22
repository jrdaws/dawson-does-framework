# Contributing to Dawson Does Framework

Thank you for your interest in contributing to Dawson Does Framework! We welcome contributions from the community and are excited to have you here.

This guide will help you understand how to contribute effectively to the project.

---

## 🌟 Ways to Contribute

We welcome many types of contributions:

- **Bug reports** - Found something broken? Let us know!
- **Feature requests** - Have an idea? We'd love to hear it
- **Code contributions** - Bug fixes, new features, or improvements
- **Documentation** - Help improve our docs, guides, or examples
- **Templates** - Create new templates for the community
- **Integration providers** - Add support for new services
- **Testing** - Help improve test coverage or find edge cases

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (verify with `node --version`)
- **npm** or **yarn**
- **Git** (verify with `git --version`)

### Setup

```bash
# 1. Fork the repository on GitHub
# (Click the "Fork" button at https://github.com/jrdaws/framework)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/framework.git
cd framework

# 3. Add upstream remote
git remote add upstream https://github.com/jrdaws/framework.git

# 4. Install dependencies
npm install

# 5. Run tests to verify setup
npm test

# 6. Link CLI for local testing
npm link

# 7. Verify CLI works
framework version
```

You're ready to contribute!

---

## 📝 Code Standards

We follow strict code standards to maintain consistency. **Please read these carefully before contributing.**

### Quick Reference

| Area | Language | Semicolons | Indent | File Extension |
|------|----------|------------|--------|----------------|
| CLI & Core | JavaScript ESM | ❌ **No** | 2 spaces | `.mjs` |
| Website | TypeScript | ✅ **Yes** | 2 spaces | `.ts`, `.tsx` |
| Config files | JavaScript | ✅ Yes | 2 spaces | `.js` |
| Tests | JavaScript ESM | ❌ **No** | 2 spaces | `.test.mjs` |

### Key Rules

1. **No semicolons in `.mjs` files** (CLI, core modules, tests)
2. **Semicolons required in `.ts` and `.tsx` files** (website)
3. **2-space indentation** everywhere
4. **Double quotes** for strings
5. **Import order**: Node.js built-ins → external packages → internal modules

### Example: JavaScript ESM (.mjs)

```javascript
// ✅ GOOD
import fs from "node:fs"
import path from "node:path"

export async function doSomething(input) {
  const result = await processInput(input)

  if (!result) {
    throw new Error("Processing failed")
  }

  return result
}
```

```javascript
// ❌ BAD - Has semicolons
import fs from "node:fs";
import path from "node:path";

export async function doSomething(input) {
  const result = await processInput(input);
  return result;
}
```

### Example: TypeScript (.ts)

```typescript
// ✅ GOOD
import { useState } from "react";

export function MyComponent({ title }: { title: string }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
```

### Detailed Standards

For complete code standards, see:
- **[Coding Standards](docs/standards/CODING_STANDARDS.md)** - Complete style guide
- **[API Contracts](docs/standards/API_CONTRACTS.md)** - API response formats
- **[File Structure](docs/standards/FILE_STRUCTURE.md)** - Project organization

---

## 🧪 Testing Requirements

**All code contributions must include tests.** We maintain high test coverage to ensure reliability.

### Requirements

- ✅ All tests must pass: `npm test`
- ✅ Coverage must remain **≥ 80%**: `npm run test:coverage`
- ✅ New features must include tests
- ✅ Bug fixes should include regression tests

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/cli/version.test.mjs

# Run with coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html

# Run CLI tests only
npm run test:cli

# Run integration tests only
npm run test:integration
```

### Writing Tests

We use Node.js built-in test runner. Follow the AAA pattern (Arrange-Act-Assert):

```javascript
import test from "node:test"
import assert from "node:assert/strict"
import { myFunction } from "../src/dd/my-module.mjs"

test("myFunction: returns correct value when given valid input", () => {
  // Arrange
  const input = "test"

  // Act
  const result = myFunction(input)

  // Assert
  assert.strictEqual(result, "expected")
})
```

For complete testing patterns, see **[Testing Standards](docs/standards/TESTING_STANDARDS.md)**.

---

## 🔀 Pull Request Process

### 1. Create a Branch

Use descriptive branch names following this pattern:

```bash
# For new features
git checkout -b feature/add-template-validation

# For bug fixes
git checkout -b fix/resolve-export-crash

# For documentation
git checkout -b docs/improve-api-guide

# For refactoring
git checkout -b refactor/simplify-manifest-logic
```

### 2. Make Your Changes

- Write clean, well-documented code
- Follow code standards (see above)
- Add tests for new functionality
- Update documentation as needed
- Keep commits focused and atomic

### 3. Commit Messages

We use **Conventional Commits** format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks
- `style`: Code style changes (formatting, etc.)

**Examples:**

```bash
# Good commit messages
git commit -m "feat(cli): add template validation command"
git commit -m "fix(export): resolve crash when output dir exists"
git commit -m "docs(readme): add deployment section"
git commit -m "test(manifest): add tests for version parsing"

# Bad commit messages
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP"
```

### 4. Update from Upstream

Before submitting, sync with the latest changes:

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push to Your Fork

```bash
git push origin your-branch-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template (see below)
4. Link related issues if applicable
5. Submit the PR

### PR Title Format

Use the same format as commit messages:

```
feat(cli): add template validation command
fix(export): resolve crash when output dir exists
docs(readme): add deployment section
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

## Checklist
- [ ] My code follows the code standards (CODING_STANDARDS.md)
- [ ] I have added tests that prove my fix/feature works
- [ ] All tests pass locally (`npm test`)
- [ ] Coverage is ≥ 80% (`npm run test:coverage`)
- [ ] I have updated documentation as needed
- [ ] My commits follow the conventional commit format
```

### 7. Code Review

- A maintainer will review your PR
- Address any requested changes
- Keep the conversation respectful and constructive
- Once approved, a maintainer will merge your PR

---

## 📚 Documentation Requirements

### When to Update Documentation

Update docs when you:
- Add a new feature or command
- Change existing behavior
- Add or modify configuration options
- Create new templates or integrations
- Fix bugs that affect documented behavior

### Documentation Style

- Use **second person** ("you" instead of "we" or "the user")
- Keep sentences **short and clear**
- Include **code examples** for everything
- Use **tables** for structured data
- Add **cross-references** to related docs

**Good:**
```markdown
You can export a template with this command:

\`\`\`bash
framework export saas ./my-app
\`\`\`

See [Templates Guide](docs/templates/README.md) for more options.
```

**Bad:**
```markdown
The user should use the export command to create projects.
```

### Documentation Locations

| Type | Location | Format |
|------|----------|--------|
| CLI commands | `docs/cli/` | Markdown |
| Standards | `docs/standards/` | Markdown |
| Guides | `docs/guides/` | Markdown |
| API docs | Inline JSDoc | JSDoc comments |
| Templates | `templates/*/README.md` | Markdown |

---

## 🎯 Specific Contribution Guides

### Adding a New Template

1. Create directory in `templates/`
2. Add `template.json` with metadata
3. Include complete Next.js project structure
4. Add README.md with setup instructions
5. Test export: `framework export your-template ./test-output`
6. Submit PR

See **[Template Registry](docs/TEMPLATE_REGISTRY.md)** for complete guide.

### Adding a New Integration

1. Create directory: `templates/{template}/integrations/{type}/{provider}/`
2. Add `integration.json` with metadata
3. Include all required files
4. Add environment variable examples
5. Test integration merging
6. Submit PR

See **[Integration Patterns](docs/standards/INTEGRATION_PATTERNS.md)** for details.

### Fixing a Bug

1. Create a test that reproduces the bug
2. Fix the bug
3. Verify the test now passes
4. Add regression test if needed
5. Update docs if behavior changed
6. Submit PR with "fix:" prefix

### Adding a Feature

1. Discuss the feature in an issue first (for large features)
2. Write tests for the new feature (TDD encouraged)
3. Implement the feature
4. Update documentation
5. Ensure all tests pass and coverage remains high
6. Submit PR with "feat:" prefix

---

## 🤖 For AI Agent Contributors

If you're an AI agent (like Claude Code or similar) contributing to this project:

### Required Reading

1. **[AGENT_CONTEXT.md](AGENT_CONTEXT.md)** - Core context for all agents
2. **[CLAUDE.md](CLAUDE.md)** - Automatic context for Claude Code CLI
3. **[CODING_STANDARDS.md](docs/standards/CODING_STANDARDS.md)** - Code style requirements

### Agent Workflow

1. **Read context** before starting work
2. **Identify your role** (CLI Agent, Documentation Agent, etc.)
3. **Complete assigned task** following all standards
4. **Update memory file** at session end
5. **Provide handoff** for next agent

### Memory Protocol

After completing work, update your role's memory file:
- File: `prompts/agents/memory/[ROLE]_MEMORY.md`
- Add session entry with date, duration, summary
- Record key decisions and reasoning
- Update task queue (mark done, add new)
- Add insights for next agent

See **[AGENT_CONTEXT.md](AGENT_CONTEXT.md)** for full agent guidelines.

---

## ❓ Questions or Issues?

### Getting Help

- **Documentation**: Check [docs/](docs/) first
- **GitHub Issues**: [github.com/jrdaws/framework/issues](https://github.com/jrdaws/framework/issues)
- **Discussions**: [github.com/jrdaws/framework/discussions](https://github.com/jrdaws/framework/discussions)
- **Discord**: Coming soon

### Reporting Bugs

Use the bug report template and include:
1. Framework version (`framework version`)
2. Node.js version (`node --version`)
3. Operating system
4. Steps to reproduce
5. Expected vs actual behavior
6. Error messages or logs

### Suggesting Features

Use the feature request template and include:
1. Problem you're trying to solve
2. Proposed solution
3. Alternative solutions considered
4. Examples or mockups if applicable

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for everyone, regardless of background or identity.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers warmly
- Give constructive feedback
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Any conduct that could reasonably be considered inappropriate

### Enforcement

Violations may result in temporary or permanent bans from the project. Report concerns to the maintainers.

---

## 🙏 Recognition

Contributors will be:
- Listed in release notes
- Added to CONTRIBUTORS.md (coming soon)
- Recognized in project acknowledgments

Thank you for helping make Dawson Does Framework better for everyone!

---

## 📖 Additional Resources

### For Contributors

- [Coding Standards](docs/standards/CODING_STANDARDS.md) - Complete style guide
- [API Contracts](docs/standards/API_CONTRACTS.md) - API response formats
- [Testing Standards](docs/standards/TESTING_STANDARDS.md) - Test patterns and coverage
- [File Structure](docs/standards/FILE_STRUCTURE.md) - Project organization
- [Glossary](docs/GLOSSARY.md) - Project terminology

### For Understanding the Project

- [README.md](README.md) - Project overview
- [Vision & Mission](docs/VISION_MISSION.md) - Project goals and principles
- [Architecture](FRAMEWORK_MAP.md) - System architecture and dependencies

---

**Ready to contribute?**

```bash
git clone https://github.com/YOUR_USERNAME/framework.git
cd framework
npm install
npm test
```

We're excited to see what you build! 🚀
