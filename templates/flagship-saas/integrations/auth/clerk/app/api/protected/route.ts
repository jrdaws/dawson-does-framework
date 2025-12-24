import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Protected API Route Example
 *
 * This demonstrates how to protect API routes with Clerk authentication.
 * The auth() function returns the user's authentication state.
 */
export async function GET() {
  try {
    // Get the user's authentication state
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to access this resource" },
        { status: 401 }
      );
    }

    // Optional: Get full user details if needed
    const user = await currentUser();

    // Return protected data
    return NextResponse.json({
      message: "This is protected data from a Clerk-authenticated API route",
      userId,
      email: user?.primaryEmailAddress?.emailAddress,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Protected API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Example POST endpoint with user-specific data
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Process the request with the authenticated user's ID
    // Example: Save data to database with userId
    console.log(`User ${userId} submitted:`, body);

    return NextResponse.json({
      success: true,
      message: "Data processed successfully",
      userId,
    });
  } catch (error: any) {
    console.error("Protected POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
