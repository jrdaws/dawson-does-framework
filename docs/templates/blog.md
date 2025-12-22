# Blog Template

Complete guide to building modern content publishing websites and blogs.

## Table of Contents

- [Overview](#overview)
- [What's Included](#whats-included)
- [When to Use This Template](#when-to-use-this-template)
- [File Structure](#file-structure)
- [Quick Start](#quick-start)
- [Content Management](#content-management)
- [SEO Features](#seo-features)
- [Customization Guide](#customization-guide)
- [Adding Features](#adding-features)
- [Example Blogs](#example-blogs)
- [Deployment](#deployment)

## Overview

The Blog template provides a production-ready foundation for building content-focused websites. It includes dynamic routing, search and filtering, categories, responsive design, and built-in SEO optimization.

### Key Features

- Dynamic blog post routes
- Search functionality
- Category filtering
- Author profiles
- Reading time estimates
- Responsive card layout
- Newsletter subscription
- SEO-optimized structure
- RSS feed ready
- Social sharing ready
- Typography optimized for reading

### Tech Stack

- **Framework:** Next.js 15 with App Router
- **UI:** React 19, Tailwind CSS
- **Language:** TypeScript 5
- **Content:** File-based or CMS-ready
- **Markdown:** MDX support ready
- **Search:** Client-side filtering (Fuse.js ready)

## What's Included

### Core Features

#### 1. Blog Homepage

- Featured posts grid
- Search functionality
- Category filters
- Post preview cards
- Author information
- Publication dates
- Reading time estimates
- Responsive layout

#### 2. Blog Post Pages

- Dynamic routing (`/blog/[slug]`)
- Full post content
- Author bio
- Publication metadata
- Social sharing placeholders
- Related posts ready
- Table of contents ready

#### 3. Category System

- Multiple categories
- Category filtering
- Category pages ready
- Tag support

#### 4. Search & Filter

- Real-time search
- Category filtering
- Combined search + filter
- Responsive results

#### 5. Author Profiles

- Author information
- Author bio
- Author avatar placeholders
- Posts by author

#### 6. Newsletter Section

- Email capture form
- Subscription handling
- Success/error states
- Professional styling

### File Structure

```
my-blog/
├── app/
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx          # Individual blog post
│   ├── category/
│   │   └── [category]/
│   │       └── page.tsx          # Category pages
│   ├── author/
│   │   └── [author]/
│   │       └── page.tsx          # Author pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Blog homepage
│   └── globals.css               # Global styles
├── components/
│   ├── blog/
│   │   ├── post-card.tsx
│   │   ├── post-content.tsx
│   │   ├── search-bar.tsx
│   │   ├── category-filter.tsx
│   │   └── author-card.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── ui/
│       └── button.tsx
├── lib/
│   ├── posts.ts                  # Post fetching utilities
│   ├── utils.ts                  # Utility functions
│   └── types.ts                  # TypeScript types
├── content/                      # Blog posts (optional)
│   └── posts/
│       ├── post-1.mdx
│       └── post-2.mdx
├── public/
│   └── images/
├── .env.example
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## When to Use This Template

### Perfect For

The Blog template is ideal when you're building:

**Personal Blogs:**
- Developer blogs
- Tech writing
- Personal journals
- Portfolio blogs
- Thought leadership

**Company Blogs:**
- Startup blogs
- Product updates
- Company news
- Engineering blogs
- Marketing content

**Content Publications:**
- Online magazines
- News sites
- Tutorial sites
- Documentation blogs
- Community blogs

**Niche Sites:**
- Industry-specific blogs
- Educational content
- How-to guides
- Resource libraries
- Commentary sites

### Not Ideal For

Consider other templates if you're building:

- **SaaS applications** → Use SaaS template
- **Admin panels** → Use Dashboard template
- **Landing pages** → Use Landing Page template
- **E-commerce** → Extend or use custom build

## Quick Start

### 1. Export the Template

```bash
# Export blog template
framework export blog ./my-blog

# Navigate to project
cd my-blog
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

### 4. Add Your Content

The template includes sample posts. Replace with your content:

```typescript
// lib/posts.ts or data file
export const posts = [
  {
    slug: "your-post-slug",
    title: "Your Post Title",
    excerpt: "A brief description...",
    author: "Your Name",
    date: "2024-12-20",
    readTime: "5 min read",
    category: "Tutorial",
    tags: ["nextjs", "react"]
  }
]
```

## Content Management

### Option 1: Static Content (Included)

Store posts as data:

```typescript
// lib/posts.ts
export interface Post {
  slug: string
  title: string
  excerpt: string
  content?: string
  author: string
  authorBio: string
  date: string
  readTime: string
  category: string
  tags: string[]
  coverImage?: string
}

export const posts: Post[] = [
  {
    slug: "getting-started-nextjs",
    title: "Getting Started with Next.js 15",
    excerpt: "Learn how to build modern web applications...",
    author: "Sarah Johnson",
    authorBio: "Full-stack developer",
    date: "Dec 20, 2024",
    readTime: "5 min read",
    category: "Tutorial",
    tags: ["nextjs", "react", "tutorial"]
  }
]

export function getPost(slug: string) {
  return posts.find(post => post.slug === slug)
}

export function getPostsByCategory(category: string) {
  return posts.filter(post => post.category === category)
}

export function searchPosts(query: string) {
  return posts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(query.toLowerCase())
  )
}
```

### Option 2: MDX Files

Add MDX support for markdown posts:

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
npm install gray-matter remark rehype
```

Configure MDX:

```typescript
// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
})
```

Create MDX posts:

```markdown
---
title: "Getting Started with Next.js"
date: "2024-12-20"
author: "Sarah Johnson"
category: "Tutorial"
tags: ["nextjs", "react"]
---

# Getting Started with Next.js

Your content here...
```

Load MDX posts:

```typescript
// lib/mdx.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      ...data,
    }
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    content,
    ...data,
  }
}
```

### Option 3: CMS Integration

Connect to a headless CMS:

#### Sanity

```bash
npm install @sanity/client @sanity/image-url
```

```typescript
// lib/sanity.ts
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true,
  apiVersion: '2024-01-01',
})

export async function getPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      author->{name, bio, image},
      publishedAt,
      mainImage,
      categories[]->{title}
    }
  `)
}
```

#### Contentful

```bash
npm install contentful
```

```typescript
// lib/contentful.ts
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function getPosts() {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    order: '-sys.createdAt',
  })

  return entries.items.map((item) => ({
    slug: item.fields.slug,
    title: item.fields.title,
    excerpt: item.fields.excerpt,
    content: item.fields.content,
    author: item.fields.author,
    date: item.sys.createdAt,
  }))
}
```

## SEO Features

### Post Metadata

Add SEO metadata to each post:

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { getPost } from '@/lib/posts'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}
```

### Sitemap Generation

Generate sitemap for blog posts:

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://yourdomain.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postEntries,
  ]
}
```

### RSS Feed

Generate RSS feed:

```typescript
// app/feed.xml/route.ts
import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const posts = getAllPosts()

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Your Blog Name</title>
    <link>https://yourdomain.com</link>
    <description>Your blog description</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://yourdomain.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://yourdomain.com/blog/${post.slug}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>https://yourdomain.com/blog/${post.slug}</guid>
    </item>
    `
      )
      .join('')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
```

### Structured Data

Add article structured data:

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ post }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.date,
    image: post.coverImage,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Post content */}
    </>
  )
}
```

## Customization Guide

### Styling Posts

Customize typography for better readability:

```css
/* app/globals.css */
.prose {
  @apply max-w-3xl mx-auto;
}

.prose h1 {
  @apply text-4xl font-bold mb-4 mt-8;
}

.prose h2 {
  @apply text-3xl font-semibold mb-3 mt-6;
}

.prose p {
  @apply text-gray-700 leading-relaxed mb-4;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.prose code {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm;
}

.prose pre {
  @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto;
}
```

### Adding Syntax Highlighting

For code blocks:

```bash
npm install rehype-highlight highlight.js
```

```typescript
// next.config.js (if using MDX)
const rehypeHighlight = require('rehype-highlight')

const withMDX = require('@next/mdx')({
  options: {
    rehypePlugins: [rehypeHighlight],
  },
})
```

```css
/* app/globals.css */
@import 'highlight.js/styles/github-dark.css';
```

### Adding Comments

Integrate comment system:

#### Giscus (GitHub Discussions)

```bash
npm install @giscus/react
```

```typescript
// components/blog/comments.tsx
'use client'

import Giscus from '@giscus/react'

export function Comments() {
  return (
    <Giscus
      repo="your-username/your-repo"
      repoId="your-repo-id"
      category="General"
      categoryId="your-category-id"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      theme="light"
      lang="en"
    />
  )
}
```

### Adding Related Posts

Show related content:

```typescript
// lib/posts.ts
export function getRelatedPosts(post: Post, limit = 3) {
  return posts
    .filter((p) => p.slug !== post.slug)
    .filter((p) =>
      p.tags.some((tag) => post.tags.includes(tag)) ||
      p.category === post.category
    )
    .slice(0, limit)
}

// app/blog/[slug]/page.tsx
export default function BlogPost({ params }) {
  const post = getPost(params.slug)
  const relatedPosts = getRelatedPosts(post)

  return (
    <>
      {/* Post content */}

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  )
}
```

### Adding Table of Contents

Extract headings and create TOC:

```typescript
// components/blog/table-of-contents.tsx
interface Heading {
  id: string
  text: string
  level: number
}

interface TOCProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TOCProps) {
  return (
    <nav className="sticky top-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-4">Table of Contents</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className="text-gray-600 hover:text-gray-900"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

## Adding Features

### Social Sharing

Add share buttons:

```typescript
// components/blog/share-buttons.tsx
'use client'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  return (
    <div className="flex gap-4">
      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-600"
      >
        Share on Twitter
      </a>
      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        Share on Facebook
      </a>
      <a
        href={shareUrls.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:text-blue-900"
      >
        Share on LinkedIn
      </a>
    </div>
  )
}
```

### View Counter

Track post views:

```typescript
// lib/views.ts
import { supabase } from './supabase'

export async function incrementViews(slug: string) {
  const { data, error } = await supabase.rpc('increment_views', {
    post_slug: slug,
  })
  return data
}

export async function getViews(slug: string) {
  const { data, error } = await supabase
    .from('post_views')
    .select('views')
    .eq('slug', slug)
    .single()

  return data?.views || 0
}
```

### Newsletter Integration

Connect to email service:

```typescript
// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  try {
    // Resend example
    const res = await fetch('https://api.resend.com/audiences/xxx/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
```

## Example Blogs

### 1. Developer Blog

Features added:
- Code syntax highlighting
- Tutorial series
- GitHub integration
- Newsletter
- RSS feed

Tech used:
- MDX for posts
- rehype-highlight for code
- Giscus for comments

### 2. Company Blog

Features added:
- Multi-author support
- Categories and tags
- Featured posts
- Related articles
- Analytics tracking

Tech used:
- Contentful CMS
- Next.js Image optimization
- Vercel Analytics

### 3. Personal Blog

Features added:
- About page
- Portfolio integration
- Social links
- Email subscription
- Dark mode

Tech used:
- Static MDX files
- TailwindCSS theming
- Resend for emails

## Deployment

### Vercel

```bash
vercel deploy --prod
```

### Environment Variables

```bash
# .env.production
NEXT_PUBLIC_SITE_URL="https://yourblog.com"

# If using CMS
CONTENTFUL_SPACE_ID="xxx"
CONTENTFUL_ACCESS_TOKEN="xxx"

# If using email
RESEND_API_KEY="re_xxx"
```

### Post-Deploy Checklist

- [ ] Test all post routes
- [ ] Verify RSS feed
- [ ] Check sitemap
- [ ] Test search functionality
- [ ] Verify category filtering
- [ ] Test newsletter signup
- [ ] Check mobile responsiveness
- [ ] Verify SEO metadata
- [ ] Test social sharing

## Next Steps

1. **Add content** - Write your first posts
2. **Customize design** - Update colors and fonts
3. **Configure SEO** - Add metadata
4. **Add features** - Comments, analytics, etc.
5. **Deploy** - Launch your blog

## Resources

- [Template README](./README.md)
- [MDX Documentation](https://mdxjs.com)
- [Next.js App Router](https://nextjs.org/docs)
- [SEO Guide](../getting-started/seo.md)

---

**Ready to start blogging?** Begin with `framework export blog ./my-blog`
