"use client";

import { useWishlistStore, WishlistItem } from "@/lib/wishlist/wishlist-store";

interface WishlistButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  variant?: "icon" | "text" | "full";
  className?: string;
}

export function WishlistButton({
  productId,
  name,
  price,
  image,
  variant = "icon",
  className = "",
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const isWishlisted = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ productId, name, price, image });
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-full transition-colors ${
          isWishlisted
            ? "text-red-500 bg-red-50 dark:bg-red-900/20"
            : "text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        } ${className}`}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <HeartIcon filled={isWishlisted} />
      </button>
    );
  }

  if (variant === "text") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 text-sm ${
          isWishlisted
            ? "text-red-500"
            : "text-gray-500 hover:text-red-500 dark:text-gray-400"
        } ${className}`}
      >
        <HeartIcon filled={isWishlisted} className="w-4 h-4" />
        {isWishlisted ? "Saved" : "Save"}
      </button>
    );
  }

  // Full button variant
  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isWishlisted
          ? "bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-300 hover:text-red-500"
      } ${className}`}
    >
      <HeartIcon filled={isWishlisted} className="w-5 h-5" />
      {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
    </button>
  );
}

function HeartIcon({
  filled,
  className = "w-5 h-5",
}: {
  filled: boolean;
  className?: string;
}) {
  if (filled) {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

/**
 * Wishlist icon for header with count
 */
export function WishlistIcon({ className = "" }: { className?: string }) {
  const { getCount, openWishlist } = useWishlistStore();
  const count = getCount();

  return (
    <button
      onClick={openWishlist}
      className={`relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${className}`}
    >
      <HeartIcon filled={false} className="w-6 h-6 dark:text-white" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

