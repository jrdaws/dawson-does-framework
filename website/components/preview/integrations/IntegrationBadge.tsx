"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Provider brand colors
export const PROVIDER_COLORS: Record<string, string> = {
  // Auth
  supabase: "#3ECF8E",
  clerk: "#6C47FF",
  auth0: "#EB5424",
  nextauth: "#000000",
  
  // Payments
  stripe: "#635BFF",
  paddle: "#FFDD00",
  lemonsqueezy: "#FFC233",
  
  // Email
  resend: "#000000",
  sendgrid: "#1A82E2",
  postmark: "#FFDE00",
  
  // Analytics
  posthog: "#F9BD2B",
  plausible: "#5850EC",
  "google-analytics": "#E37400",
  
  // AI
  openai: "#10A37F",
  anthropic: "#D4A27F",
  google: "#4285F4",
  
  // Storage
  uploadthing: "#F43F5E",
  cloudinary: "#3448C5",
  r2: "#F38020",
  s3: "#FF9900",
  
  // CMS
  sanity: "#F03E2F",
  contentful: "#0073E6",
  payload: "#000000",
  strapi: "#8E75FF",
  
  // Search
  algolia: "#5468FF",
  meilisearch: "#FF5CAA",
  typesense: "#5799F7",
  
  // Monitoring
  sentry: "#362D59",
  logrocket: "#764ABC",
  highlight: "#6C6CFF",
  axiom: "#FFFFFF",
  
  // Background Jobs
  inngest: "#6366F1",
  "trigger.dev": "#0EA5E9",
  qstash: "#F43F5E",
  bullmq: "#E53935",
  
  // Notifications
  novu: "#DD2476",
  onesignal: "#E54B4D",
  knock: "#6366F1",
  firebase: "#FFCA28",
  
  // Feature Flags
  launchdarkly: "#3DD6F5",
  flagsmith: "#6633FF",
  vercel: "#000000",
};

// Provider display names
export const PROVIDER_NAMES: Record<string, string> = {
  supabase: "Supabase",
  clerk: "Clerk",
  auth0: "Auth0",
  nextauth: "NextAuth.js",
  stripe: "Stripe",
  paddle: "Paddle",
  lemonsqueezy: "LemonSqueezy",
  resend: "Resend",
  sendgrid: "SendGrid",
  postmark: "Postmark",
  posthog: "PostHog",
  plausible: "Plausible",
  "google-analytics": "Google Analytics",
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google AI",
  uploadthing: "UploadThing",
  cloudinary: "Cloudinary",
  r2: "Cloudflare R2",
  s3: "AWS S3",
  sanity: "Sanity",
  contentful: "Contentful",
  payload: "Payload CMS",
  strapi: "Strapi",
  algolia: "Algolia",
  meilisearch: "Meilisearch",
  typesense: "Typesense",
  sentry: "Sentry",
  logrocket: "LogRocket",
  highlight: "Highlight.io",
  axiom: "Axiom",
  inngest: "Inngest",
  "trigger.dev": "Trigger.dev",
  qstash: "Upstash QStash",
  bullmq: "BullMQ",
  novu: "Novu",
  onesignal: "OneSignal",
  knock: "Knock",
  firebase: "Firebase FCM",
  launchdarkly: "LaunchDarkly",
  flagsmith: "Flagsmith",
  vercel: "Vercel",
  "posthog-flags": "PostHog Flags",
};

// Category icons (using simple text/emoji for now)
export const CATEGORY_ICONS: Record<string, string> = {
  auth: "🔐",
  payments: "💳",
  email: "📧",
  analytics: "📊",
  ai: "🤖",
  storage: "📁",
  cms: "📝",
  search: "🔍",
  monitoring: "🔔",
  backgroundJobs: "⚙️",
  notifications: "🔔",
  featureFlags: "🚩",
  imageOpt: "🖼️",
};

interface IntegrationBadgeProps {
  provider: string;
  category?: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export function IntegrationBadge({ 
  provider, 
  category,
  size = "sm", 
  showTooltip = true,
  className = "" 
}: IntegrationBadgeProps) {
  const color = PROVIDER_COLORS[provider] || "#6B7280";
  const name = PROVIDER_NAMES[provider] || provider;
  const icon = category ? CATEGORY_ICONS[category] : null;
  
  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  const badge = (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-md transition-transform hover:scale-110 ${className}`}
      style={{ 
        backgroundColor: color,
        color: ["#FFDD00", "#FFC233", "#FFDE00", "#FFCA28", "#F9BD2B", "#FFFFFF"].includes(color) ? "#000" : "#FFF"
      }}
    >
      {icon || provider.charAt(0).toUpperCase()}
    </div>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

