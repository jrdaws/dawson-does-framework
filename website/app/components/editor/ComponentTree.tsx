"use client";

import React, { useState, useEffect } from "react";
import { useEditor } from "./EditorContext";
import { ElementTreeNode } from "./types";
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  Layers,
} from "lucide-react";

interface TreeNodeProps {
  node: ElementTreeNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function TreeNode({ node, selectedId, onSelect }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(node.depth < 2);

  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  const handleClick = () => {
    onSelect(node.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-terminal-text/10 transition-colors ${
          isSelected ? "bg-terminal-accent/20 text-terminal-accent" : "text-terminal-text"
        }`}
        style={{ paddingLeft: `${node.depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="p-0.5 hover:bg-terminal-text/20 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        <FileCode className="h-3 w-3 flex-shrink-0" />

        <span className="text-xs font-mono truncate flex-1">
          {node.tagName.toLowerCase()}
          {node.textContent && (
            <span className="text-terminal-dim ml-1">
              "{node.textContent.substring(0, 20)}
              {node.textContent.length > 20 ? "..." : ""}"
            </span>
          )}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ComponentTree() {
  const { elementTree, selectedElement, iframeRef } = useEditor();
  const [tree, setTree] = useState<ElementTreeNode[]>([]);

  // Listen for tree updates from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "tree") {
        setTree(event.data.payload.children || []);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Request tree when iframe loads
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setTimeout(() => {
        iframe.contentWindow?.postMessage({ type: "getTree" }, "*");
      }, 100);
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [iframeRef]);

  const handleSelect = (id: string) => {
    // Send message to iframe to select element
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "selectById",
          payload: { elementId: id },
        },
        "*"
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-terminal-text/20">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-terminal-accent" />
          <h3 className="text-sm font-display font-bold text-terminal-text">
            Elements
          </h3>
        </div>
        <p className="text-xs text-terminal-dim mt-1">
          Click to select elements
        </p>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {tree.length > 0 ? (
          tree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              selectedId={selectedElement?.id || null}
              onSelect={handleSelect}
            />
          ))
        ) : (
          <div className="p-4 text-center text-terminal-dim text-xs">
            Loading elements...
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-terminal-text/20 bg-terminal-bg/30">
        <p className="text-xs text-terminal-dim">
          {tree.length > 0
            ? `${countElements(tree)} element${countElements(tree) === 1 ? "" : "s"}`
            : "No elements"}
        </p>
      </div>
    </div>
  );
}

function countElements(nodes: ElementTreeNode[]): number {
  return nodes.reduce((count, node) => {
    return count + 1 + countElements(node.children);
  }, 0);
}
