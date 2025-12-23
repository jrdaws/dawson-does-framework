"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Sparkles, AlertCircle, Check, Code2, FileText } from "lucide-react";
import { generateProject, type ProjectGenerationResult, type ProjectGenerationError, type StreamProgressEvent } from "@/lib/project-generator";
import { useConfiguratorStore } from "@/lib/configurator-state";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type ModelTier = 'fast' | 'balanced' | 'quality';

interface ProjectGeneratorProps {
  template: string;
  integrations: Record<string, string>;
  inspirations: Array<{ type: string; value: string; preview?: string }>;
  description: string;
  modelTier?: ModelTier;
}

// Stage labels and order for progress display
const STAGE_CONFIG: Record<string, { label: string; percent: number }> = {
  intent: { label: 'Analyzing Intent', percent: 0 },
  architecture: { label: 'Designing Architecture', percent: 25 },
  code: { label: 'Generating Code', percent: 50 },
  context: { label: 'Building Context', percent: 50 }, // Runs parallel with code
};

interface ProgressState {
  stage: string;
  message: string;
  percent: number;
  isActive: boolean;
}

function getUserId(): string {
  if (typeof window === "undefined") return "server-user";
  let userId = localStorage.getItem("dawson-collab-user-id");
  if (!userId) {
    userId = `user-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("dawson-collab-user-id", userId);
  }
  return userId;
}

export function ProjectGenerator({
  template,
  integrations,
  inspirations,
  description,
  modelTier = 'balanced',
}: ProjectGeneratorProps) {
  const {
    userApiKey,
    remainingDemoGenerations,
    projectName,
    vision,
    mission,
    setRemainingDemoGenerations,
  } = useConfiguratorStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProjectGenerationResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({
    stage: '',
    message: '',
    percent: 0,
    isActive: false,
  });

  // Track completed stages for progress calculation
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());

  // Progress callback for streaming
  const handleProgress = useCallback((event: StreamProgressEvent) => {
    const stageConfig = STAGE_CONFIG[event.stage] || { label: event.stage, percent: 0 };
    
    if (event.eventType === 'start') {
      setProgress({
        stage: event.stage,
        message: event.message || stageConfig.label + '...',
        percent: stageConfig.percent,
        isActive: true,
      });
    } else if (event.eventType === 'complete') {
      setCompletedStages(prev => new Set([...prev, event.stage]));
      
      // Calculate percent based on completed stages
      // intent=25%, architecture=25%, code+context=50% (run parallel)
      let percent = 0;
      setCompletedStages(prev => {
        const updated = new Set([...prev, event.stage]);
        if (updated.has('intent')) percent += 25;
        if (updated.has('architecture')) percent += 25;
        if (updated.has('code') || updated.has('context')) percent += 25;
        if (updated.has('code') && updated.has('context')) percent += 25;
        return updated;
      });
      
      setProgress(prev => ({
        ...prev,
        message: event.message || stageConfig.label + ' complete',
        percent: Math.min(percent, 95), // Cap at 95 until fully done
      }));
    }
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setCompletedStages(new Set());
    setProgress({
      stage: '',
      message: 'Starting generation...',
      percent: 0,
      isActive: true,
    });

    try {
      const generationResult = await generateProject(
        {
          description: description || "A new web application",
          projectName: projectName || "MyApp",
          template,
          vision,
          mission,
          inspirations,
          userApiKey: userApiKey || undefined,
          sessionId: getUserId(),
          seed: undefined, // Allow variation
          modelTier,
        },
        handleProgress // Enable streaming with progress callback
      );

      if (!generationResult.success) {
        const errorResult = generationResult as ProjectGenerationError;
        setError(errorResult.message);

        if (errorResult.rateLimited && errorResult.remaining !== undefined) {
          setRemainingDemoGenerations(errorResult.remaining);
        }
        return;
      }

      const successResult = generationResult as ProjectGenerationResult;
      setResult(successResult);
      setProgress(prev => ({ ...prev, percent: 100, isActive: false }));

      if (successResult.remainingDemoGenerations !== undefined && successResult.remainingDemoGenerations !== null) {
        setRemainingDemoGenerations(successResult.remainingDemoGenerations);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate project");
    } finally {
      setIsGenerating(false);
      setProgress(prev => ({ ...prev, isActive: false }));
    }
  };

  const handleDownload = async () => {
    if (!result) return;

    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const projectFolderName = projectName || "MyApp";

      // Add all generated files
      for (const file of result.files) {
        zip.file(file.path, file.content);
      }

      // Add integration files
      for (const integration of result.integrationCode) {
        for (const file of integration.files) {
          zip.file(file.path, file.content);
        }
      }

      // Add Cursor context files
      zip.file(".cursorrules", result.cursorrules);
      zip.file("START_PROMPT.md", result.startPrompt);

      // Add README with quick start
      const readme = `# ${projectName || "MyApp"}

${description}

## Generated with Dawson Framework

This project was generated using AI-powered scaffolding.

### Template
${result.architecture.template}

### Features
${result.intent.features.map(f => `- ${f}`).join("\n")}

### Integrations
${Object.entries(result.architecture.integrations)
  .filter(([_, v]) => v)
  .map(([type, provider]) => `- **${type}**: ${provider}`)
  .join("\n")}

## Getting Started

1. **Read START_PROMPT.md** for detailed setup instructions
2. **Install dependencies**: \`npm install\`
3. **Configure environment**: Copy \`.env.example\` to \`.env.local\` and add your API keys
4. **Run dev server**: \`npm run dev\`

## Open in Cursor

For the best development experience:
1. Open this folder in Cursor IDE
2. Cursor will automatically load the .cursorrules configuration
3. Read START_PROMPT.md for suggested next steps
4. Use Cursor's AI assistance to continue building

## Architecture

### Pages
${result.architecture.pages.map(p => `- ${p.path}: ${p.description}`).join("\n")}

### Custom Components
${result.architecture.components
  .filter(c => c.template === "create-new")
  .map(c => `- ${c.name}: ${c.description}`)
  .join("\n")}

### API Routes
${result.architecture.routes.map(r => `- ${r.method || "GET"} ${r.path}: ${r.description}`).join("\n")}

---

Generated on ${new Date(result.generatedAt).toLocaleString()}
`;

      zip.file("README.md", readme);

      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${projectFolderName}.zip`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ZIP file");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            AI Project Generator
          </h3>
          <p className="text-sm text-muted-foreground">
            Generate a complete project scaffold with code, architecture, and Cursor context
          </p>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !description}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Project...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Complete Project
          </>
        )}
      </Button>

      {/* Progress Display */}
      {isGenerating && progress.isActive && (
        <div className="border rounded-lg p-4 space-y-3 bg-card">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              {progress.message}
            </span>
            <span className="text-muted-foreground">
              {progress.percent}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress.percent}%` }}
            />
          </div>

          {/* Stage indicators */}
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span className={completedStages.has('intent') ? 'text-primary font-medium' : progress.stage === 'intent' ? 'text-foreground' : ''}>
              Intent
            </span>
            <span className={completedStages.has('architecture') ? 'text-primary font-medium' : progress.stage === 'architecture' ? 'text-foreground' : ''}>
              Architecture
            </span>
            <span className={completedStages.has('code') ? 'text-primary font-medium' : progress.stage === 'code' ? 'text-foreground' : ''}>
              Code
            </span>
            <span className={completedStages.has('context') ? 'text-primary font-medium' : progress.stage === 'context' ? 'text-foreground' : ''}>
              Context
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Generation Failed</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Success Display */}
      {result && (
        <div className="border rounded-lg p-6 space-y-4 bg-card">
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <h4 className="font-semibold">Project Generated Successfully!</h4>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Template</p>
              <p className="font-medium">{result.intent.suggestedTemplate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Complexity</p>
              <p className="font-medium capitalize">{result.intent.complexity}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Files Generated</p>
              <p className="font-medium">{result.files.length} files</p>
            </div>
            <div>
              <p className="text-muted-foreground">Confidence</p>
              <p className="font-medium">{Math.round(result.intent.confidence * 100)}%</p>
            </div>
          </div>

          {/* Features */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Detected Features</p>
            <div className="flex flex-wrap gap-2">
              {result.intent.features.slice(0, 5).map((feature, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Architecture Summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{result.architecture.pages.length}</p>
              <p className="text-xs text-muted-foreground">Pages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {result.architecture.components.filter(c => c.template === "create-new").length}
              </p>
              <p className="text-xs text-muted-foreground">Components</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{result.architecture.routes.length}</p>
              <p className="text-xs text-muted-foreground">API Routes</p>
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full"
            size="lg"
            variant="default"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating ZIP...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Project ZIP
              </>
            )}
          </Button>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-md p-4 text-sm space-y-2">
            <p className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Next Steps:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Download the ZIP file</li>
              <li>Extract it to your desired location</li>
              <li>Open the folder in Cursor IDE</li>
              <li>Read <code className="bg-muted px-1 py-0.5 rounded">START_PROMPT.md</code> for setup instructions</li>
              <li>Run <code className="bg-muted px-1 py-0.5 rounded">npm install</code> and start building!</li>
            </ol>
          </div>

          {result.cached && (
            <p className="text-xs text-muted-foreground text-center">
              ⚡ Served from cache (generated {new Date(result.generatedAt).toLocaleTimeString()})
            </p>
          )}
        </div>
      )}

      {/* Rate Limit Info */}
      {!userApiKey && remainingDemoGenerations !== null && (
        <p className="text-xs text-muted-foreground text-center">
          Demo generations remaining: {remainingDemoGenerations}
        </p>
      )}
    </div>
  );
}
