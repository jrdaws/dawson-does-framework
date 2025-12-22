import { NextRequest, NextResponse } from "next/server";
import { supabase, Project } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limiter";
import { apiError, apiSuccess, ErrorCodes } from "@/lib/api-errors";

// CORS headers for CLI access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return apiError(
        ErrorCodes.MISSING_FIELD,
        "Token is required",
        400,
        { field: "token" },
        "Provide a valid project token in the URL path",
        corsHeaders
      );
    }

    // Rate limiting: use IP or session identifier
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                     request.headers.get("x-real-ip") || 
                     "anonymous";
    
    const rateLimitResult = await checkRateLimit(`fetch:${clientIp}`);
    
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

    // Fetch project from database
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("token", token)
      .single();

    if (error) {
      // Check if it's a "not found" error
      if (error.code === "PGRST116") {
        return apiError(
          ErrorCodes.TOKEN_NOT_FOUND,
          `Project with token "${token}" not found`,
          404,
          { token },
          "Verify the token is correct or create a new project at the configurator",
          corsHeaders
        );
      }

      console.error("[Project Fetch Error]", error);
      return apiError(
        ErrorCodes.DATABASE_ERROR,
        "Failed to fetch project",
        500,
        { message: error.message },
        "Try again or contact support if the issue persists",
        corsHeaders
      );
    }

    // Check if project has expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      return apiError(
        ErrorCodes.TOKEN_EXPIRED,
        `Project "${token}" has expired. Projects expire after 30 days.`,
        410,
        {
          token,
          expiredAt: data.expires_at,
          helpUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/configure`
        },
        "Create a new project configuration at the configurator",
        corsHeaders
      );
    }

    // Update last_accessed_at timestamp
    const { error: updateError } = await supabase
      .from("projects")
      .update({ last_accessed_at: new Date().toISOString() })
      .eq("token", token);

    if (updateError) {
      // Log but don't fail the request - the access update is non-critical
      console.warn(`[Project Access Update Warning] ${token}:`, updateError.message);
    }

    console.log(`[Project Retrieved] ${token} | ${data.template} | ${data.project_name}`);

    const project = data as Project;
    return apiSuccess(
      {
        token: project.token,
        template: project.template,
        projectName: project.project_name,
        outputDir: project.output_dir,
        integrations: project.integrations,
        envKeys: project.env_keys || {},
        vision: project.vision,
        mission: project.mission,
        successCriteria: project.success_criteria,
        inspirations: project.inspirations,
        description: project.description,
        createdAt: project.created_at,
        expiresAt: project.expires_at,
      },
      200,
      corsHeaders
    );
  } catch (error: unknown) {
    console.error("[Project Fetch Error]", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return apiError(
      ErrorCodes.INTERNAL_ERROR,
      "Failed to fetch project",
      500,
      process.env.NODE_ENV === "development" ? { message: errorMessage } : undefined,
      "Try again or contact support if the issue persists",
      corsHeaders
    );
  }
}
