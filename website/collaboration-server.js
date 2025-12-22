/**
 * Collaboration WebSocket Server
 *
 * This server handles real-time collaboration for the web editor.
 * Run this as a separate process alongside the Next.js app:
 *
 *   npm run collab-server
 *
 * The server will run on port 1234 by default.
 */

const { createCollaborationServer, createInMemoryPersistence, setupPersistence } = require("@dawson-framework/collaboration");

const PORT = process.env.COLLABORATION_PORT || 1234;
const HOST = process.env.COLLABORATION_HOST || "0.0.0.0";

// Set up in-memory persistence (for development)
// In production, you should use a database-backed persistence
const persistence = createInMemoryPersistence();
setupPersistence(persistence);

console.log("🚀 Starting collaboration server...");

// Create the collaboration server
const server = createCollaborationServer({
  port: PORT,
  host: HOST,
  path: "/collaborate",
});

console.log(`✅ Collaboration server running on ws://${HOST}:${PORT}/collaborate`);
console.log("📝 Ready to handle real-time collaboration");
console.log("\nPress Ctrl+C to stop the server\n");

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n⏳ Shutting down collaboration server...");
  await server.close();
  console.log("✅ Server closed");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n⏳ Shutting down collaboration server...");
  await server.close();
  console.log("✅ Server closed");
  process.exit(0);
});

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled rejection:", error);
  process.exit(1);
});
