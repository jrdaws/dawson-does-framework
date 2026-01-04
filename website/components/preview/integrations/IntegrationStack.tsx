"use client";

import { IntegrationBadge, PROVIDER_NAMES } from "./IntegrationBadge";

interface IntegrationStackProps {
  integrations: Record<string, string>;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxVisible?: number;
  className?: string;
}

export function IntegrationStack({ 
  integrations, 
  position = "top-right",
  maxVisible = 5,
  className = "" 
}: IntegrationStackProps) {
  // Filter out empty integrations
  const activeIntegrations = Object.entries(integrations)
    .filter(([, provider]) => provider && provider.trim() !== "")
    .map(([category, provider]) => ({ category, provider }));

  if (activeIntegrations.length === 0) return null;

  const visibleIntegrations = activeIntegrations.slice(0, maxVisible);
  const hiddenCount = activeIntegrations.length - maxVisible;

  const positionClasses = {
    "top-right": "top-2 right-2",
    "top-left": "top-2 left-2",
    "bottom-right": "bottom-2 right-2",
    "bottom-left": "bottom-2 left-2",
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} flex items-center gap-1 z-10 ${className}`}
    >
      <div className="flex -space-x-2">
        {visibleIntegrations.map(({ category, provider }) => (
          <IntegrationBadge
            key={category}
            provider={provider}
            category={category}
            size="sm"
            className="ring-2 ring-background"
          />
        ))}
        {hiddenCount > 0 && (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground ring-2 ring-background">
            +{hiddenCount}
          </div>
        )}
      </div>
    </div>
  );
}

// Also export a horizontal list variant
export function IntegrationList({ 
  integrations,
  className = "" 
}: { 
  integrations: Record<string, string>;
  className?: string;
}) {
  const activeIntegrations = Object.entries(integrations)
    .filter(([, provider]) => provider && provider.trim() !== "")
    .map(([category, provider]) => ({ category, provider }));

  if (activeIntegrations.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {activeIntegrations.map(({ category, provider }) => (
        <div 
          key={category}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 text-xs"
        >
          <IntegrationBadge
            provider={provider}
            category={category}
            size="sm"
            showTooltip={false}
          />
          <span className="text-muted-foreground">
            {PROVIDER_NAMES[provider] || provider}
          </span>
        </div>
      ))}
    </div>
  );
}

