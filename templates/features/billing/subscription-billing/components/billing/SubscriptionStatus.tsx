"use client";

interface SubscriptionStatusProps {
  status: string;
  planName: string;
  periodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export function SubscriptionStatus({
  status,
  planName,
  periodEnd,
  cancelAtPeriodEnd,
}: SubscriptionStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return cancelAtPeriodEnd
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "past_due":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "trialing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusLabel = () => {
    if (status === "active" && cancelAtPeriodEnd) {
      return "Canceling";
    }
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold dark:text-white">{planName}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your current subscription
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {cancelAtPeriodEnd ? "Cancels on" : "Renews on"}
          </span>
          <span className="dark:text-white">{formatDate(periodEnd)}</span>
        </div>

        {cancelAtPeriodEnd && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              Your subscription will end on {formatDate(periodEnd)}. You'll lose
              access to premium features after this date.
            </p>
          </div>
        )}

        {status === "past_due" && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-400">
              Your payment is past due. Please update your payment method to
              continue your subscription.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact subscription badge
 */
interface SubscriptionBadgeProps {
  planName: string;
  status: string;
}

export function SubscriptionBadge({ planName, status }: SubscriptionBadgeProps) {
  const isActive = status === "active" || status === "trialing";

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
        isActive
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
      {planName}
    </div>
  );
}

