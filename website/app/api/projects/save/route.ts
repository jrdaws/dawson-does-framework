import { NextRequest, NextResponse } from "next/server";
import { supabase, generateToken, CreateProjectInput } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limiter";

// CORS headers for CLI access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: use IP or session identifier
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                     request.headers.get("x-real-ip") || 
                     "anonymous";
    
    const rateLimitResult = await checkRateLimit(`save:${clientIp}`);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded", 
          message: "Too many requests. Please try again later.",
          resetAt: rateLimitResult.resetAt,
        },
        { status: 429, headers: corsHeaders }
      );
    }

    const body: CreateProjectInput = await request.json();

    // Validate required fields
    if (!body.template) {
      return NextResponse.json(
        { error: "Validation failed", message: "Template is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!body.project_name) {
      return NextResponse.json(
        { error: "Validation failed", message: "Project name is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Generate unique token
    let token = generateToken();
    let attempts = 0;
    const maxAttempts = 5;

    // Ensure token is unique (retry if collision)
    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from("projects")
        .select("token")
        .eq("token", token)
        .single();

      if (!existing) break;

      token = generateToken();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: "Token generation failed", message: "Could not generate unique token" },
        { status: 500, headers: corsHeaders }
      );
    }

    // Calculate 30-day expiration
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Insert project into database
    const { data, error } = await supabase
      .from("projects")
      .insert({
        token,
        template: body.template,
        project_name: body.project_name,
        output_dir: body.output_dir || "./my-app",
        integrations: body.integrations || {},
        env_keys: body.env_keys || {},
        vision: body.vision,
        mission: body.mission,
        success_criteria: body.success_criteria,
        inspirations: body.inspirations || [],
        description: body.description,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        last_accessed_at: now.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[Project Save Error]", error);
      return NextResponse.json(
        { error: "Database error", message: "Failed to save project", details: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(`[Project Saved] ${token} | ${body.template} | ${body.project_name}`);

    return NextResponse.json(
      {
        success: true,
        token,
        project: data,
        pullCommand: `npx @jrdaws/framework pull ${token}`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/configure?project=${token}`,
        expiresAt: expiresAt.toISOString(),
      },
      { headers: corsHeaders }
    );
  } catch (error: unknown) {
    console.error("[Project Save Error]", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to save project",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
