"use client";

import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  AlertTriangle, 
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  useMediaStudioStore,
  PlannedAsset 
} from "@/lib/media-studio-state";

// Photorealism check items
const PHOTOREALISM_CHECKS = [
  { id: "skin", label: "Skin texture natural", description: "Not waxy, plastic, or poreless" },
  { id: "eyes", label: "Eyes realistic", description: "Proper catchlights, not vacant" },
  { id: "lighting", label: "Lighting consistent", description: "Shadows match light direction" },
  { id: "colors", label: "Colors natural", description: "Not oversaturated or HDR-overdone" },
  { id: "hands", label: "Hands correct", description: "Right number of fingers, natural pose" },
  { id: "background", label: "Background clean", description: "No weird artifacts in bokeh" },
  { id: "overall", label: "Overall photorealistic", description: "Would you believe this is a real photo?" },
];

interface QualityScores {
  visual: number;
  brand: number;
  technical: number;
}

export function QualityReviewer() {
  const {
    assets,
    currentAssetIndex,
    setCurrentAssetIndex,
    approveAsset,
    rejectAsset,
    updateAsset,
  } = useMediaStudioStore();

  // Filter to only show assets that need review
  const reviewableAssets = assets.filter(
    (a) => a.status === "complete" || a.status === "reviewing"
  );
  
  const [localIndex, setLocalIndex] = useState(0);
  const currentAsset = reviewableAssets[localIndex];
  
  // Photorealism checks
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  
  // Quality scores
  const [scores, setScores] = useState<QualityScores>({
    visual: 35,
    brand: 25,
    technical: 25,
  });
  
  // Feedback
  const [feedback, setFeedback] = useState("");
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  // Reset state when asset changes
  useEffect(() => {
    setChecks({});
    setScores({ visual: 35, brand: 25, technical: 25 });
    setFeedback("");
    setShowFeedbackInput(false);
  }, [currentAsset?.id]);

  const allChecksPass = PHOTOREALISM_CHECKS.every((check) => checks[check.id]);
  const failedChecks = PHOTOREALISM_CHECKS.filter((check) => checks[check.id] === false);
  const totalScore = scores.visual + scores.brand + scores.technical;

  const handleToggleCheck = (checkId: string) => {
    setChecks((prev) => ({
      ...prev,
      [checkId]: !prev[checkId],
    }));
  };

  const handleApprove = () => {
    if (!currentAsset) return;
    approveAsset(currentAsset.id, totalScore, feedback || undefined);
    
    // Move to next reviewable asset
    if (localIndex < reviewableAssets.length - 1) {
      setLocalIndex(localIndex + 1);
    }
  };

  const handleApproveWithNotes = () => {
    setShowFeedbackInput(true);
  };

  const handleReject = () => {
    if (!currentAsset || !feedback) return;
    rejectAsset(currentAsset.id, feedback);
    
    // Move to next reviewable asset
    if (localIndex < reviewableAssets.length - 1) {
      setLocalIndex(localIndex + 1);
    }
  };

  const handleRegenerate = () => {
    if (!currentAsset) return;
    // Reset status to pending for regeneration
    updateAsset(currentAsset.id, { 
      status: "pending", 
      generatedUrl: undefined,
      feedback: feedback || "Regeneration requested" 
    });
    
    if (localIndex < reviewableAssets.length - 1) {
      setLocalIndex(localIndex + 1);
    }
  };

  // Count approved and rejected
  const approvedCount = assets.filter((a) => a.status === "approved").length;
  const rejectedCount = assets.filter((a) => a.status === "rejected").length;

  if (reviewableAssets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12 border border-terminal-text/20 rounded-lg bg-terminal-bg/50">
          {approvedCount > 0 ? (
            <>
              <Check className="h-12 w-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-lg font-mono font-bold text-terminal-text mb-2">
                Review Complete!
              </h3>
              <p className="text-terminal-dim">
                {approvedCount} assets approved, {rejectedCount} rejected
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <div className="text-center px-6 py-3 bg-green-400/10 border border-green-400/30 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">{approvedCount}</p>
                  <p className="text-xs text-terminal-dim">Approved</p>
                </div>
                {rejectedCount > 0 && (
                  <div className="text-center px-6 py-3 bg-red-400/10 border border-red-400/30 rounded-lg">
                    <p className="text-2xl font-bold text-red-400">{rejectedCount}</p>
                    <p className="text-xs text-terminal-dim">Need Regen</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Eye className="h-12 w-12 mx-auto mb-4 text-terminal-dim opacity-50" />
              <h3 className="text-lg font-mono font-bold text-terminal-text mb-2">
                No Assets to Review
              </h3>
              <p className="text-terminal-dim">
                Generate some assets first, then come back to review them
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
        <Button
          onClick={() => setLocalIndex(Math.max(0, localIndex - 1))}
          disabled={localIndex === 0}
          variant="ghost"
          size="sm"
          className="text-terminal-dim hover:text-terminal-text disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <div className="text-center">
          <p className="font-mono font-bold text-terminal-text">
            Reviewing: {currentAsset?.name}
          </p>
          <p className="text-xs text-terminal-dim">
            Asset {localIndex + 1} of {reviewableAssets.length} • 
            Iteration {currentAsset?.iterations || 1} of 3
          </p>
        </div>

        <Button
          onClick={() => setLocalIndex(Math.min(reviewableAssets.length - 1, localIndex + 1))}
          disabled={localIndex === reviewableAssets.length - 1}
          variant="ghost"
          size="sm"
          className="text-terminal-dim hover:text-terminal-text disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Main Review Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Preview */}
        <div className="border border-terminal-text/20 rounded-lg overflow-hidden bg-terminal-bg/50">
          <div className="aspect-video relative">
            {currentAsset?.generatedUrl ? (
              <img
                src={currentAsset.generatedUrl}
                alt={currentAsset.name}
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-terminal-dim">
                No image
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-terminal-text/10">
            <p className="text-sm text-terminal-dim mb-1">Prompt used:</p>
            <p className="text-xs font-mono text-terminal-text line-clamp-3">
              {currentAsset?.prompt?.composedPrompt || "No prompt available"}
            </p>
          </div>
        </div>

        {/* Review Panel */}
        <div className="space-y-4">
          {/* Photorealism Checklist */}
          <div className="border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
            <h4 className="text-sm font-mono font-bold text-terminal-text mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Photorealism Check
            </h4>
            
            <div className="space-y-2">
              {PHOTOREALISM_CHECKS.map((check) => (
                <button
                  key={check.id}
                  onClick={() => handleToggleCheck(check.id)}
                  className={`
                    w-full flex items-center justify-between p-2 rounded border text-left transition-all
                    ${checks[check.id] === true
                      ? "border-green-400/50 bg-green-400/10"
                      : checks[check.id] === false
                        ? "border-red-400/50 bg-red-400/10"
                        : "border-terminal-text/20 hover:border-terminal-text/40"
                    }
                  `}
                >
                  <div>
                    <p className="text-sm text-terminal-text">{check.label}</p>
                    <p className="text-xs text-terminal-dim">{check.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    checks[check.id] === true
                      ? "bg-green-400 text-white"
                      : checks[check.id] === false
                        ? "bg-red-400 text-white"
                        : "bg-terminal-text/20"
                  }`}>
                    {checks[check.id] === true && <Check className="h-4 w-4" />}
                    {checks[check.id] === false && <X className="h-4 w-4" />}
                  </div>
                </button>
              ))}
            </div>

            {failedChecks.length > 0 && (
              <div className="mt-3 p-2 bg-red-400/10 border border-red-400/30 rounded text-xs text-red-400">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                {failedChecks.length} check(s) failed - consider regeneration
              </div>
            )}
          </div>

          {/* Quality Scores */}
          <div className="border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
            <h4 className="text-sm font-mono font-bold text-terminal-text mb-3">
              Quality Scores
            </h4>
            
            <div className="space-y-3">
              <ScoreSlider
                label="Visual Quality"
                value={scores.visual}
                max={40}
                onChange={(v) => setScores((s) => ({ ...s, visual: v }))}
              />
              <ScoreSlider
                label="Brand Alignment"
                value={scores.brand}
                max={30}
                onChange={(v) => setScores((s) => ({ ...s, brand: v }))}
              />
              <ScoreSlider
                label="Technical Quality"
                value={scores.technical}
                max={30}
                onChange={(v) => setScores((s) => ({ ...s, technical: v }))}
              />
            </div>

            <div className="mt-4 pt-3 border-t border-terminal-text/10 flex items-center justify-between">
              <span className="font-mono text-terminal-text">Total Score:</span>
              <span className={`text-2xl font-bold font-mono ${
                totalScore >= 90 ? "text-green-400" :
                totalScore >= 70 ? "text-yellow-400" :
                "text-red-400"
              }`}>
                {totalScore}/100
              </span>
            </div>

            <div className="mt-2 text-xs text-terminal-dim">
              {totalScore >= 90 && "✓ Approved - meets quality standards"}
              {totalScore >= 70 && totalScore < 90 && "⚠️ Minor revisions may be needed"}
              {totalScore >= 50 && totalScore < 70 && "⚠️ Major revisions needed"}
              {totalScore < 50 && "✗ Consider regenerating completely"}
            </div>
          </div>

          {/* Feedback Input */}
          {showFeedbackInput && (
            <div className="border border-terminal-accent/50 rounded-lg p-4 bg-terminal-accent/5">
              <Label className="text-terminal-dim text-xs flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4" />
                Feedback / Notes
              </Label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add notes about what to improve or any issues..."
                rows={3}
                className="w-full px-3 py-2 bg-terminal-bg border border-terminal-text/30 rounded-md text-terminal-text font-mono text-sm resize-none focus:border-terminal-accent focus:outline-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleRegenerate}
              variant="outline"
              className="flex-1 border-terminal-text/30 text-terminal-dim hover:border-red-400 hover:text-red-400"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
            
            <Button
              onClick={handleApproveWithNotes}
              variant="outline"
              className="flex-1 border-terminal-text/30 text-terminal-dim hover:border-yellow-400 hover:text-yellow-400"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Approve with Notes
            </Button>
            
            <Button
              onClick={handleApprove}
              disabled={!allChecksPass}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </div>

      {/* Review Progress Summary */}
      <div className="border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-terminal-dim">Approved: {approvedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-sm text-terminal-dim">Pending: {reviewableAssets.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-sm text-terminal-dim">Rejected: {rejectedCount}</span>
            </div>
          </div>
          
          <div className="text-sm text-terminal-dim">
            Progress: {Math.round((approvedCount / assets.length) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

// Score Slider Component
function ScoreSlider({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-terminal-dim">{label}</span>
        <span className="text-xs font-mono text-terminal-text">{value}/{max}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-terminal-text/10 rounded-lg appearance-none cursor-pointer accent-terminal-accent"
      />
    </div>
  );
}

