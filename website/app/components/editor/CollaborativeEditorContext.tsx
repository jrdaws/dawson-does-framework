"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { EditorProvider, useEditor } from "./EditorContext";
import {
  useCollaboration,
  useCollaborativeDocument,
  UserPresence,
  CursorPosition,
} from "@dawson-framework/collaboration";

interface CollaborativeEditorContextType {
  users: UserPresence[];
  cursors: Map<string, CursorPosition>;
  isConnected: boolean;
  collaborationEnabled: boolean;
  currentUserId: string | null;
}

const CollaborativeEditorContext = createContext<
  CollaborativeEditorContextType | undefined
>(undefined);

interface CollaborativeEditorProviderProps {
  children: ReactNode;
  projectId?: string;
  userId?: string;
  userName?: string;
  enabled?: boolean;
}

export function CollaborativeEditorProvider({
  children,
  projectId,
  userId,
  userName,
  enabled = true,
}: CollaborativeEditorProviderProps) {
  const [collaborationEnabled, setCollaborationEnabled] = useState(enabled);

  // Generate a session ID if not provided
  const sessionUserId = userId || `user-${Math.random().toString(36).substr(2, 9)}`;
  const sessionUserName = userName || `User ${sessionUserId.slice(0, 6)}`;
  const sessionProjectId = projectId || "default-project";

  const wsUrl = process.env.NEXT_PUBLIC_COLLABORATION_WS || "ws://localhost:1234/collaborate";

  // Set up collaboration
  const {
    session,
    users,
    cursors,
    isConnected,
    updateCursor,
  } = useCollaboration({
    projectId: sessionProjectId,
    userId: sessionUserId,
    userName: sessionUserName,
    wsUrl,
    onConnected: () => {
      console.log("✅ Connected to collaboration server");
    },
    onDisconnected: () => {
      console.log("⚠️ Disconnected from collaboration server");
    },
    onError: (error) => {
      console.error("❌ Collaboration error:", error);
      setCollaborationEnabled(false);
    },
  });

  // Track mouse movement for cursor position
  useEffect(() => {
    if (!collaborationEnabled || !isConnected) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateCursor({
        x: e.clientX,
        y: e.clientY,
        element: "editor",
      });
    };

    // Throttle cursor updates
    let timeoutId: NodeJS.Timeout;
    const throttledMouseMove = (e: MouseEvent) => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleMouseMove(e);
        timeoutId = null as any;
      }, 50); // 50ms throttle
    };

    window.addEventListener("mousemove", throttledMouseMove);
    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [collaborationEnabled, isConnected, updateCursor]);

  const value: CollaborativeEditorContextType = {
    users,
    cursors,
    isConnected,
    collaborationEnabled,
    currentUserId: sessionUserId,
  };

  return (
    <CollaborativeEditorContext.Provider value={value}>
      <EditorProvider>{children}</EditorProvider>
    </CollaborativeEditorContext.Provider>
  );
}

export function useCollaborativeEditor() {
  const context = useContext(CollaborativeEditorContext);
  if (!context) {
    throw new Error(
      "useCollaborativeEditor must be used within CollaborativeEditorProvider"
    );
  }
  return context;
}
