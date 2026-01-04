/**
 * Chart Utilities
 * 
 * Helper functions for data visualization.
 */

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

/**
 * Format number for display
 */
export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format currency
 */
export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Calculate percentage change
 */
export function calculateChange(current: number, previous: number): {
  value: number;
  percent: number;
  direction: "up" | "down" | "neutral";
} {
  if (previous === 0) {
    return { value: current, percent: 0, direction: "neutral" };
  }

  const diff = current - previous;
  const percent = (diff / previous) * 100;

  return {
    value: diff,
    percent,
    direction: diff > 0 ? "up" : diff < 0 ? "down" : "neutral",
  };
}

/**
 * Group time series data by period
 */
export function groupByPeriod(
  data: TimeSeriesPoint[],
  period: "day" | "week" | "month"
): TimeSeriesPoint[] {
  const groups = new Map<string, number>();

  for (const point of data) {
    const date = new Date(point.date);
    let key: string;

    switch (period) {
      case "day":
        key = date.toISOString().split("T")[0];
        break;
      case "week":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
        break;
      case "month":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        break;
    }

    groups.set(key, (groups.get(key) || 0) + point.value);
  }

  return Array.from(groups.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate moving average
 */
export function movingAverage(data: number[], window: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    result.push(avg);
  }

  return result;
}

/**
 * Generate date range for charts
 */
export function generateDateRange(
  start: Date,
  end: Date,
  step: "day" | "week" | "month" = "day"
): string[] {
  const dates: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);

    switch (step) {
      case "day":
        current.setDate(current.getDate() + 1);
        break;
      case "week":
        current.setDate(current.getDate() + 7);
        break;
      case "month":
        current.setMonth(current.getMonth() + 1);
        break;
    }
  }

  return dates;
}

/**
 * Color palette for charts
 */
export const CHART_COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  pink: "#ec4899",
  cyan: "#06b6d4",
  lime: "#84cc16",
};

export const CHART_COLOR_ARRAY = Object.values(CHART_COLORS);

/**
 * Get color for index
 */
export function getChartColor(index: number): string {
  return CHART_COLOR_ARRAY[index % CHART_COLOR_ARRAY.length];
}

