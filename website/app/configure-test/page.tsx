"use client";

import { StepIndicator } from "@/app/components/configurator/StepIndicator";
import { ModeToggle } from "@/app/components/configurator/ModeToggle";
import { TemplateSelector } from "@/app/components/configurator/TemplateSelector";
import { InspirationUpload } from "@/app/components/configurator/InspirationUpload";
import { ProjectDetails } from "@/app/components/configurator/ProjectDetails";
import { IntegrationSelector } from "@/app/components/configurator/IntegrationSelector";
import { EnvironmentKeys } from "@/app/components/configurator/EnvironmentKeys";
import { AIPreview } from "@/app/components/configurator/AIPreview";
import { ProjectGenerator } from "@/app/components/configurator/ProjectGenerator";
import { ContextFields } from "@/app/components/configurator/ContextFields";
import { ExportView } from "@/app/components/configurator/ExportView";

export default function ConfigureTestPage() {
  return (
    <div className="p-4">
      <h1>Component Import Test</h1>
      <p>If you see this, all imports work!</p>
      <p>StepIndicator: {typeof StepIndicator}</p>
      <p>ModeToggle: {typeof ModeToggle}</p>
      <p>TemplateSelector: {typeof TemplateSelector}</p>
      <p>InspirationUpload: {typeof InspirationUpload}</p>
      <p>ProjectDetails: {typeof ProjectDetails}</p>
      <p>IntegrationSelector: {typeof IntegrationSelector}</p>
      <p>EnvironmentKeys: {typeof EnvironmentKeys}</p>
      <p>AIPreview: {typeof AIPreview}</p>
      <p>ProjectGenerator: {typeof ProjectGenerator}</p>
      <p>ContextFields: {typeof ContextFields}</p>
      <p>ExportView: {typeof ExportView}</p>
    </div>
  );
}
