"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, FileCode, Key } from "lucide-react";

interface ProjectSetupSectionProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  outputDir: string;
  onOutputDirChange: (dir: string) => void;
  envKeys?: Record<string, string>;
  onEnvKeyChange?: (key: string, value: string) => void;
}

export function ProjectSetupSection({
  projectName,
  onProjectNameChange,
  outputDir,
  onOutputDirChange,
  envKeys = {},
  onEnvKeyChange,
}: ProjectSetupSectionProps) {
  // Generate slug from project name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleProjectNameChange = (name: string) => {
    onProjectNameChange(name);
    // Auto-update output dir if it matches the previous slug pattern
    const slug = generateSlug(name);
    if (!outputDir || outputDir === generateSlug(projectName)) {
      onOutputDirChange(slug);
    }
  };

  return (
    <div className="space-y-4">
      {/* Project Name */}
      <div className="space-y-2">
        <Label className="text-xs text-white/70 flex items-center gap-1.5">
          <FileCode className="h-3 w-3" />
          Project Name
        </Label>
        <Input
          value={projectName}
          onChange={(e) => handleProjectNameChange(e.target.value)}
          placeholder="My Awesome Project"
          className="h-9 text-sm bg-black/30 border-white/15 text-white placeholder:text-white/30"
        />
      </div>

      {/* Output Directory */}
      <div className="space-y-2">
        <Label className="text-xs text-white/70 flex items-center gap-1.5">
          <Folder className="h-3 w-3" />
          Output Directory
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-mono">~/</span>
          <Input
            value={outputDir}
            onChange={(e) => onOutputDirChange(e.target.value)}
            placeholder="my-project"
            className="h-9 text-sm bg-black/30 border-white/15 text-white placeholder:text-white/30 font-mono"
          />
        </div>
      </div>

      {/* Environment Keys Preview */}
      {Object.keys(envKeys).length > 0 && onEnvKeyChange && (
        <div className="space-y-2">
          <Label className="text-xs text-white/70 flex items-center gap-1.5">
            <Key className="h-3 w-3" />
            Environment Variables
          </Label>
          <div className="text-xs text-white/50 bg-black/20 rounded-lg p-3 border border-white/10">
            <p className="mb-2">{Object.keys(envKeys).length} keys configured</p>
            <code className="text-emerald-400/70">
              {Object.keys(envKeys).slice(0, 3).map(key => (
                <div key={key}>{key}=***</div>
              ))}
              {Object.keys(envKeys).length > 3 && (
                <div className="text-white/40">+{Object.keys(envKeys).length - 3} more...</div>
              )}
            </code>
          </div>
        </div>
      )}

      {projectName && outputDir && (
        <div className="text-xs text-white/40 bg-black/20 rounded-lg p-2 font-mono">
          Will create: <span className="text-white/70">~/{outputDir}/</span>
        </div>
      )}
    </div>
  );
}

