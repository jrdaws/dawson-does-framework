"use client";

import { Check, ExternalLink, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageProvider {
  id: string;
  name: string;
  description: string;
  features: string[];
  pricingNote: string;
  docsUrl: string;
  signupUrl: string;
  difficulty: "Easy" | "Medium" | "Advanced";
}

const IMAGE_PROVIDERS: ImageProvider[] = [
  {
    id: "cloudinary",
    name: "Cloudinary",
    description: "Full media management platform",
    features: ["Transforms", "CDN", "AI tagging", "Video support"],
    pricingNote: "Free: 25GB storage + 25GB bandwidth",
    docsUrl: "https://cloudinary.com/documentation",
    signupUrl: "https://cloudinary.com/users/register_free",
    difficulty: "Easy",
  },
  {
    id: "imagekit",
    name: "ImageKit",
    description: "Real-time image optimization & CDN",
    features: ["URL transforms", "CDN", "DAM", "Video"],
    pricingNote: "Free: 20GB bandwidth/mo, then $49/mo",
    docsUrl: "https://docs.imagekit.io",
    signupUrl: "https://imagekit.io/registration",
    difficulty: "Easy",
  },
  {
    id: "vercel-image",
    name: "Vercel Image Optimization",
    description: "Built into Vercel (already in stack)",
    features: ["next/image", "Auto format", "Lazy loading", "Included"],
    pricingNote: "Included with Vercel (1K optimizations free)",
    docsUrl: "https://nextjs.org/docs/app/building-your-application/optimizing/images",
    signupUrl: "https://vercel.com",
    difficulty: "Easy",
  },
  {
    id: "imgix",
    name: "imgix",
    description: "Powerful real-time image processing",
    features: ["URL API", "Face detection", "Watermarks", "Enterprise"],
    pricingNote: "Starts at $10/mo for 1TB origin",
    docsUrl: "https://docs.imgix.com",
    signupUrl: "https://dashboard.imgix.com/sign-up",
    difficulty: "Medium",
  },
];

interface ImageOptSectionProps {
  selectedProvider?: string;
  onProviderChange: (providerId: string | undefined) => void;
}

export function ImageOptSection({
  selectedProvider,
  onProviderChange,
}: ImageOptSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-white/50">
          Choose image optimization
        </p>
        {selectedProvider && (
          <button
            onClick={() => onProviderChange(undefined)}
            className="text-[10px] text-white/40 hover:text-white"
          >
            Skip
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {IMAGE_PROVIDERS.map((provider) => {
          const isSelected = selectedProvider === provider.id;

          return (
            <button
              key={provider.id}
              onClick={() => onProviderChange(provider.id)}
              className={cn(
                "w-full text-left p-2 rounded-md border transition-all",
                isSelected
                  ? "bg-[var(--primary)]/15 border-[var(--primary)]/40"
                  : "bg-black/20 border-white/10 hover:border-white/20"
              )}
            >
              <div className="flex items-center gap-2">
                <ImageIcon className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  isSelected ? "text-[var(--primary)]" : "text-white/50"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "font-medium text-xs",
                      isSelected ? "text-[var(--primary)]" : "text-white/90"
                    )}>
                      {provider.name}
                    </span>
                    <span className={cn(
                      "text-[9px] px-1 py-0.5 rounded",
                      provider.difficulty === "Easy" 
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    )}>
                      {provider.difficulty}
                    </span>
                    {isSelected && (
                      <Check className="h-3 w-3 text-[var(--primary)] shrink-0 ml-auto" />
                    )}
                  </div>
                  <p className="text-[10px] text-white/40 truncate">
                    {provider.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="mt-2 pt-2 border-t border-white/10 space-y-1.5">
                  <div className="flex flex-wrap gap-1">
                    {provider.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="text-[9px] bg-white/10 text-white/60 px-1.5 py-0.5 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="text-[9px] text-white/40">{provider.pricingNote}</p>
                  <div className="flex gap-2">
                    <a
                      href={provider.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] text-[var(--primary)] hover:underline flex items-center gap-0.5"
                    >
                      Docs <ExternalLink className="h-2 w-2" />
                    </a>
                    <a
                      href={provider.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] text-[var(--primary)] hover:underline flex items-center gap-0.5"
                    >
                      Sign Up <ExternalLink className="h-2 w-2" />
                    </a>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!selectedProvider && (
        <p className="text-[9px] text-white/30 italic">
          Optional: Use Vercel Image if on Vercel
        </p>
      )}
    </div>
  );
}

