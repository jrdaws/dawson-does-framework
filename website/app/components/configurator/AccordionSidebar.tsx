"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Search, Layers, Cpu, MousePointer, Github, Terminal, Database, Rocket } from "lucide-react";

// Sidebar navigation sections matching 5DaySprint design
interface NavSection {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  stepNumber: number;
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "research",
    icon: <Search className="h-5 w-5" />,
    label: "Research",
    description: "Define your project vision",
    stepNumber: 1,
  },
  {
    id: "core-features",
    icon: <Layers className="h-5 w-5" />,
    label: "Core Features",
    description: "Select features for your project",
    stepNumber: 2,
  },
  {
    id: "integrate-ai",
    icon: <Cpu className="h-5 w-5" />,
    label: "Integrate AI",
    description: "Add AI capabilities to your project",
    stepNumber: 3,
  },
  {
    id: "cursor",
    icon: <MousePointer className="h-5 w-5" />,
    label: "Cursor",
    description: "Download & Install Cursor",
    stepNumber: 4,
  },
  {
    id: "github",
    icon: <Github className="h-5 w-5" />,
    label: "GitHub",
    description: "Create your GitHub repository",
    stepNumber: 5,
  },
  {
    id: "claude-code",
    icon: <Terminal className="h-5 w-5" />,
    label: "Claude Code",
    description: "Install Claude Code CLI for AI assistance",
    stepNumber: 6,
  },
  {
    id: "supabase",
    icon: <Database className="h-5 w-5" />,
    label: "Supabase",
    description: "Configure your Supabase project",
    stepNumber: 7,
  },
  {
    id: "vercel",
    icon: <Rocket className="h-5 w-5" />,
    label: "Vercel",
    description: "Deploy your application",
    stepNumber: 8,
  },
];

// Storage key for expanded state
const STORAGE_KEY = "accordion-sidebar-expanded";

interface AccordionSidebarProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepChange: (step: number) => void;
  className?: string;
  children?: (sectionId: string) => React.ReactNode;
}

export function AccordionSidebar({
  currentStep,
  completedSteps,
  onStepChange,
  className,
  children,
}: AccordionSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

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

  // Get section ID for current step
  const getCurrentSectionId = () => {
    const section = NAV_SECTIONS.find((s) => s.stepNumber === currentStep);
    return section?.id || NAV_SECTIONS[0].id;
  };

  // Handle section click - navigate to step
  const handleSectionClick = (section: NavSection) => {
    onStepChange(section.stepNumber);
  };

  // Determine step state
  const getStepState = (stepNumber: number): "completed" | "current" | "pending" => {
    if (completedSteps.has(stepNumber)) return "completed";
    if (stepNumber === currentStep) return "current";
    return "pending";
  };

  if (!mounted) {
    return (
      <aside className={cn("hidden md:flex flex-col w-80 bg-white border-r border-slate-200", className)}>
        <div className="h-14 flex items-center px-4 border-b border-slate-200">
          <span className="font-bold text-[#0052FF]">Loading...</span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-80 bg-white border-r border-slate-200 shadow-sm",
        className
      )}
    >
      {/* Logo/Brand area */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200">
        <span className="font-bold text-[#0052FF] text-lg">Dawson Does</span>
        <span className="text-xs text-slate-500">
          {completedSteps.size}/{NAV_SECTIONS.length} complete
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

            return (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-b-0"
              >
                <AccordionTrigger
                  onClick={() => handleSectionClick(section)}
                  className={cn(
                    "relative px-4 py-3 hover:bg-slate-50 hover:no-underline group",
                    isActive && "bg-[#0052FF]/5"
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#0052FF] rounded-r" />
                  )}

                  <div className="flex items-center gap-3 flex-1">
                    {/* Status indicator or icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                        state === "completed" && "bg-emerald-100 text-emerald-600",
                        state === "current" && "bg-[#0052FF]/10 text-[#0052FF]",
                        state === "pending" && "bg-slate-100 text-slate-400"
                      )}
                    >
                      {state === "completed" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        section.icon
                      )}
                    </div>

                    {/* Label and description */}
                    <div className="flex-1 text-left">
                      <div
                        className={cn(
                          "font-medium text-sm",
                          state === "completed" && "text-emerald-600",
                          state === "current" && "text-[#0052FF]",
                          state === "pending" && "text-slate-600"
                        )}
                      >
                        {section.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        {section.description}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4 pt-0">
                  <div className="pl-11 text-sm text-slate-600">
                    {children ? children(section.id) : (
                      <p className="text-slate-500 italic">
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
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-600">Progress</span>
          <span className="font-medium text-[#0052FF]">
            {Math.round((completedSteps.size / NAV_SECTIONS.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0052FF] transition-all duration-300 rounded-full"
            style={{ width: `${(completedSteps.size / NAV_SECTIONS.length) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

export { NAV_SECTIONS };
export type { NavSection };

