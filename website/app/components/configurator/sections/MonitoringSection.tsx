"use client";

import { Check, ExternalLink, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonitoringProvider {
  id: string;
  name: string;
  description: string;
  features: string[];
  pricingNote: string;
  docsUrl: string;
  signupUrl: string;
  difficulty: "Easy" | "Medium" | "Advanced";
}

const MONITORING_PROVIDERS: MonitoringProvider[] = [
  {
    id: "sentry",
    name: "Sentry",
    description: "Industry-standard error tracking",
    features: ["Error tracking", "Performance", "Session replay", "Alerts"],
    pricingNote: "Free: 5K errors/mo, then $26/mo",
    docsUrl: "https://docs.sentry.io",
    signupUrl: "https://sentry.io/signup",
    difficulty: "Easy",
  },
  {
    id: "logrocket",
    name: "LogRocket",
    description: "Session replay and error tracking",
    features: ["Session replay", "Error tracking", "Metrics", "User insights"],
    pricingNote: "Free: 1K sessions/mo, then $99/mo",
    docsUrl: "https://docs.logrocket.com",
    signupUrl: "https://logrocket.com/signup",
    difficulty: "Easy",
  },
  {
    id: "highlight",
    name: "Highlight.io",
    description: "Open-source full-stack monitoring",
    features: ["Open source", "Session replay", "Error tracking", "Logs"],
    pricingNote: "Free: 500 sessions/mo, then $150/mo",
    docsUrl: "https://www.highlight.io/docs",
    signupUrl: "https://app.highlight.io/sign_up",
    difficulty: "Easy",
  },
  {
    id: "axiom",
    name: "Axiom",
    description: "Log management and observability",
    features: ["Unlimited data", "Fast queries", "Dashboards", "Alerts"],
    pricingNote: "Free: 500GB ingest/mo",
    docsUrl: "https://axiom.co/docs",
    signupUrl: "https://app.axiom.co",
    difficulty: "Medium",
  },
];

interface MonitoringSectionProps {
  selectedProvider?: string;
  onProviderChange: (providerId: string | undefined) => void;
}

export function MonitoringSection({
  selectedProvider,
  onProviderChange,
}: MonitoringSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-white/50">
          Choose error monitoring
        </p>
        {selectedProvider && (
          <button
            onClick={() => onProviderChange(undefined)}
            className="text-[10px] text-white/40 hover:text-white"
          >
            Skip
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {MONITORING_PROVIDERS.map((provider) => {
          const isSelected = selectedProvider === provider.id;

          return (
            <button
              key={provider.id}
              onClick={() => onProviderChange(provider.id)}
              className={cn(
                "w-full text-left p-2 rounded-md border transition-all",
                isSelected
                  ? "bg-[var(--primary)]/15 border-[var(--primary)]/40"
                  : "bg-black/20 border-white/10 hover:border-white/20"
              )}
            >
              <div className="flex items-center gap-2">
                <Bug className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  isSelected ? "text-[var(--primary)]" : "text-white/50"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "font-medium text-xs",
                      isSelected ? "text-[var(--primary)]" : "text-white/90"
                    )}>
                      {provider.name}
                    </span>
                    <span className={cn(
                      "text-[9px] px-1 py-0.5 rounded",
                      provider.difficulty === "Easy" 
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    )}>
                      {provider.difficulty}
                    </span>
                    {isSelected && (
                      <Check className="h-3 w-3 text-[var(--primary)] shrink-0 ml-auto" />
                    )}
                  </div>
                  <p className="text-[10px] text-white/40 truncate">
                    {provider.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="mt-2 pt-2 border-t border-white/10 space-y-1.5">
                  <div className="flex flex-wrap gap-1">
                    {provider.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="text-[9px] bg-white/10 text-white/60 px-1.5 py-0.5 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="text-[9px] text-white/40">{provider.pricingNote}</p>
                  <div className="flex gap-2">
                    <a
                      href={provider.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] text-[var(--primary)] hover:underline flex items-center gap-0.5"
                    >
                      Docs <ExternalLink className="h-2 w-2" />
                    </a>
                    <a
                      href={provider.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] text-[var(--primary)] hover:underline flex items-center gap-0.5"
                    >
                      Sign Up <ExternalLink className="h-2 w-2" />
                    </a>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!selectedProvider && (
        <p className="text-[9px] text-white/30 italic">
          Recommended: Add error tracking for production
        </p>
      )}
    </div>
  );
}

