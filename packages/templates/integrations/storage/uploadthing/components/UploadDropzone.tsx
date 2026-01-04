"use client";

import { useState, useCallback } from "react";
import { UploadDropzone as UTUploadDropzone } from "@/lib/uploadthing";
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/uploadthing";

interface UploadDropzoneProps {
  endpoint: "imageUploader" | "documentUploader" | "avatarUploader" | "fileUploader";
  onUploadComplete?: (files: { url: string; name: string; size: number }[]) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  showPreview?: boolean;
}

interface UploadedFile {
  url: string;
  name: string;
  size: number;
}

export function UploadDropzone({
  endpoint,
  onUploadComplete,
  onUploadError,
  className = "",
  showPreview = true,
}: UploadDropzoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const removeFile = useCallback((url: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.url !== url));
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <UTUploadDropzone
        endpoint={endpoint}
        onUploadBegin={() => {
          setUploadStatus("uploading");
          setError(null);
        }}
        onClientUploadComplete={(res) => {
          setUploadStatus("success");
          
          const files = res?.map((file) => ({
            url: file.url,
            name: file.name,
            size: file.size,
          })) || [];
          
          setUploadedFiles((prev) => [...prev, ...files]);
          onUploadComplete?.(files);
          
          setTimeout(() => setUploadStatus("idle"), 2000);
        }}
        onUploadError={(err: Error) => {
          setUploadStatus("error");
          setError(err.message);
          onUploadError?.(err);
          
          setTimeout(() => {
            setUploadStatus("idle");
            setError(null);
          }, 5000);
        }}
        appearance={{
          container: cn(
            "border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
            uploadStatus === "uploading" && "border-primary bg-primary/5",
            uploadStatus === "success" && "border-green-500 bg-green-50 dark:bg-green-900/10",
            uploadStatus === "error" && "border-destructive bg-destructive/5",
            uploadStatus === "idle" && "border-muted-foreground/25 hover:border-primary hover:bg-muted/50"
          ),
          uploadIcon: "hidden",
          label: "text-foreground font-medium",
          allowedContent: "text-muted-foreground text-sm",
          button: cn(
            "mt-4 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-colors",
            uploadStatus === "uploading" && "opacity-50 pointer-events-none"
          ),
        }}
        content={{
          uploadIcon() {
            if (uploadStatus === "success") {
              return <CheckCircle className="h-12 w-12 text-green-500" />;
            }
            if (uploadStatus === "error") {
              return <AlertCircle className="h-12 w-12 text-destructive" />;
            }
            return <Upload className="h-12 w-12 text-muted-foreground" />;
          },
          label() {
            if (uploadStatus === "uploading") return "Uploading...";
            if (uploadStatus === "success") return "Upload complete!";
            if (uploadStatus === "error") return error || "Upload failed";
            return "Drag & drop files here";
          },
        }}
      />

      {/* Uploaded Files Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Uploaded files</h4>
          <ul className="space-y-2">
            {uploadedFiles.map((file) => (
              <li
                key={file.url}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted-foreground/10 flex items-center justify-center">
                      <span className="text-xs font-medium uppercase">
                        {file.name.split(".").pop()}
                      </span>
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.url)}
                  className="p-1 hover:bg-background rounded transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

