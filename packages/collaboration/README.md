# @dawson-framework/collaboration

Real-time collaboration system with live cursors, presence, and collaborative editing using Yjs CRDTs.

## Features

- **Real-time Cursors**: See where other users are pointing
- **Live Presence**: Track who's online and active
- **Collaborative Editing**: Multiple users can edit documents simultaneously
- **CRDT-based**: Conflict-free replicated data types ensure consistency
- **Low Latency**: WebSocket-based communication for <100ms updates
- **React Hooks**: Easy integration with React applications

## Installation

```bash
npm install @dawson-framework/collaboration
```

## Quick Start

### 1. Start the Collaboration Server

```typescript
import { createCollaborationServer } from "@dawson-framework/collaboration";

const server = createCollaborationServer({
  port: 1234,
  host: "0.0.0.0",
  path: "/collaborate",
});

console.log("Collaboration server running on ws://localhost:1234/collaborate");
```

### 2. Use in React Components

```typescript
import { useCollaboration, useCollaborativeDocument } from "@dawson-framework/collaboration";

function Editor({ projectId, userId, userName }) {
  // Set up collaboration
  const { users, cursors, isConnected, updateCursor, session } = useCollaboration({
    projectId,
    userId,
    userName,
    wsUrl: "ws://localhost:1234/collaborate",
    onConnected: () => console.log("Connected!"),
  });

  // Set up collaborative document
  const { content, updateContent, awareness } = useCollaborativeDocument({
    session,
    filePath: "src/App.tsx",
    onContentChange: (newContent) => console.log("Content changed:", newContent),
  });

  // Track mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    updateCursor({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <div className="users">
        {users.map((user) => (
          <div key={user.id} style={{ color: user.color }}>
            {user.name}
          </div>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => updateContent(e.target.value)}
      />

      {/* Render other users' cursors */}
      {Array.from(cursors.entries()).map(([userId, cursor]) => (
        <div
          key={userId}
          className="cursor"
          style={{
            position: "fixed",
            left: cursor.x,
            top: cursor.y,
            pointerEvents: "none",
          }}
        >
          👆
        </div>
      ))}
    </div>
  );
}
```

## API Reference

### Server

#### `createCollaborationServer(options)`

Creates a WebSocket server for collaboration.

```typescript
const server = createCollaborationServer({
  port: 1234,
  host: "0.0.0.0",
  path: "/collaborate",
});

// Close server when done
await server.close();
```

### React Hooks

#### `useCollaboration(options)`

Main hook for managing collaboration session.

```typescript
const {
  session,        // CollaborationSession | null
  users,          // UserPresence[] - All connected users
  cursors,        // Map<string, CursorPosition> - User cursors
  isConnected,    // boolean - Connection status
  updateCursor,   // (position: CursorPosition) => void
  updateSelection,// (file: string, start: number, end: number) => void
  clearSelection, // () => void
} = useCollaboration({
  projectId: "my-project",
  userId: "user-123",
  userName: "John Doe",
  wsUrl: "ws://localhost:1234",
  onConnected: () => console.log("Connected"),
  onDisconnected: () => console.log("Disconnected"),
  onError: (error) => console.error(error),
});
```

#### `useCollaborativeDocument(options)`

Hook for collaborative document editing.

```typescript
const {
  content,        // string - Current document content
  updateContent,  // (content: string, cursor?: number) => void
  insertText,     // (text: string, index: number) => void
  deleteText,     // (index: number, length: number) => void
  awareness,      // AwarenessState - User awareness info
  isLoading,      // boolean - Loading state
} = useCollaborativeDocument({
  session,
  filePath: "src/App.tsx",
  onContentChange: (content) => console.log("Changed:", content),
  debounceMs: 100,
});
```

### Core Functions

#### `createCollaborationSession(projectId, userId, wsUrl?)`

Creates a collaboration session without React.

```typescript
import { createCollaborationSession, trackPresence } from "@dawson-framework/collaboration";

const session = createCollaborationSession("project-123", "user-456");
const presence = trackPresence(session);

// Subscribe to user changes
const unsubscribe = presence.subscribe((users) => {
  console.log("Users:", Array.from(users.values()));
});

// Update cursor
presence.updatePresence({
  cursor: { x: 100, y: 200 },
});

// Cleanup
unsubscribe();
presence.destroy();
session.disconnect();
```

## Advanced Usage

### Custom Persistence

```typescript
import { setupPersistence } from "@dawson-framework/collaboration";

setupPersistence({
  bindState: (docName, doc) => {
    // Load from database
    const data = await db.getDocument(docName);
    if (data) {
      Y.applyUpdate(doc, data);
    }
  },
  writeState: async (docName, doc) => {
    // Save to database
    const state = Y.encodeStateAsUpdate(doc);
    await db.saveDocument(docName, state);
  },
});
```

### Direct Yjs Access

```typescript
import { getSharedText, observeText } from "@dawson-framework/collaboration";

const yText = getSharedText(session, "file.txt");

// Observe changes
const unobserve = observeText(yText, (event) => {
  console.log("Text changed:", yText.toString());
});

// Manual operations
yText.insert(0, "Hello ");
yText.delete(0, 6);
```

## Types

```typescript
interface UserPresence {
  id: string;
  name: string;
  color: string;
  cursor: { x: number; y: number; element?: string };
  selection?: { start: number; end: number; file: string };
  lastActive: Date;
}

interface CollaborationSession {
  doc: Y.Doc;
  provider: WebsocketProvider;
  projectId: string;
  userId: string;
  disconnect: () => void;
}
```

## Performance

- Cursor updates: <100ms latency
- Document sync: Near-instant with conflict resolution
- Supports 2-10 concurrent users comfortably
- WebSocket-based for minimal overhead

## License

MIT
