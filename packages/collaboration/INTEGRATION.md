# Integration Guide

This guide shows how to integrate the collaboration package into the Dawson Framework website.

## Step 1: Install the Package

In the website directory:

```bash
cd ../../website
npm install ../packages/collaboration
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "@dawson-framework/collaboration": "file:../packages/collaboration"
  }
}
```

## Step 2: Start the Collaboration Server

Create `website/lib/collaboration-server.ts`:

```typescript
import { createCollaborationServer } from "@dawson-framework/collaboration";

let server: any = null;

export async function startCollaborationServer() {
  if (server) return server;

  server = createCollaborationServer({
    port: process.env.COLLABORATION_PORT || 1234,
    host: "0.0.0.0",
    path: "/collaborate",
  });

  return server;
}
```

## Step 3: Add WebSocket Endpoint (Next.js API Route)

Create `website/app/api/collaborate/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { startCollaborationServer } from "@/lib/collaboration-server";

// Initialize server on first request
let serverInitialized = false;

export async function GET(request: NextRequest) {
  if (!serverInitialized) {
    await startCollaborationServer();
    serverInitialized = true;
  }

  return new Response("Collaboration server running", { status: 200 });
}
```

**Note**: For production, run the WebSocket server as a separate process rather than inside Next.js API routes.

## Step 4: Integrate with Code Editor

Update your code editor component (e.g., `website/app/components/configurator/CodeEditor.tsx`):

```typescript
import { useCollaboration, useCollaborativeDocument } from "@dawson-framework/collaboration";
import { useEffect } from "react";

export function CodeEditor({ projectId, filePath }: { projectId: string; filePath: string }) {
  const userId = getUserId(); // Get from session/auth
  const userName = getUserName(); // Get from session/auth

  // Set up collaboration
  const {
    session,
    users,
    cursors,
    isConnected,
    updateCursor,
  } = useCollaboration({
    projectId,
    userId,
    userName,
    wsUrl: process.env.NEXT_PUBLIC_COLLABORATION_WS || "ws://localhost:1234/collaborate",
  });

  // Set up collaborative document
  const {
    content,
    updateContent,
    isLoading,
  } = useCollaborativeDocument({
    session,
    filePath,
  });

  // Your existing editor code...
  // Replace local state with `content` and `updateContent`

  return (
    <div>
      {/* Connection indicator */}
      <div className="flex items-center gap-2">
        <div className={isConnected ? "bg-green-500" : "bg-red-500"} />
        <span>{isConnected ? "Connected" : "Disconnected"}</span>
      </div>

      {/* Online users */}
      <div className="flex gap-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </div>
        ))}
      </div>

      {/* Your editor component */}
      <Editor
        value={content}
        onChange={(newContent) => updateContent(newContent)}
        loading={isLoading}
      />

      {/* Render cursors */}
      {Array.from(cursors.entries()).map(([userId, cursor]) => {
        const user = users.find((u) => u.id === userId);
        return user ? (
          <Cursor key={userId} position={cursor} user={user} />
        ) : null;
      })}
    </div>
  );
}
```

## Step 5: Add Cursor Component

Create `website/app/components/configurator/Cursor.tsx`:

```typescript
import { CursorPosition, UserPresence } from "@dawson-framework/collaboration";

export function Cursor({ position, user }: { position: CursorPosition; user: UserPresence }) {
  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-100"
      style={{ left: position.x, top: position.y }}
    >
      <div style={{ color: user.color }}>▼</div>
      <div
        className="text-xs px-2 py-1 rounded text-white whitespace-nowrap mt-1"
        style={{ backgroundColor: user.color }}
      >
        {user.name}
      </div>
    </div>
  );
}
```

## Step 6: Environment Variables

Add to `website/.env.local`:

```env
# Collaboration
COLLABORATION_PORT=1234
NEXT_PUBLIC_COLLABORATION_WS=ws://localhost:1234/collaborate

# For production
# NEXT_PUBLIC_COLLABORATION_WS=wss://your-domain.com/collaborate
```

## Step 7: Production Deployment

For production, run the collaboration server as a separate Node.js process:

Create `website/collaboration-server.js`:

```javascript
const { createCollaborationServer } = require("@dawson-framework/collaboration");

const server = createCollaborationServer({
  port: process.env.COLLABORATION_PORT || 1234,
  host: "0.0.0.0",
  path: "/collaborate",
});

console.log("Collaboration server running");
```

Add to `package.json`:

```json
{
  "scripts": {
    "collab-server": "node collaboration-server.js"
  }
}
```

Run both servers:

```bash
# Terminal 1: Next.js app
npm run dev

# Terminal 2: Collaboration server
npm run collab-server
```

## Docker Compose Example

```yaml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_COLLABORATION_WS=ws://collaboration:1234/collaborate

  collaboration:
    build: .
    command: npm run collab-server
    ports:
      - "1234:1234"
    environment:
      - COLLABORATION_PORT=1234
```

## Testing

1. Open your app in two browser windows
2. Make changes in one window
3. See the changes appear in real-time in the other window
4. Move your mouse and see cursors in both windows

## Troubleshooting

### Connection Issues

- Check WebSocket URL in browser console
- Ensure collaboration server is running
- Check firewall/proxy settings
- Verify CORS configuration if needed

### Performance Issues

- Limit cursor update frequency (throttle to 50-100ms)
- Implement debouncing for text changes
- Consider using a production WebSocket server (e.g., uWebSockets)

### Persistence

For production, implement database persistence:

```typescript
import { setupPersistence } from "@dawson-framework/collaboration";
import * as Y from "yjs";

setupPersistence({
  bindState: async (docName, doc) => {
    const data = await db.documents.findOne({ name: docName });
    if (data?.state) {
      Y.applyUpdate(doc, Buffer.from(data.state, "base64"));
    }
  },
  writeState: async (docName, doc) => {
    const state = Y.encodeStateAsUpdate(doc);
    await db.documents.upsert({
      name: docName,
      state: Buffer.from(state).toString("base64"),
    });
  },
});
```

## Next Steps

- Add authentication to collaboration sessions
- Implement permissions (read-only vs read-write)
- Add presence timeouts for inactive users
- Implement cursor smoothing/interpolation
- Add user avatars instead of initials
- Implement chat alongside collaboration
