/**
 * Stub for @dawson-framework/collaboration package
 * Used when the package is not available (e.g., Vercel build)
 */

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  selectedElement?: string;
  isActive: boolean;
}

export interface CursorPosition {
  x: number;
  y: number;
  elementId?: string;
}

export interface CollaborationState {
  users: UserPresence[];
  cursors: Map<string, CursorPosition>;
  isConnected: boolean;
}

// Stub hooks that return empty/default values
export function useCollaboration() {
  return {
    users: [] as UserPresence[],
    isConnected: false,
    currentUserId: null,
    connect: () => {},
    disconnect: () => {},
  };
}

export function useCollaborativeDocument() {
  return {
    html: "",
    updateHtml: () => {},
    cursors: new Map<string, CursorPosition>(),
    updateCursor: () => {},
  };
}

export function useCursors() {
  return {
    cursors: new Map<string, CursorPosition>(),
    updateCursor: () => {},
  };
}

