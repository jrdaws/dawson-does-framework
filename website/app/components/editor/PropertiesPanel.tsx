"use client";

import React, { useState, useEffect } from "react";
import { useEditor } from "./EditorContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Palette,
  Type,
  Box,
  Layers,
  AlignLeft,
  Info,
} from "lucide-react";

export function PropertiesPanel() {
  const { selectedElement, updateStyle, updateContent } = useEditor();

  const [textContent, setTextContent] = useState("");
  const [color, setColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [fontWeight, setFontWeight] = useState("");
  const [padding, setPadding] = useState("");
  const [margin, setMargin] = useState("");

  // Update local state when selection changes
  useEffect(() => {
    if (selectedElement) {
      setTextContent(selectedElement.textContent);
      setColor(selectedElement.styles.color || "");
      setBackgroundColor(selectedElement.styles.backgroundColor || "");
      setFontSize(
        selectedElement.styles.fontSize?.replace("px", "") || ""
      );
      setFontWeight(selectedElement.styles.fontWeight || "");
      setPadding(selectedElement.styles.padding || "");
      setMargin(selectedElement.styles.margin || "");
    }
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center text-terminal-dim">
          <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            Select an element in the preview to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const handleTextChange = (value: string) => {
    setTextContent(value);
    updateContent(value);
  };

  const handleStyleChange = (property: string, value: string) => {
    switch (property) {
      case "color":
        setColor(value);
        updateStyle({ color: value });
        break;
      case "backgroundColor":
        setBackgroundColor(value);
        updateStyle({ backgroundColor: value });
        break;
      case "fontSize":
        setFontSize(value);
        updateStyle({ fontSize: value ? `${value}px` : "" });
        break;
      case "fontWeight":
        setFontWeight(value);
        updateStyle({ fontWeight: value });
        break;
      case "padding":
        setPadding(value);
        updateStyle({ padding: value });
        break;
      case "margin":
        setMargin(value);
        updateStyle({ margin: value });
        break;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="border-b border-terminal-text/20 pb-3">
          <h3 className="text-lg font-display font-bold text-terminal-text">
            Properties
          </h3>
          <p className="text-xs text-terminal-dim mt-1">
            {selectedElement.tagName.toLowerCase()} • {selectedElement.path}
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-terminal-text">
            <AlignLeft className="h-4 w-4" />
            Content
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-terminal-dim">Text</Label>
            <textarea
              value={textContent}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-terminal-bg border border-terminal-text/30 rounded text-terminal-text focus:border-terminal-accent focus:outline-none resize-none"
              rows={3}
              placeholder="Element text content..."
            />
          </div>
        </div>

        {/* Typography Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-terminal-text">
            <Type className="h-4 w-4" />
            Typography
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-terminal-dim">Font Size (px)</Label>
            <Input
              type="number"
              value={fontSize}
              onChange={(e) => handleStyleChange("fontSize", e.target.value)}
              className="bg-terminal-bg border-terminal-text/30 text-terminal-text focus:border-terminal-accent"
              placeholder="16"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-terminal-dim">Font Weight</Label>
            <select
              value={fontWeight}
              onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
              className="w-full px-3 py-2 text-sm bg-terminal-bg border border-terminal-text/30 rounded text-terminal-text focus:border-terminal-accent focus:outline-none"
            >
              <option value="">Default</option>
              <option value="300">Light (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semibold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
            </select>
          </div>
        </div>

        {/* Colors Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-terminal-text">
            <Palette className="h-4 w-4" />
            Colors
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-terminal-dim">Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                className="w-12 h-9 p-1 bg-terminal-bg border-terminal-text/30"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                className="flex-1 bg-terminal-bg border-terminal-text/30 text-terminal-text focus:border-terminal-accent font-mono text-xs"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-terminal-dim">Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
                className="w-12 h-9 p-1 bg-terminal-bg border-terminal-text/30"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
                className="flex-1 bg-terminal-bg border-terminal-text/30 text-terminal-text focus:border-terminal-accent font-mono text-xs"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        {/* Spacing Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-terminal-text">
            <Box className="h-4 w-4" />
            Spacing
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-terminal-dim">
              Padding (e.g., "10px" or "10px 20px")
            </Label>
            <Input
              type="text"
              value={padding}
              onChange={(e) => handleStyleChange("padding", e.target.value)}
              className="bg-terminal-bg border-terminal-text/30 text-terminal-text focus:border-terminal-accent font-mono text-xs"
              placeholder="0px"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-terminal-dim">
              Margin (e.g., "10px" or "10px 20px")
            </Label>
            <Input
              type="text"
              value={margin}
              onChange={(e) => handleStyleChange("margin", e.target.value)}
              className="bg-terminal-bg border-terminal-text/30 text-terminal-text focus:border-terminal-accent font-mono text-xs"
              placeholder="0px"
            />
          </div>
        </div>

        {/* Element Info */}
        <div className="space-y-3 pt-3 border-t border-terminal-text/20">
          <div className="flex items-center gap-2 text-sm font-medium text-terminal-text">
            <Layers className="h-4 w-4" />
            Element Info
          </div>
          <div className="text-xs space-y-1 text-terminal-dim font-mono">
            <div>
              <span className="text-terminal-accent">Tag:</span>{" "}
              {selectedElement.tagName.toLowerCase()}
            </div>
            <div>
              <span className="text-terminal-accent">Path:</span>{" "}
              <div className="mt-1 break-all">{selectedElement.path}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
