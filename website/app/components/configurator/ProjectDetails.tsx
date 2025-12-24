"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, AlertCircle, CheckCircle2, FileCode } from "lucide-react";

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
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Project Details
        </h2>
        <p className="text-muted-foreground">
          Configure your project name and output location
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Project Name */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileCode className="h-4 w-4 text-primary" />
              Project Name
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-foreground">
                Project Name
              </Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                onBlur={() => setTouched({ ...touched, projectName: true })}
                placeholder="my-awesome-project"
                className="font-mono"
              />
              {projectName && (
                <div className="text-xs space-y-1">
                  <p className="text-muted-foreground">
                    Slug: <span className="text-primary font-mono">{slugifiedName || "(empty)"}</span>
                  </p>
                </div>
              )}
              {showProjectNameError && (
                <div className="flex items-start gap-2 text-destructive text-xs">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Project name must start and end with alphanumeric characters, can contain hyphens in between
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Output Directory */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Folder className="h-4 w-4 text-primary" />
              Output Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="outputDir" className="text-foreground flex items-center gap-2">
                Output Directory
              </Label>
              <Input
                id="outputDir"
                value={outputDir}
                onChange={(e) => onOutputDirChange(e.target.value)}
                onBlur={() => setTouched({ ...touched, outputDir: true })}
                placeholder="./my-app"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Relative path where your project will be created
              </p>
              {showOutputDirError && (
                <div className="flex items-start gap-2 text-destructive text-xs">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Output directory must start with ./ (relative path)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {isValidProjectName && isValidOutputDir && (
          <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-muted-foreground">Project will be created at:</span>
                </div>
                <code className="block text-primary font-mono text-sm bg-muted/50 p-3 rounded border border-primary/20">
                  {/* Avoid double nesting: if outputDir already ends with slugifiedName, use outputDir directly */}
                  {outputDir.endsWith(`/${slugifiedName}`) || outputDir.endsWith(slugifiedName) 
                    ? outputDir 
                    : `${outputDir}/${slugifiedName}`}
                </code>
                {(outputDir.endsWith(`/${slugifiedName}`) || outputDir.endsWith(slugifiedName)) && (
                  <p className="text-xs text-muted-foreground">
                    ℹ️ Output directory already includes project name
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
