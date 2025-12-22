# Integrations Documentation

> Comprehensive documentation for Dawson-Does Framework integrations

---

## Quick Navigation

| Document | Purpose | Audience |
|----------|---------|----------|
| **[INTEGRATION_CAPABILITIES.md](./INTEGRATION_CAPABILITIES.md)** | Complete reference with examples | All developers |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Quick lookup for functions/patterns | Experienced developers |
| This README | Overview and getting started | New users |

---

## What Are Integrations?

Integrations are pre-built, production-ready implementations of third-party services (auth, payments, etc.) that:

- ✅ Work completely standalone after export (zero platform dependency)
- ✅ Follow Next.js and provider best practices
- ✅ Include TypeScript types and error handling
- ✅ Come with example components and routes
- ✅ Are fully tested and production-ready

---

## Available Integrations

### 🔐 Authentication

| Provider | Status | Features |
|----------|--------|----------|
| **Clerk** | ✅ Complete | Pre-built UI, social auth, protected routes, user management |
| **Supabase** | ✅ Complete | Email/password, OAuth, session management |
| Auth0 | 🔜 Planned | Enterprise auth, SSO |
| NextAuth | 🔜 Planned | Flexible auth with many providers |

### 💳 Payments

| Provider | Status | Features |
|----------|--------|----------|
| **Stripe** | ✅ Complete | Subscriptions, webhooks, customer portal, full management |
| Paddle | 🔜 Planned | Merchant of record, global payments |
| Lemon Squeezy | 🔜 Planned | Simple subscriptions, digital products |

### 🤖 LLM Providers

| Provider | Status | Features |
|----------|--------|----------|
| Anthropic | ✅ Available | Claude models, streaming |
| OpenAI | 🔜 Planned | GPT models, embeddings |
| Cohere | 🔜 Planned | Generation, classification |

---

## Getting Started

### 1. Choose Your Integrations

When exporting a template, specify which integrations you want:

```bash
framework export saas ./my-app --auth clerk --payments stripe
```

### 2. Set Up Environment Variables

Copy the `.env.example` file and add your API keys:

```bash
cd my-app
cp .env.example .env.local
# Edit .env.local with your actual keys
```

### 3. Get API Keys

**Clerk**: https://clerk.com → Create app → Copy keys
**Stripe**: https://stripe.com → Dashboard → Developers → API keys
**Supabase**: https://supabase.com → New project → Settings → API

### 4. Run Your App

```bash
npm install
npm run dev
```

Your app is now running with full auth and payments! 🎉

---

## Integration Structure

Each integration follows this structure:

```
templates/{template}/integrations/{type}/{provider}/
├── integration.json          # Metadata (version, dependencies, env vars)
├── lib/                      # Core utilities and helpers
│   └── {provider}.ts        # Main integration module
├── app/                      # Route handlers (API routes, pages)
│   ├── api/                 # API endpoints
│   └── */                   # Pages (sign-in, dashboard, etc.)
├── components/              # UI components
│   └── */                   # Component categories
├── middleware.ts            # Route protection (if needed)
├── .env.example            # Environment variable template
└── package.json            # Integration dependencies
```

---

## Key Features by Integration

### Clerk (Auth)

**What's Included:**
- 🔐 Sign-in/sign-up pages with pre-built UI
- 👤 User profile management
- 🛡️ Protected routes (server, client, API)
- 🔑 Helper functions for common tasks
- 🏢 Organization support
- 📊 User metadata management

**Example Usage:**
```typescript
// Protect a server component
import { auth } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <div>Protected content</div>;
}
```

