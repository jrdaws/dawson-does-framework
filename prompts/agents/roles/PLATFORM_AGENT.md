# Platform Agent Role

> **Primary Responsibility**: Cloud platform features - preview, deploy, pull API, and backend services.

---

## 🎯 Role Definition

### Scope
- Platform API endpoints
- Preview generation system
- Deployment engine
- Project storage and retrieval
- Backend infrastructure

### Owns
- `website/app/api/` - API routes (shared with Website Agent)
- `packages/` - Platform packages (deploy-engine, ai-agent, etc.)
- Supabase database schema
- Preview worker infrastructure
- Deployment integrations (Vercel, Railway)

### Does NOT Own
- CLI implementation (→ CLI Agent)
- Website UI (→ Website Agent)
- Template content (→ Template Agent)

---

## 📊 Current State

### ✅ Working
- Project save API (`/api/projects/save`)
- Project fetch API (`/api/projects/[token]`)
- Supabase database with projects table
- Token generation system
- Basic preview generation

### ⚠️ Needs Work
- Preview generation is slow (5+ seconds)
- No caching for previews
- Pull API needs more data
- No deployment API

### ❌ Not Started
- `packages/deploy-engine/` - Deployment automation
- `packages/ai-agent/` - AI generation engine
- `packages/collaboration/` - Real-time collaboration
- Preview caching layer
- Rate limiting improvements

---

## 📝 Work Log

| Date | Agent | Action |
|------|-------|--------|
| 2024-12-21 | Initial | Created Supabase projects table |
| 2024-12-21 | Agent B | Created project save/fetch APIs |
| 2024-12-21 | Agent C | Created preview generation API |
| 2024-12-22 | - | *Awaiting next agent* |

---

## 🚨 Active Issues

1. **Preview slow** - AI generation takes too long
2. **No caching** - Same preview regenerated every time
3. **API rate limits** - Could be abused
4. **No deploy integration** - Manual deployment required

---

## 📋 Next Priorities

1. **HIGH**: Create `packages/deploy-engine/` with Vercel support
2. **HIGH**: Add preview caching (Redis or edge cache)
3. **MEDIUM**: Create `packages/ai-agent/` for generation
4. **MEDIUM**: Improve pull API response with more data
5. **LOW**: Add real-time collaboration package

---

## 🔧 Technical Context

### API Structure
```
website/app/api/
├── projects/
│   ├── save/route.ts       # POST - Save project, return token
│   └── [token]/
│       └── route.ts        # GET - Fetch project by token
└── preview/
    └── generate/route.ts   # POST - Generate preview HTML

packages/
├── deploy-engine/          # Deployment automation
│   └── src/
│       ├── providers/
│       │   ├── vercel.ts
│       │   └── railway.ts
│       └── index.ts
├── ai-agent/              # AI generation
│   └── src/
│       ├── intent-analyzer.ts
│       ├── architecture-generator.ts
│       └── code-generator.ts
└── collaboration/         # Real-time collab
    └── src/
        ├── yjs-provider.ts
        └── presence.ts
```

### Supabase Schema
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  template TEXT NOT NULL,
  project_name TEXT NOT NULL,
  output_dir TEXT NOT NULL,
  integrations JSONB,
  env_keys JSONB,
  vision TEXT,
  mission TEXT,
  success_criteria TEXT,
  created_at TIMESTAMP,
  expires_at TIMESTAMP
);
```

### API Patterns
```typescript
// Standard API response
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate
    if (!body.required_field) {
      return Response.json(
        { success: false, error: "Missing required_field" },
        { status: 400 }
      );
    }
    
    // Process
    const result = await doSomething(body);
    
    // Success
    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🚀 Handoff Prompt

**Copy this entire section when starting a new Platform Agent session:**

---

# Platform Agent Session

## 🛑 MANDATORY: Read Context First
```bash
cat AGENT_CONTEXT.md
cat prompts/agents/roles/PLATFORM_AGENT.md
```

Answer the 5 verification questions from AGENT_CONTEXT.md, then confirm you've read this role file.

## Your Current Mission

Based on the priorities above, your immediate tasks are:

### Task 1: Create Deploy Engine Package
Create `packages/deploy-engine/`:
```
packages/deploy-engine/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── types.ts
    └── providers/
        ├── vercel.ts      # Vercel deployment
        └── railway.ts     # Railway deployment
```

Features:
- Deploy to Vercel using their API
- Support environment variables
- Return deployment URL
- Handle errors gracefully

### Task 2: Add Preview Caching
- Use edge caching or Redis
- Cache by project config hash
- Invalidate on config change
- Target <1s for cached previews

## Files to Create
- `packages/deploy-engine/` - New package
- `website/lib/preview-cache.ts` - Caching layer

## Success Criteria
- [ ] Deploy engine can deploy to Vercel
- [ ] Previews cached and fast on repeat
- [ ] APIs return proper error codes
- [ ] Tests pass

## When Complete
1. Update this role file with your work log entry
2. Update Current State section
3. Update Next Priorities
4. Commit changes
5. Provide Summary + Suggestions + Continuation Prompt

---

*Last updated: 2024-12-22 by governance setup*

