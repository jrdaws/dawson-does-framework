"use client";

import { Label } from "@/components/ui/label";
import { TEMPLATES, INTEGRATION_INFO, type IntegrationType } from "@/lib/templates";
import { AlertCircle, Check } from "lucide-react";

interface IntegrationSelectorProps {
  template: string;
  integrations: Record<string, string>;
  onIntegrationChange: (type: string, provider: string) => void;
  mode: "beginner" | "advanced";
}

export function IntegrationSelector({
  template,
  integrations,
  onIntegrationChange,
  mode,
}: IntegrationSelectorProps) {
  const selectedTemplate = TEMPLATES[template as keyof typeof TEMPLATES];

  if (!selectedTemplate) {
    return (
      <div className="text-center text-terminal-error">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>Invalid template selected</p>
      </div>
    );
  }

  const missingRequired = selectedTemplate.requiredIntegrations.filter(
    (type) => !integrations[type]
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-terminal-text mb-2">
          Select Integrations
        </h2>
        <p className="text-terminal-dim">
          Choose the services you want to integrate
          {mode === "beginner" && " (recommended options highlighted)"}
        </p>
        {selectedTemplate.requiredIntegrations.length > 0 && (
          <p className="text-terminal-accent text-sm mt-2">
            * Required: {selectedTemplate.requiredIntegrations.join(", ")}
          </p>
        )}
      </div>

      {/* Missing Required Warning */}
      {missingRequired.length > 0 && (
        <div className="max-w-2xl mx-auto terminal-window border-terminal-error/50">
          <div className="terminal-header">
            <div className="terminal-dot bg-terminal-error"></div>
            <div className="terminal-dot bg-terminal-warning"></div>
            <div className="terminal-dot bg-terminal-text"></div>
            <span className="text-xs text-terminal-error ml-2">Missing Required Integrations</span>
          </div>
          <div className="terminal-content">
            <div className="flex items-start gap-2 text-terminal-error text-sm">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold mb-1">Please select:</p>
                <ul className="list-disc list-inside space-y-1 font-mono text-xs">
                  {missingRequired.map((type) => (
                    <li key={type}>{type}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 max-w-4xl mx-auto">
        {Object.entries(selectedTemplate.supportedIntegrations).map(([type, providers]) => {
          const isRequired = selectedTemplate.requiredIntegrations.includes(type);
          const selectedProvider = integrations[type];

          return (
            <div key={type} className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot bg-terminal-error"></div>
                <div className="terminal-dot bg-terminal-warning"></div>
                <div className="terminal-dot bg-terminal-text"></div>
                <span className="text-xs text-terminal-dim ml-2">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {isRequired && <span className="text-terminal-error ml-2">* Required</span>}
                </span>
              </div>
              <div className="terminal-content">
                <Label className="text-terminal-accent capitalize font-display text-lg mb-4 block">
                  {type}
                  {isRequired && <span className="text-terminal-error ml-2">*</span>}
                </Label>

                <div className="grid md:grid-cols-2 gap-3">
                  {providers.map((provider) => {
                    const info = INTEGRATION_INFO[type as IntegrationType]?.[provider];
                    if (!info) return null;

                    const isSelected = selectedProvider === provider;
                    const isDefault = selectedTemplate.defaultIntegrations?.[type] === provider;
                    const showRecommended = mode === "beginner" && isDefault;

                    return (
                      <button
                        key={provider}
                        onClick={() => onIntegrationChange(type, isSelected ? "" : provider)}
                        className={`
                          p-4 rounded border-2 transition-all text-left relative
                          hover:scale-105
                          ${
                            isSelected
                              ? "border-terminal-accent bg-terminal-accent/10 shadow-lg shadow-terminal-accent/20"
                              : "border-terminal-text/30 hover:border-terminal-text/50"
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-mono text-sm text-terminal-text font-bold">
                                {info.name}
                              </div>
                              {isSelected && (
                                <Check className="h-4 w-4 text-terminal-accent" />
                              )}
                            </div>
                            <div className="text-xs text-terminal-dim">
                              {info.description}
                            </div>
                          </div>
                          {showRecommended && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-terminal-accent/20 border border-terminal-accent/50 rounded text-xs text-terminal-accent font-mono whitespace-nowrap">
                              Recommended
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Integrations Summary */}
      {Object.keys(integrations).length > 0 && (
        <div className="max-w-2xl mx-auto terminal-window border-terminal-accent/30">
          <div className="terminal-header">
            <div className="terminal-dot bg-terminal-error"></div>
            <div className="terminal-dot bg-terminal-warning"></div>
            <div className="terminal-dot bg-terminal-text"></div>
            <span className="text-xs text-terminal-accent ml-2">Selected Integrations</span>
          </div>
          <div className="terminal-content">
            <div className="flex flex-wrap gap-2">
              {Object.entries(integrations)
                .filter(([_, provider]) => provider)
                .map(([type, provider]) => (
                  <div
                    key={type}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded bg-terminal-accent/10 border border-terminal-accent/30 text-xs font-mono"
                  >
                    <span className="text-terminal-dim">{type}:</span>
                    <span className="text-terminal-accent font-bold">{provider}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
