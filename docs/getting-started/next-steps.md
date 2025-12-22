# Next Steps

You've created your first project. Here's what to learn next based on your goals.

## Choose Your Learning Path

Select the path that matches your current goal:

### 🎨 [Customize the Design](#customize-design)
Make the app look unique with custom styling and branding.

### 🔐 [Set Up Authentication](#setup-authentication)
Configure user sign-up, login, and protected routes.

### 💳 [Add Payment Processing](#add-payments)
Implement subscriptions and one-time payments with Stripe.

### 📊 [Build a Database](#build-database)
Create tables, write queries, and manage data.

### 🤖 [Add AI Features](#add-ai-features)
Integrate GPT-4, Claude, or other AI models.

### 🚀 [Deploy to Production](#deploy-production)
Get your app live and accessible to users.

### 🧪 [Add Testing](#add-testing)
Write tests to ensure code quality and catch bugs.

### 📈 [Track Analytics](#track-analytics)
Understand user behavior with event tracking.

---

## Customize Design

### Learn These Concepts

1. **Tailwind CSS** - Utility-first CSS framework
2. **Component styling** - Styling React components
3. **Responsive design** - Mobile, tablet, desktop
4. **Dark mode** - Theme switching
5. **Custom fonts** - Typography

### Quick Wins

#### Change Colors

Edit `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',    // Change to your brand color
        secondary: '#8b5cf6',
        accent: '#f59e0b'
      }
    }
  }
};
```

#### Add Custom Fonts

1. Add font files to `public/fonts/`
2. Import in `app/globals.css`:

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.woff2') format('woff2');
}

body {
  font-family: 'CustomFont', sans-serif;
}
```

#### Update Logo

Replace logo in `public/images/logo.svg` and update references in:
- `components/layout/navigation.tsx`
- `app/layout.tsx` (metadata)

### Resources

- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** - Complete Tailwind guide
- **[Tailwind UI](https://tailwindui.com/)** - Pre-built components (paid)
- **[Headless UI](https://headlessui.com/)** - Unstyled components
- **[Shadcn UI](https://ui.shadcn.com/)** - Copy-paste components

### Next Steps

1. Browse Tailwind components on [Tailwind UI](https://tailwindui.com/components)
2. Copy components you like
3. Customize colors and spacing
4. Add to your project

---

## Setup Authentication

### Learn These Concepts

1. **User sessions** - How authentication works
2. **Protected routes** - Restricting access
3. **Middleware** - Request interception
4. **OAuth** - Social login (Google, GitHub)
5. **Email verification** - Confirming user emails

### Quick Setup

#### Configure Supabase Auth

1. **Enable auth providers** in Supabase dashboard:
   - Go to Authentication → Providers
   - Enable Email
   - Enable OAuth providers (Google, GitHub, etc.)

2. **Set up redirect URLs**:
   - Development: `http://localhost:3000/api/auth/callback`
   - Production: `https://yourapp.com/api/auth/callback`

#### Add Protected Routes

Create middleware to protect routes:

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Protect /dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*']
};
```

### Resources

- **[Supabase Auth Guide](../integrations/auth/supabase.md)** - Complete setup
- **[Supabase Auth Docs](https://supabase.com/docs/guides/auth)** - Official docs
- **[Clerk Auth Guide](../integrations/auth/clerk.md)** - Alternative provider

### Next Steps

1. Set up email authentication
2. Add OAuth providers (Google, GitHub)
3. Create user profile pages
4. Add role-based access control

---

## Add Payments

### Learn These Concepts

1. **Stripe Checkout** - Pre-built payment page
2. **Subscriptions** - Recurring payments
3. **Webhooks** - Payment event handling
4. **Customer portal** - Self-service management
5. **Test mode** - Development without real charges

### Quick Setup

#### Create Products in Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click Products → Add Product
3. Name: "Pro Plan"
4. Price: $29/month
5. Copy the Price ID (starts with `price_`)

#### Add Pricing Page

Create `app/pricing/page.tsx`:

```tsx
import { stripe } from '@/lib/stripe';

