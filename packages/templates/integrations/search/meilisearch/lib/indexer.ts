import { getIndex, configureIndex } from "./meilisearch";

export interface IndexableDocument {
  id: string;
  [key: string]: unknown;
}

/**
 * Add or update documents in an index
 */
export async function indexDocuments<T extends IndexableDocument>(
  indexName: string,
  documents: T[]
): Promise<{ taskUid: number }> {
  const index = await getIndex<T>(indexName);
  const task = await index.addDocuments(documents);
  return { taskUid: task.taskUid };
}

/**
 * Update specific documents
 */
export async function updateDocuments<T extends IndexableDocument>(
  indexName: string,
  documents: T[]
): Promise<{ taskUid: number }> {
  const index = await getIndex<T>(indexName);
  const task = await index.updateDocuments(documents);
  return { taskUid: task.taskUid };
}

/**
 * Delete documents by ID
 */
export async function deleteDocuments(
  indexName: string,
  documentIds: string[]
): Promise<{ taskUid: number }> {
  const index = await getIndex(indexName);
  const task = await index.deleteDocuments(documentIds);
  return { taskUid: task.taskUid };
}

/**
 * Delete all documents in an index
 */
export async function clearIndex(
  indexName: string
): Promise<{ taskUid: number }> {
  const index = await getIndex(indexName);
  const task = await index.deleteAllDocuments();
  return { taskUid: task.taskUid };
}

/**
 * Example: Configure a products index
 */
export async function configureProductsIndex(): Promise<void> {
  await configureIndex("products", {
    searchableAttributes: ["name", "description", "category", "brand"],
    filterableAttributes: ["category", "brand", "price", "inStock"],
    sortableAttributes: ["name", "price", "createdAt"],
    rankingRules: [
      "words",
      "typo",
      "proximity",
      "attribute",
      "sort",
      "exactness",
    ],
  });
}

/**
 * Example: Configure a blog posts index
 */
export async function configureBlogIndex(): Promise<void> {
  await configureIndex("posts", {
    searchableAttributes: ["title", "excerpt", "content", "author", "tags"],
    filterableAttributes: ["category", "author", "tags", "publishedAt"],
    sortableAttributes: ["title", "publishedAt"],
  });
}

/**
 * Example: Index products
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  inStock: boolean;
  createdAt: string;
}

export async function indexProducts(products: Product[]): Promise<void> {
  await configureProductsIndex();
  await indexDocuments("products", products);
}

/**
 * Example: Index blog posts
 */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
}

export async function indexBlogPosts(posts: BlogPost[]): Promise<void> {
  await configureBlogIndex();
  await indexDocuments("posts", posts);
}

