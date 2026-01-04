"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 bg-muted/50 rounded-2xl p-2">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent resize-none border-0 focus:ring-0 focus:outline-none p-2 text-sm max-h-[200px]"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}

