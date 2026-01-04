"use client";

import { useState, useCallback } from "react";

export interface UploadedFile {
  key: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
}

interface UseUploadOptions {
  endpoint?: string;
  onSuccess?: (file: UploadedFile) => void;
  onError?: (error: Error) => void;
}

interface UseUploadReturn {
  upload: (file: File) => Promise<UploadedFile | null>;
  uploading: boolean;
  error: Error | null;
  progress: number;
  uploadedFiles: UploadedFile[];
  removeFile: (key: string) => void;
  clear: () => void;
}

export function useUpload(options: UseUploadOptions = {}): UseUploadReturn {
  const { endpoint = "/api/upload", onSuccess, onError } = options;
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const upload = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      setUploading(true);
      setError(null);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Use XMLHttpRequest for progress tracking
        const uploadedFile = await new Promise<UploadedFile>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } else {
              reject(new Error(xhr.responseText || "Upload failed"));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Upload failed"));
          });

          xhr.open("POST", endpoint);
          xhr.send(formData);
        });

        setUploadedFiles((prev) => [...prev, uploadedFile]);
        onSuccess?.(uploadedFile);
        return uploadedFile;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [endpoint, onSuccess, onError]
  );

  const removeFile = useCallback((key: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.key !== key));
  }, []);

  const clear = useCallback(() => {
    setUploadedFiles([]);
    setError(null);
    setProgress(0);
  }, []);

  return {
    upload,
    uploading,
    error,
    progress,
    uploadedFiles,
    removeFile,
    clear,
  };
}

/**
 * Hook for direct upload using presigned URLs
 */
export function usePresignedUpload(options: UseUploadOptions = {}): UseUploadReturn {
  const { onSuccess, onError } = options;
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const upload = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      setUploading(true);
      setError(null);
      setProgress(0);

      try {
        // 1. Get presigned URL
        const presignedRes = await fetch("/api/upload/presigned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        });

        if (!presignedRes.ok) {
          throw new Error("Failed to get presigned URL");
        }

        const { key, uploadUrl } = await presignedRes.json();

        // 2. Upload directly to R2
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error("Direct upload failed"));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Direct upload failed"));
          });

          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

        const uploadedFile: UploadedFile = {
          key,
          url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
          filename: file.name,
          contentType: file.type,
          size: file.size,
        };

        setUploadedFiles((prev) => [...prev, uploadedFile]);
        onSuccess?.(uploadedFile);
        return uploadedFile;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onSuccess, onError]
  );

  const removeFile = useCallback((key: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.key !== key));
  }, []);

  const clear = useCallback(() => {
    setUploadedFiles([]);
    setError(null);
    setProgress(0);
  }, []);

  return {
    upload,
    uploading,
    error,
    progress,
    uploadedFiles,
    removeFile,
    clear,
  };
}

