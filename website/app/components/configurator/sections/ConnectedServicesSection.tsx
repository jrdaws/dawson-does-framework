"use client";

import { ConnectedServices } from "../ConnectedServices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Settings, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ConnectedServicesSectionProps {
  /** Show compact view for accordion content */
  compact?: boolean;
  /** Callback when service status changes */
  onStatusChange?: (allConnected: boolean) => void;
}

export function ConnectedServicesSection({
  compact = true,
  onStatusChange,
}: ConnectedServicesSectionProps) {
  const [hasRequiredServices, setHasRequiredServices] = useState(false);

  const handleServiceChange = (serviceType: string, connected: boolean) => {
    // Track if all required services are connected
    // This is a simplified check - in production you'd track the full state
    console.log(`Service ${serviceType} ${connected ? "connected" : "disconnected"}`);
    onStatusChange?.(hasRequiredServices);
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-foreground-secondary">
          Connect your development services to enable seamless integration.
        </p>
        
        <ConnectedServices
          compact
          onServiceChange={handleServiceChange}
        />
        
        <div className="pt-2 border-t border-white/5">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-sm border-border hover:bg-background-alt"
            onClick={() => window.open("/settings/services", "_blank")}
          >
            <Settings className="h-3 w-3 mr-1.5" />
            Manage All Services
          </Button>
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Connected Services</h2>
        <p className="text-sm text-foreground-secondary">
          Connect your development services to enable OAuth integration, repository management, 
          and one-click deployment.
        </p>
      </div>
      
      <ConnectedServices
        compact={false}
        onServiceChange={handleServiceChange}
      />
      
      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
        <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-400">
          Tip
        </Badge>
        <span className="text-xs text-foreground-secondary">
          Connected services allow automatic project setup and deployment
        </span>
      </div>
    </div>
  );
}

