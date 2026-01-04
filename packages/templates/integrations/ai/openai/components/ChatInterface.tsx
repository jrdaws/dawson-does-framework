"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";

interface ChatInterfaceProps {
  systemPrompt?: string;
  placeholder?: string;
  className?: string;
}

export function ChatInterface({
  systemPrompt = "You are a helpful assistant.",
  placeholder = "Type your message...",
  className = "",
}: ChatInterfaceProps) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
    systemPrompt,
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">AI Assistant</h2>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start a conversation...</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-pulse">●</div>
            <span>Thinking...</span>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <ChatInput
          onSend={sendMessage}
          placeholder={placeholder}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

