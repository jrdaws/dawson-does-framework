/**
 * Sanity GROQ Queries
 * 
 * Common queries for fetching content from Sanity.
 */

import { groq } from "next-sanity";

// ============================================================
// Post Queries
// ============================================================

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->{
      name,
      image
    },
    "categories": categories[]->{
      title,
      slug
    }
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    mainImage,
    publishedAt,
    "author": author->{
      name,
      image,
      bio
    },
    "categories": categories[]->{
      title,
      slug
    }
  }
`;

// ============================================================
// Page Queries
// ============================================================

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    seo
  }
`;

// ============================================================
// Author Queries
// ============================================================

export const authorsQuery = groq`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    image,
    bio
  }
`;

// ============================================================
// Category Queries
// ============================================================

export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`;

export const postsByCategoryQuery = groq`
  *[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->{
      name,
      image
    }
  }
`;

// ============================================================
// Settings Queries
// ============================================================

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    description,
    logo,
    socialLinks
  }
`;

// ============================================================
// Type Definitions
// ============================================================

export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: unknown[];
  mainImage?: SanityImage;
  publishedAt: string;
  author?: SanityAuthor;
  categories?: SanityCategory[];
}

export interface SanityAuthor {
  name: string;
  image?: SanityImage;
  bio?: string;
}

export interface SanityCategory {
  title: string;
  slug: { current: string };
  description?: string;
}

export interface SanityImage {
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  caption?: string;
}

