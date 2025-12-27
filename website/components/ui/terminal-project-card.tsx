"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Terminal,
  FolderOpen,
  Trash2,
  Loader2,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface TerminalProjectCardProps {
  id: string;
  name: string;
  description?: string;
  template?: string;
  features?: string[];
  status: "draft" | "active" | "archived";
  npxToken?: string;
  createdAt: string;
  updatedAt?: string;
  onOpen?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
  isDeleting?: boolean;
  className?: string;
}

/**
 * TerminalProjectCard - Blue terminal-style card for project display
 * Reference: 5DaySprint My Projects page design
 */
export function TerminalProjectCard({
  id,
  name,
  description,
  template,
  features = [],
  status,
  npxToken,
  createdAt,
  updatedAt,
  onOpen,
  onDelete,
  isDeleting = false,
  className,
}: TerminalProjectCardProps) {
  const [copiedToken, setCopiedToken] = useState(false);

  // Copy NPX command
  const handleCopyToken = async () => {
    if (!npxToken) return;
    await navigator.clipboard.writeText(`npx @jrdaws/framework clone ${npxToken}`);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isActive = status === "active";

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow",
        className
      )}
    >
      {/* Terminal Header - Blue */}
      <div className="bg-[#0052FF] p-3">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-white">
            <Zap className="h-4 w-4" />
            <span className="font-semibold text-sm">@jrdaws/framework</span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-medium border-white/30",
              isActive
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-white/20 text-white/80"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full mr-1.5",
                isActive ? "bg-emerald-400" : "bg-white/60"
              )}
            />
            {isActive ? "Active" : status === "archived" ? "Archived" : "Draft"}
          </Badge>
        </div>

        {/* Command Box */}
        {npxToken && (
          <div className="bg-white/15 rounded-lg px-3 py-2 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-white/70 shrink-0" />
            <code className="flex-1 text-white text-xs font-mono truncate">
              npx @jrdaws/framework clone {npxToken}
            </code>
            <button
              onClick={handleCopyToken}
              className="text-white/70 hover:text-white transition-colors"
            >
              {copiedToken ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-4">
        {/* Project Label */}
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Project
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">{name}</h3>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
            {description}
          </p>
        )}

        {/* Template & Features */}
        <div className="space-y-2">
          {template && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Template:</span>
              <Badge variant="outline" className="capitalize text-xs">
                {template}
              </Badge>
            </div>
          )}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 3).map((feature) => (
                <Badge
                  key={feature}
                  variant="secondary"
                  className="text-xs bg-slate-100 text-slate-700"
                >
                  {feature}
                </Badge>
              ))}
              {features.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-slate-100 text-slate-600"
                >
                  +{features.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="text-xs text-slate-400">
          {formatDate(updatedAt || createdAt)}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Button
            onClick={() => onOpen?.(id)}
            className="flex-1 bg-[#0052FF] hover:bg-[#0041CC] text-white"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Open Project
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-slate-200"
            onClick={() => onDelete?.(id, name)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TerminalProjectCard;

