import algoliasearch from "algoliasearch/lite";

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!;
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!;

if (!APP_ID || !SEARCH_KEY) {
  console.warn("Algolia credentials not set. Search will not work.");
}

// Search-only client (safe for frontend)
export const searchClient = algoliasearch(APP_ID, SEARCH_KEY);

// Get the default index
export const searchIndex = searchClient.initIndex(INDEX_NAME);

// Types for search results
export interface SearchHit {
  objectID: string;
  [key: string]: unknown;
}

export interface SearchResult<T extends SearchHit = SearchHit> {
  hits: T[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  query: string;
}

/**
 * Simple search function
 */
export async function search<T extends SearchHit = SearchHit>(
  query: string,
  options?: {
    hitsPerPage?: number;
    page?: number;
    filters?: string;
    facetFilters?: string | string[];
  }
): Promise<SearchResult<T>> {
  const result = await searchIndex.search<T>(query, {
    hitsPerPage: options?.hitsPerPage ?? 10,
    page: options?.page ?? 0,
    filters: options?.filters,
    facetFilters: options?.facetFilters,
  });

  return result as SearchResult<T>;
}

export { algoliasearch };

