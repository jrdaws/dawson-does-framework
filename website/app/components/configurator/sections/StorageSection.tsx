"use client";

import { Check, ExternalLink, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

interface StorageProvider {
  id: string;
  name: string;
  description: string;
  features: string[];
  pricingNote: string;
  docsUrl: string;
  signupUrl: string;
  difficulty: "Easy" | "Medium" | "Advanced";
}

const STORAGE_PROVIDERS: StorageProvider[] = [
  {
    id: "uploadthing",
    name: "UploadThing",
    description: "Simple file uploads for Next.js",
    features: ["Easy integration", "Type-safe", "No S3 setup", "Free tier"],
    pricingNote: "Free: 2GB, then $10/mo for 100GB",
    docsUrl: "https://docs.uploadthing.com",
    signupUrl: "https://uploadthing.com",
    difficulty: "Easy",
  },
  {
    id: "cloudflare-r2",
    name: "Cloudflare R2",
    description: "S3-compatible with zero egress fees",
    features: ["No egress fees", "S3 compatible", "Global CDN", "Workers integration"],
    pricingNote: "Free: 10GB storage, $0.015/GB after",
    docsUrl: "https://developers.cloudflare.com/r2",
    signupUrl: "https://dash.cloudflare.com/sign-up",
    difficulty: "Medium",
  },
  {
    id: "supabase-storage",
    name: "Supabase Storage",
    description: "Integrated with Supabase (already in stack)",
    features: ["Row-level security", "CDN", "Image transforms", "Included"],
    pricingNote: "Included with Supabase free tier (1GB)",
    docsUrl: "https://supabase.com/docs/guides/storage",
    signupUrl: "https://supabase.com/dashboard",
    difficulty: "Easy",
  },
  {
    id: "aws-s3",
    name: "AWS S3",
    description: "Industry standard object storage",
    features: ["Highly reliable", "Global", "Lifecycle rules", "Versioning"],
    pricingNote: "Pay-as-you-go, ~$0.023/GB storage",
    docsUrl: "https://docs.aws.amazon.com/s3",
    signupUrl: "https://aws.amazon.com/s3",
    difficulty: "Advanced",
  },
];

interface StorageSectionProps {
  selectedProvider?: string;
  onProviderChange: (providerId: string | undefined) => void;
}

export function StorageSection({
  selectedProvider,
  onProviderChange,
}: StorageSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-white/50">
          Choose a storage provider
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
        {STORAGE_PROVIDERS.map((provider) => {
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
                <HardDrive className={cn(
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
                        : provider.difficulty === "Medium"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-red-500/20 text-red-400"
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
          Optional: Skip if using Supabase Storage
        </p>
      )}
    </div>
  );
}

