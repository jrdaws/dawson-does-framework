# framework upgrade

Update the framework to the latest version.

## Synopsis

```bash
framework upgrade [--dry-run]
```

## Description

Checks for framework updates and upgrades to the latest version. Always backs up before upgrading.

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Check for updates without installing |

## Examples

### Check for Updates

```bash
framework upgrade --dry-run
```

**Output:**
```
🔍 Checking for updates...

Current version: 0.2.0
Latest version:  0.3.0

✨ Update available!

Changelog:
  - Add deployment commands (deploy, deploy:auth)
  - Improve template detection
  - Fix integration validation
  - Update dependencies

To upgrade:
  framework upgrade
```

### Upgrade

```bash
framework upgrade
```

**Output:**
```
🔍 Checking for updates...

Current version: 0.2.0
Latest version:  0.3.0

📦 Upgrading framework...

✅ Upgrade complete!
   Version: 0.3.0

What's new:
  - Deploy commands added
  - Better template detection
  - Integration improvements

Run 'framework help' to see new features
```

### Already Up to Date

```bash
framework upgrade
```

**Output:**
```
🔍 Checking for updates...

✅ Already up to date!
   Current version: 0.3.0
   Latest version:  0.3.0

No updates available.
```

## Upgrade Process

1. **Check current version**
2. **Query npm registry for latest**
3. **Show changelog**
4. **Confirm upgrade**
5. **Install new version**
6. **Verify installation**

## Version Management

### Check Version

```bash
framework version
```

### Manual Upgrade

```bash
npm update -g @jrdaws/framework
```

### Install Specific Version

```bash
npm install -g @jrdaws/framework@0.3.0
```

## Changelog

View changelog:

```bash
# Online
open https://github.com/jrdaws/framework/blob/main/CHANGELOG.md

# Local
cat $(npm root -g)/@jrdaws/framework/CHANGELOG.md
```

## Breaking Changes

Major version updates may have breaking changes. Review changelog before upgrading.

### Backup Before Upgrade

```bash
# Create backup
npm pack @jrdaws/framework

# Upgrade
framework upgrade

# If issues, restore
npm install -g jrdaws-framework-0.2.0.tgz
```

## Common Issues

### Permission Denied

**Error:**
```
❌ Permission denied
```

**Solution:**
```bash
# Use sudo (not recommended)
sudo npm install -g @jrdaws/framework

# Or fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g @jrdaws/framework
```

### Network Error

**Error:**
```
❌ Failed to fetch updates
```

**Solution:**
1. Check internet connection
2. Try again
3. Manual upgrade: `npm update -g @jrdaws/framework`

## Next Steps

After upgrading, review new features:

```bash
framework help
```

## Related Commands

- [`framework version`](version.md) - Show version

## See Also

- [Changelog](../../CHANGELOG.md) - Version history
- [Migration Guides](../guides/migrations/) - Upgrade guides
