"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEMPLATES, INTEGRATION_INFO, type TemplateId, type IntegrationType } from "@/lib/templates";
import { Copy, Check, Zap, Settings, Share2 } from "lucide-react";

type Mode = "beginner" | "advanced";

export default function ConfigurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>("beginner");
  const [template, setTemplate] = useState<TemplateId>("saas");
  const [projectDir, setProjectDir] = useState("./my-app");
  const [integrations, setIntegrations] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const selectedTemplate = TEMPLATES[template];

  // Generate command
  const generateCommand = () => {
    const parts = ["framework export", template, projectDir];

    Object.entries(integrations).forEach(([type, provider]) => {
      if (provider) {
        parts.push(`--${type} ${provider}`);
      }
    });

    return parts.join(" \\\n  ");
  };

  const command = generateCommand();

  const handleCopy = () => {
    navigator.clipboard.writeText(command.replace(/\\\n  /g, " "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  // Initialize state from URL params on mount
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    const urlTemplate = searchParams.get("template");
    const urlProjectDir = searchParams.get("dir");

    // Parse integrations from URL (format: auth=supabase&payments=stripe)
    const urlIntegrations: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== "mode" && key !== "template" && key !== "dir") {
        urlIntegrations[key] = value;
      }
    });

    // Restore state from URL if present
    if (urlMode === "beginner" || urlMode === "advanced") {
      setMode(urlMode);
    }
    if (urlTemplate && urlTemplate in TEMPLATES) {
      setTemplate(urlTemplate as TemplateId);
    }
    if (urlProjectDir) {
      setProjectDir(urlProjectDir);
    }
    if (Object.keys(urlIntegrations).length > 0) {
      setIntegrations(urlIntegrations);
    } else if (mode === "beginner" && selectedTemplate.defaultIntegrations) {
      // Only set defaults if no URL integrations
      setIntegrations(selectedTemplate.defaultIntegrations);
    }

    setIsInitialized(true);
  }, []); // Run only once on mount

  // Update URL when state changes (after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    params.set("mode", mode);
    params.set("template", template);
    if (projectDir !== "./my-app") {
      params.set("dir", projectDir);
    }

    // Add integrations to URL
    Object.entries(integrations).forEach(([type, provider]) => {
      if (provider) {
        params.set(type, provider);
      }
    });

    router.replace(`/configure?${params.toString()}`, { scroll: false });
  }, [mode, template, projectDir, integrations, isInitialized]);

  // Set default integrations when template or mode changes (only if initialized and no URL state)
  useEffect(() => {
    if (!isInitialized) return;

    // Check if we have URL integrations
    const hasUrlIntegrations = searchParams.has("auth") || searchParams.has("payments") ||
                               searchParams.has("email") || searchParams.has("db") ||
                               searchParams.has("ai") || searchParams.has("analytics");

    if (hasUrlIntegrations) return; // Don't override URL state

    if (mode === "beginner" && selectedTemplate.defaultIntegrations) {
      setIntegrations(selectedTemplate.defaultIntegrations);
    } else if (mode === "advanced") {
      // In advanced mode, start with empty selection
      setIntegrations({});
    }
  }, [template, mode, isInitialized]);

  return (
    <div className="min-h-screen bg-terminal-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold glow-text mb-4">
            Project Configurator
          </h1>
          <p className="text-terminal-dim text-lg mb-6">
            Configure your project and generate the CLI command
          </p>

          {/* Mode Toggle */}
          <div className="inline-flex items-center gap-2 bg-terminal-bg border-2 border-terminal-text/30 rounded-lg p-1">
            <button
              onClick={() => setMode("beginner")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-mono text-sm ${
                mode === "beginner"
                  ? "bg-terminal-accent text-terminal-bg font-bold"
                  : "text-terminal-text hover:text-terminal-accent"
              }`}
            >
              <Zap className="h-4 w-4" />
              Beginner
            </button>
            <button
              onClick={() => setMode("advanced")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-mono text-sm ${
                mode === "advanced"
                  ? "bg-terminal-accent text-terminal-bg font-bold"
                  : "text-terminal-text hover:text-terminal-accent"
              }`}
            >
              <Settings className="h-4 w-4" />
              Advanced
            </button>
          </div>

          {mode === "beginner" && (
            <p className="text-terminal-accent text-sm mt-4">
              Beginner mode: Recommended integrations pre-selected for you
            </p>
          )}
          {mode === "advanced" && (
            <p className="text-terminal-accent text-sm mt-4">
              Advanced mode: Full control over all configuration options
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Template Selection */}
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot bg-terminal-error"></div>
                <div className="terminal-dot bg-terminal-warning"></div>
                <div className="terminal-dot bg-terminal-text"></div>
                <span className="text-xs text-terminal-dim ml-2">Choose Template</span>
              </div>
              <div className="terminal-content space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.values(TEMPLATES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id as TemplateId)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        template === t.id
                          ? "border-terminal-accent bg-terminal-accent/10"
                          : "border-terminal-text/30 hover:border-terminal-text/50"
                      }`}
                    >
                      <h3 className="font-display font-bold text-lg text-terminal-text mb-2">
                        {t.name}
                      </h3>
                      <p className="text-sm text-terminal-dim">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot bg-terminal-error"></div>
                <div className="terminal-dot bg-terminal-warning"></div>
                <div className="terminal-dot bg-terminal-text"></div>
                <span className="text-xs text-terminal-dim ml-2">Project Details</span>
              </div>
              <div className="terminal-content space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectDir" className="text-terminal-text">
                    Project Directory
                  </Label>
                  <Input
                    id="projectDir"
                    value={projectDir}
                    onChange={(e) => setProjectDir(e.target.value)}
                    placeholder="./my-app"
                    className="bg-terminal-bg border-terminal-text/30 text-terminal-text"
                  />
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot bg-terminal-error"></div>
                <div className="terminal-dot bg-terminal-warning"></div>
                <div className="terminal-dot bg-terminal-text"></div>
                <span className="text-xs text-terminal-dim ml-2">
                  Integrations
                  {mode === "beginner" && " (Recommended selections pre-configured)"}
                  {selectedTemplate.requiredIntegrations.length > 0 && (
                    <span className="ml-2 text-terminal-error">
                      * Required: {selectedTemplate.requiredIntegrations.join(", ")}
                    </span>
                  )}
                </span>
              </div>
              <div className="terminal-content space-y-6">
                {Object.entries(selectedTemplate.supportedIntegrations).map(
                  ([type, providers]) => (
                    <div key={type} className="space-y-3">
                      <Label className="text-terminal-accent capitalize font-display">
                        {type}
                        {selectedTemplate.requiredIntegrations.includes(type) && (
                          <span className="text-terminal-error ml-1">*</span>
                        )}
                      </Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {providers.map((provider) => {
                          const info = INTEGRATION_INFO[type as IntegrationType]?.[provider];
                          if (!info) return null;

                          const isSelected = integrations[type] === provider;
                          const isDefault = selectedTemplate.defaultIntegrations?.[type] === provider;
                          const showRecommended = mode === "beginner" && isDefault;

                          return (
                            <button
                              key={provider}
                              onClick={() =>
                                setIntegrations((prev) => ({
                                  ...prev,
                                  [type]: isSelected ? "" : provider,
                                }))
                              }
                              className={`p-3 rounded border-2 transition-all text-left relative ${
                                isSelected
                                  ? "border-terminal-accent bg-terminal-accent/10"
                                  : "border-terminal-text/30 hover:border-terminal-text/50"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="font-mono text-sm text-terminal-text">
                                    {info.name}
                                  </div>
                                  <div className="text-xs text-terminal-dim mt-1">
                                    {info.description}
                                  </div>
                                </div>
                                {showRecommended && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/50 rounded text-xs text-terminal-accent font-mono whitespace-nowrap">
                                    <Zap className="h-3 w-3" />
                                    Recommended
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Command Generator */}
          <div className="lg:col-span-1">
            <div className="terminal-window sticky top-4">
              <div className="terminal-header">
                <div className="terminal-dot bg-terminal-error"></div>
                <div className="terminal-dot bg-terminal-warning"></div>
                <div className="terminal-dot bg-terminal-text"></div>
                <span className="text-xs text-terminal-dim ml-2">Generated Command</span>
              </div>
              <div className="terminal-content">
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="text-xs text-terminal-text bg-terminal-bg/50 p-4 rounded border border-terminal-text/20 overflow-x-auto">
                      <code>{command}</code>
                    </pre>
                  </div>

                  <Button
                    onClick={handleCopy}
                    className="w-full bg-terminal-accent hover:bg-terminal-accent/80 text-terminal-bg"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Command
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleShareUrl}
                    variant="outline"
                    className="w-full border-terminal-text/30 text-terminal-text hover:border-terminal-accent hover:text-terminal-accent hover:bg-terminal-accent/10"
                  >
                    {urlCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        URL Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Configuration
                      </>
                    )}
                  </Button>

                  <div className="border-t border-terminal-text/20 pt-4">
                    <p className="text-sm text-terminal-dim mb-2">Next steps:</p>
                    <ol className="text-xs text-terminal-dim space-y-1 list-decimal list-inside">
                      <li>Copy the command above</li>
                      <li>Open your terminal</li>
                      <li>Paste and run the command</li>
                      <li>Follow the setup instructions</li>
                    </ol>

                    <div className="mt-4 pt-4 border-t border-terminal-text/20">
                      <p className="text-xs text-terminal-accent mb-1 flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        Share this configuration
                      </p>
                      <p className="text-xs text-terminal-dim">
                        Click "Share Configuration" to copy a URL that preserves all your settings
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
