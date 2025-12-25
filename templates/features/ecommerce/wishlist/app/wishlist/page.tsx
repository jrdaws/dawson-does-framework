"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore, WishlistItem } from "@/lib/wishlist/wishlist-store";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">My Wishlist</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold dark:text-white">
          My Wishlist ({items.length})
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Save items you love by clicking the heart icon.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: () => void;
}

function WishlistItemCard({ item, onRemove }: WishlistItemCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Image */}
      <Link
        href={`/products/${item.productId}`}
        className="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            📦
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productId}`}
          className="font-medium dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
        >
          {item.name}
        </Link>
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">
          {formatPrice(item.price)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Added {new Date(item.addedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Link
          href={`/products/${item.productId}`}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 text-center"
        >
          View Item
        </Link>
        <button
          onClick={onRemove}
          className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

