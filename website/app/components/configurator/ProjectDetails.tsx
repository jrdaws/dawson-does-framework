"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, AlertCircle } from "lucide-react";

interface ProjectDetailsProps {
  projectName: string;
  outputDir: string;
  onProjectNameChange: (name: string) => void;
  onOutputDirChange: (dir: string) => void;
}

export function ProjectDetails({
  projectName,
  outputDir,
  onProjectNameChange,
  onOutputDirChange,
}: ProjectDetailsProps) {
  const [touched, setTouched] = useState({ projectName: false, outputDir: false });

  const slugifiedName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const isValidProjectName = projectName.length > 0 && /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slugifiedName);
  const isValidOutputDir = outputDir.length > 0 && outputDir.startsWith("./");

  const showProjectNameError = touched.projectName && !isValidProjectName && projectName.length > 0;
  const showOutputDirError = touched.outputDir && !isValidOutputDir;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-terminal-text mb-2">
          Project Details
        </h2>
        <p className="text-terminal-dim">
          Configure your project name and output location
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Project Name */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot bg-terminal-error"></div>
            <div className="terminal-dot bg-terminal-warning"></div>
            <div className="terminal-dot bg-terminal-text"></div>
            <span className="text-xs text-terminal-dim ml-2">Project Name</span>
          </div>
          <div className="terminal-content space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-terminal-text">
                Project Name
              </Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                onBlur={() => setTouched({ ...touched, projectName: true })}
                placeholder="my-awesome-project"
                className="bg-terminal-bg border-terminal-text/30 text-terminal-text font-mono"
              />
              {projectName && (
                <div className="text-xs space-y-1">
                  <p className="text-terminal-dim">
                    Slug: <span className="text-terminal-accent font-mono">{slugifiedName || "(empty)"}</span>
                  </p>
                </div>
              )}
              {showProjectNameError && (
                <div className="flex items-start gap-2 text-terminal-error text-xs">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Project name must start and end with alphanumeric characters, can contain hyphens in between
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Output Directory */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot bg-terminal-error"></div>
            <div className="terminal-dot bg-terminal-warning"></div>
            <div className="terminal-dot bg-terminal-text"></div>
            <span className="text-xs text-terminal-dim ml-2">Output Directory</span>
          </div>
          <div className="terminal-content space-y-4">
            <div className="space-y-2">
              <Label htmlFor="outputDir" className="text-terminal-text flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Output Directory
              </Label>
              <Input
                id="outputDir"
                value={outputDir}
                onChange={(e) => onOutputDirChange(e.target.value)}
                onBlur={() => setTouched({ ...touched, outputDir: true })}
                placeholder="./my-app"
                className="bg-terminal-bg border-terminal-text/30 text-terminal-text font-mono"
              />
              <p className="text-xs text-terminal-dim">
                Relative path where your project will be created
              </p>
              {showOutputDirError && (
                <div className="flex items-start gap-2 text-terminal-error text-xs">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Output directory must start with ./ (relative path)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        {isValidProjectName && isValidOutputDir && (
          <div className="terminal-window border-terminal-accent/30">
            <div className="terminal-header">
              <div className="terminal-dot bg-terminal-error"></div>
              <div className="terminal-dot bg-terminal-warning"></div>
              <div className="terminal-dot bg-terminal-text"></div>
              <span className="text-xs text-terminal-accent ml-2">Preview</span>
            </div>
            <div className="terminal-content">
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-terminal-dim">Project will be created at:</span>
                </div>
                <code className="block text-terminal-accent font-mono text-sm bg-terminal-bg/50 p-3 rounded border border-terminal-accent/20">
                  {outputDir}/{slugifiedName}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
