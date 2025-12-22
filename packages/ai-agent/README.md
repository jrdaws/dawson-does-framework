# @dawson-framework/ai-agent

AI-powered project generation engine for Dawson Framework.

## Overview

This package converts natural language descriptions into structured project architecture and code. It powers the "describe → build" flow for the Dawson Framework.

## Features

- **Intent Analysis** - Extract structured intent from user descriptions
- **Architecture Generation** - Design project structure with pages, components, and routes
- **Code Generation** - Generate actual file contents matching template style
- **Cursor Context** - Build `.cursorrules` and `START_PROMPT.md` for continuation
- **Template-Based** - Leverages existing templates for consistency
- **Deterministic** - Temperature=0 for predictable outputs
- **Type-Safe** - Full TypeScript with Zod validation

## Installation

```bash
npm install @dawson-framework/ai-agent
```

## Usage

```typescript
import { generateProject } from '@dawson-framework/ai-agent';

const result = await generateProject({
  description: 'A fitness tracking app with social features',
  projectName: 'FitTrack'
});

console.log(result.intent);        // Analyzed intent
console.log(result.architecture);  // Project structure
console.log(result.code);          // Generated files
console.log(result.context);       // Cursor context
```

## Individual Functions

```typescript
import {
  analyzeIntent,
  generateArchitecture,
  generateCode,
  buildCursorContext
} from '@dawson-framework/ai-agent';

// Use individually
const intent = await analyzeIntent({ description: '...' });
const architecture = await generateArchitecture(intent);
const code = await generateCode(architecture);
const context = await buildCursorContext({ intent, architecture, code });
```

## Environment Variables

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test
```

## License

MIT
