"use client";

import { cn } from "@/lib/utils";

interface IntegrationBadgeProps {
  category: string;
  provider?: string;
  variant?: "pill" | "chip" | "icon";
  className?: string;
}

// Provider metadata for all integration categories
const PROVIDER_INFO: Record<string, Record<string, { name: string; color: string; icon: string }>> = {
  ai: {
    "openai": { name: "OpenAI", color: "#00A67E", icon: "🤖" },
    "anthropic": { name: "Anthropic", color: "#D97757", icon: "🧠" },
    "google": { name: "Google AI", color: "#4285F4", icon: "✨" },
  },
  payments: {
    "stripe": { name: "Stripe", color: "#635BFF", icon: "💳" },
    "paddle": { name: "Paddle", color: "#2A2A2A", icon: "🏓" },
    "lemonsqueezy": { name: "LemonSqueezy", color: "#FFC233", icon: "🍋" },
  },
  email: {
    "resend": { name: "Resend", color: "#000000", icon: "📧" },
    "sendgrid": { name: "SendGrid", color: "#1A82E2", icon: "✉️" },
    "postmark": { name: "Postmark", color: "#FFDE00", icon: "📮" },
  },
  analytics: {
    "posthog": { name: "PostHog", color: "#F54E00", icon: "🦔" },
    "plausible": { name: "Plausible", color: "#5850EC", icon: "📊" },
    "google-analytics": { name: "GA4", color: "#F9AB00", icon: "📈" },
  },
  auth: {
    "supabase-auth": { name: "Supabase", color: "#3ECF8E", icon: "⚡" },
    "clerk": { name: "Clerk", color: "#6C47FF", icon: "🔐" },
    "auth0": { name: "Auth0", color: "#EB5424", icon: "🛡️" },
    "nextauth": { name: "NextAuth", color: "#000000", icon: "🔑" },
  },
  storage: {
    "uploadthing": { name: "UploadThing", color: "#FF0000", icon: "📤" },
    "cloudflare-r2": { name: "R2", color: "#F48120", icon: "☁️" },
    "supabase-storage": { name: "Supabase", color: "#3ECF8E", icon: "💾" },
    "aws-s3": { name: "S3", color: "#FF9900", icon: "🪣" },
  },
  search: {
    "algolia": { name: "Algolia", color: "#003DFF", icon: "🔍" },
    "meilisearch": { name: "Meilisearch", color: "#FF5CAA", icon: "⚡" },
    "typesense": { name: "Typesense", color: "#F84C39", icon: "🔎" },
  },
  cms: {
    "sanity": { name: "Sanity", color: "#F03E2F", icon: "📝" },
    "contentful": { name: "Contentful", color: "#2478CC", icon: "📄" },
    "payload": { name: "Payload", color: "#000000", icon: "🎯" },
    "strapi": { name: "Strapi", color: "#4945FF", icon: "📦" },
  },
  monitoring: {
    "sentry": { name: "Sentry", color: "#362D59", icon: "🐛" },
    "logrocket": { name: "LogRocket", color: "#764ABC", icon: "🎬" },
    "highlight": { name: "Highlight", color: "#6C4FF7", icon: "✨" },
    "axiom": { name: "Axiom", color: "#0066FF", icon: "📋" },
  },
  imageOpt: {
    "cloudinary": { name: "Cloudinary", color: "#3448C5", icon: "🖼️" },
    "imagekit": { name: "ImageKit", color: "#007AFF", icon: "🎨" },
    "vercel-image": { name: "Vercel", color: "#000000", icon: "▲" },
    "imgix": { name: "imgix", color: "#FF3366", icon: "📷" },
  },
  backgroundJobs: {
    "inngest": { name: "Inngest", color: "#5D46F4", icon: "⚡" },
    "trigger": { name: "Trigger.dev", color: "#3B82F6", icon: "🔄" },
    "upstash-qstash": { name: "QStash", color: "#00E9A3", icon: "📨" },
    "bullmq": { name: "BullMQ", color: "#E11D48", icon: "🐂" },
  },
  notifications: {
    "novu": { name: "Novu", color: "#FF487F", icon: "🔔" },
    "onesignal": { name: "OneSignal", color: "#E54B4D", icon: "📣" },
    "knock": { name: "Knock", color: "#7C3AED", icon: "🚪" },
    "firebase-fcm": { name: "FCM", color: "#FFCA28", icon: "🔥" },
  },
  featureFlags: {
    "posthog-flags": { name: "PostHog", color: "#F54E00", icon: "🚩" },
    "launchdarkly": { name: "LaunchDarkly", color: "#3DD6F5", icon: "🚀" },
    "flagsmith": { name: "Flagsmith", color: "#12B5CB", icon: "🏴" },
    "vercel-flags": { name: "Vercel", color: "#000000", icon: "▲" },
  },
};

/**
 * Universal integration badge component
 * Shows the selected provider for any integration category
 */
export function IntegrationBadge({ category, provider, variant = "pill", className }: IntegrationBadgeProps) {
  if (!provider) return null;

  const categoryProviders = PROVIDER_INFO[category] || {};
  const info = categoryProviders[provider] || { name: provider, color: "#6366F1", icon: "⚙️" };

  if (variant === "icon") {
    return (
      <span 
        className={cn("inline-flex items-center justify-center w-6 h-6 rounded text-xs", className)}
        style={{ backgroundColor: `${info.color}20`, color: info.color }}
        title={`${info.name} (${category})`}
      >
        {info.icon}
      </span>
    );
  }

  if (variant === "chip") {
    return (
      <span 
        className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium", className)}
        style={{ backgroundColor: `${info.color}15`, color: info.color }}
      >
        {info.icon} {info.name}
      </span>
    );
  }

  // Pill variant (default)
  return (
    <span 
      className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", className)}
      style={{ backgroundColor: `${info.color}15`, color: info.color }}
    >
      <span>{info.icon}</span>
      <span>{info.name}</span>
    </span>
  );
}

/**
 * Stack of multiple integration badges
 */
export function IntegrationStack({ 
  integrations, 
  maxShow = 4,
  className 
}: { 
  integrations: Record<string, string>;
  maxShow?: number;
  className?: string;
}) {
  const entries = Object.entries(integrations).filter(([_, v]) => v);
  const visible = entries.slice(0, maxShow);
  const remaining = entries.length - maxShow;

  if (visible.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      {visible.map(([category, provider]) => (
        <IntegrationBadge 
          key={category} 
          category={category} 
          provider={provider} 
          variant="chip" 
        />
      ))}
      {remaining > 0 && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground-muted/10 text-foreground-muted">
          +{remaining} more
        </span>
      )}
    </div>
  );
}

