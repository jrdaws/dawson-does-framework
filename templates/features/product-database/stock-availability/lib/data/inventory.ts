/**
 * Inventory Management Module
 * 
 * Track stock availability and inventory status.
 */

import { createClient } from "@/lib/supabase";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "backorder" | "preorder";

export interface InventoryItem {
  productId: string;
  quantity: number;
  status: StockStatus;
  lowStockThreshold: number;
  lastUpdated: string;
  warehouse?: string;
}

/**
 * Get inventory status for a product
 */
export async function getInventory(productId: string): Promise<InventoryItem | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("product_id", productId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    productId: data.product_id,
    quantity: data.quantity,
    status: calculateStatus(data.quantity, data.low_stock_threshold),
    lowStockThreshold: data.low_stock_threshold,
    lastUpdated: data.updated_at,
    warehouse: data.warehouse,
  };
}

/**
 * Update inventory quantity
 */
export async function updateInventory(
  productId: string,
  quantityChange: number
): Promise<boolean> {
  const supabase = createClient();

  const { data: current } = await supabase
    .from("inventory")
    .select("quantity")
    .eq("product_id", productId)
    .single();

  if (!current) return false;

  const newQuantity = Math.max(0, current.quantity + quantityChange);

  const { error } = await supabase
    .from("inventory")
    .update({ 
      quantity: newQuantity,
      updated_at: new Date().toISOString(),
    })
    .eq("product_id", productId);

  return !error;
}

/**
 * Reserve inventory for an order
 */
export async function reserveInventory(
  productId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  const inventory = await getInventory(productId);

  if (!inventory) {
    return { success: false, error: "Product not found" };
  }

  if (inventory.quantity < quantity) {
    return { success: false, error: "Insufficient stock" };
  }

  const success = await updateInventory(productId, -quantity);
  return { success };
}

/**
 * Calculate stock status from quantity
 */
export function calculateStatus(quantity: number, threshold: number): StockStatus {
  if (quantity <= 0) return "out_of_stock";
  if (quantity <= threshold) return "low_stock";
  return "in_stock";
}

/**
 * Get status display info
 */
export function getStatusDisplay(status: StockStatus): {
  label: string;
  color: "green" | "yellow" | "red" | "blue" | "purple";
  icon: string;
} {
  switch (status) {
    case "in_stock":
      return { label: "In Stock", color: "green", icon: "✓" };
    case "low_stock":
      return { label: "Low Stock", color: "yellow", icon: "!" };
    case "out_of_stock":
      return { label: "Out of Stock", color: "red", icon: "✕" };
    case "backorder":
      return { label: "Backorder", color: "blue", icon: "⏳" };
    case "preorder":
      return { label: "Pre-order", color: "purple", icon: "🔔" };
  }
}

/**
 * Check if product can be purchased
 */
export function canPurchase(status: StockStatus): boolean {
  return status === "in_stock" || status === "low_stock" || status === "preorder" || status === "backorder";
}

