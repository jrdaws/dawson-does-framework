"use client";

import { useState } from "react";
import { Plus, Trash2, Image, Layers, User, Sparkles, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  useMediaStudioStore, 
  AssetType, 
  AssetTarget, 
  Priority,
  PlannedAsset 
} from "@/lib/media-studio-state";
import { ASSET_TYPE_PRESETS } from "@/lib/prompt-templates";

const ASSET_TYPE_OPTIONS: { value: AssetType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "hero", label: "Hero Image", icon: <Image className="h-4 w-4" />, description: "Main landing page image" },
  { value: "feature", label: "Feature", icon: <Sparkles className="h-4 w-4" />, description: "Feature section images" },
  { value: "icon", label: "Icon", icon: <Grid3X3 className="h-4 w-4" />, description: "Small icons and symbols" },
  { value: "illustration", label: "Illustration", icon: <Layers className="h-4 w-4" />, description: "Decorative illustrations" },
  { value: "avatar", label: "Avatar", icon: <User className="h-4 w-4" />, description: "User profile images" },
  { value: "background", label: "Background", icon: <Image className="h-4 w-4" />, description: "Background images" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: "P1", label: "P1 - Critical", color: "text-red-400" },
  { value: "P2", label: "P2 - Important", color: "text-yellow-400" },
  { value: "P3", label: "P3 - Nice to Have", color: "text-green-400" },
];

interface AssetFormData {
  type: AssetType;
  name: string;
  description: string;
  width: number;
  height: number;
  priority: Priority;
}

const defaultFormData: AssetFormData = {
  type: "hero",
  name: "",
  description: "",
  width: 1920,
  height: 1080,
  priority: "P1",
};

