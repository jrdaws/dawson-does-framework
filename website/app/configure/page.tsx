"use client";

import { useConfiguratorStore, Step } from "@/lib/configurator-state";
import { StepIndicator } from "@/app/components/configurator/StepIndicator";
import { ModeToggle } from "@/app/components/configurator/ModeToggle";
import { TemplateSelector } from "@/app/components/configurator/TemplateSelector";
import { ProjectDetails } from "@/app/components/configurator/ProjectDetails";
import { IntegrationSelector } from "@/app/components/configurator/IntegrationSelector";
import { ExportView } from "@/app/components/configurator/ExportView";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

export default function ConfigurePage() {
  const {
    currentStep,
    completedSteps,
    mode,
    template,
    projectName,
    outputDir,
    integrations,
    setStep,
    completeStep,
    setMode,
    setTemplate,
    setProjectName,
    setOutputDir,
    setIntegration,
  } = useConfiguratorStore();

  const selectedTemplate = TEMPLATES[template as keyof typeof TEMPLATES];

  // Validation for each step
  const canProceed = () => {
    switch (currentStep) {
      case 1: // Template selection
        return template !== "";
      case 2: // Inspiration (skipped for now)
        return true;
      case 3: // Project details
        const slugifiedName = projectName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        return (
          projectName.length > 0 &&
          /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slugifiedName) &&
          outputDir.length > 0 &&
          outputDir.startsWith("./")
        );
      case 4: // Integrations
        // Check if all required integrations are selected
        if (!selectedTemplate) return false;
        const missingRequired = selectedTemplate.requiredIntegrations.filter(
          (type) => !integrations[type]
        );
        return missingRequired.length === 0;
      case 5: // Environment (skipped for now)
        return true;
      case 6: // Preview (skipped for now)
        return true;
      case 7: // Context (skipped for now)
        return true;
      case 8: // Export
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;

    completeStep(currentStep);

    // Skip steps 2, 5, 6, 7 for now (Inspiration, Environment, Preview, Context)
    const skippedSteps = [2, 5, 6, 7];
    let nextStep = (currentStep + 1) as Step;

    while (skippedSteps.includes(nextStep) && nextStep < 8) {
      completeStep(nextStep);
      nextStep = (nextStep + 1) as Step;
    }

    if (nextStep <= 8) {
      setStep(nextStep);
    }
  };

  const handlePrevious = () => {
    // Skip steps 2, 5, 6, 7 when going backward
    const skippedSteps = [2, 5, 6, 7];
    let prevStep = (currentStep - 1) as Step;

    while (skippedSteps.includes(prevStep) && prevStep > 0) {
      prevStep = (prevStep - 1) as Step;
    }

    if (prevStep >= 1) {
      setStep(prevStep);
    }
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 8;

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
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={(step) => {
            // Only allow clicking on completed steps or current step
            if (completedSteps.has(step) || step === currentStep) {
              setStep(step);
            }
          }}
        />

        {/* Main Content */}
        <div className="min-h-[600px]">
          {currentStep === 1 && (
            <TemplateSelector
              selectedTemplate={template}
              onSelect={setTemplate}
            />
          )}

          {currentStep === 3 && (
            <ProjectDetails
              projectName={projectName}
              outputDir={outputDir}
              onProjectNameChange={setProjectName}
              onOutputDirChange={setOutputDir}
            />
          )}

          {currentStep === 4 && (
            <IntegrationSelector
              template={template}
              integrations={integrations}
              onIntegrationChange={setIntegration}
              mode={mode}
            />
          )}

          {currentStep === 8 && (
            <ExportView
              template={template}
              projectName={projectName}
              outputDir={outputDir}
              integrations={integrations}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between max-w-4xl mx-auto">
          <Button
            onClick={handlePrevious}
            disabled={isFirstStep}
            variant="outline"
            className="border-terminal-text/30 text-terminal-text hover:border-terminal-accent hover:text-terminal-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="text-center">
            {!canProceed() && currentStep !== 8 && (
              <p className="text-terminal-error text-sm font-mono">
                Complete this step to continue
              </p>
            )}
          </div>

          {!isLastStep ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-terminal-accent hover:bg-terminal-accent/80 text-terminal-bg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                // Reset configurator or provide option to start over
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-terminal-text hover:bg-terminal-text/80 text-terminal-bg"
            >
              Start Over
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
