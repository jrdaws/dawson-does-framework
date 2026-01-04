import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/ai/openai";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, temperature, maxTokens } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt string is required" },
        { status: 400 }
      );
    }

    const content = await generateCompletion(prompt, {
      model,
      temperature,
      maxTokens,
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Completion API error:", error);
    
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("API key") ? 401 : 500;
    
    return NextResponse.json({ error: message }, { status });
  }
}

