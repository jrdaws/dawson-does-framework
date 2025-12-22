# Your First Project

Create your first production-ready application in 10 minutes.

## What You'll Build

A fully functional SaaS application with:

- ✅ User authentication (sign up, login, logout)
- ✅ Payment processing (Stripe integration)
- ✅ Database (Supabase Postgres)
- ✅ Responsive UI (Tailwind CSS)
- ✅ TypeScript for type safety
- ✅ Production-ready (error handling, security)

## Step 1: Choose Your Template

Let's start with the SaaS template - it's the most feature-complete.

**Browse available templates:**

```bash
framework templates list
```

**Get detailed info:**

```bash
framework templates info saas
```

**Output:**
```
📦 SaaS Starter

ID:          saas
Version:     1.0.0
Category:    SaaS
Author:      Dawson Framework Team

Description:
  Full-stack SaaS template with authentication and billing

Tags: nextjs, react, saas, auth, billing

Features:
  - Next.js 15 with App Router
  - Supabase authentication
  - Stripe billing
  - TypeScript
  - Tailwind CSS
  - Server components

Supported Integrations:
  auth: supabase, clerk
  payments: stripe, paddle
  db: supabase, planetscale
  email: resend, sendgrid
  ai: openai, anthropic
  analytics: posthog, plausible
```

## Step 2: Create Your Project

Create a new project with integrations:

```bash
framework export saas ./my-saas-app \
  --auth supabase \
  --payments stripe \
  --email resend
```

**What this does:**

1. **Clones the SaaS template** from the registry
2. **Applies integrations:**
   - Adds Supabase auth files
   - Adds Stripe payment files
   - Adds Resend email files
3. **Creates manifest** for tracking changes
4. **Initializes git** repository

**Expected output:**

```
🎯 Framework Export

📦 Resolving template...
   Mode: remote
   Repository: jrdaws/dawson-does-framework/templates/saas
   ✓ Template resolved

📦 Cloning template...
   ✓ Template cloned: saas

🔌 Validating integrations...
   ✓ Integration valid: auth.supabase
   ✓ Integration valid: payments.stripe
   ✓ Integration valid: email.resend

🔌 Applying integrations...
   ✓ Integration applied: auth.supabase
   ✓ Integration applied: payments.stripe
   ✓ Integration applied: email.resend

📝 Writing manifest...
   ✓ Manifest created: .dd/manifest.json

🎨 Initializing git repository...
   ✓ Git initialized

✅ Export complete!

Next steps:
  cd my-saas-app
  npm install
  cp .env.example .env.local
  # Add your API keys to .env.local
  npm run dev
```

## Step 3: Install Dependencies

Navigate to your project and install dependencies:

```bash
cd my-saas-app
npm install
```

This installs:
- Next.js and React
- Supabase client library
- Stripe SDK
- Resend SDK
- Tailwind CSS
- TypeScript
- And all other dependencies

**Time:** ~2 minutes (depending on internet speed)

## Step 4: Configure Environment Variables

Copy the environment template:

```bash
cp .env.example .env.local
```

Now you need to add your API keys. Let's get them:

### Get Supabase Keys

