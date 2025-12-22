"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  EditorState,
  EditorActions,
  SelectedElement,
  ElementTreeNode,
  EditorMessage,
} from "./types";

interface EditorContextType extends EditorState, EditorActions {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  registerIframe: (iframe: HTMLIFrameElement) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<SelectedElement | null>(null);
  const [elementTree, setElementTree] = useState<ElementTreeNode[]>([]);
  const [editMode, setEditMode] = useState<"select" | "text" | "resize">("select");

  // History tracking for undo/redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const registerIframe = useCallback((iframe: HTMLIFrameElement) => {
    if (iframeRef.current !== iframe) {
      (iframeRef as React.MutableRefObject<HTMLIFrameElement>).current = iframe;
    }
  }, []);

  const sendMessage = useCallback((message: EditorMessage) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, "*");
    }
  }, []);

  const selectElement = useCallback(
    (element: SelectedElement | null) => {
      setSelectedElement(element);
      setEditMode("select");
    },
    []
  );

  const hoverElement = useCallback((element: SelectedElement | null) => {
    setHoveredElement(element);
  }, []);

  const updateStyle = useCallback(
    (updates: Record<string, string>) => {
      if (!selectedElement) return;

      sendMessage({
        type: "update",
        payload: {
          elementId: selectedElement.id,
          type: "style",
          updates,
        },
      });

      // Update local state
      setSelectedElement({
        ...selectedElement,
        styles: {
          ...selectedElement.styles,
          ...updates,
        },
      });
    },
    [selectedElement, sendMessage]
  );

  const updateContent = useCallback(
    (content: string) => {
      if (!selectedElement) return;

      sendMessage({
        type: "update",
        payload: {
          elementId: selectedElement.id,
          type: "content",
          content,
        },
      });

      // Update local state
      setSelectedElement({
        ...selectedElement,
        textContent: content,
      });
    },
    [selectedElement, sendMessage]
  );

  const deleteElement = useCallback(() => {
    if (!selectedElement) return;

    sendMessage({
      type: "update",
      payload: {
        elementId: selectedElement.id,
        type: "delete",
      },
    });

    setSelectedElement(null);
  }, [selectedElement, sendMessage]);

  const duplicateElement = useCallback(() => {
    if (!selectedElement) return;

    sendMessage({
      type: "update",
      payload: {
        elementId: selectedElement.id,
        type: "duplicate",
      },
    });
  }, [selectedElement, sendMessage]);

  // History management
  const pushHistory = useCallback((html: string) => {
    setHistory((prev) => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);
      // Add new state
      newHistory.push(html);
      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
        setHistoryIndex(49);
        return newHistory;
      }
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;

    const previousHtml = history[historyIndex - 1];
    setHistoryIndex(historyIndex - 1);

    // Send message to iframe to restore HTML
    sendMessage({
      type: "setHtml",
      payload: { html: previousHtml },
    });
  }, [historyIndex, history, sendMessage]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const nextHtml = history[historyIndex + 1];
    setHistoryIndex(historyIndex + 1);

    // Send message to iframe to restore HTML
    sendMessage({
      type: "setHtml",
      payload: { html: nextHtml },
    });
  }, [historyIndex, history, sendMessage]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const value: EditorContextType = {
    selectedElement,
    hoveredElement,
    elementTree,
    editMode,
    canUndo,
    canRedo,
    iframeRef,
    registerIframe,
    selectElement,
    hoverElement,
    updateStyle,
    updateContent,
    deleteElement,
    duplicateElement,
    setEditMode,
    undo,
    redo,
    pushHistory,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}
