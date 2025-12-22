"use client";

import React, { useEffect, useCallback } from "react";
import { EditorProvider, useEditor } from "./EditorContext";
import { SelectionOverlay } from "./SelectionOverlay";
import { PropertiesPanel } from "./PropertiesPanel";
import { ComponentTree } from "./ComponentTree";
import { getInjectionScript } from "./iframe-injector";
import { EditorMessage, SelectedElement, ElementTreeNode } from "./types";

interface VisualEditorProps {
  html: string;
  onHtmlChange?: (html: string) => void;
  className?: string;
}

function VisualEditorContent({ html, onHtmlChange, className }: VisualEditorProps) {
  const {
    iframeRef,
    registerIframe,
    selectElement,
    hoverElement,
    selectedElement,
  } = useEditor();

  // Inject the selection script into the HTML
  const enhancedHtml = React.useMemo(() => {
    const script = getInjectionScript();
    // Inject script before closing body tag
    if (html.includes("</body>")) {
      return html.replace(
        "</body>",
        `<script>${script}</script></body>`
      );
    }
    // If no body tag, append script at the end
    return html + `<script>${script}</script>`;
  }, [html]);

  // Handle messages from iframe
  const handleMessage = useCallback(
    (event: MessageEvent<EditorMessage>) => {
      const message = event.data;

      if (!message.type) return;

      switch (message.type) {
        case "selection":
          selectElement(message.payload as SelectedElement);
          break;
        case "hover":
          hoverElement(message.payload as SelectedElement);
          break;
        case "unhover":
          hoverElement(null);
          break;
        case "tree":
          // Tree updates are handled internally by context
          break;
        case "ready":
          // Request initial tree
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              { type: "getTree" },
              "*"
            );
          }
          break;
        case "error":
          console.error("Editor error:", message.payload);
          break;
      }
    },
    [selectElement, hoverElement, iframeRef]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Handle escape key to deselect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        selectElement(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectElement]);

  return (
    <div className={`flex h-full ${className || ""}`}>
      {/* Left Sidebar - Component Tree */}
      <div className="w-64 border-r border-terminal-text/20 bg-terminal-bg/50">
        <ComponentTree />
      </div>

      {/* Center - Preview with Overlay */}
      <div className="flex-1 relative overflow-auto bg-white">
        <div className="relative min-h-full">
          <iframe
            ref={(iframe) => {
              if (iframe) registerIframe(iframe);
            }}
            srcDoc={enhancedHtml}
            className="w-full h-full border-0"
            style={{ minHeight: "600px" }}
            sandbox="allow-scripts allow-same-origin"
            title="Visual Editor Preview"
          />
          {selectedElement && <SelectionOverlay />}
        </div>
      </div>

      {/* Right Sidebar - Properties Panel */}
      <div className="w-80 border-l border-terminal-text/20 bg-terminal-bg/50">
        <PropertiesPanel />
      </div>
    </div>
  );
}

export function VisualEditor(props: VisualEditorProps) {
  return (
    <EditorProvider>
      <VisualEditorContent {...props} />
    </EditorProvider>
  );
}
