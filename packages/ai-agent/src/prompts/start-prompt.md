Generate START_PROMPT.md for Cursor AI (welcoming, actionable).
PROJECT: {projectName} | DESCRIPTION: {description} | TEMPLATE: {template}
ARCHITECTURE: {architectureSummary}
FEATURES: {features} | INTEGRATIONS: {integrations}

OUTPUT: Markdown for START_PROMPT.md (no JSON wrapper):

---

# {projectName}

{description}

## What's Been Generated

This project was scaffolded using **Dawson Framework** with the **{template}** template and enhanced with AI-powered architecture generation.

### Project Structure

**Pages:**
{list pages with descriptions}

**Custom Components:**
{list custom components that were generated}

**API Routes:**
{list API endpoints}

### Integrations Configured

{list integrations with setup instructions}

## Getting Started

### 1. Environment Setup

Copy the example environment file and add your API keys:

```bash
cp .env.example .env.local
```

Add the following required environment variables to `.env.local`:

```bash
{env vars list based on integrations}
```

### 2. Install & Run
```bash
npm install && npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Implementation Guide

### Priority Tasks

The generated scaffold includes TODO comments throughout the code. Here are the key areas to implement:

1. **Business Logic**
   - {page/component 1}: Implement core functionality
   - {page/component 2}: Add data fetching logic
   - {API route 1}: Implement endpoint logic

2. **Data Models**
   - Define database schema for: {key entities}
   - Set up database migrations
   - Create data access layer

3. **Integration Setup**
{integration-specific setup tasks}

4. **UI Polish**
   - Customize components to match brand
   - Add loading and error states
   - Implement responsive design

### File Structure

```
{projectName}/
├── app/                 # Next.js App Router
│   ├── page.tsx        # Home page
│   ├── [other pages]   # Additional pages
│   └── api/           # API routes
├── components/         # React components
│   ├── [custom]/      # Your custom components
│   └── ui/           # Template UI components
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
└── public/            # Static assets
```

### Integration Documentation
{Integration 1}: Setup→[link] | API→[link] | Example→`app/api/...`
{Integration 2}: Setup→[link] | API→[link] | Example→`...`

## Workflow
1. Data models → 2. API routes → 3. UI components → 4. Integrations → 5. Testing → 6. Deploy (`framework deploy` or Vercel)

## Commands
`npm run dev` (start) | `npm run build` (production) | `npm run lint` (code quality) | `npm test` (testing)

## Resources
- [Dawson Framework Docs](https://docs.dawson.dev) | [Next.js 15](https://nextjs.org/docs)
- Template: `templates/{template}/README.md` | Integrations: `integrations/[integration]/README.md`

## Need Help?
Check `.cursorrules`, review TODO comments, template examples, integration docs

## Continue Development

**Suggested next prompt for Cursor:**

"Let's implement the {most important feature} functionality. Start by defining the data models for {key entities}, then create the API endpoints, and finally build the UI components. Make sure to include proper error handling and TypeScript types throughout."

---

**Happy coding! 🚀**
