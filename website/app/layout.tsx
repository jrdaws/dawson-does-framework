import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '@jrdaws/framework - Ship faster with trusted scaffolding',
  description: 'From idea to production in minutes, not days. A CLI scaffolding system with plugins, templates, and provider integrations.',
  keywords: ['framework', 'scaffolding', 'CLI', 'templates', 'nextjs', 'saas', 'typescript'],
  authors: [{ name: 'jrdaws' }],
  openGraph: {
    title: '@jrdaws/framework',
    description: 'From idea to production in minutes, not days',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
