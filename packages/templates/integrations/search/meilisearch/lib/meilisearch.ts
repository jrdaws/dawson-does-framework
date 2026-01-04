import { MeiliSearch, Index } from "meilisearch";

// Server-side client with admin API key
let serverClient: MeiliSearch | null = null;

export function getServerClient(): MeiliSearch {
  if (!serverClient) {
    const host = process.env.MEILISEARCH_HOST;
    const apiKey = process.env.MEILISEARCH_API_KEY;

    if (!host) {
      throw new Error("MEILISEARCH_HOST is not set");
    }

    serverClient = new MeiliSearch({
      host,
      apiKey,
    });
  }

  return serverClient;
}

// Client-side client with search-only key
let searchClient: MeiliSearch | null = null;

export function getSearchClient(): MeiliSearch {
  if (typeof window === "undefined") {
    throw new Error("getSearchClient should only be called on the client");
  }

  if (!searchClient) {
    const host = process.env.NEXT_PUBLIC_MEILISEARCH_HOST;
    const apiKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY;

    if (!host) {
      throw new Error("NEXT_PUBLIC_MEILISEARCH_HOST is not set");
    }

    searchClient = new MeiliSearch({
      host,
      apiKey,
    });
  }

  return searchClient;
}

/**
 * Get or create an index
 */
export async function getIndex<T extends Record<string, unknown>>(
  indexName: string
): Promise<Index<T>> {
  const client = getServerClient();

  try {
    return await client.getIndex<T>(indexName);
  } catch {
    // Index doesn't exist, create it
    await client.createIndex(indexName, { primaryKey: "id" });
    return client.getIndex<T>(indexName);
  }
}

/**
 * Configure searchable and filterable attributes
 */
export async function configureIndex(
  indexName: string,
  config: {
    searchableAttributes?: string[];
    filterableAttributes?: string[];
    sortableAttributes?: string[];
    rankingRules?: string[];
  }
): Promise<void> {
  const index = await getIndex(indexName);

  if (config.searchableAttributes) {
    await index.updateSearchableAttributes(config.searchableAttributes);
  }

  if (config.filterableAttributes) {
    await index.updateFilterableAttributes(config.filterableAttributes);
  }

  if (config.sortableAttributes) {
    await index.updateSortableAttributes(config.sortableAttributes);
  }

  if (config.rankingRules) {
    await index.updateRankingRules(config.rankingRules);
  }
}

/**
 * Search documents
 */
export async function search<T extends Record<string, unknown>>(
  indexName: string,
  query: string,
  options?: {
    limit?: number;
    offset?: number;
    filter?: string | string[];
    sort?: string[];
    facets?: string[];
    attributesToRetrieve?: string[];
    attributesToHighlight?: string[];
  }
): Promise<{
  hits: T[];
  totalHits: number;
  processingTimeMs: number;
  query: string;
  facetDistribution?: Record<string, Record<string, number>>;
}> {
  const client = getSearchClient();
  const index = client.index<T>(indexName);

  const result = await index.search(query, {
    limit: options?.limit || 20,
    offset: options?.offset || 0,
    filter: options?.filter,
    sort: options?.sort,
    facets: options?.facets,
    attributesToRetrieve: options?.attributesToRetrieve,
    attributesToHighlight: options?.attributesToHighlight,
  });

  return {
    hits: result.hits,
    totalHits: result.estimatedTotalHits || result.hits.length,
    processingTimeMs: result.processingTimeMs,
    query: result.query,
    facetDistribution: result.facetDistribution,
  };
}

