"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, X, ExternalLink, Sparkles, Loader2, Check, Globe, FileText, Lightbulb, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ResearchStats {
  sitesAnalyzed: number;
  pagesExtracted: number;
  featuresIdentified: number;
  designPatterns: number;
  recommendedTemplate: string;
  suggestedFeatures: number;
  integrationsFound: number;
}

interface ResearchSectionProps {
  domain: string;
  onDomainChange: (domain: string) => void;
  vision?: string;
  onVisionChange?: (vision: string) => void;
  inspirationUrls: string[];
  onInspirationUrlsChange: (urls: string[]) => void;
  onStartResearch?: () => void;
  onShowMe?: () => void;
  onResetResearch?: () => void;
  isLoading?: boolean;
  isComplete?: boolean;
  stats?: ResearchStats;
}

export function ResearchSection({
  domain,
  onDomainChange,
  vision = "",
  onVisionChange,
  inspirationUrls,
  onInspirationUrlsChange,
  onStartResearch,
  onShowMe,
  onResetResearch,
  isLoading = false,
  isComplete = false,
  stats,
}: ResearchSectionProps) {
  const [showInspiration, setShowInspiration] = useState(inspirationUrls.length > 0);
  const [showVision, setShowVision] = useState(!!vision);
  const [newUrl, setNewUrl] = useState("");

  const addUrl = () => {
    if (newUrl.trim() && !inspirationUrls.includes(newUrl.trim())) {
      onInspirationUrlsChange([...inspirationUrls, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const removeUrl = (url: string) => {
    onInspirationUrlsChange(inspirationUrls.filter((u) => u !== url));
  };

  // Show completion summary if research is done
  if (isComplete && stats) {
    return (
      <div className="space-y-2.5">
        {/* Success Banner */}
        <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400">Research Complete</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 text-[10px] px-1.5 text-white/40 hover:text-white"
              onClick={onResetResearch}
            >
              <RotateCcw className="h-2.5 w-2.5 mr-0.5" />
              Redo
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="flex items-center gap-1.5 text-white/60">
              <Globe className="h-3 w-3 text-emerald-400" />
              <span>{stats.sitesAnalyzed} sites analyzed</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60">
              <FileText className="h-3 w-3 text-emerald-400" />
              <span>{stats.pagesExtracted} pages</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60">
              <Lightbulb className="h-3 w-3 text-[var(--primary)]" />
              <span>{stats.featuresIdentified} features found</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60">
              <Sparkles className="h-3 w-3 text-[var(--primary)]" />
              <span>{stats.suggestedFeatures} recommended</span>
            </div>
          </div>
        </div>

        {/* Domain Summary */}
        <div className="text-[10px] text-white/50 space-y-1">
          <div><span className="text-white/70">Domain:</span> {domain}</div>
          {vision && <div><span className="text-white/70">Vision:</span> {vision.slice(0, 50)}...</div>}
          <div><span className="text-white/70">Template:</span> <span className="text-emerald-400 capitalize">{stats.recommendedTemplate}</span></div>
        </div>

        {/* View Results */}
        <Button
          size="sm"
          variant="outline"
          className="w-full h-7 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
          onClick={onShowMe}
        >
          View Full Results
          <ExternalLink className="h-2.5 w-2.5 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* Domain Input - Compact */}
      <div className="space-y-1">
        <Label htmlFor="domain" className="text-xs font-medium text-white/70">
          Describe your niche *
        </Label>
        <Input
          id="domain"
          value={domain}
          onChange={(e) => onDomainChange(e.target.value)}
          placeholder="e.g., Pet food subscription, HR software..."
          className="h-8 text-xs bg-black/30 border-white/15 text-white placeholder:text-white/40"
          disabled={isLoading}
        />
      </div>

      {/* Vision Toggle */}
      <div className="flex items-center justify-between py-0.5">
        <Label htmlFor="vision-toggle" className="text-[10px] text-white/50 cursor-pointer">
          Add detailed vision
        </Label>
        <Switch
          id="vision-toggle"
          checked={showVision}
          onCheckedChange={setShowVision}
          className="scale-[0.6]"
          disabled={isLoading}
        />
      </div>

      {/* Vision Input */}
      {showVision && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <Textarea
            value={vision}
            onChange={(e) => onVisionChange?.(e.target.value)}
            placeholder="Describe features, design style, user flows..."
            className="min-h-[60px] text-xs bg-black/30 border-white/15 text-white placeholder:text-white/40 resize-none"
            disabled={isLoading}
          />
        </div>
      )}

      {/* Inspiration Toggle */}
      <div className="flex items-center justify-between py-0.5">
        <div className="flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5 text-white/40" />
          <Label htmlFor="inspiration-toggle" className="text-[10px] text-white/50 cursor-pointer">
            Add inspiration URLs
          </Label>
        </div>
        <Switch
          id="inspiration-toggle"
          checked={showInspiration}
          onCheckedChange={setShowInspiration}
          className="scale-[0.6]"
          disabled={isLoading}
        />
      </div>

      {/* Inspiration URLs - Compact */}
      {showInspiration && (
        <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
          {inspirationUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-1 group">
              <Input
                value={url}
                readOnly
                className="h-6 text-[10px] bg-black/30 border-white/15 text-white truncate"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={() => removeUrl(url)}
                disabled={isLoading}
              >
                <X className="h-2.5 w-2.5 text-white/50" />
              </Button>
            </div>
          ))}

          <div className="flex items-center gap-1">
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://competitor.com"
              className="h-6 text-[10px] bg-black/30 border-white/15 text-white placeholder:text-white/40"
              onKeyDown={(e) => e.key === "Enter" && addUrl()}
              disabled={isLoading}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 border-white/15 hover:bg-white/10 shrink-0"
              onClick={addUrl}
              disabled={!newUrl.trim() || isLoading}
            >
              <Plus className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg p-2.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-1.5">
            <Loader2 className="h-3.5 w-3.5 text-[var(--primary)] animate-spin" />
            <span className="text-[10px] font-medium text-[var(--primary)]">Researching...</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[9px] text-white/50">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              Analyzing: {domain.slice(0, 25)}...
            </div>
            {inspirationUrls.length > 0 && (
              <div className="flex items-center gap-1.5 text-[9px] text-white/50">
                <span className="w-1 h-1 rounded-full bg-[var(--primary)] animate-pulse" />
                Crawling {inspirationUrls.length} site(s)...
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[9px] text-white/50">
              <span className="w-1 h-1 rounded-full bg-white/30" />
              Generating recommendations...
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isLoading && (
        <div className="flex gap-1.5 pt-1">
          <Button
            size="sm"
            className="flex-1 h-7 text-xs bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white"
            onClick={onStartResearch}
            disabled={!domain.trim()}
          >
            <Sparkles className="h-2.5 w-2.5 mr-1" />
            Research
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2 border-white/20 text-white/60 hover:bg-white/10"
            onClick={onShowMe}
            disabled={!domain.trim()}
          >
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
