# Integration Quick Reference

> Quick lookup guide for integration helper functions and common patterns.

---

## Clerk Auth

### Import
```typescript
import {
  getCurrentUserId,
  getCurrentUser,
  requireAuth,
  hasRole,
  isEmailVerified,
  updateUserMetadata,
} from './lib/clerk';

// Or use Clerk directly
import { auth, currentUser } from "@clerk/nextjs/server";
```

### Common Functions

| Function | Return Type | Use Case |
|----------|-------------|----------|
| `getCurrentUserId()` | `Promise<string \| null>` | Get user ID (returns null if not authenticated) |
| `getCurrentUser()` | `Promise<User \| null>` | Get full user object |
| `requireAuth()` | `Promise<string>` | Get user ID or throw error |
| `hasRole(role)` | `Promise<boolean>` | Check if user has role |
| `isEmailVerified()` | `Promise<boolean>` | Check email verification |
| `getUserOrganizations()` | `Promise<object>` | Get org memberships |
| `updateUserMetadata(userId, metadata)` | `Promise<User>` | Update user metadata |

### Protected Patterns

**Server Component:**
```typescript
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <div>Protected content</div>;
}
```

**API Route:**
```typescript
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ data: "protected" });
}
```

**Client Component:**
```typescript
'use client';
import { useUser } from "@clerk/nextjs";

export function Component() {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn) return <SignIn />;
  return <div>Hello {user.firstName}</div>;
}
```

---

## Stripe Payments

### Import
```typescript
import {
  stripe,
  PRICING_PLANS,
  getSubscriptionStatus,
  getSubscriptionDetails,
  cancelSubscription,
  reactivateSubscription,
  updateSubscriptionPlan,
  getCustomerPaymentMethods,
  formatAmountForStripe,
  formatAmountFromStripe,
} from './lib/stripe';
```

### Subscription Management

| Function | Parameters | Return Type | Use Case |
|----------|------------|-------------|----------|
| `getSubscriptionStatus(customerId)` | `string` | `Promise<SubscriptionStatus \| null>` | Get current subscription |
| `getSubscriptionDetails(subscriptionId)` | `string` | `Promise<SubscriptionDetails>` | Get detailed info |
| `cancelSubscription(subscriptionId)` | `string` | `Promise<Subscription>` | Cancel at period end |
| `reactivateSubscription(subscriptionId)` | `string` | `Promise<Subscription>` | Undo cancellation |
| `updateSubscriptionPlan(subId, priceId, proration?)` | `string, string, string?` | `Promise<Subscription>` | Change plan |
| `getCustomerPaymentMethods(customerId)` | `string` | `Promise<PaymentMethod[]>` | Get cards |

### Common Patterns

**Create Checkout Session:**
```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  mode: "subscription",
  line_items: [{ price: PRICING_PLANS.pro.priceId, quantity: 1 }],
  success_url: `${origin}/dashboard?success=true`,
  cancel_url: `${origin}/pricing?canceled=true`,
  metadata: { userId, plan: "pro" }
});
```

**Check Subscription Status:**
```typescript
const status = await getSubscriptionStatus(customerId);
if (status?.status === "active" && !status.cancelAtPeriodEnd) {
  // Active subscription
}
```

**Cancel Subscription:**
```typescript
// Cancel at period end (customer keeps access)
await cancelSubscription(subscriptionId);
```

**Change Plan:**
```typescript
// Upgrade/downgrade with prorated billing
await updateSubscriptionPlan(
  subscriptionId,
  PRICING_PLANS.team.priceId!,
  'create_prorations'
);
```

**Customer Portal:**
```typescript
const session = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: `${origin}/dashboard`,
});
// Redirect to session.url
```

### Webhook Handling

```typescript
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case "checkout.session.completed":
      // Handle new subscription
      break;
    case "customer.subscription.updated":
      // Handle subscription change
      break;
    case "customer.subscription.deleted":
      // Handle cancellation
      break;
  }

  return NextResponse.json({ received: true });
}
```

---

## Supabase Auth

### Import
```typescript
import { createClient, createServerSupabaseClient } from './lib/supabase';
```

