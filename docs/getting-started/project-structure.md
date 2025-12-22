# Project Structure

Understand the files and folders in your generated project.

## Overview

When you create a project with the framework, you get a well-organized structure with everything you need to build and deploy a production application.

## Root Directory

```
my-app/
├── app/                   # Next.js App Router (pages & routes)
├── components/            # React components
├── lib/                   # Utility libraries
├── public/                # Static assets
├── .dd/                   # Framework configuration
├── .env.local            # Environment variables (local)
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies & scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project README
```

## `app/` Directory

The `app/` directory uses Next.js App Router for file-based routing.

### Structure

```
app/
├── page.tsx              # Landing page (/)
├── layout.tsx            # Root layout (wraps all pages)
├── globals.css           # Global styles
├── login/
│   └── page.tsx         # Login page (/login)
├── dashboard/
│   ├── page.tsx         # Dashboard home (/dashboard)
│   ├── layout.tsx       # Dashboard layout
│   └── settings/
│       └── page.tsx     # Settings (/dashboard/settings)
└── api/
    ├── auth/
    │   └── callback/
    │       └── route.ts  # Auth callback endpoint
    └── webhooks/
        └── stripe/
            └── route.ts  # Stripe webhook endpoint
```

### Key Files

#### `page.tsx` - Page Components

Each `page.tsx` creates a route:

```tsx
// app/page.tsx
export default function HomePage() {
  return <div>Home Page</div>;
}

// Routes to: /
```

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return <div>About Page</div>;
}

// Routes to: /about
```

#### `layout.tsx` - Shared Layouts

Layouts wrap pages and provide shared UI:

```tsx
// app/layout.tsx - Root layout (required)
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

Layouts can be nested:

```tsx
// app/dashboard/layout.tsx - Dashboard layout
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

#### `route.ts` - API Routes

API routes handle backend logic:

```tsx
// app/api/users/route.ts
export async function GET() {
  const users = await db.users.findMany();
  return Response.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.users.create({ data: body });
  return Response.json(user);
}
```

### Routing Examples

| File Path | URL | Purpose |
|-----------|-----|---------|
| `app/page.tsx` | `/` | Home page |
| `app/about/page.tsx` | `/about` | About page |
| `app/blog/page.tsx` | `/blog` | Blog listing |
| `app/blog/[slug]/page.tsx` | `/blog/post-1` | Blog post (dynamic) |
| `app/dashboard/page.tsx` | `/dashboard` | Dashboard home |
| `app/api/users/route.ts` | `/api/users` | Users API |

## `components/` Directory

Reusable React components organized by purpose.

### Structure

```
components/
├── ui/                   # UI primitives
│   ├── button.tsx       # Button component
│   ├── input.tsx        # Input component
│   ├── modal.tsx        # Modal component
│   └── ...
├── auth/                # Authentication components
│   ├── auth-button.tsx  # Sign in/out button
│   ├── login-form.tsx   # Login form
│   └── signup-form.tsx  # Signup form
├── layout/              # Layout components
│   ├── navigation.tsx   # Navigation bar
│   ├── sidebar.tsx      # Sidebar
│   └── footer.tsx       # Footer
└── features/            # Feature-specific components
    ├── pricing/
    │   └── pricing-card.tsx
    └── dashboard/
        └── stats-card.tsx
```

### Component Example

```tsx
// components/ui/button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'
      }`}
    >
      {children}
    </button>
  );
}
```

**Usage:**

```tsx
import { Button } from '@/components/ui/button';

export default function Page() {
  return <Button onClick={() => alert('Clicked!')}>Click Me</Button>;
}
```

## `lib/` Directory

Utility functions, configurations, and third-party service clients.

### Structure

```
lib/
├── supabase.ts          # Supabase client
├── stripe.ts            # Stripe client
├── resend.ts            # Resend client
├── db.ts                # Database utilities
├── utils.ts             # General utilities
└── constants.ts         # App constants
```

### Service Clients

#### `lib/supabase.ts` - Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Usage:**

```typescript
import { supabase } from '@/lib/supabase';

// Sign in user
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

#### `lib/stripe.ts` - Stripe Client

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});
```

**Usage:**

```typescript
import { stripe } from '@/lib/stripe';

// Create checkout session
const session = await stripe.checkout.sessions.create({
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  mode: 'subscription',
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel'
});
```

### Utility Functions

#### `lib/utils.ts` - General Utilities

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Format date
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US').format(date);
}
```

## `public/` Directory

Static assets served directly.

### Structure

```
public/
├── images/
│   ├── logo.svg
│   └── hero.png
├── fonts/
│   └── custom-font.woff2
├── favicon.ico
└── robots.txt
```

**Accessing static files:**

```tsx
// In JSX
<img src="/images/logo.svg" alt="Logo" />

