# Landing Page Template

Complete guide to building high-converting marketing and product landing pages.

## Table of Contents

- [Overview](#overview)
- [What's Included](#whats-included)
- [When to Use This Template](#when-to-use-this-template)
- [File Structure](#file-structure)
- [Quick Start](#quick-start)
- [Sections Breakdown](#sections-breakdown)
- [SEO Optimization](#seo-optimization)
- [Conversion Optimization](#conversion-optimization)
- [Customization Guide](#customization-guide)
- [Example Landing Pages](#example-landing-pages)
- [Deployment](#deployment)

## Overview

The Landing Page template provides a production-ready foundation for building marketing websites, product launches, and lead generation pages. It includes all essential sections for a high-converting landing page with built-in SEO optimization and responsive design.

### Key Features

- Hero section with compelling CTAs
- Features showcase section
- Testimonials and social proof
- Pricing section with plans
- FAQ section
- Professional navigation
- Sticky header
- Mobile-responsive design
- SEO-optimized structure
- Fast page loads
- Clean, modern UI

### Tech Stack

- **Framework:** Next.js 15 with App Router
- **UI:** React 19, Tailwind CSS
- **Language:** TypeScript 5
- **Animation:** CSS transitions (Framer Motion ready)
- **Icons:** Unicode emojis (easily replaceable)
- **SEO:** Built-in metadata optimization

## What's Included

### Core Sections

#### 1. Navigation Header

- Sticky navigation bar
- Logo/brand placement
- Navigation links
- CTA button
- Mobile-responsive menu
- Smooth scroll to sections

#### 2. Hero Section

- Compelling headline
- Value proposition
- Primary and secondary CTAs
- Gradient background
- Responsive typography
- Eye-catching design

#### 3. Features Section

- 6 feature cards
- Icon placeholders
- Benefit-focused copy
- Grid layout
- Hover effects
- Responsive design

#### 4. Social Proof Section

- Customer testimonials
- User quotes
- Name and role attribution
- Professional styling
- Credibility building

#### 5. Pricing Section

- 3 pricing tiers
- Feature comparisons
- Popular plan highlight
- CTA buttons
- Monthly pricing display
- Flexible pricing structure

#### 6. FAQ Section

- Common questions
- Expandable answers
- Clean accordion UI
- Easy to update

#### 7. Final CTA Section

- Conversion-focused
- Strong call-to-action
- Gradient background
- Action button

#### 8. Footer

- Multi-column layout
- Navigation links
- Social links
- Copyright information
- Professional design

### File Structure

```
my-landing-page/
├── app/
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── testimonials.tsx
│   │   ├── pricing.tsx
│   │   ├── faq.tsx
│   │   └── cta.tsx
│   ├── navigation/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── ui/
│       └── button.tsx
├── lib/
│   ├── config.ts                 # Site configuration
│   └── utils.ts                  # Utility functions
├── public/
│   ├── logo.svg
│   └── images/
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## When to Use This Template

### Perfect For

The Landing Page template is ideal when you're building:

**Product Launches:**
- SaaS product marketing
- App launch pages
- Feature announcements
- Beta signups
- Product showcases

**Marketing Campaigns:**
- Lead generation
- Email list building
- Event registration
- Webinar signups
- Content downloads

**Business Websites:**
- Agency websites
- Consulting services
- Professional services
- Startup homepages
- Portfolio sites

**Conversion Pages:**
- Sales pages
- Demo request pages
- Free trial signups
- Newsletter subscriptions
- Course enrollment

### Not Ideal For

Consider other templates if you're building:

- **SaaS applications** → Use SaaS template
- **Admin panels** → Use Dashboard template
- **Blogs** → Use Blog template
- **Multi-page sites** → Extend this template or use custom build

## Quick Start

### 1. Export the Template

```bash
# Export landing page template
framework export landing-page ./my-landing

# Navigate to project
cd my-landing
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Customize Content

Update the content in `app/page.tsx`:

```typescript
// Features
const features = [
  {
    title: "Your Feature",
    description: "Your description"
  },
  // Add more features
]

// Pricing
const pricing = [
  {
    name: "Starter",
    price: "$9",
    features: ["Feature 1", "Feature 2"]
  },
  // Add more plans
]
```

## Sections Breakdown

### Hero Section

The hero section is the first thing visitors see:

```typescript
// components/sections/hero.tsx
export function Hero() {
  return (
    <section className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 py-30 text-center text-white">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
        Build Something Amazing
      </h1>
      <p className="text-xl max-w-2xl mx-auto mb-8 opacity-95">
        The fastest way to ship your next project. Start building in minutes, not hours.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <button className="bg-white text-indigo-500 border-none rounded-lg px-7 py-3.5 text-base font-semibold cursor-pointer hover:bg-gray-50">
          Start Free Trial
        </button>
        <button className="bg-transparent text-white border-2 border-white rounded-lg px-7 py-3.5 text-base font-semibold cursor-pointer hover:bg-white/10">
          Watch Demo
        </button>
      </div>
    </section>
  )
}
```

Customization tips:
- Update headline to match your value proposition
- Adjust colors in gradient
- Change CTA button text
- Add background image or video
- Include product screenshot

### Features Section

Showcase your key features:

```typescript
// components/sections/features.tsx
const features = [
  {
    title: "Fast Performance",
    description: "Optimized for speed and efficiency",
    icon: "⚡"
  },
  {
    title: "Easy to Use",
    description: "Intuitive interface that anyone can master",
    icon: "🎯"
  },
  // Add more features
]

export function Features() {
  return (
    <section id="features" className="px-6 py-20 max-w-7xl mx-auto">
      <h2 className="text-center text-4xl font-bold mb-4">
        Everything You Need
      </h2>
      <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-16">
        Powerful features to help you build, ship, and scale your product.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
        {features.map((feature, i) => (
          <div key={i} className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

### Testimonials Section

Build trust with social proof:

```typescript
// components/sections/testimonials.tsx
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechCorp",
    quote: "This product transformed how we work. Highly recommended!",
    avatar: "/avatars/sarah.jpg" // Optional
  },
  // Add more testimonials
]

export function Testimonials() {
  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-bold mb-16">
          Loved by Customers
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="p-8 rounded-xl bg-white border border-gray-200">
              <p className="text-base leading-relaxed mb-6 text-gray-800">
                "{testimonial.quote}"
              </p>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Pricing Section

Clear, transparent pricing:

```typescript
// components/sections/pricing.tsx
const plans = [
  {
    name: "Starter",
    price: "$9",
    features: ["5 Projects", "Basic Support", "1GB Storage"],
    popular: false
  },
  {
    name: "Pro",
    price: "$29",
    features: ["Unlimited Projects", "Priority Support", "10GB Storage", "Advanced Analytics"],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$99",
    features: ["Everything in Pro", "24/7 Support", "Unlimited Storage", "Custom Integrations"],
    popular: false
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-20 max-w-7xl mx-auto">
      <h2 className="text-center text-4xl font-bold mb-4">Simple Pricing</h2>
      <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-16">
        Choose the plan that's right for you. Always flexible, always fair.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`p-8 rounded-xl ${
              plan.popular ? 'border-2 border-indigo-500' : 'border border-gray-200'
            } bg-white relative`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                POPULAR
              </div>
            )}
            <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
            <div className="text-4xl font-bold mb-6">
              {plan.price}
              <span className="text-lg text-gray-600 font-normal">/mo</span>
            </div>
            <ul className="list-none p-0 mb-8">
              {plan.features.map((feature, j) => (
                <li key={j} className="py-2 text-gray-600">
                  ✓ {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full ${
                plan.popular
                  ? 'bg-indigo-500 text-white border-none'
                  : 'bg-white text-indigo-500 border-2 border-indigo-500'
              } rounded-lg py-3 text-base font-semibold cursor-pointer hover:opacity-90`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
```

### FAQ Section

Answer common questions:

```typescript
// components/sections/faq.tsx
const faqs = [
  {
    question: "How does it work?",
    answer: "Our platform uses cutting-edge technology to deliver exceptional results."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Try it free for 14 days, no credit card required."
  },
  // Add more FAQs
]

export function FAQ() {
  return (
    <section id="faq" className="bg-gray-50 px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center text-4xl font-bold mb-16">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <details key={i} className="p-6 rounded-xl bg-white border border-gray-200">
              <summary className="text-lg font-semibold cursor-pointer list-none">
                {faq.question}
              </summary>
              <p className="mt-4 mb-0 text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## SEO Optimization

### Metadata Configuration

Configure SEO in layout:

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Product Name - Tagline',
  description: 'Clear, compelling description of your product that includes keywords',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Company',
  publisher: 'Your Company',
  metadataBase: new URL('https://yourdomain.com'),
  openGraph: {
    title: 'Your Product Name',
    description: 'Clear, compelling description',
    url: 'https://yourdomain.com',
    siteName: 'Your Product Name',
    images: [
      {
        url: 'https://yourdomain.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Your Product Name'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Product Name',
    description: 'Clear, compelling description',
    creator: '@yourhandle',
    images: ['https://yourdomain.com/twitter-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification',
    // bing: 'your-bing-verification'
  }
}
```

### Structured Data

Add JSON-LD for rich snippets:

```typescript
// app/layout.tsx or page.tsx
export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Your Product Name',
    url: 'https://yourdomain.com',
    description: 'Your product description',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://yourdomain.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Performance Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/avif', 'image/webp']
  },
  compress: true,
  poweredByHeader: false
}
```

## Conversion Optimization

### Clear CTAs

Strategic placement of call-to-action buttons:

```typescript
// Multiple CTAs throughout page
<button className="cta-primary">
  Start Free Trial
</button>

<button className="cta-secondary">
  Watch Demo
</button>

<button className="cta-tertiary">
  Learn More
</button>
```

### Trust Signals

Add credibility elements:

```typescript
// components/sections/trust-signals.tsx
export function TrustSignals() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-gray-600 mb-8">
          Trusted by over 10,000 companies worldwide
        </p>
        <div className="flex justify-center gap-12 flex-wrap opacity-60">
          {/* Company logos */}
          <img src="/logos/company1.svg" alt="Company 1" className="h-8" />
          <img src="/logos/company2.svg" alt="Company 2" className="h-8" />
          <img src="/logos/company3.svg" alt="Company 3" className="h-8" />
        </div>
      </div>
    </section>
  )
}
```

### Social Proof

Display metrics:

```typescript
// components/sections/stats.tsx
export function Stats() {
  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
    { value: '50+', label: 'Countries' }
  ]

  return (
    <section className="py-16 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Form Integration

Add email capture:

```typescript
// components/sections/newsletter.tsx
'use client'

import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-8">
          Get the latest updates and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && (
          <p className="text-green-600 mt-4">Thanks for subscribing!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 mt-4">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  )
}
```

## Customization Guide

### Color Scheme

Update brand colors:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1'
        }
      }
    }
  }
}
```

### Typography

Change fonts:

```typescript
// app/layout.tsx
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  )
}

// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-poppins)']
      }
    }
  }
}
```

### Adding Animation

Install Framer Motion:

```bash
npm install framer-motion
```

Animate sections:

```typescript
'use client'

