import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion, ChatMessage } from "@/lib/ai/openai";

export async function POST(request: NextRequest) {
  try {
    const { messages, model, temperature, maxTokens } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Validate message format
    const validMessages = messages.every(
      (m: ChatMessage) =>
        m.role && ["system", "user", "assistant"].includes(m.role) && m.content
    );

    if (!validMessages) {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    const response = await generateChatCompletion(messages, {
      model,
      temperature,
      maxTokens,
    });

    const content = response.choices[0]?.message?.content || "";

    return NextResponse.json({
      content,
      usage: response.usage,
      model: response.model,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("API key") ? 401 : 500;
    
    return NextResponse.json({ error: message }, { status });
  }
}

