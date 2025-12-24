/**
 * AI Preview Generator
 * 
 * Generates component props based on user configuration.
 * AI only outputs JSON props, NOT raw HTML.
 */

import { getComponentsForTemplate, formatRegistryForAI } from "@/lib/preview/component-registry";
import { getTemplateComposition, TemplateComposition } from "@/lib/preview/template-compositions";

export interface UserConfig {
  template: string;
  projectName: string;
  vision?: string;
  mission?: string;
  description?: string;
  inspiration?: string;
  integrations?: Record<string, string>;
}

export interface PreviewConfig {
  template: string;
  projectName: string;
  componentProps: Record<string, Record<string, unknown>>;
  generatedAt: string;
}

/**
 * Build the AI prompt for generating component props
 */
export function buildPreviewPrompt(userConfig: UserConfig): string {
  const composition = getTemplateComposition(userConfig.template);
  const components = getComponentsForTemplate(userConfig.template);
  const componentDocs = formatRegistryForAI(components);

  const sectionList = composition.sections
    .map(s => `- ${s.component}${s.required ? ' (required)' : ' (optional)'}`)
    .join('\n');

  return `Generate component props for a ${composition.name} preview.

## User Context
- Project Name: ${userConfig.projectName}
- Vision: ${userConfig.vision || 'Not provided'}
- Mission: ${userConfig.mission || 'Not provided'}
- Description: ${userConfig.description || 'Not provided'}
- Inspiration: ${userConfig.inspiration || 'Not provided'}
- Integrations: ${JSON.stringify(userConfig.integrations || {})}

## Template: ${composition.name}
${composition.aiGuidance}

## Sections to Generate
${sectionList}

## Available Components
${componentDocs}

## Task
Generate props for each component. Return ONLY valid JSON matching this structure:

{
  "Nav": {
    "projectName": "${userConfig.projectName}",
    "links": ["Link1", "Link2", "Link3"],
    "showAuth": true
  },
  "Hero": {
    "title": "Generate compelling headline based on vision",
    "subtitle": "Generate supporting text",
    "ctaText": "Action text"
  },
  // ... props for each section component
}

Requirements:
1. Use the user's project name exactly as provided
2. Generate content that matches their vision/description
3. Create realistic, industry-appropriate content
4. For products/features, generate 4-6 relevant items
5. For testimonials, generate 3 realistic quotes
6. Match the tone and style of their inspiration if mentioned`;
}

/**
 * Parse AI response into component props
 */
export function parsePreviewResponse(response: string): Record<string, Record<string, unknown>> {
  // Extract JSON from response (handle markdown code blocks)
  let jsonStr = response;
  
  // Remove markdown code blocks if present
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  try {
    const parsed = JSON.parse(jsonStr.trim());
    return parsed;
  } catch {
    console.error('Failed to parse preview response:', response);
    throw new Error('Failed to parse AI response as JSON');
  }
}

/**
 * Merge AI-generated props with template defaults
 */
export function mergeWithDefaults(
  aiProps: Record<string, Record<string, unknown>>,
  composition: TemplateComposition
): Record<string, Record<string, unknown>> {
  const merged: Record<string, Record<string, unknown>> = {};

  for (const section of composition.sections) {
    const componentName = section.component;
    const defaults = composition.defaultProps[componentName] || {};
    const aiGenerated = aiProps[componentName] || {};

    merged[componentName] = {
      ...defaults,
      ...aiGenerated,
    };
  }

  return merged;
}

/**
 * Generate fallback props for when AI is unavailable
 */
