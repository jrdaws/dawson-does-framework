# Release Notes: v0.3.1 - Test Improvements & Bug Fixes

**Release Date:** December 22, 2025
**Tag:** v0.3.1
**Commit:** 5e8cd30
**NPM Package:** [@jrdaws/framework@0.3.1](https://www.npmjs.com/package/@jrdaws/framework/v/0.3.1)

---

## 📝 Summary

Patch release focused on test stability, documentation, and bug fixes. This release enhances the test suite and improves overall quality metrics.

---

## ✨ What's New

### 1. Enhanced Test Suite
- **Expanded coverage**: 457/472 tests passing (96.8%)
- **Zero failures**: All critical tests pass
- **Improved stability**: Fixed flaky tests and edge cases
- **Better documentation**: Added comprehensive test coverage docs

### 2. Agent Governance System
- Added `AGENT_CONTEXT.md` with mandatory verification questions
- Enforces context awareness for AI agents working on the codebase
- Includes coding standards, architecture overview, and forbidden actions

### 3. Projects API Integration
- Completed website Projects API endpoints
- Full integration with CLI pull command
- Enhanced project configuration handling

### 4. Logger Test Improvements
- Comprehensive logger test coverage
- Fixed edge cases in logging system
- Improved error handling tests

---

## 🐛 Bug Fixes

### Test Failures Resolved
- Fixed config-schema tests (7 tests using wrong API)
- Removed build artifacts from templates (node_modules, .next)
- Fixed template validation tests
- Cleaned up untracked test files causing failures

### Template Improvements
- Removed node_modules from blog, dashboard, landing-page templates
- Removed package-lock.json files from templates
- Cleaned .next build directories

---

## 📊 Quality Metrics

### Test Coverage
- **Total tests**: 472
- **Passing**: 457 (96.8%)
- **Skipped**: 15 (Stripe TypeScript tests)
- **Failing**: 0
- **Coverage**: 52.25% overall, 77.95% core modules

### Package Statistics
- **Package size**: 369.4 kB
- **Unpacked size**: 1.4 MB
- **Total files**: 316
- **Dependencies**: 8

---

## 🔧 Technical Changes

### Commits in This Release
1. `5e8cd30` - chore: bump version to 0.3.1
2. `b39f514` - chore: update framework map after test additions
3. `d710faf` - docs(governance): add mandatory agent context verification system
4. `b33247a` - feat(website): complete Projects API and CLI pull integration
5. `8d8aab8` - docs(test): add comprehensive test coverage documentation and improve logger tests
6. `570a242` - fix(tests): fix all failing tests and improve coverage to 78% (core)

### Files Modified
- `package.json` - Version bump to 0.3.1
- `AGENT_CONTEXT.md` - New governance documentation
- `FRAMEWORK_MAP.md` - Updated with test additions
- `docs/test/` - New test coverage documentation
- `tests/dd/config-schema.test.mjs` - Fixed to use validateConfig()
- Template directories - Cleaned build artifacts

---

## 📦 Installation

### NPM Installation
```bash
# Global installation
npm install -g @jrdaws/framework@0.3.1

# Direct usage with npx
npx @jrdaws/framework@0.3.1 pull <token>

# Add to project
npm install --save-dev @jrdaws/framework@0.3.1
```

### Verify Installation
```bash
framework version
# Output: @jrdaws/framework 0.3.1
```

---

## 🔄 Upgrading from v0.3.0

This is a patch release with no breaking changes. To upgrade:

```bash
# If installed globally
npm update -g @jrdaws/framework

# Or reinstall
npm install -g @jrdaws/framework@0.3.1
```

### What's Changed
- Improved test stability (no breaking changes)
- Enhanced documentation
- Bug fixes only

**No migration steps required** - this is a drop-in replacement for v0.3.0.

---

## 🚀 Getting Started

### Pull a Project from Web Platform
```bash
# Visit https://dawson.dev and configure your project
# Get your project token (e.g., swift-eagle-1234)

framework pull swift-eagle-1234 --cursor --open
```

### Export a Template Locally
```bash
framework export saas ./my-saas-app --auth supabase --payments stripe
cd my-saas-app
npm install
npm run dev
```

### List Available Templates
```bash
framework templates list
```

---

## 📚 Documentation

### New Documentation
- **AGENT_CONTEXT.md** - Governance system for AI agents
- **docs/test/** - Test coverage documentation

### Updated Documentation
- Test coverage metrics
- Framework map with test additions

### Full Documentation
- [CLI Documentation](https://github.com/jrdaws/dawson-does-framework/tree/main/docs/cli)
- [Getting Started Guide](https://github.com/jrdaws/dawson-does-framework/tree/main/docs/getting-started)
- [Template Documentation](https://github.com/jrdaws/dawson-does-framework/tree/main/docs/templates)
- [Integration Guides](https://github.com/jrdaws/dawson-does-framework/tree/main/docs/integrations)

---

## 🧪 Testing

Run the test suite:

```bash
# Clone the repository
git clone https://github.com/jrdaws/dawson-does-framework.git
cd dawson-does-framework

# Install dependencies
npm install

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific suites
npm run test:cli            # CLI unit tests
npm run test:integration    # Integration tests
```

---

## 🐛 Known Issues

### Skipped Tests
15 Stripe billing integration tests are skipped because they require TypeScript transpilation. These can be enabled by adding tsx or ts-node to the test runner.

**Workaround:**
```bash
# Install tsx
npm install -D tsx

# Run TypeScript tests
npx tsx tests/integration/billing.stripe.test.mjs
```

---

## 🔜 What's Next

### Planned for v0.4.0
- [ ] Deployment command improvements (`framework deploy`)
- [ ] Template marketplace integration
- [ ] Real-time collaboration in web editor
- [ ] AI-powered code generation API
- [ ] Additional templates (e-commerce, docs site)
- [ ] Enhanced CLI performance

---

## 🙏 Acknowledgments

This release includes:
- Test infrastructure improvements
- Agent governance system
- Bug fixes and stability enhancements
- Documentation updates

---

## 📝 Full Changelog

See the [commit history](https://github.com/jrdaws/dawson-does-framework/compare/v0.3.0...v0.3.1) for detailed changes.

### Key Improvements
- Enhanced test suite with 96.8% pass rate
- Added agent governance documentation
- Fixed template build artifact issues
- Improved Projects API integration
- Better error handling and logging

---

## 🔗 Links

- **GitHub Repository:** https://github.com/jrdaws/dawson-does-framework
- **NPM Package:** https://www.npmjs.com/package/@jrdaws/framework
- **Web Platform:** https://dawson.dev
- **Documentation:** https://github.com/jrdaws/dawson-does-framework/tree/main/docs
- **Issues:** https://github.com/jrdaws/dawson-does-framework/issues
- **Changelog:** https://github.com/jrdaws/dawson-does-framework/compare/v0.3.0...v0.3.1

---

## 💬 Feedback

Found a bug or have a feature request? Please [open an issue](https://github.com/jrdaws/dawson-does-framework/issues/new).

---

🤖 *Published to npm on December 22, 2025*

**Published by:** jrdaws
**Package:** @jrdaws/framework@0.3.1
**Registry:** https://registry.npmjs.org/@jrdaws/framework/-/framework-0.3.1.tgz
