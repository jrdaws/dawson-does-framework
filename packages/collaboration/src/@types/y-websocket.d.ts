declare module "y-websocket/bin/utils" {
  import * as Y from "yjs";
  import { IncomingMessage } from "http";
  import { WebSocket } from "ws";

  export function setupWSConnection(
    conn: WebSocket,
    req: IncomingMessage,
    options?: { docName?: string; gc?: boolean }
  ): void;

  export function setPersistence(persistence: {
    bindState: (docName: string, doc: Y.Doc) => void;
    writeState: (docName: string, doc: Y.Doc) => Promise<void>;
  }): void;
}
