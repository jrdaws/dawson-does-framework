"use client";

/**
 * CloudinaryImage Component
 * 
 * Optimized image component using Cloudinary transformations.
 */

import { CldImage } from "next-cloudinary";
import type { CldImageProps } from "next-cloudinary";

interface CloudinaryImageProps extends Omit<CldImageProps, "src"> {
  publicId: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  crop?: "fill" | "fit" | "crop" | "scale" | "thumb";
  gravity?: "auto" | "face" | "center";
  quality?: "auto" | number;
  className?: string;
}

export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  priority = false,
  crop = "fill",
  gravity = "auto",
  quality = "auto",
  className,
  ...props
}: CloudinaryImageProps) {
  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      crop={crop}
      gravity={gravity}
      quality={quality}
      className={className}
      sizes={`(max-width: 768px) 100vw, ${width}px`}
      {...props}
    />
  );
}

/**
 * Responsive CloudinaryImage with blur placeholder
 */
export function CloudinaryImageWithBlur({
  publicId,
  alt,
  width,
  height,
  className,
  ...props
}: CloudinaryImageProps) {
  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_50,q_30,e_blur:500/${publicId}`}
      className={className}
      {...props}
    />
  );
}

