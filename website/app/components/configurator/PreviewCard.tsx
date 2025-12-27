"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useConfiguratorStore } from "@/lib/configurator-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Terminal, ChevronDown, ChevronUp, Zap, Database, Rocket, Github } from "lucide-react";

interface PreviewCardProps {
  className?: string;
  /** Collapsed mode - just shows header and command */
  compact?: boolean;
}

/**
 * PreviewCard - Right-side panel showing NPX command and project status
 * Reference: 5DaySprint blue terminal-style card
 */
export function PreviewCard({ className, compact = false }: PreviewCardProps) {
  const {
    template,
    projectName,
    outputDir,
    integrations,
    selectedFeatures,
    completedSteps,
    toolStatus,
  } = useConfiguratorStore();

  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!compact);

  // Generate project token (mock for now)
  const projectToken = useMemo(() => {
    const hash = Math.random().toString(36).substring(2, 10);
    return `${projectName?.toLowerCase().replace(/\s+/g, "-") || "project"}-${hash}`;
  }, [projectName]);

  // Generate NPX command
  const npxCommand = useMemo(() => {
    return `npx @jrdaws/framework clone ${projectToken}`;
  }, [projectToken]);

  // Count features and integrations
  const featureCount = Object.values(selectedFeatures).flat().length;
  const integrationCount = Object.values(integrations).filter(Boolean).length;
  const completedCount = completedSteps.size;
  const totalSteps = 8;

  // Check service status
  const services = {
    github: toolStatus.github || completedSteps.has(5),
    supabase: toolStatus.supabase || completedSteps.has(7),
    vercel: toolStatus.vercel || completedSteps.has(8),
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(npxCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = npxCommand;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isReady = completedCount >= 3; // At least 3 steps done

  return (
    <div
      className={cn(
        "bg-[#0052FF] rounded-xl overflow-hidden shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Zap className="h-4 w-4" />
          <span className="font-semibold text-sm">@jrdaws/framework</span>
        </div>
        <Badge
          className={cn(
            "text-[10px] font-medium",
            isReady
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              : "bg-white/20 text-white/80 border-white/30"
          )}
          variant="outline"
        >
          <span className={cn(
            "w-1.5 h-1.5 rounded-full mr-1.5",
            isReady ? "bg-emerald-400" : "bg-white/60"
          )} />
          {isReady ? "Ready" : "Setup in progress"}
        </Badge>
      </div>

      {/* Command Box */}
      <div className="mx-3 mb-3">
        <div className="bg-white/15 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-white/70 shrink-0" />
          <code className="flex-1 text-white text-sm font-mono truncate">
            {npxCommand}
          </code>
          <Button
            size="sm"
            variant="ghost"
            onClick={copyCommand}
            className="h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expand/Collapse Toggle */}
      {compact && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-2 text-white/70 hover:text-white text-xs transition-colors border-t border-white/10"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              Show details
            </>
          )}
        </button>
      )}

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
              <span>Setup Progress</span>
              <span className="font-medium text-white">{completedCount}/{totalSteps}</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Services Status */}
          <div className="grid grid-cols-3 gap-2">
            <ServiceIndicator
              name="GitHub"
              icon={<Github className="h-3.5 w-3.5" />}
              connected={services.github}
            />
            <ServiceIndicator
              name="Supabase"
              icon={<Database className="h-3.5 w-3.5" />}
              connected={services.supabase}
            />
            <ServiceIndicator
              name="Vercel"
              icon={<Rocket className="h-3.5 w-3.5" />}
              connected={services.vercel}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <div className="text-white/60">Template</div>
              <div className="font-medium text-white capitalize">{template}</div>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <div className="text-white/60">Features</div>
              <div className="font-medium text-white">{featureCount} selected</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/15 text-white hover:bg-white/25 border-0 text-xs"
            >
              View Docs
            </Button>
            <Button
              size="sm"
              className="bg-white text-[#0052FF] hover:bg-white/90 text-xs"
              disabled={!isReady}
            >
              Generate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceIndicator({
  name,
  icon,
  connected,
}: {
  name: string;
  icon: React.ReactNode;
  connected: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 py-2 rounded-lg text-xs transition-colors",
        connected ? "bg-emerald-500/20" : "bg-white/10"
      )}
    >
      <div
        className={cn(
          "transition-colors",
          connected ? "text-emerald-400" : "text-white/50"
        )}
      >
        {icon}
      </div>
      <span className={cn(connected ? "text-emerald-300" : "text-white/60")}>
        {name}
      </span>
    </div>
  );
}

export default PreviewCard;