### Client (Browser)
```typescript
const supabase = createClient();

// Sign up
const { data, error } = await supabase.auth.signUp({
  email, password
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
});

// Sign out
await supabase.auth.signOut();

// Get session
const { data: { session } } = await supabase.auth.getSession();
```

### Server (API Routes, Server Components)
```typescript
const supabase = await createServerSupabaseClient();

// Get user
const { data: { user } } = await supabase.auth.getUser();

// Database query with RLS
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id);
```

---

## Environment Variables

### Clerk
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

### Stripe
```bash
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Price IDs for plans
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_TEAM_PRICE_ID=price_xxx
```

### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx  # Optional, for admin operations
```

---

## TypeScript Types

### Clerk
```typescript
import { User } from "@clerk/nextjs/server";

// User object has:
// - id, firstName, lastName, emailAddresses
// - publicMetadata, privateMetadata
// - createdAt, updatedAt
```

### Stripe
```typescript
import Stripe from "stripe";
import type { SubscriptionStatus, SubscriptionDetails } from './lib/stripe';

// SubscriptionStatus
interface SubscriptionStatus {
  id: string;
  status: Stripe.Subscription.Status; // 'active' | 'canceled' | 'past_due' | ...
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  plan: string | null; // 'free' | 'pro' | 'team'
  priceId: string;
}
```

### Supabase
```typescript
import { User } from "@supabase/supabase-js";

// User object has:
// - id, email, user_metadata
// - created_at, updated_at
```

---

## Common Workflows

### New User Subscribe Flow

1. **User signs up** (Clerk/Supabase)
2. **User clicks pricing plan** → redirects to checkout
3. **Checkout creates Stripe customer**
4. **User completes payment**
5. **Webhook updates subscription status**
6. **User redirected to dashboard** with active subscription

### Subscription Management Flow

1. **User views subscription** → fetch with `getSubscriptionStatus()`
2. **User clicks "Cancel"** → call `cancelSubscription()`
3. **User changes mind** → call `reactivateSubscription()`
4. **User upgrades plan** → call `updateSubscriptionPlan()`
5. **User manages payment** → redirect to Stripe portal

### Protected Route Flow

1. **User visits protected page**
2. **Middleware checks auth** (Clerk/Supabase)
3. **If not authenticated** → redirect to sign-in
4. **If authenticated** → load page with user data

---

## Debugging Tips

### Check Auth State
```typescript
// Server
const { userId } = await auth();
console.log('User ID:', userId);

// Client
const { isSignedIn, user } = useUser();
console.log('Signed in:', isSignedIn);
```

### Check Subscription
```typescript
const status = await getSubscriptionStatus(customerId);
console.log('Subscription:', {
  active: status?.status === 'active',
  plan: status?.plan,
  renews: !status?.cancelAtPeriodEnd,
  renewDate: status?.currentPeriodEnd,
});
```

### Test Webhooks Locally
```bash
# Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test event
stripe trigger checkout.session.completed
```

---

## Error Handling

### Auth Errors
```typescript
try {
  const userId = await requireAuth();
} catch (error) {
  // Handle: User not authenticated
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Stripe Errors
```typescript
try {
  await cancelSubscription(subscriptionId);
} catch (error: any) {
  // Handle: Invalid subscription ID, already canceled, etc.
  console.error('Subscription error:', error.message);
  return NextResponse.json({ error: error.message }, { status: 400 });
}
```

---

## Performance Tips

1. **Cache user data** when possible:
```typescript
const user = await unstable_cache(
  async () => await currentUser(),
  ['user', userId],
  { revalidate: 60 }
)();
```

2. **Use subscription status sparingly** - store in database instead of fetching every request

3. **Batch Stripe API calls** when possible:
```typescript
const [subscription, paymentMethods] = await Promise.all([
  getSubscriptionDetails(subscriptionId),
  getCustomerPaymentMethods(customerId),
]);
```

---

*For detailed documentation, see [INTEGRATION_CAPABILITIES.md](./INTEGRATION_CAPABILITIES.md)*
