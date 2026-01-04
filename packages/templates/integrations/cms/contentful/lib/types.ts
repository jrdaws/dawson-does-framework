import type { Document } from "@contentful/rich-text-types";

export interface Asset {
  sys: { id: string };
  fields: {
    title: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: Asset;
  email?: string;
  twitter?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: Document;
  featuredImage?: Asset;
  author?: Author;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: Document;
  seoTitle?: string;
  seoDescription?: string;
  sections?: PageSection[];
}

export interface PageSection {
  id: string;
  type: "hero" | "features" | "cta" | "testimonials" | "faq";
  title?: string;
  content?: Document;
  items?: Record<string, unknown>[];
}

