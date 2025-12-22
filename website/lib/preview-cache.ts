import { Redis } from "@upstash/redis";
import crypto from "crypto";

/**
 * Preview cache module
 * Provides caching for AI-generated previews with Redis and in-memory fallback
 */

export interface PreviewCacheEntry {
  html: string;
  components: string[];
  generatedAt: string;
  seed?: number;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface PreviewCacheKey {
  template: string;
  projectName?: string;
  integrations: Record<string, string>;
  inspirations: Array<{ type: string; value: string }>;
  description: string;
  vision?: string;
  mission?: string;
  seed?: number;
}

// Cache configuration
const CACHE_TTL = 30 * 60; // 30 minutes in seconds
const MAX_MEMORY_ENTRIES = 100;
const CACHE_KEY_PREFIX = "preview:";

// Initialize Redis client (optional - gracefully handles missing env vars)
let redis: Redis | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.warn("Preview cache: Redis initialization failed, using in-memory cache:", error);
  redis = null;
}

// In-memory fallback cache
interface MemoryCacheEntry extends PreviewCacheEntry {
  expiresAt: number;
}

const memoryCache = new Map<string, MemoryCacheEntry>();

// Cache statistics
let stats = {
  hits: 0,
  misses: 0,
  sets: 0,
  errors: 0,
};

/**
 * Generate a cache key from preview parameters
 * Uses SHA-256 hash to create a deterministic, compact key
 */
export function generateCacheKey(params: PreviewCacheKey): string {
  const keyData = JSON.stringify({
    template: params.template,
    projectName: params.projectName || "",
    integrations: params.integrations,
    // Include inspirations to ensure different inspirations produce different cache keys
    inspirations: params.inspirations.map(i => ({ type: i.type, value: i.value })),
    description: params.description,
    vision: params.vision || "",
    mission: params.mission || "",
    seed: params.seed,
  });
  return crypto.createHash("sha256").update(keyData).digest("hex").slice(0, 16);
}

/**
 * Get a cached preview
 * Returns null if not found or expired
 */
export async function getCachedPreview(
  cacheKey: string
): Promise<PreviewCacheEntry | null> {
  // Try Redis first
  if (redis) {
    try {
      const redisKey = `${CACHE_KEY_PREFIX}${cacheKey}`;
      const cached = await redis.get<PreviewCacheEntry>(redisKey);

      if (cached) {
        stats.hits++;
        console.log(`[Preview Cache] Redis HIT: ${cacheKey}`);
        return cached;
      }
    } catch (error) {
      stats.errors++;
      console.error("[Preview Cache] Redis get error:", error);
      // Fall through to memory cache
    }
  }

  // Try in-memory cache
  const memoryCached = memoryCache.get(cacheKey);
  if (memoryCached) {
    if (memoryCached.expiresAt > Date.now()) {
      stats.hits++;
      console.log(`[Preview Cache] Memory HIT: ${cacheKey}`);

      // Return without expiresAt field
      const { expiresAt, ...entry } = memoryCached;
      return entry;
    } else {
      // Expired, remove it
      memoryCache.delete(cacheKey);
    }
  }

  stats.misses++;
  console.log(`[Preview Cache] MISS: ${cacheKey}`);
  return null;
}

/**
 * Store a preview in cache
 * Uses both Redis (if available) and in-memory cache
 */
export async function setCachedPreview(
  cacheKey: string,
  entry: PreviewCacheEntry
): Promise<void> {
  stats.sets++;

  // Store in Redis
  if (redis) {
    try {
      const redisKey = `${CACHE_KEY_PREFIX}${cacheKey}`;
      await redis.setex(redisKey, CACHE_TTL, entry);
      console.log(`[Preview Cache] Redis SET: ${cacheKey} (TTL: ${CACHE_TTL}s)`);
    } catch (error) {
      stats.errors++;
      console.error("[Preview Cache] Redis set error:", error);
      // Continue to set in memory cache
    }
  }

  // Store in memory cache as fallback
  memoryCache.set(cacheKey, {
    ...entry,
    expiresAt: Date.now() + CACHE_TTL * 1000,
  });
  console.log(`[Preview Cache] Memory SET: ${cacheKey}`);

  // Clean up old entries if cache is too large
  if (memoryCache.size > MAX_MEMORY_ENTRIES) {
    cleanupMemoryCache();
  }
}

/**
 * Delete a specific cache entry
 */
export async function deleteCachedPreview(cacheKey: string): Promise<void> {
  // Delete from Redis
  if (redis) {
    try {
      const redisKey = `${CACHE_KEY_PREFIX}${cacheKey}`;
      await redis.del(redisKey);
    } catch (error) {
      console.error("[Preview Cache] Redis delete error:", error);
    }
  }

  // Delete from memory
  memoryCache.delete(cacheKey);
  console.log(`[Preview Cache] Deleted: ${cacheKey}`);
}

/**
 * Clear all cached previews
 * Useful for testing or manual cache invalidation
 */
export async function clearAllPreviews(): Promise<void> {
  // Clear Redis (pattern-based deletion)
  if (redis) {
    try {
      // Note: This is a simple implementation
      // For production, consider using SCAN for large key sets
      const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      console.log(`[Preview Cache] Cleared ${keys.length} Redis entries`);
    } catch (error) {
      console.error("[Preview Cache] Redis clear error:", error);
    }
  }

  // Clear memory cache
  const count = memoryCache.size;
  memoryCache.clear();
  console.log(`[Preview Cache] Cleared ${count} memory entries`);

  // Reset stats
  stats = { hits: 0, misses: 0, sets: 0, errors: 0 };
}

/**
 * Clean up expired entries from memory cache
 */
function cleanupMemoryCache(): void {
  const now = Date.now();
  let removed = 0;

  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt < now) {
      memoryCache.delete(key);
      removed++;
    }
  }

  console.log(`[Preview Cache] Cleaned up ${removed} expired memory entries`);
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  hits: number;
  misses: number;
  sets: number;
  errors: number;
  hitRate: number;
  memorySize: number;
  redisAvailable: boolean;
} {
  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? stats.hits / total : 0;

  return {
    ...stats,
    hitRate,
    memorySize: memoryCache.size,
    redisAvailable: redis !== null,
  };
}

/**
 * Check if Redis caching is available
 */
export function isRedisCacheAvailable(): boolean {
  return redis !== null;
}

/**
 * Get cache TTL in seconds
 */
export function getCacheTTL(): number {
  return CACHE_TTL;
}
