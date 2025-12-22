"use client";
import { useState, useEffect } from "react";

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage and system preference
    const stored = localStorage.getItem('darkMode');
    const isDark = stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  // In a real app, fetch post data based on slug
  const post = {
    title: "Getting Started with Next.js 15",
    author: "Sarah Johnson",
    authorBio: "Full-stack developer and tech writer passionate about making complex topics accessible.",
    date: "December 20, 2024",
    readTime: "5 min read",
    category: "Tutorial",
    tags: ["nextjs", "react", "tutorial", "web-development"],
    content: `
Next.js 15 brings exciting new features that make building web applications even more powerful and efficient. In this comprehensive guide, we'll explore the key improvements and how to get started.

## What's New in Next.js 15?

Next.js 15 introduces several groundbreaking features:

- **Enhanced App Router**: Improved performance and developer experience
- **Server Components by default**: Better performance out of the box
- **Improved TypeScript support**: Stronger type safety
- **Better image optimization**: Faster loading times

## Getting Started

Let's start by creating a new Next.js 15 project:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Server Components

One of the most powerful features is Server Components. They allow you to render components on the server, reducing the JavaScript sent to the client.

\`\`\`tsx
// This is a Server Component by default
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()

  return <div>{json.message}</div>
}
\`\`\`

## Best Practices

Here are some best practices when working with Next.js 15:

1. Use Server Components by default
2. Only use 'use client' when necessary
3. Leverage the new metadata API for SEO
4. Take advantage of incremental static regeneration

## Conclusion

Next.js 15 is a significant step forward in web development. Its focus on performance and developer experience makes it an excellent choice for your next project.
    `
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-gray-900 dark:text-white no-underline hover:text-gray-700 dark:hover:text-gray-300">
            ← Back to Blog
          </a>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Post Header */}
        <div className="bg-white dark:bg-gray-800 p-12 rounded-xl mb-8 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-medium">
              {post.category}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{post.readTime}</span>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight text-gray-900 dark:text-white">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xl">
              {post.author[0]}
            </div>
            <div>
              <div className="text-base font-semibold text-gray-900 dark:text-white">{post.author}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{post.date}</div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-white dark:bg-gray-800 p-12 rounded-xl mb-8 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
            {post.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('##')) {
                return (
                  <h2 key={i} className="text-3xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('```')) {
                return (
                  <pre key={i} className="bg-gray-800 dark:bg-gray-950 text-gray-50 dark:text-gray-100 p-6 rounded-lg overflow-auto text-sm my-6">
                    <code>{paragraph.replace(/```\w*\n?/g, '')}</code>
                  </pre>
                );
              }
              if (paragraph.match(/^\d\./)) {
                const items = paragraph.split('\n');
                return (
                  <ol key={i} className="my-4 pl-6 text-gray-800 dark:text-gray-200">
                    {items.map((item, j) => (
                      <li key={j} className="my-2">
                        {item.replace(/^\d\.\s/, '')}
                      </li>
                    ))}
                  </ol>
                );
              }
              if (paragraph.startsWith('-')) {
                const items = paragraph.split('\n');
                return (
                  <ul key={i} className="my-4 pl-6 text-gray-800 dark:text-gray-200">
                    {items.map((item, j) => (
                      <li key={j} className="my-2">
                        {item.replace(/^-\s/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="my-4 text-gray-800 dark:text-gray-200">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl mb-8 border border-gray-200 dark:border-gray-700 transition-colors">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            About the Author
          </h3>
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
              {post.author[0]}
            </div>
            <div>
              <div className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {post.author}
              </div>
              <p className="m-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                {post.authorBio}
              </p>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center transition-colors">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Share this article
          </h3>
          <div className="flex gap-3 justify-center">
            {['Twitter', 'LinkedIn', 'Facebook'].map(platform => (
              <button
                key={platform}
                className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
