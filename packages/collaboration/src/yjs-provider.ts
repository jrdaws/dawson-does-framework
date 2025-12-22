import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CollaborationSession } from "./types";

/**
 * Creates a collaborative editing session using Yjs and WebSocket
 * @param projectId - Unique identifier for the project
 * @param userId - Unique identifier for the current user
 * @param wsUrl - WebSocket server URL (default: ws://localhost:1234)
 * @returns CollaborationSession object with doc, provider, and disconnect method
 */
export function createCollaborationSession(
  projectId: string,
  userId: string,
  wsUrl: string = "ws://localhost:1234"
): CollaborationSession {
  // Create a new Yjs document
  const doc = new Y.Doc();

  // Create WebSocket provider for syncing
  const provider = new WebsocketProvider(wsUrl, `project-${projectId}`, doc, {
    connect: true,
  });

  // Set user metadata in awareness
  provider.awareness.setLocalStateField("user", {
    id: userId,
    name: `User ${userId.slice(0, 8)}`,
    color: generateUserColor(userId),
  });

  // Handle connection events
  provider.on("status", (event: { status: string }) => {
    console.log(`[Collaboration] WebSocket status: ${event.status}`);
  });

  provider.on("sync", (isSynced: boolean) => {
    if (isSynced) {
      console.log("[Collaboration] Document synced with server");
    }
  });

  // Disconnect method
  const disconnect = () => {
    provider.disconnect();
    doc.destroy();
  };

  return {
    doc,
    provider,
    projectId,
    userId,
    disconnect,
  };
}

/**
 * Gets a shared Yjs text type for a specific file
 * @param session - Active collaboration session
 * @param filePath - Path to the file
 * @returns Y.Text instance for collaborative editing
 */
export function getSharedText(
  session: CollaborationSession,
  filePath: string
): Y.Text {
  return session.doc.getText(filePath);
}

/**
 * Gets a shared Yjs map for storing arbitrary data
 * @param session - Active collaboration session
 * @param key - Key for the shared map
 * @returns Y.Map instance
 */
export function getSharedMap<T = any>(
  session: CollaborationSession,
  key: string
): Y.Map<T> {
  return session.doc.getMap<T>(key);
}

/**
 * Generates a consistent color for a user based on their ID
 * @param userId - User identifier
 * @returns Hex color string
 */
function generateUserColor(userId: string): string {
  // Color palette for user cursors
  const colors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#FFA07A", // Light Salmon
    "#98D8C8", // Mint
    "#F7B731", // Yellow
    "#5F27CD", // Purple
    "#00D2D3", // Cyan
    "#FF9FF3", // Pink
    "#54A0FF", // Light Blue
    "#48DBFB", // Sky Blue
    "#1DD1A1", // Green
  ];

  // Generate consistent index from userId
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Observes changes to a shared text document
 * @param text - Y.Text instance
 * @param callback - Function called when text changes
 * @returns Unsubscribe function
 */
export function observeText(
  text: Y.Text,
  callback: (event: Y.YTextEvent) => void
): () => void {
  text.observe(callback);
  return () => text.unobserve(callback);
}
