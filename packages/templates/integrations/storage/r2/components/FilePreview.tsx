"use client";

import Image from "next/image";
import { File, FileText, Film, Music, X } from "lucide-react";

interface FilePreviewProps {
  url: string;
  filename: string;
  contentType: string;
  size?: number;
  onRemove?: () => void;
  className?: string;
}

export function FilePreview({
  url,
  filename,
  contentType,
  size,
  onRemove,
  className = "",
}: FilePreviewProps) {
  const isImage = contentType.startsWith("image/");
  const isVideo = contentType.startsWith("video/");
  const isAudio = contentType.startsWith("audio/");
  const isPdf = contentType === "application/pdf";

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const getIcon = () => {
    if (isVideo) return Film;
    if (isAudio) return Music;
    if (isPdf) return FileText;
    return File;
  };

  const Icon = getIcon();

  return (
    <div
      className={`group relative bg-card border border-border rounded-lg overflow-hidden ${className}`}
    >
      {/* Preview */}
      <div className="aspect-square bg-muted">
        {isImage ? (
          <Image
            src={url}
            alt={filename}
            fill
            className="object-cover"
          />
        ) : isVideo ? (
          <video
            src={url}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium truncate" title={filename}>
          {filename}
        </p>
        {size && (
          <p className="text-xs text-muted-foreground">{formatSize(size)}</p>
        )}
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Hover overlay for images */}
      {isImage && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
        >
          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Full Size
          </span>
        </a>
      )}
    </div>
  );
}

