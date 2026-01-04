"use client";

import { SearchHit } from "@/lib/search/algolia";

interface SearchResultsProps<T extends SearchHit> {
  hits: T[];
  isLoading?: boolean;
  query?: string;
  renderHit: (hit: T) => React.ReactNode;
  emptyMessage?: string;
  loadingMessage?: string;
  className?: string;
}

export function SearchResults<T extends SearchHit>({
  hits,
  isLoading = false,
  query,
  renderHit,
  emptyMessage = "No results found",
  loadingMessage = "Searching...",
  className = "",
}: SearchResultsProps<T>) {
  if (isLoading) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>{loadingMessage}</span>
        </div>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        <p>{emptyMessage}</p>
        {query && (
          <p className="mt-1 text-sm">
            No results for &quot;{query}&quot;
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {hits.map((hit) => (
        <div key={hit.objectID}>{renderHit(hit)}</div>
      ))}
    </div>
  );
}

// Simple default hit component
interface DefaultHitProps {
  title: string;
  description?: string;
  href?: string;
  onClick?: () => void;
}

export function DefaultHit({ title, description, href, onClick }: DefaultHitProps) {
  const content = (
    <div className="p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
      <h3 className="font-medium text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {description}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block" onClick={onClick}>
        {content}
      </a>
    );
  }

  return <div onClick={onClick}>{content}</div>;
}

