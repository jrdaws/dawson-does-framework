/**
 * Example: Starting a Collaboration WebSocket Server
 *
 * This server handles real-time collaboration for multiple projects.
 * Each project gets its own room for document syncing and presence.
 */

import { createCollaborationServer, createInMemoryPersistence, setupPersistence } from "../src";

// Optional: Set up persistence (in-memory for this example)
const persistence = createInMemoryPersistence();
setupPersistence(persistence);

// Create the collaboration server
const server = createCollaborationServer({
  port: 1234,
  host: "0.0.0.0",
  path: "/collaborate",
});

console.log("🚀 Collaboration server running on ws://localhost:1234/collaborate");
console.log("📝 Ready to handle multiple project rooms");

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n⏳ Shutting down server...");
  await server.close();
  console.log("✅ Server closed");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n⏳ Shutting down server...");
  await server.close();
  console.log("✅ Server closed");
  process.exit(0);
});
