# Paddle Payments Integration

Paddle is a complete payments infrastructure for SaaS companies. Unlike Stripe, Paddle is a Merchant of Record (MoR), meaning they handle all tax compliance, invoicing, and payment processing globally.

## Features

- **Subscription Management**: Create, update, pause, and cancel subscriptions
- **Global Tax Compliance**: Paddle handles VAT, GST, and sales tax automatically
- **Overlay Checkout**: Modern checkout experience without redirects
- **Webhook Integration**: Real-time subscription status updates
- **Customer Portal**: Allow customers to manage payment methods
- **Multiple Currencies**: Accept payments in 20+ currencies

## Quick Start

### 1. Install Dependencies

```bash
npm install @paddle/paddle-node-sdk
```

### 2. Configure Environment Variables

Add these to your `.env.local`:

```env
# Server-side
PADDLE_API_KEY=your_paddle_api_key

# Client-side (for Paddle.js)
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_client_token

# Webhook verification
PADDLE_WEBHOOK_SECRET=your_webhook_secret

# Price IDs (from Paddle dashboard)
PADDLE_PRO_PRICE_ID=pri_xxxxx
PADDLE_TEAM_PRICE_ID=pri_xxxxx
```

### 3. Get Your Credentials

1. Create an account at [paddle.com](https://paddle.com)
2. Go to **Developer Tools > Authentication** to get your API key
3. Go to **Developer Tools > Client-side Tokens** for your client token
4. Create products and prices in **Catalog > Products**

## Usage

### Import Components

```tsx
import { PaddlePricingCards, PaddleSubscriptionManager } from "@/components/pricing/paddle-pricing-cards";
```

### Display Pricing

```tsx
export default function PricingPage() {
  return (
    <div>
      <h1>Choose Your Plan</h1>
      <PaddlePricingCards />
    </div>
  );
}
```

### Subscription Management

```tsx
export default function SettingsPage() {
  return (
    <div>
      <h2>Billing</h2>
      <PaddleSubscriptionManager />
    </div>
  );
}
```

## API Endpoints

### Create Checkout Session

```
POST /api/paddle/checkout
Content-Type: application/json

{
  "plan": "pro" | "team"
}

Response:
{
  "transactionId": "txn_xxxxx",
  "clientToken": "live_xxxxx"
}
```

### Manage Subscription

```
POST /api/paddle/portal

Response:
{
  "url": "https://checkout.paddle.com/...",
  "subscription": {
    "id": "sub_xxxxx",
    "status": "active",
    "nextBilledAt": "2024-02-01T00:00:00Z"
  }
}
```

### Cancel Subscription

```
DELETE /api/paddle/portal

Response:
{
  "success": true,
  "message": "Subscription will be canceled at the end of the billing period"
}
```

## Webhook Events

Configure your webhook endpoint in the Paddle dashboard:

```
https://your-domain.com/api/paddle/webhook
```

Handled events:
- `transaction.completed` - Payment successful
- `subscription.created` - New subscription started
- `subscription.activated` - Subscription became active
- `subscription.updated` - Subscription details changed
- `subscription.canceled` - Subscription was canceled
- `subscription.paused` - Subscription was paused
- `subscription.past_due` - Payment failed

## Library Functions

### Customer Management

```typescript
import { ensureCustomer } from "@/lib/paddle";

// Get or create a customer
const customer = await ensureCustomer(
  "user@example.com",
  "user_123"
);
```

### Subscription Queries

```typescript
import {
  getSubscriptionStatus,
  getSubscriptionDetails,
} from "@/lib/paddle";

// Get basic subscription status
const status = await getSubscriptionStatus("sub_xxxxx");
// Returns: { id, status, currentPeriodEnd, canceledAt, plan, priceId }

// Get detailed subscription info
const details = await getSubscriptionDetails("sub_xxxxx");
// Returns: { ...status, customerId, startedAt, nextBilledAt, scheduledChange }
```

### Subscription Actions

```typescript
import {
  cancelSubscription,
  resumeSubscription,
  updateSubscriptionPlan,
} from "@/lib/paddle";

// Cancel at end of billing period
await cancelSubscription("sub_xxxxx");

// Resume a paused/canceled subscription
await resumeSubscription("sub_xxxxx");

// Upgrade/downgrade plan
await updateSubscriptionPlan("sub_xxxxx", "pri_new_price_id");
```

## Database Schema

Add these fields to your users table:

```sql
ALTER TABLE users ADD COLUMN paddle_customer_id TEXT;
ALTER TABLE users ADD COLUMN paddle_subscription_id TEXT;
ALTER TABLE users ADD COLUMN subscription_plan TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN subscription_status TEXT;
ALTER TABLE users ADD COLUMN subscription_period_end TIMESTAMPTZ;
```

## Paddle vs Stripe

| Feature | Paddle | Stripe |
|---------|--------|--------|
| Tax Compliance | Automatic (global) | You handle it |
| Merchant of Record | Yes | No |
| Checkout | Overlay | Redirect or embedded |
| Pricing | Higher fees, less work | Lower fees, more work |
| Invoicing | Paddle handles | You handle |
| Refunds | Paddle processes | You process |

**Choose Paddle if**:
- You sell globally and don't want to handle tax compliance
- You want someone else to be the legal seller
- You prefer simplicity over maximum control

**Choose Stripe if**:
- You want lower transaction fees
- You need maximum customization
- You're already set up for tax compliance

## Testing

### Sandbox Mode

The integration automatically uses Paddle's sandbox in development:

```typescript
if (process.env.NODE_ENV !== "production") {
  window.Paddle.Environment.set("sandbox");
}
```

### Test Cards

In sandbox mode, use these test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`

## Troubleshooting

### Checkout Not Opening

1. Verify `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` is set
2. Check browser console for Paddle.js errors
3. Ensure Paddle.js script loaded successfully

### Webhook Signature Failures

1. Verify `PADDLE_WEBHOOK_SECRET` matches your dashboard
2. Ensure you're using the raw request body
3. Check webhook endpoint is accessible publicly

### Missing Subscription Updates

1. Confirm webhook endpoint is configured in Paddle dashboard
2. Check webhook delivery logs in Paddle
3. Verify your database updates are running

## Security Notes

- Never expose `PADDLE_API_KEY` to the client
- Always verify webhook signatures
- Use HTTPS for all webhook endpoints
- Store customer IDs securely

## Related Resources

- [Paddle Billing Docs](https://developer.paddle.com/concepts/overview)
- [Paddle.js Reference](https://developer.paddle.com/paddlejs/overview)
- [Webhook Events](https://developer.paddle.com/webhooks/overview)
- [API Reference](https://developer.paddle.com/api-reference/overview)

