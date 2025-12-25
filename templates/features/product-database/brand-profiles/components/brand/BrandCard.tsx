"use client";

import Link from "next/link";
import Image from "next/image";
import { Brand } from "@/lib/data/brands";

interface BrandCardProps {
  brand: Brand;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function BrandCard({
  brand,
  variant = "default",
  className = "",
}: BrandCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/brands/${brand.slug}`}
        className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
      >
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={40}
            height={40}
            className="rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center font-bold">
            {brand.name[0]}
          </div>
        )}
        <div>
          <p className="font-medium dark:text-white">{brand.name}</p>
          {brand.productCount !== undefined && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {brand.productCount} products
            </p>
          )}
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/brands/${brand.slug}`}
        className={`block p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl hover:shadow-lg transition-shadow ${className}`}
      >
        <div className="flex items-center gap-4 mb-4">
          {brand.logo ? (
            <Image
              src={brand.logo}
              alt={brand.name}
              width={60}
              height={60}
              className="rounded-lg"
            />
          ) : (
            <div className="w-15 h-15 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl font-bold">
              {brand.name[0]}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
              {brand.name}
              {brand.verified && (
                <span className="text-blue-500 text-sm">✓</span>
              )}
            </h3>
            {brand.headquarters && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                📍 {brand.headquarters}
              </p>
            )}
          </div>
        </div>

        {brand.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {brand.description}
          </p>
        )}

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {brand.productCount || 0} products
          </span>
          <span className="text-blue-600 dark:text-blue-400">View Brand →</span>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={`block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors ${className}`}
    >
      <div className="flex items-center gap-3 mb-3">
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={48}
            height={48}
            className="rounded-lg"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg font-bold">
            {brand.name[0]}
          </div>
        )}
        <div>
          <h3 className="font-semibold dark:text-white flex items-center gap-1">
            {brand.name}
            {brand.verified && <span className="text-blue-500 text-xs">✓</span>}
          </h3>
          {brand.founded && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Since {brand.founded}
            </p>
          )}
        </div>
      </div>

      {brand.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {brand.description}
        </p>
      )}
    </Link>
  );
}

/**
 * Brand list component
 */
interface BrandListProps {
  brands: Brand[];
  variant?: "grid" | "list";
  columns?: 2 | 3 | 4;
  className?: string;
}

export function BrandList({
  brands,
  variant = "grid",
  columns = 3,
  className = "",
}: BrandListProps) {
  if (brands.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
        No brands found.
      </p>
    );
  }

  if (variant === "list") {
    return (
      <div className={`space-y-2 ${className}`}>
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} variant="compact" />
        ))}
      </div>
    );
  }

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
}

