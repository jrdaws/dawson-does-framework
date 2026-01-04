"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PricingPlansProps {
  provider?: string;
  variant?: "cards" | "table" | "simple";
  className?: string;
}

/**
 * Preview component showing pricing/billing UI
 * Displays in preview when payment features are selected
 */
export function PricingPlans({ provider, variant = "cards", className }: PricingPlansProps) {
  const providerLabels: Record<string, { name: string; color: string; icon: string }> = {
    "stripe": { name: "Stripe", color: "#635BFF", icon: "💳" },
    "paddle": { name: "Paddle", color: "#2A2A2A", icon: "🏓" },
    "lemonsqueezy": { name: "LemonSqueezy", color: "#FFC233", icon: "🍋" },
  };

  const info = provider ? providerLabels[provider] : null;

  const plans = [
    { name: "Starter", price: "$9", period: "/mo", features: ["5 projects", "Basic analytics", "24h support"] },
    { name: "Pro", price: "$29", period: "/mo", features: ["Unlimited projects", "Advanced analytics", "Priority support", "API access"], popular: true },
    { name: "Enterprise", price: "$99", period: "/mo", features: ["Everything in Pro", "SSO", "Custom integrations", "Dedicated manager"] },
  ];

  if (variant === "simple") {
    return (
      <div className={cn("text-center", className)}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          {info && <span>{info.icon}</span>}
          <span className="text-sm font-medium">Starting at $9/mo</span>
        </div>
        {info && (
          <p className="text-xs text-foreground-muted">
            Powered by <span style={{ color: info.color }}>{info.name}</span>
          </p>
        )}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
        <div className="grid grid-cols-4 bg-background-alt border-b border-border">
          <div className="p-4">
            {info && (
              <span 
                className="text-[10px] px-2 py-0.5 rounded"
                style={{ backgroundColor: `${info.color}15`, color: info.color }}
              >
                {info.name}
              </span>
            )}
          </div>
          {plans.map((plan) => (
            <div key={plan.name} className={cn("p-4 text-center", plan.popular && "bg-primary/5")}>
              <div className="font-semibold text-foreground">{plan.name}</div>
              <div className="text-2xl font-bold text-foreground mt-1">{plan.price}<span className="text-sm font-normal text-foreground-muted">{plan.period}</span></div>
            </div>
          ))}
        </div>
        {["Feature 1", "Feature 2", "Feature 3"].map((feature, i) => (
          <div key={feature} className={cn("grid grid-cols-4 border-b border-border", i % 2 === 0 && "bg-background-alt/50")}>
            <div className="p-4 text-sm text-foreground-secondary">{feature}</div>
            {plans.map((plan, j) => (
              <div key={`${plan.name}-${feature}`} className={cn("p-4 text-center", plan.popular && "bg-primary/5")}>
                {j >= i ? <Check className="h-4 w-4 text-success mx-auto" /> : <span className="text-foreground-muted">—</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Cards variant (default)
  return (
    <div className={cn("grid grid-cols-3 gap-6", className)}>
      {plans.map((plan) => (
        <div 
          key={plan.name} 
          className={cn(
            "relative rounded-xl border p-6",
            plan.popular 
              ? "border-primary bg-primary/5 shadow-lg" 
              : "border-border bg-card"
          )}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
              Most Popular
            </div>
          )}
          <div className="text-lg font-semibold text-foreground mb-1">{plan.name}</div>
          <div className="mb-4">
            <span className="text-3xl font-bold text-foreground">{plan.price}</span>
            <span className="text-foreground-muted">{plan.period}</span>
          </div>
          <ul className="space-y-2 mb-6">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-foreground-secondary">
                <Check className="h-4 w-4 text-success" />
                {feature}
              </li>
            ))}
          </ul>
          <button 
            className={cn(
              "w-full py-2 rounded-lg font-medium transition-colors",
              plan.popular 
                ? "bg-primary text-white hover:bg-primary/90" 
                : "bg-background-alt border border-border hover:bg-background-alt/80"
            )}
          >
            Get Started
          </button>
          {info && (
            <div className="mt-3 text-center">
              <span 
                className="text-[10px] px-2 py-0.5 rounded"
                style={{ backgroundColor: `${info.color}15`, color: info.color }}
              >
                {info.icon} {info.name}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

