"use client";

import { useState } from "react";
import { PRICING_PLANS, PricingPlan } from "@/lib/stripe/config";
import { CheckoutButton } from "./CheckoutButton";

interface PricingTableProps {
  currentPlanId?: string;
}

export function PricingTable({ currentPlanId }: PricingTableProps) {
  const [interval, setInterval] = useState<"month" | "year">("month");

  return (
    <div className="py-12">
      {/* Interval Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setInterval("month")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              interval === "month"
                ? "bg-background shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("year")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              interval === "year"
                ? "bg-background shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            Yearly
            <span className="ml-1 text-xs text-green-600">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {PRICING_PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            interval={interval}
            isCurrentPlan={currentPlanId === plan.id}
          />
        ))}
      </div>
    </div>
  );
}

interface PricingCardProps {
  plan: PricingPlan;
  interval: "month" | "year";
  isCurrentPlan: boolean;
}

function PricingCard({ plan, interval, isCurrentPlan }: PricingCardProps) {
  const yearlyPrice = Math.floor(plan.price * 12 * 0.8);
  const displayPrice = interval === "year" ? yearlyPrice : plan.price;
  const displayInterval = interval === "year" ? "/year" : "/month";

  return (
    <div
      className={`relative rounded-2xl border p-8 ${
        plan.highlighted
          ? "border-primary bg-primary/5 shadow-lg scale-105"
          : "border-border"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <div className="text-center mb-6">
        <span className="text-4xl font-bold">${displayPrice}</span>
        <span className="text-muted-foreground">{displayInterval}</span>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <svg
              className="w-5 h-5 text-green-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {isCurrentPlan ? (
        <button
          disabled
          className="w-full py-3 px-4 bg-muted text-muted-foreground rounded-lg font-medium cursor-not-allowed"
        >
          Current Plan
        </button>
      ) : plan.priceId ? (
        <CheckoutButton
          priceId={plan.priceId}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            plan.highlighted
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-foreground text-background hover:bg-foreground/90"
          }`}
        >
          {plan.cta}
        </CheckoutButton>
      ) : (
        <a
          href="/contact"
          className={`block text-center w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            plan.highlighted
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-foreground text-background hover:bg-foreground/90"
          }`}
        >
          {plan.cta}
        </a>
      )}
    </div>
  );
}

