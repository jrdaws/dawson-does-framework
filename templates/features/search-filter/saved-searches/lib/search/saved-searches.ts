/**
 * Saved Searches Module
 * 
 * Allow users to save and reuse search queries.
 */

import { createClient } from "@/lib/supabase";

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  filters?: Record<string, unknown>;
  createdAt: string;
  lastUsedAt?: string;
  useCount: number;
}

/**
 * Get saved searches for a user
 */
export async function getSavedSearches(userId: string): Promise<SavedSearch[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("user_id", userId)
    .order("last_used_at", { ascending: false, nullsFirst: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapSavedSearchFromDb);
}

/**
 * Save a new search
 */
export async function saveSearch(
  userId: string,
  name: string,
  query: string,
  filters?: Record<string, unknown>
): Promise<SavedSearch | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_searches")
    .insert({
      user_id: userId,
      name,
      query,
      filters,
      created_at: new Date().toISOString(),
      use_count: 0,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Failed to save search:", error);
    return null;
  }

  return mapSavedSearchFromDb(data);
}

/**
 * Delete a saved search
 */
export async function deleteSavedSearch(
  searchId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("saved_searches")
    .delete()
    .eq("id", searchId)
    .eq("user_id", userId);

  return !error;
}

/**
 * Update saved search name
 */
export async function updateSavedSearchName(
  searchId: string,
  userId: string,
  name: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("saved_searches")
    .update({ name })
    .eq("id", searchId)
    .eq("user_id", userId);

  return !error;
}

/**
 * Record usage of a saved search
 */
export async function recordSearchUsage(searchId: string): Promise<void> {
  const supabase = createClient();

  await supabase.rpc("increment_search_usage", { search_id: searchId });
}

/**
 * Get most used saved searches
 */
export async function getPopularSavedSearches(
  userId: string,
  limit = 5
): Promise<SavedSearch[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("user_id", userId)
    .order("use_count", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map(mapSavedSearchFromDb);
}

/**
 * Check if search is already saved
 */
export async function isSearchSaved(
  userId: string,
  query: string
): Promise<boolean> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("saved_searches")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("query", query);

  return !error && (count || 0) > 0;
}

/**
 * Map database row to SavedSearch type
 */
function mapSavedSearchFromDb(row: Record<string, unknown>): SavedSearch {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    query: row.query as string,
    filters: row.filters as Record<string, unknown> | undefined,
    createdAt: row.created_at as string,
    lastUsedAt: row.last_used_at as string | undefined,
    useCount: (row.use_count as number) || 0,
  };
}

