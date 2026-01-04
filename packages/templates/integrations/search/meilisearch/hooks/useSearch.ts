"use client";

import { useState, useCallback } from "react";
import { search } from "@/lib/search/meilisearch";

interface SearchResult {
  id: string;
  [key: string]: unknown;
}

interface UseSearchOptions {
  limit?: number;
  filter?: string | string[];
  sort?: string[];
  facets?: string[];
}

interface UseSearchReturn<T> {
  results: T[];
  query: string;
  loading: boolean;
  error: Error | null;
  totalHits: number;
  processingTimeMs: number;
  facetDistribution?: Record<string, Record<string, number>>;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

export function useSearch<T extends SearchResult = SearchResult>(
  indexName: string,
  options: UseSearchOptions = {}
): UseSearchReturn<T> {
  const [results, setResults] = useState<T[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalHits, setTotalHits] = useState(0);
  const [processingTimeMs, setProcessingTimeMs] = useState(0);
  const [facetDistribution, setFacetDistribution] = useState<
    Record<string, Record<string, number>> | undefined
  >();

  const performSearch = useCallback(
    async (searchQuery: string) => {
      setQuery(searchQuery);

      if (!searchQuery.trim()) {
        setResults([]);
        setTotalHits(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await search<T>(indexName, searchQuery, {
          limit: options.limit,
          filter: options.filter,
          sort: options.sort,
          facets: options.facets,
          attributesToHighlight: ["*"],
        });

        setResults(result.hits);
        setTotalHits(result.totalHits);
        setProcessingTimeMs(result.processingTimeMs);
        setFacetDistribution(result.facetDistribution);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Search failed"));
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [indexName, options.limit, options.filter, options.sort, options.facets]
  );

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setTotalHits(0);
    setError(null);
  }, []);

  return {
    results,
    query,
    loading,
    error,
    totalHits,
    processingTimeMs,
    facetDistribution,
    search: performSearch,
    clear,
  };
}

