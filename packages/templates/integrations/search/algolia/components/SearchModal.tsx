"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Command } from "lucide-react";
import { SearchBox } from "./SearchBox";
import { SearchResults, DefaultHit } from "./SearchResults";
import { useSearch } from "@/hooks/useSearch";
import { SearchHit } from "@/lib/search/algolia";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  renderHit?: (hit: SearchHit) => React.ReactNode;
}

export function SearchModal({ isOpen, onClose, renderHit }: SearchModalProps) {
  const { query, setQuery, hits, isLoading } = useSearch();

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultRenderHit = (hit: SearchHit) => (
    <DefaultHit
      title={String(hit.title || hit.name || hit.objectID)}
      description={String(hit.description || hit.content || "")}
      onClick={onClose}
    />
  );

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex flex-col max-w-2xl mx-auto mt-[10vh] bg-background border border-border rounded-xl shadow-2xl max-h-[80vh]">
        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search..."
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {query ? (
            <SearchResults
              hits={hits}
              isLoading={isLoading}
              query={query}
              renderHit={renderHit || defaultRenderHit}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Start typing to search...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd> to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↓</kbd> to navigate
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded">esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

// Search trigger button with keyboard shortcut
interface SearchTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SearchTrigger({ onClick, className = "" }: SearchTriggerProps) {
  // Handle ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClick();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClick]);

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 border border-input rounded-lg hover:bg-muted transition-colors ${className}`}
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-background border border-border rounded">
        <Command className="h-3 w-3" />K
      </kbd>
    </button>
  );
}

