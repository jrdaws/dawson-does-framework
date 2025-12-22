# SaaS Starter Template

Complete guide to building subscription-based web applications with the SaaS Starter template.

## Table of Contents

- [Overview](#overview)
- [What's Included](#whats-included)
- [When to Use This Template](#when-to-use-this-template)
- [File Structure](#file-structure)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Billing & Subscriptions](#billing--subscriptions)
- [Database](#database)
- [User Dashboard](#user-dashboard)
- [Customization Guide](#customization-guide)
- [Integration Recommendations](#integration-recommendations)
- [Example Apps](#example-apps-built-with-saas-template)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

The SaaS Starter template is a production-ready foundation for building subscription-based web applications. It includes everything you need to launch a SaaS product: authentication, subscription billing, user management, and a modern UI.

### Key Features

- User authentication with multiple providers
- Subscription billing with Stripe integration
- User dashboard and account management
- Database setup with Supabase
- TypeScript for type safety
- Responsive UI with Tailwind CSS
- Email notifications
- Multi-tenant architecture ready
- SEO optimization
- Production-ready configuration

### Tech Stack

- **Framework:** Next.js 15 with App Router
- **UI:** React 19, Tailwind CSS
- **Language:** TypeScript 5
- **Auth:** Supabase Auth or Clerk
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **Email:** Resend or SendGrid
- **Analytics:** PostHog or Plausible (optional)
- **AI:** OpenAI or Anthropic (optional)

## What's Included

### Core Features

#### 1. Authentication System

Out of the box authentication with:
- Email/password sign up and login
- Social authentication (Google, GitHub, etc.)
- Magic link (passwordless) authentication
- Email verification
- Password reset flows
- Session management
- Protected routes
- Middleware for auth checking

#### 2. Billing & Subscriptions

Complete billing system including:
- Stripe Checkout integration
- Multiple subscription tiers
- Subscription management
- Payment method updates
- Customer portal
- Webhook handling
- Usage-based billing support
- Trial periods
- Promo codes

#### 3. Database

Pre-configured database with:
- User profiles table
- Subscription status tracking
- Usage metrics
- Audit logs
- Row Level Security (RLS)
- Type-safe database queries
- Real-time subscriptions (optional)

#### 4. User Dashboard

Full-featured dashboard with:
- Account settings
- Billing management
- Usage statistics
- Profile editing
- Team management (optional)
- Activity logs
- Support ticket system (optional)

#### 5. Email System

Transactional emails for:
- Welcome emails
- Email verification
- Password reset
- Subscription notifications
- Payment receipts
- Usage alerts

#### 6. Admin Features

Admin capabilities including:
- User management
- Subscription overview
- Revenue analytics
- Support tools
- Feature flags
- System health monitoring

### File Structure

```
my-saas-app/
├── app/
│   ├── (auth)/                    # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── signup/
│   │   │   └── page.tsx          # Sign up page
│   │   ├── verify/
│   │   │   └── page.tsx          # Email verification
│   │   └── reset-password/
│   │       └── page.tsx          # Password reset
│   ├── (dashboard)/               # Protected dashboard routes
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard
│   │   ├── settings/
│   │   │   ├── account/
│   │   │   ├── billing/
│   │   │   └── profile/
│   │   └── layout.tsx            # Dashboard layout
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/         # Auth callback
│   │   ├── stripe/
│   │   │   ├── checkout/         # Create checkout
│   │   │   ├── portal/           # Customer portal
│   │   │   └── webhook/          # Stripe webhooks
│   │   └── users/
│   │       └── [id]/             # User API routes
│   ├── pricing/
│   │   └── page.tsx              # Pricing page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── auth/
│   │   ├── auth-button.tsx
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── billing/
│   │   ├── pricing-cards.tsx
│   │   ├── subscription-status.tsx
│   │   └── payment-method.tsx
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── stats-card.tsx
│   └── ui/                       # Shared UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── stripe.ts                 # Stripe client
│   ├── email.ts                  # Email utilities
│   ├── auth.ts                   # Auth utilities
│   └── db.ts                     # Database utilities
├── types/
│   ├── supabase.ts               # Database types
│   ├── stripe.ts                 # Stripe types
│   └── index.ts                  # Global types
├── integrations/                  # Available integrations
│   ├── auth/
│   │   ├── supabase/
│   │   └── clerk/
│   ├── payments/
│   │   └── stripe/
│   ├── db/
│   │   └── supabase/
│   └── email/
│       ├── resend/
│       └── sendgrid/
├── .dd/
│   ├── config.json               # Framework config
│   └── health.sh                 # Health check script
├── .env.example                  # Environment template
├── template.json                 # Template metadata
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## When to Use This Template

### Perfect For

The SaaS template is ideal when you're building:

**B2B SaaS Applications:**
- Project management tools
- Analytics platforms
- Collaboration software
- Business automation tools
- API platforms
- Developer tools

**B2C Subscription Services:**
- Productivity apps
- Learning platforms
- Content platforms
- Fitness apps
- Finance tools

**Membership Sites:**
- Premium content sites
- Community platforms
- Course platforms
- Resource libraries

**Multi-Tenant Applications:**
- Agency platforms
- White-label solutions
- Workspace management
- Team collaboration tools

### Not Ideal For

Consider other templates if you're building:

- **Simple landing pages** → Use Landing Page template
- **Blogs or content sites** → Use Blog template
- **Internal tools without billing** → Use Dashboard template
- **Static directories** → Use SEO Directory template
- **One-time purchase apps** → Modify template or use different approach

## Quick Start

### 1. Export the Template

```bash
# Export with default integrations (Supabase + Stripe)
framework export saas ./my-saas-app

# Export with specific integrations
framework export saas ./my-saas-app \
  --auth supabase \
  --db supabase \
  --payments stripe \
  --email resend

# Export with all integrations
framework export saas ./my-saas-app \
  --auth supabase \
  --db supabase \
  --payments stripe \
  --email resend \
  --ai anthropic \
  --analytics posthog
```

### 2. Install Dependencies

```bash
cd my-saas-app
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="My SaaS App"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Optional: AI
ANTHROPIC_API_KEY="sk-ant-..."

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

### 4. Set Up Database

```bash
# The framework will guide you through database setup
framework integrate db supabase

# Or manually:
# 1. Create Supabase project at supabase.com
# 2. Run migrations in SQL editor
# 3. Enable Row Level Security
```

### 5. Configure Stripe

```bash
# Set up Stripe products and pricing
framework integrate payments stripe

# Or manually:
# 1. Create products in Stripe dashboard
# 2. Set up webhook endpoint
# 3. Configure pricing tiers
```

### 6. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 7. Test the Flow

1. **Sign up** at `/signup`
2. **Verify email** (check console logs in dev)
3. **View dashboard** at `/dashboard`
4. **Test subscription** at `/pricing`
5. **Manage billing** at `/settings/billing`

## Authentication

### Supported Providers

The template supports multiple authentication providers:

#### Supabase Auth (Default)

Features:
- Email/password authentication
- Social logins (Google, GitHub, etc.)
- Magic links
- Multi-factor authentication
- Row Level Security integration

Setup:
```bash
framework integrate auth supabase
```

See [Supabase Auth Guide](../integrations/auth/supabase.md)

#### Clerk

Features:
- Pre-built UI components
- Social logins
- MFA
- User management dashboard
- Organization support

Setup:
```bash
framework integrate auth clerk
```

See [Clerk Auth Guide](../integrations/auth/clerk.md)

### Authentication Flow

```typescript
// lib/auth.ts
import { createServerClient } from '@supabase/ssr'

export async function getUser() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signUp(email: string, password: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    }
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export async function signOut() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
}
```

### Protected Routes

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*']
}
```

### Login Component

```typescript
// components/auth/login-form.tsx
'use client'

import { useState } from 'react'
import { signIn } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
```

## Billing & Subscriptions

### Stripe Integration

The template includes complete Stripe integration for subscription billing.

#### Pricing Configuration

```typescript
// lib/stripe-config.ts
export const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals',
    price: 9,
    interval: 'month',
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
    features: [
      '5 projects',
      'Basic support',
      '1GB storage',
      'Email notifications'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for professionals',
    price: 29,
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited projects',
      'Priority support',
      '10GB storage',
      'Email notifications',
      'Advanced analytics',
      'API access'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large teams',
    price: 99,
    interval: 'month',
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Everything in Pro',
      '24/7 support',
      'Unlimited storage',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee'
    ]
  }
]
```

#### Checkout Flow

```typescript
// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await req.json()

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

#### Webhook Handling

```typescript
// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: subscription.metadata.userId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer,
          status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
        })
      break

    case 'customer.subscription.deleted':
      const canceledSubscription = event.data.object
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', canceledSubscription.id)
      break

    case 'invoice.payment_succeeded':
      // Send payment confirmation email
      break

    case 'invoice.payment_failed':
      // Send payment failure email
      break
  }

  return NextResponse.json({ received: true })
}
```

#### Pricing Cards Component

```typescript
// components/billing/pricing-cards.tsx
'use client'

import { useState } from 'react'
import { pricingPlans } from '@/lib/stripe-config'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSubscribe(priceId: string) {
    setLoading(priceId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {pricingPlans.map((plan) => (
        <div
          key={plan.id}
          className={`
            border rounded-lg p-8
            ${plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}
          `}
        >
          {plan.popular && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Popular
            </span>
          )}

          <h3 className="text-2xl font-bold mt-4">{plan.name}</h3>
          <p className="text-gray-600 mt-2">{plan.description}</p>

          <div className="mt-6">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-gray-600">/{plan.interval}</span>
          </div>

          <ul className="mt-6 space-y-3">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe(plan.stripePriceId!)}
            disabled={loading === plan.stripePriceId}
            className={`
              w-full mt-8 py-3 rounded-md font-semibold
              ${plan.popular
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }
              disabled:opacity-50
            `}
          >
            {loading === plan.stripePriceId ? 'Loading...' : 'Subscribe'}
          </button>
        </div>
      ))}
    </div>
  )
}
```

### Customer Portal

Allow users to manage their subscriptions:

```typescript
// app/api/stripe/portal/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get customer ID from database
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
```

## Database

### Schema

The template includes a pre-configured database schema:

```sql
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
  price_id text not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Usage tracking table
create table public.usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  resource_type text not null,
  quantity integer not null default 0,
  period_start timestamp with time zone not null,
  period_end timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage enable row level security;

-- RLS Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can view own usage"
  on public.usage for select
  using (auth.uid() = user_id);
```

### Database Client

```typescript
// lib/db.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Type-safe queries
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Database['public']['Tables']['profiles']['Update']>
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No subscription
    throw error
  }

  return data
}
```

## User Dashboard

### Dashboard Layout

```typescript
// app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.Node
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### Dashboard Components

```typescript
// components/dashboard/stats-card.tsx
interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    positive: boolean
  }
  icon?: React.ReactNode
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>

      {change && (
        <div className={`mt-4 text-sm ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
          {change.positive ? '↑' : '↓'} {Math.abs(change.value)}% from last month
        </div>
      )}
    </div>
  )
}
```

## Customization Guide

### Branding

Update your brand colors and styling:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // Change your primary color
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Add your brand colors
        brand: {
          primary: '#YOUR_COLOR',
          secondary: '#YOUR_COLOR',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],  // Change your font
      },
    },
  },
  plugins: [],
}
```

### Adding Features

Add new dashboard pages:

```typescript
// app/(dashboard)/analytics/page.tsx
import { getUser } from '@/lib/auth'
import { getUserAnalytics } from '@/lib/analytics'

export default async function AnalyticsPage() {
  const user = await getUser()
  const analytics = await getUserAnalytics(user.id)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      {/* Your analytics UI */}
    </div>
  )
}
```

### Email Templates

Customize transactional emails:

```typescript
// lib/email-templates.ts
export function getWelcomeEmail(userName: string) {
  return {
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!`,
    html: `
      <h1>Welcome, ${userName}!</h1>
      <p>Thanks for joining us. Here's how to get started:</p>
      <ol>
        <li>Complete your profile</li>
        <li>Choose a subscription plan</li>
        <li>Start using our features</li>
      </ol>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a>
    `,
  }
}

export function getSubscriptionConfirmationEmail(planName: string) {
  return {
    subject: 'Subscription Confirmed',
    html: `
      <h1>Subscription Confirmed</h1>
      <p>Your ${planName} subscription is now active.</p>
      <p>You'll be billed monthly starting today.</p>
    `,
  }
}
```

## Integration Recommendations

### Recommended Stack

For a production-ready SaaS, we recommend:

**Essential:**
- **Auth:** Supabase Auth or Clerk
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **Email:** Resend

**Highly Recommended:**
- **Analytics:** PostHog (product analytics)
- **Monitoring:** Sentry (error tracking)
- **Logging:** Axiom or Logtail

**Optional but Useful:**
- **AI:** Anthropic Claude or OpenAI
- **Search:** Algolia
- **File Storage:** Uploadthing or Supabase Storage
- **Queue:** Inngest or Trigger.dev
- **CMS:** Sanity or Contentful (for marketing pages)

### Integration Examples

Add AI features:

```bash
framework integrate ai anthropic
```

Add analytics:

```bash
framework integrate analytics posthog
```

Add file uploads:

```bash
framework integrate storage uploadthing
```

## Example Apps Built with SaaS Template

### 1. Project Management Tool

Built with: SaaS template + Supabase + Stripe + PostHog

Features added:
- Team workspaces
- Task management
- Real-time collaboration
- File attachments
- Activity feeds
- Usage-based billing

Key customizations:
- Added real-time database subscriptions
- Custom permission system
- Workspace invitation flow
- Activity tracking

### 2. Analytics Platform

Built with: SaaS template + Clerk + Stripe + ClickHouse

Features added:
- Event tracking SDK
- Real-time dashboards
- Custom reports
- Data export
- API access
- Usage-based pricing

Key customizations:
- High-volume data ingestion
- Custom chart components
- API key management
- White-label options

### 3. Course Platform

Built with: SaaS template + Supabase + Stripe + Mux

Features added:
- Video hosting
- Course builder
- Student progress tracking
- Certificates
- Discussion forums
- Drip content

Key customizations:
- Video player integration
- Progress tracking system
- Certificate generation
- Content scheduling

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy --prod
```

Configure environment variables in Vercel dashboard.

### Environment Variables Checklist

Production environment variables:

```bash
# App
NEXT_PUBLIC_APP_NAME="Your SaaS Name"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Product IDs (create in Stripe dashboard)
STRIPE_STARTER_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# Email
RESEND_API_KEY="re_..."

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Optional: AI
ANTHROPIC_API_KEY="sk-ant-..."
```

### Post-Deployment Checklist

- [ ] Update Supabase redirect URLs
- [ ] Configure Stripe webhook in production
- [ ] Test authentication flow
- [ ] Test subscription flow
- [ ] Verify email sending
- [ ] Set up monitoring
- [ ] Configure domain and SSL
- [ ] Test payment webhooks
- [ ] Verify database backups
- [ ] Set up error tracking

### Database Migrations

```bash
# Create migration
supabase migration new add_feature

# Apply migration locally
supabase db push

# Apply to production
supabase db push --db-url "postgresql://..."
```

## Troubleshooting

### Common Issues

**Authentication not working:**

```bash
# Check Supabase configuration
# 1. Verify API keys in .env.local
# 2. Check redirect URLs in Supabase dashboard
# 3. Verify email templates are enabled
# 4. Check browser console for errors
```

**Stripe webhook failing:**

```bash
# Local testing with Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Verify webhook secret matches
echo $STRIPE_WEBHOOK_SECRET

# Check webhook logs in Stripe dashboard
```

**Database queries failing:**

```bash
# Check Row Level Security policies
# 1. Verify user is authenticated
# 2. Check RLS policies in Supabase
# 3. Use service role key for admin operations
# 4. Check database logs in Supabase
```

**Build errors:**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

### Getting Help

- **Documentation:** [Framework Docs](https://github.com/jrdaws/dawson-does-framework)
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Stripe:** [stripe.com/docs](https://stripe.com/docs)
- **Issues:** [GitHub Issues](https://github.com/jrdaws/dawson-does-framework/issues)

## Next Steps

1. **Customize the template** - Update branding and styling
2. **Add your features** - Build your unique functionality
3. **Set up integrations** - Configure auth, payments, email
4. **Test thoroughly** - Test all user flows
5. **Deploy to production** - Launch on Vercel
6. **Monitor and iterate** - Use analytics to improve

## Resources

- [Template Registry](../TEMPLATE_REGISTRY.md)
- [Integration System](../integrations/README.md)
- [Deployment Guide](../deploy/README.md)
- [CLI Reference](../cli/README.md)

---

**Ready to build your SaaS?** Start with `framework export saas ./my-app`
