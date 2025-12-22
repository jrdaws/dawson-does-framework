/**
 * Example: React Collaborative Editor Component
 *
 * This component demonstrates a full collaborative editing experience:
 * - Live cursors showing where other users are pointing
 * - User presence (who's online)
 * - Real-time document editing
 * - Text selection syncing
 */

import React, { useEffect, useRef, useState } from "react";
import { useCollaboration, useCollaborativeDocument } from "../src";

interface CollaborativeEditorProps {
  projectId: string;
  userId: string;
  userName: string;
  filePath: string;
}

export function CollaborativeEditor({
  projectId,
  userId,
  userName,
  filePath,
}: CollaborativeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Set up collaboration
  const {
    session,
    users,
    cursors,
    isConnected,
    updateCursor,
    updateSelection,
    clearSelection,
  } = useCollaboration({
    projectId,
    userId,
    userName,
    wsUrl: "ws://localhost:1234/collaborate",
    onConnected: () => console.log("✅ Connected to collaboration server"),
    onDisconnected: () => console.log("⚠️ Disconnected from server"),
    onError: (error) => console.error("❌ Collaboration error:", error),
  });

  // Set up collaborative document
  const { content, updateContent, awareness, isLoading } =
    useCollaborativeDocument({
      session,
      filePath,
      onContentChange: (newContent) => {
        console.log("📝 Document updated:", newContent.length, "characters");
      },
    });

  // Track mouse movement for cursor position
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    setCursorPosition({ x, y });
    updateCursor({ x, y, element: "editor" });
  };

  // Track text selection
  const handleSelect = () => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      updateSelection(filePath, start, end);
    } else {
      clearSelection();
    }
  };

  // Handle content changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPos = e.target.selectionStart;
    updateContent(newContent, cursorPos);
  };

  if (isLoading) {
    return <div className="loading">Loading collaborative editor...</div>;
  }

  return (
    <div className="collaborative-editor" onMouseMove={handleMouseMove}>
      {/* Connection Status */}
      <div className="status-bar">
        <div className={`status ${isConnected ? "connected" : "disconnected"}`}>
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>

        {/* Online Users */}
        <div className="users">
          <span>👥 Online:</span>
          {users.map((user) => (
            <div
              key={user.id}
              className="user-badge"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="editor-container">
        <textarea
          ref={editorRef}
          className="editor"
          value={content}
          onChange={handleChange}
          onSelect={handleSelect}
          placeholder="Start typing... (Changes sync in real-time)"
          spellCheck={false}
        />

        {/* Other users' cursors */}
        {Array.from(cursors.entries()).map(([userId, cursor]) => {
          const user = users.find((u) => u.id === userId);
          if (!user) return null;

          return (
            <div
              key={userId}
              className="remote-cursor"
              style={{
                position: "fixed",
                left: cursor.x,
                top: cursor.y,
                pointerEvents: "none",
                zIndex: 1000,
              }}
            >
              <div
                className="cursor-pointer"
                style={{ color: user.color }}
              >
                ▼
              </div>
              <div
                className="cursor-label"
                style={{
                  backgroundColor: user.color,
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  marginTop: "2px",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="stats">
        <span>📄 {filePath}</span>
        <span>📝 {content.length} characters</span>
        <span>👥 {users.length} users</span>
      </div>
    </div>
  );
}

// Example CSS (add to your stylesheet)
const exampleCSS = `
.collaborative-editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.status.connected {
  color: #22c55e;
  font-weight: 600;
}

.status.disconnected {
  color: #ef4444;
  font-weight: 600;
}

.users {
  display: flex;
  gap: 8px;
  align-items: center;
}

.user-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.editor-container {
  flex: 1;
  position: relative;
}

.editor {
  width: 100%;
  height: 100%;
  padding: 20px;
  border: none;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.stats {
  display: flex;
  gap: 16px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  font-size: 12px;
  color: #666;
}

.remote-cursor {
  transition: all 0.1s ease-out;
}
`;

export default CollaborativeEditor;
