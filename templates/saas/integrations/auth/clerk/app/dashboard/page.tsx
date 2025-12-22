import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Protected Dashboard Page Example
 *
 * This demonstrates how to create a protected server component page with Clerk.
 * The middleware.ts file handles the redirect for unauthenticated users,
 * but you can also add server-side auth checks for additional security.
 */
export default async function DashboardPage() {
  // Get auth info - this will be populated because middleware protects this route
  const { userId } = await auth();

  // Optional: Add additional auth check (middleware already handles this)
  if (!userId) {
    redirect("/sign-in");
  }

  // Get full user object with profile data
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Protected Dashboard
          </h1>
          <p className="text-gray-600">
            This page is protected by Clerk authentication. Only authenticated users can access it.
          </p>
        </div>

        {/* User info card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            User Information
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">User ID:</span>
              <p className="text-gray-900 font-mono text-sm">{userId}</p>
            </div>

            {user?.primaryEmailAddress && (
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{user.primaryEmailAddress.emailAddress}</p>
              </div>
            )}

            {user?.firstName && (
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            )}

            <div>
              <span className="text-sm font-medium text-gray-500">Created At:</span>
              <p className="text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* API example card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Protected API Routes
          </h2>
          <p className="text-gray-600 mb-4">
            You can also protect API routes. See the example at{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              app/api/protected/route.ts
            </code>
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <pre className="text-sm text-gray-800">
{`// app/api/protected/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "This is protected data",
    userId
  });
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
