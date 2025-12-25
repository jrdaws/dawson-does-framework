/**
 * Price History Module
 * 
 * Track and analyze historical price data for products.
 */

import { createClient } from "@/lib/supabase";

export interface PricePoint {
  date: string;
  price: number;
  currency: string;
  retailer?: string;
}

export interface PriceHistory {
  productId: string;
  history: PricePoint[];
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
}

/**
 * Get price history for a product
 */
export async function getPriceHistory(
  productId: string,
  days = 30
): Promise<PriceHistory | null> {
  const supabase = createClient();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("price_history")
    .select("*")
    .eq("product_id", productId)
    .gte("recorded_at", startDate.toISOString())
    .order("recorded_at", { ascending: true });

  if (error || !data || data.length === 0) {
    return null;
  }

  const prices = data.map((d) => d.price as number);
  const history: PricePoint[] = data.map((d) => ({
    date: d.recorded_at,
    price: d.price,
    currency: d.currency || "USD",
    retailer: d.retailer,
  }));

  return {
    productId,
    history,
    currentPrice: prices[prices.length - 1],
    lowestPrice: Math.min(...prices),
    highestPrice: Math.max(...prices),
    averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
  };
}

/**
 * Record a new price point
 */
export async function recordPrice(
  productId: string,
  price: number,
  currency = "USD",
  retailer?: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from("price_history").insert({
    product_id: productId,
    price,
    currency,
    retailer,
    recorded_at: new Date().toISOString(),
  });

  return !error;
}

/**
 * Get price trend (up, down, stable)
 */
export function getPriceTrend(history: PriceHistory): "up" | "down" | "stable" {
  if (history.history.length < 2) return "stable";

  const recent = history.history.slice(-7);
  if (recent.length < 2) return "stable";

  const firstPrice = recent[0].price;
  const lastPrice = recent[recent.length - 1].price;
  const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;

  if (changePercent > 2) return "up";
  if (changePercent < -2) return "down";
  return "stable";
}

/**
 * Calculate price drop alert threshold
 */
export function getPriceDropPercentage(history: PriceHistory): number {
  if (history.currentPrice >= history.highestPrice) return 0;
  return Math.round(
    ((history.highestPrice - history.currentPrice) / history.highestPrice) * 100
  );
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

