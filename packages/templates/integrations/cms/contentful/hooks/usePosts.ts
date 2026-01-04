"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "@/lib/contentful/types";

interface UsePostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching blog posts client-side
 * Note: For SSR/SSG, use the server-side queries directly
 */
export function usePosts(category?: string): UsePostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = category
        ? `/api/posts?category=${encodeURIComponent(category)}`
        : "/api/posts";

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  return {
    posts,
    loading,
    error,
    refresh: fetchPosts,
  };
}

