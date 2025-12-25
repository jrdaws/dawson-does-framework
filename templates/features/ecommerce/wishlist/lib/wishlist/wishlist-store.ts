/**
 * Wishlist Store
 * 
 * Client-side wishlist state management using Zustand.
 * Syncs with backend for authenticated users.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  addedAt: string;
}

export interface WishlistStore {
  items: WishlistItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<WishlistItem, "id" | "addedAt">) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, "id" | "addedAt">) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  
  // Count
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) return;

        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id: `wish-${item.productId}-${Date.now()}`,
              addedAt: new Date().toISOString(),
            },
          ],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      toggleItem: (item) => {
        const isIn = get().isInWishlist(item.productId);
        if (isIn) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      openWishlist: () => {
        set({ isOpen: true });
      },

      closeWishlist: () => {
        set({ isOpen: false });
      },

      getCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "wishlist",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/**
 * Sync wishlist with backend (for authenticated users)
 */
export async function syncWishlistToBackend(
  userId: string,
  items: WishlistItem[]
): Promise<void> {
  try {
    await fetch("/api/wishlist/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, items }),
    });
  } catch (error) {
    console.error("Failed to sync wishlist:", error);
  }
}

/**
 * Load wishlist from backend
 */
export async function loadWishlistFromBackend(
  userId: string
): Promise<WishlistItem[]> {
  try {
    const response = await fetch(`/api/wishlist?userId=${userId}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Failed to load wishlist:", error);
    return [];
  }
}

