/**
 * Sanity Image URL Builder
 * 
 * Utilities for generating optimized image URLs from Sanity.
 */

import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

interface SanityImageSource {
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

/**
 * Generate an image URL from a Sanity image reference
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Generate a responsive image URL with common options
 */
export function getImageUrl(
  source: SanityImageSource,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    blur?: number;
  } = {}
): string {
  const { width = 800, height, quality = 80, blur } = options;

  let imageBuilder = urlFor(source).width(width).quality(quality).auto("format");

  if (height) {
    imageBuilder = imageBuilder.height(height);
  }

  if (blur) {
    imageBuilder = imageBuilder.blur(blur);
  }

  return imageBuilder.url();
}

/**
 * Generate srcSet for responsive images
 */
export function getSrcSet(
  source: SanityImageSource,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string {
  return widths
    .map((w) => `${urlFor(source).width(w).auto("format").url()} ${w}w`)
    .join(", ");
}

/**
 * Get placeholder blur data URL
 */
export function getBlurDataUrl(source: SanityImageSource): string {
  return urlFor(source).width(20).quality(30).blur(50).url();
}

