# Test Fixtures

This directory contains test fixtures for E2E tests.

## Files

### Images
- `inspiration.png` - Sample inspiration image for upload tests
- `logo.svg` - Sample logo for branding tests

### Data
- `sample-project.json` - Sample project configuration
- `sample-env.txt` - Sample environment variables

## Usage

```typescript
import path from 'path';

// In Playwright test
await page.setInputFiles('input[type="file"]', 
  path.join(__dirname, '../fixtures/inspiration.png')
);
```

## Adding New Fixtures

1. Place files in this directory
2. Use descriptive names
3. Keep files small (< 100KB for images)
4. Document purpose in this README

