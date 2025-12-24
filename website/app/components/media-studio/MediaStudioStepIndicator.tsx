"use client";

import { Check } from "lucide-react";
import { MediaStudioStep } from "@/lib/media-studio-state";

interface Step {
  number: number;
  label: string;
  description: string;
}

interface MediaStudioStepIndicatorProps {
  steps: readonly Step[];
  currentStep: MediaStudioStep;
  completedSteps: Set<MediaStudioStep>;
  onStepClick?: (step: MediaStudioStep) => void;
}

export function MediaStudioStepIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: MediaStudioStepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.number as MediaStudioStep);
          const isCurrent = currentStep === step.number;
          const isClickable = isCompleted || isCurrent || step.number < currentStep;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step circle and content */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick?.(step.number as MediaStudioStep)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full
                    border-2 font-mono text-sm transition-all
                    ${
                      isCurrent
                        ? "border-terminal-accent bg-terminal-accent text-terminal-bg font-bold shadow-lg shadow-terminal-accent/30"
                        : isCompleted
                        ? "border-green-500 bg-green-500 text-white cursor-pointer hover:scale-110"
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
                <div className="mt-2 text-center">
                  <p
                    className={`
                      text-xs font-mono whitespace-nowrap
                      ${
                        isCurrent
                          ? "text-terminal-accent font-bold"
                          : isCompleted
                          ? "text-green-500"
                          : "text-terminal-dim"
                      }
                    `}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-terminal-dim/70 hidden md:block mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-colors
                    ${
                      isCompleted
                        ? "bg-green-500"
                        : "bg-terminal-text/20"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile step description */}
      <div className="md:hidden text-center mt-4">
        <span className="text-terminal-accent font-mono text-sm font-bold">
          Step {currentStep}: {steps[currentStep - 1].label}
        </span>
        <p className="text-terminal-dim text-xs mt-1">
          {steps[currentStep - 1].description}
        </p>
      </div>
    </div>
  );
}

