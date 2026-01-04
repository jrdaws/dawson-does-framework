"use client";

import { useState, useEffect, useCallback } from "react";
import { search, SearchHit, SearchResult } from "@/lib/search/algolia";

interface UseSearchOptions {
  debounceMs?: number;
  hitsPerPage?: number;
  filters?: string;
}

interface UseSearchReturn<T extends SearchHit> {
  query: string;
  setQuery: (query: string) => void;
  hits: T[];
  isLoading: boolean;
  error: Error | null;
  totalHits: number;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

export function useSearch<T extends SearchHit = SearchHit>(
  options: UseSearchOptions = {}
): UseSearchReturn<T> {
  const { debounceMs = 300, hitsPerPage = 10, filters } = options;

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalHits, setTotalHits] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const performSearch = useCallback(async () => {
    if (!query.trim()) {
      setHits([]);
      setTotalHits(0);
      setTotalPages(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await search<T>(query, {
        hitsPerPage,
        page,
        filters,
      });

      setHits(result.hits);
      setTotalHits(result.nbHits);
      setTotalPages(result.nbPages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Search failed"));
      setHits([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, hitsPerPage, page, filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(performSearch, debounceMs);
    return () => clearTimeout(timer);
  }, [performSearch, debounceMs]);

  // Reset page when query changes
  useEffect(() => {
    setPage(0);
  }, [query]);

  return {
    query,
    setQuery,
    hits,
    isLoading,
    error,
    totalHits,
    page,
    totalPages,
    setPage,
    refetch: performSearch,
  };
}

// Hook for instant search (no debounce)
export function useInstantSearch<T extends SearchHit = SearchHit>(
  initialQuery = "",
  options: Omit<UseSearchOptions, "debounceMs"> = {}
): UseSearchReturn<T> {
  return useSearch<T>({ ...options, debounceMs: 0 });
}

