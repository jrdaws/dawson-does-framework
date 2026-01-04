import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * POST /api/revalidate
 * Webhook endpoint for Contentful to trigger revalidation
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the secret
    const secret = request.headers.get("x-revalidate-secret");
    if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const body = await request.json();
    const { sys, fields } = body;

    // Determine what to revalidate based on content type
    const contentType = sys?.contentType?.sys?.id;

    switch (contentType) {
      case "blogPost":
        // Revalidate the blog list and the specific post
        revalidatePath("/blog");
        if (fields?.slug) {
          revalidatePath(`/blog/${fields.slug["en-US"] || fields.slug}`);
        }
        revalidateTag("blog-posts");
        break;

      case "page":
        // Revalidate the specific page
        if (fields?.slug) {
          const slug = fields.slug["en-US"] || fields.slug;
          revalidatePath(`/${slug}`);
        }
        revalidateTag("pages");
        break;

      case "author":
        // Revalidate all blog posts when author changes
        revalidateTag("blog-posts");
        revalidatePath("/blog");
        break;

      default:
        // Revalidate everything
        revalidatePath("/");
        revalidateTag("contentful");
    }

    return NextResponse.json({
      revalidated: true,
      contentType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Contentful Revalidation Error]", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}

