"use client";

import { StockStatus, getStatusDisplay, canPurchase } from "@/lib/data/inventory";

interface StockBadgeProps {
  status: StockStatus;
  quantity?: number;
  showQuantity?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StockBadge({
  status,
  quantity,
  showQuantity = false,
  size = "md",
  className = "",
}: StockBadgeProps) {
  const display = getStatusDisplay(status);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${colorClasses[display.color]} ${className}`}
    >
      <span>{display.icon}</span>
      <span>{display.label}</span>
      {showQuantity && quantity !== undefined && status === "in_stock" && (
        <span className="opacity-75">({quantity})</span>
      )}
    </span>
  );
}

interface StockIndicatorProps {
  status: StockStatus;
  quantity?: number;
  lowStockThreshold?: number;
  className?: string;
}

export function StockIndicator({
  status,
  quantity,
  lowStockThreshold = 10,
  className = "",
}: StockIndicatorProps) {
  const display = getStatusDisplay(status);
  const purchasable = canPurchase(status);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`w-3 h-3 rounded-full ${getIndicatorColor(display.color)}`} />
      <span className="text-sm">
        {status === "in_stock" && quantity !== undefined ? (
          quantity > lowStockThreshold ? (
            <span className="text-green-600 dark:text-green-400">In stock</span>
          ) : (
            <span className="text-yellow-600 dark:text-yellow-400">
              Only {quantity} left
            </span>
          )
        ) : status === "out_of_stock" ? (
          <span className="text-red-600 dark:text-red-400">Out of stock</span>
        ) : (
          <span>{display.label}</span>
        )}
      </span>
    </div>
  );
}

function getIndicatorColor(color: "green" | "yellow" | "red" | "blue" | "purple"): string {
  const colors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  };
  return colors[color];
}

/**
 * Add to cart button with stock awareness
 */
interface StockAwareButtonProps {
  status: StockStatus;
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

export function StockAwareButton({
  status,
  onClick,
  loading,
  className = "",
}: StockAwareButtonProps) {
  const purchasable = canPurchase(status);
  const display = getStatusDisplay(status);

  const getButtonText = () => {
    if (loading) return "Adding...";
    switch (status) {
      case "in_stock":
      case "low_stock":
        return "Add to Cart";
      case "preorder":
        return "Pre-order Now";
      case "backorder":
        return "Backorder";
      case "out_of_stock":
        return "Out of Stock";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={!purchasable || loading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        purchasable
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
      } ${className}`}
    >
      {getButtonText()}
    </button>
  );
}