// In CSS
background-image: url('/images/hero.png');
```

**Note:** Files in `public/` are served at the root path (`/`), not `/public/`.

## `.dd/` Directory

Framework-specific configuration and metadata.

### Structure

```
.dd/
├── manifest.json        # Project manifest
├── config.json          # Project configuration
├── health.sh            # Health check script
└── plugins.json         # Installed plugins
```

### Key Files

#### `manifest.json` - Project Manifest

Tracks template version and file changes:

```json
{
  "templateId": "saas",
  "version": "1.0.0",
  "createdAt": "2025-01-20T10:00:00Z",
  "integrations": ["auth.supabase", "payments.stripe"],
  "files": {
    "app/page.tsx": "sha256:abc123...",
    "components/ui/button.tsx": "sha256:def456..."
  }
}
```

Used for drift detection:

```bash
framework drift
```

#### `config.json` - Project Configuration

```json
{
  "plan": "pro",
  "capabilities": {
    "auth": true,
    "payments": true,
    "ai": false
  }
}
```

## Configuration Files

### `package.json` - Dependencies & Scripts

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "stripe": "^14.0.0"
  }
}
```

**Common scripts:**

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Lint code
npm run type-check # TypeScript check
```

### `next.config.js` - Next.js Configuration

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-cdn.com']
  },
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;
```

### `tailwind.config.ts` - Tailwind Configuration

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6'
      }
    }
  },
  plugins: []
};

export default config;
```

### `tsconfig.json` - TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]
    },
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Path aliases:**

```typescript
// Instead of: import { Button } from '../../components/ui/button'
// Use: import { Button } from '@/components/ui/button'
```

## Environment Files

### `.env.local` - Local Environment Variables

**Never commit this file!**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend
RESEND_API_KEY=re_...
```

### `.env.example` - Environment Template

**Commit this file** - shows required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=
```

### Variable Prefix Conventions

- `NEXT_PUBLIC_*` - Exposed to browser
- No prefix - Server-side only

**Example:**

```typescript
// app/page.tsx (client component)
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL); // ✅ Works

// app/api/route.ts (server)
console.log(process.env.STRIPE_SECRET_KEY); // ✅ Works
```

## File Naming Conventions

### Pages & Routes

- `page.tsx` - Page component
- `layout.tsx` - Layout component
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `route.ts` - API route

### Components

- `PascalCase` - Component files (Button.tsx, NavBar.tsx)
- `kebab-case` - Utility files (format-date.ts, api-client.ts)

### TypeScript

- `.tsx` - React components (JSX)
- `.ts` - TypeScript files (no JSX)
- `.d.ts` - Type declarations

## Import Paths

### Absolute Imports

Use `@/` for absolute imports:

```typescript
// ✅ Good - absolute import
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

// ❌ Bad - relative import
import { Button } from '../../components/ui/button';
```

### Module Order

Organize imports:

```typescript
// 1. External packages
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 2. Internal modules
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

// 3. Styles
import './styles.css';
```

## Project Organization Tips

### Component Organization

Group by feature, not type:

```
✅ Good - grouped by feature
components/
├── pricing/
│   ├── pricing-card.tsx
│   ├── pricing-toggle.tsx
│   └── pricing-faq.tsx
└── dashboard/
    ├── stats-card.tsx
    └── activity-feed.tsx

❌ Bad - grouped by type
components/
├── cards/
│   ├── pricing-card.tsx
│   └── stats-card.tsx
└── toggles/
    └── pricing-toggle.tsx
```

### API Routes

Group by resource:

```
app/api/
├── users/
│   ├── route.ts          # GET /api/users, POST /api/users
│   └── [id]/
│       └── route.ts      # GET /api/users/[id], PATCH /api/users/[id]
└── posts/
    └── route.ts          # GET /api/posts, POST /api/posts
```

### Utility Functions

Group related utilities:

```
lib/
├── date/
│   ├── format-date.ts
│   └── parse-date.ts
├── string/
│   ├── slugify.ts
│   └── capitalize.ts
└── validation/
    ├── email.ts
    └── password.ts
```

## Next Steps

Now that you understand the project structure:

- **[Configuration Guide](configuration.md)** - Set up environment variables
- **[Next Steps Guide](next-steps.md)** - What to learn next
- **[Component Guide](../components/README.md)** - Build UI components
- **[API Routes Guide](../api/README.md)** - Create backend endpoints

## Reference

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
