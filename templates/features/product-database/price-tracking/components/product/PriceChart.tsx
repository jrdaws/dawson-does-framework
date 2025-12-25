"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { PriceHistory, formatPrice, getPriceTrend, getPriceDropPercentage } from "@/lib/data/price-history";

interface PriceChartProps {
  history: PriceHistory;
  height?: number;
  showStats?: boolean;
  className?: string;
}

export function PriceChart({
  history,
  height = 200,
  showStats = true,
  className = "",
}: PriceChartProps) {
  const chartData = useMemo(() => {
    return history.history.map((point) => ({
      date: new Date(point.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: point.price,
    }));
  }, [history.history]);

  const trend = getPriceTrend(history);
  const dropPercent = getPriceDropPercentage(history);

  return (
    <div className={className}>
      {showStats && (
        <div className="flex gap-4 mb-4 text-sm">
          <StatBadge label="Current" value={formatPrice(history.currentPrice)} />
          <StatBadge 
            label="Lowest" 
            value={formatPrice(history.lowestPrice)} 
            highlight={history.currentPrice === history.lowestPrice}
          />
          <StatBadge label="Highest" value={formatPrice(history.highestPrice)} />
          {dropPercent > 0 && (
            <StatBadge 
              label="Drop" 
              value={`-${dropPercent}%`} 
              variant="success"
            />
          )}
          <TrendIndicator trend={trend} />
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `$${v}`}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), "Price"]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#priceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface StatBadgeProps {
  label: string;
  value: string;
  highlight?: boolean;
  variant?: "default" | "success" | "warning";
}

function StatBadge({ label, value, highlight, variant = "default" }: StatBadgeProps) {
  const variantClasses = {
    default: "bg-gray-100 dark:bg-gray-800",
    success: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  };

  return (
    <div className={`px-3 py-1 rounded-lg ${variantClasses[variant]} ${highlight ? "ring-2 ring-blue-500" : ""}`}>
      <span className="text-gray-500 dark:text-gray-400">{label}: </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
  const config = {
    up: { icon: "↑", color: "text-red-500", label: "Rising" },
    down: { icon: "↓", color: "text-green-500", label: "Falling" },
    stable: { icon: "→", color: "text-gray-500", label: "Stable" },
  };

  const { icon, color, label } = config[trend];

  return (
    <span className={`flex items-center gap-1 ${color}`}>
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </span>
  );
}