export function generateFallbackProps(userConfig: UserConfig): Record<string, Record<string, unknown>> {
  const { projectName, template, vision, description } = userConfig;
  const composition = getTemplateComposition(template);

  const baseProps: Record<string, Record<string, unknown>> = {
    Nav: {
      projectName,
      links: template === 'ecommerce' 
        ? ['Shop', 'Categories', 'About', 'Contact']
        : ['Features', 'Pricing', 'About', 'Contact'],
      showAuth: true,
    },
    Hero: {
      title: vision?.slice(0, 60) || `Welcome to ${projectName}`,
      subtitle: description?.slice(0, 120) || 'Start building your next great project today.',
      ctaText: template === 'ecommerce' ? 'Shop Now' : 'Get Started',
      backgroundStyle: 'gradient',
    },
    ProductGrid: {
      products: [
        { name: 'Product One', price: 49.99, category: 'New' },
        { name: 'Product Two', price: 79.99, category: 'Popular' },
        { name: 'Product Three', price: 29.99, category: 'Sale' },
        { name: 'Product Four', price: 99.99, category: 'Premium' },
      ],
      columns: 4,
      showPrices: true,
      showAddToCart: true,
      title: 'Featured Products',
    },
    FeatureCards: {
      features: [
        { title: 'Fast & Reliable', description: 'Built for speed and stability', iconName: 'zap' },
        { title: 'Secure by Default', description: 'Enterprise-grade security', iconName: 'shield' },
        { title: '24/7 Support', description: 'We\'re here when you need us', iconName: 'clock' },
      ],
      columns: 3,
      variant: 'cards',
      title: 'Why Choose Us',
    },
    PricingTable: {
      plans: [
        { name: 'Free', price: 0, period: 'month', features: ['Basic features', 'Community support', '1 project'] },
        { name: 'Pro', price: 29, period: 'month', features: ['All Free features', 'Priority support', 'Unlimited projects', 'API access'], highlighted: true },
        { name: 'Enterprise', price: 99, period: 'month', features: ['All Pro features', 'Dedicated support', 'Custom integrations', 'SLA guarantee'] },
      ],
      showToggle: true,
      highlightPlan: 'Pro',
    },
    Testimonials: {
      testimonials: [
        { quote: 'This product transformed how we work. Highly recommended!', author: 'Sarah Johnson', role: 'CEO', company: 'TechCorp', avatarIndex: 1 },
        { quote: 'Best decision we made this year. The team loves it.', author: 'Michael Chen', role: 'CTO', company: 'StartupXYZ', avatarIndex: 2 },
        { quote: 'Incredible value for the price. Support is fantastic.', author: 'Emily Davis', role: 'Founder', company: 'DesignStudio', avatarIndex: 3 },
      ],
      layout: 'grid',
    },
    FAQ: {
      items: [
        { question: 'How do I get started?', answer: 'Simply sign up for a free account and follow our quick start guide.' },
        { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers.' },
        { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time with no penalties.' },
      ],
      layout: 'accordion',
    },
    CTA: {
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of happy customers today.',
      buttonText: template === 'ecommerce' ? 'Start Shopping' : 'Start Free Trial',
      variant: 'gradient',
    },
    Footer: {
      projectName,
      links: ['Home', 'About', 'Contact', 'Privacy', 'Terms'],
      showSocial: true,
      description: description?.slice(0, 80) || `${projectName} - Your trusted partner.`,
    },
    BlogPostList: {
      posts: [
        { title: 'Getting Started with Our Platform', excerpt: 'Learn the basics and get up to speed quickly.', author: 'Team', date: 'Dec 20, 2024', category: 'Tutorial' },
        { title: 'Best Practices for Success', excerpt: 'Tips and tricks from power users.', author: 'Team', date: 'Dec 18, 2024', category: 'Guide' },
        { title: 'What\'s New in Version 2.0', excerpt: 'Exciting new features and improvements.', author: 'Team', date: 'Dec 15, 2024', category: 'Updates' },
      ],
      columns: 3,
      showExcerpt: true,
      title: 'Latest Posts',
    },
    DashboardPreview: {
      stats: [
        { label: 'Total Users', value: '12,453', change: 12.5 },
        { label: 'Revenue', value: '$45,231', change: 8.2 },
        { label: 'Active Sessions', value: '1,234', change: -2.4 },
        { label: 'Conversion Rate', value: '3.24%', change: 15.3 },
      ],
      chartType: 'area',
      showSidebar: true,
    },
  };

  // Merge with template defaults
  return mergeWithDefaults(baseProps, composition);
}

/**
 * Validate that all required sections have props
 */
export function validatePreviewConfig(
  props: Record<string, Record<string, unknown>>,
  composition: TemplateComposition
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const section of composition.sections) {
    if (section.required && !props[section.component]) {
      missing.push(section.component);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