1. Go to [supabase.com](https://supabase.com/)
2. Sign in or create account
3. Click "New project"
4. Fill in details (name, password, region)
5. Wait for project to be created (~2 minutes)
6. Go to Settings → API
7. Copy these values:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Get Stripe Keys

1. Go to [stripe.com](https://stripe.com/)
2. Sign in or create account
3. Click "Developers" in the top nav
4. Click "API keys"
5. Copy these values:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

**Note:** Use test mode keys for development (they start with `pk_test_` and `sk_test_`)

### Get Resend Key

1. Go to [resend.com](https://resend.com/)
2. Sign in or create account
3. Click "API Keys"
4. Click "Create API Key"
5. Give it a name (e.g., "Development")
6. Copy the key → `RESEND_API_KEY`

### Update .env.local

Open `.env.local` and add your keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Resend
RESEND_API_KEY=re_...
```

**Important:**
- Never commit `.env.local` to git (it's already in `.gitignore`)
- Use test/development keys during development
- Switch to production keys only when deploying

## Step 5: Start Development Server

Start the dev server:

```bash
npm run dev
```

**Expected output:**

```
   ▲ Next.js 15.0.0
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 1.2s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**You should see:**
- Landing page with hero section
- Navigation with "Sign In" button
- Footer with links

🎉 **Your app is running!**

## Step 6: Explore Your App

Let's explore what you've built.

### Try Authentication

1. Click "Sign In" in the navigation
2. You'll see a login form
3. Click "Sign up" to create an account
4. Enter email and password
5. Click "Sign Up"
6. Check your email for verification link (from Supabase)
7. Click the link to verify
8. You're now logged in!

### Check the Dashboard

After logging in:

1. You're redirected to `/dashboard`
2. You'll see a welcome message with your email
3. Try navigating the dashboard sidebar
4. Click "Settings" to update your profile
5. Click "Sign Out" to log out

### Test Payments (Test Mode)

1. Go to `/pricing` (or click "Pricing" in nav)
2. Click "Subscribe" on any plan
3. You'll be redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
5. Use any future expiry date and any CVC
6. Complete the checkout
7. You're redirected back with success message

**Note:** This is test mode - no real charges are made!

## Step 7: Make Your First Change

Let's personalize the landing page.

### Edit the Hero Section

1. Open `app/page.tsx` in your editor
2. Find this line:
   ```tsx
   <h1 className="text-5xl font-bold">Welcome to SaaS Starter</h1>
   ```
3. Change it to your app name:
   ```tsx
   <h1 className="text-5xl font-bold">Welcome to My App</h1>
   ```
4. Save the file

**The page automatically reloads with your change!**

### Update Site Metadata

1. Open `app/layout.tsx`
2. Find the metadata export:
   ```tsx
   export const metadata: Metadata = {
     title: 'SaaS Starter',
     description: 'Full-stack SaaS template'
   }
   ```
3. Update with your app info:
   ```tsx
   export const metadata: Metadata = {
     title: 'My App',
     description: 'My awesome SaaS application'
   }
   ```
4. Save and check the browser tab title

### Change the Color Scheme

1. Open `tailwind.config.ts`
2. Find the colors section
3. Change the primary color:
   ```ts
   colors: {
     primary: {
       DEFAULT: '#3b82f6', // Change this color
       // ...
     }
   }
   ```
4. Save and see your app update

**Tip:** Use [coolors.co](https://coolors.co/) to pick colors!

## Step 8: Understand the File Structure

Your project structure:

```
my-saas-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI components
│   ├── auth/             # Auth components
│   └── layout/           # Layout components
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe client
│   └── resend.ts         # Resend client
├── .dd/                   # Framework files
│   ├── manifest.json     # Project manifest
│   └── config.json       # Project config
├── .env.local            # Environment variables (don't commit!)
├── .env.example          # Environment template
├── package.json          # Dependencies
├── tailwind.config.ts    # Tailwind config
└── tsconfig.json         # TypeScript config
```

See [Project Structure](project-structure.md) for detailed explanation.

## Step 9: Add a Feature

Let's add a simple feature - a contact form.

### Create the Contact Page

1. Create `app/contact/page.tsx`:

```tsx
export default function ContactPage() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <form className="max-w-md">
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Your name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            placeholder="your@email.com"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Message</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Your message"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
```

2. Add a link in the navigation
3. Visit `/contact` to see your new page

**Congratulations!** You just added your first feature.

## Step 10: Deploy to Production

Let's get your app live.

### Setup Deployment Credentials

```bash
# Get Vercel token from https://vercel.com/account/tokens
framework deploy:auth save vercel YOUR_TOKEN
```

### Deploy

```bash
framework deploy --prod
```

**The framework will:**
1. Detect Vercel as your provider
2. Validate your credentials
3. Upload your project
4. Trigger the build
5. Return your live URL

**Time:** ~3-5 minutes

**Result:** Your app is live! 🚀

Visit the URL and share it with the world.

## Common First Project Issues

### "Supabase connection failed"

**Check:**
1. `.env.local` has correct keys
2. Keys don't have extra spaces/quotes
3. Supabase project is active (not paused)

**Solution:**
```bash
# Verify keys
cat .env.local | grep SUPABASE

# Restart dev server
npm run dev
```

### "Stripe webhook failed"

**During development:** Webhooks won't work on localhost without Stripe CLI

**Solution:** Use Stripe test mode and ignore webhook errors during dev

**For production:** Set up webhook endpoint in Stripe dashboard

### "Module not found"

**Cause:** Dependency not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### "TypeScript errors"

**Cause:** Missing types or configuration issue

**Solution:**
```bash
# Check for errors
npm run type-check

# Install missing types
npm install --save-dev @types/node @types/react
```

## Next Steps

You've successfully created your first project! Here's what to learn next:

### Understand Your Project
- **[Project Structure](project-structure.md)** - Detailed file explanation
- **[Configuration](configuration.md)** - Environment variables and settings

### Add More Features
- **[Authentication Guide](../integrations/auth/supabase.md)** - Deep dive into auth
- **[Payments Guide](../integrations/payments/stripe.md)** - Payment flows
- **[Database Guide](../integrations/database/supabase.md)** - Working with data

### Customize Your App
- **[Templates Guide](../templates/README.md)** - Other templates
- **[Component Library](../components/README.md)** - UI components
- **[Styling Guide](../styling/README.md)** - Tailwind CSS tips

### Go to Production
- **[Deployment Guide](../deploy/README.md)** - Production deployment
- **[Security Checklist](../security/README.md)** - Production security
- **[Performance Guide](../performance/README.md)** - Optimization tips

## Learning Path

Choose your learning path based on your role:

### For Frontend Developers
1. Customize UI components
2. Add pages and routing
3. Implement client-side features
4. Learn Next.js patterns

### For Backend Developers
1. Set up database schemas
2. Create API routes
3. Implement business logic
4. Add webhooks and cron jobs

### For Full-Stack Developers
1. Build complete features end-to-end
2. Integrate third-party services
3. Optimize performance
4. Deploy and monitor

### For Product Managers
1. Understand what's possible
2. Plan feature roadmap
3. Work with developers
4. Launch and iterate

## Resources

### Documentation
- [Framework Docs](../README.md) - All documentation
- [Next.js Docs](https://nextjs.org/docs) - Next.js framework
- [Supabase Docs](https://supabase.com/docs) - Backend services
- [Stripe Docs](https://stripe.com/docs) - Payment processing

### Video Tutorials
Coming soon! Subscribe for updates.

### Community
- [GitHub Discussions](https://github.com/jrdaws/framework/discussions)
- [GitHub Issues](https://github.com/jrdaws/framework/issues)
- [Twitter](https://twitter.com/jrdaws)

## Summary

You've learned how to:

- ✅ Choose and export a template
- ✅ Install dependencies
- ✅ Configure environment variables
- ✅ Start the development server
- ✅ Explore authentication and payments
- ✅ Make your first changes
- ✅ Add a new feature
- ✅ Deploy to production

**You're ready to build!**

```bash
# Create your next project
framework export dashboard ./my-dashboard --auth clerk
framework export blog ./my-blog
framework export landing-page ./my-landing
```

Happy building! 🚀
