import { NextRequest, NextResponse } from "next/server";
import { supabase, Project } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limiter";

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
      return NextResponse.json(
        { error: "Validation failed", message: "Token is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Rate limiting: use IP or session identifier
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                     request.headers.get("x-real-ip") || 
                     "anonymous";
    
    const rateLimitResult = await checkRateLimit(`fetch:${clientIp}`);
    
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

    // Fetch project from database
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("token", token)
      .single();

    if (error) {
      // Check if it's a "not found" error
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Not found", message: `Project with token "${token}" not found` },
          { status: 404, headers: corsHeaders }
        );
      }

      console.error("[Project Fetch Error]", error);
      return NextResponse.json(
        { error: "Database error", message: "Failed to fetch project", details: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    // Check if project has expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: "Expired",
          message: `Project "${token}" has expired. Projects expire after 30 days. Please create a new project configuration.`,
          expiredAt: data.expires_at,
          helpUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/configure`,
        },
        { status: 410, headers: corsHeaders }
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

    return NextResponse.json(
      {
        success: true,
        project: data as Project,
      },
      { headers: corsHeaders }
    );
  } catch (error: unknown) {
    console.error("[Project Fetch Error]", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch project",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
