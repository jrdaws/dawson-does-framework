"use client";

import React from "react";
import { UserPresence, CursorPosition } from "@dawson-framework/collaboration";

interface RemoteCursorProps {
  user: UserPresence;
  cursor: CursorPosition;
}

export function RemoteCursor({ user, cursor }: RemoteCursorProps) {
  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-all duration-100"
      style={{
        left: cursor.x,
        top: cursor.y,
        transform: "translate(-4px, -4px)",
      }}
    >
      {/* Cursor pointer */}
      <div
        className="relative"
        style={{ color: user.color }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="drop-shadow-lg"
        >
          <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" />
        </svg>
      </div>

      {/* User label */}
      <div
        className="absolute top-5 left-2 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap shadow-lg"
        style={{
          backgroundColor: user.color,
        }}
      >
        {user.name}
      </div>
    </div>
  );
}
