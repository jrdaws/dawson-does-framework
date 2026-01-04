"use client";

import { useState, useCallback } from "react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface UseChatOptions {
  systemPrompt?: string;
  apiEndpoint?: string;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    systemPrompt = "You are a helpful assistant.",
    apiEndpoint = "/api/ai/chat",
  } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      setIsLoading(true);
      setError(null);

      // Add user message immediately
      const userMessage: Message = { role: "user", content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              ...newMessages,
            ],
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to get response");
        }

        const data = await response.json();
        
        // Add assistant response
        const assistantMessage: Message = {
          role: "assistant",
          content: data.content,
        };
        setMessages([...newMessages, assistantMessage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, apiEndpoint, systemPrompt]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

