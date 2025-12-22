# SEO Directory Template

Complete guide to building SEO-optimized directory and listing websites with the SEO Directory template.

## Table of Contents

- [Overview](#overview)
- [What's Included](#whats-included)
- [When to Use This Template](#when-to-use-this-template)
- [File Structure](#file-structure)
- [Quick Start](#quick-start)
- [Static Site Generation](#static-site-generation)
- [Search & Filtering](#search--filtering)
- [SEO Optimization](#seo-optimization)
- [Content Management](#content-management)
- [Customization Guide](#customization-guide)
- [Example Use Cases](#example-use-cases)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

The SEO Directory template is a production-ready foundation for building directory and listing websites. It's optimized for search engines with static generation, structured data, and fast performance.

### Key Features

- Static site generation for maximum performance
- SEO-optimized with structured data
- Search and filtering functionality
- Beautiful UI with shadcn/ui components
- TypeScript for type safety
- Responsive design
- Fast page loads (static HTML)
- Perfect Lighthouse scores
- Easy content management

### Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI:** React 19, Tailwind CSS 4
- **Components:** shadcn/ui (Radix UI)
- **Language:** TypeScript 5
- **Testing:** Vitest + Playwright
- **Linting:** ESLint 9 + Prettier
- **Icons:** Lucide React
- **Database:** Supabase (optional)

## What's Included

### Core Features

#### 1. Static Site Generation

Blazing fast performance with:
- Pre-rendered HTML pages
- Zero JavaScript required for content
- Incremental Static Regeneration (ISR)
- Automatic sitemap generation
- RSS feed support
- Fast page loads (<1s)
- Perfect Core Web Vitals

#### 2. SEO Optimization

Built-in SEO best practices:
- Semantic HTML structure
- Schema.org structured data
- Open Graph meta tags
- Twitter Cards
- Canonical URLs
- Dynamic meta tags
- XML sitemaps
- robots.txt configuration
- Image optimization

#### 3. Search & Filtering

Powerful search capabilities:
- Client-side search (no backend required)
- Filter by categories
- Filter by tags
- Sort by relevance, date, popularity
- URL-based filters (shareable)
- Instant search results
- Mobile-friendly interface

#### 4. UI Components

Modern, accessible components:
- Card layouts
- Grid and list views
- Responsive navigation
- Search bar with autocomplete
- Filter sidebar
- Pagination
- Loading states
- Error boundaries
- Dark mode support (optional)

### File Structure

```
seo-directory/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with SEO
│   │   ├── page.tsx          # Homepage/directory listing
│   │   └── [slug]/
│   │       └── page.tsx      # Individual item pages
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── separator.tsx
│   │   ├── search-bar.tsx    # Search component
│   │   ├── filter-sidebar.tsx# Filtering UI
│   │   └── directory-card.tsx# Item card component
│   ├── lib/
│   │   ├── data.ts           # Directory data/API
│   │   ├── search.ts         # Search logic
│   │   └── seo.ts            # SEO utilities
│   └── styles/
│       └── globals.css       # Global styles
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── .env.local.example
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json
└── package.json
```

## When to Use This Template

### Perfect For

✅ **Directory Sites**
- Business directories
- Resource libraries
- Tool collections
- Course catalogs
- Job boards
- Event listings

✅ **Listing Sites**
- Product showcases
- Portfolio galleries
- Agency listings
- Service providers
- App directories
- Plugin marketplaces

✅ **Content Hubs**
- Blog aggregators
- News directories
- Research databases
- Documentation indexes
- Learning resources
- Community directories

### Not Ideal For

❌ Real-time data (use SaaS template instead)
❌ User-generated content platforms
❌ Complex web applications
❌ E-commerce with checkout
❌ Social networks

## Quick Start

### 1. Export the Template

```bash
npx @jrdaws/framework export seo-directory ./my-directory
cd my-directory
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy and edit the environment file:

```bash
cp .env.local.example .env.local
```

Required variables:
```env
# Optional: Supabase for dynamic data
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### 4. Add Your Content

Edit `src/lib/data.ts` to add your directory items:

```typescript
export const directoryItems = [
  {
    id: 'item-1',
    name: 'Example Tool',
    slug: 'example-tool',
    description: 'A great tool for developers',
    category: 'Development',
    tags: ['javascript', 'nodejs', 'typescript'],
    url: 'https://example.com',
    image: '/images/example-tool.png',
    featured: true,
  },
  // Add more items...
];
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Build for Production

```bash
npm run build
npm start
```

## Static Site Generation

### How It Works

The template uses Next.js static generation to pre-render all pages at build time:

```typescript
// src/app/[slug]/page.tsx
export async function generateStaticParams() {
  const items = await getDirectoryItems();

  return items.map((item) => ({
    slug: item.slug,
  }));
}

export default async function ItemPage({ params }: { params: { slug: string } }) {
  const item = await getItemBySlug(params.slug);

  return <ItemDetails item={item} />;
}
```

### Benefits

- **Fast:** Pages load instantly (pre-rendered HTML)
- **SEO:** Perfect for search engines (no client-side rendering)
- **Cheap:** Can host on free static hosts (Vercel, Netlify, Cloudflare Pages)
- **Reliable:** No server required, no downtime
- **Scalable:** CDN-distributed, handles any traffic

### Incremental Static Regeneration (ISR)

Update pages without rebuilding everything:

```typescript
export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  const data = await fetchFreshData();
  return <Directory data={data} />;
}
```

## Search & Filtering

### Client-Side Search

Fast, instant search without a backend:

```typescript
// src/lib/search.ts
export function searchItems(items: DirectoryItem[], query: string) {
  const lowerQuery = query.toLowerCase();

  return items.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
```

### Filtering

Filter by categories and tags:

```typescript
export function filterItems(
  items: DirectoryItem[],
  filters: {
    category?: string;
    tags?: string[];
  }
) {
  return items.filter(item => {
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.every(tag => item.tags.includes(tag))) {
        return false;
      }
    }
    return true;
  });
}
```

### URL-Based Filters

Shareable filter URLs:

```typescript
// /directory?category=Development&tags=javascript,typescript
export default function DirectoryPage({
  searchParams,
}: {
  searchParams: { category?: string; tags?: string };
}) {
  const category = searchParams.category;
  const tags = searchParams.tags?.split(',') || [];

  const filtered = filterItems(items, { category, tags });

  return <DirectoryGrid items={filtered} />;
}
```

## SEO Optimization

### Meta Tags

Dynamic meta tags for each page:

```typescript
// src/app/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getItemBySlug(params.slug);

  return {
    title: `${item.name} | My Directory`,
    description: item.description,
    openGraph: {
      title: item.name,
      description: item.description,
      images: [item.image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.name,
      description: item.description,
      images: [item.image],
    },
  };
}
```

### Structured Data

Schema.org JSON-LD for rich search results:

```typescript
export function generateItemSchema(item: DirectoryItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: item.name,
    description: item.description,
    url: item.url,
    image: item.image,
    applicationCategory: item.category,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
```

### Sitemap Generation

Automatic sitemap.xml generation:

```typescript
// src/app/sitemap.ts
export default async function sitemap() {
  const items = await getDirectoryItems();

  const itemUrls = items.map((item) => ({
    url: `https://yourdomain.com/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...itemUrls,
  ];
}
```

## Content Management

### Static Data

Store content in TypeScript files:

```typescript
// src/lib/data.ts
export const directoryItems: DirectoryItem[] = [
  {
    id: '1',
    name: 'VS Code',
    slug: 'vs-code',
    description: 'Popular code editor',
    category: 'Development Tools',
    tags: ['editor', 'ide', 'typescript'],
    url: 'https://code.visualstudio.com',
    image: '/images/vscode.png',
    featured: true,
    rating: 4.8,
    downloads: 50000000,
  },
  // More items...
];
```

### Dynamic Data (Optional)

Use Supabase for dynamic content:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getDirectoryItems() {
  const { data, error } = await supabase
    .from('directory_items')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}
```

### CSV Import

Import from CSV files:

```typescript
import { parse } from 'csv-parse/sync';
import fs from 'fs';

export function loadFromCSV(filename: string) {
  const content = fs.readFileSync(filename, 'utf-8');
  const records = parse(content, { columns: true });

  return records.map(record => ({
    id: record.id,
    name: record.name,
    slug: slugify(record.name),
    description: record.description,
    category: record.category,
    tags: record.tags.split(',').map(t => t.trim()),
    url: record.url,
    image: record.image,
  }));
}
```

## Customization Guide

### Branding

Update site-wide branding in `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: 'Your Directory Name',
    template: '%s | Your Directory Name',
  },
  description: 'The best directory for...',
  keywords: ['directory', 'tools', 'resources'],
};
```

### Colors & Styling

Customize Tailwind colors in `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... your brand colors
          900: '#0c4a6e',
        },
      },
    },
  },
};
```

### Component Customization

Modify shadcn/ui components in `src/components/ui/`:

```bash
# Add more components
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

### Layout Options

Switch between grid and list views:

```typescript
// src/components/directory-grid.tsx
export function DirectoryGrid({ items, view = 'grid' }) {
  const gridClass = view === 'grid'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'flex flex-col gap-4';

  return (
    <div className={gridClass}>
      {items.map(item => (
        <DirectoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

## Example Use Cases

### Developer Tools Directory

```typescript
const categories = [
  'Code Editors',
  'Version Control',
  'CI/CD',
  'Testing',
  'Deployment',
  'Monitoring',
];

const tools = [
  {
    name: 'GitHub',
    category: 'Version Control',
    tags: ['git', 'collaboration', 'open-source'],
    pricing: 'Free + Paid',
    rating: 4.9,
  },
  // More tools...
];
```

### Resource Library

```typescript
const resources = [
  {
    type: 'article',
    title: 'How to Build a SaaS',
    author: 'John Doe',
    publishedAt: '2024-01-15',
    readTime: '10 min',
    tags: ['saas', 'startup', 'business'],
  },
  // More resources...
];
```

### Job Board

```typescript
const jobs = [
  {
    title: 'Senior Developer',
    company: 'Tech Corp',
    location: 'Remote',
    salary: '$120k - $180k',
    type: 'Full-time',
    posted: '2024-01-20',
    tags: ['typescript', 'react', 'nodejs'],
  },
  // More jobs...
];
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect via GitHub (automatic deployments)
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Cloudflare Pages

```bash
# Build
npm run build

# Deploy via Cloudflare Dashboard
# Upload the `.next` directory
```

### Static Export (Any Host)

```typescript
// next.config.ts
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

```bash
npm run build
# Upload the `out` directory to any static host
```

## Troubleshooting

### Search Not Working

Check that client-side JavaScript is enabled:

```typescript
// Add 'use client' directive
'use client';

export function SearchBar() {
  // Component code...
}
```

### Images Not Optimizing

Ensure images are in the `public` directory:

```typescript
// ✅ Correct
<Image src="/images/logo.png" alt="Logo" width={100} height={100} />

// ❌ Wrong
<Image src="./logo.png" alt="Logo" width={100} height={100} />
```

### Build Errors

Clear Next.js cache:

```bash
rm -rf .next
npm run build
```

### Slow Build Times

Limit static page generation:

```typescript
export async function generateStaticParams() {
  const items = await getDirectoryItems();

  // Only pre-render first 100 pages
  return items.slice(0, 100).map((item) => ({
    slug: item.slug,
  }));
}

// Enable ISR for remaining pages
export const dynamicParams = true;
export const revalidate = 3600;
```

### SEO Not Working

Verify meta tags are generated:

```bash
# View page source
curl https://yourdomain.com | grep "og:title"

# Check with testing tools
- Google Rich Results Test
- Twitter Card Validator
- Facebook Sharing Debugger
```

## Additional Resources

- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Schema.org Types](https://schema.org/docs/schemas.html)
- [Google Search Central](https://developers.google.com/search)

## Support

- **Issues:** [GitHub Issues](https://github.com/jrdaws/dawson-does-framework/issues)
- **Discussions:** [GitHub Discussions](https://github.com/jrdaws/dawson-does-framework/discussions)
- **Documentation:** [Framework Docs](https://github.com/jrdaws/dawson-does-framework/tree/main/docs)

---

*Built with the Dawson Does Framework - Export-first, zero lock-in web development.*
