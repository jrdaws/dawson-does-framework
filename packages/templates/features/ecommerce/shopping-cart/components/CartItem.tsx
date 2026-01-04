"use client";

import { useCartContext, CartItem as CartItemType } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/cart/cart-utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartContext();

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Image */}
      {item.image ? (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-lg bg-muted shrink-0 flex items-center justify-center">
          <span className="text-2xl text-muted-foreground">📦</span>
        </div>
      )}

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div>
            <h3 className="font-medium text-foreground truncate">{item.name}</h3>
            {item.variant && (
              <p className="text-sm text-muted-foreground">{item.variant}</p>
            )}
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

