# SSR Compatibility SOP

> **Version**: 1.0.0 | **Last Updated**: 2025-12-23
> 
> **Purpose**: Handle Server-Side Rendering compatibility for client-only components
> **Audience**: Website Agent, Template Agent, Code Generator
> **Status**: ✅ RESOLVED - Pattern documented for reference

---

## Table of Contents

1. [Overview](#1-overview)
2. [The Problem](#2-the-problem)
3. [Solution Pattern](#3-solution-pattern)
4. [Common Client-Only Components](#4-common-client-only-components)
5. [Detection & Prevention](#5-detection--prevention)

---

## 1. Overview

### Issue Observed

Client-only components (using `window`, `localStorage`, browser APIs) cause hydration errors in Next.js SSR.

### Resolution Status

**✅ FIXED** - Dynamic imports with `ssr: false` successfully resolve this.

---

## 2. The Problem

### Symptoms

```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

```
Error: window is not defined
```

### Root Cause

Next.js pre-renders pages on the server where browser APIs don't exist:
- `window` / `document`
- `localStorage` / `sessionStorage`
- `navigator`
- Canvas/WebGL APIs
- Third-party scripts

---

## 3. Solution Pattern

### Dynamic Import with SSR Disabled

```typescript
// ✅ CORRECT: Dynamic import with ssr: false
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(
  () => import('@/components/ClientOnlyComponent'),
  { ssr: false }
);

export default function Page() {
  return <ClientOnlyComponent />;
}
```

### With Loading State

```typescript
const ClientOnlyComponent = dynamic(
  () => import('@/components/ClientOnlyComponent'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse h-32 bg-muted rounded" />
  }
);
```

### useEffect Guard (Alternative)

```typescript
'use client';

import { useEffect, useState } from 'react';

export function ClientOnlyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse h-32 bg-muted rounded" />;
  }

  return (
    <div>
      {/* Safe to use window, localStorage, etc. */}
    </div>
  );
}
```

---

## 4. Common Client-Only Components

### Components Requiring SSR: false

| Component Type | Browser API Used | Solution |
|---------------|------------------|----------|
| Charts (Recharts, Chart.js) | Canvas | Dynamic import |
| Maps (Leaflet, Mapbox) | DOM manipulation | Dynamic import |
| Rich Text Editors | DOM/Selection API | Dynamic import |
| Video Players | Media APIs | Dynamic import |
| Theme Toggle | localStorage | useEffect guard |
| Analytics | window/document | useEffect guard |
| Drag & Drop | Mouse events | Dynamic import |
| Canvas/WebGL | Canvas API | Dynamic import |

### Framework-Specific Examples

```typescript
// Recharts
const Chart = dynamic(() => import('recharts').then(m => m.LineChart), { ssr: false });

// React-Leaflet
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// Monaco Editor
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
```

---

## 5. Detection & Prevention

### ESLint Rule (Recommended)

Add to `.eslintrc.js`:

```javascript
module.exports = {
  rules: {
    'no-restricted-globals': [
      'error',
      {
        name: 'window',
        message: 'Use dynamic import with ssr: false or useEffect guard'
      },
      {
        name: 'document',
        message: 'Use dynamic import with ssr: false or useEffect guard'
      },
      {
        name: 'localStorage',
        message: 'Use dynamic import with ssr: false or useEffect guard'
      }
    ]
  }
};
```

### Pre-Build Check

```bash
# Find potential SSR issues
cd /Users/joseph.dawson/Documents/dawson-does-framework && grep -r "window\." --include="*.tsx" --include="*.ts" website/app/ | grep -v "typeof window" | head -20
```

### Safe Window Check

```typescript
// ✅ Safe pattern for conditional browser code
if (typeof window !== 'undefined') {
  // Browser-only code
  window.scrollTo(0, 0);
}
```

---

## Code Generator Guidance

When generating code with browser APIs, the AI MUST:

1. **Detect client-only dependencies**
2. **Apply appropriate pattern**:
   - Heavy component → Dynamic import
   - Light usage → useEffect guard
   - One-time check → `typeof window !== 'undefined'`

### Prompt Addition

Add to code generation prompts:

```
For components using browser APIs (window, document, localStorage, canvas):
- Use dynamic(() => import(...), { ssr: false }) for heavy components
- Use useEffect + mounted state for light components
- Always provide loading state for better UX
```

---

## Related Documents

- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-23 | DOC Agent | Initial creation (resolved issue documentation) |

---

## Status

**✅ RESOLVED** - This SOP documents a pattern that has been successfully applied. No further action needed unless the issue recurs.

