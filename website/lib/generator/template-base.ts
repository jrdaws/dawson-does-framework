/**
 * Template Base Loader
 * 
 * Provides base project structure for each template type.
 */

import { GeneratedFile, ProjectConfig } from "./types";

interface TemplateDefinition {
  name: string;
  description: string;
  baseFiles: {
    path: string;
    content: string;
  }[];
}

const TEMPLATE_BASES: Record<string, TemplateDefinition> = {
  saas: {
    name: "SaaS Application",
    description: "Software as a service with pricing and features",
    baseFiles: [
      {
        path: "app/page.tsx",
        content: `import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-24 text-center bg-gradient-to-b from-background to-muted">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            {{projectName}}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your next-generation solution for building amazing products.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 border rounded-lg font-medium hover:bg-muted"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Fast", description: "Optimized for performance" },
              { title: "Secure", description: "Enterprise-grade security" },
              { title: "Scalable", description: "Grows with your business" },
            ].map((feature) => (
              <div key={feature.title} className="p-6 border rounded-xl">
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
`,
      },
      {
        path: "app/layout.tsx",
        content: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "{{projectName}}",
  description: "Built with Dawson-Does Framework",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
`,
      },
      {
        path: "app/globals.css",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: {{primaryColor}};
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: {{primaryColor}};
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
`,
      },
      {
        path: "app/dashboard/page.tsx",
        content: `export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-xl">
          <p className="text-muted-foreground text-sm">Total Users</p>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="p-6 border rounded-xl">
          <p className="text-muted-foreground text-sm">Revenue</p>
          <p className="text-3xl font-bold">$12,345</p>
        </div>
        <div className="p-6 border rounded-xl">
          <p className="text-muted-foreground text-sm">Active Now</p>
          <p className="text-3xl font-bold">42</p>
        </div>
      </div>
    </main>
  );
}
`,
      },
      {
        path: "app/pricing/page.tsx",
        content: `export default function PricingPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Simple Pricing</h1>
        <p className="text-muted-foreground mb-12">
          Choose the plan that works for you
        </p>
        <p className="text-muted-foreground">
          Pricing component will be rendered here when Stripe is configured.
        </p>
      </div>
    </main>
  );
}
`,
      },
    ],
  },
  ecommerce: {
    name: "E-commerce",
    description: "Online store with products and checkout",
    baseFiles: [
      {
        path: "app/page.tsx",
        content: `export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Welcome to {{projectName}}</h1>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <div className="h-48 bg-muted" />
              <div className="p-4">
                <h3 className="font-semibold">Product {i}</h3>
                <p className="text-muted-foreground text-sm">$99.00</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
`,
      },
      {
        path: "app/layout.tsx",
        content: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "{{projectName}}",
  description: "Your online store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
`,
      },
    ],
  },
};

/**
 * Get base template files for a template type
 */
export async function getTemplateBase(
  templateId: string,
  config: ProjectConfig
): Promise<GeneratedFile[]> {
  const template = TEMPLATE_BASES[templateId] || TEMPLATE_BASES.saas;

  return template.baseFiles.map((file) => ({
    path: file.path,
    content: file.content,
    overwrite: true,
  }));
}

/**
 * Get available template IDs
 */
export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATE_BASES);
}

