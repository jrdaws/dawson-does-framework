import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export interface CursorPosition {
  x: number;
  y: number;
  element?: string;
}

export interface Selection {
  start: number;
  end: number;
  file: string;
}

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  cursor: CursorPosition;
  selection?: Selection;
  lastActive: Date;
}

export interface CollaborationSession {
  doc: Y.Doc;
  provider: WebsocketProvider;
  projectId: string;
  userId: string;
  disconnect: () => void;
}

export interface PresenceTracker {
  updatePresence: (presence: Partial<UserPresence>) => void;
  getUsers: () => Map<string, UserPresence>;
  subscribe: (callback: (users: Map<string, UserPresence>) => void) => () => void;
  destroy: () => void;
}

export interface AwarenessState {
  users: Map<string, UserPresence>;
  localUser: UserPresence | null;
}

export interface CollaborationServerOptions {
  port: number;
  host?: string;
  path?: string;
}

export interface Server {
  port: number;
  close: () => Promise<void>;
}
