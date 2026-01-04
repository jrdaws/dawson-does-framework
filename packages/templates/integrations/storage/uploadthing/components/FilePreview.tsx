"use client";

import { useState } from "react";
import { X, Download, ExternalLink, File, Image, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize, isImageFile, getFileExtension } from "@/lib/uploadthing";

interface FilePreviewProps {
  url: string;
  name: string;
  size?: number;
  onRemove?: () => void;
  showDownload?: boolean;
  showRemove?: boolean;
  className?: string;
}

export function FilePreview({
  url,
  name,
  size,
  onRemove,
  showDownload = true,
  showRemove = true,
  className = "",
}: FilePreviewProps) {
  const [imageError, setImageError] = useState(false);
  const isImage = isImageFile(name) && !imageError;
  const extension = getFileExtension(name);

  const getFileIcon = () => {
    if (isImage) return Image;
    if (["pdf", "doc", "docx", "txt"].includes(extension.toLowerCase())) {
      return FileText;
    }
    return File;
  };

  const FileIcon = getFileIcon();

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors",
        className
      )}
    >
      {/* Thumbnail/Icon */}
      <div className="shrink-0">
        {isImage ? (
          <img
            src={url}
            alt={name}
            className="w-12 h-12 rounded-md object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-muted-foreground/10 flex items-center justify-center">
            <FileIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-foreground">{name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="uppercase">{extension}</span>
          {size && (
            <>
              <span>•</span>
              <span>{formatFileSize(size)}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {showDownload && (
          <a
            href={url}
            download={name}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-background rounded transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
          </a>
        )}
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 hover:bg-background rounded transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>
        
        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 hover:bg-background rounded transition-colors"
            title="Remove"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

// Gallery view for multiple images
interface FileGalleryProps {
  files: { url: string; name: string; size?: number }[];
  onRemove?: (url: string) => void;
  className?: string;
}

export function FileGallery({ files, onRemove, className = "" }: FileGalleryProps) {
  const images = files.filter((f) => isImageFile(f.name));
  const otherFiles = files.filter((f) => !isImageFile(f.name));

  return (
    <div className={cn("space-y-4", className)}>
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((file) => (
            <div key={file.url} className="group relative aspect-square">
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {onRemove && (
                <button
                  onClick={() => onRemove(file.url)}
                  className="absolute top-2 right-2 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Other Files List */}
      {otherFiles.length > 0 && (
        <div className="space-y-2">
          {otherFiles.map((file) => (
            <FilePreview
              key={file.url}
              url={file.url}
              name={file.name}
              size={file.size}
              onRemove={onRemove ? () => onRemove(file.url) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

