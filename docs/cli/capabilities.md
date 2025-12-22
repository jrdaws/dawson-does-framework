# framework capabilities

Inspect project capabilities and plan compliance.

## Synopsis

```bash
framework capabilities [project-dir]
```

## Description

Shows which capabilities are enabled/disabled in your project and checks plan compliance. Capabilities are features like authentication, payments, AI, etc.

## Arguments

| Argument | Description | Required | Default |
|----------|-------------|----------|---------|
| `project-dir` | Project directory | No | Current directory |

## Example

```bash
framework capabilities
```

### Output

```
🎯 Project Capabilities

Project: my-saas-app
Plan: pro

✅ Enabled:
  auth.supabase        - Supabase authentication
  payments.stripe      - Stripe payment processing
  db.supabase          - Supabase database
  email.resend         - Resend email service

❌ Disabled:
  ai.openai            - OpenAI integration
  ai.anthropic         - Anthropic integration
  analytics.posthog    - PostHog analytics
  analytics.plausible  - Plausible analytics
  storage.supabase     - Supabase storage
  storage.s3           - AWS S3 storage

Plan Compliance: ✅ All enabled capabilities allowed on pro plan
```

### With Violations

```
🎯 Project Capabilities

Project: my-app
Plan: free

✅ Enabled:
  auth.supabase        - Supabase authentication

⚠️  Plan Violations:
  payments.stripe      - Requires: pro plan
  ai.anthropic         - Requires: pro plan

Upgrade to pro plan to use these capabilities:
  framework upgrade
```

## Related Commands

- [`framework phrases`](phrases.md) - Detailed capability status
- [`framework toggle`](toggle.md) - Enable/disable capabilities
- [`framework drift`](drift.md) - Detect changes

## See Also

- [Capabilities System](../concepts/capabilities.md) - How capabilities work
- [Plan Tiers](../concepts/plans.md) - Plan features
