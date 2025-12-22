# framework version

Display the framework version.

## Synopsis

```bash
framework version
framework --version
framework -v
```

## Description

Shows the currently installed framework version.

## Example

```bash
framework version
```

**Output:**
```
v0.3.0
```

## Version Format

The framework uses [semantic versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─── Bug fixes
  │     └───────── New features (backwards compatible)
  └─────────────── Breaking changes
```

**Example:**
- `0.3.0` - Minor version 3, patch 0
- `1.0.0` - Major version 1 (stable release)
- `1.2.5` - Major 1, minor 2, patch 5

## Checking Latest Version

```bash
framework upgrade --dry-run
```

Shows current vs latest version.

## Version in Scripts

```bash
#!/bin/bash
VERSION=$(framework version)
echo "Using framework ${VERSION}"
```

## Related Commands

- [`framework upgrade`](upgrade.md) - Update framework

## See Also

- [Changelog](../../CHANGELOG.md) - Version history
- [Semantic Versioning](https://semver.org/) - Versioning spec
