import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, isRedisAvailable } from "@/lib/rate-limiter";
import crypto from "crypto";

interface GeneratePreviewRequest {
  template: string;
  projectName?: string;
  integrations: Record<string, string>;
  inspirations: Array<{ type: string; value: string; preview?: string }>;
  description: string;
  vision?: string;
  mission?: string;
  userApiKey?: string;
  sessionId: string;
  seed?: number;
}

interface CacheEntry {
  html: string;
  components: string[];
  generatedAt: string;
  expiresAt: number;
}

// In-memory cache for preview results (production should use Redis)
const previewCache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Cost control: Maximum tokens to prevent runaway generations
const MAX_TOKENS = 4096;
const MAX_INPUT_LENGTH = 10000; // Prevent extremely long prompts

/**
 * Generate a cache key from request parameters
 */
function generateCacheKey(params: {
  template: string;
  projectName?: string;
  integrations: Record<string, string>;
  description: string;
  vision?: string;
  mission?: string;
  seed?: number;
}): string {
  const keyData = JSON.stringify({
    template: params.template,
    projectName: params.projectName || "",
    integrations: params.integrations,
    description: params.description,
    vision: params.vision || "",
    mission: params.mission || "",
    seed: params.seed,
  });
  return crypto.createHash("sha256").update(keyData).digest("hex").slice(0, 16);
}

/**
 * Extract component names from generated HTML
 */
