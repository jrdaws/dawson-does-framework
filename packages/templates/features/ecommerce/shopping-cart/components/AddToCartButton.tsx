"use client";

import { useCartContext, CartItem } from "@/lib/cart/cart-context";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">;
  quantity?: number;
  variant?: "default" | "icon" | "compact";
  className?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "default",
  className = "",
}: AddToCartButtonProps) {
  const { addItem, items } = useCartContext();
  const [isAdded, setIsAdded] = useState(false);

  const isInCart = items.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleAddToCart}
        className={`p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all ${
          isAdded ? "scale-110" : ""
        } ${className}`}
        aria-label="Add to cart"
      >
        {isAdded ? (
          <Check className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleAddToCart}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ${className}`}
      >
        <ShoppingCart className="h-3.5 w-3.5" />
        {isAdded ? "Added!" : "Add"}
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium transition-all ${
        isAdded
          ? "bg-green-600 text-white"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      } ${className}`}
    >
      {isAdded ? (
        <>
          <Check className="h-5 w-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          {isInCart ? "Add More" : "Add to Cart"}
        </>
      )}
    </button>
  );
}

