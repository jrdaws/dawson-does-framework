"use client";

import { useState } from "react";
import Link from "next/link";
import { Category } from "@/lib/data/categories";

interface CategoryNavProps {
  categories: Category[];
  currentSlug?: string;
  variant?: "sidebar" | "horizontal" | "dropdown";
  className?: string;
}

export function CategoryNav({
  categories,
  currentSlug,
  variant = "sidebar",
  className = "",
}: CategoryNavProps) {
  if (variant === "horizontal") {
    return (
      <nav className={`flex gap-2 overflow-x-auto pb-2 ${className}`}>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              currentSlug === cat.slug
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {cat.name}
            {cat.productCount !== undefined && (
              <span className="ml-1 text-xs opacity-75">({cat.productCount})</span>
            )}
          </Link>
        ))}
      </nav>
    );
  }

  if (variant === "dropdown") {
    return <CategoryDropdown categories={categories} currentSlug={currentSlug} />;
  }

  // Sidebar variant (default)
  return (
    <nav className={`space-y-1 ${className}`}>
      {categories.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          currentSlug={currentSlug}
          depth={0}
        />
      ))}
    </nav>
  );
}

interface CategoryItemProps {
  category: Category;
  currentSlug?: string;
  depth: number;
}

function CategoryItem({ category, currentSlug, depth }: CategoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isActive = currentSlug === category.slug;

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={`/categories/${category.slug}`}
          className={`flex-1 px-3 py-2 rounded-lg ${
            isActive
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          style={{ paddingLeft: `${(depth + 1) * 12}px` }}
        >
          {category.name}
          {category.productCount !== undefined && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {category.productCount}
            </span>
          )}
        </Link>

        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="mt-1">
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              currentSlug={currentSlug}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryDropdown({
  categories,
  currentSlug,
}: {
  categories: Category[];
  currentSlug?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentCategory = categories.find((c) => c.slug === currentSlug);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
      >
        <span>{currentCategory?.name || "All Categories"}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-auto">
          <Link
            href="/categories"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            All Categories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentSlug === cat.slug ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Breadcrumbs component
 */
interface CategoryBreadcrumbsProps {
  breadcrumbs: Category[];
  className?: string;
}

export function CategoryBreadcrumbs({ breadcrumbs, className = "" }: CategoryBreadcrumbsProps) {
  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        Home
      </Link>
      {breadcrumbs.map((cat, index) => (
        <span key={cat.id} className="flex items-center gap-2">
          <span className="text-gray-400">/</span>
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 dark:text-white font-medium">{cat.name}</span>
          ) : (
            <Link
              href={`/categories/${cat.slug}`}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {cat.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