import { motion } from 'framer-motion'

export function AnimatedSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Section content */}
    </motion.div>
  )
}
```

### Adding Icons

Replace emojis with icon library:

```bash
npm install lucide-react
```

```typescript
import { Zap, Target, Shield } from 'lucide-react'

const features = [
  {
    title: "Fast",
    icon: <Zap className="w-8 h-8" />
  },
  // More features
]
```

## Example Landing Pages

### 1. SaaS Product Launch

Features:
- Product demo video
- Feature highlights
- Pricing tiers
- Customer testimonials
- Free trial CTA

Customizations:
- Added video hero background
- Interactive feature demos
- Live chat widget
- Email capture forms

### 2. Mobile App Launch

Features:
- App store badges
- Screenshot gallery
- Feature showcase
- Download CTAs
- Press mentions

Customizations:
- Phone mockups
- App preview video
- Social proof metrics
- Download tracking

### 3. Course/eBook Landing

Features:
- Author bio
- Course outline
- Student testimonials
- Pricing options
- Enrollment form

Customizations:
- Video testimonials
- Course preview
- Payment integration
- Email sequences

## Deployment

### Vercel (Recommended)

```bash
vercel deploy --prod
```

### Environment Variables

```bash
# .env.production
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"  # Google Analytics
```

### Performance Checklist

- [ ] Optimize images (use Next.js Image)
- [ ] Add meta tags
- [ ] Configure robots.txt
- [ ] Add sitemap.xml
- [ ] Set up analytics
- [ ] Test mobile responsiveness
- [ ] Check page speed
- [ ] Verify SEO tags
- [ ] Test all CTAs
- [ ] Set up form submissions

## Next Steps

1. **Customize content** - Update all text and images
2. **Configure SEO** - Add metadata and structured data
3. **Add analytics** - Install tracking
4. **Test conversions** - A/B test CTAs
5. **Deploy** - Launch to production

## Resources

- [Template README](./README.md)
- [SEO Guide](../getting-started/seo.md)
- [Deployment Guide](../deploy/README.md)

---

**Ready to launch?** Start with `framework export landing-page ./my-landing`
