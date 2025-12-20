export const TEMPLATES = {
  saas: {
    id: "saas",
    name: "SaaS Starter",
    description: "Full-stack SaaS template with authentication, billing, and database",
    category: "SaaS",
    supportedIntegrations: {
      auth: ["supabase", "clerk"],
      payments: ["stripe", "paddle"],
      email: ["resend", "sendgrid"],
      db: ["supabase", "planetscale"],
      ai: ["openai", "anthropic"],
      analytics: ["posthog", "plausible"],
      storage: ["r2", "s3", "supabase"],
    },
    defaultIntegrations: {
      auth: "supabase",
      payments: "stripe",
      db: "supabase",
    },
    requiredIntegrations: ["auth", "db"],
  },
  ecommerce: {
    id: "ecommerce",
    name: "E-commerce",
    description: "Full-featured shop with product catalog, cart, and checkout",
    category: "E-commerce",
    supportedIntegrations: {
      auth: ["supabase", "clerk"],
      payments: ["stripe", "paddle"],
      email: ["resend", "sendgrid"],
      db: ["supabase", "planetscale"],
      analytics: ["posthog", "plausible"],
      storage: ["r2", "s3", "supabase"],
    },
    defaultIntegrations: {
      auth: "supabase",
      payments: "stripe",
      db: "supabase",
    },
    requiredIntegrations: ["auth", "payments", "db"],
  },
  blog: {
    id: "blog",
    name: "Blog/CMS",
    description: "MDX-based blog with syntax highlighting, tags, and RSS",
    category: "Content",
    supportedIntegrations: {
      analytics: ["posthog", "plausible"],
      email: ["resend", "sendgrid"],
    },
    defaultIntegrations: {},
    requiredIntegrations: [],
  },
  dashboard: {
    id: "dashboard",
    name: "Dashboard",
    description: "Analytics dashboard with charts, tables, and real-time data",
    category: "Application",
    supportedIntegrations: {
      auth: ["supabase", "clerk"],
      db: ["supabase", "planetscale"],
      analytics: ["posthog", "plausible"],
    },
    defaultIntegrations: {
      auth: "supabase",
      db: "supabase",
    },
    requiredIntegrations: ["auth", "db"],
  },
  "api-backend": {
    id: "api-backend",
    name: "API Backend",
    description: "RESTful API with authentication, rate limiting, and documentation",
    category: "Backend",
    supportedIntegrations: {
      auth: ["supabase", "clerk"],
      db: ["supabase", "planetscale"],
      email: ["resend", "sendgrid"],
    },
    defaultIntegrations: {
      auth: "supabase",
      db: "supabase",
    },
    requiredIntegrations: ["auth", "db"],
  },
  "seo-directory": {
    id: "seo-directory",
    name: "SEO Directory",
    description: "SEO-optimized directory template with static generation",
    category: "Directory",
    supportedIntegrations: {
      analytics: ["posthog", "plausible"],
    },
    defaultIntegrations: {},
    requiredIntegrations: [],
  },
} as const;

export const INTEGRATION_INFO = {
  auth: {
    supabase: {
      name: "Supabase",
      description: "Email/password and OAuth authentication",
    },
    clerk: {
      name: "Clerk",
      description: "Pre-built UI components and user management",
    },
  },
  payments: {
    stripe: {
      name: "Stripe",
      description: "Subscription billing and payments",
    },
    paddle: {
      name: "Paddle",
      description: "All-in-one payments platform",
    },
  },
  email: {
    resend: {
      name: "Resend",
      description: "Transactional emails with React templates",
    },
    sendgrid: {
      name: "SendGrid",
      description: "Email delivery platform",
    },
  },
  db: {
    supabase: {
      name: "Supabase",
      description: "Postgres database with real-time",
    },
    planetscale: {
      name: "PlanetScale",
      description: "Serverless MySQL database",
    },
  },
  ai: {
    openai: {
      name: "OpenAI",
      description: "GPT-4 and ChatGPT API",
    },
    anthropic: {
      name: "Anthropic",
      description: "Claude AI models",
    },
  },
  analytics: {
    posthog: {
      name: "PostHog",
      description: "Product analytics and feature flags",
    },
    plausible: {
      name: "Plausible",
      description: "Privacy-focused analytics",
    },
  },
  storage: {
    r2: {
      name: "Cloudflare R2",
      description: "Object storage with zero egress fees",
    },
    s3: {
      name: "AWS S3",
      description: "Scalable cloud object storage",
    },
    supabase: {
      name: "Supabase Storage",
      description: "File storage built on S3",
    },
  },
} as const;

export type TemplateId = keyof typeof TEMPLATES;
export type IntegrationType = keyof typeof INTEGRATION_INFO;
