"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { BillingPortalButton } from "./BillingPortalButton";

export function SubscriptionStatus() {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="p-4 bg-muted rounded-lg animate-pulse">
        <div className="h-4 bg-muted-foreground/20 rounded w-1/3 mb-2" />
        <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-4 bg-muted rounded-lg">
        <p className="font-medium">Free Plan</p>
        <p className="text-sm text-muted-foreground">
          Upgrade to unlock all features
        </p>
        <a
          href="/pricing"
          className="inline-block mt-3 text-sm text-primary hover:underline"
        >
          View Plans →
        </a>
      </div>
    );
  }

  const statusColors = {
    active: "bg-green-100 text-green-800",
    trialing: "bg-blue-100 text-blue-800",
    past_due: "bg-yellow-100 text-yellow-800",
    canceled: "bg-red-100 text-red-800",
  };

  const statusColor =
    statusColors[subscription.status as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800";

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{subscription.planName}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
          {subscription.status}
        </span>
      </div>

      {subscription.cancelAtPeriodEnd && (
        <p className="text-sm text-yellow-600 mb-2">
          Cancels on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
        </p>
      )}

      <p className="text-sm text-muted-foreground mb-3">
        {subscription.cancelAtPeriodEnd
          ? "Your subscription will end at the end of the billing period"
          : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
      </p>

      <BillingPortalButton className="text-sm text-primary hover:underline">
        Manage Subscription →
      </BillingPortalButton>
    </div>
  );
}

