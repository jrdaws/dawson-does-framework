"use client";

import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

interface CartIconProps {
  itemCount?: number;
  variant?: "header" | "floating" | "mini";
  className?: string;
}

/**
 * Preview component showing shopping cart indicator
 * Displays in preview when e-commerce/cart features are selected
 */
export function CartIcon({ itemCount = 3, variant = "header", className }: CartIconProps) {
  if (variant === "floating") {
    return (
      <div className={cn(
        "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform",
        className
      )}>
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-medium">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </div>
    );
  }

  if (variant === "mini") {
    return (
      <button className={cn("relative p-1", className)}>
        <ShoppingCart className="h-4 w-4 text-foreground-secondary" />
        {itemCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-medium">
            {itemCount}
          </span>
        )}
      </button>
    );
  }

  // Header variant (default)
  return (
    <button className={cn("relative p-2 hover:bg-background-alt rounded-lg transition-colors", className)}>
      <ShoppingCart className="h-5 w-5 text-foreground-secondary" />
      {itemCount > 0 && (
        <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-medium">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
}

