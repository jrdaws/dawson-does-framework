"use client";

import { useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu, Check, Github, Database, Rocket, CreditCard, Mail, BarChart3, Shield, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Step } from "@/lib/configurator-state";

// Sidebar navigation sections matching AccordionSidebar
interface NavSection {
  id: string;
  label: string;
  description: string;
  stepNumber: number;
}

const NAV_SECTIONS: NavSection[] = [
  // Setup Phase (1-4)
  { id: "template", label: "Template", description: "Choose your starting template", stepNumber: 1 },
  { id: "research", label: "Research", description: "Industry & inspiration", stepNumber: 2 },
  { id: "branding", label: "Branding", description: "Colors & identity", stepNumber: 3 },
  { id: "core-features", label: "Features", description: "Select core features", stepNumber: 4 },
  // Configure Phase (5-10)
  { id: "integrate-ai", label: "AI", description: "Add AI capabilities", stepNumber: 5 },
  { id: "payments", label: "Payments", description: "Accept payments", stepNumber: 6 },
  { id: "email", label: "Email", description: "Send emails", stepNumber: 7 },
  { id: "analytics", label: "Analytics", description: "Track users", stepNumber: 8 },
  { id: "auth-provider", label: "Auth", description: "User authentication", stepNumber: 9 },
  { id: "project-setup", label: "Project", description: "Name & output", stepNumber: 10 },
  // Launch Phase (11-15)
  { id: "cursor", label: "Cursor", description: "AI code editor", stepNumber: 11 },
  { id: "github", label: "GitHub", description: "Code repository", stepNumber: 12 },
  { id: "supabase", label: "Supabase", description: "Database & storage", stepNumber: 13 },
  { id: "vercel", label: "Vercel", description: "Deploy & host", stepNumber: 14 },
  { id: "export", label: "Export", description: "Generate & download", stepNumber: 15 },
];

// Custom SVG icon component (matching AccordionSidebar)
function SectionIcon({ sectionId, className }: { sectionId: string; className?: string }) {
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
        width={18}
        height={18}
        className={cn("text-current", className)}
      />
    );
  }
  
  // Fallback to Lucide icons
  switch (sectionId) {
    case "github":
      return <Github className={cn("h-[18px] w-[18px]", className)} />;
    case "supabase":
      return <Database className={cn("h-[18px] w-[18px]", className)} />;
    case "vercel":
      return <Rocket className={cn("h-[18px] w-[18px]", className)} />;
    case "payments":
      return <CreditCard className={cn("h-[18px] w-[18px]", className)} />;
    case "email":
      return <Mail className={cn("h-[18px] w-[18px]", className)} />;
    case "analytics":
      return <BarChart3 className={cn("h-[18px] w-[18px]", className)} />;
    case "auth-provider":
      return <Shield className={cn("h-[18px] w-[18px]", className)} />;
    case "project-setup":
      return <Settings className={cn("h-[18px] w-[18px]", className)} />;
    default:
      return null;
  }
}

// Group sections by phase for organization
const PHASE_GROUPS = [
  { 
    id: "setup", 
    label: "Setup", 
    sections: ["template", "research", "branding", "core-features"] 
  },
  { 
    id: "configure", 
    label: "Configure", 
    sections: ["integrate-ai", "payments", "email", "analytics", "auth-provider", "project-setup"] 
  },
  { 
    id: "launch", 
    label: "Launch", 
    sections: ["cursor", "github", "supabase", "vercel", "export"] 
  },
];

interface MobileSidebarProps {
  currentStep: Step;
  completedSteps: Set<number>;
  onStepChange: (step: Step) => void;
  sectionBadges?: Record<string, string | number | undefined>;
  children?: (sectionId: string) => React.ReactNode;
}

export function MobileSidebar({
  currentStep,
  completedSteps,
  onStepChange,
  sectionBadges = {},
  children,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Get section ID for current step
  const getCurrentSectionId = () => {
    const section = NAV_SECTIONS.find((s) => s.stepNumber === currentStep);
    return section?.id || NAV_SECTIONS[0].id;
  };

  // Calculate progress percentage
  const progress = (completedSteps.size / NAV_SECTIONS.length) * 100;

  const handleSectionClick = (section: NavSection) => {
    onStepChange(section.stepNumber as Step);
    // Don't close sheet - let user browse content
  };

  // Determine step state
  const getStepState = (stepNumber: number): "completed" | "current" | "pending" => {
    if (completedSteps.has(stepNumber)) return "completed";
    if (stepNumber === currentStep) return "current";
    return "pending";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 bg-card flex flex-col border-r border-border">
        <SheetHeader className="p-4 border-b border-border shrink-0">
          <SheetTitle className="flex items-center justify-between">
            <span className="text-primary font-bold text-lg">Dawson Does</span>
            <span className="text-xs text-foreground-muted">
              {completedSteps.size}/{NAV_SECTIONS.length} complete
            </span>
          </SheetTitle>
        </SheetHeader>

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
              const badge = sectionBadges[section.id];

              return (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border-b border-border"
                >
                  <AccordionTrigger
                    onClick={() => handleSectionClick(section)}
                    className={cn(
                      "relative px-4 py-3 hover:bg-background-alt hover:no-underline",
                      isActive && "bg-primary/10"
                    )}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r" />
                    )}

                    <div className="flex items-center gap-3 flex-1">
                      {/* Status indicator or icon */}
                      <div
                        className={cn(
                          "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
                          state === "completed" && "bg-success/20 text-success",
                          state === "current" && "bg-primary/10 text-primary",
                          state === "pending" && "bg-background-alt text-foreground-muted"
                        )}
                      >
                        {state === "completed" ? (
                          <Check className="h-3.5 w-3.5" />
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
                              state === "completed" && "text-success",
                              state === "current" && "text-primary",
                              state === "pending" && "text-foreground-secondary"
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
                              ✓
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-foreground-muted truncate max-w-[180px]">
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="pl-10 text-sm text-foreground-secondary">
                      {children ? children(section.id) : (
                        <p className="text-foreground-muted italic text-xs">
                          Tap to configure {section.label.toLowerCase()}
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </ScrollArea>

        {/* Footer with progress */}
        <div className="p-4 border-t border-border bg-card shrink-0">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-foreground-secondary">Progress</span>
            <span className="font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
