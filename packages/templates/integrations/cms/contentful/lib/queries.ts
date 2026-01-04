import { getClient } from "./client";
import type { BlogPost, Author, Page } from "./types";

/**
 * Get all blog posts
 */
export async function getAllPosts(preview = false): Promise<BlogPost[]> {
  const client = getClient(preview);

  const response = await client.getEntries<BlogPost>({
    content_type: "blogPost",
    order: ["-sys.createdAt"],
    include: 2,
  });

  return response.items.map((item) => ({
    ...item.fields,
    id: item.sys.id,
    createdAt: item.sys.createdAt,
    updatedAt: item.sys.updatedAt,
  }));
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(
  slug: string,
  preview = false
): Promise<BlogPost | null> {
  const client = getClient(preview);

  const response = await client.getEntries<BlogPost>({
    content_type: "blogPost",
    "fields.slug": slug,
    include: 2,
    limit: 1,
  });

  if (response.items.length === 0) {
    return null;
  }

  const item = response.items[0];
  return {
    ...item.fields,
    id: item.sys.id,
    createdAt: item.sys.createdAt,
    updatedAt: item.sys.updatedAt,
  };
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(
  category: string,
  preview = false
): Promise<BlogPost[]> {
  const client = getClient(preview);

  const response = await client.getEntries<BlogPost>({
    content_type: "blogPost",
    "fields.category": category,
    order: ["-sys.createdAt"],
    include: 2,
  });

  return response.items.map((item) => ({
    ...item.fields,
    id: item.sys.id,
    createdAt: item.sys.createdAt,
    updatedAt: item.sys.updatedAt,
  }));
}

/**
 * Get author by ID
 */
export async function getAuthor(
  authorId: string,
  preview = false
): Promise<Author | null> {
  const client = getClient(preview);

  try {
    const entry = await client.getEntry<Author>(authorId);
    return {
      ...entry.fields,
      id: entry.sys.id,
    };
  } catch {
    return null;
  }
}

/**
 * Get page by slug
 */
export async function getPageBySlug(
  slug: string,
  preview = false
): Promise<Page | null> {
  const client = getClient(preview);

  const response = await client.getEntries<Page>({
    content_type: "page",
    "fields.slug": slug,
    include: 3,
    limit: 1,
  });

  if (response.items.length === 0) {
    return null;
  }

  const item = response.items[0];
  return {
    ...item.fields,
    id: item.sys.id,
  };
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const client = getClient();

  const response = await client.getEntries({
    content_type: "blogPost",
    select: ["fields.slug"],
  });

  return response.items.map((item) => (item.fields as { slug: string }).slug);
}

