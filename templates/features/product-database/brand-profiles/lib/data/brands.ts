/**
 * Brand Profiles Module
 * 
 * Manage company and brand information.
 */

import { createClient } from "@/lib/supabase";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  founded?: number;
  headquarters?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  productCount?: number;
  verified?: boolean;
}

/**
 * Get all brands
 */
export async function getBrands(): Promise<Brand[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name");

  if (error || !data) {
    return [];
  }

  return data.map(mapBrandFromDb);
}

/**
 * Get brand by slug
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return mapBrandFromDb(data);
}

/**
 * Get brand by ID
 */
export async function getBrandById(id: string): Promise<Brand | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapBrandFromDb(data);
}

/**
 * Search brands by name
 */
export async function searchBrands(query: string): Promise<Brand[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .ilike("name", `%${query}%`)
    .limit(20);

  if (error || !data) {
    return [];
  }

  return data.map(mapBrandFromDb);
}

/**
 * Get products by brand
 */
export async function getProductsByBrand(
  brandId: string,
  limit = 20
): Promise<{ id: string; name: string; price: number }[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price")
    .eq("brand_id", brandId)
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
}

/**
 * Map database row to Brand type
 */
function mapBrandFromDb(row: Record<string, unknown>): Brand {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string | undefined,
    logo: row.logo_url as string | undefined,
    website: row.website as string | undefined,
    founded: row.founded_year as number | undefined,
    headquarters: row.headquarters as string | undefined,
    socialLinks: row.social_links as Brand["socialLinks"],
    productCount: row.product_count as number | undefined,
    verified: row.verified as boolean | undefined,
  };
}

/**
 * Generate slug from brand name
 */
export function generateBrandSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

