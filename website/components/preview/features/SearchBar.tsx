"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  provider?: string;
  variant?: "header" | "hero" | "sidebar" | "command";
  placeholder?: string;
  className?: string;
}

/**
 * Preview component showing search functionality
 * Displays in preview when search features are selected
 */
export function SearchBar({ 
  provider, 
  variant = "header", 
  placeholder = "Search...",
  className 
}: SearchBarProps) {
  const providerLabels: Record<string, { name: string; color: string }> = {
    "algolia": { name: "Algolia", color: "#003DFF" },
    "meilisearch": { name: "Meilisearch", color: "#FF5CAA" },
    "typesense": { name: "Typesense", color: "#F84C39" },
  };

  const info = provider ? providerLabels[provider] : null;

  if (variant === "hero") {
    return (
      <div className={cn("relative max-w-2xl mx-auto", className)}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full h-14 pl-12 pr-4 rounded-xl bg-background border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {info && (
            <div 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-2 py-0.5 rounded"
              style={{ backgroundColor: `${info.color}15`, color: info.color }}
            >
              Powered by {info.name}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === "command") {
    return (
      <div className={cn("relative", className)}>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-alt border border-border text-foreground-muted hover:text-foreground transition-colors">
          <Search className="h-4 w-4" />
          <span className="text-sm">{placeholder}</span>
          <kbd className="ml-4 px-1.5 py-0.5 text-[10px] rounded bg-background border border-border font-mono">
            ⌘K
          </kbd>
        </button>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={cn("relative", className)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-background-alt border border-border text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>
    );
  }

  // Header variant (default)
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-4 rounded-lg bg-background-alt border border-border text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );
}

