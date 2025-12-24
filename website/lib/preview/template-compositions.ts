/**
 * Template Compositions
 * 
 * Defines the component structure for each template type.
 * AI uses these as the skeleton, then customizes with user's content.
 */

export interface SectionConfig {
  component: string;
  required: boolean;
  description?: string;
}

export interface TemplateComposition {
  name: string;
  description: string;
  sections: SectionConfig[];
  defaultProps: Record<string, Record<string, unknown>>;
  aiGuidance: string; // Hints for AI about this template type
}

export const TEMPLATE_COMPOSITIONS: Record<string, TemplateComposition> = {
  ecommerce: {
    name: 'E-commerce',
    description: 'Online store with product catalog, cart, and checkout',
    sections: [
      { component: 'Nav', required: true, description: 'Navigation with shop links' },
      { component: 'Hero', required: true, description: 'Welcome banner with shop CTA' },
      { component: 'ProductGrid', required: true, description: 'Featured products grid' },
      { component: 'FeatureCards', required: false, description: 'Why shop with us' },
      { component: 'Testimonials', required: false, description: 'Customer reviews' },
      { component: 'CTA', required: false, description: 'Newsletter or sale banner' },
      { component: 'Footer', required: true, description: 'Site footer' },
    ],
    defaultProps: {
      Nav: {
        showAuth: true,
        variant: 'solid',
      },
      Hero: {
        backgroundStyle: 'gradient',
        alignment: 'center',
      },
      ProductGrid: {
        columns: 4,
        showPrices: true,
        showAddToCart: true,
      },
      FeatureCards: {
        columns: 3,
        variant: 'cards',
      },
      Testimonials: {
        layout: 'grid',
      },
      Footer: {
        showSocial: true,
      },
    },
    aiGuidance: `Generate e-commerce specific content:
- Products should match the user's description (plants, electronics, clothing, etc.)
- Prices should be realistic for the product category
- Nav links: Products, Categories, Cart, Account
- Hero should have a shop-focused CTA like "Shop Now" or "Browse Collection"
- Feature cards can highlight shipping, returns, quality, support`,
  },

  saas: {
    name: 'SaaS Application',
    description: 'Software as a service with pricing, features, and signup',
    sections: [
      { component: 'Nav', required: true, description: 'Navigation with product links' },
      { component: 'Hero', required: true, description: 'Value proposition with signup CTA' },
      { component: 'FeatureCards', required: true, description: 'Key features/benefits' },
      { component: 'PricingTable', required: true, description: 'Pricing tiers' },
      { component: 'Testimonials', required: false, description: 'Customer success stories' },
      { component: 'FAQ', required: false, description: 'Common questions' },
      { component: 'CTA', required: true, description: 'Final conversion section' },
      { component: 'Footer', required: true, description: 'Site footer' },
    ],
    defaultProps: {
      Nav: {
        showAuth: true,
        variant: 'transparent',
      },
      Hero: {
        backgroundStyle: 'mesh',
        alignment: 'center',
      },
      FeatureCards: {
        columns: 3,
        variant: 'cards',
      },
      PricingTable: {
        showToggle: true,
        highlightPlan: 'pro',
      },
      Testimonials: {
        layout: 'grid',
      },
      FAQ: {
        layout: 'accordion',
      },
      CTA: {
        variant: 'gradient',
      },
      Footer: {
        showSocial: true,
      },
    },
    aiGuidance: `Generate SaaS-specific content:
- Features should describe software capabilities based on user's vision
- Pricing should have Free/Pro/Enterprise tiers with relevant features
- Nav links: Features, Pricing, Docs, Login, Sign Up
- Hero should emphasize the problem solved and include "Start Free" or "Get Started"
- Testimonials should reference business outcomes (saved time, increased revenue)`,
  },

  blog: {
    name: 'Blog',
    description: 'Content-focused blog with posts and categories',
    sections: [
      { component: 'Nav', required: true, description: 'Navigation with categories' },
      { component: 'Hero', required: true, description: 'Blog intro or featured post' },
      { component: 'BlogPostList', required: true, description: 'Recent posts grid' },
      { component: 'CTA', required: false, description: 'Newsletter signup' },
      { component: 'Footer', required: true, description: 'Site footer' },
    ],
    defaultProps: {
      Nav: {
        showAuth: false,
        variant: 'solid',
      },
      Hero: {
        backgroundStyle: 'solid',
        alignment: 'left',
      },
      BlogPostList: {
        columns: 3,
        showExcerpt: true,
      },
      CTA: {
        variant: 'outlined',
      },
      Footer: {
        showSocial: true,
      },
    },
    aiGuidance: `Generate blog-specific content:
- Posts should match the blog's niche from user description
- Nav links: Home, Categories, About, Contact
- Hero can be a welcome message or feature the latest post
- Post titles should be compelling and SEO-friendly
- CTA should encourage newsletter signup`,
  },

  dashboard: {
    name: 'Admin Dashboard',
    description: 'Internal dashboard with data visualization',
    sections: [
      { component: 'DashboardPreview', required: true, description: 'Main dashboard view' },
    ],
    defaultProps: {
      DashboardPreview: {
        showSidebar: true,
        chartType: 'area',
      },
    },
    aiGuidance: `Generate dashboard-specific content:
- Stats should reflect key metrics for the user's business type
- Use realistic numbers with positive trends
- Include metrics like Users, Revenue, Conversions, etc.`,
  },

  'landing-page': {
    name: 'Landing Page',
    description: 'Marketing landing page for product or service',
    sections: [
      { component: 'Nav', required: true, description: 'Minimal navigation' },
      { component: 'Hero', required: true, description: 'Strong value proposition' },
      { component: 'FeatureCards', required: true, description: 'Key benefits' },
      { component: 'Testimonials', required: true, description: 'Social proof' },
      { component: 'FAQ', required: false, description: 'Address objections' },
      { component: 'CTA', required: true, description: 'Final conversion' },
      { component: 'Footer', required: true, description: 'Minimal footer' },
    ],
    defaultProps: {
      Nav: {
        showAuth: false,
        variant: 'transparent',
      },
      Hero: {
        backgroundStyle: 'gradient',
        alignment: 'center',
      },
      FeatureCards: {
        columns: 3,
        variant: 'icons-left',
      },
      Testimonials: {
        layout: 'carousel',
      },
      FAQ: {
        layout: 'grid',
      },
      CTA: {
        variant: 'gradient',
      },
      Footer: {
        showSocial: false,
      },
    },
    aiGuidance: `Generate landing page content optimized for conversion:
- Hero should have a single, compelling headline
- Feature cards should use benefit-focused language
- Testimonials should address common objections
- FAQ should handle purchase concerns
- CTA should be urgent and action-oriented`,
  },

  'seo-directory': {
    name: 'SEO Directory',
    description: 'Directory listing site optimized for search',
    sections: [
      { component: 'Nav', required: true, description: 'Navigation with categories' },
      { component: 'Hero', required: true, description: 'Directory intro with search' },
      { component: 'FeatureCards', required: false, description: 'Category highlights' },
      { component: 'FAQ', required: true, description: 'SEO-rich FAQ content' },
      { component: 'Footer', required: true, description: 'Link-rich footer' },
    ],
    defaultProps: {
      Nav: {
        showAuth: false,
        variant: 'solid',
      },
      Hero: {
        backgroundStyle: 'solid',
        alignment: 'center',
      },
      FeatureCards: {
        columns: 4,
        variant: 'minimal',
      },
      FAQ: {
        layout: 'accordion',
      },
      Footer: {
        showSocial: false,
      },
    },
    aiGuidance: `Generate SEO-optimized directory content:
- Use keyword-rich headings and descriptions
- FAQ items should target long-tail keywords
- Nav links should be category pages
- Hero should describe the directory's purpose clearly`,
  },

  'api-backend': {
    name: 'API Backend',
    description: 'Backend API documentation and overview',
    sections: [
      { component: 'Nav', required: true, description: 'Docs navigation' },
      { component: 'Hero', required: true, description: 'API intro' },
      { component: 'FeatureCards', required: true, description: 'Key endpoints/features' },
      { component: 'CTA', required: true, description: 'Get API key' },
      { component: 'Footer', required: true, description: 'Footer' },
    ],
    defaultProps: {
      Nav: {
        showAuth: true,
        variant: 'solid',
      },
      Hero: {
        backgroundStyle: 'mesh',
        alignment: 'left',
      },
      FeatureCards: {
        columns: 2,
        variant: 'cards',
      },
      CTA: {
        variant: 'solid',
      },
      Footer: {
        showSocial: false,
      },
    },
    aiGuidance: `Generate API documentation content:
- Features should describe API capabilities
- Use technical but accessible language
- Hero should explain what developers can build
- CTA should encourage getting an API key`,
  },
};

/**
 * Get composition for a template, with fallback to saas
 */
export function getTemplateComposition(templateId: string): TemplateComposition {
  return TEMPLATE_COMPOSITIONS[templateId] || TEMPLATE_COMPOSITIONS.saas;
}

/**
 * Get required sections for a template
 */
export function getRequiredSections(templateId: string): string[] {
  const composition = getTemplateComposition(templateId);
  return composition.sections
    .filter(s => s.required)
    .map(s => s.component);
}

