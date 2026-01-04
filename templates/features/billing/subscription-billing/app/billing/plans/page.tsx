"use client";

import { useState } from "react";
import { PricingTable } from "@/components/billing/PricingTable";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for getting started",
    price: 9,
    interval: "month" as const,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "price_starter",
    features: [
      "Up to 1,000 records",
      "Basic analytics",
      "Email support",
      "API access",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses",
    price: 29,
    interval: "month" as const,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_pro",
    features: [
      "Up to 10,000 records",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom integrations",
      "Team collaboration",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: 99,
    interval: "month" as const,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise",
    features: [
      "Unlimited records",
      "Full analytics suite",
      "24/7 phone support",
      "API access",
      "Custom integrations",
      "Team collaboration",
      "SSO / SAML",
      "Custom contracts",
    ],
  },
];

export default function PlansPage() {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (priceId: string) => {
    setLoading(priceId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error("Failed to create checkout:", error);
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Choose the plan that's right for you
        </p>

        {/* Billing interval toggle */}
        <div className="inline-flex items-center gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setBillingInterval("month")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingInterval === "month"
                ? "bg-white dark:bg-gray-700 shadow"
                : ""
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval("year")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingInterval === "year"
                ? "bg-white dark:bg-gray-700 shadow"
                : ""
            }`}
          >
            Yearly
            <span className="ml-2 text-sm text-green-600">Save 20%</span>
          </button>
        </div>
      </div>

      <PricingTable
        plans={PLANS.map((plan) => ({
          ...plan,
          price: billingInterval === "year" ? Math.round(plan.price * 10) : plan.price,
          interval: billingInterval,
        }))}
        onSelectPlan={handleSelectPlan}
        loadingPlan={loading}
      />
    </div>
  );
}

