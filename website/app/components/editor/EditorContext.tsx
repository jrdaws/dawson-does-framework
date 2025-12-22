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

  const value: EditorContextType = {
    selectedElement,
    hoveredElement,
    elementTree,
    editMode,
    iframeRef,
    registerIframe,
    selectElement,
    hoverElement,
    updateStyle,
    updateContent,
    deleteElement,
    duplicateElement,
    setEditMode,
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
