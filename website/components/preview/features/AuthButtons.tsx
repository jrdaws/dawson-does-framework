"use client";

import { cn } from "@/lib/utils";

interface AuthButtonsProps {
  provider?: string;
  variant?: "header" | "hero" | "standalone";
  className?: string;
}

/**
 * Preview component showing auth buttons based on selected provider
 * Renders in preview to show users what their auth UI will look like
 */
export function AuthButtons({ provider, variant = "header", className }: AuthButtonsProps) {
  if (!provider) return null;

  const providerLabels: Record<string, { name: string; color: string; icon: string }> = {
    "supabase-auth": { name: "Supabase", color: "#3ECF8E", icon: "⚡" },
    "clerk": { name: "Clerk", color: "#6C47FF", icon: "🔐" },
    "auth0": { name: "Auth0", color: "#EB5424", icon: "🛡️" },
    "nextauth": { name: "NextAuth", color: "#000000", icon: "🔑" },
  };

  const info = providerLabels[provider] || { name: provider, color: "#6366F1", icon: "🔒" };

  if (variant === "header") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <button className="px-3 py-1.5 text-sm text-foreground-secondary hover:text-foreground transition-colors">
          Sign In
        </button>
        <button 
          className="px-4 py-1.5 text-sm rounded-lg font-medium text-white transition-colors"
          style={{ backgroundColor: info.color }}
        >
          Get Started
        </button>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <button 
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: info.color }}
        >
          {info.icon} Sign Up Free
        </button>
        <button className="px-6 py-3 rounded-lg font-semibold border border-border text-foreground hover:bg-background-alt transition-colors">
          Sign In
        </button>
      </div>
    );
  }

  // Standalone variant - full auth form preview
  return (
    <div className={cn("bg-card border border-border rounded-xl p-6 max-w-sm mx-auto", className)}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{info.icon}</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${info.color}20`, color: info.color }}>
          {info.name}
        </span>
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-background-alt rounded-lg border border-border flex items-center px-3 text-sm text-foreground-muted">
          Email
        </div>
        <div className="h-10 bg-background-alt rounded-lg border border-border flex items-center px-3 text-sm text-foreground-muted">
          Password
        </div>
        <button 
          className="w-full h-10 rounded-lg font-medium text-white transition-colors"
          style={{ backgroundColor: info.color }}
        >
          Sign In
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-foreground-muted text-center">
          Or continue with
        </p>
        <div className="flex gap-2 mt-2">
          <button className="flex-1 h-9 rounded-lg border border-border bg-background-alt hover:bg-background-alt/80 text-sm">
            Google
          </button>
          <button className="flex-1 h-9 rounded-lg border border-border bg-background-alt hover:bg-background-alt/80 text-sm">
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

