"use client";

import { useCallback, useState } from "react";
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useUpload, UploadedFile } from "@/hooks/useUpload";

interface FileUploadProps {
  onUpload?: (file: UploadedFile) => void;
  onError?: (error: Error) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export function FileUpload({
  onUpload,
  onError,
  accept = "image/*,application/pdf",
  maxSize = 10 * 1024 * 1024,
  multiple = false,
  className = "",
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const { upload, uploading, error, progress, uploadedFiles, removeFile } = useUpload({
    onSuccess: onUpload,
    onError,
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        files.forEach((file) => upload(file));
      }
    },
    [upload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        files.forEach((file) => upload(file));
      }
    },
    [upload]
  );

  return (
    <div className={className}>
      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <Upload
          className={`w-10 h-10 mx-auto mb-4 ${
            dragActive ? "text-primary" : "text-muted-foreground"
          }`}
        />

        <p className="text-foreground font-medium mb-1">
          {dragActive ? "Drop files here" : "Drop files here or click to upload"}
        </p>
        <p className="text-sm text-muted-foreground">
          Max file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </div>
      )}

      {/* Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading... {progress}%
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.key}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => removeFile(file.key)}
                className="p-1 hover:bg-background rounded"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

