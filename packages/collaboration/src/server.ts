import * as Y from "yjs";
import { WebSocketServer, WebSocket } from "ws";
import * as http from "http";
import { setupWSConnection, setPersistence } from "y-websocket/bin/utils";
import { Server, CollaborationServerOptions } from "./types";

/**
 * Creates a WebSocket server for Yjs collaboration
 * @param options - Server configuration options
 * @returns Server instance with close method
 */
export function createCollaborationServer(
  options: CollaborationServerOptions
): Server {
  const { port, host = "0.0.0.0", path = "/" } = options;

  // Create HTTP server
  const server = http.createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Collaboration WebSocket Server");
  });

  // Create WebSocket server
  const wss = new WebSocketServer({
    server,
    path,
  });

  // Store Y.Doc instances per project
  const docs = new Map<string, WSSharedDoc>();

  // Handle WebSocket connections
  wss.on("connection", (conn: WebSocket, req: http.IncomingMessage) => {
    // Extract room name from URL
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const docName = url.pathname.replace(path, "").replace(/^\//, "") || "default";

    console.log(`[Collaboration] Client connected to room: ${docName}`);

    setupWSConnection(conn, req, { docName, gc: true });

    conn.on("close", () => {
      console.log(`[Collaboration] Client disconnected from room: ${docName}`);
    });
  });

  // Start server
  server.listen(port, host, () => {
    console.log(`[Collaboration] WebSocket server running on ws://${host}:${port}${path}`);
  });

  // Handle server errors
  server.on("error", (error) => {
    console.error("[Collaboration] Server error:", error);
  });

  wss.on("error", (error) => {
    console.error("[Collaboration] WebSocket error:", error);
  });

  // Close method
  const close = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Close all WebSocket connections
      wss.clients.forEach((client) => {
        client.close();
      });

      // Close WebSocket server
      wss.close((err) => {
        if (err) {
          reject(err);
          return;
        }

        // Close HTTP server
        server.close((err) => {
          if (err) {
            reject(err);
            return;
          }

          // Clear documents
          docs.forEach((doc) => doc.destroy());
          docs.clear();

          console.log("[Collaboration] Server closed successfully");
          resolve();
        });
      });
    });
  };

  return {
    port,
    close,
  };
}

/**
 * Extended WSSharedDoc with destroy method
 */
interface WSSharedDoc extends Y.Doc {
  conns: Map<any, Set<number>>;
  awareness: any;
  destroy(): void;
}

/**
 * Optional: Set up persistence for Yjs documents
 * This can be used to persist documents to a database
 * @param persistenceAdapter - Function to handle document persistence
 */
export function setupPersistence(
  persistenceAdapter: {
    bindState: (docName: string, doc: Y.Doc) => void;
    writeState: (docName: string, doc: Y.Doc) => Promise<void>;
  }
) {
  setPersistence({
    bindState: persistenceAdapter.bindState,
    writeState: persistenceAdapter.writeState,
  });
}

/**
 * Creates a simple in-memory persistence adapter (for development)
 * In production, you should use a database-backed persistence
 */
export function createInMemoryPersistence() {
  const storage = new Map<string, Uint8Array>();

  return {
    bindState: (docName: string, doc: Y.Doc) => {
      const persistedState = storage.get(docName);
      if (persistedState) {
        Y.applyUpdate(doc, persistedState);
      }

      doc.on("update", (update: Uint8Array) => {
        storage.set(docName, Y.encodeStateAsUpdate(doc));
      });
    },
    writeState: async (docName: string, doc: Y.Doc): Promise<void> => {
      const state = Y.encodeStateAsUpdate(doc);
      storage.set(docName, state);
    },
  };
}
