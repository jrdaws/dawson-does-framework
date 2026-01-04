"use client";

import { cn } from "@/lib/utils";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaSecondaryText?: string;
  backgroundStyle?: "gradient" | "mesh" | "solid" | "image";
  alignment?: "center" | "left";
}

/**
 * Hero component that uses CSS custom properties for branding
 * Colors are set by PreviewRenderer via --preview-* variables
 */
export function Hero({
  title,
  subtitle,
  ctaText,
  ctaSecondaryText,
  backgroundStyle = "gradient",
  alignment = "center",
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative w-full min-h-[600px] flex items-center justify-center px-6 py-24"
      )}
      style={{
        backgroundColor: 'var(--preview-background, #0A0A0A)',
      }}
    >
      {/* Mesh overlay for mesh style */}
      {backgroundStyle === "mesh" && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, color-mix(in srgb, var(--preview-primary) 30%, transparent) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, color-mix(in srgb, var(--preview-secondary) 30%, transparent) 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Gradient orbs for gradient style - uses branding colors */}
      {backgroundStyle === "gradient" && (
        <>
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: 'var(--preview-primary, #F97316)' }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: 'var(--preview-accent, #FB923C)' }}
          />
        </>
      )}

      <div
        className={cn(
          "relative z-10 max-w-4xl mx-auto",
          alignment === "center" && "text-center",
          alignment === "left" && "text-left"
        )}
      >
        <h1 
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ color: 'var(--preview-foreground, #FFFFFF)' }}
        >
          {title}
        </h1>
        <p 
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          style={{ color: 'var(--preview-muted, #78716C)' }}
        >
          {subtitle}
        </p>
        <div
          className={cn(
            "flex gap-4",
            alignment === "center" && "justify-center",
            alignment === "left" && "justify-start"
          )}
        >
          <button 
            className="px-8 py-4 text-white rounded-xl font-semibold text-lg transition-all hover:opacity-90"
            style={{ 
              background: `linear-gradient(to right, var(--preview-primary, #F97316), var(--preview-accent, #FB923C))`,
              boxShadow: `0 10px 40px -10px color-mix(in srgb, var(--preview-primary) 40%, transparent)`
            }}
          >
            {ctaText}
          </button>
          {ctaSecondaryText && (
            <button 
              className="px-8 py-4 border rounded-xl font-semibold text-lg transition-all hover:border-opacity-60"
              style={{ 
                borderColor: 'color-mix(in srgb, var(--preview-foreground, #FFFFFF) 20%, transparent)',
                color: 'var(--preview-foreground, #FFFFFF)'
              }}
            >
              {ctaSecondaryText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

