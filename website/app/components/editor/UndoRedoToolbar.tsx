"use client";

import React, { useEffect } from "react";
import { Undo2, Redo2 } from "lucide-react";

interface UndoRedoToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  className?: string;
}

/**
 * Toolbar with undo/redo buttons and keyboard shortcuts
 * Cmd/Ctrl+Z for undo, Cmd/Ctrl+Shift+Z for redo
 */
export function UndoRedoToolbar({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  className = "",
}: UndoRedoToolbarProps) {
  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      const isModifier = e.metaKey || e.ctrlKey;

      if (!isModifier) return;

      // Cmd/Ctrl+Shift+Z for redo
      if (e.shiftKey && e.key === "z") {
        e.preventDefault();
        if (canRedo) {
          onRedo();
        }
      }
      // Cmd/Ctrl+Z for undo
      else if (e.key === "z") {
        e.preventDefault();
        if (canUndo) {
          onUndo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onUndo, onRedo, canUndo, canRedo]);

  return (
    <div
      className={`flex items-center gap-1 bg-terminal-bg/80 border border-terminal-text/20 rounded-lg px-2 py-1 ${className}`}
    >
      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          canUndo
            ? "text-terminal-text hover:bg-terminal-accent/20 cursor-pointer"
            : "text-terminal-text/30 cursor-not-allowed"
        }`}
        title="Undo (Cmd/Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
        <span>Undo</span>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-terminal-text/20" />

      {/* Redo Button */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          canRedo
            ? "text-terminal-text hover:bg-terminal-accent/20 cursor-pointer"
            : "text-terminal-text/30 cursor-not-allowed"
        }`}
        title="Redo (Cmd/Ctrl+Shift+Z)"
      >
        <Redo2 className="w-4 h-4" />
        <span>Redo</span>
      </button>

      {/* Keyboard Shortcut Hint */}
      <div className="ml-2 text-xs text-terminal-text/50 hidden sm:block">
        <kbd className="px-1.5 py-0.5 bg-terminal-bg border border-terminal-text/20 rounded">
          ⌘Z
        </kbd>
        {" / "}
        <kbd className="px-1.5 py-0.5 bg-terminal-bg border border-terminal-text/20 rounded">
          ⌘⇧Z
        </kbd>
      </div>
    </div>
  );
}
