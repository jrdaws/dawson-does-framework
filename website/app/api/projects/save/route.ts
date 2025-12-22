import { NextRequest, NextResponse } from "next/server";
import { supabase, generateToken, CreateProjectInput } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limiter";
import { apiError, apiSuccess, ErrorCodes } from "@/lib/api-errors";

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
      return apiError(
        ErrorCodes.RATE_LIMITED,
        "Too many requests. Please try again later.",
        429,
        { resetAt: rateLimitResult.resetAt },
        "Wait until the rate limit resets or provide your own ANTHROPIC_API_KEY",
        corsHeaders
      );
    }

    const body: CreateProjectInput = await request.json();

    // Validate required fields
    if (!body.template) {
      return apiError(
        ErrorCodes.MISSING_FIELD,
        "Template is required",
        400,
        { field: "template" },
        "Provide a valid template in the request body (e.g., 'saas', 'seo-directory')",
        corsHeaders
      );
    }

    if (!body.project_name) {
      return apiError(
        ErrorCodes.MISSING_FIELD,
        "Project name is required",
        400,
        { field: "project_name" },
        "Provide a project_name in the request body",
        corsHeaders
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
      return apiError(
        ErrorCodes.TOKEN_GENERATION_FAILED,
        "Could not generate unique token",
        500,
        { attempts: maxAttempts },
        "Try again in a few moments",
        corsHeaders
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
      return apiError(
        ErrorCodes.DATABASE_ERROR,
        "Failed to save project",
        500,
        { message: error.message },
        "Try again or contact support if the issue persists",
        corsHeaders
      );
    }

    console.log(`[Project Saved] ${token} | ${body.template} | ${body.project_name}`);

    return apiSuccess(
      {
        token,
        expiresAt: expiresAt.toISOString(),
        pullCommand: `npx @jrdaws/framework pull ${token}`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/configure?project=${token}`,
        project: data,
      },
      201,
      corsHeaders
    );
  } catch (error: unknown) {
    console.error("[Project Save Error]", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return apiError(
      ErrorCodes.INTERNAL_ERROR,
      "Failed to save project",
      500,
      process.env.NODE_ENV === "development" ? { message: errorMessage } : undefined,
      "Try again or contact support if the issue persists",
      corsHeaders
    );
  }
}
