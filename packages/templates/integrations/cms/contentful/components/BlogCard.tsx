import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/contentful/types";
import { Calendar } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.featuredImage
    ? `https:${post.featuredImage.fields.file.url}`
    : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
        {/* Image */}
        {imageUrl && (
          <div className="relative aspect-video">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {post.category && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
              {post.category}
            </span>
          )}

          <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
}

