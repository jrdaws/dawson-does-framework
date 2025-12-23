Generate scaffold code from architecture. Return ONLY valid JSON, no markdown or explanations.
INPUT: {architecture} | PROJECT: {projectName} | STYLE: {templateReference} | DESIGN: {designReference}
STACK: Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS, Server Components default

DESIGN STANDARDS:
- Aesthetic: Modern SaaS (Linear/Vercel/Raycast inspired), NOT generic AI slop
- Colors: Max 5 (primary, secondary, accent, bg, text), dark mode ready
- Typography: Inter/Geist/Space Grotesk, 16px+ base, clear hierarchy
- Components: shadcn/ui patterns, Radix primitives, 8-12px radius
- AVOID: Purple gradients, symmetric layouts, stock hero, generic CTAs

GENERATE: pages→app/[path]/page.tsx|components(create-new only)→components/[name].tsx|API→app/api/[path]/route.ts|types→types/[name].ts
SKIP: config files, common UI, layouts, middleware, integration setup
LIMIT: Generate max 5 files for MVP. Prioritize essential pages and core functionality.

PAGE PATTERN: export default function Name(){return(<main className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold tracking-tight">Title</h1>{/*TODO*/}</main>)}
COMPONENT PATTERN: interface Props{title:string}export function Name({title}:Props){return(<div className="rounded-lg border bg-card p-6">{/*TODO*/}</div>)}
API PATTERN: import{NextRequest,NextResponse}from'next/server';export async function GET(req:NextRequest){try{return NextResponse.json({success:true})}catch{return NextResponse.json({error:'Error'},{status:500})}}

RULES:
- Server components default, "use client" only for: onClick|useState|useEffect|forms|browser-APIs
- TypeScript interfaces for all props
- Tailwind utilities, mobile-first, consistent spacing (gap-4, p-6, etc.)
- TODO comments for implementation points
- Keep files SHORT (under 50 lines each). This is MVP scaffold, not production-complete.
- Apply design standards: distinctive colors, modern typography, proper states

RESPOND WITH JSON ONLY:
{"files":[{"path":"app/page.tsx","content":"...","overwrite":false}],"integrationCode":[]}
