# @jrdaws/framework Landing Page

A distinctive terminal-aesthetic landing page for the @jrdaws/framework CLI tool.

## Design

**Aesthetic**: Terminal/Hacker
- Dark theme with terminal green (#00ff41) on black (#0a0e14)
- Monospace fonts (JetBrains Mono) for code
- Display font (Space Grotesk) for headings
- Scanline effect and subtle CRT aesthetics
- Glowing text effects on hover
- Animated terminal in hero section

## Features

- ✅ Hero with animated terminal typing effect
- ✅ 6-card feature grid
- ✅ Beginner/Advanced toggle demo section
- ✅ Before/After code comparison
- ✅ Testimonials section
- ✅ Comprehensive footer
- ✅ Fully responsive
- ✅ Static export ready
- ✅ WCAG AA accessible

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Build

```bash
# Build static export
npm run build

# Output in /out directory
```

## Deploy

The site is configured for static export and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy --prod --dir=out
```

## Structure

```
website/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Landing page component
│   └── globals.css     # Terminal aesthetic styles
├── public/             # Static assets
├── next.config.js      # Next.js config (static export)
├── tailwind.config.js  # Terminal theme configuration
└── package.json
```

## Customization

### Colors

Edit `tailwind.config.js` to change the terminal color scheme:

```js
colors: {
  terminal: {
    bg: '#0a0e14',      // Background
    text: '#00ff41',    // Primary text (green)
    dim: '#008f11',     // Dimmed text
    accent: '#00d9ff',  // Accent (cyan)
    error: '#ff0040',   // Error red
    warning: '#ffaa00', // Warning amber
  }
}
```

### Fonts

Currently using:
- **Code**: JetBrains Mono
- **Display**: Space Grotesk

Change in `app/globals.css` import.

## Performance

Build output:
- Main page: ~4.3 kB
- First Load JS: ~106 kB
- All static, no server required

## License

MIT
