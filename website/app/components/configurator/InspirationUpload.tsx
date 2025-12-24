"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Link as LinkIcon, Figma, X, Image as ImageIcon, FileText } from "lucide-react";
import { Inspiration } from "@/lib/configurator-state";

/**
 * Safely extract hostname from a URL string
 * Returns the original value if URL parsing fails
 */
function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    // Return a truncated version of the raw value if not a valid URL
    return url.length > 30 ? url.slice(0, 30) + "..." : url;
  }
}

interface InspirationUploadProps {
  inspirations: Inspiration[];
  description: string;
  onAddInspiration: (inspiration: Inspiration) => void;
  onRemoveInspiration: (id: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function InspirationUpload({
  inspirations,
  description,
  onAddInspiration,
  onRemoveInspiration,
  onDescriptionChange,
}: InspirationUploadProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;

    const isFigma = urlInput.includes("figma.com");
    const inspiration: Inspiration = {
      id: Date.now().toString(),
      type: isFigma ? "figma" : "url",
      value: urlInput.trim(),
      preview: urlInput.trim(),
    };

    onAddInspiration(inspiration);
    setUrlInput("");
  };

  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          const inspiration: Inspiration = {
            id: Date.now().toString() + Math.random(),
            type: "image",
            value: file.name,
            preview: e.target?.result as string,
          };
          onAddInspiration(inspiration);
        };
        reader.readAsDataURL(file);
      });
    },
    [onAddInspiration]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Add Inspiration
        </h2>
        <p className="text-muted-foreground">
          Upload images, paste URLs, or describe what you want to build
        </p>
        <Badge variant="info" className="mt-2">
          Optional: Skip this step if you want to start from a blank template
        </Badge>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Text Description */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Describe Your Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label className="text-foreground">
              What features and functionality do you want?
            </Label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Example: A modern SaaS dashboard with user authentication, subscription billing, and real-time analytics. Clean design with dark mode support..."
              className="w-full min-h-[120px] p-4 rounded-lg border border-input bg-background text-foreground font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Describe features, design style, user flows, or anything the AI should know
            </p>
          </CardContent>
        </Card>

        {/* Image Upload (Drag & Drop) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              Upload Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-all
                ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-muted-foreground"
                }
              `}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-foreground mb-2">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          </CardContent>
        </Card>

        {/* URL / Figma Link */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-primary" />
              Paste URLs or Figma Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlAdd()}
                placeholder="https://dribbble.com/shots/... or https://figma.com/..."
                className="flex-1 font-mono text-sm"
              />
              <Button
                onClick={handleUrlAdd}
                disabled={!urlInput.trim()}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Paste design inspiration from Dribbble, Behance, websites, or Figma files
            </p>
          </CardContent>
        </Card>

        {/* Inspirations Grid */}
        {inspirations.length > 0 && (
          <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-primary">
                <Badge variant="info">{inspirations.length}</Badge>
                Inspiration{inspirations.length !== 1 ? "s" : ""} Added
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {inspirations.map((inspiration) => (
                  <div
                    key={inspiration.id}
                    className="relative group rounded-lg border border-border overflow-hidden hover:border-primary transition-all"
                  >
                    {/* Preview */}
                    {inspiration.type === "image" && inspiration.preview && (
                      <img
                        src={inspiration.preview}
                        alt={inspiration.value}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    {inspiration.type === "url" && (
                      <div className="w-full h-32 bg-muted flex items-center justify-center p-4">
                        <LinkIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    {inspiration.type === "figma" && (
                      <div className="w-full h-32 bg-muted flex items-center justify-center p-4">
                        <Figma className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}

                    {/* Label */}
                    <div className="p-2 bg-card/80 backdrop-blur">
                      <p className="text-xs text-foreground truncate font-mono">
                        {inspiration.type === "image"
                          ? inspiration.value
                          : getHostname(inspiration.value)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveInspiration(inspiration.id)}
                      className="absolute top-2 right-2 p-1 rounded bg-destructive hover:bg-destructive/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
