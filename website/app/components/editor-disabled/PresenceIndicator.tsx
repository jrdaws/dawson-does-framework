"use client";

import React from "react";
import { UserPresence } from "@dawson-framework/collaboration";
import { Users } from "lucide-react";

interface PresenceIndicatorProps {
  users: UserPresence[];
  currentUserId: string | null;
  isConnected: boolean;
}

export function PresenceIndicator({
  users,
  currentUserId,
  isConnected,
}: PresenceIndicatorProps) {
  // Filter out current user
  const otherUsers = users.filter((user) => user.id !== currentUserId);

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-terminal-bg/50 border-b border-terminal-text/20">
      {/* Connection status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
          title={isConnected ? "Connected" : "Disconnected"}
        />
        <span className="text-xs text-terminal-dim">
          {isConnected ? "Live" : "Offline"}
        </span>
      </div>

      {/* Users count */}
      {otherUsers.length > 0 && (
        <>
          <div className="w-px h-4 bg-terminal-text/20" />
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-terminal-accent" />
            <span className="text-xs text-terminal-text font-medium">
              {otherUsers.length} {otherUsers.length === 1 ? "user" : "users"} online
            </span>
          </div>
        </>
      )}

      {/* User avatars */}
      {otherUsers.length > 0 && (
        <div className="flex -space-x-2 ml-2">
          {otherUsers.slice(0, 5).map((user) => (
            <div
              key={user.id}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-terminal-bg shadow-sm"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          ))}
          {otherUsers.length > 5 && (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center bg-terminal-text/20 text-terminal-text text-xs font-bold border-2 border-terminal-bg"
              title={`${otherUsers.length - 5} more users`}
            >
              +{otherUsers.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
