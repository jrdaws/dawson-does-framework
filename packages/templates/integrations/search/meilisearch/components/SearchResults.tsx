"use client";

import { Loader2 } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url?: string;
  _formatted?: Record<string, string>;
  [key: string]: unknown;
}

interface SearchResultsProps<T extends SearchResult> {
  results: T[];
  loading?: boolean;
  query?: string;
  totalHits?: number;
  renderResult?: (result: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function SearchResults<T extends SearchResult>({
  results,
  loading = false,
  query,
  totalHits,
  renderResult,
  emptyMessage = "No results found",
  className = "",
}: SearchResultsProps<T>) {
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">{emptyMessage}</p>
        {query && (
          <p className="text-sm text-muted-foreground mt-1">
            No results for &quot;{query}&quot;
          </p>
        )}
      </div>
    );
  }

  const defaultRenderResult = (result: T, index: number) => (
    <a
      key={result.id}
      href={result.url || `#${result.id}`}
      className="block p-4 hover:bg-muted/50 rounded-lg transition-colors"
    >
      <h3
        className="font-medium text-foreground"
        dangerouslySetInnerHTML={{
          __html: result._formatted?.title || result.title,
        }}
      />
      {(result._formatted?.description || result.description) && (
        <p
          className="text-sm text-muted-foreground mt-1 line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: result._formatted?.description || result.description || "",
          }}
        />
      )}
    </a>
  );

  return (
    <div className={className}>
      {totalHits !== undefined && (
        <div className="text-sm text-muted-foreground mb-4">
          {totalHits} result{totalHits !== 1 ? "s" : ""} found
        </div>
      )}

      <div className="divide-y divide-border">
        {results.map((result, index) =>
          renderResult ? renderResult(result, index) : defaultRenderResult(result, index)
        )}
      </div>
    </div>
  );
}

