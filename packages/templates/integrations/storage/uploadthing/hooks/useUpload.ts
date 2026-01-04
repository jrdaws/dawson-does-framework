"use client";

import { useState, useCallback } from "react";

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  key?: string;
}

interface UseUploadOptions {
  maxFiles?: number;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: Error) => void;
}

interface UseUploadReturn {
  files: UploadedFile[];
  isUploading: boolean;
  progress: number;
  error: Error | null;
  addFiles: (newFiles: UploadedFile[]) => void;
  removeFile: (url: string) => void;
  clearFiles: () => void;
  setIsUploading: (uploading: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: Error | null) => void;
}

export function useUpload(options: UseUploadOptions = {}): UseUploadReturn {
  const { maxFiles, onUploadComplete, onUploadError } = options;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const addFiles = useCallback(
    (newFiles: UploadedFile[]) => {
      setFiles((prev) => {
        const combined = [...prev, ...newFiles];
        // Respect maxFiles limit
        if (maxFiles && combined.length > maxFiles) {
          return combined.slice(-maxFiles);
        }
        return combined;
      });
      onUploadComplete?.(newFiles);
    },
    [maxFiles, onUploadComplete]
  );

  const removeFile = useCallback((url: string) => {
    setFiles((prev) => prev.filter((f) => f.url !== url));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    isUploading,
    progress,
    error,
    addFiles,
    removeFile,
    clearFiles,
    setIsUploading,
    setProgress,
    setError: (err) => {
      setError(err);
      if (err) onUploadError?.(err);
    },
  };
}

// Hook for managing multiple upload zones
interface UseMultiUploadOptions {
  zones: string[];
}

export function useMultiUpload({ zones }: UseMultiUploadOptions) {
  const [uploads, setUploads] = useState<Record<string, UploadedFile[]>>(
    Object.fromEntries(zones.map((zone) => [zone, []]))
  );

  const addToZone = useCallback((zone: string, files: UploadedFile[]) => {
    setUploads((prev) => ({
      ...prev,
      [zone]: [...(prev[zone] || []), ...files],
    }));
  }, []);

  const removeFromZone = useCallback((zone: string, url: string) => {
    setUploads((prev) => ({
      ...prev,
      [zone]: (prev[zone] || []).filter((f) => f.url !== url),
    }));
  }, []);

  const clearZone = useCallback((zone: string) => {
    setUploads((prev) => ({
      ...prev,
      [zone]: [],
    }));
  }, []);

  const clearAll = useCallback(() => {
    setUploads(Object.fromEntries(zones.map((zone) => [zone, []])));
  }, [zones]);

  const getAllFiles = useCallback(() => {
    return Object.values(uploads).flat();
  }, [uploads]);

  return {
    uploads,
    addToZone,
    removeFromZone,
    clearZone,
    clearAll,
    getAllFiles,
  };
}

