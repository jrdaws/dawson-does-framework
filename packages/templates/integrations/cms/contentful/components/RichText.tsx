"use client";

import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS, Document } from "@contentful/rich-text-types";
import Image from "next/image";
import Link from "next/link";

interface RichTextProps {
  content: Document;
}

const options: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong className="font-semibold">{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
    [MARKS.CODE]: (text) => (
      <code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">
        {text}
      </code>
    ),
  },

  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),

    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),

    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
    ),

    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
    ),

    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),

    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),

    [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,

    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),

    [BLOCKS.HR]: () => <hr className="my-8 border-border" />,

    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { file, title } = node.data.target.fields;
      const url = file.url.startsWith("//") ? `https:${file.url}` : file.url;

      if (file.contentType.startsWith("image/")) {
        return (
          <figure className="my-8">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={title || ""}
                fill
                className="object-cover"
              />
            </div>
            {title && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2">
                {title}
              </figcaption>
            )}
          </figure>
        );
      }

      return null;
    },

    [INLINES.HYPERLINK]: (node, children) => {
      const isExternal = !node.data.uri.startsWith("/");
      return (
        <Link
          href={node.data.uri}
          className="text-primary hover:underline"
          {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {children}
        </Link>
      );
    },
  },
};

export function RichText({ content }: RichTextProps) {
  return <>{documentToReactComponents(content, options)}</>;
}

