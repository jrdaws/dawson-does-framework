/**
 * Stripe pricing configuration
 * Update these with your actual Stripe price IDs
 */

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceId: string | null;
  price: number;
  interval: "month" | "year";
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out {{projectName}}",
    priceId: process.env.STRIPE_PRICE_ID_FREE || null,
    price: 0,
    interval: "month",
    features: [
      "Up to 3 projects",
      "Basic features",
      "Community support",
    ],
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals and growing teams",
    priceId: process.env.STRIPE_PRICE_ID_PRO || null,
    price: 29,
    interval: "month",
    features: [
      "Unlimited projects",
      "All features",
      "Priority support",
      "Advanced analytics",
      "Team collaboration",
    ],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large teams with custom needs",
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE || null,
    price: 99,
    interval: "month",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Custom contracts",
    ],
    cta: "Contact Sales",
  },
];

export function getPlanByPriceId(priceId: string): PricingPlan | undefined {
  return PRICING_PLANS.find((plan) => plan.priceId === priceId);
}

export function getPlanById(id: string): PricingPlan | undefined {
  return PRICING_PLANS.find((plan) => plan.id === id);
}

