"use client";

import { useCartContext, CartItem } from "@/lib/cart/cart-context";
import { getCartSummary, CartSummary } from "@/lib/cart/cart-utils";

interface UseCartReturn {
  // State
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  summary: CartSummary;
  isEmpty: boolean;
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Helpers
  getItem: (id: string) => CartItem | undefined;
  hasItem: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
}

/**
 * Hook for cart operations
 * 
 * @example
 * ```tsx
 * const { items, addItem, removeItem, summary } = useCart();
 * 
 * // Add item to cart
 * addItem({ id: "1", name: "Product", price: 29.99 });
 * 
 * // Check if item is in cart
 * if (hasItem("1")) { ... }
 * 
 * // Get cart summary
 * console.log(summary.formattedTotal); // "$32.58"
 * ```
 */
export function useCart(): UseCartReturn {
  const context = useCartContext();
  
  const summary = getCartSummary(context.items);
  const isEmpty = context.items.length === 0;
  
  const getItem = (id: string): CartItem | undefined => {
    return context.items.find((item) => item.id === id);
  };
  
  const hasItem = (id: string): boolean => {
    return context.items.some((item) => item.id === id);
  };
  
  const getItemQuantity = (id: string): number => {
    const item = getItem(id);
    return item?.quantity ?? 0;
  };
  
  return {
    // State
    items: context.items,
    itemCount: context.itemCount,
    subtotal: context.subtotal,
    summary,
    isEmpty,
    isOpen: context.isOpen,
    
    // Actions
    addItem: context.addItem,
    removeItem: context.removeItem,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    openCart: context.openCart,
    closeCart: context.closeCart,
    toggleCart: context.toggleCart,
    
    // Helpers
    getItem,
    hasItem,
    getItemQuantity,
  };
}

