// Types
export type {
  CursorPosition,
  Selection,
  UserPresence,
  CollaborationSession,
  PresenceTracker,
  AwarenessState,
  CollaborationServerOptions,
  Server,
} from "./types";

// Yjs Provider
export {
  createCollaborationSession,
  getSharedText,
  getSharedMap,
  observeText,
} from "./yjs-provider";

// Presence Tracking
export {
  trackPresence,
  updateCursor,
  updateSelection,
  clearSelection,
  getActiveUsers,
} from "./presence";

// Server
export {
  createCollaborationServer,
  setupPersistence,
  createInMemoryPersistence,
} from "./server";

// React Hooks
export {
  useCollaboration,
  type UseCollaborationOptions,
  type UseCollaborationResult,
} from "./hooks/useCollaboration";

export {
  useCollaborativeDocument,
  type UseCollaborativeDocumentOptions,
  type UseCollaborativeDocumentResult,
} from "./hooks/useCollaborativeDocument";
