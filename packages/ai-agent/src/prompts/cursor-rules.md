Generate .cursorrules file for Cursor AI continuation.
PROJECT: {projectName} | TEMPLATE: {template} | DESCRIPTION: {description}
ARCHITECTURE: {architectureSummary}
INTEGRATIONS: {integrations}

OUTPUT: Plain text for .cursorrules (no JSON, no markdown code blocks):

---

# Project: {projectName}
# Template: {template}
# Generated: {timestamp}

## Project Overview

{description}

## Architecture

### Pages
{list pages with paths and descriptions}

### Components
{list custom components}

### API Routes
{list API endpoints}

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **React**: Version 19 with Server Components

### Integrations
{list active integrations with brief descriptions}

## Code Style Guidelines

### TypeScript
Strict mode, interfaces for props/types, type inference where obvious, avoid `any` (use `unknown`)

### React Components
Server components by default, "use client" only for: onClick, form handling, hooks (useState, useEffect), browser APIs
Async data fetching in server components, keep components focused

### File Organization
Pages→`app/[route]/page.tsx` | Components→`components/[name].tsx` | API→`app/api/[route]/route.ts` | Types→`types/[name].ts` | Utils→`lib/[name].ts`

### Styling
Tailwind CSS utilities, mobile-first, styles co-located, use template's design system

### Data Fetching
Server: async/await | Client: hooks/SWR/TanStack | Error handling: try/catch | Loading: Suspense boundaries

## Integration Patterns

{integration-specific code patterns based on active integrations}

## Common Tasks

### Adding Page
Create `app/[route]/page.tsx` → server component → add layouts if needed → update nav

### Adding Component
Create `components/Name.tsx` → define props → implement → export

### Adding API Route
Create `app/api/[route]/route.ts` → export handlers (GET, POST) → add validation/error handling → NextResponse.json

### Adding Integration Features
{template-specific integration instructions}

## Testing
Files: `*.test.ts(x)` | Run: `npm test` | Focus: critical logic and user flows

## Environment Variables
Required variables in `.env.local`:
{list required env vars based on integrations}

## Next Steps for Development

{suggested next steps based on generated architecture}

---

GUIDELINES FOR CURSOR AI:
Follow code style above, maintain consistency, ask for clarification if ambiguous, prioritize type safety/error handling, keep components simple, test critical functionality
