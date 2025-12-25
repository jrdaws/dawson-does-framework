"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Check, Github, Database, Rocket } from "lucide-react";

// Custom SVG icon component
interface SectionIconProps {
  sectionId: string;
  className?: string;
}

function SectionIcon({ sectionId, className }: SectionIconProps) {
  // Map section IDs to custom SVG icons
  const customIconSections = ["research", "core-features", "integrate-ai", "cursor", "claude-code"];
  
  if (customIconSections.includes(sectionId)) {
    const iconPath = `/images/configurator/sections/${
      sectionId === "core-features" ? "features" : 
      sectionId === "integrate-ai" ? "ai" : 
      sectionId
    }.svg`;
    
    return (
      <Image
        src={iconPath}
        alt={sectionId}
        width={20}
        height={20}
        className={cn("text-current", className)}
        style={{ filter: "currentcolor" }}
      />
    );
  }
  
  // Fallback to Lucide icons for sections without custom icons
  switch (sectionId) {
    case "github":
      return <Github className={cn("h-5 w-5", className)} />;
    case "supabase":
      return <Database className={cn("h-5 w-5", className)} />;
    case "vercel":
      return <Rocket className={cn("h-5 w-5", className)} />;
    default:
      return null;
  }
}

// Sidebar navigation sections matching 5DaySprint design
export interface NavSection {
  id: string;
  label: string;
  description: string;
  stepNumber: number;
  badge?: string | number;
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "research",
    label: "Research",
    description: "Define your project vision",
    stepNumber: 1,
  },
  {
    id: "core-features",
    label: "Core Features",
    description: "Select features for your project",
    stepNumber: 2,
  },
  {
    id: "integrate-ai",
    label: "Integrate AI",
    description: "Add AI capabilities to your project",
    stepNumber: 3,
  },
  {
    id: "cursor",
    label: "Cursor",
    description: "Download & Install Cursor",
    stepNumber: 4,
  },
  {
    id: "github",
    label: "GitHub",
    description: "Create your GitHub repository",
    stepNumber: 5,
  },
  {
    id: "claude-code",
    label: "Claude Code",
    description: "Install Claude Code CLI for AI assistance",
    stepNumber: 6,
  },
  {
    id: "supabase",
    label: "Supabase",
    description: "Configure your Supabase project",
    stepNumber: 7,
  },
  {
    id: "vercel",
    label: "Vercel",
    description: "Deploy your application",
    stepNumber: 8,
  },
];

// Storage key for expanded state
const STORAGE_KEY = "accordion-sidebar-expanded";

export type StepState = "completed" | "current" | "pending";

export interface SectionBadges {
  [sectionId: string]: string | number | undefined;
}

interface AccordionSidebarProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepChange: (step: number) => void;
  className?: string;
  /** Render function for section content - receives sectionId */
  children?: (sectionId: string) => React.ReactNode;
  /** Badge counts/text per section */
  sectionBadges?: SectionBadges;
}

export function AccordionSidebar({
  currentStep,
  completedSteps,
  onStepChange,
  className,
  children,
  sectionBadges = {},
}: AccordionSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Get section ID for current step
  const getCurrentSectionId = () => {
    const section = NAV_SECTIONS.find((s) => s.stepNumber === currentStep);
    return section?.id || NAV_SECTIONS[0].id;
  };

  // Load expanded state from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setExpandedSections(JSON.parse(saved));
      } catch {
        // Invalid JSON, use default
        setExpandedSections([getCurrentSectionId()]);
      }
    } else {
      // Default: expand current section
      setExpandedSections([getCurrentSectionId()]);
    }
  }, []);

  // Save expanded state to localStorage
  useEffect(() => {
    if (mounted && expandedSections.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedSections));
    }
  }, [expandedSections, mounted]);

  // Auto-expand current section when step changes
  useEffect(() => {
    if (mounted) {
      const currentSectionId = getCurrentSectionId();
      if (!expandedSections.includes(currentSectionId)) {
        setExpandedSections([currentSectionId]);
      }
    }
  }, [currentStep, mounted]);

  // Handle section click - navigate to step
  const handleSectionClick = (section: NavSection) => {
    onStepChange(section.stepNumber);
  };

  // Determine step state
  const getStepState = (stepNumber: number): StepState => {
    if (completedSteps.has(stepNumber)) return "completed";
    if (stepNumber === currentStep) return "current";
    return "pending";
  };

  if (!mounted) {
    return (
      <aside className={cn("hidden md:flex flex-col w-[300px] bg-stone-50 border-r border-stone-200", className)}>
        <div className="h-14 flex items-center px-4 border-b border-stone-200">
          <span className="font-bold text-[#F97316]">Loading...</span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-[320px] bg-[var(--surface)] border-r border-[var(--border)] shadow-sm h-screen",
        className
      )}
    >
      {/* Logo/Brand area */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold text-sm">D</div>
          <span className="font-bold text-[var(--text-primary)] text-lg">Dawson Does</span>
        </div>
        <span className="text-xs text-[var(--text-secondary)]">
          {completedSteps.size}/{NAV_SECTIONS.length}
        </span>
      </div>

      {/* Accordion Navigation */}
      <ScrollArea className="flex-1">
        <Accordion
          type="multiple"
          value={expandedSections}
          onValueChange={setExpandedSections}
          className="w-full"
        >
          {NAV_SECTIONS.map((section) => {
            const state = getStepState(section.stepNumber);
            const isActive = section.stepNumber === currentStep;
            const isExpanded = expandedSections.includes(section.id);
            const badge = sectionBadges[section.id];

            return (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-b border-stone-100"
              >
                <AccordionTrigger
                  onClick={() => handleSectionClick(section)}
                  className={cn(
                    "relative px-4 py-3 hover:bg-stone-50 hover:no-underline group",
                    isActive && "bg-[#F97316]/5"
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#F97316] rounded-r" />
                  )}

                  <div className="flex items-center gap-3 flex-1">
                    {/* Status indicator or icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                        state === "completed" && "bg-emerald-100 text-emerald-600",
                        state === "current" && "bg-[#F97316]/10 text-[#F97316]",
                        state === "pending" && "bg-stone-100 text-stone-400"
                      )}
                    >
                      {state === "completed" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <SectionIcon sectionId={section.id} />
                      )}
                    </div>

                    {/* Label and description */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-medium text-sm",
                            state === "completed" && "text-emerald-600",
                            state === "current" && "text-[#F97316]",
                            state === "pending" && "text-stone-600"
                          )}
                        >
                          {section.label}
                        </span>
                        {badge !== undefined && (
                          <Badge 
                            variant={state === "completed" ? "success" : "secondary"} 
                            className="h-5 px-1.5 text-xs"
                          >
                            {badge}
                          </Badge>
                        )}
                        {state === "completed" && !badge && (
                          <Badge variant="success" className="h-5 px-1.5 text-xs">
                            Ready
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-stone-500">
                        {section.description}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4 pt-0">
                  <div className="pl-11 text-sm text-stone-600">
                    {children ? children(section.id) : (
                      <p className="text-stone-500 italic">
                        Click to configure {section.label.toLowerCase()}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>

      {/* Progress footer */}
      <div className="p-4 border-t border-stone-200 bg-stone-50 shrink-0">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-stone-600">Progress</span>
          <span className="font-medium text-[#F97316]">
            {Math.round((completedSteps.size / NAV_SECTIONS.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#F97316] transition-all duration-300 rounded-full"
            style={{ width: `${(completedSteps.size / NAV_SECTIONS.length) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

export { NAV_SECTIONS, SectionIcon };
