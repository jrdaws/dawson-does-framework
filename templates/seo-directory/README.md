# SEO Directory Template

SEO-optimized directory template with static generation, search functionality, and beautiful UI. Ideal for building curated lists and directories.

## Features

- Static site generation for optimal SEO
- Search functionality with filtering
- Responsive design with dark mode
- Category and tag organization
- Modern card-based layouts
- Tailwind CSS v4 styling

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to see your directory.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn/ui components

## Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout with metadata
│   └── page.tsx      # Home page / directory listing
├── components/
│   └── ui/           # Reusable UI components
└── lib/
    └── utils.ts      # Utility functions
```

## Visual Regression Testing

Uses Playwright for screenshot-based visual testing.

Setup:
```bash
npm install -D @playwright/test
npx playwright install
```

Run tests:
```bash
npx playwright test tests/visual
```

## Documentation

See the main framework documentation for more details.