export function AssetPlannerForm() {
  const { 
    assets, 
    assetTarget, 
    projectName,
    template,
    addAsset, 
    removeAsset, 
    setAssetTarget,
    setProjectContext 
  } = useMediaStudioStore();
  
  const [formData, setFormData] = useState<AssetFormData>(defaultFormData);
  const [isAddingAsset, setIsAddingAsset] = useState(false);

  const handleTypeChange = (type: AssetType) => {
    const preset = ASSET_TYPE_PRESETS[type];
    setFormData({
      ...formData,
      type,
      width: preset.defaultDimensions.width,
      height: preset.defaultDimensions.height,
    });
  };

  const handleAddAsset = () => {
    if (!formData.name || !formData.description) return;
    
    addAsset({
      type: formData.type,
      name: formData.name,
      description: formData.description,
      dimensions: { width: formData.width, height: formData.height },
      priority: formData.priority,
    });

    setFormData(defaultFormData);
    setIsAddingAsset(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Project Context Card */}
      <div className="border border-terminal-text/20 rounded-lg p-6 bg-terminal-bg/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-mono font-bold text-terminal-text">
            Project Context
          </h3>
          <span className="text-xs text-terminal-dim bg-terminal-text/10 px-2 py-1 rounded">
            Auto-filled from Configurator
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-terminal-dim text-xs">Project Name</Label>
            <Input
              value={projectName}
              onChange={(e) => setProjectContext(e.target.value, template)}
              placeholder="my-project"
              className="mt-1 bg-terminal-bg border-terminal-text/30 text-terminal-text"
            />
          </div>
          <div>
            <Label className="text-terminal-dim text-xs">Template</Label>
            <Input
              value={template}
              onChange={(e) => setProjectContext(projectName, e.target.value)}
              placeholder="saas"
              className="mt-1 bg-terminal-bg border-terminal-text/30 text-terminal-text"
            />
          </div>
        </div>
      </div>

      {/* Asset Target Selection */}
      <div className="border border-terminal-text/20 rounded-lg p-6 bg-terminal-bg/50">
        <h3 className="text-lg font-mono font-bold text-terminal-text mb-4">
          Asset Target
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setAssetTarget("PROJECT")}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${assetTarget === "PROJECT" 
                ? "border-terminal-accent bg-terminal-accent/10" 
                : "border-terminal-text/20 hover:border-terminal-text/40"
              }
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${assetTarget === "PROJECT" ? "border-terminal-accent" : "border-terminal-text/40"}
              `}>
                {assetTarget === "PROJECT" && (
                  <div className="w-2 h-2 rounded-full bg-terminal-accent" />
                )}
              </div>
              <span className="font-mono font-bold text-terminal-text">PROJECT</span>
            </div>
            <p className="text-xs text-terminal-dim">
              Assets for this specific app. Goes to your project folder.
            </p>
          </button>

          <button
            onClick={() => setAssetTarget("TEMPLATE")}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${assetTarget === "TEMPLATE" 
                ? "border-terminal-accent bg-terminal-accent/10" 
                : "border-terminal-text/20 hover:border-terminal-text/40"
              }
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${assetTarget === "TEMPLATE" ? "border-terminal-accent" : "border-terminal-text/40"}
              `}>
                {assetTarget === "TEMPLATE" && (
                  <div className="w-2 h-2 rounded-full bg-terminal-accent" />
                )}
              </div>
              <span className="font-mono font-bold text-terminal-text">TEMPLATE</span>
            </div>
            <p className="text-xs text-terminal-dim">
              Assets for the starter template. Reused by all future projects.
            </p>
          </button>
        </div>
      </div>

      {/* Asset List */}
      <div className="border border-terminal-text/20 rounded-lg p-6 bg-terminal-bg/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-mono font-bold text-terminal-text">
            Required Assets
          </h3>
          <Button
            onClick={() => setIsAddingAsset(true)}
            size="sm"
            className="bg-terminal-accent hover:bg-terminal-accent/80 text-terminal-bg"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Asset
          </Button>
        </div>

        {/* Existing Assets */}
        {assets.length > 0 ? (
          <div className="space-y-3 mb-4">
            {assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onRemove={removeAsset} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-terminal-dim">
            <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-mono">No assets planned yet</p>
            <p className="text-sm mt-1">Add at least one asset to continue</p>
          </div>
        )}

        {/* Add Asset Form */}
        {isAddingAsset && (
          <div className="border border-terminal-accent/50 rounded-lg p-4 bg-terminal-accent/5 mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Asset Type */}
              <div>
                <Label className="text-terminal-dim text-xs">Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {ASSET_TYPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTypeChange(option.value)}
                      className={`
                        p-2 rounded border text-xs font-mono flex flex-col items-center gap-1
                        ${formData.type === option.value
                          ? "border-terminal-accent bg-terminal-accent/20 text-terminal-accent"
                          : "border-terminal-text/20 text-terminal-dim hover:border-terminal-text/40"
                        }
                      `}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <Label className="text-terminal-dim text-xs">Dimensions</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 0 })}
                    className="bg-terminal-bg border-terminal-text/30 text-terminal-text"
                    placeholder="Width"
                  />
                  <span className="text-terminal-dim self-center">×</span>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                    className="bg-terminal-bg border-terminal-text/30 text-terminal-text"
                    placeholder="Height"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div>
                <Label className="text-terminal-dim text-xs">Asset Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., hero-main"
                  className="mt-1 bg-terminal-bg border-terminal-text/30 text-terminal-text"
                />
              </div>

              {/* Priority */}
              <div>
                <Label className="text-terminal-dim text-xs">Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  className="w-full mt-1 px-3 py-2 bg-terminal-bg border border-terminal-text/30 rounded-md text-terminal-text font-mono text-sm"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <Label className="text-terminal-dim text-xs">Description (what should the image show?)</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Professional woman working on laptop in modern office space, candid moment of concentration"
                rows={3}
                className="w-full mt-1 px-3 py-2 bg-terminal-bg border border-terminal-text/30 rounded-md text-terminal-text font-mono text-sm resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsAddingAsset(false)}
                variant="outline"
                size="sm"
                className="border-terminal-text/30 text-terminal-dim"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAsset}
                disabled={!formData.name || !formData.description}
                size="sm"
                className="bg-terminal-accent hover:bg-terminal-accent/80 text-terminal-bg"
              >
                Add Asset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Asset Card Component
function AssetCard({ asset, onRemove }: { asset: PlannedAsset; onRemove: (id: string) => void }) {
  const typeOption = ASSET_TYPE_OPTIONS.find((o) => o.value === asset.type);
  const priorityOption = PRIORITY_OPTIONS.find((o) => o.value === asset.priority);

  return (
    <div className="flex items-center justify-between p-4 border border-terminal-text/20 rounded-lg bg-terminal-bg/30">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded bg-terminal-text/10">
          {typeOption?.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-terminal-text">{asset.name}</span>
            <span className={`text-xs font-mono ${priorityOption?.color}`}>
              {asset.priority}
            </span>
            <span className="text-xs text-terminal-dim">
              {asset.dimensions.width}×{asset.dimensions.height}
            </span>
          </div>
          <p className="text-xs text-terminal-dim mt-1 line-clamp-1">
            {asset.description}
          </p>
        </div>
      </div>
      
      <Button
        onClick={() => onRemove(asset.id)}
        variant="ghost"
        size="sm"
        className="text-terminal-dim hover:text-red-400 hover:bg-red-400/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

