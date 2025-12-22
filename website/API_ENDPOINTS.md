# Projects API Endpoints

## Overview
The Projects API provides a bridge between the web configurator and the CLI pull command. Projects are stored in Supabase with 30-day expiration.

## Endpoints

### 1. POST /api/projects/save
Save a new project configuration and get a shareable token.

**Request:**
```bash
curl -X POST http://localhost:3000/api/projects/save \
  -H "Content-Type: application/json" \
  -d '{
    "template": "saas",
    "project_name": "my-app",
    "output_dir": "./my-app",
    "integrations": {
      "auth": "supabase",
      "payments": "stripe"
    },
    "vision": "Build a great SaaS app",
    "description": "Optional description"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "swift-eagle-1234",
  "project": { /* full project object */ },
  "pullCommand": "npx @jrdaws/framework pull swift-eagle-1234",
  "url": "http://localhost:3000/configure?project=swift-eagle-1234",
  "expiresAt": "2026-01-21T05:49:15.089Z"
}
```

**Validation:**
- `template` (required) - Must be a valid template name
- `project_name` (required) - Name for the project
- `output_dir` (optional) - Defaults to "./my-app"
- `integrations` (optional) - Key-value pairs of integration selections
- `env_keys`, `vision`, `mission`, `success_criteria`, `inspirations`, `description` (optional)

**Rate Limiting:** 5 requests per 24 hours per IP (configurable)

---

### 2. GET /api/projects/{token}
Fetch project configuration by token.

**Request:**
```bash
curl http://localhost:3000/api/projects/swift-eagle-1234
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "uuid",
    "token": "swift-eagle-1234",
    "template": "saas",
    "project_name": "my-app",
    "output_dir": "./my-app",
    "integrations": { "auth": "supabase" },
    "env_keys": {},
    "vision": "Build a great SaaS app",
    "created_at": "2025-12-22T05:49:15.089Z",
    "expires_at": "2026-01-21T05:49:15.089Z",
    "last_accessed_at": "2025-12-22T05:49:15.089Z"
  }
}
```

**Error Responses:**
- `404` - Token not found
- `410` - Project expired (includes helpful message and link to create new project)

**Side Effects:**
- Updates `last_accessed_at` timestamp on successful fetch

---

### 3. GET /api/projects/{token}/download
Download project configuration as JSON with full file manifest.

**Request:**
```bash
curl http://localhost:3000/api/projects/swift-eagle-1234/download
```

**Response:**
```json
{
  "version": "1.0.0",
  "token": "swift-eagle-1234",
  "template": "saas",
  "project_name": "my-app",
  "output_dir": "./my-app",
  "created_at": "2025-12-22T05:49:15.089Z",
  "expires_at": "2026-01-21T05:49:15.089Z",
  "config": {
    "integrations": { "auth": "supabase", "payments": "stripe" },
    "env_keys": {},
    "vision": "Build a great SaaS app",
    "mission": null,
    "success_criteria": null,
    "inspirations": [],
    "description": null
  },
  "files": {
    "base": [
      "app/layout.tsx",
      "app/page.tsx",
      "package.json",
      "template.json"
    ],
    "integrations": [
      "integrations/auth/supabase/lib/supabase.ts",
      "integrations/payments/stripe/lib/stripe.ts"
    ],
    "total": 21
  },
  "cli": {
    "pullCommand": "npx @jrdaws/framework pull swift-eagle-1234",
    "templatePath": "templates/saas"
  }
}
```

**Headers:**
- `Content-Type: application/json`
- `Content-Disposition: attachment; filename="my-app-config.json"`

---

## Features

### ✅ Validation
- Required fields are validated
- Clear error messages for missing data
- Returns 400 status code for validation errors

### ✅ Token Generation
- Human-readable tokens (e.g., `swift-eagle-1234`)
- Guaranteed unique with collision detection
- Format: `{adjective}-{noun}-{4-digit-number}`

### ✅ Rate Limiting
- Uses Redis when available (production)
- Falls back to simple rate limiting (development)
- Configurable limits per endpoint
- Returns 429 with `resetAt` timestamp when exceeded

### ✅ CORS Support
- Allows all origins (`*`) for CLI access
- Supports OPTIONS preflight requests
- Includes proper CORS headers on all responses

### ✅ Expiration
- Projects expire after 30 days
- Returns 410 Gone with helpful message
- Includes link to create new project

### ✅ Error Handling
- Consistent error response format
- Development mode includes detailed error messages
- Production mode hides sensitive details

## Testing

Run the test suite:
```bash
bash test-api.sh 3000
```

Test results:
- ✅ Save endpoint returns token
- ✅ Fetch endpoint returns project data
- ✅ Download endpoint returns file manifest
- ✅ Invalid tokens return 404
- ✅ Expired projects return 410
- ✅ Validation prevents invalid data
- ✅ CORS headers allow CLI access

## Database Schema

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  template TEXT NOT NULL,
  project_name TEXT NOT NULL,
  output_dir TEXT NOT NULL,
  integrations JSONB DEFAULT '{}'::jsonb,
  env_keys JSONB DEFAULT '{}'::jsonb,
  vision TEXT,
  mission TEXT,
  success_criteria TEXT,
  inspirations JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_token ON projects(token);
CREATE INDEX idx_projects_expires_at ON projects(expires_at);
```

## CLI Integration

The CLI pull command consumes these endpoints:

```bash
# Pull project by token
npx @jrdaws/framework pull swift-eagle-1234

# The CLI will:
# 1. Fetch project from GET /api/projects/{token}
# 2. Download template files based on project.template
# 3. Apply integration files based on project.integrations
# 4. Generate .env file with project.env_keys
# 5. Scaffold the project to project.output_dir
```

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

Optional:
- `UPSTASH_REDIS_REST_URL` - Redis URL for rate limiting
- `UPSTASH_REDIS_REST_TOKEN` - Redis token for rate limiting
- `NEXT_PUBLIC_SITE_URL` - Site URL for generating links (defaults to localhost)

## Files

- `app/api/projects/save/route.ts` - Save endpoint
- `app/api/projects/[token]/route.ts` - Fetch endpoint
- `app/api/projects/[token]/download/route.ts` - Download endpoint
- `lib/supabase.ts` - Supabase client and types
- `lib/rate-limiter.ts` - Rate limiting utilities
- `test-api.sh` - Test suite
