import { Awareness } from "y-protocols/awareness";
import { CollaborationSession, UserPresence, PresenceTracker } from "./types";

/**
 * Creates a presence tracker for monitoring connected users
 * @param session - Active collaboration session
 * @returns PresenceTracker instance
 */
export function trackPresence(session: CollaborationSession): PresenceTracker {
  const awareness = session.provider.awareness;
  const subscribers = new Set<(users: Map<string, UserPresence>) => void>();

  // Update presence data with activity timestamp
  const updatePresence = (presence: Partial<UserPresence>) => {
    const currentState = awareness.getLocalState() || {};
    const user = currentState.user || {
      id: session.userId,
      name: `User ${session.userId.slice(0, 8)}`,
      color: generateUserColor(session.userId),
    };

    awareness.setLocalStateField("user", {
      ...user,
      ...presence,
      lastActive: new Date(),
    });
  };

  // Get all connected users
  const getUsers = (): Map<string, UserPresence> => {
    const users = new Map<string, UserPresence>();

    awareness.getStates().forEach((state, clientId) => {
      if (state.user) {
        users.set(clientId.toString(), {
          ...state.user,
          lastActive: state.user.lastActive
            ? new Date(state.user.lastActive)
            : new Date(),
        });
      }
    });

    return users;
  };

  // Notify subscribers of changes
  const notifySubscribers = () => {
    const users = getUsers();
    subscribers.forEach((callback) => callback(users));
  };

  // Subscribe to awareness changes
  const handleAwarenessChange = () => {
    notifySubscribers();
  };

  awareness.on("change", handleAwarenessChange);

  // Subscribe to user changes
  const subscribe = (
    callback: (users: Map<string, UserPresence>) => void
  ): (() => void) => {
    subscribers.add(callback);

    // Immediately call with current state
    callback(getUsers());

    // Return unsubscribe function
    return () => {
      subscribers.delete(callback);
    };
  };

  // Cleanup
  const destroy = () => {
    awareness.off("change", handleAwarenessChange);
    subscribers.clear();
  };

  // Set up periodic heartbeat to update lastActive
  const heartbeatInterval = setInterval(() => {
    updatePresence({});
  }, 30000); // Update every 30 seconds

  // Clear interval on destroy
  const originalDestroy = destroy;
  const destroyWithCleanup = () => {
    clearInterval(heartbeatInterval);
    originalDestroy();
  };

  return {
    updatePresence,
    getUsers,
    subscribe,
    destroy: destroyWithCleanup,
  };
}

/**
 * Updates cursor position in presence
 * @param tracker - PresenceTracker instance
 * @param x - Cursor X coordinate
 * @param y - Cursor Y coordinate
 * @param element - Optional element identifier
 */
export function updateCursor(
  tracker: PresenceTracker,
  x: number,
  y: number,
  element?: string
) {
  tracker.updatePresence({
    cursor: { x, y, element },
  });
}

/**
 * Updates text selection in presence
 * @param tracker - PresenceTracker instance
 * @param file - File path
 * @param start - Selection start position
 * @param end - Selection end position
 */
export function updateSelection(
  tracker: PresenceTracker,
  file: string,
  start: number,
  end: number
) {
  tracker.updatePresence({
    selection: { file, start, end },
  });
}

/**
 * Clears selection in presence
 * @param tracker - PresenceTracker instance
 */
export function clearSelection(tracker: PresenceTracker) {
  tracker.updatePresence({
    selection: undefined,
  });
}

/**
 * Gets all active users (active within the last 2 minutes)
 * @param tracker - PresenceTracker instance
 * @returns Array of active users
 */
export function getActiveUsers(tracker: PresenceTracker): UserPresence[] {
  const users = tracker.getUsers();
  const now = Date.now();
  const activeThreshold = 2 * 60 * 1000; // 2 minutes

  return Array.from(users.values()).filter((user) => {
    const lastActive = user.lastActive.getTime();
    return now - lastActive < activeThreshold;
  });
}

/**
 * Generates a consistent color for a user based on their ID
 * @param userId - User identifier
 * @returns Hex color string
 */
function generateUserColor(userId: string): string {
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

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
