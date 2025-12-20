"use client";

import { Zap, Settings } from "lucide-react";
import { Mode } from "@/lib/configurator-state";

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div className="inline-flex items-center gap-2 bg-terminal-bg border-2 border-terminal-text/30 rounded-lg p-1">
        <button
          onClick={() => onChange("beginner")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-mono text-sm ${
            mode === "beginner"
              ? "bg-terminal-accent text-terminal-bg font-bold"
              : "text-terminal-text hover:text-terminal-accent"
          }`}
        >
          <Zap className="h-4 w-4" />
          Beginner
        </button>
        <button
          onClick={() => onChange("advanced")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-mono text-sm ${
            mode === "advanced"
              ? "bg-terminal-accent text-terminal-bg font-bold"
              : "text-terminal-text hover:text-terminal-accent"
          }`}
        >
          <Settings className="h-4 w-4" />
          Advanced
        </button>
      </div>

      {mode === "beginner" && (
        <p className="text-terminal-accent text-xs text-center max-w-md">
          Beginner mode: Curated presets, guided flow, all templates visible
        </p>
      )}
      {mode === "advanced" && (
        <p className="text-terminal-accent text-xs text-center max-w-md">
          Advanced mode: Full control, local or cloud, all integrations visible
        </p>
      )}
    </div>
  );
}
