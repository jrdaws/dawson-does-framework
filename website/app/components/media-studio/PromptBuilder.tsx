"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Camera, Sun, Palette, Copy, Check, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  useMediaStudioStore,
  useCurrentAsset,
  GeneratedPrompt 
} from "@/lib/media-studio-state";
import {
  CAMERAS,
  LENSES,
  LIGHTING_TYPES,
  LIGHTING_DIRECTIONS,
  PHOTOGRAPHY_STYLES,
  COLOR_GRADES,
  STANDARD_NEGATIVE_PROMPT,
  ASSET_TYPE_PRESETS,
  composePrompt,
  getModelCost,
} from "@/lib/prompt-templates";

export function PromptBuilder() {
  const {
    assets,
    currentAssetIndex,
    setCurrentAssetIndex,
    setPrompt,
    nextAsset,
    prevAsset,
    updateAsset,
  } = useMediaStudioStore();
  
  const currentAsset = useCurrentAsset();
  const [copied, setCopied] = useState(false);

  // Form state for current asset
  const [subject, setSubject] = useState("");
  const [camera, setCamera] = useState("canon-eos-r5");
  const [lens, setLens] = useState("85mm-f1.4");
  const [lighting, setLighting] = useState("natural-window");
  const [lightingDirection, setLightingDirection] = useState("from-left");
  const [photographyStyle, setPhotographyStyle] = useState("editorial");
  const [colorGrade, setColorGrade] = useState("film-grain");
  const [shallowDof, setShallowDof] = useState(true);
  const [candid, setCandid] = useState(true);

  // Initialize form when asset changes
  useEffect(() => {
    if (currentAsset) {
      if (currentAsset.prompt) {
        // Load existing prompt
        setSubject(currentAsset.prompt.subject);
        setCamera(currentAsset.prompt.camera);
        setLens(currentAsset.prompt.lens);
        setLighting(currentAsset.prompt.lighting);
        setLightingDirection(currentAsset.prompt.lightingDirection);
        setPhotographyStyle(currentAsset.prompt.photographyStyle);
        setColorGrade(currentAsset.prompt.colorGrade);
      } else {
        // Use asset description as subject and apply presets
        setSubject(currentAsset.description);
        const preset = ASSET_TYPE_PRESETS[currentAsset.type];
        setCamera(preset.suggestedCamera);
        setLens(preset.suggestedLens);
        setLighting(preset.suggestedLighting);
        setPhotographyStyle(preset.suggestedStyle);
      }
    }
  }, [currentAsset?.id]);

  // Build composed prompt
  const additionalModifiers: string[] = [];
  if (shallowDof) additionalModifiers.push("shallow depth of field with beautiful bokeh");
  if (candid) additionalModifiers.push("authentic candid moment");

  const composedPrompt = composePrompt(
    subject,
    camera,
    lens,
    lighting,
    lightingDirection,
    photographyStyle,
    colorGrade,
    additionalModifiers
  );

  const fullPromptWithNegative = `${composedPrompt}\n\nNegative prompt: ${STANDARD_NEGATIVE_PROMPT}`;

  // Auto-save prompt when form changes
  useEffect(() => {
    if (currentAsset && subject) {
      const prompt: GeneratedPrompt = {
        subject,
        camera,
        lens,
        lighting,
        lightingDirection,
        photographyStyle,
        colorGrade,
        additionalModifiers,
        negativePrompt: STANDARD_NEGATIVE_PROMPT,
        composedPrompt,
      };
      setPrompt(currentAsset.id, prompt);
    }
  }, [subject, camera, lens, lighting, lightingDirection, photographyStyle, colorGrade, shallowDof, candid]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullPromptWithNegative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate total cost estimate
  const totalCost = assets.reduce((sum, asset) => {
    return sum + getModelCost(asset.model);
  }, 0);

  if (!currentAsset) {
    return (
      <div className="text-center py-12 text-terminal-dim">
        <p className="font-mono">No assets to configure</p>
        <p className="text-sm mt-1">Go back and add some assets first</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Asset Navigation Header */}
      <div className="flex items-center justify-between border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
        <Button
          onClick={prevAsset}
          disabled={currentAssetIndex === 0}
          variant="ghost"
          size="sm"
          className="text-terminal-dim hover:text-terminal-text disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <div className="text-center">
          <p className="font-mono font-bold text-terminal-text">
            {currentAsset.name}
          </p>
          <p className="text-xs text-terminal-dim">
            {currentAsset.dimensions.width}×{currentAsset.dimensions.height} • Asset {currentAssetIndex + 1} of {assets.length}
          </p>
        </div>

        <Button
          onClick={nextAsset}
          disabled={currentAssetIndex === assets.length - 1}
          variant="ghost"
          size="sm"
          className="text-terminal-dim hover:text-terminal-text disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Subject Input */}
      <div className="border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
        <Label className="text-terminal-dim text-xs flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Subject (what should be in the image?)
        </Label>
        <textarea
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Professional woman working on laptop in modern office space, candid moment of concentration"
          rows={3}
          className="w-full mt-2 px-3 py-2 bg-terminal-bg border border-terminal-text/30 rounded-md text-terminal-text font-mono text-sm resize-none focus:border-terminal-accent focus:outline-none"
        />
      </div>

      {/* Camera & Lens / Lighting Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Camera & Lens */}
        <div className="border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
          <Label className="text-terminal-dim text-xs flex items-center gap-2 mb-3">
            <Camera className="h-4 w-4" />
            Camera & Lens
          </Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-terminal-dim text-xs">Camera</Label>
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-terminal-bg border border-terminal-text/30 rounded-md text-terminal-text font-mono text-sm focus:border-terminal-accent focus:outline-none"
              >
                {CAMERAS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-terminal-dim text-xs">Lens</Label>
              <select
                value={lens}
                onChange={(e) => setLens(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-terminal-bg border border-terminal-text/30 rounded-md text-terminal-text font-mono text-sm focus:border-terminal-accent focus:outline-none"
              >
                {LENSES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shallowDof}
                onChange={(e) => setShallowDof(e.target.checked)}
                className="rounded border-terminal-text/30 bg-terminal-bg text-terminal-accent focus:ring-terminal-accent"
              />
              <span className="text-xs text-terminal-dim">Shallow depth of field</span>
            </label>
          </div>
        </div>

        {/* Lighting */}
        <div className="border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
          <Label className="text-terminal-dim text-xs flex items-center gap-2 mb-3">
            <Sun className="h-4 w-4" />
            Lighting
          </Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-terminal-dim text-xs">Type</Label>
              <select
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-terminal-bg border border-terminal-text/30 rounded-md text-terminal-text font-mono text-sm focus:border-terminal-accent focus:outline-none"
              >
                {LIGHTING_TYPES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-terminal-dim text-xs">Direction</Label>
              <select
                value={lightingDirection}
                onChange={(e) => setLightingDirection(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-terminal-bg border border-terminal-text/30 rounded-md text-terminal-text font-mono text-sm focus:border-terminal-accent focus:outline-none"
              >
                {LIGHTING_DIRECTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Style & Color Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Photography Style */}
        <div className="border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
          <Label className="text-terminal-dim text-xs mb-3 block">Photography Style</Label>
          <select
            value={photographyStyle}
            onChange={(e) => setPhotographyStyle(e.target.value)}
            className="w-full px-3 py-2 bg-terminal-bg border border-terminal-text/30 rounded-md text-terminal-text font-mono text-sm focus:border-terminal-accent focus:outline-none"
          >
            {PHOTOGRAPHY_STYLES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 cursor-pointer mt-3">
            <input
              type="checkbox"
              checked={candid}
              onChange={(e) => setCandid(e.target.checked)}
              className="rounded border-terminal-text/30 bg-terminal-bg text-terminal-accent focus:ring-terminal-accent"
            />
            <span className="text-xs text-terminal-dim">Candid/authentic moment</span>
          </label>
        </div>

        {/* Color Grade */}
        <div className="border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
          <Label className="text-terminal-dim text-xs flex items-center gap-2 mb-3">
            <Palette className="h-4 w-4" />
            Color Grade
          </Label>
          <select
            value={colorGrade}
            onChange={(e) => setColorGrade(e.target.value)}
            className="w-full px-3 py-2 bg-terminal-bg border border-terminal-text/30 rounded-md text-terminal-text font-mono text-sm focus:border-terminal-accent focus:outline-none"
          >
            {COLOR_GRADES.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Composed Prompt Preview */}
      <div className="border border-terminal-accent/50 rounded-lg p-4 bg-terminal-accent/5">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-terminal-accent text-xs font-bold">
            Generated Prompt (auto-composed)
          </Label>
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="text-terminal-dim hover:text-terminal-text h-6"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span className="ml-1 text-xs">{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
        
        <div className="font-mono text-xs text-terminal-text leading-relaxed p-3 bg-terminal-bg/50 rounded border border-terminal-text/10">
          <p>{composedPrompt}</p>
          <p className="mt-3 text-terminal-dim">
            <span className="text-red-400">Negative prompt:</span> {STANDARD_NEGATIVE_PROMPT.slice(0, 100)}...
          </p>
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="border border-terminal-text/20 rounded-lg p-4 bg-terminal-bg/50">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-4 w-4 text-terminal-dim" />
          <Label className="text-terminal-dim text-xs">Cost Estimate</Label>
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-terminal-accent font-mono">⚡ Stable Diffusion:</span>
            <span className="text-terminal-text ml-2">${getModelCost("stable-diffusion").toFixed(2)}/image</span>
          </div>
          <div>
            <span className="text-yellow-400 font-mono">✨ DALL-E 3:</span>
            <span className="text-terminal-text ml-2">${getModelCost("dall-e-3").toFixed(2)}/image</span>
          </div>
          <div className="ml-auto">
            <span className="text-terminal-dim">Total ({assets.length} assets):</span>
            <span className="text-terminal-text font-bold ml-2">${totalCost.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-xs text-terminal-dim mt-2">
          💡 Recommended: Use Stable Diffusion for drafts, DALL-E only for final hero images
        </p>
      </div>

      {/* Asset Navigation Dots */}
      <div className="flex justify-center gap-2">
        {assets.map((asset, index) => (
          <button
            key={asset.id}
            onClick={() => setCurrentAssetIndex(index)}
            className={`
              w-3 h-3 rounded-full transition-all
              ${index === currentAssetIndex 
                ? "bg-terminal-accent scale-125" 
                : asset.prompt?.composedPrompt
                  ? "bg-green-500"
                  : "bg-terminal-text/30 hover:bg-terminal-text/50"
              }
            `}
            title={`${asset.name}${asset.prompt?.composedPrompt ? " ✓" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

