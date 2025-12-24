/**
 * Component Registry for AI Preview Generation
 * 
 * Defines all available preview components the AI can compose.
 * AI generates PROPS for these components, not raw HTML.
 */

export interface ComponentDefinition {
  name: string;
  import: string;
  props: string[];
  description: string;
  propsSchema: Record<string, PropSchema>;
}

export interface PropSchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required?: boolean;
  default?: unknown;
  items?: PropSchema; // For arrays
}

export const COMPONENT_REGISTRY: Record<string, ComponentDefinition> = {
  // Layout Components
  Nav: {
    name: 'Nav',
    import: '@/components/preview/Nav',
    props: ['projectName', 'links', 'showAuth', 'variant'],
    description: 'Top navigation bar with logo, links, and optional auth buttons',
    propsSchema: {
      projectName: { type: 'string', description: 'The project/brand name', required: true },
      links: { type: 'array', description: 'Navigation link labels', required: true, items: { type: 'string', description: 'Link label' } },
      showAuth: { type: 'boolean', description: 'Show login/signup buttons', default: true },
      variant: { type: 'string', description: 'Style variant: "solid" | "transparent"', default: 'solid' },
    },
  },

  Hero: {
    name: 'Hero',
    import: '@/components/preview/Hero',
    props: ['title', 'subtitle', 'ctaText', 'ctaSecondaryText', 'backgroundStyle', 'alignment'],
    description: 'Hero section with headline, subtext, and CTA button(s)',
    propsSchema: {
      title: { type: 'string', description: 'Main headline (should be compelling and match user vision)', required: true },
      subtitle: { type: 'string', description: 'Supporting text under headline', required: true },
      ctaText: { type: 'string', description: 'Primary CTA button text', required: true },
      ctaSecondaryText: { type: 'string', description: 'Secondary CTA button text (optional)' },
      backgroundStyle: { type: 'string', description: '"gradient" | "mesh" | "solid" | "image"', default: 'gradient' },
      alignment: { type: 'string', description: '"center" | "left"', default: 'center' },
    },
  },

  ProductGrid: {
    name: 'ProductGrid',
    import: '@/components/preview/ProductGrid',
    props: ['products', 'columns', 'showPrices', 'showAddToCart', 'title'],
    description: 'Grid of product cards for e-commerce (generate products relevant to user description)',
    propsSchema: {
      products: {
        type: 'array',
        description: 'Array of products to display',
        required: true,
        items: {
          type: 'object',
          description: 'Product with name, price, category, image placeholder',
        },
      },
      columns: { type: 'number', description: 'Number of columns (2-4)', default: 4 },
      showPrices: { type: 'boolean', description: 'Display prices', default: true },
      showAddToCart: { type: 'boolean', description: 'Show add to cart buttons', default: true },
      title: { type: 'string', description: 'Section title like "Featured Products"' },
    },
  },

  FeatureCards: {
    name: 'FeatureCards',
    import: '@/components/preview/FeatureCards',
    props: ['features', 'columns', 'variant', 'title'],
    description: 'Feature/benefit cards with icons (generate features based on user vision)',
    propsSchema: {
      features: {
        type: 'array',
        description: 'Array of features with title, description, icon',
        required: true,
        items: {
          type: 'object',
          description: 'Feature with title, description, iconName',
        },
      },
      columns: { type: 'number', description: 'Number of columns (2-4)', default: 3 },
      variant: { type: 'string', description: '"cards" | "minimal" | "icons-left"', default: 'cards' },
      title: { type: 'string', description: 'Section title like "Why Choose Us"' },
    },
  },

  PricingTable: {
    name: 'PricingTable',
    import: '@/components/preview/PricingTable',
    props: ['plans', 'showToggle', 'highlightPlan', 'title'],
    description: 'Pricing comparison table for SaaS (generate relevant pricing tiers)',
    propsSchema: {
      plans: {
        type: 'array',
        description: 'Array of pricing plans',
        required: true,
        items: {
          type: 'object',
          description: 'Plan with name, price, period, features array, highlighted boolean',
        },
      },
      showToggle: { type: 'boolean', description: 'Show monthly/yearly toggle', default: true },
      highlightPlan: { type: 'string', description: 'Name of plan to highlight as recommended' },
      title: { type: 'string', description: 'Section title', default: 'Simple, Transparent Pricing' },
    },
  },

  Testimonials: {
    name: 'Testimonials',
    import: '@/components/preview/Testimonials',
    props: ['testimonials', 'layout', 'title'],
    description: 'Customer testimonials section (generate realistic testimonials)',
    propsSchema: {
      testimonials: {
        type: 'array',
        description: 'Array of testimonials',
        required: true,
        items: {
          type: 'object',
          description: 'Testimonial with quote, author, role, company, avatarIndex (1-3)',
        },
      },
      layout: { type: 'string', description: '"grid" | "carousel" | "stacked"', default: 'grid' },
      title: { type: 'string', description: 'Section title', default: 'What Our Customers Say' },
    },
  },

  CTA: {
    name: 'CTA',
    import: '@/components/preview/CTA',
    props: ['title', 'subtitle', 'buttonText', 'variant'],
    description: 'Call-to-action section before footer',
    propsSchema: {
      title: { type: 'string', description: 'CTA headline', required: true },
      subtitle: { type: 'string', description: 'Supporting text' },
      buttonText: { type: 'string', description: 'CTA button text', required: true },
      variant: { type: 'string', description: '"gradient" | "solid" | "outlined"', default: 'gradient' },
    },
  },

  Footer: {
    name: 'Footer',
    import: '@/components/preview/Footer',
    props: ['projectName', 'links', 'showSocial', 'description'],
    description: 'Site footer with links and social icons',
    propsSchema: {
      projectName: { type: 'string', description: 'Project name', required: true },
      links: { type: 'array', description: 'Footer link labels', items: { type: 'string', description: 'Link label' } },
      showSocial: { type: 'boolean', description: 'Show social media icons', default: true },
      description: { type: 'string', description: 'Short tagline for footer' },
    },
  },

  // Additional template-specific components
  BlogPostList: {
    name: 'BlogPostList',
    import: '@/components/preview/BlogPostList',
    props: ['posts', 'columns', 'showExcerpt', 'title'],
    description: 'Grid of blog post cards',
    propsSchema: {
      posts: {
        type: 'array',
        description: 'Array of blog posts',
        required: true,
        items: {
          type: 'object',
          description: 'Post with title, excerpt, author, date, category',
        },
      },
      columns: { type: 'number', description: 'Number of columns', default: 3 },
      showExcerpt: { type: 'boolean', description: 'Show post excerpts', default: true },
      title: { type: 'string', description: 'Section title' },
    },
  },

  DashboardPreview: {
    name: 'DashboardPreview',
    import: '@/components/preview/DashboardPreview',
    props: ['stats', 'chartType', 'showSidebar'],
    description: 'Dashboard layout preview with stats and charts',
    propsSchema: {
      stats: {
        type: 'array',
        description: 'Array of stat cards',
        items: {
          type: 'object',
          description: 'Stat with label, value, change percentage',
        },
      },
      chartType: { type: 'string', description: '"bar" | "line" | "area"', default: 'area' },
      showSidebar: { type: 'boolean', description: 'Show sidebar navigation', default: true },
    },
  },

  FAQ: {
    name: 'FAQ',
    import: '@/components/preview/FAQ',
    props: ['items', 'title', 'layout'],
    description: 'Frequently asked questions accordion',
    propsSchema: {
      items: {
        type: 'array',
        description: 'Array of FAQ items',
        required: true,
        items: {
          type: 'object',
          description: 'FAQ with question and answer',
        },
      },
      title: { type: 'string', description: 'Section title', default: 'Frequently Asked Questions' },
      layout: { type: 'string', description: '"accordion" | "grid"', default: 'accordion' },
    },
  },
};

