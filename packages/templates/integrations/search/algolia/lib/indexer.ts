import algoliasearch from "algoliasearch";

// Admin client for indexing (server-side only)
function getAdminClient() {
  const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;

  if (!APP_ID || !ADMIN_KEY) {
    throw new Error("Algolia admin credentials not configured");
  }

  return algoliasearch(APP_ID, ADMIN_KEY);
}

function getAdminIndex(indexName?: string) {
  const client = getAdminClient();
  return client.initIndex(indexName || process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!);
}

export interface IndexableRecord {
  objectID: string;
  [key: string]: unknown;
}

/**
 * Add or update records in the index
 */
export async function indexRecords(
  records: IndexableRecord[],
  indexName?: string
): Promise<{ taskID: number; objectIDs: string[] }> {
  const index = getAdminIndex(indexName);
  const result = await index.saveObjects(records);
  return {
    taskID: result.taskIDs[0],
    objectIDs: result.objectIDs as string[],
  };
}

/**
 * Delete records by objectID
 */
export async function deleteRecords(
  objectIDs: string[],
  indexName?: string
): Promise<{ taskID: number }> {
  const index = getAdminIndex(indexName);
  const result = await index.deleteObjects(objectIDs);
  return { taskID: result.taskIDs[0] };
}

/**
 * Clear all records from the index
 */
export async function clearIndex(indexName?: string): Promise<{ taskID: number }> {
  const index = getAdminIndex(indexName);
  const result = await index.clearObjects();
  return { taskID: result.taskID };
}

/**
 * Configure index settings
 */
export async function configureIndex(
  settings: {
    searchableAttributes?: string[];
    attributesForFaceting?: string[];
    customRanking?: string[];
    ranking?: string[];
  },
  indexName?: string
): Promise<void> {
  const index = getAdminIndex(indexName);
  await index.setSettings(settings);
}

/**
 * Partial update a record
 */
export async function partialUpdateRecord(
  objectID: string,
  attributes: Record<string, unknown>,
  indexName?: string
): Promise<{ taskID: number }> {
  const index = getAdminIndex(indexName);
  const result = await index.partialUpdateObject({
    objectID,
    ...attributes,
  });
  return { taskID: result.taskID };
}

