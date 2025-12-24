"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TEMPLATES, INTEGRATION_INFO, type IntegrationType } from "@/lib/templates";
import { AlertCircle, Check, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper type for integration info
interface IntegrationProviderInfo {
  name: string;
  description: string;
}

// Map integration types to category icons
const CATEGORY_ICONS: Record<string, string> = {
  auth: "/images/configurator/categories/auth.svg",
  payments: "/images/configurator/categories/payments.svg",
  email: "/images/configurator/categories/email.svg",
  db: "/images/configurator/categories/database.svg",
  ai: "/images/configurator/categories/ai.svg",
  analytics: "/images/configurator/categories/analytics.svg",
  storage: "/images/configurator/categories/storage.svg",
  other: "/images/configurator/categories/other.svg",
};

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
      <Card className="max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12 text-destructive">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Invalid template selected</p>
        </CardContent>
      </Card>
    );
  }

  const missingRequired = selectedTemplate.requiredIntegrations.filter(
    (type) => !integrations[type]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Select Integrations
        </h2>
        <p className="text-muted-foreground">
          Choose the services you want to integrate
          {mode === "beginner" && " (recommended options highlighted)"}
        </p>
        {selectedTemplate.requiredIntegrations.length > 0 && (
          <p className="text-sm mt-2">
            <Badge variant="destructive" className="mr-2">Required</Badge>
            {selectedTemplate.requiredIntegrations.join(", ")}
          </p>
        )}
      </div>

      {/* Missing Required Warning */}
      {missingRequired.length > 0 && (
        <Card className="max-w-2xl mx-auto border-destructive/50 bg-destructive/10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CircleAlert className="h-5 w-5 text-destructive" />
              <CardTitle className="text-base text-destructive">Missing Required Integrations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive/90 mb-2">Please select:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-destructive/80">
              {missingRequired.map((type) => (
                <li key={type} className="capitalize">{type}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Integration Cards */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {Object.entries(selectedTemplate.supportedIntegrations).map(([type, providers]) => {
          const requiredIntegrations = selectedTemplate.requiredIntegrations as readonly string[];
          const isRequired = requiredIntegrations.includes(type);
          const selectedProvider = integrations[type];

          return (
            <Card key={type}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {CATEGORY_ICONS[type] && (
                      <Image
                        src={CATEGORY_ICONS[type]}
                        alt={`${type} category`}
                        width={32}
                        height={32}
                        className="opacity-80"
                      />
                    )}
                    <CardTitle className="text-lg capitalize">{type}</CardTitle>
                  </div>
                  {isRequired && <Badge variant="destructive">Required</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedProvider || ""}
                  onValueChange={(value) => onIntegrationChange(type, value)}
                  className="grid md:grid-cols-2 gap-3"
                >
                  {providers.map((provider) => {
                    const typeInfo = INTEGRATION_INFO[type as IntegrationType] as Record<string, IntegrationProviderInfo> | undefined;
                    const info = typeInfo?.[provider];
                    if (!info) return null;

                    const isSelected = selectedProvider === provider;
                    const defaultIntegrations = selectedTemplate.defaultIntegrations as Record<string, string>;
                    const isDefault = defaultIntegrations?.[type] === provider;
                    const showRecommended = mode === "beginner" && isDefault;

                    return (
                      <Label
                        key={provider}
                        htmlFor={`${type}-${provider}`}
                        className={cn(
                          "flex items-start gap-4 rounded-lg border p-4 cursor-pointer transition-all",
                          "hover:bg-accent/10 hover:border-accent/50",
                          isSelected && "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        )}
                      >
                        <RadioGroupItem
                          value={provider}
                          id={`${type}-${provider}`}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{info.name}</span>
                            {isSelected && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                            {showRecommended && (
                              <Badge variant="success">Recommended</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Integrations Summary */}
      {Object.keys(integrations).length > 0 && (
        <Card className="max-w-2xl mx-auto border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Selected Integrations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(integrations)
                .filter(([, provider]) => provider)
                .map(([type, provider]) => (
                  <Badge key={type} variant="info" className="gap-2">
                    <span className="text-muted-foreground">{type}:</span>
                    <span className="font-bold">{provider}</span>
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
