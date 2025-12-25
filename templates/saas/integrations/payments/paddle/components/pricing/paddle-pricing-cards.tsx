"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Paddle.js types
declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: "sandbox" | "production") => void;
      };
      Initialize: (options: { token: string }) => void;
      Checkout: {
        open: (options: {
          transactionId: string;
          settings?: {
            displayMode?: "overlay" | "inline";
            theme?: "light" | "dark";
            locale?: string;
            successUrl?: string;
          };
        }) => void;
      };
    };
  }
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "Basic features",
      "Up to 10 projects",
      "Community support",
      "1 GB storage",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    description: "For professionals and growing teams",
    features: [
      "All Free features",
      "Unlimited projects",
      "Priority support",
      "Advanced analytics",
      "Custom domain",
      "50 GB storage",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    price: 99,
    description: "For larger teams and enterprises",
    features: [
      "All Pro features",
      "Team collaboration",
      "SSO authentication",
      "Advanced security",
      "Dedicated support",
      "Unlimited storage",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PaddlePricingCards() {
  const [loading, setLoading] = useState<string | null>(null);
  const [paddleReady, setPaddleReady] = useState(false);
  const router = useRouter();

  // Initialize Paddle.js
  useEffect(() => {
    const initPaddle = async () => {
      // Load Paddle.js script if not already loaded
      if (!document.getElementById("paddle-js")) {
        const script = document.createElement("script");
        script.id = "paddle-js";
        script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
        script.async = true;
        script.onload = () => {
          if (window.Paddle) {
            // Set environment (sandbox for development)
            if (process.env.NODE_ENV !== "production") {
              window.Paddle.Environment.set("sandbox");
            }

            // Initialize with client token
            const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
            if (clientToken) {
              window.Paddle.Initialize({ token: clientToken });
              setPaddleReady(true);
            }
          }
        };
        document.body.appendChild(script);
      } else if (window.Paddle) {
        setPaddleReady(true);
      }
    };

    initPaddle();
  }, []);

  const handleCheckout = async (planId: string) => {
    if (planId === "free") {
      router.push("/signup");
      return;
    }

    if (!paddleReady || !window.Paddle) {
      alert("Payment system is loading. Please try again.");
      return;
    }

    setLoading(planId);

    try {
      // Create transaction on server
      const response = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      // Open Paddle overlay checkout
      window.Paddle.Checkout.open({
        transactionId: data.transactionId,
        settings: {
          displayMode: "overlay",
          theme: "light",
          successUrl: `${window.location.origin}/dashboard?success=true`,
        },
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "Failed to start checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-12">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`relative rounded-2xl border-2 p-8 flex flex-col ${
            plan.popular
              ? "border-emerald-600 shadow-xl scale-105"
              : "border-gray-200"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-extrabold text-gray-900">
                ${plan.price}
              </span>
              <span className="ml-2 text-xl text-gray-600">/month</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Tax calculated at checkout
            </p>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="h-6 w-6 text-emerald-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleCheckout(plan.id)}
            disabled={loading === plan.id || (!paddleReady && plan.id !== "free")}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              plan.popular
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading === plan.id
              ? "Loading..."
              : !paddleReady && plan.id !== "free"
              ? "Loading..."
              : plan.cta}
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * Component for managing existing subscription
 */
export function PaddleSubscriptionManager() {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<{
    id: string;
    status: string;
    nextBilledAt: string | null;
    currentPeriodEnd: string | null;
  } | null>(null);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/paddle/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to open portal");
      }

      setSubscription(data.subscription);

      // Open payment method update URL if available
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Portal error:", error);
      alert(error.message || "Failed to open subscription portal");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/paddle/portal", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      alert(data.message);
      window.location.reload();
    } catch (error: any) {
      console.error("Cancel error:", error);
      alert(error.message || "Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Subscription Management
      </h3>

      {subscription && (
        <div className="mb-4 text-sm text-gray-600">
          <p>Status: {subscription.status}</p>
          {subscription.nextBilledAt && (
            <p>
              Next billing:{" "}
              {new Date(subscription.nextBilledAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleManageSubscription}
          disabled={loading}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Update Payment Method"}
        </button>

        <button
          onClick={handleCancelSubscription}
          disabled={loading}
          className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
        >
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}

