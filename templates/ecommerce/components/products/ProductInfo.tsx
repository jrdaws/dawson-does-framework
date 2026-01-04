"use client";

import { useState } from "react";
import { ShoppingCart, Heart, Truck, Shield, RotateCcw } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  category: string;
  variants?: { name: string; options: string[] }[];
  inStock: boolean;
}

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const discount = product.compareAtPrice 
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", { product, selectedVariants, quantity });
  };

  return (
    <div className="space-y-6">
      {/* Category */}
      <p className="text-sm text-muted-foreground uppercase tracking-wide">
        {product.category}
      </p>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-foreground">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            <span className="bg-destructive text-destructive-foreground text-sm font-semibold px-2 py-1 rounded">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      {/* Variants */}
      {product.variants?.map((variant) => (
        <div key={variant.name}>
          <label className="block text-sm font-medium text-foreground mb-2">
            {variant.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedVariants({ ...selectedVariants, [variant.name]: option })}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedVariants[variant.name] === option
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
        <button className="w-12 h-12 flex items-center justify-center border border-border rounded-lg hover:bg-muted transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="flex flex-col items-center text-center gap-2">
          <Truck className="w-6 h-6 text-primary" />
          <span className="text-xs text-muted-foreground">Free Shipping</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-xs text-muted-foreground">2 Year Warranty</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <RotateCcw className="w-6 h-6 text-primary" />
          <span className="text-xs text-muted-foreground">30-Day Returns</span>
        </div>
      </div>
    </div>
  );
}

