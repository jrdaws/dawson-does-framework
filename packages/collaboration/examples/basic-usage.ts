/**
 * Example: Basic Usage Without React
 *
 * This demonstrates how to use the collaboration API directly
 * without React hooks - useful for Node.js applications or
 * vanilla JavaScript projects.
 */

import {
  createCollaborationSession,
  trackPresence,
  getSharedText,
  observeText,
} from "../src";

// Create a collaboration session
const session = createCollaborationSession(
  "my-project-123", // Project ID
  "user-abc", // User ID
  "ws://localhost:1234/collaborate" // WebSocket URL
);

console.log("✅ Created collaboration session");

// Track presence
const presence = trackPresence(session);

// Subscribe to user changes
const unsubscribePresence = presence.subscribe((users) => {
  console.log(`👥 ${users.size} users online:`);
  users.forEach((user) => {
    console.log(`  - ${user.name} (${user.id})`);
    console.log(`    Cursor: (${user.cursor.x}, ${user.cursor.y})`);
    if (user.selection) {
      console.log(
        `    Selection: ${user.selection.file} [${user.selection.start}:${user.selection.end}]`
      );
    }
  });
});

// Update your cursor position
setInterval(() => {
  presence.updatePresence({
    cursor: {
      x: Math.random() * 1000,
      y: Math.random() * 1000,
    },
  });
}, 1000);

// Get a shared text document
const yText = getSharedText(session, "README.md");

console.log("📝 Initial content:", yText.toString());

// Observe text changes
const unobserveText = observeText(yText, (event) => {
  console.log("📝 Text changed!");
  console.log("  Delta:", event.delta);
  console.log("  New content:", yText.toString());
});

// Insert some text
setTimeout(() => {
  yText.insert(0, "# My Collaborative Document\n\n");
  console.log("✏️  Inserted header");
}, 2000);

// Insert more text
setTimeout(() => {
  yText.insert(yText.length, "This document is synced in real-time!\n");
  console.log("✏️  Added content");
}, 4000);

// Delete some text
setTimeout(() => {
  yText.delete(0, 5); // Delete "# My "
  console.log("🗑️  Deleted some text");
}, 6000);

// Cleanup after 10 seconds
setTimeout(() => {
  console.log("\n🧹 Cleaning up...");
  unobserveText();
  unsubscribePresence();
  presence.destroy();
  session.disconnect();
  console.log("✅ Session closed");
  process.exit(0);
}, 10000);
