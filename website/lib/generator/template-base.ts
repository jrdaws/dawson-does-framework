/**
 * Template Base Loader
 * 
 * Provides base project structure for each template type.
 * Includes base UI components in every export.
 */

import { GeneratedFile, ProjectConfig } from "./types";

/**
 * Base UI components included in every export
 * These components are required by the generated app/page.tsx
 */
const BASE_UI_COMPONENTS: { path: string; content: string }[] = [
  {
    path: "components/Nav.tsx",
    content: `"use client";

import { useState } from "react";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}

interface NavProps {
  projectName?: string;
  links?: NavLink[];
  variant?: "transparent" | "solid";
}

export function Nav({
  projectName = "My Project",
  links = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  variant = "transparent",
}: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={\`fixed top-0 left-0 right-0 z-50 \${
        variant === "solid"
          ? "bg-slate-900 border-b border-slate-800"
          : "bg-slate-900/80 backdrop-blur-md border-b border-white/10"
      }\`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {projectName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-white font-semibold text-lg">{projectName}</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Log in
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
              Sign Up
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-slate-300 hover:text-white transition-colors text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <Link href="/login" className="block text-slate-300 hover:text-white transition-colors text-sm font-medium py-2">
                Log in
              </Link>
              <Link href="/signup" className="block w-full text-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
`,
  },
  {
    path: "components/Hero.tsx",
    content: `"use client";

import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaSecondaryText?: string;
  ctaSecondaryHref?: string;
}

export function Hero({
  title = "Build Something Amazing",
  subtitle = "The modern framework for building production-ready applications.",
  ctaText = "Get Started",
  ctaHref = "/signup",
  ctaSecondaryText = "Learn More",
  ctaSecondaryHref = "#features",
}: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-orange-400 text-sm font-medium">Now Available</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ctaHref}
            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/25"
          >
            {ctaText}
          </Link>
          <Link
            href={ctaSecondaryHref}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-lg font-semibold transition-colors"
          >
            {ctaSecondaryText}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
`,
  },
  {
    path: "components/FeatureCards.tsx",
    content: `"use client";

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureCardsProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
  columns?: 2 | 3 | 4;
}

const DEFAULT_FEATURES: Feature[] = [
  { title: "Lightning Fast", description: "Built for performance with optimized builds.", icon: "⚡" },
  { title: "Fully Customizable", description: "Tailored to your needs with flexible options.", icon: "🎨" },
  { title: "Secure by Default", description: "Enterprise-grade security built-in.", icon: "🔒" },
  { title: "AI-Powered", description: "Intelligent features that adapt to you.", icon: "🤖" },
  { title: "24/7 Support", description: "Round-the-clock assistance when you need it.", icon: "💬" },
  { title: "Scale Infinitely", description: "From startup to enterprise, grow without limits.", icon: "📈" },
];

export function FeatureCards({
  title = "Why Choose Us",
  subtitle = "Everything you need to build amazing products",
  features = DEFAULT_FEATURES,
  columns = 3,
}: FeatureCardsProps) {
  const gridCols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4" };

  return (
    <section id="features" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className={\`grid grid-cols-1 \${gridCols[columns]} gap-6\`}>
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-orange-500/30 hover:bg-slate-800 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <span className="text-2xl">{feature.icon || "✨"}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureCards;
`,
  },
  {
    path: "components/PricingTable.tsx",
    content: `"use client";

import { useState } from "react";
import Link from "next/link";

interface Plan {
  name: string;
  price: number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

interface PricingTableProps {
  title?: string;
  subtitle?: string;
  plans?: Plan[];
  showToggle?: boolean;
}

const DEFAULT_PLANS: Plan[] = [
  { name: "Starter", price: 0, description: "Perfect for getting started", features: ["Up to 3 projects", "Basic analytics", "Community support"], ctaText: "Get Started Free", ctaHref: "/signup" },
  { name: "Pro", price: 29, yearlyPrice: 24, description: "For growing teams", features: ["Unlimited projects", "Advanced analytics", "Priority support", "Custom domains"], highlighted: true, ctaText: "Start Free Trial", ctaHref: "/signup?plan=pro" },
  { name: "Enterprise", price: 99, yearlyPrice: 79, description: "For large organizations", features: ["Everything in Pro", "SSO integration", "Dedicated support", "SLA guarantee"], ctaText: "Contact Sales", ctaHref: "/contact" },
];

export function PricingTable({ title = "Simple Pricing", subtitle = "Choose the plan that works for you", plans = DEFAULT_PLANS, showToggle = true }: PricingTableProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">{subtitle}</p>

          {showToggle && (
            <div className="inline-flex items-center gap-4 p-1.5 bg-slate-800 rounded-xl">
              <button onClick={() => setIsYearly(false)} className={\`px-4 py-2 rounded-lg text-sm font-medium transition-colors \${!isYearly ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"}\`}>Monthly</button>
              <button onClick={() => setIsYearly(true)} className={\`px-4 py-2 rounded-lg text-sm font-medium transition-colors \${isYearly ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"}\`}>Yearly <span className="ml-2 text-emerald-400 text-xs">Save 20%</span></button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={\`relative rounded-2xl p-8 transition-all \${plan.highlighted ? "bg-gradient-to-b from-orange-500/20 to-slate-900 border-2 border-orange-500 scale-105" : "bg-slate-800/50 border border-slate-700/50"}\`}>
              {plan.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="px-4 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">Most Popular</span></div>}
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">\${isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.ctaHref || "/signup"} className={\`block w-full py-3 rounded-xl text-center font-medium transition-colors \${plan.highlighted ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-slate-700 hover:bg-slate-600 text-white"}\`}>{plan.ctaText || "Get Started"}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingTable;
`,
  },
  {
    path: "components/Testimonials.tsx",
    content: `"use client";

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { quote: "This has completely transformed how we build products. The speed and quality are unmatched.", author: "Sarah Chen", role: "CTO", company: "TechStart" },
  { quote: "We shipped our MVP in 2 weeks instead of 2 months. Game-changing for startups.", author: "Marcus Johnson", role: "Founder", company: "LaunchPad" },
  { quote: "The best developer experience I've ever had. Our team productivity increased by 3x.", author: "Emily Rodriguez", role: "Lead Developer", company: "InnovateCo" },
];

export function Testimonials({ title = "What Our Customers Say", subtitle = "Don't just take our word for it", testimonials = DEFAULT_TESTIMONIALS }: TestimonialsProps) {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <svg className="w-8 h-8 text-orange-500/50 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-slate-300 mb-6 leading-relaxed italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{testimonial.author.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{testimonial.author}</p>
                  {(testimonial.role || testimonial.company) && <p className="text-slate-400 text-xs">{testimonial.role}{testimonial.role && testimonial.company && " at "}{testimonial.company}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
`,
  },
  {
    path: "components/FAQ.tsx",
    content: `"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
}

const DEFAULT_FAQ: FAQItem[] = [
  { question: "How do I get started?", answer: "Simply sign up for a free account, choose a template, and start building. Our intuitive interface guides you through every step." },
  { question: "Can I cancel my subscription anytime?", answer: "Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees." },
  { question: "Do you offer a free trial?", answer: "Yes! All paid plans come with a 14-day free trial. No credit card required." },
  { question: "What kind of support do you offer?", answer: "We offer email support for all plans, priority support for Pro users, and dedicated account managers for Enterprise." },
];

export function FAQ({ title = "Frequently Asked Questions", subtitle = "Everything you need to know", items = DEFAULT_FAQ }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-slate-400">{subtitle}</p>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left" aria-expanded={openIndex === index}>
                <span className="text-white font-medium pr-4">{item.question}</span>
                <svg className={\`w-5 h-5 text-slate-400 transition-transform \${openIndex === index ? "rotate-180" : ""}\`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && <div className="px-6 pb-6"><p className="text-slate-400 leading-relaxed">{item.answer}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
`,
  },
  {
    path: "components/CTA.tsx",
    content: `"use client";

import Link from "next/link";

interface CTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  variant?: "gradient" | "solid";
}

export function CTA({ title = "Ready to Get Started?", subtitle = "Join thousands of developers building amazing products", buttonText = "Start Building Free", buttonHref = "/signup", variant = "gradient" }: CTAProps) {
  return (
    <section className={\`py-24 \${variant === "gradient" ? "bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500" : "bg-orange-500"}\`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <Link href={buttonHref} className="inline-block px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-lg font-semibold transition-all">
          {buttonText}
        </Link>
        <div className="mt-12 flex items-center justify-center gap-8 text-white/60 text-sm">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Free forever plan
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            No credit card required
          </span>
        </div>
      </div>
    </section>
  );
}

export default CTA;
`,
  },
  {
    path: "components/Footer.tsx",
    content: `"use client";

import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  projectName?: string;
  description?: string;
  sections?: FooterSection[];
}

const DEFAULT_SECTIONS: FooterSection[] = [
  { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }] },
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Blog", href: "/blog" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
];

export function Footer({ projectName = "My Project", description = "Building the future of web development.", sections = DEFAULT_SECTIONS }: FooterProps) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{projectName.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-white font-semibold text-lg">{projectName}</span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">{description}</p>
          </div>
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}><Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="py-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} {projectName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
`,
  },
];

