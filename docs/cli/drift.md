# framework drift

Detect changes from the original template.

## Synopsis

```bash
framework drift [project-dir]
```

## Description

Compares your current project files against the original template manifest to detect what's changed. Useful for understanding customizations and template divergence.

## Arguments

| Argument | Description | Required | Default |
|----------|-------------|----------|---------|
| `project-dir` | Project directory | No | Current directory |

## Example

```bash
framework drift
```

### Output

```
🔍 Drift Detection

Template: saas (v1.0.0)
Project: my-saas-app

📝 Modified: 8 files
  app/page.tsx
  components/ui/button.tsx
  lib/utils.ts
  tailwind.config.ts
  next.config.js
  package.json
  README.md
  app/layout.tsx

➕ Added: 3 files
  app/contact/page.tsx
  components/features/pricing.tsx
  lib/analytics.ts

❌ Deleted: 1 file
  app/about/page.tsx

📊 Summary:
  Total template files: 47
  Modified: 8 (17%)
  Added: 3
  Deleted: 1
  Unchanged: 38 (81%)
```

### No Changes

```bash
framework drift
```

**Output:**
```
🔍 Drift Detection

Template: saas (v1.0.0)
Project: my-saas-app

✅ No drift detected
   All files match template

Your project matches the template exactly.
```

## Use Cases

### Before Updates

Check drift before updating template:

```bash
framework drift
```

Shows what you've customized, so you know what to preserve.

### Understanding Customizations

See what's been changed:

```bash
framework drift > drift-report.txt
```

Document your customizations.

### Template Compliance

Ensure project still follows template:

```bash
framework drift
```

Low drift = easier to maintain and update.

## How It Works

1. Reads `.dd/manifest.json` (created during export)
2. Hashes current files
3. Compares hashes to manifest
4. Reports differences

### Manifest File

```json
{
  "templateId": "saas",
  "version": "1.0.0",
  "files": {
    "app/page.tsx": "sha256:abc123...",
    "components/ui/button.tsx": "sha256:def456..."
  }
}
```

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | No drift (or drift detected successfully) |
| `1` | Error |

## Related Commands

- [`framework capabilities`](capabilities.md) - Check capabilities
- [`framework checkpoint`](checkpoint.md) - Create checkpoints
- [`framework doctor`](doctor.md) - Health checks

## See Also

- [Drift Detection Guide](../concepts/drift-detection.md) - How drift works
- [Template Updates](../guides/template-updates.md) - Updating templates
- [Manifest](../concepts/manifest.md) - Manifest file format
