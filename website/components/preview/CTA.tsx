"use client";

import { cn } from "@/lib/utils";

interface CTAProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  variant?: "gradient" | "solid" | "outlined";
}

/**
 * CTA component using CSS custom properties for branding
 */
export function CTA({
  title,
  subtitle,
  buttonText,
  variant = "gradient",
}: CTAProps) {
  // Build background style based on variant
  const getBackgroundStyle = () => {
    if (variant === "outlined") {
      return { backgroundColor: 'var(--preview-background, #0A0A0A)' };
    }
    if (variant === "solid") {
      return { backgroundColor: 'var(--preview-primary, #F97316)' };
    }
    // gradient
    return { 
      background: `linear-gradient(to right, var(--preview-secondary, #EA580C), var(--preview-primary, #F97316), var(--preview-secondary, #EA580C))` 
    };
  };

  return (
    <section
      className="w-full px-6 py-20"
      style={getBackgroundStyle()}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ 
              color: variant === "outlined" 
                ? 'var(--preview-muted, #78716C)' 
                : 'rgba(255,255,255,0.8)' 
            }}
          >
            {subtitle}
          </p>
        )}
        <button
          className={cn(
            "px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90",
            variant === "outlined" ? "text-white" : ""
          )}
          style={
            variant === "outlined" 
              ? { 
                  background: `linear-gradient(to right, var(--preview-primary, #F97316), var(--preview-accent, #FB923C))`,
                }
              : { 
                  backgroundColor: '#FAFAF9',
                  color: 'var(--preview-primary, #F97316)',
                }
          }
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
}

