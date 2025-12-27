"use client";

import { TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";

interface TemplateSectionProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

// Icons for each template
const TEMPLATE_ICONS: Record<string, string> = {
  saas: "🚀",
  ecommerce: "🛒",
  blog: "📝",
  portfolio: "💼",
  dashboard: "📊",
  landing: "🎯",
};

const TEMPLATE_LIST = Object.entries(TEMPLATES).map(([templateId, template]) => ({
  id: templateId,
  name: template.name,
  description: template.description,
  icon: TEMPLATE_ICONS[templateId] || "📦",
}));

export function TemplateSection({
  selectedTemplate,
  onTemplateChange,
}: TemplateSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--sidebar-text-muted)]">
        Choose a template to start with
      </p>
      
      <div className="space-y-2">
        {TEMPLATE_LIST.slice(0, 4).map((template) => {
          const isSelected = selectedTemplate === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => onTemplateChange(template.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all",
                isSelected
                  ? "bg-[var(--primary)]/10 border-[var(--primary)]/30"
                  : "bg-black/20 border-white/10 hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{template.icon}</span>
                  <span className={cn(
                    "font-medium text-sm",
                    isSelected ? "text-[var(--primary)]" : "text-white"
                  )}>
                    {template.name}
                  </span>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-[var(--primary)]" />
                )}
              </div>
              <p className="text-xs text-white/50 mt-1 ml-7">
                {template.description.slice(0, 50)}...
              </p>
            </button>
          );
        })}
      </div>
      
      {selectedTemplate && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
          <Sparkles className="h-3 w-3" />
          <span>Template selected</span>
        </div>
      )}
    </div>
  );
}

