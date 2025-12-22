import { useState, useEffect, useCallback, useRef } from "react";
import { createCollaborationSession } from "../yjs-provider";
import { trackPresence, updateCursor as updateCursorPresence } from "../presence";
import { CollaborationSession, PresenceTracker, UserPresence, CursorPosition } from "../types";

export interface UseCollaborationOptions {
  projectId: string;
  userId: string;
  userName?: string;
  wsUrl?: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

export interface UseCollaborationResult {
  session: CollaborationSession | null;
  users: UserPresence[];
  cursors: Map<string, CursorPosition>;
  isConnected: boolean;
  updateCursor: (position: CursorPosition) => void;
  updateSelection: (file: string, start: number, end: number) => void;
  clearSelection: () => void;
}

/**
 * React hook for managing real-time collaboration
 * @param options - Collaboration configuration
 * @returns Collaboration state and methods
 */
export function useCollaboration(
  options: UseCollaborationOptions
): UseCollaborationResult {
  const { projectId, userId, userName, wsUrl, onConnected, onDisconnected, onError } = options;

  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  const presenceTrackerRef = useRef<PresenceTracker | null>(null);

  // Initialize collaboration session
  useEffect(() => {
    let mounted = true;
    let collaborationSession: CollaborationSession | null = null;
    let presenceTracker: PresenceTracker | null = null;

    try {
      // Create session
      collaborationSession = createCollaborationSession(projectId, userId, wsUrl);

      // Set user name if provided
      if (userName) {
        collaborationSession.provider.awareness.setLocalStateField("user", {
          id: userId,
          name: userName,
          color: collaborationSession.provider.awareness.getLocalState()?.user?.color,
        });
      }

      // Track presence
      presenceTracker = trackPresence(collaborationSession);
      presenceTrackerRef.current = presenceTracker;

      // Subscribe to user changes
      const unsubscribe = presenceTracker.subscribe((updatedUsers) => {
        if (!mounted) return;

        const usersList = Array.from(updatedUsers.values());
        setUsers(usersList);

        // Extract cursors
        const newCursors = new Map<string, CursorPosition>();
        usersList.forEach((user) => {
          if (user.cursor && user.id !== userId) {
            newCursors.set(user.id, user.cursor);
          }
        });
        setCursors(newCursors);
      });

      // Handle connection status
      const handleStatus = (event: { status: string }) => {
        if (!mounted) return;

        const connected = event.status === "connected";
        setIsConnected(connected);

        if (connected) {
          onConnected?.();
        } else {
          onDisconnected?.();
        }
      };

      collaborationSession.provider.on("status", handleStatus);

      if (mounted) {
        setSession(collaborationSession);
      }

      // Cleanup
      return () => {
        mounted = false;
        unsubscribe();
        presenceTracker?.destroy();
        collaborationSession?.disconnect();
      };
    } catch (error) {
      console.error("[useCollaboration] Error initializing:", error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [projectId, userId, userName, wsUrl, onConnected, onDisconnected, onError]);

  // Update cursor position
  const updateCursor = useCallback((position: CursorPosition) => {
    if (presenceTrackerRef.current) {
      updateCursorPresence(
        presenceTrackerRef.current,
        position.x,
        position.y,
        position.element
      );
    }
  }, []);

  // Update text selection
  const updateSelection = useCallback((file: string, start: number, end: number) => {
    if (presenceTrackerRef.current) {
      presenceTrackerRef.current.updatePresence({
        selection: { file, start, end },
      });
    }
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    if (presenceTrackerRef.current) {
      presenceTrackerRef.current.updatePresence({
        selection: undefined,
      });
    }
  }, []);

  return {
    session,
    users,
    cursors,
    isConnected,
    updateCursor,
    updateSelection,
    clearSelection,
  };
}