function extractComponents(html: string): string[] {
  const components: string[] = [];
  
  // Look for common section patterns in the HTML
  if (/<(nav|header)/i.test(html)) components.push("Nav");
  if (/hero|jumbotron/i.test(html)) components.push("Hero");
  if (/features?(-section)?/i.test(html) || /feature-grid/i.test(html)) components.push("Features");
  if (/pricing/i.test(html)) components.push("Pricing");
  if (/testimonial/i.test(html)) components.push("Testimonials");
  if (/<footer/i.test(html)) components.push("Footer");
  if (/dashboard|metrics|stats/i.test(html)) components.push("Dashboard");
  if (/sign.?(in|up)|log.?(in|out)|auth/i.test(html)) components.push("Auth");
  if (/cart|checkout/i.test(html)) components.push("Cart");
  if (/product/i.test(html)) components.push("ProductGrid");
  if (/cta|call.?to.?action/i.test(html)) components.push("CTA");
  
  return components.length > 0 ? components : ["Hero", "Nav", "Footer"];
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: GeneratePreviewRequest = await request.json();
    const {
      template,
      projectName,
      integrations,
      inspirations,
      description,
      vision,
      mission,
      userApiKey,
      sessionId,
      seed,
    } = body;

    // Validate required fields
    if (!template) {
      return NextResponse.json(
        { error: "Validation failed", message: "Template is required" },
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
    const descriptionLength = description?.length || 0;
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
      template,
      projectName,
      integrations,
      description,
      vision,
      mission,
      seed,
    });

    const cachedResult = previewCache.get(cacheKey);
    if (cachedResult && cachedResult.expiresAt > Date.now()) {
      console.log(`[Preview Cache Hit] ${template} | ${Date.now() - startTime}ms`);
      return NextResponse.json({
        success: true,
        html: cachedResult.html,
        components: cachedResult.components,
        generatedAt: cachedResult.generatedAt,
        cached: true,
        remainingDemoGenerations: null, // Cache hit doesn't affect rate limit
      });
    }

    // Rate limiting check (uses Redis in production)
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

    // Initialize Anthropic client
    const apiKey = userApiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "No API key available",
          message: "Please provide your Anthropic API key to generate previews.",
        },
        { status: 401 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Construct system prompt
    const systemPrompt = buildSystemPrompt(template, integrations, projectName);

    // Construct user prompt
    const userPrompt = buildUserPrompt(
      template,
      integrations,
      inspirations,
      description,
      vision,
      mission,
      projectName
    );

    // Call Claude API - using claude-sonnet-4-20250514 (latest Sonnet model)
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: MAX_TOKENS,
      temperature: seed ? 0 : 0.3, // Deterministic if seed provided
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Extract HTML from response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response format from Claude");
    }

    const html = extractHtmlFromResponse(content.text);
    const components = extractComponents(html);
    const generatedAt = new Date().toISOString();

    // Cache the result
    previewCache.set(cacheKey, {
      html,
      components,
      generatedAt,
      expiresAt: Date.now() + CACHE_TTL,
    });

    // Clean up old cache entries periodically
    if (previewCache.size > 100) {
      const now = Date.now();
      for (const [key, entry] of previewCache.entries()) {
        if (entry.expiresAt < now) {
          previewCache.delete(key);
        }
      }
    }

    // Log success metrics (for monitoring)
    const duration = Date.now() - startTime;
    console.log(`[Preview Generated] ${template} | ${duration}ms | ${message.usage.input_tokens}/${message.usage.output_tokens} tokens | Redis: ${isRedisAvailable()}`);

    return NextResponse.json({
      success: true,
      html,
      components,
      generatedAt,
      seed: seed || Date.now(),
      usage: message.usage,
      remainingDemoGenerations: rateLimitResult.remaining >= 0 ? rateLimitResult.remaining : null,
      redisEnabled: isRedisAvailable(),
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;

    // Enhanced error handling with specific error types
    if (error?.status === 401) {
      console.error(`[API Error 401] Invalid API key | ${duration}ms`);
      return NextResponse.json(
        {
          error: "Invalid API key",
          message: "The API key provided is invalid. Please check your key and try again.",
          details: "Get a valid key from https://console.anthropic.com",
        },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      console.error(`[API Error 429] Anthropic rate limit | ${duration}ms`);
      return NextResponse.json(
        {
          error: "Anthropic rate limit exceeded",
          message: "Too many requests to Claude API. Please try again in a few moments.",
        },
        { status: 429 }
      );
    }

    if (error?.status === 400) {
      console.error(`[API Error 400] Bad request | ${duration}ms`, error.message);
      return NextResponse.json(
        {
          error: "Invalid request",
          message: error.message || "The request was invalid. Please check your inputs.",
        },
        { status: 400 }
      );
    }

    if (error?.status === 500 || error?.status === 503) {
      console.error(`[API Error ${error.status}] Anthropic service error | ${duration}ms`);
      return NextResponse.json(
        {
          error: "Service temporarily unavailable",
          message: "Claude API is temporarily unavailable. Please try again in a few moments.",
        },
        { status: 503 }
      );
    }

    // Generic error handling
    console.error(`[Preview Error] ${duration}ms`, error);

    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: "Generation failed",
        message: "Failed to generate preview. Please try again.",
        details: isDevelopment ? error.message : undefined,
        stack: isDevelopment ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(
  template: string,
  integrations: Record<string, string>,
  projectName?: string
): string {
  const integrationsDesc = Object.entries(integrations)
    .filter(([_, value]) => value)
    .map(([type, provider]) => `${type}: ${provider}`)
    .join(", ");

  return `You are an expert web designer creating preview mockups for dawson-does-framework projects.

FRAMEWORK CONTEXT:
- Framework: Next.js 15 with App Router, React 19, TypeScript
- Styling: Tailwind CSS with terminal aesthetic
- Template: ${template}
- Project Name: ${projectName || "My App"}
- Selected Integrations: ${integrationsDesc || "none"}

TERMINAL AESTHETIC:
- Background: #0a0e14 (dark terminal)
- Primary text: #00ff41 (matrix green)
- Accent: #00d9ff (cyan)
- Borders: green/cyan with glow effects
- Font: Monospace (JetBrains Mono style)
- Windows have terminal-style title bars with colored dots

YOUR TASK:
Generate a complete, self-contained HTML preview that demonstrates what the user's project will look like.

OUTPUT REQUIREMENTS:
1. Complete HTML document with <!DOCTYPE html>
2. Include Tailwind CSS via CDN
3. Inline all styles (no external stylesheets)
4. Use the terminal aesthetic consistently
5. Create realistic content that matches the template type
6. Show integration points visually (auth buttons, payment forms, etc.)
7. Make it visually impressive but maintain the terminal theme
8. Include navigation, hero section, and key features
9. Responsive design (mobile-friendly)
10. No JavaScript interactions needed (static preview)

OUTPUT FORMAT:
Return ONLY the HTML code, wrapped in a code block:

\`\`\`html
<!DOCTYPE html>
<html>
...
</html>
\`\`\`

Do not include explanations before or after the code.`;
}

function buildUserPrompt(
  template: string,
  integrations: Record<string, string>,
  inspirations: Array<{ type: string; value: string; preview?: string }>,
  description: string,
  vision?: string,
  mission?: string,
  projectName?: string
): string {
  let prompt = `Generate a preview for a ${template} project`;
  if (projectName) {
    prompt += ` called "${projectName}"`;
  }
  prompt += `.\n\n`;

  // Add vision/mission context for more relevant content
  if (vision || mission) {
    prompt += `PROJECT CONTEXT:\n`;
    if (vision) {
      prompt += `- Vision: ${vision}\n`;
    }
    if (mission) {
      prompt += `- Mission: ${mission}\n`;
    }
    prompt += `\nUse this context to generate relevant headlines, copy, and feature descriptions.\n\n`;
  }

  // Add integrations context
  const integrationsList = Object.entries(integrations)
    .filter(([_, value]) => value)
    .map(([type, provider]) => `- ${type}: ${provider}`)
    .join("\n");

  if (integrationsList) {
    prompt += `INTEGRATIONS TO SHOWCASE:\n${integrationsList}\n\n`;
    
    // Add specific guidance for key integrations
    if (integrations.auth) {
      prompt += `AUTH INTEGRATION (${integrations.auth}): Include login/signup buttons in the navigation and/or a dedicated authentication section.\n`;
    }
    if (integrations.payments) {
      prompt += `PAYMENTS INTEGRATION (${integrations.payments}): Include a pricing section with plan cards showing prices and features.\n`;
    }
    prompt += `\n`;
  }

  // Add inspirations
  if (inspirations.length > 0) {
    prompt += `USER INSPIRATIONS:\n`;
    inspirations.forEach((inspiration, idx) => {
      if (inspiration.type === "url") {
        prompt += `${idx + 1}. URL Reference: ${inspiration.value}\n`;
      } else if (inspiration.type === "image") {
        prompt += `${idx + 1}. Image: ${inspiration.value} (user uploaded design reference)\n`;
      } else if (inspiration.type === "figma") {
        prompt += `${idx + 1}. Figma Link: ${inspiration.value}\n`;
      }
    });
    prompt += `\n`;
  }

  // Add user description
  if (description?.trim()) {
    prompt += `USER DESCRIPTION:\n${description}\n\n`;
  }

  // Template-specific guidance
  prompt += getTemplateGuidance(template);

  prompt += `\nGenerate a visually stunning preview that incorporates these elements while maintaining the terminal aesthetic.`;

  return prompt;
}

function getTemplateGuidance(template: string): string {
  const guidance: Record<string, string> = {
    saas: `TEMPLATE GUIDANCE (SaaS Starter):
- Hero section with value proposition and terminal-styled CTA
- Features grid showcasing key capabilities
- Pricing cards with terminal window styling
- Sign-up/Login buttons (auth integration)
- Dashboard preview with metrics
- Footer with links`,

    ecommerce: `TEMPLATE GUIDANCE (E-commerce):
- Product catalog grid with terminal-styled cards
- Shopping cart icon with count
- Product detail view with "Add to Cart" button
- Payment/checkout section (Stripe integration visual)
- Category navigation
- Search bar with terminal aesthetic`,

    blog: `TEMPLATE GUIDANCE (Blog):
- Article list with terminal-styled post cards
- Post title, date, author, tags
- Featured post with larger display
- Sidebar with categories and recent posts
- Newsletter signup form (email integration visual)
- Syntax-highlighted code blocks`,

    dashboard: `TEMPLATE GUIDANCE (Dashboard):
- Metrics cards with terminal-styled stats
- Charts/graphs with terminal colors (green/cyan)
- Data tables with monospace font
- Sidebar navigation with icons
- Real-time data indicators
- Settings/profile section`,

    "api-backend": `TEMPLATE GUIDANCE (API Backend):
- API documentation page
- Endpoint list with terminal-styled cards
- Code examples in terminal windows
- Authentication section showing API keys
- Rate limiting info
- Response examples with JSON formatting`,

    directory: `TEMPLATE GUIDANCE (Directory):
- Listing grid with terminal-styled item cards
- Search and filter controls
- Category tags with terminal colors
- Detail view with specifications
- Submit/Add listing button
- Pagination controls`,
  };

  return guidance[template] || "Create an impressive landing page for this template type.";
}

function extractHtmlFromResponse(text: string): string {
  // Extract HTML from markdown code block
  const htmlMatch = text.match(/```html\n([\s\S]*?)\n```/);
  if (htmlMatch) {
    return htmlMatch[1].trim();
  }

  // Fallback: look for <!DOCTYPE or <html
  if (text.includes("<!DOCTYPE") || text.includes("<html")) {
    return text.trim();
  }

  throw new Error("Could not extract HTML from Claude's response");
}