/**
 * Get a subset of components for a specific template
 */
export function getComponentsForTemplate(templateId: string): ComponentDefinition[] {
  // Template compositions define which components are available
  // This function returns only the relevant components for AI context
  const allComponents = Object.values(COMPONENT_REGISTRY);
  
  // Filter based on template type
  const templateComponentMap: Record<string, string[]> = {
    ecommerce: ['Nav', 'Hero', 'ProductGrid', 'FeatureCards', 'Testimonials', 'CTA', 'Footer'],
    saas: ['Nav', 'Hero', 'FeatureCards', 'PricingTable', 'Testimonials', 'FAQ', 'CTA', 'Footer'],
    blog: ['Nav', 'Hero', 'BlogPostList', 'CTA', 'Footer'],
    dashboard: ['DashboardPreview', 'Nav', 'Footer'],
    'landing-page': ['Nav', 'Hero', 'FeatureCards', 'Testimonials', 'FAQ', 'CTA', 'Footer'],
    'seo-directory': ['Nav', 'Hero', 'FeatureCards', 'FAQ', 'Footer'],
  };

  const componentNames = templateComponentMap[templateId] || templateComponentMap.saas;
  return allComponents.filter(c => componentNames.includes(c.name));
}

/**
 * Format component registry for AI prompt
 */
export function formatRegistryForAI(components: ComponentDefinition[]): string {
  return components.map(c => `
### ${c.name}
${c.description}

Props:
${Object.entries(c.propsSchema).map(([prop, schema]) => 
  `- ${prop} (${schema.type}${schema.required ? ', required' : ''}): ${schema.description}`
).join('\n')}
`).join('\n---\n');
}

