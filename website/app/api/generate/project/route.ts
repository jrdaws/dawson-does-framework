import { NextRequest, NextResponse } from "next/server";
import { generateProject } from "@dawson-framework/ai-agent";
import { checkRateLimit, isRedisAvailable } from "@/lib/rate-limiter";
import crypto from "crypto";

type ModelTier = 'fast' | 'balanced' | 'quality';

interface GenerateProjectRequest {
  description: string;
  projectName?: string;
  template?: string;
  vision?: string;
  mission?: string;
  inspirations?: Array<{ type: string; value: string; preview?: string }>;
  userApiKey?: string;
  sessionId: string;
  seed?: number;
  modelTier?: ModelTier;
}

interface CacheEntry {
  result: any;
  generatedAt: string;
  expiresAt: number;
}

// In-memory cache for project generation results
const projectCache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Cost control
const MAX_INPUT_LENGTH = 10000;

/**
 * Generate cache key from request parameters
 */
function generateCacheKey(params: {
  description: string;
  projectName?: string;
  template?: string;
  vision?: string;
  mission?: string;
  seed?: number;
}): string {
  const keyData = JSON.stringify({
    description: params.description,
    projectName: params.projectName || "",
    template: params.template || "",
    vision: params.vision || "",
    mission: params.mission || "",
    seed: params.seed,
  });
  return crypto.createHash("sha256").update(keyData).digest("hex").slice(0, 16);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: GenerateProjectRequest = await request.json();
    const {
      description,
      projectName,
      template,
      vision,
      mission,
      inspirations,
      userApiKey,
      sessionId,
      seed,
      modelTier,
    } = body;

    // Validate required fields
    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Validation failed", message: "Description is required" },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Validation failed", message: "Session ID is required" },
        { status: 400 }
      );
    }

    // Cost control: Limit input size
    const descriptionLength = description.length;
    if (descriptionLength > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: "Input too long",
          message: `Description must be less than ${MAX_INPUT_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    // Check cache first (only for deterministic requests with seed)
    const cacheKey = generateCacheKey({
      description,
      projectName,
      template,
      vision,
      mission,
      seed,
    });

    const cachedResult = projectCache.get(cacheKey);
    if (cachedResult && cachedResult.expiresAt > Date.now()) {
      console.log(`[Project Cache Hit] ${Date.now() - startTime}ms`);
      return NextResponse.json({
        success: true,
        ...cachedResult.result,
        generatedAt: cachedResult.generatedAt,
        cached: true,
        remainingDemoGenerations: null,
      });
    }

    // Rate limiting check
    const rateLimitResult = await checkRateLimit(sessionId, userApiKey);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `You've reached the demo limit. Add your Anthropic API key for unlimited access.`,
          rateLimited: true,
          resetAt: rateLimitResult.resetAt,
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // Check API key availability
    const apiKey = userApiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "No API key available",
          message: "Please provide your Anthropic API key to generate projects.",
        },
        { status: 401 }
      );
    }

    // Validate modelTier if provided
    const validTiers: ModelTier[] = ['fast', 'balanced', 'quality'];
    const tier = modelTier && validTiers.includes(modelTier) ? modelTier : 'balanced';

    // Call AI agent package
    console.log(`[Project Generation] Starting for: ${projectName || "Untitled"} (tier: ${tier})`);

    const result = await generateProject(
      {
        description,
        projectName,
        template,
        vision,
        mission,
        inspirations: inspirations?.map(i => ({
          type: i.type as "url" | "image" | "figma",
          value: i.value,
          preview: i.preview,
        })),
      },
      { apiKey, modelTier: tier }
    );

    const generatedAt = new Date().toISOString();

    // Cache the result
    projectCache.set(cacheKey, {
      result: {
        intent: result.intent,
        architecture: result.architecture,
        files: result.code.files,
        integrationCode: result.code.integrationCode,
        cursorrules: result.context.cursorrules,
        startPrompt: result.context.startPrompt,
      },
      generatedAt,
      expiresAt: Date.now() + CACHE_TTL,
    });

    // Clean up old cache entries
    if (projectCache.size > 100) {
      const now = Date.now();
      for (const [key, entry] of projectCache.entries()) {
        if (entry.expiresAt < now) {
          projectCache.delete(key);
        }
      }
    }

    // Log success metrics
    const duration = Date.now() - startTime;
    console.log(
      `[Project Generated] ${projectName || "Untitled"} | ${duration}ms | Template: ${result.intent.suggestedTemplate} | Files: ${result.code.files.length} | Redis: ${isRedisAvailable()}`
    );

    return NextResponse.json({
      success: true,
      intent: result.intent,
      architecture: result.architecture,
      files: result.code.files,
      integrationCode: result.code.integrationCode,
      cursorrules: result.context.cursorrules,
      startPrompt: result.context.startPrompt,
      generatedAt,
      seed: seed || Date.now(),
      remainingDemoGenerations:
        rateLimitResult.remaining >= 0 ? rateLimitResult.remaining : null,
      redisEnabled: isRedisAvailable(),
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;

    // Enhanced error handling
    console.error(`[Project Generation Error] ${duration}ms`, error);

    // Handle AI agent errors specifically
    if (error?.code) {
      const statusCode = error.code.includes("429")
        ? 429
        : error.code.includes("401")
        ? 401
        : 500;

      return NextResponse.json(
        {
          error: error.code,
          message: error.message || "Project generation failed",
          retryable: error.retryable || false,
        },
        { status: statusCode }
      );
    }

    // Generic error handling
    const isDevelopment = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: "Generation failed",
        message: "Failed to generate project. Please try again.",
        details: isDevelopment ? error.message : undefined,
        stack: isDevelopment ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
