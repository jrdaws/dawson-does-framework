"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  useCollaboration,
  useCollaborativeDocument,
} from "@dawson-framework/collaboration";

interface UseCollaborativeHTMLOptions {
  projectId: string;
  userId: string;
  userName: string;
  filePath: string;
  initialHtml: string;
  onHtmlChange?: (html: string) => void;
  wsUrl?: string;
}

interface UseCollaborativeHTMLResult {
  html: string;
  updateHtml: (newHtml: string) => void;
  isConnected: boolean;
  isLoading: boolean;
  users: any[];
  cursors: Map<string, any>;
  updateCursor: (position: any) => void;
}

/**
 * Hook for managing collaborative HTML editing
 * Combines collaboration session with document synchronization
 */
export function useCollaborativeHTML({
  projectId,
  userId,
  userName,
  filePath,
  initialHtml,
  onHtmlChange,
  wsUrl,
}: UseCollaborativeHTMLOptions): UseCollaborativeHTMLResult {
  const [html, setHtml] = useState(initialHtml);
  const isInitializedRef = useRef(false);
  const isLocalUpdateRef = useRef(false);

  // Set up collaboration session
  const {
    session,
    users,
    cursors,
    isConnected,
    updateCursor,
  } = useCollaboration({
    projectId,
    userId,
    userName,
    wsUrl: wsUrl || process.env.NEXT_PUBLIC_COLLABORATION_WS || "ws://localhost:1234/collaborate",
    onConnected: () => {
      console.log("✅ [useCollaborativeHTML] Connected to collaboration");
    },
    onDisconnected: () => {
      console.log("⚠️ [useCollaborativeHTML] Disconnected from collaboration");
    },
    onError: (error) => {
      console.error("❌ [useCollaborativeHTML] Error:", error);
    },
  });

  // Set up collaborative document
  const {
    content: syncedContent,
    updateContent,
    isLoading,
  } = useCollaborativeDocument({
    session,
    filePath,
    onContentChange: (newContent) => {
      // Only update if this is a remote change
      if (!isLocalUpdateRef.current) {
        console.log("📥 [useCollaborativeHTML] Received remote update");
        setHtml(newContent);
        onHtmlChange?.(newContent);
      }
    },
  });

  // Initialize with initial HTML on first connection
  useEffect(() => {
    if (session && !isInitializedRef.current && !isLoading) {
      console.log("🚀 [useCollaborativeHTML] Initializing with initial HTML");

      // If the synced content is empty, set our initial HTML
      if (!syncedContent || syncedContent.trim() === "") {
        isLocalUpdateRef.current = true;
        updateContent(initialHtml);
        setHtml(initialHtml);
        setTimeout(() => {
          isLocalUpdateRef.current = false;
        }, 100);
      } else {
        // Use the synced content from other users
        console.log("📥 [useCollaborativeHTML] Using synced content from server");
        setHtml(syncedContent);
        onHtmlChange?.(syncedContent);
      }

      isInitializedRef.current = true;
    }
  }, [session, isLoading, syncedContent, initialHtml, updateContent, onHtmlChange]);

  // Update HTML and sync to other users
  const updateHtml = useCallback(
    (newHtml: string) => {
      console.log("📤 [useCollaborativeHTML] Sending local update");
      isLocalUpdateRef.current = true;

      // Update local state
      setHtml(newHtml);

      // Sync to other users
      updateContent(newHtml);

      // Notify parent component
      onHtmlChange?.(newHtml);

      // Reset flag after a short delay
      setTimeout(() => {
        isLocalUpdateRef.current = false;
      }, 100);
    },
    [updateContent, onHtmlChange]
  );

  return {
    html,
    updateHtml,
    isConnected,
    isLoading,
    users,
    cursors,
    updateCursor,
  };
}
