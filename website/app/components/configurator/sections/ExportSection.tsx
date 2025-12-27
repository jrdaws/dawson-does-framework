"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Terminal, 
  Download, 
  Github, 
  Check, 
  Copy, 
  Loader2,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportSectionProps {
  projectName: string;
  template: string;
  featureCount: number;
  isReady: boolean;
  onExport: (method: "npx" | "zip" | "github") => void;
}

export function ExportSection({
  projectName,
  template,
  featureCount,
  isReady,
  onExport,
}: ExportSectionProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  // Generate a mock NPX command
  const npxCommand = `npx @jrdaws/framework clone ${projectName?.toLowerCase().replace(/\s+/g, "-") || "my-project"}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(npxCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async (method: "npx" | "zip" | "github") => {
    setExporting(method);
    try {
      await onExport(method);
    } finally {
      setExporting(null);
    }
  };

  if (!isReady) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Not ready to export</span>
        </div>
        <p className="text-xs text-white/50">
          Complete the required steps above before exporting your project.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Ready indicator */}
      <div className="flex items-center gap-2 text-emerald-400">
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-medium">Ready to export!</span>
      </div>

      {/* Project summary */}
      <div className="text-xs text-white/50 space-y-1">
        <div>Template: <span className="text-white/70">{template || "SaaS"}</span></div>
        <div>Features: <span className="text-white/70">{featureCount} selected</span></div>
      </div>

      {/* NPX Command */}
      <div className="bg-black/30 rounded-lg p-3 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50">Quick Start</span>
          <button
            onClick={handleCopy}
            className="text-xs text-white/50 hover:text-white flex items-center gap-1"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <code className="text-xs font-mono text-orange-400 break-all">
          {npxCommand}
        </code>
      </div>

      {/* Export options */}
      <div className="space-y-2">
        <Button
          size="sm"
          className="w-full justify-start gap-2 bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white"
          onClick={() => handleExport("npx")}
          disabled={!!exporting}
        >
          {exporting === "npx" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Terminal className="h-4 w-4" />
          )}
          Use NPX Command
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="w-full justify-start gap-2 border-white/20 text-white/80 hover:bg-white/10"
          onClick={() => handleExport("zip")}
          disabled={!!exporting}
        >
          {exporting === "zip" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download ZIP
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="w-full justify-start gap-2 border-white/20 text-white/80 hover:bg-white/10"
          onClick={() => handleExport("github")}
          disabled={!!exporting}
        >
          {exporting === "github" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Github className="h-4 w-4" />
          )}
          Create GitHub Repo
        </Button>
      </div>
    </div>
  );
}