**[Full Documentation →](./INTEGRATION_CAPABILITIES.md#clerk-auth)**

---

### Stripe (Payments)

**What's Included:**
- 💳 Subscription checkout flow
- 🔄 Webhook handling (automated)
- 🎫 Customer portal access
- 📊 Subscription management (cancel, upgrade, reactivate)
- 💰 Pricing plans configuration
- 🔒 Payment method management

**Example Usage:**
```typescript
import { getSubscriptionStatus, cancelSubscription } from './lib/stripe';

// Check subscription
const status = await getSubscriptionStatus(customerId);
if (status?.status === 'active') {
  // User has active subscription
}

// Cancel subscription
await cancelSubscription(subscriptionId);
```

**[Full Documentation →](./INTEGRATION_CAPABILITIES.md#stripe)**

---

### Supabase (Auth)

**What's Included:**
- 📧 Email/password authentication
- 🔗 OAuth providers (Google, GitHub, etc.)
- 🔄 Session refresh middleware
- 🔐 Row Level Security (RLS)
- 📱 Client and server auth helpers

**Example Usage:**
```typescript
import { createClient } from './lib/supabase';

const supabase = createClient();
await supabase.auth.signInWithPassword({ email, password });
```

**[Full Documentation →](./INTEGRATION_CAPABILITIES.md#supabase-auth)**

---

## Common Use Cases

### Use Case 1: SaaS with Subscriptions

**Stack**: Clerk (auth) + Stripe (payments)

**Flow**:
1. User signs up with Clerk
2. User subscribes to a plan via Stripe checkout
3. Webhook updates user's subscription status
4. User accesses premium features

**Files You'll Use**:
- `lib/clerk.ts` - Auth helpers
- `lib/stripe.ts` - Subscription management
- `app/api/stripe/webhook/route.ts` - Webhook handler
- `components/pricing/pricing-cards.tsx` - Pricing UI

---

### Use Case 2: Protected Dashboard

**Stack**: Clerk (auth)

**Flow**:
1. User signs in via Clerk
2. Middleware protects `/dashboard` routes
3. Dashboard loads user-specific data

**Files You'll Use**:
- `middleware.ts` - Route protection
- `app/dashboard/page.tsx` - Protected page
- `components/auth/user-button.tsx` - User menu

---

### Use Case 3: Content Platform

**Stack**: Supabase (auth + database)

**Flow**:
1. User signs up with Supabase auth
2. User creates content (stored in Supabase DB)
3. RLS ensures users only see their content

**Files You'll Use**:
- `lib/supabase.ts` - Auth + DB client
- `middleware.ts` - Session refresh
- Supabase dashboard for DB schema

---

## Advanced Topics

### Combining Integrations

**Example**: Stripe customer ID in Clerk metadata

```typescript
import { updateUserMetadata } from './lib/clerk';

// After creating Stripe customer
const customer = await stripe.customers.create({ email: user.email });

// Store in Clerk metadata
await updateUserMetadata(userId, {
  privateMetadata: { stripeCustomerId: customer.id }
});
```

### Custom Webhooks

Add custom webhook logic in `app/api/stripe/webhook/route.ts`:

```typescript
case "customer.subscription.created":
  // Your custom logic
  await notifyUserOfSubscription(userId);
  break;
```

### Integration Testing

Test integrations with real APIs in test mode:

```typescript
// Use test mode keys
process.env.STRIPE_SECRET_KEY = 'sk_test_xxx';

// Run tests
npm run test:integration
```

---

## Troubleshooting

### Auth not working?

1. ✅ Check environment variables are set
2. ✅ Verify middleware.ts is in project root
3. ✅ Check provider dashboard for API key validity
4. ✅ Clear cookies and try again

### Webhooks not firing?

1. ✅ Verify webhook secret matches provider dashboard
2. ✅ Check webhook endpoint is publicly accessible
3. ✅ Use provider CLI for local testing (e.g., `stripe listen`)
4. ✅ Check webhook logs in provider dashboard

### Type errors?

1. ✅ Run `npm install` to ensure dependencies are installed
2. ✅ Check TypeScript version compatibility
3. ✅ Restart TypeScript server in your IDE

---

## Best Practices

### 1. Environment Variables

- ✅ Use `NEXT_PUBLIC_*` prefix only for client-side keys
- ✅ Keep secret keys server-side only
- ✅ Never commit `.env.local` to git
- ✅ Use different keys for development and production

### 2. Error Handling

```typescript
try {
  await someIntegrationFunction();
} catch (error: any) {
  console.error('[Integration] Error:', error);
  // Provide helpful error to user
  return { error: 'Something went wrong. Please try again.' };
}
```

### 3. User Experience

- ✅ Show loading states during auth/payment flows
- ✅ Provide clear error messages
- ✅ Allow users to retry failed operations
- ✅ Redirect to appropriate pages after actions

### 4. Security

- ✅ Always verify webhook signatures
- ✅ Validate user permissions server-side
- ✅ Use HTTPS in production
- ✅ Sanitize user inputs

---

## Migration Guides

### Switching Auth Providers

If you need to switch from one auth provider to another:

1. Export user data from current provider
2. Create users in new provider
3. Update integration files
4. Test authentication flows
5. Notify users of changes

### Upgrading Integrations

When a new integration version is released:

1. Read the changelog
2. Update `integration.json` version
3. Run `npm install` to update dependencies
4. Test all integration flows
5. Deploy with confidence

---

## Contributing

### Adding a New Integration

1. Create integration directory structure
2. Implement provider interface
3. Add integration.json metadata
4. Write comprehensive tests
5. Document usage and examples
6. Submit PR to framework repo

**See**: [Integration Agent Role](../../prompts/agents/roles/INTEGRATION_AGENT.md)

---

## Support

### Documentation
- [Full Capabilities Reference](./INTEGRATION_CAPABILITIES.md)
- [Quick Reference Guide](./QUICK_REFERENCE.md)
- [API Contracts](../API_CONTRACTS.md)

### Provider Support
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### Framework Support
- GitHub Issues: https://github.com/jrdaws/dawson-does-framework/issues
- Community discussions in repo
- Check agent memory files for context

---

## Roadmap

### Next Quarter (Q1 2025)

- [ ] Auth0 integration
- [ ] Paddle payments integration
- [ ] OpenAI LLM integration
- [ ] Integration testing framework
- [ ] Visual integration configurator

### Future

- [ ] Lemon Squeezy payments
- [ ] Resend email integration
- [ ] PostHog analytics
- [ ] Vercel/Netlify deploy integrations
- [ ] Integration marketplace

---

**Last Updated**: 2025-12-22
**Maintained By**: Integration Agent
**Version**: 1.0.0
