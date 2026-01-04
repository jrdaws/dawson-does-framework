"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, Users, Eye, MousePointer } from "lucide-react";

interface AnalyticsWidgetProps {
  provider?: string;
  variant?: "mini" | "dashboard" | "badge";
  className?: string;
}

/**
 * Preview component showing analytics dashboard indicator
 * Displays in preview when analytics features are selected
 */
export function AnalyticsWidget({ provider, variant = "mini", className }: AnalyticsWidgetProps) {
  const providerLabels: Record<string, { name: string; color: string; icon: string }> = {
    "posthog": { name: "PostHog", color: "#F54E00", icon: "🦔" },
    "plausible": { name: "Plausible", color: "#5850EC", icon: "📊" },
    "google-analytics": { name: "Google Analytics", color: "#F9AB00", icon: "📈" },
  };

  const info = provider ? providerLabels[provider] : null;

  if (variant === "badge") {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        {info ? (
          <span 
            className="text-[10px] px-2 py-0.5 rounded"
            style={{ backgroundColor: `${info.color}15`, color: info.color }}
          >
            {info.icon} {info.name}
          </span>
        ) : (
          <span className="text-[10px] px-2 py-0.5 rounded bg-foreground-muted/10 text-foreground-muted">
            📊 Analytics
          </span>
        )}
      </div>
    );
  }

  if (variant === "dashboard") {
    const stats = [
      { label: "Visitors", value: "12.5K", change: "+12%", icon: Users },
      { label: "Page Views", value: "48.2K", change: "+8%", icon: Eye },
      { label: "Click Rate", value: "3.2%", change: "+5%", icon: MousePointer },
      { label: "Growth", value: "24%", change: "+15%", icon: TrendingUp },
    ];

    return (
      <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Analytics Overview</h3>
          {info && (
            <span 
              className="text-[10px] px-2 py-0.5 rounded"
              style={{ backgroundColor: `${info.color}15`, color: info.color }}
            >
              {info.icon} {info.name}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="p-3 rounded-lg bg-background-alt">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="h-4 w-4 text-foreground-muted" />
                <span className="text-xs text-foreground-muted">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-success">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mini variant (default)
  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-lg bg-card border border-border", className)}>
      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
        <TrendingUp className="h-4 w-4 text-success" />
      </div>
      <div>
        <div className="text-sm font-medium text-foreground">+24% growth</div>
        <div className="text-xs text-foreground-muted">Last 7 days</div>
      </div>
      {info && (
        <span 
          className="ml-auto text-[9px] px-1.5 py-0.5 rounded"
          style={{ backgroundColor: `${info.color}15`, color: info.color }}
        >
          {info.icon}
        </span>
      )}
    </div>
  );
}

