"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SubscriptionStatus } from "@/components/billing/SubscriptionStatus";

interface SubscriptionData {
  status: string;
  planName: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing/subscription")
      .then((res) => res.json())
      .then((data) => {
        setSubscription(data.subscription);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleManageBilling = async () => {
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Billing</h1>

      {subscription ? (
        <div className="space-y-6">
          <SubscriptionStatus
            status={subscription.status}
            planName={subscription.planName}
            periodEnd={subscription.currentPeriodEnd}
            cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
          />

          <div className="flex gap-4">
            <button
              onClick={handleManageBilling}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Manage Billing
            </button>
            <Link
              href="/billing/plans"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white"
            >
              Change Plan
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">
            No Active Subscription
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Choose a plan to get started with premium features.
          </p>
          <Link
            href="/billing/plans"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}

