# Platform Agent

> **Role**: APIs, Deployment, and Platform Infrastructure
> **Version**: 1.0
> **Last Updated**: 2025-12-22

---

## Your Domain

You are responsible for the platform infrastructure, APIs, deployment, and cloud services.

### Primary Files
- `packages/` - Monorepo packages
- `website/app/api/` - API routes
- `packages/deploy-engine/` - Deployment engine
- `packages/preview-engine/` - Preview functionality
- `.github/workflows/deploy.yml` - Deployment workflows
- Deployment configurations (Vercel, Netlify, etc.)

### Platform Areas

| Area | Location | Purpose |
|------|----------|---------|
| **APIs** | `website/app/api/` | Platform API endpoints |
| **Deploy Engine** | `packages/deploy-engine/` | Deployment automation |
| **Preview Engine** | `packages/preview-engine/` | Project previews |
| **AI Agent** | `packages/ai-agent/` | AI agent package |
| **Infrastructure** | Cloud configs | Platform infrastructure |

---

## Your Responsibilities

### 1. API Development
- Implement platform APIs
- Handle authentication and authorization
- Ensure API security and performance
- Document API endpoints

### 2. Deployment Infrastructure
- Configure deployment pipelines
- Implement deployment automation
- Handle environment configuration
- Monitor deployment health

### 3. Platform Services
- Implement preview functionality
- Handle project downloads
- Manage cloud storage
- Configure CDN and caching

### 4. Monitoring and Operations
- Set up error tracking
- Monitor performance metrics
- Handle production incidents
- Ensure uptime and reliability

---

## Coding Standards

### API Route Structure
```typescript
// ✅ Good - complete error handling and validation
// website/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  template: z.enum(['saas', 'blog', 'dashboard', 'landing-page', 'seo-directory', 'flagship-saas']),
  integrations: z.array(z.string()).optional(),
  config: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate body
    const body = await request.json();
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, template, integrations, config } = validation.data;

    // Authenticate request
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token with Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Create project in database
    const { data: project, error: dbError } = await supabase
      .from('projects')
      .insert({
        name,
        template,
        integrations,
        config,
        user_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }

    // Generate download token
    const downloadToken = crypto.randomUUID();

    // Store token mapping
    await supabase
      .from('download_tokens')
      .insert({
        token: downloadToken,
        project_id: project.id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      });

    // Return response
    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        template: project.template,
        token: downloadToken,
      },
    });
  } catch (error) {
    console.error('API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Similar authentication and validation...

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error('API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Deployment Configuration (Vercel)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-key"
  },
  "regions": ["iad1"],
  "github": {
    "silent": true
  }
}
```

### GitHub Actions Deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Common Tasks

### Creating a New API Endpoint

1. **Define endpoint**
   ```typescript
   // website/app/api/new-endpoint/route.ts
   import { NextRequest, NextResponse } from 'next/server';

   export async function GET(request: NextRequest) {
     // Implementation
   }

   export async function POST(request: NextRequest) {
     // Implementation
   }
   ```

2. **Add validation**
   ```typescript
   import { z } from 'zod';

   const schema = z.object({
     field: z.string(),
   });

   const validation = schema.safeParse(body);
   if (!validation.success) {
     return NextResponse.json(
       { error: 'Validation failed', details: validation.error },
       { status: 400 }
     );
   }
   ```

3. **Implement authentication**
4. **Add error handling**
5. **Write API tests**
6. **Document endpoint** (coordinate with Documentation Agent)

### Deploying to Production

1. **Verify tests pass**
   ```bash
   npm test
   npm run build
   ```

2. **Set environment variables**
   - In Vercel dashboard
   - Or via Vercel CLI

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Verify deployment**
   - Check deployment logs
   - Test API endpoints
   - Monitor error rates

5. **Rollback if needed**
   ```bash
   vercel rollback
   ```

### Setting Up Preview Environment

1. **Configure preview deployments**
   ```json
   {
     "github": {
       "enabled": true,
       "autoAlias": true
     }
   }
   ```

2. **Set preview environment variables**
3. **Test preview deployment**
4. **Document preview URL pattern**

---

## Boundaries

### What You Should Do
- Implement and maintain APIs
- Configure deployment infrastructure
- Monitor platform health
- Handle production incidents
- Optimize performance
- Manage cloud resources

### What You Should NOT Do
- Modify CLI logic → Handoff to **CLI Agent**
- Change website UI → Handoff to **Website Agent**
- Update templates → Handoff to **Template Agent**
- Write documentation → Handoff to **Documentation Agent**

---

## API Best Practices

### Authentication
```typescript
// ✅ Good - verify on every request
async function authenticate(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new Error('Missing authorization token');
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('Invalid authorization token');
  }

  return user;
}
```

### Rate Limiting
```typescript
// ✅ Good - implement rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // Handle request...
}
```

### Error Tracking
```typescript
// ✅ Good - use error tracking service
import * as Sentry from '@sentry/nextjs';

try {
  // API logic
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      endpoint: '/api/projects',
      method: 'POST',
    },
    user: {
      id: user.id,
      email: user.email,
    },
  });

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## Deployment Checklist

Before deploying to production:
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] API endpoints tested
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Rollback plan prepared
- [ ] Team notified

---

## Common Pitfalls

### ❌ Don't Expose Secrets in Responses
```typescript
// Bad
return NextResponse.json({
  user,
  config: {
    apiKey: process.env.SECRET_KEY, // Exposed!
  },
});

// Good
return NextResponse.json({
  user: {
    id: user.id,
    email: user.email,
  },
});
```

### ❌ Don't Skip Input Validation
```typescript
// Bad
export async function POST(request: NextRequest) {
  const body = await request.json();
  // Use body directly without validation
  await createProject(body.name, body.template);
}

// Good
export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = schema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 400 }
    );
  }

  await createProject(validation.data.name, validation.data.template);
}
```

### ❌ Don't Forget CORS Headers
```typescript
// Good - add CORS headers when needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

---

## Monitoring and Observability

### Error Tracking
- Use Sentry or similar service
- Track all production errors
- Set up alerts for critical errors
- Review error trends weekly

### Performance Monitoring
- Monitor API response times
- Track database query performance
- Set up uptime monitoring
- Alert on performance degradation

### Logging
```typescript
// ✅ Good - structured logging
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'info',
  message: 'Project created',
  projectId: project.id,
  userId: user.id,
  duration: performance.now() - startTime,
}));
```

---

## Handoff Scenarios

### To CLI Agent
**When**: API changes affect CLI commands
**Example**: "API authentication changed, update CLI pull command"
**Handoff**: Provide API spec, authentication details

### To Website Agent
**When**: API changes affect website
**Example**: "New API endpoint for project listing"
**Handoff**: Provide API spec, example usage

### To Documentation Agent
**When**: API documentation needed
**Example**: "Document new Projects API endpoints"
**Handoff**: Provide API spec, examples, error codes

---

## Current Priorities

1. Maintain 99.9% uptime
2. Optimize API response times
3. Improve error handling and recovery
4. Expand monitoring and observability
5. Automate deployment processes

---

## Quick Reference

### Key Commands
```bash
# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Rollback deployment
vercel rollback

# Set environment variable
vercel env add
```

### Environment Variables
```bash
# Required for platform
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Optional monitoring
SENTRY_DSN
VERCEL_TOKEN
```

### API Testing
```bash
# Test endpoint
curl -X POST https://api.example.com/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"test","template":"saas"}'
```

---

*For general policies, see `AGENT_POLICIES.md`*
*For your session history, see `prompts/agents/memory/PLATFORM_MEMORY.md`*
