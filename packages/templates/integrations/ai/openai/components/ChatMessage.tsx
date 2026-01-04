"use client";

import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Don't render system messages
  if (message.role === "system") {
    return null;
  }

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-sm">🤖</span>
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-2xl",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-sm text-primary-foreground">👤</span>
        </div>
      )}
    </div>
  );
}

