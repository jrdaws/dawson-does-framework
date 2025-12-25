/**
 * Product Categories Module
 * 
 * Manage hierarchical category organization.
 */

import { createClient } from "@/lib/supabase";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  productCount?: number;
  order?: number;
  children?: Category[];
}

/**
 * Get all categories (flat list)
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order_index");

  if (error || !data) {
    return [];
  }

  return data.map(mapCategoryFromDb);
}

/**
 * Get categories as a tree structure
 */
export async function getCategoryTree(): Promise<Category[]> {
  const categories = await getCategories();
  return buildTree(categories);
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return mapCategoryFromDb(data);
}

/**
 * Get child categories
 */
export async function getChildCategories(parentId: string): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parentId)
    .order("order_index");

  if (error || !data) {
    return [];
  }

  return data.map(mapCategoryFromDb);
}

/**
 * Get breadcrumb trail for a category
 */
export async function getCategoryBreadcrumbs(
  categoryId: string
): Promise<Category[]> {
  const supabase = createClient();
  const breadcrumbs: Category[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", currentId)
      .single();

    if (error || !data) break;

    breadcrumbs.unshift(mapCategoryFromDb(data));
    currentId = data.parent_id;
  }

  return breadcrumbs;
}

/**
 * Get products in a category
 */
export async function getProductsByCategory(
  categoryId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<{ id: string; name: string; price: number }[]> {
  const supabase = createClient();
  const { limit = 20, offset = 0 } = options;

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price")
    .eq("category_id", categoryId)
    .range(offset, offset + limit - 1);

  if (error || !data) {
    return [];
  }

  return data;
}

/**
 * Build tree from flat list
 */
function buildTree(categories: Category[]): Category[] {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  // First pass: create map
  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }

  // Second pass: build tree
  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Map database row to Category type
 */
function mapCategoryFromDb(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string | undefined,
    image: row.image_url as string | undefined,
    parentId: row.parent_id as string | undefined,
    productCount: row.product_count as number | undefined,
    order: row.order_index as number | undefined,
  };
}

/**
 * Generate slug from category name
 */
export function generateCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