export default async function PricingPage() {
  const prices = await stripe.prices.list({
    active: true,
    expand: ['data.product']
  });

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Pricing</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {prices.data.map((price) => (
          <div key={price.id} className="border rounded-lg p-8">
            <h3 className="text-2xl font-bold">{price.product.name}</h3>
            <p className="text-4xl font-bold my-4">
              ${price.unit_amount / 100}/mo
            </p>
            <form action="/api/checkout" method="POST">
              <input type="hidden" name="priceId" value={price.id} />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                Subscribe
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Add Checkout API

Create `app/api/checkout/route.ts`:

```typescript
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { priceId } = await request.json();

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  });

  return NextResponse.redirect(session.url);
}
```

### Resources

- **[Stripe Integration Guide](../integrations/payments/stripe.md)** - Complete setup
- **[Stripe Docs](https://stripe.com/docs)** - Official documentation
- **[Stripe Testing](https://stripe.com/docs/testing)** - Test card numbers

### Next Steps

1. Create products and prices in Stripe dashboard
2. Implement checkout flow
3. Set up webhooks for payment events
4. Add customer portal for subscription management
5. Test with Stripe test cards

---

## Build Database

### Learn These Concepts

1. **Database schema** - Tables and relationships
2. **SQL queries** - Selecting and manipulating data
3. **Migrations** - Versioning database changes
4. **Row-level security** - Protecting user data
5. **Real-time subscriptions** - Live data updates

### Quick Setup

#### Create Tables

In Supabase SQL Editor:

```sql
-- Users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  content text,
  published boolean default false,
  created_at timestamp with time zone default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.posts enable row level security;

-- Policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can view published posts"
  on posts for select
  using (published = true);
```

#### Query Data

```typescript
// app/posts/page.tsx
import { supabase } from '@/lib/supabase';

export default async function PostsPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div>
      {posts?.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
```

### Resources

- **[Supabase Database Guide](../integrations/database/supabase.md)** - Complete setup
- **[Supabase Docs](https://supabase.com/docs/guides/database)** - Official docs
- **[SQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)** - Learn SQL

### Next Steps

1. Design your database schema
2. Create tables in Supabase
3. Set up row-level security policies
4. Write queries to fetch and mutate data
5. Add real-time subscriptions

---

## Add AI Features

### Learn These Concepts

1. **LLM APIs** - OpenAI, Anthropic
2. **Prompt engineering** - Getting good results
3. **Streaming responses** - Real-time output
4. **Rate limiting** - Preventing abuse
5. **Cost management** - Controlling API usage

### Quick Setup

#### Add Chat Completion

```typescript
// app/api/chat/route.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
    max_tokens: 500
  });

  return Response.json({
    response: completion.choices[0].message.content
  });
}
```

#### Create Chat UI

```tsx
// app/chat/page.tsx
'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="container mx-auto py-16">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ask me anything..."
        />
        <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded">
          Send
        </button>
      </form>
      {response && (
        <div className="mt-8 p-4 bg-gray-100 rounded">
          {response}
        </div>
      )}
    </div>
  );
}
```

### Resources

- **[OpenAI Integration Guide](../integrations/ai/openai.md)** - Complete setup
- **[Anthropic Integration Guide](../integrations/ai/anthropic.md)** - Claude API
- **[OpenAI Docs](https://platform.openai.com/docs)** - Official docs
- **[Prompt Engineering Guide](https://www.promptingguide.ai/)** - Best practices

### Next Steps

1. Get OpenAI or Anthropic API key
2. Implement basic chat completion
3. Add streaming for real-time responses
4. Implement rate limiting
5. Add conversation history

---

## Deploy Production

### Learn These Concepts

1. **Deployment platforms** - Vercel, Netlify, Railway
2. **Environment variables** - Production configuration
3. **Domain setup** - Custom domains
4. **CI/CD** - Automated deployments
5. **Monitoring** - Error tracking and analytics

### Quick Deploy

#### Setup Credentials

```bash
# Get token from https://vercel.com/account/tokens
framework deploy:auth save vercel YOUR_TOKEN
```

#### Deploy

```bash
framework deploy --prod
```

#### Set Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

### Resources

- **[Deployment Guide](../deploy/README.md)** - Complete deployment guide
- **[Vercel Deployment](../deploy/vercel.md)** - Vercel-specific guide
- **[Environment Variables](../deploy/credentials.md)** - Managing secrets

### Next Steps

1. Deploy to preview environment
2. Test thoroughly
3. Set up custom domain
4. Configure environment variables
5. Deploy to production
6. Set up monitoring

---

## Add Testing

### Learn These Concepts

1. **Unit tests** - Testing functions
2. **Integration tests** - Testing API routes
3. **E2E tests** - Testing user flows
4. **Test coverage** - Ensuring code is tested
5. **CI/CD integration** - Automated testing

### Quick Setup

#### Install Testing Libraries

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

#### Write Your First Test

```typescript
// components/ui/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

#### Run Tests

```bash
npm test
```

### Resources

- **[Testing Library Docs](https://testing-library.com/)** - React testing
- **[Jest Docs](https://jestjs.io/)** - Test framework
- **[Playwright](https://playwright.dev/)** - E2E testing

### Next Steps

1. Set up Jest configuration
2. Write unit tests for utilities
3. Write integration tests for API routes
4. Add E2E tests with Playwright
5. Set up test coverage reporting

---

## Track Analytics

### Learn These Concepts

1. **Event tracking** - Recording user actions
2. **Page views** - Tracking navigation
3. **User identification** - Linking events to users
4. **Funnels** - Conversion tracking
5. **Retention** - User return rates

### Quick Setup

#### Install PostHog

```bash
npm install posthog-js
```

#### Initialize PostHog

```typescript
// app/providers.tsx
'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: 'https://app.posthog.com'
    });
  }, []);

  return <>{children}</>;
}
```

#### Track Events

```typescript
import posthog from 'posthog-js';

// Track button click
posthog.capture('button_clicked', {
  button_name: 'Subscribe',
  plan: 'Pro'
});

// Identify user
posthog.identify(userId, {
  email: user.email,
  name: user.name
});
```

### Resources

- **[PostHog Integration Guide](../integrations/analytics/posthog.md)** - Complete setup
- **[PostHog Docs](https://posthog.com/docs)** - Official documentation
- **[Plausible Guide](../integrations/analytics/plausible.md)** - Alternative (privacy-focused)

### Next Steps

1. Set up PostHog or Plausible account
2. Add analytics provider to your app
3. Track key events (signups, purchases, etc.)
4. Create dashboards to monitor metrics
5. Set up funnels to track conversions

---

## Learning Resources

### Official Documentation

- **[Framework Docs](../README.md)** - All framework documentation
- **[Next.js Docs](https://nextjs.org/docs)** - Next.js framework
- **[React Docs](https://react.dev/)** - React library
- **[TypeScript Docs](https://www.typescriptlang.org/docs/)** - TypeScript language

### Video Tutorials

Coming soon! Subscribe for updates.

### Community

- **[GitHub Discussions](https://github.com/jrdaws/framework/discussions)** - Ask questions
- **[GitHub Issues](https://github.com/jrdaws/framework/issues)** - Report bugs
- **[Twitter](https://twitter.com/jrdaws)** - Updates and tips

### Example Projects

- **[SaaS Example](https://github.com/jrdaws/framework-examples/saas)** - Full SaaS app
- **[Blog Example](https://github.com/jrdaws/framework-examples/blog)** - Content site
- **[Dashboard Example](https://github.com/jrdaws/framework-examples/dashboard)** - Admin panel

## Summary

You now have a roadmap for building your application. Choose the path that matches your current priority and start building!

**Quick links:**
- [Customize Design](#customize-design)
- [Setup Authentication](#setup-authentication)
- [Add Payments](#add-payments)
- [Build Database](#build-database)
- [Add AI Features](#add-ai-features)
- [Deploy Production](#deploy-production)
- [Add Testing](#add-testing)
- [Track Analytics](#track-analytics)

**Need help?** Join our [community discussions](https://github.com/jrdaws/framework/discussions).

Happy building! 🚀
