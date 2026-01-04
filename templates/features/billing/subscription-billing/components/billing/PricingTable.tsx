"use client";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "month" | "year";
  priceId: string;
  features: string[];
  popular?: boolean;
}

interface PricingTableProps {
  plans: Plan[];
  onSelectPlan: (priceId: string) => void;
  loadingPlan?: string | null;
  currentPlanId?: string;
}

export function PricingTable({
  plans,
  onSelectPlan,
  loadingPlan,
  currentPlanId,
}: PricingTableProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative rounded-2xl p-8 ${
            plan.popular
              ? "bg-blue-600 text-white ring-4 ring-blue-600 ring-offset-2"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          }`}
        >
          {plan.popular && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-sm font-semibold px-4 py-1 rounded-full">
              Most Popular
            </span>
          )}

          <div className="text-center mb-6">
            <h3
              className={`text-xl font-bold mb-2 ${
                plan.popular ? "" : "dark:text-white"
              }`}
            >
              {plan.name}
            </h3>
            <p
              className={`text-sm ${
                plan.popular ? "text-blue-100" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {plan.description}
            </p>
          </div>

          <div className="text-center mb-6">
            <span
              className={`text-5xl font-bold ${
                plan.popular ? "" : "dark:text-white"
              }`}
            >
              ${plan.price}
            </span>
            <span
              className={`text-sm ${
                plan.popular ? "text-blue-100" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              /{plan.interval}
            </span>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    plan.popular ? "text-blue-200" : "text-green-500"
                  }`}
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
                <span
                  className={`text-sm ${
                    plan.popular ? "" : "dark:text-gray-300"
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelectPlan(plan.priceId)}
            disabled={loadingPlan === plan.priceId || currentPlanId === plan.id}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              plan.popular
                ? "bg-white text-blue-600 hover:bg-blue-50"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loadingPlan === plan.priceId
              ? "Loading..."
              : currentPlanId === plan.id
              ? "Current Plan"
              : "Get Started"}
          </button>
        </div>
      ))}
    </div>
  );
}

