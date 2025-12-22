# Installation

Install the Dawson Does Framework and get ready to build.

## System Requirements

### Required

- **Node.js 18 or higher** - [Download](https://nodejs.org/)
- **npm 9 or higher** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Optional

- **Code editor** - VS Code, Cursor, WebStorm, etc.
- **Terminal** - Built-in or iTerm2, Hyper, etc.

### Verify Prerequisites

Check your versions:

```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version   # Any version works
```

**If you need to update Node.js:**

- **macOS/Linux:** Use [nvm](https://github.com/nvm-sh/nvm)
- **Windows:** Download from [nodejs.org](https://nodejs.org/)

## Installation Methods

Choose the method that works best for you.

### Method 1: Global Install (Recommended)

Best for regular use. Installs the `framework` command globally.

```bash
npm install -g @jrdaws/framework
```

**Verify installation:**

```bash
framework version
```

**Expected output:**
```
v0.3.0
```

**Pros:**
- ✅ Fast - command available everywhere
- ✅ Simple - just type `framework`
- ✅ One-time installation

**Cons:**
- ⚠️ Requires global npm permissions
- ⚠️ Version not locked per project

**When to use:**
- You're the primary developer
- You want to use the framework across multiple projects
- You have admin/sudo access

### Method 2: One-Time Use (npx)

Best for trying out the framework. No installation needed.

```bash
npx @jrdaws/framework export saas ./my-app
```

**Pros:**
- ✅ No installation required
- ✅ Always uses latest version
- ✅ No global permissions needed

**Cons:**
- ⚠️ Slower (downloads each time)
- ⚠️ Not suitable for frequent use

**When to use:**
- First time trying the framework
- One-off project creation
- CI/CD pipelines (always latest)

### Method 3: Local Project Dependency

Best for team projects. Framework version locked in package.json.

```bash
# In your project directory
npm install --save-dev @jrdaws/framework

# Use via npx
npx framework export saas ./my-app
```

**Pros:**
- ✅ Version locked for consistency
- ✅ Same version for all team members
- ✅ Works in CI/CD without global install

**Cons:**
- ⚠️ Need to install in each project
- ⚠️ Slightly longer command (npx)

**When to use:**
- Working in a team
- Version consistency is important
- Monorepo or workspace setup

## Platform-Specific Installation

### macOS

#### Using npm (Recommended)

```bash
npm install -g @jrdaws/framework
```

#### Using Homebrew (Coming Soon)

```bash
brew install dawson-does-framework
```

#### Troubleshooting: Permission Denied

If you get permission errors:

**Option 1: Use nvm (Recommended)**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js via nvm
nvm install 20
nvm use 20

# Now install framework (no sudo needed)
npm install -g @jrdaws/framework
```

**Option 2: Fix npm permissions**

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

npm install -g @jrdaws/framework
```

**Option 3: Use sudo (Not recommended)**

```bash
sudo npm install -g @jrdaws/framework
```

### Linux

#### Ubuntu/Debian

```bash
# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install framework
npm install -g @jrdaws/framework
```

#### Fedora/RHEL/CentOS

```bash
# Install Node.js (if not installed)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install framework
npm install -g @jrdaws/framework
```

#### Arch Linux

```bash
# Install Node.js (if not installed)
sudo pacman -S nodejs npm

# Install framework
npm install -g @jrdaws/framework
```

### Windows

#### Using npm

Open PowerShell or Command Prompt:

```bash
npm install -g @jrdaws/framework
```

#### Using Chocolatey (Coming Soon)

```bash
choco install dawson-does-framework
```

#### Troubleshooting: Execution Policy

If you get execution policy errors:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Docker

Run the framework in a container:

```bash
# Pull image (coming soon)
docker pull jrdaws/framework:latest

# Run command
docker run --rm -v $(pwd):/app jrdaws/framework export saas ./my-app
```

**Create alias for convenience:**

```bash
# Add to ~/.bashrc or ~/.zshrc
alias framework='docker run --rm -v $(pwd):/app jrdaws/framework'

# Use normally
framework version
framework export saas ./my-app
```

## Verify Installation

After installation, verify everything works:

### Check Version

```bash
framework version
```

**Expected output:**
```
v0.3.0
```

### Check Help

```bash
framework help
```

**Expected output:**
```
Usage: framework <command> [options]

Commands:
  export <template> <dir>     Create project from template
  pull <token>                Pull project from web configurator
  deploy                      Deploy to production
  templates                   Browse templates
  ...
```

### Test Command

```bash
framework templates list
```

**Expected output:**
```
📦 Available Templates:

saas
  SaaS Starter - Full-stack with auth, billing, database
  Category: SaaS

dashboard
  Admin Dashboard - Data tables, charts, settings
  Category: Dashboard

...
```

## Updating

Keep the framework up to date to get the latest features and fixes.

### Check for Updates

```bash
framework upgrade --dry-run
```

This shows available updates without installing them.

### Update to Latest Version

```bash
framework upgrade
```

Or manually:

```bash
npm update -g @jrdaws/framework
```

### Update to Specific Version

```bash
npm install -g @jrdaws/framework@0.3.0
```

### View Changelog

```bash
# Visit changelog online
open https://github.com/jrdaws/framework/blob/main/CHANGELOG.md

# Or view locally if installed
cat $(npm root -g)/@jrdaws/framework/CHANGELOG.md
```

## Uninstallation

If you need to remove the framework:

### Global Installation

```bash
npm uninstall -g @jrdaws/framework
```

### Local Installation

```bash
npm uninstall @jrdaws/framework
```

### Clean Up

Remove cached files (optional):

```bash
rm -rf ~/.dd
rm -rf ~/.npm/_cacache/@jrdaws
```

## Configuration

The framework stores configuration in `~/.dd/`:

```
~/.dd/
├── credentials.json    # Deployment credentials (secure)
├── config.json         # Global framework config
└── plugins.json        # Installed plugins
```

### View Configuration

```bash
# Credentials
cat ~/.dd/credentials.json

# Config
cat ~/.dd/config.json
```

### Reset Configuration

```bash
rm -rf ~/.dd
```

This removes all saved credentials and settings. You'll need to reconfigure deployment providers.

## IDE Integration

### VS Code

Install recommended extensions:

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - CSS autocomplete
4. **TypeScript** - Built-in

### Cursor

The framework has native Cursor support:

```bash
framework pull <token> --cursor --open
```

This generates `.cursorrules` and opens the project in Cursor.

### WebStorm/IntelliJ

Configuration works out of the box. Enable:
- TypeScript support
- ESLint
- Prettier
- Tailwind CSS

## Environment Setup

### Shell Completion (Coming Soon)

Add autocomplete to your shell:

```bash
# Bash
framework completion bash >> ~/.bashrc

# Zsh
framework completion zsh >> ~/.zshrc

# Fish
framework completion fish > ~/.config/fish/completions/framework.fish
```

### Aliases

Add convenient aliases:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias fw='framework'
alias fwe='framework export'
alias fwd='framework deploy'
alias fwt='framework templates'
```

## CI/CD Installation

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install framework
        run: npm install -g @jrdaws/framework

      - name: Deploy
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: framework deploy --prod
```

### GitLab CI

```yaml
deploy:
  stage: deploy
  image: node:20
  script:
    - npm install -g @jrdaws/framework
    - framework deploy --prod
  variables:
    VERCEL_TOKEN: $VERCEL_TOKEN
  only:
    - main
```

### CircleCI

```yaml
version: 2.1
jobs:
  deploy:
    docker:
      - image: node:20
    steps:
      - checkout
      - run: npm install -g @jrdaws/framework
      - run: framework deploy --prod
```

## Troubleshooting

### "command not found: framework"

**Cause:** Framework not in PATH or not installed

**Solutions:**

1. **Reinstall:**
   ```bash
   npm install -g @jrdaws/framework
   ```

2. **Check PATH:**
   ```bash
   echo $PATH
   npm config get prefix
   ```

3. **Use full path:**
   ```bash
   $(npm config get prefix)/bin/framework version
   ```

### "EACCES: permission denied"

**Cause:** Insufficient permissions for global install

**Solutions:**

1. **Use nvm (Recommended):**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 20
   npm install -g @jrdaws/framework
   ```

2. **Fix npm permissions:**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   npm install -g @jrdaws/framework
   ```

3. **Use sudo (Not recommended):**
   ```bash
   sudo npm install -g @jrdaws/framework
   ```

### "npm ERR! code UNABLE_TO_GET_ISSUER_CERT_LOCALLY"

**Cause:** Corporate proxy or SSL issues

**Solutions:**

1. **Disable SSL (temporary):**
   ```bash
   npm config set strict-ssl false
   npm install -g @jrdaws/framework
   npm config set strict-ssl true
   ```

2. **Set proxy:**
   ```bash
   npm config set proxy http://proxy.company.com:8080
   npm config set https-proxy http://proxy.company.com:8080
   ```

3. **Use company registry:**
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

### "Version mismatch"

**Cause:** Old cached version

**Solutions:**

```bash
npm cache clean --force
npm install -g @jrdaws/framework
```

## Next Steps

Now that you have the framework installed:

1. **[Create Your First Project →](first-project.md)**
2. **[Browse Templates →](../templates/README.md)**
3. **[Learn the CLI →](../cli/README.md)**

## Getting Help

- **Documentation:** [docs/](../)
- **Issues:** [GitHub Issues](https://github.com/jrdaws/framework/issues)
- **Discussions:** [GitHub Discussions](https://github.com/jrdaws/framework/discussions)
