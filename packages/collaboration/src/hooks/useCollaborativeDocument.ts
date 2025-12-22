import { useState, useEffect, useCallback, useRef } from "react";
import * as Y from "yjs";
import { getSharedText, observeText } from "../yjs-provider";
import { CollaborationSession, AwarenessState, UserPresence } from "../types";

export interface UseCollaborativeDocumentOptions {
  session: CollaborationSession | null;
  filePath: string;
  onContentChange?: (content: string) => void;
  debounceMs?: number;
}

export interface UseCollaborativeDocumentResult {
  content: string;
  updateContent: (content: string, cursor?: number) => void;
  insertText: (text: string, index: number) => void;
  deleteText: (index: number, length: number) => void;
  awareness: AwarenessState;
  isLoading: boolean;
}

/**
 * React hook for collaborative document editing
 * @param options - Document configuration
 * @returns Document state and methods
 */
export function useCollaborativeDocument(
  options: UseCollaborativeDocumentOptions
): UseCollaborativeDocumentResult {
  const { session, filePath, onContentChange, debounceMs = 100 } = options;

  const [content, setContent] = useState("");
  const [awareness, setAwareness] = useState<AwarenessState>({
    users: new Map(),
    localUser: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const yTextRef = useRef<Y.Text | null>(null);
  const isLocalUpdateRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize shared text document
  useEffect(() => {
    if (!session) {
      setIsLoading(true);
      return;
    }

    try {
      // Get or create shared text for this file
      const yText = getSharedText(session, filePath);
      yTextRef.current = yText;

      // Set initial content
      const initialContent = yText.toString();
      setContent(initialContent);
      setIsLoading(false);

      // Observe text changes from other users
      const unobserve = observeText(yText, (event) => {
        // Skip if this is our own change
        if (isLocalUpdateRef.current) {
          isLocalUpdateRef.current = false;
          return;
        }

        const newContent = yText.toString();
        setContent(newContent);

        // Debounce content change callback
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          onContentChange?.(newContent);
        }, debounceMs);
      });

      // Update awareness state
      const updateAwareness = () => {
        const awarenessMap = session.provider.awareness;
        const users = new Map<string, UserPresence>();

        awarenessMap.getStates().forEach((state, clientId) => {
          if (state.user) {
            users.set(clientId.toString(), {
              ...state.user,
              lastActive: state.user.lastActive
                ? new Date(state.user.lastActive)
                : new Date(),
            });
          }
        });

        const localState = awarenessMap.getLocalState();
        setAwareness({
          users,
          localUser: localState?.user || null,
        });
      };

      // Subscribe to awareness changes
      session.provider.awareness.on("change", updateAwareness);
      updateAwareness();

      // Cleanup
      return () => {
        unobserve();
        session.provider.awareness.off("change", updateAwareness);
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    } catch (error) {
      console.error("[useCollaborativeDocument] Error initializing:", error);
      setIsLoading(false);
    }
  }, [session, filePath, onContentChange, debounceMs]);

  // Update entire document content
  const updateContent = useCallback((newContent: string, cursor?: number) => {
    const yText = yTextRef.current;
    if (!yText) return;

    try {
      // Mark this as a local update
      isLocalUpdateRef.current = true;

      // Transact to group operations
      yText.doc?.transact(() => {
        // Delete existing content
        if (yText.length > 0) {
          yText.delete(0, yText.length);
        }

        // Insert new content
        if (newContent.length > 0) {
          yText.insert(0, newContent);
        }
      });

      // Update local state
      setContent(newContent);

      // Update cursor position if provided
      if (cursor !== undefined && session) {
        session.provider.awareness.setLocalStateField("selection", {
          file: filePath,
          start: cursor,
          end: cursor,
        });
      }
    } catch (error) {
      console.error("[useCollaborativeDocument] Error updating content:", error);
      isLocalUpdateRef.current = false;
    }
  }, [session, filePath]);

  // Insert text at specific position
  const insertText = useCallback((text: string, index: number) => {
    const yText = yTextRef.current;
    if (!yText) return;

    try {
      isLocalUpdateRef.current = true;
      yText.insert(index, text);

      // Update local state
      setContent(yText.toString());
    } catch (error) {
      console.error("[useCollaborativeDocument] Error inserting text:", error);
      isLocalUpdateRef.current = false;
    }
  }, []);

  // Delete text at specific position
  const deleteText = useCallback((index: number, length: number) => {
    const yText = yTextRef.current;
    if (!yText) return;

    try {
      isLocalUpdateRef.current = true;
      yText.delete(index, length);

      // Update local state
      setContent(yText.toString());
    } catch (error) {
      console.error("[useCollaborativeDocument] Error deleting text:", error);
      isLocalUpdateRef.current = false;
    }
  }, []);

  return {
    content,
    updateContent,
    insertText,
    deleteText,
    awareness,
    isLoading,
  };
}
