DESIGN QUALITY REFERENCE - Apply these standards to all generated UI.

AESTHETIC STANDARDS:
- Modern SaaS: Dark/light high-contrast, Inter/Geist fonts, 8-12px radius, soft shadows
- Distinctive: Avoid generic purple gradients, stock heroes, symmetric layouts
- Tailwind: Mobile-first, consistent spacing (4px base), proper breakpoints

COMPONENT QUALITY:
- shadcn/ui patterns: Use Radix primitives, accessible by default
- States: hover, focus, active, disabled, loading, error
- Transitions: 150-300ms, ease-out
- Touch targets: 44px minimum

COLOR RULES:
- Max 5 colors: primary, secondary, accent, background, text
- Dark mode: CSS variables, prefers-color-scheme
- Contrast: WCAG AA minimum (4.5:1 text, 3:1 UI)

TYPOGRAPHY:
- Base: 16px+, line-height 1.5-1.7
- Hierarchy: Clear H1→H2→H3, max 3 sizes per page
- Fonts: NO Arial/Times/system-ui alone. Use: Inter, Geist, Space Grotesk, or distinctive

AVOID (AI slop):
- Purple gradient on white
- "Get Started" generic CTA
- Card-grid-only layouts
- Feather icons without customization
- Stock photo heroes
- Perfectly symmetric everything

REFERENCE SITES: Linear.app, Vercel.com, Raycast.com, Stripe.com

