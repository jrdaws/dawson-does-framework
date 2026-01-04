"use client";

import { useState } from "react";
import { UploadButton as UTUploadButton } from "@/lib/uploadthing";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadButtonProps {
  endpoint: "imageUploader" | "documentUploader" | "avatarUploader" | "fileUploader";
  onUploadComplete?: (files: { url: string; name: string }[]) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  children?: React.ReactNode;
}

export function UploadButton({
  endpoint,
  onUploadComplete,
  onUploadError,
  className = "",
  variant = "default",
  children,
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      <UTUploadButton
        endpoint={endpoint}
        onUploadBegin={() => {
          setIsUploading(true);
          setUploadStatus("idle");
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          setUploadStatus("success");
          
          const files = res?.map((file) => ({
            url: file.url,
            name: file.name,
          })) || [];
          
          onUploadComplete?.(files);
          
          // Reset status after 2 seconds
          setTimeout(() => setUploadStatus("idle"), 2000);
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          setUploadStatus("error");
          onUploadError?.(error);
          
          setTimeout(() => setUploadStatus("idle"), 3000);
        }}
        appearance={{
          button: cn(
            "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
            variantStyles[variant]
          ),
          allowedContent: "hidden",
        }}
        content={{
          button({ ready, isUploading: uploading }) {
            if (uploading || isUploading) {
              return (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              );
            }
            if (uploadStatus === "success") {
              return (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Uploaded!
                </>
              );
            }
            if (uploadStatus === "error") {
              return (
                <>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Failed
                </>
              );
            }
            return (
              <>
                <Upload className="h-4 w-4" />
                {children || "Upload"}
              </>
            );
          },
        }}
      />
    </div>
  );
}