interface TemplateDefinition {
  name: string;
  description: string;
  baseFiles: {
    path: string;
    content: string;
  }[];
}

const TEMPLATE_BASES: Record<string, TemplateDefinition> = {
  saas: {
    name: "SaaS Application",
    description: "Software as a service with pricing and features",
    baseFiles: [
      {
        path: "app/page.tsx",
        content: `import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { FeatureCards } from "@/components/FeatureCards";
import { PricingTable } from "@/components/PricingTable";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <Nav projectName="{{projectName}}" />
      <Hero
        title="Build Something Amazing"
        subtitle="Your next-generation solution for building amazing products with AI-assisted development."
        ctaText="Get Started Free"
        ctaHref="/signup"
        ctaSecondaryText="View Pricing"
        ctaSecondaryHref="#pricing"
      />
      <FeatureCards />
      <PricingTable />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer projectName="{{projectName}}" />
    </main>
  );
}
`,
      },
      {
        path: "app/layout.tsx",
        content: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "{{projectName}}",
  description: "Built with Dawson-Does Framework",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
`,
      },
      {
        path: "app/globals.css",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: {{primaryColor}};
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: {{primaryColor}};
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
`,
      },
      {
        path: "app/dashboard/page.tsx",
        content: `export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-xl">
          <p className="text-muted-foreground text-sm">Total Users</p>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="p-6 border rounded-xl">
          <p className="text-muted-foreground text-sm">Revenue</p>
          <p className="text-3xl font-bold">$12,345</p>
        </div>
        <div className="p-6 border rounded-xl">
          <p className="text-muted-foreground text-sm">Active Now</p>
          <p className="text-3xl font-bold">42</p>
        </div>
      </div>
    </main>
  );
}
`,
      },
      {
        path: "app/pricing/page.tsx",
        content: `export default function PricingPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Simple Pricing</h1>
        <p className="text-muted-foreground mb-12">
          Choose the plan that works for you
        </p>
        <p className="text-muted-foreground">
          Pricing component will be rendered here when Stripe is configured.
        </p>
      </div>
    </main>
  );
}
`,
      },
    ],
  },
  ecommerce: {
    name: "E-commerce",
    description: "Online store with products and checkout",
    baseFiles: [
      {
        path: "app/page.tsx",
        content: `import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { FeatureCards } from "@/components/FeatureCards";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <Nav projectName="{{projectName}}" />
      <Hero
        title="Shop {{projectName}}"
        subtitle="Discover our curated collection of products. Quality meets affordability."
        ctaText="Shop Now"
        ctaHref="/products"
        ctaSecondaryText="View Collections"
        ctaSecondaryHref="#features"
      />
      <FeatureCards
        title="Why Shop With Us"
        features={[
          { title: "Free Shipping", description: "On all orders over $50", icon: "🚚" },
          { title: "Easy Returns", description: "30-day hassle-free returns", icon: "↩️" },
          { title: "Secure Payment", description: "Your data is always safe", icon: "🔒" },
          { title: "24/7 Support", description: "We're here to help", icon: "💬" },
        ]}
        columns={4}
      />
      <Testimonials title="Happy Customers" />
      <FAQ />
      <CTA
        title="Ready to Shop?"
        subtitle="Join thousands of happy customers"
        buttonText="Browse Products"
        buttonHref="/products"
      />
      <Footer projectName="{{projectName}}" />
    </main>
  );
}
`,
      },
      {
        path: "app/layout.tsx",
        content: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "{{projectName}}",
  description: "Your online store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
`,
      },
    ],
  },
};

/**
 * Get base template files for a template type
 * Includes all base UI components that are required by app/page.tsx
 */
export async function getTemplateBase(
  templateId: string,
  config: ProjectConfig
): Promise<GeneratedFile[]> {
  const template = TEMPLATE_BASES[templateId] || TEMPLATE_BASES.saas;

  // Start with base UI components (required for all exports)
  const baseComponentFiles: GeneratedFile[] = BASE_UI_COMPONENTS.map((file) => ({
    path: file.path,
    content: file.content,
    overwrite: true,
  }));

  // Add template-specific files
  const templateFiles: GeneratedFile[] = template.baseFiles.map((file) => ({
    path: file.path,
    content: file.content,
    overwrite: true,
  }));

  return [...baseComponentFiles, ...templateFiles];
}

/**
 * Get available template IDs
 */
export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATE_BASES);
}

