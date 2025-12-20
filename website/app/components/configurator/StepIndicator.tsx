"use client";

import { Check } from "lucide-react";
import { Step } from "@/lib/configurator-state";

const STEPS = [
  { number: 1, label: "Template" },
  { number: 2, label: "Inspiration" },
  { number: 3, label: "Project" },
  { number: 4, label: "Integrations" },
  { number: 5, label: "Environment" },
  { number: 6, label: "Preview" },
  { number: 7, label: "Context" },
  { number: 8, label: "Export" },
] as const;

interface StepIndicatorProps {
  currentStep: Step;
  completedSteps: Set<Step>;
  onStepClick?: (step: Step) => void;
}

export function StepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step.number as Step);
          const isCurrent = currentStep === step.number;
          const isClickable = isCompleted || isCurrent;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step circle */}
              <button
                onClick={() => isClickable && onStepClick?.(step.number as Step)}
                disabled={!isClickable}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full
                  border-2 font-mono text-sm transition-all
                  ${
                    isCurrent
                      ? "border-terminal-accent bg-terminal-accent text-terminal-bg font-bold"
                      : isCompleted
                      ? "border-terminal-text bg-terminal-text text-terminal-bg cursor-pointer hover:scale-110"
                      : "border-terminal-text/30 text-terminal-dim"
                  }
                  ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}
                `}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </button>

              {/* Step label */}
              <div
                className={`
                  hidden md:block ml-2 text-xs font-mono whitespace-nowrap
                  ${
                    isCurrent
                      ? "text-terminal-accent font-bold"
                      : isCompleted
                      ? "text-terminal-text"
                      : "text-terminal-dim"
                  }
                `}
              >
                {step.label}
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 md:mx-4 transition-colors
                    ${
                      isCompleted
                        ? "bg-terminal-text"
                        : "bg-terminal-text/30"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile step label */}
      <div className="md:hidden text-center mt-4">
        <span className="text-terminal-accent font-mono text-sm font-bold">
          Step {currentStep}: {STEPS[currentStep - 1].label}
        </span>
      </div>
    </div>
  );
}
